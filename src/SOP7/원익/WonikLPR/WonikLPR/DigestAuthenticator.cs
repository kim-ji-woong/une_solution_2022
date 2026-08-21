using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;

namespace WonikLPR
{
    /// <summary>
    /// HTTP Digest 인증 (RFC 7616 / RFC 2617) 처리.
    /// .NET Framework 내장 Digest 처리는 MD5만 지원하므로 직접 구현한다.
    /// 기본 해시는 SHA-256이며, 서버가 내려주는 algorithm 값에 따라 MD5 도 지원한다.
    /// </summary>
    public class DigestAuthenticator
    {
        private readonly string m_userId;
        private readonly string m_userPw;
        private readonly object m_lock = new object();

        private string m_realm = string.Empty;
        private string m_nonce = string.Empty;
        private string m_opaque = string.Empty;
        private string m_qop = string.Empty;
        private string m_algorithm = "SHA-256";
        private int m_nonceCount = 0;

        public DigestAuthenticator(string userId, string userPw)
        {
            m_userId = userId ?? string.Empty;
            m_userPw = userPw ?? string.Empty;
        }

        /// <summary>서버로부터 받은 challenge 보유 여부</summary>
        public bool HasChallenge
        {
            get
            {
                lock (m_lock)
                {
                    return string.IsNullOrEmpty(m_nonce) == false;
                }
            }
        }

        /// <summary>보유중인 challenge 폐기 (401 재수신시)</summary>
        public void Reset()
        {
            lock (m_lock)
            {
                m_nonce = string.Empty;
                m_nonceCount = 0;
            }
        }

        /// <summary>
        /// 401 응답의 WWW-Authenticate 헤더로 challenge 설정.
        /// </summary>
        /// <returns>Digest challenge 파싱 성공 여부</returns>
        public bool SetChallenge(string[] wwwAuthenticateHeaders)
        {
            string digestChallenge = FindDigestChallenge(wwwAuthenticateHeaders);
            if (digestChallenge == null)
            {
                return false;
            }

            Dictionary<string, string> values = ParseDirectives(digestChallenge);

            string nonce;
            if (values.TryGetValue("nonce", out nonce) == false || string.IsNullOrEmpty(nonce))
            {
                return false;
            }

            lock (m_lock)
            {
                m_nonce = nonce;
                m_realm = GetValue(values, "realm", string.Empty);
                m_opaque = GetValue(values, "opaque", null);
                m_algorithm = GetValue(values, "algorithm", "SHA-256");
                m_qop = SelectQop(GetValue(values, "qop", string.Empty));
                m_nonceCount = 0;
            }

            return true;
        }

        /// <summary>
        /// Authorization 헤더 값 생성. challenge 미보유시 null.
        /// </summary>
        /// <param name="method">HTTP 메소드 (GET)</param>
        /// <param name="digestUri">요청 URI (쿼리 스트링 포함한 PathAndQuery)</param>
        public string BuildAuthorizationHeader(string method, string digestUri)
        {
            lock (m_lock)
            {
                if (string.IsNullOrEmpty(m_nonce))
                {
                    return null;
                }

                m_nonceCount++;

                string nc = m_nonceCount.ToString("x8");
                string cnonce = CreateCnonce();
                bool isSession = m_algorithm.EndsWith("-sess", StringComparison.OrdinalIgnoreCase);

                string ha1 = Hash(m_userId + ":" + m_realm + ":" + m_userPw);
                if (isSession)
                {
                    ha1 = Hash(ha1 + ":" + m_nonce + ":" + cnonce);
                }

                string ha2 = Hash(method + ":" + digestUri);

                string response;
                if (string.IsNullOrEmpty(m_qop))
                {
                    response = Hash(ha1 + ":" + m_nonce + ":" + ha2);
                }
                else
                {
                    response = Hash(ha1 + ":" + m_nonce + ":" + nc + ":" + cnonce + ":" + m_qop + ":" + ha2);
                }

                StringBuilder sb = new StringBuilder();
                sb.Append("Digest ");
                sb.AppendFormat("username=\"{0}\"", m_userId);
                sb.AppendFormat(", realm=\"{0}\"", m_realm);
                sb.AppendFormat(", nonce=\"{0}\"", m_nonce);
                sb.AppendFormat(", uri=\"{0}\"", digestUri);
                sb.AppendFormat(", algorithm={0}", m_algorithm);
                sb.AppendFormat(", response=\"{0}\"", response);

                if (string.IsNullOrEmpty(m_qop) == false)
                {
                    sb.AppendFormat(", qop={0}", m_qop);
                    sb.AppendFormat(", nc={0}", nc);
                    sb.AppendFormat(", cnonce=\"{0}\"", cnonce);
                }

                if (string.IsNullOrEmpty(m_opaque) == false)
                {
                    sb.AppendFormat(", opaque=\"{0}\"", m_opaque);
                }

                return sb.ToString();
            }
        }

        /// <summary>
        /// WWW-Authenticate 헤더 목록에서 Digest scheme 부분만 추출.
        /// </summary>
        private static string FindDigestChallenge(string[] headers)
        {
            if (headers == null)
            {
                return null;
            }

            foreach (string header in headers)
            {
                if (string.IsNullOrEmpty(header))
                {
                    continue;
                }

                int index = header.IndexOf("Digest", StringComparison.OrdinalIgnoreCase);
                if (index < 0)
                {
                    continue;
                }

                // "Basic realm=..., Digest realm=..." 처럼 합쳐져 오는 경우 Digest 이후만 사용
                return header.Substring(index + "Digest".Length);
            }

            return null;
        }

        /// <summary>
        /// key=value / key="value" 형태의 directive 파싱. 따옴표 안의 콤마는 구분자로 보지 않는다.
        /// </summary>
        private static Dictionary<string, string> ParseDirectives(string challenge)
        {
            Dictionary<string, string> result =
                new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

            int position = 0;
            while (position < challenge.Length)
            {
                // key
                while (position < challenge.Length &&
                       (char.IsWhiteSpace(challenge[position]) || challenge[position] == ','))
                {
                    position++;
                }

                int keyStart = position;
                while (position < challenge.Length && challenge[position] != '=' && challenge[position] != ',')
                {
                    position++;
                }

                if (position >= challenge.Length || challenge[position] != '=')
                {
                    break;
                }

                string key = challenge.Substring(keyStart, position - keyStart).Trim();
                position++;   // '=' 건너뜀

                // value
                string value;
                if (position < challenge.Length && challenge[position] == '"')
                {
                    position++;   // 여는 따옴표 건너뜀
                    StringBuilder sb = new StringBuilder();
                    while (position < challenge.Length && challenge[position] != '"')
                    {
                        if (challenge[position] == '\\' && position + 1 < challenge.Length)
                        {
                            position++;
                        }

                        sb.Append(challenge[position]);
                        position++;
                    }

                    position++;   // 닫는 따옴표 건너뜀
                    value = sb.ToString();
                }
                else
                {
                    int valueStart = position;
                    while (position < challenge.Length && challenge[position] != ',')
                    {
                        position++;
                    }

                    value = challenge.Substring(valueStart, position - valueStart).Trim();
                }

                if (key.Length > 0 && result.ContainsKey(key) == false)
                {
                    result.Add(key, value);
                }
            }

            return result;
        }

        /// <summary>qop 목록("auth,auth-int")중 auth 우선 선택</summary>
        private static string SelectQop(string qop)
        {
            if (string.IsNullOrEmpty(qop))
            {
                return string.Empty;
            }

            string[] tokens = qop.Split(',');
            foreach (string token in tokens)
            {
                if (string.Equals(token.Trim(), "auth", StringComparison.OrdinalIgnoreCase))
                {
                    return "auth";
                }
            }

            // auth-int 는 미지원. qop 없이 계산한다.
            return string.Empty;
        }

        private static string GetValue(Dictionary<string, string> values, string key, string defaultValue)
        {
            string value;
            if (values.TryGetValue(key, out value) == false || string.IsNullOrEmpty(value))
            {
                return defaultValue;
            }

            return value;
        }

        private static string CreateCnonce()
        {
            byte[] buffer = new byte[8];
            using (RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider())
            {
                rng.GetBytes(buffer);
            }

            return ToHex(buffer);
        }

        private string Hash(string value)
        {
            byte[] bytes = Encoding.UTF8.GetBytes(value);

            using (HashAlgorithm algorithm = CreateHashAlgorithm())
            {
                return ToHex(algorithm.ComputeHash(bytes));
            }
        }

        private HashAlgorithm CreateHashAlgorithm()
        {
            string name = m_algorithm ?? string.Empty;

            // "-sess" 접미사 제거
            int index = name.IndexOf("-sess", StringComparison.OrdinalIgnoreCase);
            if (index >= 0)
            {
                name = name.Substring(0, index);
            }

            if (string.Equals(name, "MD5", StringComparison.OrdinalIgnoreCase))
            {
                return MD5.Create();
            }

            if (string.Equals(name, "SHA-512-256", StringComparison.OrdinalIgnoreCase))
            {
                return new Sha512Truncated256();
            }

            // 기본값 SHA-256
            return SHA256.Create();
        }

        private static string ToHex(byte[] bytes)
        {
            StringBuilder sb = new StringBuilder(bytes.Length * 2);
            foreach (byte b in bytes)
            {
                sb.Append(b.ToString("x2"));
            }

            return sb.ToString();
        }

        /// <summary>
        /// SHA-512-256 (SHA-512 결과의 상위 256비트). RFC 7616 정의 알고리즘.
        /// </summary>
        private class Sha512Truncated256 : HashAlgorithm
        {
            private readonly SHA512 m_sha512 = SHA512.Create();

            public override void Initialize()
            {
                m_sha512.Initialize();
            }

            protected override void HashCore(byte[] array, int ibStart, int cbSize)
            {
                m_sha512.TransformBlock(array, ibStart, cbSize, null, 0);
            }

            protected override byte[] HashFinal()
            {
                m_sha512.TransformFinalBlock(new byte[0], 0, 0);

                byte[] truncated = new byte[32];
                Array.Copy(m_sha512.Hash, truncated, 32);

                return truncated;
            }

            protected override void Dispose(bool disposing)
            {
                if (disposing)
                {
                    m_sha512.Dispose();
                }

                base.Dispose(disposing);
            }
        }
    }
}
