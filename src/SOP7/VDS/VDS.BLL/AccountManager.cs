using System;
using System.Collections;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;
using System.IO;
using dnsDBUtil;

namespace VDS.BLL
{
    using VDS.Model;
    using VDS.Model.Account;
    using VDS.Model.Team;
    using VDS.IDAL;
    using Models.Request;
    using Models.Response;
    using Models.Account;

    public class AccountManager
    {
        private static string key = new string(new char[] { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6' });

        // LoginFailLimit 이상 로그인 실패시(비밀번호 잘못 입력) 계정을 잠근다.(사용할수 없도록 한다.)
        private const int LoginFailLimit = 5;
        // 계정을 잠그는 시간
        private const int LockLoginMinutes = 30;

        public const string LoginFailMessage = "ID 또는 비밀번호를 잘못 입력하였습니다.";

        private IDataManager m_dataManager = null;
        private ProcessManager m_processManager = null;

        public AccountManager(IDataManager manager, ProcessManager processManager)
        {
            m_dataManager = manager;
            m_processManager = processManager;
        }

        public LoginResult Login(string strUserID, string strPW, string strSessionKey, string strExternalLoginURL, bool autoLogin)
        {
            LoginResult result = null;
            User user = null;
            Level level = null;
            string strErrorMessage = null;

            if (strExternalLoginURL != null && strExternalLoginURL.Length > 0)
            {
                result = ExternalLogin(strUserID, strPW, strExternalLoginURL, strSessionKey, autoLogin, out user, out level);

                if (result.Success == false)
                    return result;
                else if (result.User == null)
                {
                    result.Success = false;
                    result.Message = LoginFailMessage;
                    //result.Message = "해당 ID를 가진 유저 정보를 찾을 수 없습니다.";
                }

                return result;
            }
            else
            {
                result = new LoginResult();

                // ID 값으로 유저를 검색
                Dictionary<User.Fields, object> dicConditions = new Dictionary<User.Fields, object>();
                dicConditions[User.Fields.UserID] = strUserID;

                List<User> users = m_dataManager.GetSelectManager().SelectAccountUsers(dicConditions, null, out strErrorMessage);
                if (users == null)
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }
                else if (users.Count == 0)
                {
                    result.Success = false;
                    result.Message = LoginFailMessage;
                    //result.Message = "해당 ID를 가진 유저 정보를 찾을 수 없습니다.";
                    return result;
                }

                user = users[0];

                if (CheckLoginFailCount(user, null, out strErrorMessage) == false)
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }

                if (user.Password != strPW)
                {
                    if (SetLoginFailCount(user, out strErrorMessage))
                    {
                        strErrorMessage = LoginFailMessage;
                        //strErrorMessage = "비밀번호가 일치하지 않습니다.";
                    }

                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }

                UserData userData = m_dataManager.GetSelectManager().SelectAccountUserData(user.ID, out strErrorMessage);

                if (userData == null)
                    return new LoginResult(false, "계정에 대한 부가정보가 입력되지 않았습니다.");
                else if (userData.Activate == false)
                    return new LoginResult(false, "비활성화 상태인 계정입니다. 관리자에게 문의하세요.");
            }

            if (UpdateSession(user.ID, strSessionKey, autoLogin, out strErrorMessage) == false)
            {
                result.Success = false;
                result.Message = strErrorMessage;
                return result;
            }

            level = m_dataManager.GetSelectManager().SelectAccountLevel(user.UserLevel, out strErrorMessage);

            if (level == null)
            {
                result.Success = false;
                result.Message = strErrorMessage;
                return result;
            }

            // 로그인 성공 시 PasswordCode 초기화
            user.PasswordCode = null;
            if (m_dataManager.GetUpdateManager().UpdateAccountUser(user, out strErrorMessage) == false)
            {
                result.Success = false;
                result.Message = "PasswordCode 초기화 실패";
                return result;
            }

            ResponseAccountUserData userInfo = GetAccountUserData(user.ID);

            if (userInfo.Success == false)
            {
                result.Message = userInfo.Message;
                result.Success = false;
                return result;
            }

            result.User = ApplicationUser.MakeUser(user, level, userInfo.User.UserData, userInfo.User.DataCenters, strSessionKey);

            LoginResult.LoginState loginState;
            Model.Site.Data siteData;
            
            if (CheckSiteLicense(userInfo.User.UserData.SiteID, out loginState, out siteData, out strErrorMessage) == false)
            {
                result.Success = false;
                result.Message = strErrorMessage;
                result.State = (int)loginState;
                return result;
            }

            result.Success = true;
            result.User.SiteData = siteData;
            result.State = (int)loginState;

            if (loginState != LoginResult.LoginState.Login)
                result.Message = strErrorMessage;

            return result;
        }

        private bool UpdateSession(int nUserID, string strSessionKey, bool autoLogin, out string strErrorMessage)
        {
            strErrorMessage = "";

            // 해당 유저 세션 유무 확인
            Dictionary<Session.Fields, object> dicConditions_sessions = new Dictionary<Session.Fields, object>();
            dicConditions_sessions[Session.Fields.AccountUserID] = nUserID;

            List<Session> sessions = m_dataManager.GetSelectManager().SelectAccountSessions(dicConditions_sessions, null, out strErrorMessage);
            if (sessions == null)
            {
                return false;
            }

            // 있으면 삭제 후 생성, 없으면 생성
            if (sessions.Count > 0)
            {
                string strCondition = "AccountUserID = " + nUserID;
                if (!m_dataManager.GetDeleteManager().DeleteAccountSession(null, strCondition, out strErrorMessage))
                {
                    return false;
                }
            }

            DateTime dtNow = DateTime.Now;

            Session _session = new Session();
            _session.AccountUserID = nUserID;
            _session.CreateDate = dtNow;
            _session.IsAutoLogin = autoLogin;
            _session.SessionKey = strSessionKey;
            _session.UpdateDate = dtNow;

            Session session = m_dataManager.GetCreateManager().CreateAccountSession(_session, out strErrorMessage);
            if (session == null)
            {
                return false;
            }

            return true;
        }

        private bool SetLoginFailCount(User user, out string strErrorMessage)
        {
            strErrorMessage = null;
            bool changed = false;
            int nFailCount = 0;

            if (user.PasswordCode != null)
            {
                int nIndex = user.PasswordCode.IndexOf('_');

                if (nIndex > 0)
                {
                    string strFailCount = user.PasswordCode.Substring(0, nIndex).Trim();

                    if (int.TryParse(strFailCount, out nFailCount))
                    {
                        nFailCount++;
                        DateTime dtNow = DateTime.Now;

                        user.PasswordCode = string.Format("{0}_{1}", nFailCount, dtNow.ToBinary());
                        changed = true;

                        if (nFailCount >= LoginFailLimit)
                            strErrorMessage = string.Format("{0}회 이상 로그인에 실패하였기 때문에 앞으로 {1}분 동안 로그인 할수 없습니다.", LoginFailLimit, LockLoginMinutes);
                    }
                }
            }

            if (changed == false)
            {
                nFailCount = 1;
                DateTime dtNow = DateTime.Now;
                user.PasswordCode = string.Format("{0}_{1}", nFailCount, dtNow.ToBinary());
            }

            if (nFailCount < LoginFailLimit)
            {
                strErrorMessage = string.Format("ID 또는 비밀번호를 잘못 입력하였습니다. ({0}/{1}회)\r\n연속으로 {1}회 이상 로그인에 실패하면 {2}분동안 해당 계정으로 로그인 할 수 없습니다.", nFailCount, LoginFailLimit, LockLoginMinutes);
            }

            m_dataManager.GetUpdateManager().UpdateAccountUser(user, out strErrorMessage);
            return strErrorMessage == null;
        }

        private bool CheckLoginFailCount(User user, string strTarget, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (user.PasswordCode == null)
                return true;

            int nIndex = user.PasswordCode.IndexOf('_');

            if (nIndex <= 0)
                return true;

            if (strTarget == null)
                strTarget = "로그인";

            string strFailCount = user.PasswordCode.Substring(0, nIndex).Trim();
            string strLastFailTime = user.PasswordCode.Substring(nIndex + 1).Trim();

            int nFailCount;
            long lastFailTime;

            if (int.TryParse(strFailCount, out nFailCount) && long.TryParse(strLastFailTime, out lastFailTime))
            {
                // 로그인 실패횟수가 허용치를 초과한 경우
                if (nFailCount >= LoginFailLimit)
                {
                    DateTime lastTime = DateTime.FromBinary(lastFailTime);
                    TimeSpan span = DateTime.Now - lastTime;

                    if (span.TotalMinutes <= LockLoginMinutes)
                    {
                        int minutes = (int)(LockLoginMinutes - span.TotalMinutes + 0.9999);
                        strErrorMessage = string.Format("{0}회 이상 로그인에 실패하였기 때문에 앞으로 {1}분 동안 {2} 할수 없습니다.", LoginFailLimit, minutes, strTarget);
                        return false;
                    }
                    else
                    {
                        // LockLoginMinutes를 지났을 경우 초기화한다.
                        user.PasswordCode = null;
                        m_dataManager.GetUpdateManager().UpdateAccountUser(user, out strErrorMessage);
                    }
                }
            }

            return true;
        }

        private LoginResult ExternalLogin(string strUserID, string strPW, string strExternalLoginURL, string strSessionKey, bool autoLogin, out User user, out Level level)
        {
            user = null;
            level = null;

            JObject jsonData = new JObject();

            jsonData.Add("userID", strUserID);
            jsonData.Add("hashCode", strPW);

            JObject json = new JObject();
            json.Add("externalLogin", jsonData);

            string strJson = json.ToString();

            byte[] bytes = System.Text.Encoding.UTF8.GetBytes(strJson);
            int len = bytes.Length;

            System.Net.HttpWebRequest request = (System.Net.HttpWebRequest)System.Net.WebRequest.Create(new Uri(strExternalLoginURL));
            request.Method = "POST";
            request.ContentType = "application/json; charset=utf-8";
            request.ContentLength = len + 3;

            string strResult = "";
            string strErrorMessage = null;
            LoginResult result = new LoginResult();

            try
            {
                StreamWriter writer = new StreamWriter(request.GetRequestStream(), System.Text.Encoding.UTF8);
                writer.Write(strJson);
                writer.Close();

                System.Net.HttpWebResponse wRes = (System.Net.HttpWebResponse)request.GetResponse();

                Stream respPostStream = wRes.GetResponseStream();
                StreamReader readerPost = new StreamReader(respPostStream, System.Text.Encoding.UTF8);

                strResult = readerPost.ReadToEnd().Trim();
                request.Abort();
                readerPost.Close();
                respPostStream.Close();
                strErrorMessage = null;

                return GetExternalLoginResult(strResult, strSessionKey, autoLogin);
            }
            catch (System.Net.WebException ex)
            {
                strErrorMessage = ex.Message;
            }

            result.Success = false;
            result.Message = strErrorMessage;
            return result;
        }

        private static string MakeSalt()
        {
            int length = 50;
            string strChars = "0123456789_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

            int charLength = strChars.Length;
            string strData = "";

            Random rand = new Random((int)DateTime.Now.ToBinary());

            for (int i = 0; i < length; i++)
            {
                int index = rand.Next(0, charLength - 1);
                strData += strChars[index];
            }

            return strData;
        }

        private LoginResult GetExternalLoginResult(string strResult, string strSessionKey, bool autoLogin = false)
        {
            string strErrorMessage;
            string strUserID, strUserName, strTeamName;
            bool success = GetJsonResult(JObject.Parse(strResult), out strUserID, out strUserName, out strTeamName, out strErrorMessage);

            if (success == false)
                return new LoginResult(false, strErrorMessage);

            LoginResult result = new LoginResult();

            List<Level> levels = m_dataManager.GetSelectManager().SelectAccountLevels(null, null, out strErrorMessage);

            if (levels == null)
            {
                result.Success = false;
                result.Message = strErrorMessage;
                return result;
            }
            else if (levels.Count == 0)
            {
                result.Success = false;
                result.Message = "Account Level이 존재하지 않습니다.";
                return result;
            }

            Level level = levels[0];

            // ID 조회 
            User user = null;

            Dictionary<User.Fields, object> dicConditions = new Dictionary<User.Fields, object>();
            dicConditions[User.Fields.UserID] = strUserID;

            List<User> users = m_dataManager.GetSelectManager().SelectAccountUsers(dicConditions, null, out strErrorMessage);
            if (users == null)
            {
                result.Success = false;
                result.Message = strErrorMessage;
                return result;
            }
            else if (users.Count == 0)
            {   // 없으면 새로 생성
                User _user = new User();
                _user.NickName = strUserName;
                _user.Password = "";
                _user.Salt = MakeSalt();
                _user.UserLevel = level.ID;
                _user.UserID = strUserID;

                user = m_dataManager.GetCreateManager().CreateAccountUser(_user, out strErrorMessage);

                if (user == null)
                {
                    result.Success = false;
                    result.Message = "External 계정 생성 실패";
                    return result;
                }
            }
            else if (users.Count > 0)
            {
                user = users[0];

                level = m_dataManager.GetSelectManager().SelectAccountLevel(user.UserLevel, out strErrorMessage);

                if (level == null)
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }
            }

            if (UpdateSession(user.ID, strSessionKey, autoLogin, out strErrorMessage) == false)
            {
                result.Success = false;
                result.Message = strErrorMessage;
                return result;
            }

            ApplicationUser loginUser = new ApplicationUser();
            loginUser.ID = user.ID;
            loginUser.LevelID = level.ID;
            loginUser.NickName = strUserName;
            loginUser.UserID = strUserID;
            loginUser.SessionKey = strSessionKey;
            loginUser.UserLevel = level;

            result.Success = true;
            result.Message = "";
            result.User = loginUser;
            return result;
        }

        private bool GetJsonResult(JObject json, out string strUserID, out string strUserName, out string strTeamName, out string strErrorMessage)
        {
            strUserID = strUserName = strTeamName = null;
            strErrorMessage = null;

            if (json == null)
                return false;

            JToken tokenName = json.GetValue("name");
            JToken tokenUserID = json.GetValue("userID");
            JToken tokenTeamName = json.GetValue("teamName");
            JToken tokenMessage = json.GetValue("message");
            JToken tokenSuccess = json.GetValue("success");

            if (tokenMessage != null)
                strErrorMessage = tokenMessage.Value<string>();

            if (tokenName == null || tokenUserID == null)
                return false;

            strUserID = tokenUserID.Value<string>();
            strUserName = tokenName.Value<string>();

            if (tokenTeamName != null)
                strTeamName = tokenTeamName.Value<string>();

            if (tokenSuccess != null)
            {
                string strSuccess = tokenSuccess.Value<string>().ToLower();

                if (strSuccess == "true")
                    return true;
            }

            return false;
        }

        public string RequestSalt(RequestLoginKey data, out string strErrorMessage)
        {
            Dictionary<User.Fields, object> dicConditions = new Dictionary<User.Fields, object>();

            if (data.Num != null && data.UserID != null)
                dicConditions[User.Fields.UserID] = (string)data.UserID;
            /*else if (data.Num != null && data.Name != null && data.Data != null && data.Mode == (int)RequestLoginKey.ModeType.Email)
            {
                RegularMember member = GetRegularMember(data.Name, data.Data, null, out strErrorMessage);

                if (member == null)
                    return null;
                else
                    dicConditions[User.Fields.MemberID] = member.ID;
            }
            else if (data.Num != null && data.Name != null && data.Data != null && data.Mode == (int)RequestLoginKey.ModeType.PhoneNumber)
            {
                RegularMember member = GetRegularMember(data.Name, null, EncryptString(data.Data), out strErrorMessage);

                if (member == null)
                    return null;
                else
                    dicConditions[User.Fields.MemberID] = member.ID;
            }*/
            else
            {
                strErrorMessage = "Parameter가 부족합니다.";
                return null;
            }

            List<User> users = m_dataManager.GetSelectManager().SelectAccountUsers(dicConditions, null, out strErrorMessage);

            if (users == null)
                return null;
            else if (users.Count == 0)
            {
                return MakeSalt();
            }

            return users[0].Salt;
        }

        private RegularMember GetRegularMember(string strName, string strEmail, string strPhoneNumber, out string strErrorMessage)
        {
            strErrorMessage = null;

            Dictionary<RegularMember.Fields, object> dicConditions = new Dictionary<RegularMember.Fields, object>();
            dicConditions[RegularMember.Fields.MemberName] = strName;

            if (strEmail != null)
                dicConditions[RegularMember.Fields.Email] = strEmail;
            else if (strPhoneNumber != null)
                dicConditions[RegularMember.Fields.PhoneNumber] = strPhoneNumber;
            else
            {
                strEmail = "Parameter가 부족합니다.";
                return null;
            }

            List<RegularMember> members = m_dataManager.GetSelectManager().SelectTeamRegularMembers(dicConditions, null, out strErrorMessage);

            if (members == null)
                return null;
            else if (members.Count == 0)
            {
                strErrorMessage = "존재하지 않는 계정입니다.\r\n입력한 정보를 다시 확인해주세요.";
                return null;
            }

            return members[0];
        }

        public static string EncryptString(string str)
        {
            return AES256Cipher.AES_encrypt(str, key);
        }

        public static string DecryptString(string str)
        {
            if (str == null)
                return null;

            return AES256Cipher.AES_decrypt(str, key);
        }

        public LoginResult CheckLoginSession(int nUserID, string strSessionKey)
        {
            LoginResult result = new LoginResult();

            try
            {
                Dictionary<Session.Fields, object> dicConditions = new Dictionary<Session.Fields, object>();
                dicConditions[Session.Fields.AccountUserID] = nUserID;

                string strResultMessage = null;
                string strAdditionalConditions = string.Format("{0}.{1} = {2}", Session.TableName, Session.Fields.AccountUserID, nUserID);
                System.Collections.ArrayList arrResult = m_dataManager.GetSelectManager().JoinSessionUserLevel(strAdditionalConditions, out strResultMessage);

                if (arrResult == null)
                {
                    result.Success = false;
                    result.Message = strResultMessage;
                    return result;
                }
                else if (arrResult.Count == 0)
                {
                    result.Success = false;
                    result.Message = "해당 유저 Session은 존재하지 않습니다.";
                    return result;
                }
                else
                {
                    if (arrResult[0] is Session &&
                        arrResult[1] is User &&
                        arrResult[2] is Level)
                    {
                        Session session = arrResult[0] as Session;
                        User user = arrResult[1] as User;
                        Level level = arrResult[2] as Level;
                        string strErrorMessage;

                        if (session.SessionKey == strSessionKey)
                        {
                            // 자동 로그인 확인 여부
                            if (session.IsAutoLogin == false)
                            {   // 자동 로그인이 아니라면
                                // 마지막 Session 업데이트 시간 체크(현 시간으로부터 300초 이내인지)
                                DateTime dtSession = session.UpdateDate;
                                DateTime dtNow = DateTime.Now;

                                TimeSpan diffTime = dtNow - dtSession;
                                double dSecond = diffTime.TotalSeconds;

                                if (dSecond > 300)
                                {
                                    result.Success = false;
                                    result.Message = "로그아웃 되었습니다.";
                                    return result;
                                }
                                else
                                {
                                    session.UpdateDate = DateTime.Now;
                                    m_dataManager.GetUpdateManager().UpdateAccountSession(session, out strErrorMessage);
                                }
                            }

                            ResponseAccountUserData userInfo = GetAccountUserData(user.ID);

                            if (userInfo.Success == false)
                            {
                                result.Message = userInfo.Message;
                                result.Success = false;
                                return result;
                            }

                            result.Success = true;
                            result.Message = "해당 Session은 유효합니다.";
                            result.User = ApplicationUser.MakeUser(user, level, userInfo.User.UserData, userInfo.User.DataCenters, session.SessionKey);

                            if (result.User.UserData.Activate == false)
                            {
                                result.Success = false;
                                result.Message = "이 계정은 비활성화 상태입니다.";
                                return result;
                            }

                            LoginResult.LoginState loginState;
                            Model.Site.Data siteData;

                            if (CheckSiteLicense(userInfo.User.UserData.SiteID, out loginState, out siteData, out strErrorMessage) == false)
                            {
                                result.Success = false;
                                result.Message = strErrorMessage;
                                result.State = (int)loginState;
                                return result;
                            }
                            else
                            {
                                result.User.SiteData = siteData;
                                result.State = (int)loginState;

                                if (loginState != LoginResult.LoginState.Login)
                                    result.Message = strErrorMessage;
                            }

                            return result;
                        }
                        else
                        {
                            result.Success = false;
                            result.Message = "다른 곳에서 로그인하였습니다.";
                            return result;
                        }
                    }
                    else
                    {
                        result.Success = false;
                        result.Message = "해당 유저 Session은 존재하지 않습니다.";
                        return result;
                    }
                }
            }
            catch (Exception e)
            {
                result.Success = false;
                result.Message = e.Message;
            }

            return result;
        }

        private bool CheckSiteLicense(int nSiteID, out LoginResult.LoginState loginState, out Model.Site.Data siteData, out string strErrorMessage)
        {
            strErrorMessage = null;
            siteData = null;
            loginState = LoginResult.LoginState.False;

            siteData = m_dataManager.GetSelectManager().SelectSiteData(nSiteID, out strErrorMessage);

            if (siteData == null)
            {
                if (strErrorMessage != null)
                    return false;
                else
                {
                    strErrorMessage = "Database로부터 고객사의 라이센스 정보를 확인할 수 없습니다.";
                    return false;
                }
            }

            if (siteData.LicenseValidation == false)
            {
                strErrorMessage = "라이선스가 만료되어 고객사 정보에 접근할 수 없습니다.";
                loginState = LoginResult.LoginState.LicenseInvalid;
                return false;
            }

            DateTime dtNow = DateTime.Now;

            if (dtNow > siteData.ServiceEndDate)
            {
                strErrorMessage = "만료일이 지났습니다.";
                loginState = LoginResult.LoginState.LicenseExpired;
                return true;
            }

            if (dtNow < siteData.ServiceBeginDate)
            {
                strErrorMessage = "아직 서비스 이용가능 일자가 되지 않았습니다.";
                loginState = LoginResult.LoginState.LicenseWait;
                return true;
            }

            Model.Site.Option siteOption = m_dataManager.GetSelectManager().SelectSiteOption(Model.Site.Option.LicenseAlertDays, out strErrorMessage);

            if (siteOption != null)
            {
                int days;

                if (int.TryParse(siteOption.PropertyValue.Trim(), out days))
                {
                    TimeSpan span = siteData.ServiceEndDate - dtNow;

                    if (span.TotalDays < days)
                    {
                        strErrorMessage = string.Format("만료일 {0}일 남았습니다.", (int)span.TotalDays);
                        loginState = LoginResult.LoginState.LicenseAlert;
                        return true;
                    }
                }
            }

            loginState = LoginResult.LoginState.Login;
            return true;
        }

        public ResponseAccountUserList GetUserList()
        {
            string strErrorMessage;
            List<Level> levels = m_dataManager.GetSelectManager().SelectAccountLevels(null, null, out strErrorMessage);

            if (levels == null)
                return new ResponseAccountUserList(false, strErrorMessage);

            Dictionary<int, Level> dicLevels = new Dictionary<int, Level>();

            foreach (Level level in levels)
            {
                dicLevels[level.ID] = level;
            }

            List<User> users = m_dataManager.GetSelectManager().SelectAccountUsers(null, null, out strErrorMessage);

            if (users == null)
                return new ResponseAccountUserList(false, strErrorMessage);

            ResponseAccountUserList response = new ResponseAccountUserList(true, "");
            response.Levels.AddRange(levels);

            foreach (User user in users)
            {
                Level level;

                if (dicLevels.TryGetValue(user.UserLevel, out level) == false)
                    continue;

                AccountUserEx _user = new AccountUserEx();

                _user.ID = user.ID;
                _user.UserLevel = level;
                _user.UserID = user.UserID;
                _user.NickName = user.NickName;
                _user.Salt = user.Salt;

                /*if (user.DataCenterIDs != null)
                {
                    string[] tokens = user.DataCenterIDs.Split(',');

                    foreach (string strToken in tokens)
                    {
                        int dataCenterID;

                        if (int.TryParse(strToken.Trim(), out dataCenterID))
                        {
                            if (_user.DataCenterIDs == null)
                                _user.DataCenterIDs = new List<int>();

                            _user.DataCenterIDs.Add(dataCenterID);
                        }
                    }
                }*/

                response.Users.Add(_user);
            }

            return response;
        }

        public ResponseAccountUserList UpdateUserList(List<AccountUserData> userDatas)
        {
            Dictionary<int, AccountUserData> dicUserDatas = new Dictionary<int, AccountUserData>();

            foreach (AccountUserData userData in userDatas)
            {
                if (userData.Id != null)
                    dicUserDatas[(int)userData.Id] = userData;
            }

            string strErrorMessage;
            List<User> users = m_dataManager.GetSelectManager().SelectAccountUsers(null, null, out strErrorMessage);

            if (users == null)
                return new ResponseAccountUserList(false, strErrorMessage);

            List<int> deleteIDs = new List<int>();
            string strDeleteIDs = "";

            foreach (User user in users)
            {
                if (dicUserDatas.ContainsKey(user.ID) == false)
                {
                    if (strDeleteIDs.Length == 0)
                        strDeleteIDs = user.ID.ToString();
                    else
                        strDeleteIDs += ", " + user.ID.ToString();

                    deleteIDs.Add(user.ID);
                }
            }

            if (DeleteUsers(users, deleteIDs, strDeleteIDs, out strErrorMessage) == false)
                return new ResponseAccountUserList(false, strErrorMessage);

            if (UpdateUsers(users, dicUserDatas, out strErrorMessage) == false)
                return new ResponseAccountUserList(false, strErrorMessage);

            if (CreateUsers(userDatas, out strErrorMessage) == false)
                return new ResponseAccountUserList(false, strErrorMessage);

            return GetUserList();
        }

        private bool CreateUsers(List<AccountUserData> userDatas, out string strErrorMessage)
        {
            strErrorMessage = null;

            foreach (AccountUserData userData in userDatas)
            {
                if (userData.Id == null && userData.Password != null && userData.Password.Length > 0)
                {
                    User user = new User();

                    user.UserID = userData.UserID;
                    user.UserLevel = userData.LevelID;
                    user.Password = userData.Password;
                    user.NickName = userData.NickName;
                    user.Salt = MakeSalt();

                    if (m_dataManager.GetCreateManager().CreateAccountUser(user, out strErrorMessage) == null)
                        return false;
                }
            }

            return true;
        }

        private bool UpdateUsers(List<User> users, Dictionary<int, AccountUserData> dicUserDatas, out string strErrorMessage)
        {
            strErrorMessage = null;

            foreach (User user in users)
            {
                AccountUserData userData;

                if (dicUserDatas.TryGetValue(user.ID, out userData) == false)
                    continue;

                user.UserLevel = userData.LevelID;

                if (userData.Password != null && userData.Password.Length > 0)
                {
                    user.Password = userData.Password;
                }

                user.UserID = userData.UserID;
                user.NickName = userData.NickName;

                if (m_dataManager.GetUpdateManager().UpdateAccountUser(user, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool DeleteUsers(List<User> users, List<int> deleteIDs, string strDeleteIDs, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (strDeleteIDs.Length == 0)
            {
                return true;
            }

            bool isNullable;
            string strCondition = string.Format("{0} in ({1})", Option.GetFieldName(Option.Fields.UserID, out isNullable), strDeleteIDs);

            if (m_dataManager.GetDeleteManager().DeleteAccountOption(null, strCondition, out strErrorMessage) == false)
                return false;

            strCondition = string.Format("{0} in ({1})", Session.GetFieldName(Session.Fields.AccountUserID, out isNullable), strDeleteIDs);

            if (m_dataManager.GetDeleteManager().DeleteAccountSession(null, strCondition, out strErrorMessage) == false)
                return false;

            strCondition = string.Format("{0} in ({1})", User.GetFieldName(User.Fields.ID, out isNullable), strDeleteIDs);

            if (m_dataManager.GetDeleteManager().DeleteAccountUser(null, strCondition, out strErrorMessage) == false)
                return false;

            Dictionary<int, int> dicIDs = new Dictionary<int, int>();

            foreach (int deleteID in deleteIDs)
            {
                dicIDs[deleteID] = deleteID;
            }

            for (int i = users.Count-1; i >= 0; i--)
            {
                User user = users[i];

                if (dicIDs.ContainsKey(user.ID))
                {
                    users.RemoveAt(i);
                }
            }

            return true;
        }

        public ResponseAccountLevels GetAccountLevels(RequestAccountLevels data)
        {
            string strErrorMessage;
            List<Level> levels = m_dataManager.GetSelectManager().SelectAccountLevels(null, null, out strErrorMessage);

            if (levels == null)
                return new ResponseAccountLevels(false, strErrorMessage);

            if (data.UserID != null)
            {
                User user = m_dataManager.GetSelectManager().SelectAccountUser((int)data.UserID, out strErrorMessage);

                if (user == null)
                {
                    if (strErrorMessage != null)
                        return new ResponseAccountLevels(false, strErrorMessage);
                    else
                        return new ResponseAccountLevels(false, "사용자 계정정보를 조회할 수 없습니다.");
                }

                int nLevelCount = levels.Count;

                for (int i=nLevelCount-1;i>=0;i--)
                {
                    Level level = levels[i];

                    if (level.ID < user.UserLevel)
                        levels.RemoveAt(i);
                }
            }

            ResponseAccountLevels response = new ResponseAccountLevels(true, "");
            response.Levels.AddRange(levels);
            return response;
        }

        public ResponseAccountLevels GetAccountLevels2(RequestAccountLevels2 data)
        {
            string strErrorMessage;
            List<Level> levels = m_dataManager.GetSelectManager().SelectAccountLevels(null, null, out strErrorMessage);

            if (levels == null)
                return new ResponseAccountLevels(false, strErrorMessage);

            User user = m_dataManager.GetSelectManager().SelectAccountUser((int)data.UserID, out strErrorMessage);

            if (user == null)
            {
                if (strErrorMessage != null)
                    return new ResponseAccountLevels(false, strErrorMessage);
                else
                    return new ResponseAccountLevels(false, "사용자 계정정보를 조회할 수 없습니다.");
            }

            if (user.UserLevel == 2)
            {
                int nLevelCount = levels.Count;

                for (int i = nLevelCount - 1; i >= 0; i--)
                {
                    Level level = levels[i];

                    if (level.ID <= user.UserLevel)
                        levels.RemoveAt(i);
                }
            }

            ResponseAccountLevels response = new ResponseAccountLevels(true, "");

            if (user.UserLevel <= 2)
                response.Levels.AddRange(levels);

            return response;
        }

        public ResponseAccountUserDataList GetAccountUserDataList(RequestSearchUserList data)
        {
            string strErrorMessage;
            UserData _userData = m_dataManager.GetSelectManager().SelectAccountUserData(data.UserID, out strErrorMessage);

            if (_userData == null)
                return new ResponseAccountUserDataList(false, "시스템 데이터베이스에서 사용자 정보를 조회하는데 실패하였습니다.");

            if (data.SiteID == null || _userData.SiteID != (int)data.SiteID)
                return new ResponseAccountUserDataList(false, "허가되지 않은 정보에 접근을 시도하였습니다.");

            List<Level> levels = m_dataManager.GetSelectManager().SelectAccountLevels(null, null, out strErrorMessage);

            if (levels == null)
                return new ResponseAccountUserDataList(false, strErrorMessage);

            Dictionary<int, Level> dicLevels = new Dictionary<int, Level>();

            foreach (Level level in levels)
            {
                dicLevels[level.ID] = level;
            }

            Dictionary<int, Dictionary<int, Model.DataCenter.DataCenter>> dicUserDataCenters = GetUserDataCenterList(data.SiteID, out strErrorMessage);

            if (dicUserDataCenters == null)
                return new ResponseAccountUserDataList(false, strErrorMessage);

            User _user = m_dataManager.GetSelectManager().SelectAccountUser(data.UserID, out strErrorMessage);

            if (_user == null)
            {
                if (strErrorMessage != null)
                    return new ResponseAccountUserDataList(false, strErrorMessage);
                else
                    return new ResponseAccountUserDataList(false, "사용자 정보를 찾을수 없습니다.");
            }

            if (_user.UserLevel == 2)
            {
                // VDC 운영자는 사용자 목록에서 자신이 볼수 있는 DC를 제외하고 모두 제거한다.
                RemoveUserDataCenters(dicUserDataCenters, _user);
            }

            Dictionary<UserData.Fields, object> dicConditions = new Dictionary<UserData.Fields, object>();
            dicConditions[UserData.Fields.SiteID] = (int)data.SiteID;

            ArrayList arrDatas = m_dataManager.GetSelectManager().JoinUserUserDatas(null, dicConditions, null, out strErrorMessage);

            if (arrDatas == null)
                return new ResponseAccountUserDataList(false, strErrorMessage);

            ResponseAccountUserDataList response = new ResponseAccountUserDataList(true, "");

            int nDataCount = arrDatas.Count;

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (arrDatas[i] is User && arrDatas[i + 1] is UserData)
                {
                    User user = (User)arrDatas[i];
                    UserData userData = (UserData)arrDatas[i + 1];

                    if (data.LevelID != null)
                    {
                        if (user.UserLevel != (int)data.LevelID)
                            continue;
                    }

                    // 1. VDS 관리자는 전체 사용자 목록을 조회할 수 있다.(자신 포함)
                    // 2. VDC 운영자는 일반 사용자와 자신만 조회할 수 있다.(다른 VDC 운영자는 조회할 수 없다.)
                    // 3. 일반 사용자는 누구도 조회할 수 없다.
                    if (_user.UserLevel == 3)
                    {
                        // 일반 사용자
                        continue;
                    }
                    else if (_user.UserLevel == 2)
                    {
                        if (user.UserLevel < _user.UserLevel)
                            continue;
                        else if (user.UserLevel == _user.UserLevel)
                        {
                            if (user.ID != _user.ID)
                                continue;
                        }
                    }

                    Dictionary<int, Model.DataCenter.DataCenter> dataCenters;

                    if (dicUserDataCenters.TryGetValue(user.ID, out dataCenters) == false)
                        dataCenters = new Dictionary<int, Model.DataCenter.DataCenter>();

                    Level level;

                    if (dicLevels.TryGetValue(user.UserLevel, out level) == false)
                        continue;

                    response.Users.Add(new AccountUser2(user, userData, level, dataCenters.Values));
                }
            }

            return response;
        }

        private void RemoveUserDataCenters(Dictionary<int, Dictionary<int, Model.DataCenter.DataCenter>> dicUserDataCenters, User user)
        {
            Dictionary<int, Model.DataCenter.DataCenter> dicTargetDataCenters = null;

            if (dicUserDataCenters.TryGetValue(user.ID, out dicTargetDataCenters) == false)
            {
                foreach (KeyValuePair<int, Dictionary<int, Model.DataCenter.DataCenter>> pair in dicUserDataCenters)
                {
                    pair.Value.Clear();
                }
            }
            else
            {
                Dictionary<int, int> dicTargetDataCenterIDs = new Dictionary<int, int>();

                foreach (KeyValuePair<int, Model.DataCenter.DataCenter> pair in dicTargetDataCenters)
                {
                    dicTargetDataCenterIDs[pair.Value.ID] = pair.Value.ID;
                }

                foreach (KeyValuePair<int, Dictionary<int, Model.DataCenter.DataCenter>> pair in dicUserDataCenters)
                {
                    List<int> removeCenterIDs = new List<int>();

                    foreach (KeyValuePair<int, Model.DataCenter.DataCenter> data in pair.Value)
                    {
                        if (dicTargetDataCenterIDs.ContainsKey(data.Value.ID) == false)
                            removeCenterIDs.Add(data.Key);
                    }

                    foreach (int dataCenterID in removeCenterIDs)
                    {
                        pair.Value.Remove(dataCenterID);
                    }
                }
            }
        }

        public ResponseAccountUserData GetAccountUserData(int userID)
        {
            Dictionary<User.Fields, object> dicConditions = new Dictionary<User.Fields, object>();
            dicConditions[User.Fields.ID] = userID;

            string strErrorMessage;
            ArrayList arrDatas = m_dataManager.GetSelectManager().JoinUserUserDatas(dicConditions, null, null, out strErrorMessage);

            if (arrDatas == null)
                return new ResponseAccountUserData(false, strErrorMessage);

            if (arrDatas.Count < 2)
                return new ResponseAccountUserData(false, "DB로부터 사용자 계정을 찾을수 없습니다.");

            User user = arrDatas[0] is User ? (User)arrDatas[0] : null;
            UserData userData = arrDatas[1] is UserData ? (UserData)arrDatas[1] : null;

            if (user == null || userData == null)
                return new ResponseAccountUserData(false, "DB로부터 사용자 계정을 찾을수 없습니다.");

            Dictionary<UserDataCenterLink.Fields, object> dicCondition2 = new Dictionary<UserDataCenterLink.Fields, object>();
            dicCondition2[UserDataCenterLink.Fields.UserID] = userID;

            List<UserDataCenterLink> links = m_dataManager.GetSelectManager().SelectAccountUserDataCenterLinks(dicCondition2, null, out strErrorMessage);

            if (links == null)
                return new ResponseAccountUserData(false, strErrorMessage);

            Level level = m_dataManager.GetSelectManager().SelectAccountLevel(user.UserLevel, out strErrorMessage);

            if (level == null)
                return new ResponseAccountUserData(false, "DB로부터 사용자 계정 정보를 찾을수 없습니다.");

            string strDataCenterIDs = "";

            foreach (UserDataCenterLink link in links)
            {
                if (strDataCenterIDs.Length == 0)
                    strDataCenterIDs = link.DataCenterID.ToString();
                else
                    strDataCenterIDs += "," + link.DataCenterID.ToString();
            }

            List<Model.DataCenter.DataCenter> dataCenters = null;

            if (strDataCenterIDs.Length > 0)
            {
                bool isNullable;
                string strCondition = string.Format("{0} in ({1})", Model.DataCenter.DataCenter.GetFieldName(Model.DataCenter.DataCenter.Fields.ID, out isNullable), strDataCenterIDs);
                dataCenters = m_dataManager.GetSelectManager().SelectDataCenters(null, strCondition, out strErrorMessage);

                if (dataCenters == null)
                    return new ResponseAccountUserData(false, strErrorMessage);
            }

            AccountUser2 user2 = new AccountUser2();

            if (dataCenters != null)
                user2.DataCenters.AddRange(dataCenters);

            if (user2.DataCenters.Count > 0)
            {
                int nSiteID = user2.DataCenters[0].SiteID;
                Model.Site.Data siteData = m_dataManager.GetSelectManager().SelectSiteData(nSiteID, out strErrorMessage);

                if (siteData == null)
                {
                    if (strErrorMessage != null)
                        return new ResponseAccountUserData(false, strErrorMessage);
                    else
                        return new ResponseAccountUserData(false, "고객사 정보를 조회할 수 없습니다.");
                }

                if (siteData.LicenseValidation == false)
                    return new ResponseAccountUserData(false, "라이선스가 만료되어 고객사 정보에 접근할 수 없습니다.");
            }

            user2.ID = user.ID;
            user2.NickName = user.NickName;
            user2.UserData = userData;
            user2.UserID = user.UserID;
            user2.UserLevel = level;

            ResponseAccountUserData response = new ResponseAccountUserData(true, "");
            response.User = user2;
            return response;
        }

        // Key : AccountUser.ID
        // Value : DataCenter.ID List
        private Dictionary<int, Dictionary<int, Model.DataCenter.DataCenter>> GetUserDataCenterList(int? siteID, out string strErrorMessage)
        {
            strErrorMessage = null;
            Dictionary<int, Dictionary<int, Model.DataCenter.DataCenter>> dicUserDataCenters = new Dictionary<int, Dictionary<int, Model.DataCenter.DataCenter>>();

            if (siteID == null)
                return dicUserDataCenters;

            bool isNullable;
            string strCondition = string.Format("{2}.{0} in (Select {1} from {2} where {3} = {4})",
                Model.DataCenter.DataCenter.GetFieldName(Model.DataCenter.DataCenter.Fields.ID, out isNullable),
                Model.DataCenter.DataCenter.GetFieldName(Model.DataCenter.DataCenter.Fields.ID, out isNullable),
                Model.DataCenter.DataCenter.TableName,
                Model.DataCenter.DataCenter.GetFieldName(Model.DataCenter.DataCenter.Fields.SiteID, out isNullable),
                (int)siteID);

            ArrayList arrDatas = m_dataManager.GetSelectManager().JoinDataCenterUserDataCenterLink(null, null, strCondition, out strErrorMessage);

            if (arrDatas == null)
                return null;

            int nDataCount = arrDatas.Count;

            Dictionary<int, Model.DataCenter.DataCenter> dataCenters;

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (arrDatas[i] is Model.DataCenter.DataCenter && arrDatas[i + 1] is UserDataCenterLink)
                {
                    Model.DataCenter.DataCenter dataCenter = (Model.DataCenter.DataCenter)arrDatas[i];
                    UserDataCenterLink link = (UserDataCenterLink)arrDatas[i + 1];

                    if (dicUserDataCenters.TryGetValue(link.UserID, out dataCenters) == false)
                    {
                        dataCenters = new Dictionary<int, Model.DataCenter.DataCenter>();
                        dicUserDataCenters[link.UserID] = dataCenters;
                    }

                    dataCenters[link.DataCenterID] = dataCenter;
                }
            }

            return dicUserDataCenters;
        }

        public MessageResult RemoveAccountUsers(RequestRemoveAccountUsers data)
        {
            string strUserIDs = "";

            foreach (int userID in data.UserIDs)
            {
                if (strUserIDs.Length == 0)
                    strUserIDs = userID.ToString();
                else
                    strUserIDs += "," + userID.ToString();
            }

            if (strUserIDs.Length == 0)
                return new MessageResult(true, "");

            if (m_dataManager.BeginTransaction() == false)
                return new MessageResult(false, "Database 트랜잭션을 시작할 수 없습니다.");

            string strErrorMessage = null;

            if (RemoveAccountOption(strUserIDs, ref strErrorMessage) == false)
            {
                m_dataManager.Rollback();
                return new MessageResult(false, strErrorMessage);
            }

            if (RemoveAccountSession(strUserIDs, ref strErrorMessage) == false)
            {
                m_dataManager.Rollback();
                return new MessageResult(false, strErrorMessage);
            }

            if (RemoveAccountUserDataCenterLink(strUserIDs, ref strErrorMessage) == false)
            {
                m_dataManager.Rollback();
                return new MessageResult(false, strErrorMessage);
            }

            if (RemoveAccountUserData(strUserIDs, ref strErrorMessage) == false)
            {
                m_dataManager.Rollback();
                return new MessageResult(false, strErrorMessage);
            }

            if (RemoveAccountUser(strUserIDs, ref strErrorMessage) == false)
            {
                m_dataManager.Rollback();
                return new MessageResult(false, strErrorMessage);
            }

            if (m_dataManager.Commit() == false)
            {
                m_dataManager.Rollback();
                return new MessageResult(false, "Database 트랜잭션이 실패하였습니다.");
            }

            return new MessageResult(true, "");
        }

        private bool RemoveAccountOption(string strUserIDs, ref string strErrorMessage)
        {
            bool isNullable;
            string strCondition = string.Format("{0} in ({1})", Option.GetFieldName(Option.Fields.UserID, out isNullable), strUserIDs);
            return m_dataManager.GetDeleteManager().DeleteAccountOption(null, strCondition, out strErrorMessage);
        }

        private bool RemoveAccountSession(string strUserIDs, ref string strErrorMessage)
        {
            bool isNullable;
            string strCondition = string.Format("{0} in ({1})", Session.GetFieldName(Session.Fields.AccountUserID, out isNullable), strUserIDs);
            return m_dataManager.GetDeleteManager().DeleteAccountSession(null, strCondition, out strErrorMessage);
        }

        private bool RemoveAccountUserDataCenterLink(string strUserIDs, ref string strErrorMessage)
        {
            bool isNullable;
            string strCondition = string.Format("{0} in ({1})", UserDataCenterLink.GetFieldName(UserDataCenterLink.Fields.UserID, out isNullable), strUserIDs);
            return m_dataManager.GetDeleteManager().DeleteAccountUserDataCenterLink(null, strCondition, out strErrorMessage);
        }

        private bool RemoveAccountUserData(string strUserIDs, ref string strErrorMessage)
        {
            bool isNullable;
            string strCondition = string.Format("{0} in ({1})", UserData.GetFieldName(UserData.Fields.UserID, out isNullable), strUserIDs);
            return m_dataManager.GetDeleteManager().DeleteAccountUserData(null, strCondition, out strErrorMessage);
        }

        private bool RemoveAccountUser(string strUserIDs, ref string strErrorMessage)
        {
            bool isNullable;
            string strCondition = string.Format("{0} in ({1})", User.GetFieldName(User.Fields.ID, out isNullable), strUserIDs);
            return m_dataManager.GetDeleteManager().DeleteAccountUser(null, strCondition, out strErrorMessage);
        }

        public MessageResult UpdateAccountUsers(RequestUpdateAccountUsers2 data, int userID)
        {
            bool isNullable;
            string strErrorMessage;

            Dictionary<User.Fields, object> _dicConditions = new Dictionary<User.Fields, object>();
            _dicConditions[User.Fields.ID] = userID;
            ArrayList arrDatas = m_dataManager.GetSelectManager().JoinUserUserDatas(_dicConditions, null, null, out strErrorMessage);

            if (arrDatas == null || arrDatas.Count < 2)
                return new MessageResult(false, "시스템 데이터베이스로부터 사용자 정보를 조회할 수 없습니다.");

            User user = (User)arrDatas[0];
            UserData _userData = (UserData)arrDatas[1];

            if (user.UserLevel > 2)
                return new MessageResult(false, "사용자 정보를 편집할 수 있는 권한이 없는 사용자 입니다.");

            if (m_dataManager.BeginTransaction() == false)
                return new MessageResult(false, "Database 트랜잭션을 시작할 수 없습니다.");

            Dictionary<UserData.Fields, object> _dicConditions2 = new Dictionary<UserData.Fields, object>();
            _dicConditions2[UserData.Fields.SiteID] = _userData.SiteID;
            arrDatas = m_dataManager.GetSelectManager().JoinUserUserDatas(null, _dicConditions2, null, out strErrorMessage);

            if (arrDatas == null)
            {
                m_dataManager.Rollback();
                return new MessageResult(false, "고객사에 소속된 사용자 정보를 얻어오는데 실패하였습니다.");
            }

            int nDataCount = arrDatas.Count;
            Dictionary<int, User> dicUsers = new Dictionary<int, User>();
            Dictionary<int, UserData> dicUserDatas = new Dictionary<int, UserData>();

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (arrDatas[i] is User && arrDatas[i + 1] is UserData)
                {
                    User _user = (User)arrDatas[i];
                    UserData userData = (UserData)arrDatas[i + 1];

                    dicUserDatas[userData.UserID] = userData;
                    dicUsers[_user.ID] = _user;
                }
            }

            Dictionary<Model.DataCenter.DataCenter.Fields, object> dicConditions3 = new Dictionary<Model.DataCenter.DataCenter.Fields, object>();
            dicConditions3[Model.DataCenter.DataCenter.Fields.SiteID] = _userData.SiteID;
            List<Model.DataCenter.DataCenter> dataCenters = m_dataManager.GetSelectManager().SelectDataCenters(dicConditions3, null, out strErrorMessage);

            if (dataCenters == null)
            {
                m_dataManager.Rollback();
                return new MessageResult(false, "고객사에 소속된 VDC 정보를 얻어오는데 실패하였습니다.");
            }

            Dictionary<int, Model.DataCenter.DataCenter> dicDataCenters = new Dictionary<int, Model.DataCenter.DataCenter>();

            foreach (Model.DataCenter.DataCenter center in dataCenters)
            {
                dicDataCenters[center.ID] = center;
            }

            foreach (UpdateUserData userData in data.UpdateUserDatas)
            {
                User currentUser;

                if (dicUserDatas.ContainsKey(userData.UserID) == false || dicUsers.TryGetValue(userData.UserID, out currentUser) == false)
                {
                    m_dataManager.Rollback();
                    return new MessageResult(false, "수정할 권한이 없는 사용자의 정보를 수정하려고 시도하였습니다.");
                }

                if (user.UserLevel == 2)
                {
                    // VDC 운영자
                    if (currentUser.UserLevel == 1 || (currentUser.UserLevel == 2 && currentUser.ID != user.ID))
                    {
                        m_dataManager.Rollback();
                        return new MessageResult(false, "수정할 권한이 없는 사용자의 정보를 수정하려고 시도하였습니다.");
                    }
                }
                else if (user.UserLevel == 3)
                {
                    m_dataManager.Rollback();
                    return new MessageResult(false, "일반 사용자는 사용자 정보를 수정할 권한이 없습니다.");
                }

                foreach (int dataCenterID in userData.DataCenterIDs)
                {
                    if (dicDataCenters.ContainsKey(dataCenterID) == false)
                    {
                        m_dataManager.Rollback();
                        return new MessageResult(false, "고객사에 소속되지 않은 VDC를 특정 사용자에게 연결하려고 시도하였습니다.");
                    }
                }

                Dictionary<UserData.Fields, object> dicConditions = new Dictionary<UserData.Fields, object>();
                Dictionary<UserData.Fields, object> dicSets = new Dictionary<UserData.Fields, object>();

                dicConditions[UserData.Fields.UserID] = userData.UserID;

                if (userData.Activate != null) {
                    dicSets[UserData.Fields.Activate] = (bool)userData.Activate;
                }

                dicSets[UserData.Fields.Memo] = userData.Memo;

                if (m_dataManager.GetUpdateManager().UpdateAccountUserData(dicSets, dicConditions, null, out strErrorMessage) == false)
                {
                    m_dataManager.Rollback();
                    return new MessageResult(false, strErrorMessage);
                }

                string strCondition = string.Format("{0} = {1}", UserDataCenterLink.GetFieldName(UserDataCenterLink.Fields.UserID, out isNullable), userData.UserID);
                
                if (m_dataManager.GetDeleteManager().DeleteAccountUserDataCenterLink(null, strCondition, out strErrorMessage) == false)
                {
                    m_dataManager.Rollback();
                    return new MessageResult(false, strErrorMessage);
                }

                foreach (int dataCenterID in userData.DataCenterIDs)
                {
                    UserDataCenterLink link = new UserDataCenterLink();
                    link.UserID = userData.UserID;
                    link.DataCenterID = dataCenterID;

                    if (m_dataManager.GetCreateManager().CreateAccountUserDataCenterLink(link, out strErrorMessage) == null)
                    {
                        m_dataManager.Rollback();
                        return new MessageResult(false, strErrorMessage);
                    }
                }
            }

            if (m_dataManager.Commit() == false)
            {
                m_dataManager.Rollback();
                return new MessageResult(false, "Database 트랜잭션이 실패하였습니다.");
            }

            return new MessageResult(true, "");
        }

        public ResponseDataCenterList GetSiteDataCenterList(RequestSiteDataCenters data, int userID)
        {
            string strErrorMessage;
            Dictionary<User.Fields, object> dicConditions2 = new Dictionary<User.Fields, object>();
            dicConditions2[User.Fields.ID] = userID;
            ArrayList arrDatas3 = m_dataManager.GetSelectManager().JoinUserUserDatas(dicConditions2, null, null, out strErrorMessage);

            if (arrDatas3 == null || arrDatas3.Count < 2)
                return new ResponseDataCenterList(false, "시스템 데이터베이스로부터 사용자 정보를 얻어오는데 실패하였습니다.");

            User _user = (User)arrDatas3[0];
            UserData _userData = (UserData)arrDatas3[1];

            if (data.SiteID != _userData.SiteID)
                return new ResponseDataCenterList(false, "허가되지 않은 정보에 접근중입니다.");

            Dictionary<Model.DataCenter.DataCenter.Fields, object> dicConditions = new Dictionary<Model.DataCenter.DataCenter.Fields, object>();
            dicConditions[Model.DataCenter.DataCenter.Fields.SiteID] = data.SiteID;

            ArrayList arrDatas2 = m_dataManager.GetSelectManager().JoinDataCenterDataCenterData(dicConditions, null, null, out strErrorMessage);

            if (arrDatas2 == null)
                return new ResponseDataCenterList(false, strErrorMessage);

            List<DataCenterEx> dataCenters = new List<DataCenterEx>();
            int nDataCount2 = arrDatas2.Count;

            for (int i=0;i<nDataCount2-1;i+=2)
            {
                if (arrDatas2[i] is Model.DataCenter.DataCenter && arrDatas2[i + 1] is Model.DataCenter.Data)
                {
                    DataCenterEx dataCenter = new DataCenterEx((Model.DataCenter.DataCenter)arrDatas2[i], (Model.DataCenter.Data)arrDatas2[i + 1]);
                    dataCenters.Add(dataCenter);
                }
            }

            if (data.UserID != null)
            {
                Dictionary<User.Fields, object> dicUserCondition = new Dictionary<User.Fields, object>();
                dicUserCondition[User.Fields.ID] = (int)data.UserID;
                ArrayList arrDatas = m_dataManager.GetSelectManager().JoinUserDataCenterDataCenterData(dicUserCondition, null, null, null, out strErrorMessage);

                if (arrDatas == null)
                    return new ResponseDataCenterList(false, strErrorMessage);

                Dictionary<int, int> dicDataCenters = new Dictionary<int, int>();
                int nDataCount = arrDatas.Count;

                User user = null;

                for (int i=0;i<nDataCount-2;i+=3)
                {
                    if (arrDatas[i] is User && arrDatas[i + 1] is Model.DataCenter.DataCenter)
                    {
                        Model.DataCenter.DataCenter center = (Model.DataCenter.DataCenter)arrDatas[i + 1];
                        dicDataCenters[center.ID] = center.ID;

                        user = (User)arrDatas[i];
                    }
                }

                if (user == null)
                    user = _user;

                // VDS 관리자는 모든 데이터센터를 볼수 있다.
                if (user != null && user.UserLevel > 1)
                {
                    for (int i = dataCenters.Count - 1; i >= 0; i--)
                    {
                        Model.DataCenter.DataCenter center = dataCenters[i];

                        if (dicDataCenters.ContainsKey(center.ID) == false)
                            dataCenters.RemoveAt(i);
                    }
                }
            }

            if (m_processManager.LoadManager.SetDataCenterRatio(dataCenters, out strErrorMessage) == false)
                return new ResponseDataCenterList(false, strErrorMessage);

            ResponseDataCenterList response = new ResponseDataCenterList(true, "");
            response.DataCenters.AddRange(dataCenters);
            return response;
        }

        public MessageResult CheckValidUserID(RequestValidUserID data)
        {
            Dictionary<User.Fields, object> dicConditions = new Dictionary<User.Fields, object>();
            dicConditions[User.Fields.UserID] = data.UserID;

            string strErrorMessage;
            List<User> users = m_dataManager.GetSelectManager().SelectAccountUsers(dicConditions, null, out strErrorMessage);

            if (users == null)
                return new MessageResult(false, strErrorMessage);

            if (users.Count > 0)
                return new MessageResult(false, "이미 사용중인 ID입니다.");

            return new MessageResult(true, "");
        }

        public static bool GetUserSiteID(IDataManager dataManager, int userID, out int siteID, out string strErrorMessage)
        {
            siteID = -1;

            UserData userData = dataManager.GetSelectManager().SelectAccountUserData(userID, out strErrorMessage);

            if (userData == null)
            {
                strErrorMessage = "시스템 데이터베이스로부터 사용자 정보를 조회할 수 없습니다.";
                return false;
            }

            siteID = userData.SiteID;
            return true;
        }

        public MessageResult CreateNewUser(RequestNewUser data, string strSalt, int userID)
        {
            string strErrorMessage;
            int siteID;

            if (GetUserSiteID(m_dataManager, userID, out siteID, out strErrorMessage) == false)
                return new MessageResult(false, strErrorMessage);

            if (siteID != data.SiteID)
                return new MessageResult(false, "다른 고객사의 사용자 계정을 생성하려고 시도하였습니다.");

            User user = new User();

            user.NickName = data.NickName;
            user.Password = data.Password;
            user.Salt = strSalt;
            user.UserLevel = data.LevelID;
            user.UserID = data.UserID;

            if (m_dataManager.BeginTransaction() == false)
                return new MessageResult(false, "Database 트랜잭션을 시작할 수 없습니다.");

            User _user = m_dataManager.GetCreateManager().CreateAccountUser(user, out strErrorMessage);

            if (_user == null)
            {
                m_dataManager.Rollback();
                return new MessageResult(false, strErrorMessage);
            }

            UserData userData = new UserData();

            userData.UserID = _user.ID;
            userData.Activate = true;
            userData.CompanyName = data.CompanyName;
            userData.Memo = data.Memo;
            userData.RegDate = DateTime.Now;
            userData.SiteID = data.SiteID;

            if (m_dataManager.GetCreateManager().CreateAccountUserData(userData, out strErrorMessage) == null)
            {
                m_dataManager.Rollback();
                return new MessageResult(false, strErrorMessage);
            }

            //data.DataCenterIDs
            foreach (int dataCenterID in data.DataCenterIDs)
            {
                UserDataCenterLink link = new UserDataCenterLink();

                link.UserID = _user.ID;
                link.DataCenterID = dataCenterID;
                
                if (m_dataManager.GetCreateManager().CreateAccountUserDataCenterLink(link, out strErrorMessage) == null)
                {
                    m_dataManager.Rollback();
                    return new MessageResult(false, strErrorMessage);
                }
            }

            if (m_dataManager.Commit() == false)
            {
                m_dataManager.Rollback();
                return new MessageResult(false, "Database 트랜잭션이 실패하였습니다.");
            }

            return new MessageResult(true, "");
        }

        public ResponseSiteLicense GetSiteLicense(RequestSiteLicense data, int userID)
        {
            string strErrorMessage;
            int siteID;

            if (GetUserSiteID(m_dataManager, userID, out siteID, out strErrorMessage) == false)
                return new ResponseSiteLicense(false, strErrorMessage);

            if (siteID != data.SiteID)
                return new ResponseSiteLicense(false, "허가되지 않은 정보에 접근중입니다.");

            Model.Site.Data siteData = m_dataManager.GetSelectManager().SelectSiteData(data.SiteID, out strErrorMessage);

            if (siteData == null)
            {
                if (strErrorMessage != null)
                    return new ResponseSiteLicense(false, strErrorMessage);
                else
                    return new ResponseSiteLicense(false, "Database로부터 고객사 정보를 찾을수 없습니다.");
            }

            Model.Site.Option option = m_dataManager.GetSelectManager().SelectSiteOption(Model.Site.Option.LicenseAlertDays, out strErrorMessage);

            if (option == null)
            {
                if (strErrorMessage != null)
                    return new ResponseSiteLicense(false, strErrorMessage);
                else
                    return new ResponseSiteLicense(false, "Database로부터 고객사 라이선스 옵션을 찾을수 없습니다.");
            }

            int days;

            if (int.TryParse(option.PropertyValue, out days) == false)
                return new ResponseSiteLicense(false, "Database에 고객사 라이선스 옵션이 존재하지 않습니다.");

            ResponseSiteLicense response = new ResponseSiteLicense(true, "");
            response.LicenseAlertDays = days;
            response.BeginDate = siteData.ServiceBeginDate;
            response.EndDate = siteData.ServiceEndDate;
            response.Validation = siteData.LicenseValidation;
            return response;
        }
    }
}
