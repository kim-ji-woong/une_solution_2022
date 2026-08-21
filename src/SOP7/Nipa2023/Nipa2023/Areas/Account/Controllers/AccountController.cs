using Microsoft.AspNetCore.Mvc;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Nipa.BLL;
using Nipa.BLL.Models.Request;
using Nipa.BLL.Models.Response;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace Nipa2023.Areas.api.Controllers
{
    /// <summary>
    /// 계정관리를 위한 API
    /// </summary>
    [EnableCors("UnEPolicy")]
    [Area("Account")]
    public class AccountController : Controller
    {
        private ProcessManager m_processManager = null;

        private class AesHelper
        {
            private const int KeySize = 32;

            private static char[] BaseArr = MakeBaseArray();

            private static char[] MakeBaseArray()
            {
                char[] arr = new char[62];
                int i = 0;

                for (char ch = '0'; ch <= '9'; ch++)
                {
                    arr[i++] = ch;
                }

                for (char ch = 'a'; ch <= 'z'; ch++)
                {
                    arr[i++] = ch;
                }

                for (char ch = 'A'; ch <= 'Z'; ch++)
                {
                    arr[i++] = ch;
                }

                return arr;
            }

            public static string MakeRandomKey(long? num)
            {
                string strKey = "";
                int max = BaseArr.Length - 1;

                int seed = num == null ? DateTime.Now.GetHashCode() : (int)num;
                Random rand = new Random(seed);

                for (int i = 0; i < KeySize; i++)
                {
                    int nIndex = rand.Next(max);
                    strKey += BaseArr[nIndex];
                }

                return strKey;
            }

            /// <summary>  
            /// AES encryption algorithm  
            /// </summary>  
            /// <param name="input">plain string</param>  
            /// <param name="key">key (32 bit)</param>  

            public static string Encrypt(string input, string key)
            {
                byte[] keyBytes = System.Text.Encoding.UTF8.GetBytes(key.Substring(0, 32));
                using (System.Security.Cryptography.AesCryptoServiceProvider aesAlg = new System.Security.Cryptography.AesCryptoServiceProvider())
                {
                    aesAlg.Key = keyBytes;
                    aesAlg.IV = System.Text.Encoding.UTF8.GetBytes(key.Substring(0, 16));

                    System.Security.Cryptography.ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);
                    using (System.IO.MemoryStream msEncrypt = new System.IO.MemoryStream())
                    {
                        using (System.Security.Cryptography.CryptoStream csEncrypt = new System.Security.Cryptography.CryptoStream(msEncrypt, encryptor, System.Security.Cryptography.CryptoStreamMode.Write))
                        {
                            using (System.IO.StreamWriter swEncrypt = new System.IO.StreamWriter(csEncrypt))
                            {
                                swEncrypt.Write(input);
                            }
                            byte[] bytes = msEncrypt.ToArray();
                            return ByteArrayToHexString(bytes);
                        }
                    }
                }
            }

            /// <summary>  
            /// AES decryption  
            /// </summary>  
            /// <param name="input"> ciphertext byte array</param>  
            /// <param name="key">key (32 bit)</param>  
            /// <returns> returns the decrypted string</returns>  
            public static string Decrypt(string input, string key)
            {
                byte[] inputBytes = HexStringToByteArray(input);
                byte[] keyBytes = System.Text.Encoding.UTF8.GetBytes(key.Substring(0, 32));
                using (System.Security.Cryptography.AesCryptoServiceProvider aesAlg = new System.Security.Cryptography.AesCryptoServiceProvider())
                {
                    aesAlg.Key = keyBytes;
                    aesAlg.IV = System.Text.Encoding.UTF8.GetBytes(key.Substring(0, 16));

                    System.Security.Cryptography.ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);
                    using (System.IO.MemoryStream msEncrypt = new System.IO.MemoryStream(inputBytes))
                    {
                        using (System.Security.Cryptography.CryptoStream csEncrypt = new System.Security.Cryptography.CryptoStream(msEncrypt, decryptor, System.Security.Cryptography.CryptoStreamMode.Read))
                        {
                            using (System.IO.StreamReader srEncrypt = new System.IO.StreamReader(csEncrypt))
                            {
                                return srEncrypt.ReadToEnd();
                            }
                        }
                    }
                }
            }

            public static string GetHashCode(string input)
            {
                byte[] bytes = System.Text.Encoding.UTF8.GetBytes(input);
                byte[] hashed = System.Security.Cryptography.SHA256.Create().ComputeHash(bytes);

                string strHashed = "";

                foreach (byte b in hashed)
                {
                    strHashed += string.Format("{0:x2}", b);
                }

                return strHashed;
            }

            /// <summary>
            /// Convert the specified hex string to a byte array
            /// </summary>
            /// <param name="s">hexadecimal string (eg "7F 2C 4A" or "7F2C4A")</param>
            /// <returns>byte array corresponding to hexadecimal string</returns>
            public static byte[] HexStringToByteArray(string s)
            {
                s = s.Replace(" ", "");
                byte[] buffer = new byte[s.Length / 2];
                for (int i = 0; i < s.Length; i += 2)
                    buffer[i / 2] = (byte)Convert.ToByte(s.Substring(i, 2), 16);
                return buffer;
            }

            /// <summary>
            /// Convert a byte array into a formatted hex string
            /// </summary>
            /// <param name="data">byte array</param>
            /// <returns> formatted hexadecimal string</returns>
            public static string ByteArrayToHexString(byte[] data)
            {
                System.Text.StringBuilder sb = new System.Text.StringBuilder(data.Length * 3);
                foreach (byte b in data)
                {
                    //hexadecimal number
                    sb.Append(Convert.ToString(b, 16).PadLeft(2, '0'));
                    //16 digits separated by spaces
                    //sb.Append(Convert.ToString(b, 16).PadLeft(2, '0').PadRight(3, ' '));
                }
                return sb.ToString().ToUpper();
            }
        }

        public AccountController(IDataManager dataManager)
        {
            m_processManager = new ProcessManager(dataManager);
        }

        /// <summary>
        /// 로그인을 위한 임시키 발급 요청
        /// </summary>
        /// <param name="num">임의의 난수값</param>
        /// <returns></returns>
        [HttpGet]
        [Route("/Account/Account/GetLoginKey")]
        [ProducesResponseType(typeof(string), 200)]
        public string GetLoginKey(long num)
        {
            string strKey = AesHelper.MakeRandomKey(num);
            return strKey;
        }

        /// <summary>
        /// 암호화를 위한 랜덤키 요청
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "userID": "jamesdean"   // 로그인할 사용자 아이디
        /// }
        /// </remarks>
        [HttpPost]
        [Route("/Account/Account/RequestLoginKey")]
        [ProducesResponseType(typeof(ResponseLoginKey), 200)]
        public IActionResult RequestLoginKey([FromBody] RequestLoginKey data)
        {
            if (data == null)
                return BadRequest();

            ResponseLoginKey result = new ResponseLoginKey();
            bool isExternalLogin = IsExternalLogin();

            string strErrorMessage = null;
            string strSalt = isExternalLogin ? "abc" : m_processManager.AccountManager.RequestSalt(data, out strErrorMessage);

            if (strSalt == null || strSalt.Length == 0)
            {
                result.Success = false;
                result.Salt = "";
                result.ExternalLogin = isExternalLogin;

                if (strErrorMessage != null)
                    result.Message = strErrorMessage;
                else
                    result.Message = AccountManager.LoginFailMessage;
            }
            else
            {
                result.Success = true;
                result.Salt = strSalt;
                result.LoginKey = GetLoginKey((int)data.Num);
                result.ExternalLogin = isExternalLogin;
                result.Message = "";
            }

            return Ok(result);
        }

        private bool IsExternalLogin()
        {
            var siteOption = Startup.ConfigManager.Site;

            if (siteOption != null)
            {
                if (siteOption.ExternalLogin != null && siteOption.ExternalLogin.Length > 0)
                    return true;
            }

            return false;
        }

        /// <summary>
        /// 로그인
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "key": "asdfefda",              // 암호화시 사용된 랜덤키
        ///     "value": "adf;aliksdfjadf"      // 암호화된 계정 정보
        /// }
        /// </remarks>
        [HttpPost]
        [Route("/Account/Account/Login")]
        [ProducesResponseType(typeof(LoginResult), 200)]        
        public async Task<IActionResult> Login([FromBody] LoginData data)
        {
            if (data == null)
                return BadRequest();

            LoginResult result = null;

            if (data.Value != "" && data.Key != "")
            {
                try
                {
                    string str = AesHelper.Decrypt(data.Value, data.Key);

                    int nIndex = str.IndexOf('|');

                    if (nIndex > 0)
                    {
                        string strID = str.Substring(0, nIndex).Trim();
                        string strPW = str.Substring(nIndex + 1).Trim();

                        // TODO: Config 파일에서 자동로그인 여부 확인 (추후에 로그인 페이지에 자동로그인 체크박스 값을 이용)
                        bool autoLogin = true;
                        var siteOption = Startup.ConfigManager.Site;

                        if (siteOption.AutoLogin != null &&
                            siteOption.AutoLogin == false)
                            autoLogin = false;

                        result = m_processManager.AccountManager.Login(strID, strPW, data.Key, siteOption.ExternalLogin, siteOption.ExternalSiteID, autoLogin);

                        if (result.Success)
                        {
                            result.Message = "로그인에 성공하였습니다.";

                            List<Claim> claims = null;

                            if (result.User != null)
                            {
                                result.User.Options = siteOption;

                                claims = new List<Claim>
                                {
                                    new Claim(ClaimTypes.Name, result.User.Name),
                                    new Claim(ClaimTypes.Role, "Administrator"),
                                    new Claim(ClaimTypes.Sid, result.User.ID.ToString()),
                                };
                            }
                            else
                            {
                                claims = new List<Claim>
                                {
                                    new Claim(ClaimTypes.Name, result.User.Name),
                                    new Claim(ClaimTypes.Role, "Administrator"),
                                };
                            }

                            var claimsIdentity = new ClaimsIdentity(
                                claims, CookieAuthenticationDefaults.AuthenticationScheme);

                            var authProperties = new AuthenticationProperties();
                            var claimPrincipal = new ClaimsPrincipal(claimsIdentity);

                            await HttpContext.SignInAsync(
                                CookieAuthenticationDefaults.AuthenticationScheme,
                                claimPrincipal,
                                authProperties);

                            HttpContext.User = claimPrincipal;
                        }
                    }
                    else
                    {
                        result = new LoginResult();
                        result.Success = false;
                    }
                }
                catch (Exception e)
                {
                    result = new LoginResult();
                    result.Message = e.Message;
                    result.Success = false;
                }
            }
            else
            {
                result = new LoginResult();
                result.Success = false;
            }

            return Ok(result);
        }

        /// <summary>
        /// 로그아웃
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("/Account/Account/Logout")]
        [ProducesResponseType(typeof(MessageResult), 200)]
        public async Task<IActionResult> Logout()
        {
            MessageResult result = null;

            try
            {
                await HttpContext.SignOutAsync();
                result = new MessageResult(true, "");
            }
            catch (Exception e)
            {
                result = new MessageResult(false, e.Message);
            }

            return Ok(result);
        }

        /// <summary>
        /// 세션의 유효성 검증
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "userID": 2,                        // 로그인한 사용자의 ID
        ///     "sessionKey": "adf;aliksdfjadf"     // 로그인시 전달받은 세션키
        /// }
        /// </remarks>
        [HttpPost]
        [Route("/Account/Account/CheckLoginSession")]
        [ProducesResponseType(typeof(LoginResult), 200)]
        public IActionResult CheckLoginSession([FromBody] CheckLoginSession data)
        {
            LoginResult result = m_processManager.AccountManager.CheckLoginSession(data.UserID, data.SessionKey);
            return Ok(result);
        }

        /// <summary>
        /// 자동로그인 사용여부 확인
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("/Account/Account/UseAutoLogin")]
        [ProducesResponseType(typeof(ResponseAutoLogin), 200)]
        public IActionResult UseAutoLogin()
        {
            ResponseAutoLogin result = new ResponseAutoLogin(true, "");

            if (Startup.ConfigManager.Site.ExternalSiteID != null)
                result.SiteID = (int)Startup.ConfigManager.Site.ExternalSiteID;

            if (Startup.ConfigManager.Site.AutoLogin != null && Startup.ConfigManager.Site.AutoLogin == true)
                result.AutoLogin = true;
            else
                result.AutoLogin = false;

            return Ok(result);
        }

        /// <summary>
        /// 사용자 계정별 옵션정보 DB에 업데이트
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "saveOptions":
        ///     {
        ///         "id": 1,
        ///         "userID": "aaa",
        ///         "category": "popup",
        ///         "subCategory": "cctv",
        ///         "propertyValue1": "1.0",
        ///         "propertyValue2": "2.5",
        ///         "propertyValue3": "34px",
        ///         "propertyValue4": "100px"
        ///     }
        /// }
        /// </remarks>
        [HttpPost]
        [Route("/Account/Account/RequestSaveOption")]
        [ProducesResponseType(typeof(ResponseAccountOption), 200)]
        public IActionResult RequestSaveOption([FromBody] RequestSaveAccountOption data)
        {
            ResponseAccountOption result = m_processManager.AccountManager.SaveAccountOption(data.SaveOption);
            return Ok(result);
        }

        /// <summary>
        /// 사용자 계정목록 얻어오기
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "siteID": 1
        /// }
        /// </remarks>
        [HttpPost]
        [Route("/Account/Account/RequestUserList")]
        [ProducesResponseType(typeof(ResponseUserList), 200)]
        public IActionResult RequestUserList([FromBody] RequestUserList data)
        {
            ResponseUserList result = m_processManager.AccountManager.GetUserList(data);
            return Ok(result);
        }

        /// <summary>
        /// 사용자 계정등급 목록 얻어오기
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("/Account/Account/RequestUserLevelList")]
        [ProducesResponseType(typeof(ResponseUserLevelList), 200)]
        public IActionResult RequestUserLevelList()
        {
            ResponseUserLevelList result = m_processManager.AccountManager.GetUserLevelList();
            return Ok(result);
        }

        /// <summary>
        /// 사용자 계정정보 업데이트
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "deleteUserIDs": [1, 2, 5],
        ///     "updateUsers":
        ///     [
        ///         {
        ///             "id": 1,
        ///             "userID": "kjw",
        ///             "levelID": 1
        ///         },
        ///         {
        ///             "id": 2,
        ///             "userID": "bomhee",
        ///             "levelID": 1
        ///         },
        ///         {
        ///             "id": 5,
        ///             "userID": "su1562",
        ///             "levelID": 2
        ///         }
        ///     ]
        /// }
        /// <returns></returns>
        [HttpPost]
        [Route("/Account/Account/UpdateUsers")]
        [ProducesResponseType(typeof(MessageResult), 200)]
        public IActionResult UpdateUsers([FromBody] UpdateUser data)
        {
            MessageResult result = m_processManager.AccountManager.UpdateUsers(data);
            return Ok(result);
        }

        /// <summary>
        /// 사용자 계정별 옵션정보 얻어오기
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "userID": 1,
        ///     "category": "popup"
        /// }
        /// <returns></returns>
        [HttpPost]
        [Route("/Account/Account/RequestGetOption")]
        [ProducesResponseType(typeof(ResponseOption), 200)]
        public IActionResult RequestGetOption([FromBody] RequestOption data)
        {
            ResponseOption result = m_processManager.AccountManager.GetOption(data);
            return Ok(result);
        }

        /// <summary>
        /// 정규조직원 정보 얻어오기
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>++9
        /// <remarks>
        /// Sample request:
        /// {
        ///     "siteID": 1
        /// }
        /// </remarks>
        [HttpPost]
        [Route("/Account/Account/RequestRegularMemberList")]
        [ProducesResponseType(typeof(ResponseRegularMemberList), 200)]
        public IActionResult RequestRegularMemberList([FromBody] RequestRegularMemberList data)
        {
            ResponseRegularMemberList result = m_processManager.AccountManager.GetRegularMemberList(data);
            return Ok(result);
        }

        /// <summary>
        /// 신규 사용자 계정 생성
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>++9
        /// <remarks>
        /// Sample request:
        /// {
        ///     "regularMemberID": 1,   // 정규조직원 ID
        ///     "userID": "jamesdean",  // 사용자 계정
        ///     "accountLevelID": 2,    // 계정등급
        ///     "siteID": 1
        /// }
        /// </remarks>
        [HttpPost]
        [Route("/Account/Account/RequestCreateUser")]
        [ProducesResponseType(typeof(ResponseCreateUser), 200)]
        public IActionResult RequestCreateUser([FromBody] RequestCreateUser data)
        {
            ResponseCreateUser result = m_processManager.AccountManager.CreateUser(data, Startup.ConfigManager.Site.SolutionName);
            return Ok(result);
        }

        /// <summary>
        /// 비밀번호 변경
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "key": "asdfefda",              // 암호화시 사용된 랜덤키
        ///     "oldValue": "adf;aliksdfjadf"   // 암호화된 이전 계정 정보
        ///     "newValue": "adf;aliksdfjadf"   // 암호화된 새로운 계정 정보
        /// }
        /// </remarks>
        [HttpPost]
        [Route("/Account/Account/RequestChangePassword")]
        [ProducesResponseType(typeof(MessageResult), 200)]
        public IActionResult RequestChangePassword([FromBody] RequestChangePassword data)
        {
            if (data == null)
                return BadRequest();

            MessageResult result = null;

            if (data.OldValue != "" && data.NewValue != "" && data.Key != "")
            {
                try
                {
                    string strOld = AesHelper.Decrypt(data.OldValue, data.Key);
                    string strNew = AesHelper.Decrypt(data.NewValue, data.Key);

                    int nIndexOld = strOld.IndexOf('|');
                    int nIndexNew = strNew.IndexOf('|');

                    if (nIndexOld > 0 && nIndexNew > 0)
                    {
                        string strOldID = strOld.Substring(0, nIndexOld).Trim();
                        string strOldPW = strOld.Substring(nIndexOld + 1).Trim();

                        string strNewID = strNew.Substring(0, nIndexNew).Trim();
                        string strNewPW = strNew.Substring(nIndexNew + 1).Trim();

                        if (strOldID != strNewID)
                            return Ok(new MessageResult(false, "입력값이 잘못되었습니다."));

                        result = m_processManager.AccountManager.ChangePassword(strNewID, strOldPW, strNewPW, data.Key);
                    }
                    else
                    {
                        result = new MessageResult();
                        result.Success = false;
                        result.Message = "잘못된 입력값입니다.";
                    }
                }
                catch (Exception e)
                {
                    result = new MessageResult();
                    result.Message = e.Message;
                    result.Success = false;
                }
            }
            else
            {
                result = new MessageResult();
                result.Success = false;
                result.Message = "세션키 또는 비밀번호가 비어있습니다.";
            }

            return Ok(result);
        }

        /// <summary>
        /// WebSocketPort 요청
        /// </summary>
        [HttpPost]
        [Route("/Account/Account/RequestWebSocketPort")]
        [ProducesResponseType(typeof(ResponseWebSocketPort), 200)]
        public IActionResult RequestWebSocketPort()
        {
            if (Startup.ConfigManager.Site.WebSocketPort == null)
            {
                return Ok(new ResponseWebSocketPort(false, "WebSocketPort가 설정되어 있지 않습니다. WebServer 설정파일을 확인하세요."));
            }

            ResponseWebSocketPort result = new ResponseWebSocketPort(true, "");
            result.Port = (int)Startup.ConfigManager.Site.WebSocketPort;

            return Ok(result);
        }

        /// <summary>
        /// 비밀번호 찾기
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "userName": "홍길동",          // 사용자 이름
        ///     "phoneNumber": "01012345678"   // 휴대폰 번호
        /// }
        /// </remarks>
        [HttpPost]
        [Route("/Account/Account/RequestFindPassword")]
        [ProducesResponseType(typeof(MessageResult), 200)]
        public IActionResult RequestFindPassword([FromBody] RequestFindPassword data)
        {
            MessageResult result = m_processManager.AccountManager.FindPassword(data, Startup.ConfigManager.Site.SolutionName);
            return Ok(result);
        }
    }
}
