using System;
using System.Collections.Generic;
using System.Globalization;
using System.Security.Cryptography;
using System.Text;

namespace WonikBeaconServer.SpeedDetection
{
    /// <summary>
    /// 서버가 내려준 WWW-Authenticate 챌린지를 해석해 Authorization 헤더 값을 만든다.
    /// Digest(MD5, MD5-sess, SHA-256, SHA-256-sess / qop=auth) 와 Basic 을 지원한다.
    ///
    /// ref\PostBoy\PostBoy\HttpDigest.cs 를 이식한 것이다.
    /// .NET 5 에 맞춰 난수 생성만 RandomNumberGenerator.Fill 로 바꿨다.
    /// (.NET 기본 Digest 핸들러는 MD5 만 지원해 SHA-256 장비에 붙지 않으므로 직접 만든다.)
    /// </summary>
    internal static class HttpDigest
    {
        // nc 는 "그 nonce 로 보낸 요청 수"다. nonce 가 새로 오면 반드시 1 부터 시작해야 하므로
        // 전역 카운터가 아니라 nonce 별로 따로 센다. (nc 가 1 이 아니면 거부하는 장비가 있다)
        private static readonly Dictionary<string, int> _nonceCounts = new Dictionary<string, int>(StringComparer.Ordinal);
        private static readonly object _nonceLock = new object();

        /// <summary>
        /// 응답 헤더의 챌린지 하나를 받아 Authorization 헤더 값을 만든다.
        /// 지원하지 않는 인증 방식이면 null 을 돌려준다.
        /// </summary>
        public static string CreateAuthorization(string scheme, string parameter, string method, Uri uri, string user, string password)
        {
            if (string.IsNullOrEmpty(scheme)) return null;

            if (string.Equals(scheme, "Basic", StringComparison.OrdinalIgnoreCase))
                return CreateBasic(user, password);

            if (!string.Equals(scheme, "Digest", StringComparison.OrdinalIgnoreCase))
                return null;

            var p = ParseParameters(parameter);
            string realm = Get(p, "realm") ?? string.Empty;
            string nonce = Get(p, "nonce");
            string opaque = Get(p, "opaque");
            string algorithm = Get(p, "algorithm");
            string qop = SelectQop(Get(p, "qop"));

            if (string.IsNullOrEmpty(nonce)) return null;
            if (string.IsNullOrEmpty(algorithm)) algorithm = "MD5";

            bool sess = algorithm.EndsWith("-sess", StringComparison.OrdinalIgnoreCase);
            string hashName = sess ? algorithm.Substring(0, algorithm.Length - 5) : algorithm;

            string requestUri = uri.PathAndQuery;
            string cnonce = null;
            string nc = null;

            string ha1 = Hash(hashName, user + ":" + realm + ":" + password);
            if (sess)
            {
                cnonce = NewCnonce();
                ha1 = Hash(hashName, ha1 + ":" + nonce + ":" + cnonce);
            }
            string ha2 = Hash(hashName, method + ":" + requestUri);

            string response;
            if (qop != null)
            {
                if (cnonce == null) cnonce = NewCnonce();
                nc = NextNonceCount(nonce);
                response = Hash(hashName, string.Join(":", ha1, nonce, nc, cnonce, qop, ha2));
            }
            else
            {
                response = Hash(hashName, ha1 + ":" + nonce + ":" + ha2);
            }

            var sb = new StringBuilder("Digest ");
            sb.Append("username=\"").Append(Escape(user)).Append("\"");
            sb.Append(", realm=\"").Append(Escape(realm)).Append("\"");
            sb.Append(", nonce=\"").Append(nonce).Append("\"");
            sb.Append(", uri=\"").Append(requestUri).Append("\"");
            sb.Append(", algorithm=").Append(algorithm);
            if (qop != null)
            {
                sb.Append(", qop=").Append(qop);
                sb.Append(", nc=").Append(nc);
            }
            if (cnonce != null) sb.Append(", cnonce=\"").Append(cnonce).Append("\"");
            sb.Append(", response=\"").Append(response).Append("\"");
            if (!string.IsNullOrEmpty(opaque)) sb.Append(", opaque=\"").Append(opaque).Append("\"");
            return sb.ToString();
        }

        public static string CreateBasic(string user, string password)
        {
            string raw = (user ?? string.Empty) + ":" + (password ?? string.Empty);
            return "Basic " + Convert.ToBase64String(Encoding.UTF8.GetBytes(raw));
        }

        /// <summary>서버가 제시한 qop 목록 중 지원 가능한 것을 고른다. (auth 만 지원)</summary>
        private static string SelectQop(string qopHeader)
        {
            if (string.IsNullOrEmpty(qopHeader)) return null;
            foreach (var token in qopHeader.Split(','))
            {
                if (string.Equals(token.Trim(), "auth", StringComparison.OrdinalIgnoreCase))
                    return "auth";
            }
            return null; // auth-int 등은 미지원 -> qop 없는(RFC2069) 방식으로 계산
        }

        /// <summary>name=value 또는 name="value" 목록을 해석한다. 따옴표 안의 쉼표는 구분자로 보지 않는다.</summary>
        private static Dictionary<string, string> ParseParameters(string parameter)
        {
            var map = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
            if (string.IsNullOrEmpty(parameter)) return map;

            int i = 0;
            while (i < parameter.Length)
            {
                while (i < parameter.Length && (parameter[i] == ',' || char.IsWhiteSpace(parameter[i]))) i++;
                if (i >= parameter.Length) break;

                int nameStart = i;
                while (i < parameter.Length && parameter[i] != '=' && parameter[i] != ',') i++;
                string name = parameter.Substring(nameStart, i - nameStart).Trim();

                if (i >= parameter.Length || parameter[i] != '=')
                {
                    if (name.Length > 0) map[name] = string.Empty;
                    continue;
                }

                i++; // '=' 건너뛰기
                while (i < parameter.Length && char.IsWhiteSpace(parameter[i])) i++;

                string value;
                if (i < parameter.Length && parameter[i] == '"')
                {
                    i++;
                    var sb = new StringBuilder();
                    while (i < parameter.Length && parameter[i] != '"')
                    {
                        if (parameter[i] == '\\' && i + 1 < parameter.Length) i++;
                        sb.Append(parameter[i]);
                        i++;
                    }
                    if (i < parameter.Length) i++; // 닫는 따옴표
                    value = sb.ToString();
                }
                else
                {
                    int valueStart = i;
                    while (i < parameter.Length && parameter[i] != ',') i++;
                    value = parameter.Substring(valueStart, i - valueStart).Trim();
                }

                if (name.Length > 0) map[name] = value;
            }
            return map;
        }

        private static string Get(Dictionary<string, string> map, string key)
        {
            string value;
            return map.TryGetValue(key, out value) ? value : null;
        }

        private static string Hash(string algorithm, string text)
        {
            byte[] bytes = Encoding.UTF8.GetBytes(text);
            byte[] hash;

            if (algorithm.IndexOf("SHA", StringComparison.OrdinalIgnoreCase) >= 0)
            {
                using (var sha = SHA256.Create()) hash = sha.ComputeHash(bytes);
            }
            else
            {
                using (var md5 = MD5.Create()) hash = md5.ComputeHash(bytes);
            }

            var sb = new StringBuilder(hash.Length * 2);
            foreach (byte b in hash) sb.Append(b.ToString("x2", CultureInfo.InvariantCulture));
            return sb.ToString();
        }

        private static string NewCnonce()
        {
            var buffer = new byte[8];
            RandomNumberGenerator.Fill(buffer);

            var sb = new StringBuilder(16);
            foreach (byte b in buffer) sb.Append(b.ToString("x2", CultureInfo.InvariantCulture));
            return sb.ToString();
        }

        /// <summary>해당 nonce 로 보내는 몇 번째 요청인지 돌려준다. 새 nonce 면 00000001 부터 시작한다.</summary>
        private static string NextNonceCount(string nonce)
        {
            lock (_nonceLock)
            {
                int value;
                if (!_nonceCounts.TryGetValue(nonce, out value)) value = 0;
                value++;

                // 오래 켜 두어도 무한히 쌓이지 않도록 적당히 비운다.
                if (_nonceCounts.Count > 64) _nonceCounts.Clear();

                _nonceCounts[nonce] = value;
                return value.ToString("x8", CultureInfo.InvariantCulture);
            }
        }

        private static string Escape(string value)
        {
            if (string.IsNullOrEmpty(value)) return string.Empty;
            return value.Replace("\\", "\\\\").Replace("\"", "\\\"");
        }
    }
}
