using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace WonikStreamProxy
{
    /// <summary>
    /// 공유 비밀키(HMAC-SHA256) 기반 JWT 검증.
    ///   WebSOPApp 의 WebSOPApp.Security.JwtHmac.Create(...) 가 만든 토큰과 호환된다.
    ///   (alg=HS256, base64url(header).base64url(payload).base64url(sig), 클레임 iss/aud/exp)
    ///   외부 인증 패키지 없이 BCL + System.Text.Json 만 사용.
    /// </summary>
    public static class JwtValidator
    {
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
                using JsonDocument doc = JsonDocument.Parse(payloadJson);
                JsonElement root = doc.RootElement;

                if (!string.IsNullOrEmpty(issuer))
                {
                    if (!root.TryGetProperty("iss", out JsonElement iss) || iss.GetString() != issuer)
                    { error = "bad issuer"; return false; }
                }

                if (!string.IsNullOrEmpty(audience))
                {
                    if (!root.TryGetProperty("aud", out JsonElement aud) || aud.GetString() != audience)
                    { error = "bad audience"; return false; }
                }

                long exp = root.TryGetProperty("exp", out JsonElement e) ? e.GetInt64() : 0;
                if (DateTimeOffset.UtcNow.ToUnixTimeSeconds() > exp) { error = "expired"; return false; }

                return true;
            }
            catch (Exception ex)
            {
                error = ex.Message;
                return false;
            }
        }

        private static byte[] HmacSha256(string input, string secret)
        {
            using HMACSHA256 hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secret ?? ""));
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
