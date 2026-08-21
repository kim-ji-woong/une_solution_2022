using Microsoft.AspNetCore.Mvc;
using VDS.IDAL;
using VDS.BLL;
using VDS.BLL.Models.Request;
using VDS.BLL.Models.Response;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace WebVDS.Areas.api.Controllers
{
    [Authorize]
    [Area("api")]
    public class AccountController : ControllerBase
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

        public AccountController(global::VDS.IDAL.IDataManager dataManager)
        {
            m_processManager = new ProcessManager(dataManager);
        }

        [AllowAnonymous]
        [EnableCors("UnEPolicy")]
        // GET Account/Account/GetLoginKey
        [HttpGet]
        public string GetLoginKey(long num)
        {
            string strKey = AesHelper.MakeRandomKey(num);
            return strKey;
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestData([FromBody] RequestData data)
        {
            if (data == null)
                return BadRequest();

            /*if (data.RequestLogin != null)
                return Login(data.RequestLogin);
            else */if (data.CheckLoginSession != null)
                return CheckLoginSession(data.CheckLoginSession);
            /*else if (data.RequestLoginKey != null)
                return RequestLoginKey(data.RequestLoginKey);
            else if (data.RequestAccountUserList != null)
                return RequestUserList();
            else if (data.RequestUpdateAccountUsers != null)
                return RequestUpdateAccountUsers(data.RequestUpdateAccountUsers);*/
            else if (data.RequestAccountLevels != null)
                return RequestAccountLevels(data.RequestAccountLevels);
            else if (data.RequestAccountLevels2 != null)
                return RequestAccountLevels2(data.RequestAccountLevels2);
            else if (data.RequestSearchUserList != null)
                return RequestSearchUserList(data.RequestSearchUserList);
            /*else if (data.RequestRemoveAccountUsers != null)
                return RequestRemoveAccountUsers(data.RequestRemoveAccountUsers);*/
            else if (data.RequestUpdateAccountUsers2 != null)
                return RequestUpdateAccountUsers2(data.RequestUpdateAccountUsers2);
            else if (data.RequestSiteDataCenters != null)
                return RequestSiteDataCenters(data.RequestSiteDataCenters);
            else if (data.RequestValidUserID != null)
                return RequestValidUserID(data.RequestValidUserID);
            else if (data.RequestNewUser != null)
                return RequestNewUser(data.RequestNewUser);
            /*else if (data.RequestUserInfo != null)
                return RequestUserInfo(data.RequestUserInfo);*/
            else if (data.RequestSiteLicense != null)
                return RequestSiteLicense(data.RequestSiteLicense);

            return BadRequest();
        }

        private IActionResult RequestSiteLicense(RequestSiteLicense data)
        {
            int? userID = GetLoginUserID(HttpContext);

            if (userID == null)
                return Ok(new ResponseDataCenterList(false, "로그인된 사용자가 아닙니다."));

            ResponseSiteLicense response = m_processManager.AccountManager.GetSiteLicense(data, (int)userID);
            return Ok(response);
        }

        /*private IActionResult RequestUserInfo(RequestUserInfo data)
        {
            ResponseAccountUserData response = m_processManager.AccountManager.GetAccountUserData(data.UserID);
            return Ok(response);
        }*/

        private IActionResult RequestNewUser(RequestNewUser data)
        {
            int? userID = GetLoginUserID(HttpContext);

            if (userID == null)
                return Ok(new MessageResult(false, "로그인된 사용자가 아닙니다."));

            string strValue = data.UserID;
            string strKey = data.Password;

            if (strValue != "" || strKey != "")
            {
                int index1 = strValue.LastIndexOf("___");

                if (index1 > 0)
                {
                    string strSalt = strValue.Substring(index1 + 3);
                    strValue = strValue.Substring(0, index1);

                    try
                    {
                        string str = AesHelper.Decrypt(strValue, strKey);

                        int nIndex = str.IndexOf('|');

                        if (nIndex > 0)
                        {
                            string strID = str.Substring(0, nIndex).Trim();
                            string strPW = str.Substring(nIndex + 1).Trim();

                            data.UserID = strID;
                            data.Password = strPW;

                            MessageResult response = m_processManager.AccountManager.CreateNewUser(data, strSalt, (int)userID);
                            return Ok(response);
                        }
                        else
                        {
                            MessageResult result = new MessageResult(false, "잘못된 형식의 데이터입니다.");
                            return Ok(result);
                        }
                    }
                    catch (Exception e)
                    {
                        return Ok(new MessageResult(false, e.Message));
                    }
                }
            }

            return Ok(new MessageResult(false, "잘못된 형식의 데이터입니다."));
        }

        private IActionResult RequestValidUserID(RequestValidUserID data)
        {
            MessageResult response = m_processManager.AccountManager.CheckValidUserID(data);
            return Ok(response);
        }

        private IActionResult RequestSiteDataCenters(RequestSiteDataCenters data)
        {
            int? userID = GetLoginUserID(HttpContext);

            if (userID == null)
                return Ok(new ResponseDataCenterList(false, "로그인된 사용자가 아닙니다."));

            if (data.UserID != null)
            {
                if ((int)data.UserID != (int)userID)
                    return Ok(new ResponseDataCenterList(false, "허가되지 않은 정보에 접근중입니다."));
            }

            ResponseDataCenterList response = m_processManager.AccountManager.GetSiteDataCenterList(data, (int)userID);
            return Ok(response);
        }

        // 사용자 정보 업데이트(활성화 여부/메모/VDC List)
        private IActionResult RequestUpdateAccountUsers2(RequestUpdateAccountUsers2 data)
        {
            int? userID = GetLoginUserID(HttpContext);

            if (userID == null)
                return Ok(new MessageResult(false, "로그인된 사용자가 아닙니다."));

            MessageResult response = m_processManager.AccountManager.UpdateAccountUsers(data, (int)userID);
            return Ok(response);
        }

        /*private IActionResult RequestRemoveAccountUsers(RequestRemoveAccountUsers data)
        {
            MessageResult response = m_processManager.AccountManager.RemoveAccountUsers(data);
            return Ok(response);
        }*/

        // 같은 고객사에 속해있는 사용자 리스트를 얻어온다.
        // VDS 관리자는 VDS 관리자 등급 이하의 모든 사용자 정보를 얻어온다.
        // VDC 운영자는 VDC 운영자와 일반 사용자 정보를 얻어온다.
        private IActionResult RequestSearchUserList(RequestSearchUserList data)
        {
            int? userID = GetLoginUserID(HttpContext);

            if (userID == null)
                return Ok(new ResponseAccountUserDataList(false, "로그인된 사용자가 아닙니다."));

            if ((int)userID != data.UserID)
                return Ok(new ResponseAccountUserDataList(false, "허가되지 않은 정보에 접근중입니다."));

            ResponseAccountUserDataList response = m_processManager.AccountManager.GetAccountUserDataList(data);
            return Ok(response);
        }

        // 사용자 계정등급 정보를 얻어온다.
        private IActionResult RequestAccountLevels(RequestAccountLevels data)
        {
            int? userID = GetLoginUserID(HttpContext);

            if (userID == null)
                return Ok(new ResponseAccountLevels(false, "로그인된 사용자가 아닙니다."));

            if (data.UserID != null && (int)userID != data.UserID)
                return Ok(new ResponseAccountLevels(false, "허가되지 않은 정보에 접근중입니다."));

            ResponseAccountLevels response = m_processManager.AccountManager.GetAccountLevels(data);
            return Ok(response);
        }

        // 사용자 계정등급 정보를 얻어온다.
        // VDS 관리자는 자신 이하 전체 계정등급을 얻어온다.
        // VDC 운영자는 VDC 사용자 등급만 얻어온다.
        // VDC 사용자는 아무런 등급도 얻어올수 없다.
        private IActionResult RequestAccountLevels2(RequestAccountLevels2 data)
        {
            int? userID = GetLoginUserID(HttpContext);

            if (userID == null)
                return Ok(new ResponseAccountLevels(false, "로그인된 사용자가 아닙니다."));
            
            if ((int)userID != data.UserID)
                return Ok(new ResponseAccountLevels(false, "허가되지 않은 정보에 접근중입니다."));

            ResponseAccountLevels response = m_processManager.AccountManager.GetAccountLevels2(data);
            return Ok(response);
        }

        /*private IActionResult RequestUpdateAccountUsers(RequestUpdateAccountUsers data)
        {
            ResponseAccountUserList response = m_processManager.AccountManager.UpdateUserList(data.UserDatas);
            return Ok(response);
        }

        private IActionResult RequestUserList()
        {
            ResponseAccountUserList response = m_processManager.AccountManager.GetUserList();
            return Ok(response);
        }*/

        private IActionResult CheckLoginSession(CheckLoginSession data)
        {
            LoginResult result = m_processManager.AccountManager.CheckLoginSession(data.UserID, data.SessionKey);

            if (result.User != null)
                result.User.Options = Startup.ConfigManager.Site;

            if (result.State == (int)LoginResult.LoginState.Logout ||
                result.State == (int)LoginResult.LoginState.False ||
                result.State == (int)LoginResult.LoginState.Disconnected)
            {
                Logout();
            }

            return Ok(result);
        }

        [AllowAnonymous]
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
                //result.ExternalLogin = isExternalLogin;

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
                //result.ExternalLogin = isExternalLogin;
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

        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginData data)
        {
            if (data == null)
                return BadRequest();

            LoginResult result = null;

            if (data.Value != "" || data.Key != "")
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

                        result = m_processManager.AccountManager.Login(strID, strPW, data.Key, siteOption.ExternalLogin, autoLogin);

                        if (result.Success)
                        {
                            result.Message = "로그인에 성공하였습니다.";

                            List<Claim> claims = null;

                            if (result.User != null)
                            {
                                result.User.Options = siteOption;

                                claims = new List<Claim>
                                {
                                    new Claim(ClaimTypes.Name, result.User.NickName),
                                    new Claim(ClaimTypes.Role, "Administrator"),
                                    new Claim(ClaimTypes.Sid, result.User.ID.ToString()),
                                };
                            }
                            else
                            {
                                claims = new List<Claim>
                                {
                                    new Claim(ClaimTypes.Name, result.User.NickName),
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

        public static int? GetLoginUserID(Microsoft.AspNetCore.Http.HttpContext httpContext)
        {
            var claimPrincipal = httpContext.User;

            if (claimPrincipal != null)
            {
                foreach (var identity in claimPrincipal.Identities)
                {
                    Claim claim = identity.FindFirst(ClaimTypes.Sid.ToString());

                    if (claim != null && claim.Value != null)
                    {
                        int userID;

                        if (int.TryParse(claim.Value.ToString().Trim(), out userID))
                        {
                            return userID;
                        }
                    }
                }
            }

            return null;
        }
    }
}
