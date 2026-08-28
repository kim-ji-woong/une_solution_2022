using System;
using System.Security.Cryptography;
using System.Text;
using Newtonsoft.Json.Linq;

namespace WonikBeaconServer.Security
{
    /// <summary>
    /// 공유 비밀키(HMAC-SHA256) 기반의 최소 JWT 생성/검증 유틸.
    ///   - 표준 JWT(alg=HS256) 형식과 호환된다.
    ///   - 외부 인증 패키지 없이 BCL 암호화 + Newtonsoft.Json 만 사용한다.
    ///   - WebSOPApp 로그인 시 동일한 비밀키로 토큰을 발급하고, 여기서 검증한다.
    /// </summary>
    public static class JwtHmac
    {
        /// <summary>토큰 발급. (검증측/발급측이 같은 로직을 쓰도록 함께 둔다)</summary>
        public static string Create(string secret, string issuer, string audience, string subject, int expireMinutes)
        {
            long now = DateTimeOffset.UtcNow.ToUnixTimeSeconds();

            JObject header = new JObject { ["alg"] = "HS256", ["typ"] = "JWT" };
            JObject payload = new JObject
            {
                ["iss"] = issuer,
                ["aud"] = audience,
                ["sub"] = subject ?? "",
                ["iat"] = now,
                ["exp"] = now + (long)expireMinutes * 60
            };

            string h = Base64UrlEncode(Encoding.UTF8.GetBytes(header.ToString(Newtonsoft.Json.Formatting.None)));
            string p = Base64UrlEncode(Encoding.UTF8.GetBytes(payload.ToString(Newtonsoft.Json.Formatting.None)));
            string signingInput = h + "." + p;
            string sig = Base64UrlEncode(HmacSha256(signingInput, secret));

            return signingInput + "." + sig;
        }

        /// <summary>서명/발급자/오디언스/만료를 확인한다. 유효하면 true.</summary>
        public static bool Validate(string token, string secret, string issuer, string audience, out string error)
        {
            error = null;
            try
            {
                if (string.IsNullOrEmpty(token)) { error = "no token"; return false; }

                string[] parts = token.Split('.');
                if (parts.Length != 3) { error = "malformed"; return false; }

                string signingInput = parts[0] + "." + parts[1];
                string expectedSig = Base64UrlEncode(HmacSha256(signingInput, secret));
                if (!FixedTimeEquals(expectedSig, parts[2])) { error = "bad signature"; return false; }

                string payloadJson = Encoding.UTF8.GetString(Base64UrlDecode(parts[1]));
                JObject payload = JObject.Parse(payloadJson);

                if (!string.IsNullOrEmpty(issuer) && (string)payload["iss"] != issuer) { error = "bad issuer"; return false; }
                if (!string.IsNullOrEmpty(audience) && (string)payload["aud"] != audience) { error = "bad audience"; return false; }

                long exp = payload["exp"] != null ? (long)payload["exp"] : 0;
                if (DateTimeOffset.UtcNow.ToUnixTimeSeconds() > exp) { error = "expired"; return false; }

                return true;
            }
            catch (Exception e)
            {
                error = e.Message;
                return false;
            }
        }

        private static byte[] HmacSha256(string input, string secret)
        {
            using (HMACSHA256 hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secret ?? "")))
                return hmac.ComputeHash(Encoding.UTF8.GetBytes(input));
        }

        private static string Base64UrlEncode(byte[] bytes)
        {
            return Convert.ToBase64String(bytes).TrimEnd('=').Replace('+', '-').Replace('/', '_');
        }

        private static byte[] Base64UrlDecode(string input)
        {
            string s = input.Replace('-', '+').Replace('_', '/');
            switch (s.Length % 4)
            {
                case 2: s += "=="; break;
                case 3: s += "="; break;
            }
            return Convert.FromBase64String(s);
        }

        private static bool FixedTimeEquals(string a, string b)
        {
            if (a == null || b == null || a.Length != b.Length) return false;
            int diff = 0;
            for (int i = 0; i < a.Length; i++) diff |= a[i] ^ b[i];
            return diff == 0;
        }
    }
}
