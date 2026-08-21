using System.Collections.Generic;
using dnsDBUtil;
using Newtonsoft.Json.Linq;
using System.IO;

namespace SOPManager.BLL
{
    using Common.Model;
    using dnsEmail;
    using dnsSMS;
    using Npgsql.Internal.TypeHandlers;
    using SOPManager.BLL.Models;
    using SOPManager.BLL.Models.Request;
    using SOPManager.BLL.Models.Response;
    using SOPManager.IDAL;
    using SOPManager.Model.Sop.Account;
    using System;
    using System.Collections;
    using System.Text.RegularExpressions;
    using TeamEditor.Model.Sop.Team;

    public class AccountManager : IKakaoHelper
    {
        private class KakaoInfoEx : Common.Model.Option.KakaoInfo, IKakaoInfo
        {
            public KakaoInfoEx(Common.Model.Option.KakaoInfo info)
            {
                this.BsID = info.BsID;
                this.BsPasswd = info.BsPasswd;
                this.CountryCode = info.CountryCode;
                this.ID = info.ID;
                this.SenderKey = info.SenderKey;
            }
        }

        private static string key = new string(new char[] { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6' });

        // LoginFailLimit 이상 로그인 실패시(비밀번호 잘못 입력) 계정을 잠근다.(사용할수 없도록 한다.)
        private const int LoginFailLimit = 5;
        // 계정을 잠그는 시간
        private const int LockLoginMinutes = 30;

        public const string LoginFailMessage = "ID 또는 비밀번호를 잘못 입력하였습니다.";

        private IDataManager m_dataManager = null;
        private TeamEditor.IDAL.IDataManager m_teamDataManager = null;
        private Common.IDAL.IDataManager m_commonDataManager = null;
        private SDMS.IDAL.IDataManager m_sdmsDataManager = null;
        private ProcessManager m_processManager = null;

        public AccountManager(IDataManager manager, TeamEditor.IDAL.IDataManager teamDataManager, Common.IDAL.IDataManager commonDataManager, SDMS.IDAL.IDataManager sdmsDataManager, ProcessManager processManager)
        {
            m_dataManager = manager;
            m_teamDataManager = teamDataManager;
            m_processManager = processManager;
            m_commonDataManager = commonDataManager;
            m_sdmsDataManager = sdmsDataManager;
        }

        public Models.LoginResult Login(string strUserID, string strPW, string strSessionKey, bool isFullVersion, string strExternalLoginURL, bool autoLogin, string browserID)
        {
            LoginResult result = null;
            User user = null;
            Level level = null;
            string strErrorMessage = null;

            if (strExternalLoginURL != null && strExternalLoginURL.Length > 0)
            {
                result = ExternalLogin(strUserID, strPW, strExternalLoginURL, strSessionKey, autoLogin, isFullVersion, out user, out level);

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
                dicConditions[Model.Sop.Account.User.Fields.UserID] = strUserID;

                List<User> users = m_dataManager.GetSelectManager().SelectUsers(dicConditions, out strErrorMessage);
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
            }

            if (UpdateSession(user.ID, strSessionKey, autoLogin, browserID, out strErrorMessage) == false)
            {
                result.Success = false;
                result.Message = strErrorMessage;
                return result;
            }

            if (Update3DVersion(user.ID, isFullVersion.ToString().ToLower(), out strErrorMessage) == false)
            {
                result.Success = false;
                result.Message = strErrorMessage;
                return result;
            }

            level = m_dataManager.GetSelectManager().SelectLevel(user.UserLevel, out strErrorMessage);

            if (level == null)
            {
                result.Success = false;
                result.Message = strErrorMessage;
                return result;
            }

            // 로그인 성공 시 PasswordCode 초기화
            user.PasswordCode = null;
            if (m_dataManager.GetUpdateManager().UpdateUser(user) == false)
            {
                result.Success = false;
                result.Message = "PasswordCode 초기화 실패";
                return result;
            }

            result.User = Models.ApplicationUser.MakeUser(user, level, strSessionKey);
            result.Success = true;
            return result;
        }

        public Session CheckBrowserID(int userID, string strSessionKey)
        {

            string strErrorMessage;
            string nUserID = userID.ToString();

            Session result = new Session();

            // 해당 유저 세션 유무 확인
            Dictionary<Session.Fields, object> dicConditions_sessions = new Dictionary<Session.Fields, object>();
            dicConditions_sessions[Session.Fields.AccountUserID] = nUserID;

            List<Session> sessions = m_dataManager.GetSelectManager().SelectSessions(dicConditions_sessions, out strErrorMessage);
            if (sessions == null)
            {
                return null;
            }

            result = sessions[0];


            return result;
        }

        public Models.LoginResult AutoLogin(string strBeginCode, string strExternalLoginURL, string strKey)
        {
            if (strExternalLoginURL != null && strExternalLoginURL.Length > 0)
            {
                JObject jsonData = new JObject();

                jsonData.Add("beginCode", strBeginCode);

                JObject json = new JObject();
                json.Add("externalAutoLogin", jsonData);

                string strJson = json.ToString();

                byte[] bytes = System.Text.Encoding.UTF8.GetBytes(strJson);
                int len = bytes.Length;

                System.Net.HttpWebRequest request = (System.Net.HttpWebRequest)System.Net.WebRequest.Create(new Uri(strExternalLoginURL));
                request.Method = "POST";
                request.ContentType = "application/json; charset=utf-8";
                request.ContentLength = len + 3;

                string strResult = "";
                string strErrorMessage = null;

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

                    return GetExternalLoginResult(strResult, "unknown", strKey, true, null);
                }
                catch (System.Net.WebException ex)
                {
                    strErrorMessage = ex.Message;
                }

                return new LoginResult(false, strErrorMessage);
            }

            return new LoginResult(false, "자동 로그인을 위한 url이 설정되지 않았습니다.");
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

            m_dataManager.GetUpdateManager().UpdateUser(user);
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
                        m_dataManager.GetUpdateManager().UpdateUser(user);
                    }
                }
            }

            return true;
        }

        private LoginResult ExternalLogin(string strUserID, string strPW, string strExternalLoginURL, string strSessionKey, bool autoLogin, bool isFullVersion, out User user, out Level level)
        {
            user = null;
            level = null;

            JObject json = new JObject();
            json.Add("account", strUserID);
            json.Add("password", strPW);

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

                return GetExternalLoginResult(strResult, strUserID, strSessionKey, isFullVersion, null, autoLogin);
                /*string strUserName, strTeamName;
                bool success = GetJsonResult(JObject.Parse(strResult), out strUserID, out strUserName, out strTeamName, out strErrorMessage);

                List<Level> levels = m_dataManager.GetSelectManager().SelectLevels(null, out strErrorMessage);

                if (levels == null)
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }
                else if (levels.Count == 0)
                {
                    result.Success = false;
                    result.Message = "사용자 계정이 존재하지 않습니다.";
                    return result;
                }

                level = levels[0];

                user = new User();
                user.ID = 1;
                user.UserLevel = level.ID;
                user.UserID = strUserID;
                user.NickName = strUserName;

                result.Success = true;
                result.Message = "";
                return result;*/
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

        private LoginResult GetExternalLoginResult(string strResult, string strUserID, string strSessionKey, bool isFullVersion, string browserID, bool autoLogin = false)
        {
            string strErrorMessage;
            string strUserName, strTeamName;
            bool success = GetJsonResult(JObject.Parse(strResult), out strUserName, out strTeamName, out strErrorMessage);

            if (success == false)
                return new LoginResult(false, strErrorMessage);

            LoginResult result = new LoginResult();

            List<Level> levels = m_dataManager.GetSelectManager().SelectLevels(null, out strErrorMessage);

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

            List<User> users = m_dataManager.GetSelectManager().SelectUsers(dicConditions, out strErrorMessage);
            if (users == null)
            {
                result.Success = false;
                result.Message = strErrorMessage;
                return result;
            }
            else if (users.Count == 0)
            {   // 없으면 새로 생성
                user = m_dataManager.GetCreateManager().CreateUser(null, level.ID, strUserID, "", strUserName, m_dataManager.SiteID, MakeSalt());
                
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

                level = m_dataManager.GetSelectManager().SelectLevel(user.UserLevel, out strErrorMessage);

                if (level == null)
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }
            }

            if (UpdateSession(user.ID, strSessionKey, autoLogin, browserID, out strErrorMessage) == false)
            {
                result.Success = false;
                result.Message = strErrorMessage;
                return result;
            }

            if (Update3DVersion(user.ID, isFullVersion.ToString().ToLower(), out strErrorMessage) == false)
            {
                result.Success = false;
                result.Message = strErrorMessage;
                return result;
            }

            ApplicationUser loginUser = new ApplicationUser();
            loginUser.ID = user.ID;
            loginUser.Level = level.LevelName;
            loginUser.LevelID = level.ID;
            loginUser.NickName = strUserName;
            loginUser.UserID = strUserID;
            loginUser.SessionKey = strSessionKey;
            loginUser.SiteID = user.SiteID;

            result.Success = true;
            result.Message = "";
            result.User = loginUser;
            return result;
        }

        private bool GetJsonResult(JObject json, out string strUserName, out string strTeamName, out string strErrorMessage)
        {
            strUserName = strTeamName = null;
            strErrorMessage = null;

            if (json == null)
                return false;

            JToken tokenUser = json.GetValue("user");

            JToken tokenName = ((JObject)tokenUser).GetValue("user_name");
            JToken tokenTeamName = ((JObject)tokenUser).GetValue("user_division");
            JToken tokenSuccess = json.GetValue("success");

            if (tokenName == null || tokenTeamName == null)
                return false;

            strUserName = tokenName.Value<string>();

            if (tokenTeamName != null)
                strTeamName = tokenTeamName.Value<string>();

            if (tokenSuccess != null)
            {
                string strSuccess = tokenSuccess.Value<string>().ToLower();

                if (strSuccess == "true")
                    return true;
            }

            strErrorMessage = "ID 또는 비밀번호를 확인하세요.";
            return false;
        }

        private bool UpdateSession(int nUserID, string strSessionKey, bool autoLogin, string browserID, out string strErrorMessage)
        {
            strErrorMessage = "";

            // 해당 유저 세션 유무 확인
            Dictionary<Session.Fields, object> dicConditions_sessions = new Dictionary<Session.Fields, object>();
            dicConditions_sessions[Session.Fields.AccountUserID] = nUserID;

            List<Session> sessions = m_dataManager.GetSelectManager().SelectSessions(dicConditions_sessions, out strErrorMessage);
            if (sessions == null)
            {
                return false;
            }

            // 있으면 삭제 후 생성, 없으면 생성
            if (sessions.Count > 0)
            {
                string strCondition = "AccountUserID = " + nUserID;
                if (!m_dataManager.GetDeleteManager().DeleteSession(strCondition))
                {
                    strErrorMessage = m_dataManager.GetDeleteManager().GetErrorMessage();
                    return false;
                }
            }

            DateTime dtNow = DateTime.Now;

            Session session = m_dataManager.GetCreateManager().CreateSession(nUserID, strSessionKey, dtNow, dtNow, autoLogin, browserID);
            if (session == null)
            {
                strErrorMessage = m_dataManager.GetCreateManager().GetErrorMessage();
                return false;
            }

            return true;
        }

        private bool Update3DVersion(int nUserID, string strVersion, out string strErrorMessage)
        {
            strErrorMessage = "";

            // 해당 유저 3D 버전 확인
            Dictionary<Option.Fields, object> dicConditions = new Dictionary<Option.Fields, object>();
            dicConditions[Option.Fields.UserID] = nUserID;
            dicConditions[Option.Fields.Category] = "SDMS";
            dicConditions[Option.Fields.SubCategory] = "3DHighVer";

            List<Option> options = m_dataManager.GetSelectManager().SelectOptions(dicConditions, out strErrorMessage);
            if (options == null)
            {
                return false;
            }

            // 있으면 버전 확인 후 업데이트, 없으면 생성
            if (options.Count > 2)
            {   // 2개 이상이면 삭제 후 생성
                string strCondition = "UserID = " + nUserID;

                // 삭제
                if (m_dataManager.GetDeleteManager().DeleteOption(strCondition) == false)
                {
                    strErrorMessage = m_dataManager.GetDeleteManager().GetErrorMessage();
                    return false;
                }

                // 생성
                Option option = m_dataManager.GetCreateManager().CreateOption(nUserID, "SDMS", "3DHighVer", strVersion, "", "", "");
                if (option == null)
                {
                    strErrorMessage = m_dataManager.GetCreateManager().GetErrorMessage();
                    return false;
                }
            } 
            else if (options.Count == 1)
            {   // 확인 후 다르면 업데이트
                Option option = options[0];

                if (option.PropertyValue1 != strVersion)
                {
                    option.PropertyValue1 = strVersion;
                    
                    if (m_dataManager.GetUpdateManager().UpdateOption(option) == false)
                    {
                        strErrorMessage = m_dataManager.GetUpdateManager().GetErrorMessage();
                        return false;
                    }
                }
            }
            else
            {   // 없으면 생성
                Option option = m_dataManager.GetCreateManager().CreateOption(nUserID, "SDMS", "3DHighVer", strVersion, "", "", "");
                if (option == null)
                {
                    strErrorMessage = m_dataManager.GetCreateManager().GetErrorMessage();
                    return false;
                }
            }

            return true;
        }

        public ResponseAccountLevels GetAccountLevels()
        {
            ResponseAccountLevels response = new ResponseAccountLevels();
            string strErrorMessage;

            Dictionary<Level.Fields, object> dicCondition = new Dictionary<Level.Fields, object>();

            List<Level> listLevels = m_dataManager.GetSelectManager().SelectLevels(dicCondition, out strErrorMessage);
            if (listLevels != null && listLevels.Count > 0)
            {
                response.AccountLevels = listLevels;

                response.Success = true;
                response.Message = strErrorMessage;
            }
            else
            {
                response.Success = false;
                response.Message = "Account Level 조회를 할 수 없습니다.";
            }

            return response;
        }

        public MessageResult RemoveAccountUsers(List<AccountUser> accountUsers)
        {
            MessageResult result = new MessageResult();
            string strErrorMessage = "";

            foreach (AccountUser accountUser in accountUsers)
            {
                // 해당 계정의 옵션 삭제
                Dictionary<Option.Fields, object> dicConditions_option = new Dictionary<Option.Fields, object>();
                dicConditions_option[Option.Fields.UserID] = accountUser.AccountID;

                List<Option> options = m_dataManager.GetSelectManager().SelectOptions(dicConditions_option, out strErrorMessage);
                if (options == null)
                {
                    result.Message = strErrorMessage;
                    result.Success = false;
                    return result;
                }

                foreach (Option option in options)
                {
                    if (!m_dataManager.GetDeleteManager().DeleteOption(option.ID))
                    {
                        result.Message = "RemoveAccountUsers 에러 (DeleteOption 실패)";
                        result.Success = false;
                        return result;
                    }
                }

                // 해당 계정에 세션 삭제
                Dictionary<Session.Fields, object> dicConditions_session = new Dictionary<Session.Fields, object>();
                dicConditions_session[Session.Fields.AccountUserID] = accountUser.AccountID;

                List<Session> sessions = m_dataManager.GetSelectManager().SelectSessions(dicConditions_session, out strErrorMessage);
                if (sessions == null)
                {
                    result.Message = strErrorMessage;
                    result.Success = false;
                    return result;
                }

                foreach (Session session in sessions)
                {
                    if (!m_dataManager.GetDeleteManager().DeleteSession(session.ID))
                    {
                        result.Message = "RemoveAccountUsers 에러 (DeleteSession 실패)";
                        result.Success = false;
                        return result;
                    }
                }
                
                if (m_dataManager.GetDeleteManager().DeleteUser(accountUser.AccountID) == false)
                {
                    result.Success = false;
                    result.Message = "DeleteUser 실패";
                    return result;
                }
            }

            result.Success = true;
            return result;
        }

        public MessageResult UpdateAccountUsers(RequestAccountUser requestData)
        {
            List<AccountUser> accountUsers = requestData.AccountUsers;
            int accessedUserID = requestData.AccessedUserID;
            MessageResult result = new MessageResult();

            Common.BLL.ProcessManager commonProcessManager =
                new Common.BLL.ProcessManager(m_processManager.CommonDataManager, m_processManager.SopDataManager, m_processManager.TeamDataManager, m_processManager.SDMSDataManager);

            Common.BLL.SaveManager commonSaveManager = commonProcessManager.GetSaveManager();

            foreach (AccountUser accountUser in accountUsers)
            {
                if (accountUser.AccountID == -1)
                {   // 계정이 없는 경우
                    if (accountUser.Regular.SiteID.HasValue == false)
                    {
                        result.Success = false;
                        result.Message = "해당 유저 Regular의 SiteID가 없습니다. (UserID: " + accountUser.UserID + ", RegularID: " + accountUser.Regular.ID + ")";
                        return result;
                    }

                    string strUserID = "";
                    string strNickName = "";
                    string strPassword = "";
                    int nMemberID = -1;
                    int nUserLevel = -1;
                    int nSiteID = accountUser.Regular.SiteID.Value;

                    // 아이디는 사번 또는 이름
                    if (accountUser.MemberID != null && accountUser.MemberID != "")
                        strUserID = accountUser.MemberID;
                    else if (accountUser.MemberName != null && accountUser.MemberName != "")
                        strUserID = accountUser.MemberName;
                    else
                    {
                        result.Success = false;
                        result.Message = "해당 인원의 이름 또는 사번을 입력해주세요.";
                        return result;
                    }

                    // 비밀번호는 휴대폰 뒷자리 7 or 8자리 >> 없을 경우 1234 부여
                    strPassword = accountUser.UserID;

                    // 닉네임은 이름
                    strNickName = accountUser.MemberName;

                    nMemberID = accountUser.ID;
                    nUserLevel = accountUser.AccountLevel.ID;

                    // 계정 생성
                    if (m_dataManager.GetCreateManager().CreateUser(nMemberID, nUserLevel, strUserID, strPassword, strNickName, nSiteID, MakeSalt()) == null)
                    {
                        result.Success = false;
                        result.Message = "CreateUser 실패";
                        return result;
                    }

                    commonSaveManager.SaveUserHistory_ModifyUserAuth(accessedUserID, accountUser.ID, -1);
                }
                else
                {   // 계정이 존재하는 경우
                    if (accountUser.Regular.SiteID.HasValue == false)
                    {
                        result.Success = false;
                        result.Message = "해당 유저 Regular의 SiteID가 없습니다. (UserID: " + accountUser.UserID + ", RegularID: " + accountUser.Regular.ID + ")";
                        return result;
                    }

                    User user = new User();
                    user.ID = accountUser.AccountID;
                    user.MemberID = accountUser.ID;
                    user.NickName = accountUser.NickName;
                    user.Password = accountUser.Password;
                    user.SiteID = accountUser.Regular.SiteID.Value;
                    user.UserID = accountUser.UserID;
                    user.UserLevel = accountUser.AccountLevel.ID;

                    string strErrorMessage = null;
                    User orgUser = m_dataManager.GetSelectManager().SelectUser(user.ID, out strErrorMessage);
                    if (orgUser == null)
                        continue;

                    if (m_dataManager.GetUpdateManager().UpdateUser(user) == false)
                    {
                        result.Success = false;
                        result.Message = "UpdateUser 실패";

                        return result;
                    }

                    commonSaveManager.SaveUserHistory_ModifyUserAuth(accessedUserID, accountUser.ID, orgUser.UserLevel);
                }
            }

            result.Success = true;
            return result;
        }

        public MessageResult UpdateAccountUsers2(RequestAccountUser requestData)
        {
            List<AccountUser> accountUsers = requestData.AccountUsers;
            int accessedUserID = requestData.AccessedUserID;
            MessageResult result = new MessageResult();

            Common.BLL.ProcessManager commonProcessManager =
                new Common.BLL.ProcessManager(m_processManager.CommonDataManager, m_processManager.SopDataManager, m_processManager.TeamDataManager, m_processManager.SDMSDataManager);

            Common.BLL.SaveManager commonSaveManager = commonProcessManager.GetSaveManager();

            string strErrorMessage = null;
            string strUserIDs = null;
            List<User> users = new List<User>();

            foreach (AccountUser accountUser in accountUsers)
            {
                if (accountUser.AccountID > 0)
                {
                    if (strUserIDs == null)
                        strUserIDs = accountUser.AccountID.ToString();
                    else
                        strUserIDs += "," + accountUser.AccountID.ToString();
                }
            }

            if (strUserIDs?.Length > 0)
            {
                string strCondition = $"{User.Fields.ID} in ({strUserIDs})";

                users = m_dataManager.GetSelectManager().SelectUsers(strCondition, out strErrorMessage);
                if (users == null)
                {
                    result.Success = false;
                    result.Message = $"1. UpdateAccountUsers2 실패 (SelectUsers error: {strErrorMessage})";
                    return result;
                }
            }

            IDataManager dataManager = m_dataManager.Clone();
            if (dataManager.BeginBatch() == false)
            {
                result.Success = false;
                result.Message = "2. UpdateAccountUsers2 실패 (BeginBatch error)";
                return result;
            }

            try
            {
                foreach (AccountUser accountUser in accountUsers)
                {
                    if (accountUser.AccountID == -1)
                    {   // 계정이 없는 경우
                        string strUserID = "";
                        string strNickName = "";
                        string strPassword = "";
                        int nMemberID = -1;
                        int nUserLevel = -1;
                        int nSiteID = accountUser.Site.ID;

                        // 아이디는 사번
                        strUserID = accountUser.MemberID;
                        // 닉네임은 이름
                        strNickName = accountUser.MemberName;
                        // 비밀번호는 임시 1234 부여
                        strPassword = "1234";

                        // 비밀번호 암호화
                        string strSalt = MakeSalt();
                        strPassword = EncryptPassword(strPassword, strSalt);
                        /*strPassword += strSalt;
                        System.Security.Cryptography.SHA256Managed sha256Managed = new System.Security.Cryptography.SHA256Managed();
                        byte[] encryptBytes = sha256Managed.ComputeHash(System.Text.Encoding.UTF8.GetBytes(strPassword));
                        strPassword =  BitConverter.ToString(encryptBytes).Replace("-", "").ToLower();*/

                        nMemberID = accountUser.ID;
                        nUserLevel = accountUser.AccountLevel.ID;

                        if (nUserLevel < 0)
                            continue;

                        // 계정 생성
                        if (dataManager.GetCreateManager().CreateUser(nMemberID, nUserLevel, strUserID, strPassword, strNickName, nSiteID, strSalt) == null)
                        {
                            dataManager.BatchRollback();

                            result.Success = false;
                            result.Message = "3. UpdateAccountUsers2 실패 (CreateUser error)";
                            return result;
                        }

                        commonSaveManager.SaveUserHistory_ModifyUserAuth(accessedUserID, accountUser.ID, -1);
                    }
                    else
                    {   // 계정이 존재하는 경우

                        //User user = m_dataManager.GetSelectManager().SelectUser(accountUser.AccountID, out strErrorMessage);
                        User user = users.Find(x => x.ID == accountUser.AccountID);
                        if (user == null)
                        {
                            dataManager.BatchRollback();

                            result.Success = false;
                            result.Message = "4. UpdateAccountUsers2 실패 (SelectUser error: 해당 계정 조회 실패)";
                            return result;
                        }

                        int nOrgUserLevel = user.UserLevel;

                        user.SiteID = accountUser.Site.ID;
                        user.UserLevel = accountUser.AccountLevel.ID;

                        if (user.UserLevel < 0)
                        {   // 삭제
                            if (DeleteUser(dataManager, user.ID, out strErrorMessage) == false)
                            //if (dataManager.GetDeleteManager().DeleteUser(user.ID) == false)
                            {
                                dataManager.BatchRollback();
                                System.Diagnostics.Trace.WriteLine(strErrorMessage);

                                result.Success = false;
                                result.Message = "5-1. UpdateAccountUsers2 실패 (DeleteUser error)";
                                return result;
                            }
                        }
                        else
                        {   // 업데이트
                            if (dataManager.GetUpdateManager().UpdateUser(user) == false)
                            {
                                dataManager.BatchRollback();

                                result.Success = false;
                                result.Message = "5-2. UpdateAccountUsers2 실패 (UpdateUser error)";
                                return result;
                            }
                        }
                        

                        commonSaveManager.SaveUserHistory_ModifyUserAuth(accessedUserID, accountUser.ID, nOrgUserLevel);
                    }
                }

                if (dataManager.BatchCommit() == false)
                {
                    dataManager.BatchRollback();

                    result.Success = false;
                    result.Message = "6. UpdateAccountUsers2 실패 (BatchCommit error)";
                    return result;
                }

                result.Success = true;
                return result;

            }
            catch (Exception ex)
            {
                dataManager.BatchRollback();

                result.Success = false;
                result.Message = ex.Message;
                return result;
            }
        }

        private bool DeleteUser(IDataManager dataManager, int userID, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = {1}", Session.Fields.AccountUserID, userID);
            
            if (dataManager.GetDeleteManager().DeleteSession(strCondition) == false)
            {
                strErrorMessage = dataManager.GetDeleteManager().GetErrorMessage();
                return false;
            }

            strCondition = string.Format("{0} = {1}", Option.Fields.UserID, userID);

            if (dataManager.GetDeleteManager().DeleteOption(strCondition) == false)
            {
                strErrorMessage = dataManager.GetDeleteManager().GetErrorMessage();
                return false;
            }

            if (dataManager.GetDeleteManager().DeleteUser(userID) == false)
            {
                strErrorMessage = dataManager.GetDeleteManager().GetErrorMessage();
                return false;
            }

            strErrorMessage = null;
            return true;
        }

        private string EncryptPassword(string strPassword, string strSalt)
        {
            strPassword += strSalt;
            System.Security.Cryptography.SHA256Managed sha256Managed = new System.Security.Cryptography.SHA256Managed();
            byte[] encryptBytes = sha256Managed.ComputeHash(System.Text.Encoding.UTF8.GetBytes(strPassword));
            return BitConverter.ToString(encryptBytes).Replace("-", "").ToLower();
        }

        public MessageResult ReRegisterAccountUsers(List<AccountUser> accountUsers)
        {
            MessageResult result = new MessageResult();

            foreach (AccountUser accountUser in accountUsers)
            {
                if (accountUser.Regular.SiteID.HasValue == false)
                {
                    result.Success = false;
                    result.Message = "해당 유저 Regular의 SiteID가 없습니다. (UserID: " + accountUser.UserID + ", RegularID: " + accountUser.Regular.ID + ")";
                    return result;
                }

                int nMemberID = accountUser.ID;
                string strNickName = accountUser.NickName;
                string strPassword = accountUser.Password;
                int nSiteID = accountUser.Regular.SiteID.Value;
                string strUserID = accountUser.UserID;
                int nUserLevel = accountUser.AccountLevel.ID;

                // 계정 생성
                if (m_dataManager.GetCreateManager().CreateUser(nMemberID, nUserLevel, strUserID, strPassword, strNickName, nSiteID, MakeSalt()) == null)
                {
                    result.Success = false;
                    result.Message = "CreateUser 실패";
                    return result;
                }
            }

            result.Success = true;
            return result;
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

            List<RegularMember> members = m_teamDataManager.GetSelectManager().SelectRegularMembers(dicConditions, null, out strErrorMessage);

            if (members == null)
                return null;
            else if (members.Count == 0)
            {
                strErrorMessage = "존재하지 않는 계정입니다.\r\n입력한 정보를 다시 확인해주세요.";
                return null;
            }

            return members[0];
        }

        public IKakaoInfo GetKakaoInfo()
        {
            string strErrorMessage = null;
            Common.Model.Option.KakaoInfo info = m_commonDataManager.GetSelectManager().SelectKakaoInfo(out strErrorMessage);

            return new KakaoInfoEx(info);
        }

        public string MakeMessage(int nSensorReactionHistoryID, ref string strTmpltCode, ref string strTitle)
        {
            string returnMessage = "";
            string strErrorMessage = null;

            string strCondition = string.Format("{0}.ReactionType in (0, 21, 50) And {0}.ID = {1}", SDMS.Model.History.SensorReactionHistory.TableName, nSensorReactionHistoryID);

            ArrayList arrResult = m_sdmsDataManager.GetSelectManager().JoinHistroysensorreactionSpatialequipmentzoneSensorZone(null, null, null, strCondition, out strErrorMessage);

            if (arrResult == null || arrResult.Count != 3)
                return "";

            SDMS.Model.History.SensorReactionHistory reactionHistory = arrResult[0] as SDMS.Model.History.SensorReactionHistory;
            SDMS.Model.Spatial.EquipmentZone equipmentZone = arrResult[1] as SDMS.Model.Spatial.EquipmentZone;
            SDMS.Model.Sensor.SensorZone sensorZone = arrResult[2] as SDMS.Model.Sensor.SensorZone;

            string varFacilityType = "";
            string varDateTime = reactionHistory.Time.ToString("yyyy-MM-dd HH:mm:ss");
            string varTest = reactionHistory.Message.Contains("[테스트]") ? "[테스트]" : "";
            string varBuilding = equipmentZone.ZoneName;

            if (sensorZone.SensorType == (int)dnsData.Sensor.Facility.FacilityType.FIRE_SENSOR)
                varFacilityType = "화재";
            else if (sensorZone.SensorType == (int)dnsData.Sensor.Facility.FacilityType.PSM_SENSOR)
                varFacilityType = "누출";
            else if (sensorZone.SensorType == (int)dnsData.Sensor.Facility.FacilityType.BLACKOUT)
                varFacilityType = "정전";
            else if (sensorZone.SensorType == (int)dnsData.Sensor.Facility.FacilityType.STRONG_WIND)
                varFacilityType = "강풍";
            else if (sensorZone.SensorType == (int)dnsData.Sensor.Facility.FacilityType.SUBMERGENCY)
                varFacilityType = "침수";
            else if (sensorZone.SensorType == (int)dnsData.Sensor.Facility.FacilityType.TERROR)
                varFacilityType = "테러";
            else if (sensorZone.SensorType == (int)dnsData.Sensor.Facility.FacilityType.Earthquake)
                varFacilityType = "지진";

            strTitle = varFacilityType + " 알람 ";

            if (reactionHistory.ReactionType == SDMS.Model.History.SensorReactionHistory.ReactionTypes.BEGIN_STATUS) // 알람 탐지
            {
                strTmpltCode = "alarm_detect";
                strTitle += "탐지";
                returnMessage = string.Format("SOP 시스템 {0} 알람 탐지\n{1}\n{2}[{3}]에서 {0} 신호가 탐지되었습니다.", varFacilityType, varDateTime, varTest, varBuilding);
            }
            else if (reactionHistory.ReactionType == SDMS.Model.History.SensorReactionHistory.ReactionTypes.MALFUNCTION) // 알람 오작동
            {
                strTmpltCode = "alarm_malfunction";
                strTitle += "오작동";
                returnMessage = string.Format("SOP 시스템 {0} 알람 오작동\n{1}\n{2}[{3}]에서 탐지된 {0} 신호가 오작동으로 신고되었습니다.", varFacilityType, varDateTime, varTest, varBuilding);
            }
            else if (reactionHistory.ReactionType == SDMS.Model.History.SensorReactionHistory.ReactionTypes.END_STATUS) // 알람 복구
            {
                strTmpltCode = "alarm_clear";
                strTitle += "복구";
                returnMessage = string.Format("SOP 시스템 {0} 알람 복구\n{1}\n{2}[{3}]에서 탐지된 {0} 신호가 복구되었습니다.", varFacilityType, varDateTime, varTest, varBuilding);
            }

            return returnMessage;
        }

        public MessageResult ChangePassword(string strName, string strData, string strPW, string strPwHash, int nMode)
        {
            MessageResult result = new MessageResult();

            // 해당 계정을 조회 및 멤버 조회
            string strErrorMessage = "";
            string strCondition = "";

            if (nMode == 0)
            {   // Email
                strCondition = "MemberName = '" + strName + "' AND Email = '" + strData + "'";
            }
            else if (nMode == 1)
            {   // SMS
                string strPhoneNumber = EncryptString(strData);
                strCondition = "MemberName = '" + strName + "' AND PhoneNumber = '" + strPhoneNumber + "'";
            }
            else
            {
                result.Success = false;
                result.Message = "데이터가 잘못 전달되었습니다.";
                return result;
            }

            List<RegularMember> members = m_teamDataManager.GetSelectManager().SelectRegularMembers(strCondition, out strErrorMessage);
            if (members == null)
            {
                result.Success = false;
                result.Message = strErrorMessage;
                return result;
            }
            else if (members.Count == 0)
            {
                result.Success = false;
                result.Message = "해당 계정이 없습니다.";
                return result;
            } 

            RegularMember member = members[0];

            Dictionary<User.Fields, object> dicConditions = new Dictionary<User.Fields, object>();
            dicConditions[User.Fields.MemberID] = member.ID;
            List<User> users = m_dataManager.GetSelectManager().SelectUsers(dicConditions, out strErrorMessage);
            if (users == null)
            {
                result.Success = false;
                result.Message = strErrorMessage;
                return result;
            }
            else if (users.Count == 0)
            {
                result.Success = false;
                result.Message = "해당 계정이 없습니다.";
                return result;
            }

            User user = users[0];

            if (CheckLoginFailCount(user, "비밀번호 찾기를", out strErrorMessage) == false)
            {
                result.Success = false;
                result.Message = strErrorMessage;
                return result;
            }

            string strResultMsg = "";

            if (nMode == 0)
            {   
                // 이메일 여부 확인
                if (member.Email == "" || member.Email == null ||
                !Regex.IsMatch(member.Email, @"[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?"))
                {
                    result.Success = false;
                    result.Message = "해당 계정에 대한 이메일 정보가 없거나 잘못 되었습니다.";
                    return result;
                }

                // 임시 비밀번호 업데이트
                user.Password = strPwHash;
                if (m_dataManager.GetUpdateManager().UpdateUser(user) == false)
                {
                    result.Success = false;
                    result.Message = "임시 비밀번호 업데이트 실패.";
                    return result;
                }

                // 이메일 발송
                string strEmailTitle = "", strMessage = "", strSubject = "";

                strSubject = "임시 비밀번호 입니다.";

                strMessage = "임시 비밀번호 입니다.\r\n";
                strMessage += "ID는 " + user.UserID + " 이며,\r\n";
                strMessage += "비밀번호는 " + strPW + " 입니다.\r\n";
                strMessage += "로그인하여 비밀번호 변경 부탁드리겠습니다.\r\n\r\n";
                strMessage = string.Format("안녕하세요. {0}님\r\n\r\n", member.MemberName) + strMessage;

                strEmailTitle = "비밀번호 변경안내";

                if (m_dataManager.SiteID == 12)
                {   // 녹십자 카카오웍스 방식
                    IMessageClient client = MessageClientFactory.CreateMessageClient(this/*m_commonDataManager, m_sdmsDataManager*/);

                    List<string> strEmails = new List<string>();
                    strEmails.Add(member.Email);

                    MessageContent content = new MessageContent();
                    content.Caller = "";
                    content.EMails.AddRange(strEmails);
                    content.Message = strMessage;

                    if (client.SendSMS(content) == true)
                    {
                        strResultMsg = "카카오웍스가 전송되었습니다. 확인부탁드립니다.";
                    }
                    else
                    {
                        result.Success = false;
                        result.Message = "카카오웍스 전송이 실패하였습니다. (카카오웍스 실패) 관리자에게 문의바랍니다.";
                        return result;
                    }
                } 
                else
                {   // 기존 이메일 전송 방식
                    IEmailClient clientMail = EmailClientFactory.CreateMailClient();

                    if (clientMail != null)
                    {
                        Dictionary<string, string> dicMail = new Dictionary<string, string>();
                        dicMail[member.Email] = member.Email;

                        EmailContent contents = new EmailContent();
                        contents.EmailList.AddRange(dicMail.Values);
                        contents.Message = strMessage;

                        contents.Title = strEmailTitle;
                        contents.Subject = strSubject;
                        contents.TimeStamp = System.DateTime.Now;

                        // 수신자번호 가운데 빈문자열이 있으면 없앤다.
                        int nIndex = contents.EmailList.IndexOf("");

                        if (nIndex >= 0)
                            contents.EmailList.RemoveAt(nIndex);

                        if (clientMail.SendEmail(contents, ref strResultMsg) == false)
                        {
                            result.Success = false;
                            result.Message = "관리자에게 문의바람. " + strResultMsg;
                            return result;
                        }
                    }

                }

                
            }
            else if (nMode == 1)
            {
                // 핸드폰 여부 확인
                if (member.PhoneNumber == "" || member.PhoneNumber == null)
                {
                    result.Success = false;
                    result.Message = "해당 계정에 대한 핸드폰 정보가 없거나 잘못 되었습니다.";
                    return result;
                }

                // 임시 비밀번호 업데이트
                user.Password = strPwHash;
                if (m_dataManager.GetUpdateManager().UpdateUser(user) == false)
                {
                    result.Success = false;
                    result.Message = "임시 비밀번호 업데이트 실패.";
                    return result;
                }

                IMessageClient client = MessageClientFactory.CreateMessageClient(this/*m_commonDataManager, m_sdmsDataManager*/);
                if (client != null)
                {
                    string strMessage = "";
                    strMessage = "임시 비밀번호 입니다.\r\n";
                    strMessage += "ID는 " + user.UserID + " 이며,\r\n";
                    strMessage += "비밀번호는 " + strPW + " 입니다.\r\n";
                    strMessage += "로그인하여 비밀번호 변경 부탁드리겠습니다.\r\n\r\n";

                    string strPhoneNumber = DecryptString(member.PhoneNumber);

                    List<string> strPhoneNumbers = new List<string>();
                    strPhoneNumbers.Add(strPhoneNumber);

                    MessageContent content = new MessageContent();
                    content.Caller = "";
                    content.PhoneNumbers.AddRange(strPhoneNumbers);
                    content.Message = strMessage;

                    if (client.SendSMS(content) == true)
                    {
                        strResultMsg = "SMS가 전송되었습니다. 확인부탁드립니다.";
                    } 
                    else
                    {
                        result.Success = false;
                        result.Message = "SMS 전송이 실패하였습니다. (SendSMS 실패) 관리자에게 문의바랍니다.";
                        return result;
                    }
                }
            }

            result.Success = true;
            result.Message = strResultMsg;
            return result;
        }

        public bool CheckParamsCode(string strCode, out int nID, out string strUserName, out string strUserID, out string strResultMessage)
        {
            strUserName = strUserID = strResultMessage = "";
            nID = -1;

            MessageResult result = new MessageResult();

            try
            {
                string strData = DecryptString(strCode);
                string[] tokens = strData.Split('_');

                if (tokens.Length != 4)
                {
                    strResultMessage = "유효하지 않은 Code입니다.";
                    return false;
                }

                string strID = tokens[0].Trim();
                strUserID = tokens[1].Trim();
                string strTime = tokens[2].Trim();
                string strCheckSum = tokens[3].Trim();

                long time;

                if (int.TryParse(strID, out nID) == false ||
                    long.TryParse(strTime, out time) == false)
                {
                    strResultMessage = "유효하지 않은 Code입니다.";
                    return false;
                }

                System.DateTime timeStamp = System.DateTime.FromBinary(time);

                if (strCheckSum != (timeStamp.Millisecond + nID).ToString())
                {
                    strResultMessage = "유효하지 않은 Code입니다.";
                    return false;
                }

                User member = m_dataManager.GetSelectManager().SelectUser(nID, out strResultMessage);

                if (member == null || strResultMessage != null)
                    return false;

                if (member.UserID != strUserID ||
                    member.PasswordCode != strTime)
                {
                    strResultMessage = "유효하지 않은 Code입니다.";
                    return false;
                }

                strUserName = member.NickName;
                strResultMessage = "";
                return true;
            }
            catch (Exception e)
            {
                strResultMessage = e.Message;
            }

            return false;
        }

        public MessageResult SetPassword(int nID, string strPW, string strNewPW)
        {
            MessageResult result = new MessageResult();

            string strErrorMessage = null;
            User user = m_dataManager.GetSelectManager().SelectUser(nID, out strErrorMessage);
            if (user == null)
            {
                result.Success = false;
                result.Message = strErrorMessage;
                return result;
            } 
            else if (user.Password != strPW)
            {
                result.Success = false;
                result.Message = "기존 비밀번호가 맞지 않습니다. 확인바랍니다.";
                return result;
            }

            user.Password = strNewPW;
            user.PasswordCode = null;

            if (m_dataManager.GetUpdateManager().UpdateUser(user))
            {
                result.Success = true;
                return result;
            }
            else
            {
                result.Success = false;
                strErrorMessage = "비밀번호 업데이트를 실패하였습니다.";
                return result;
            }
        }

        public ResponseAccountUsers GetAccountUsers(int? nSiteID)
        {
            ResponseAccountUsers response = new ResponseAccountUsers();
            string strErrorMessage;

            

            // JobLevel 불러오기
            string strCondition = " PropertyName = 'JobLevel'";
            List<Options> options = m_teamDataManager.GetSelectManager().SelectOptions(strCondition, out strErrorMessage);
            if (options == null)
            {
                response.Success = false;
                response.Message = strErrorMessage;
                return response;
            }

            Dictionary<int, JobLevel> dicJobLevel = new Dictionary<int, JobLevel>();
            foreach(Options option in options)
            {
                JobLevel level = new JobLevel();
                level.ID = option.PropertyID;
                level.Name = option.PropertyValue;

                dicJobLevel[option.PropertyID] = level;
            }

            // JobPosition 불러오기
            strCondition = " PropertyName = 'JobPosition'";
            options = m_teamDataManager.GetSelectManager().SelectOptions(strCondition, out strErrorMessage);
            if (options == null)
            {
                response.Success = false;
                response.Message = strErrorMessage;
                return response;
            }

            Dictionary<int, JobPosition> dicJobPosition = new Dictionary<int, JobPosition>();
            foreach (Options option in options)
            {
                JobPosition position = new JobPosition();
                position.ID = option.PropertyID;
                position.Name = option.PropertyValue;

                dicJobPosition[option.PropertyID] = position;
            }

            // 계정 정보 불러오기
            Dictionary<User.Fields, object> dicConditions = new Dictionary<User.Fields, object>();
            if (nSiteID.HasValue)
                dicConditions[User.Fields.SiteID] = nSiteID.Value;

            List<User> users = m_dataManager.GetSelectManager().SelectUsers(dicConditions, out strErrorMessage);
            if (users == null)
            {
                response.Success = false;
                response.Message = strErrorMessage;
                return response;
            }

            // 계정 권한 불러오기
            Dictionary<Level.Fields, object> dicLevelConditions = new Dictionary<Level.Fields, object>();
            List<Level> levels = m_dataManager.GetSelectManager().SelectLevels(dicLevelConditions, out strErrorMessage);
            if (levels == null)
            {
                response.Success = false;
                response.Message = strErrorMessage;
                return response;
            }

            // 사이트 정보 불러오기
            List<Site> sites = m_commonDataManager.GetSelectManager().SelectSites(null, out strErrorMessage);
            if (sites == null)
            {
                response.Success = false;
                response.Message = strErrorMessage;
                return response;
            }


            // 정규 조직원 정보 불러오기
            strCondition = string.Format("{0}.{1} is NOT NULL AND {0}.{1} != '' AND {0}.{2} is NOT NULL AND {0}.{2} != ''", RegularMember.GetTableName(), RegularMember.Fields.MemberID, RegularMember.Fields.Email);

            if (nSiteID.HasValue)
                strCondition += string.Format(" AND {0}.{1} = {2}", Regular.GetTableName(), Regular.Fields.SiteID, nSiteID.Value.ToString());

            if (m_dataManager.SiteID == 15)
                strCondition = null;

            ArrayList arrDatas = m_teamDataManager.GetSelectManager().JoinRegularRegularMember(strCondition, out strErrorMessage);

            if (arrDatas == null)
            {
                response.Success = false;
                response.Message = strErrorMessage;
                return response;
            }

            int nDataCount = arrDatas.Count;

            List<AccountUser> accountUsers = new List<AccountUser>();

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is Regular && arrDatas[i + 1] is RegularMember)
                {
                    Regular regular = (Regular)arrDatas[i];
                    RegularMember regularMember = (RegularMember)arrDatas[i + 1];

                    AccountUser accountUser = new AccountUser();
                    accountUser.ID = regularMember.ID;
                    accountUser.Regular = regular;
                    accountUser.MemberID = regularMember.MemberID;
                    accountUser.MemberName = regularMember.MemberName;
                    accountUser.Email = regularMember.Email;

                    if (regularMember.OfficePhoneNumber != null)
                        accountUser.OfficePhoneNumber = regularMember.OfficePhoneNumber;

                    if (regularMember.PhoneNumber != null)
                        accountUser.PhoneNumber = DecryptString(regularMember.PhoneNumber);

                    if (regularMember.JobLevelID != null && dicJobLevel.ContainsKey((int)regularMember.JobLevelID))
                        accountUser.JobLevel = dicJobLevel[(int)regularMember.JobLevelID];

                    if (regularMember.JobPositionID != null && dicJobPosition.ContainsKey((int)regularMember.JobPositionID))
                        accountUser.JobPosition = dicJobPosition[(int)regularMember.JobPositionID];

                    User user = users.Find(x => x.MemberID == regularMember.ID);
                    if (user != null)
                    {
                        accountUser.AccountID = user.ID;
                        accountUser.UserID = user.UserID;
                        accountUser.NickName = user.NickName;
                        accountUser.Password = user.Password;

                        Level level = levels.Find(x => x.ID == user.UserLevel);
                        if (level != null)
                            accountUser.AccountLevel = level;

                        Site site = sites.Find(x => x.ID == user?.SiteID);
                        if (site != null)
                            accountUser.Site = site;
                    }

                    accountUsers.Add(accountUser);
                }
            }

            response.Success = true;
            response.AccountUsers = accountUsers;

            return response;
        }

        public LoginResult CheckLoginSession(int nUserID, string strSessionKey)
        {
            LoginResult result = new LoginResult();

            try
            {
                Dictionary<Session.Fields, object> dicConditions = new Dictionary<Session.Fields, object>();
                dicConditions[Session.Fields.AccountUserID] = nUserID;
                //dicConditions[Session.Fields.SessionKey] = strSessionKey;

                //List<Session> sessions = m_dataManager.GetSelectManager().SelectSessions(dicConditions, out strResultMessage);

                //if (sessions == null)
                //    return false;
                //else if (sessions.Count == 0)
                //{
                //    strResultMessage = "해당 유저 Session은 존재하지 않습니다.";
                //    return false;
                //}
                //else
                //{
                //    Session session = sessions[0];

                //    if (session.SessionKey == strSessionKey)
                //    {
                //        // 자동 로그인 확인 여부
                //        if (session.IsAutoLogin == false)
                //        {   // 자동 로그인이 아니라면
                //            // 마지막 Session 업데이트 시간 체크(현 시간으로부터 300초 이내인지)
                //            DateTime dtSession = session.UpdateDate;
                //            DateTime dtNow = DateTime.Now;

                //            TimeSpan diffTime = dtNow - dtSession;
                //            double dSecond = diffTime.TotalSeconds;

                //            if (dSecond > 300)
                //            {
                //                strResultMessage = "로그아웃 되었습니다.";
                //                return false;
                //            }
                //            else
                //            {
                //                session.UpdateDate = DateTime.Now;
                //                m_dataManager.GetUpdateManager().UpdateSession(session);
                //            }
                //        }

                //        strResultMessage = "해당 Session은 유효합니다.";
                //        return true;
                //    }
                //    else
                //    {
                //        strResultMessage = "다른 곳에서 로그인하였습니다.";
                //        return false;
                //    }
                //}

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
                                    m_dataManager.GetUpdateManager().UpdateSession(session);
                                }
                            }
                            else
                            {
                                session.UpdateDate = DateTime.Now;
                                m_dataManager.GetUpdateManager().UpdateSession(session);
                            }

                            result.Success = true;
                            result.Message = "해당 Session은 유효합니다.";
                            result.User = Models.ApplicationUser.MakeUser(user, level, session.SessionKey);

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

        public ResponseNewUser MakeNewUser(RequestNewUser data)
        {
            string strSalt = MakeSalt();
            string strPassword = EncryptPassword("1234", strSalt);

            User user = m_dataManager.GetCreateManager().CreateUser(null, data.UserLevel, data.UserID, strPassword, data.NickName, data.SiteID, strSalt);

            if (user == null)
                return new ResponseNewUser(false, m_dataManager.GetCreateManager().GetErrorMessage());

            ResponseNewUser response = new ResponseNewUser(true, "");
            response.User = user;
            return response;
        }

        public ResponseNewUsers MakeNewUsers(RequestNewUsers data)
        {
            IDataManager dataManager = m_dataManager.Clone();

            if (dataManager.BeginBatch())
            {
                ResponseNewUsers response = new ResponseNewUsers(true, "");

                foreach (var request in data.Requests)
                {
                    string strSalt = MakeSalt();
                    string strPassword = EncryptPassword("1234", strSalt);

                    User user = dataManager.GetCreateManager().CreateUser(null, request.UserLevel, request.UserID, strPassword, request.NickName, request.SiteID, strSalt);

                    if (user == null)
                    {
                        dataManager.BatchRollback();
                        return new ResponseNewUsers(false, dataManager.GetCreateManager().GetErrorMessage());
                    }

                    response.Users.Add(user);
                }

                if (dataManager.BatchCommit())
                    return response;
                else
                    dataManager.BatchRollback();
            }
            else
                return new ResponseNewUsers(false, "Database 트랜잭션을 시작할 수 없습니다.");

            return new ResponseNewUsers(false, "Database 트랜잭션을 정상적으로 종료할 수 없습니다.");
        }

        public string RequestSalt(RequestLoginKey data, out string strErrorMessage)
        {
            Dictionary<User.Fields, object> dicConditions = new Dictionary<User.Fields, object>();

            if (data.Num != null && data.UserID != null)
                dicConditions[User.Fields.UserID] = (string)data.UserID;
            else if (data.Num != null && data.Name != null && data.Data != null && data.Mode == (int)RequestLoginKey.ModeType.Email)
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
            }
            else
            {
                strErrorMessage = "Parameter가 부족합니다.";
                return null;
            }

            List<User> users = m_dataManager.GetSelectManager().SelectUsers(dicConditions, out strErrorMessage);

            if (users == null)
                return null;
            else if (users.Count == 0)
            {
                strErrorMessage = LoginFailMessage;
                return null;
            }

            return users[0].Salt;
        }

        public ResponseSSOLogin CheckSSOLogin(string code, string strFrontURL, string strLoginOption)
        {
            IDataManager dataManager = m_dataManager.Clone();
            ResponseSSOLogin res = new ResponseSSOLogin();

            // 디버깅 변수
            int nExceptionNum = 0;
            string strException = "";

            try
            {
                //string strSSOUrl = "https://www.brityworks.com";
                string strSSOUrl = "https://dws.wonik.com";
                string strTokenUrl = strSSOUrl + "/sso/oidc/token";                

                string strClientID = null;
                string strClientSecret = null;
                string strSysUrl = null;

                JObject jLoginOption = JObject.Parse(strLoginOption);
                if (jLoginOption != null && jLoginOption["ssoInfo"] != null && jLoginOption["ssoInfo"]["clientID"] != null && jLoginOption["ssoInfo"]["clientSecret"] != null)
                {
                    strClientID = jLoginOption["ssoInfo"]["clientID"].ToString();
                    strClientSecret = jLoginOption["ssoInfo"]["clientSecret"].ToString();
                    strSysUrl = jLoginOption["ssoInfo"]["sysUrl"].ToString();
                }
                else
                {
                    res.Message = $"clientID, clientSecret 설정 값이 없습니다. 관리자에게 문의해주세요.";
                    return res;
                }

                string strRedirectUri = strSysUrl + "/accessWonikSSO";

                System.Net.HttpWebRequest request = (System.Net.HttpWebRequest)System.Net.WebRequest.Create(new Uri(strTokenUrl));
                request.Method = "POST";
                request.ContentType = "application/x-www-form-urlencoded";
                request.Accept = "application/x-www-form-urlencoded";

                // 디버깅 변수
                nExceptionNum = 1;
                strException = "strTokenUrl: " + strTokenUrl;

                string data = strClientID + ":" + strClientSecret;
                byte[] encData_byte = new byte[data.Length];
                encData_byte = System.Text.Encoding.UTF8.GetBytes(data);
                string encodedData = Convert.ToBase64String(encData_byte);

                // 디버깅 변수
                nExceptionNum = 2;
                strException = "encData_byte: " + data;

                request.Headers.Add("Authorization", "Basic " + encodedData);

                string parameters = string.Format($"grant_type=authorization_code&code={code}&redirect_uri={strRedirectUri}");
                byte[] byteArray = System.Text.Encoding.UTF8.GetBytes(parameters);

                // 디버깅 변수
                nExceptionNum = 3;
                strException = "parameters: " + parameters;

                request.ContentLength = byteArray.Length;

                Stream dataStream = request.GetRequestStream();
                dataStream.Write(byteArray, 0, byteArray.Length);
                dataStream.Close();

                // 디버깅 변수
                nExceptionNum = 4;

                System.Net.WebResponse response = request.GetResponse();
                string strStatus = ((System.Net.HttpWebResponse)response).StatusDescription;

                // 디버깅 변수
                nExceptionNum = 5;

                Stream webStream = response.GetResponseStream();
                StreamReader responseReader = new StreamReader(webStream);

                // 디버깅 변수
                nExceptionNum = 6;

                string strResponse = responseReader.ReadToEnd();
                responseReader.Close();

                // 디버깅 변수
                nExceptionNum = 7;
                strException = "strResponse: " + strResponse;

                JObject result = JObject.Parse(strResponse);
                string id_token = result?["id_token"].ToString();

                string[] splits = id_token?.Split('.');

                // 디버깅 변수
                nExceptionNum = 8;

                if (splits.Length > 1)
                {
                    System.Text.UTF8Encoding encoder = new System.Text.UTF8Encoding();
                    System.Text.Decoder utf8Decode = encoder.GetDecoder();

                    // 디버깅 변수
                    nExceptionNum = 9;

                    string split = splits[1];
                    split = split.Replace(' ', '+').Replace('-', '+').Replace('_', '/').PadRight(4 * ((split.Length + 3) / 4), '=');

                    byte[] todecode_byte = Convert.FromBase64String(split);
                    int charCount = utf8Decode.GetCharCount(todecode_byte, 0, todecode_byte.Length);
                    char[] decoded_char = new char[charCount];
                    utf8Decode.GetChars(todecode_byte, 0, todecode_byte.Length, decoded_char, 0);
                    string info = new String(decoded_char);

                    // 디버깅 변수
                    nExceptionNum = 10;

                    JObject jInfo = JObject.Parse(info);
                    string strEmpNo = jInfo?["empNo"].ToString();

                    // 디버깅 변수
                    nExceptionNum = 11;

                    if (strEmpNo?.Length > 0)
                    {             
                        string strErrorMessage;

                        // ID 값으로 유저를 검색
                        Dictionary<User.Fields, object> dicConditions = new Dictionary<User.Fields, object>();
                        dicConditions[Model.Sop.Account.User.Fields.UserID] = strEmpNo;

                        List<User> users = m_dataManager.GetSelectManager().SelectUsers(dicConditions, out strErrorMessage);
                        if (users == null)
                        {
                            res.Message = $"SelectUsers 오류 발생 ({strErrorMessage})";
                            return res;
                        }
                        else if (users.Count == 0)
                        {
                            res.Message = $"권한이 없습니다. 관리자에게 문의 부탁드립니다.";
                            return res;
                        }

                        User user = users[0];
                        string strSessionKey = splits[0];


                        if (UpdateSession(user.ID, strSessionKey, true, null, out strErrorMessage) == false)
                        {
                            res.Message = $"UpdateSession 오류 발생 ({strErrorMessage})";
                            return res;
                        }

                        if (Update3DVersion(user.ID, true.ToString().ToLower(), out strErrorMessage) == false)
                        {
                            res.Message = $"Update3DVersion 오류 발생 ({strErrorMessage})";
                            return res;
                        }

                        Level level = m_dataManager.GetSelectManager().SelectLevel(user.UserLevel, out strErrorMessage);

                        if (level == null)
                        {
                            res.Message = $"SelectLevel 오류 발생 ({strErrorMessage})";
                            return res;
                        }

                        // 로그인 성공 시 PasswordCode 초기화
                        user.PasswordCode = null;
                        if (m_dataManager.GetUpdateManager().UpdateUser(user) == false)
                        {
                            res.Message = $"UpdateUser 오류 발생 ({strErrorMessage})";
                            return res;
                        }

                        res.User = Models.ApplicationUser.MakeUser(user, level, strSessionKey);

                    }
                    else
                    {
                        res.Message = $"empNo 값이 잘못 되었습니다.";
                        return res;
                    }
                }
                else
                {
                    res.Message = $"id_token 값이 잘못 되었습니다.";
                    return res;
                }               

                res.Success = true;
                return res;
            }
            catch (Exception ex)
            {
                res.Message = $"CheckSSOLogin 예외발생 {nExceptionNum.ToString()} {strException} ({ex.Message})";
                return res;
            }
        }

        public ResponseSSOUrl RequestSSOUrl(string strFrontURL, string strLoginOption)
        {
            IDataManager dataManager = m_dataManager.Clone();
            ResponseSSOUrl res = new ResponseSSOUrl();
                        
            //string strSSOUrl = "https://www.brityworks.com";
            string strSSOUrl = "https://dws.wonik.com";
            string strAuthUrl = strSSOUrl + "/sso/oidc/authorize";

            string strClientID = null;
            string strClientSecret = null;
            string strSysUrl = null;

            try
            {
                string strResponse = "{\"access_token\":\"eyJraWQiOiI0MzM4ZGZkNS1mNjFiLTQyZDMtODhiMS03NDNiZjA4ZmQ3MGEiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJraHllb0B3b25pay5jb20iLCJhdWQiOiJCUkE3ME9JREMwMDIwIiwibmJmIjoxNzM0MDcyMTEwLCJzY29wZSI6WyJvcGVuaWQiXSwiaXNzIjoiaHR0cDovL3d3dy5icml0eXdvcmtzLmNvbS9zc28iLCJleHAiOjE3MzQwNzI3MTAsImlhdCI6MTczNDA3MjExMH0.Q0tGmULzpgMVcnB4YrDc - k5CrE9x6C2EXFEdXBSFlhd8742ZWV - OyCUgxK7qQFoUe9CB3u4oy2a5h5fochqAfE1XmBjW9YPExVY_OTRYzmVtjet9TnyPKdPtg4SM8PI8rPOD880wvMu9zxic6539zoLgXhl5Ia_S3wfBunOV8wUwbBTt78__i6yKkIseIpmePreXOMfLIs0RgntfSEcP4Y2hMoYAytFc9OkjRmR9NN8uooBBS6o5B67gKHPycpaNZOPybWLcPQUxz2bYk7SHONLvbs57LaBeyQLJtTkkQq7q3rfRJPUgkmhBDDBgFl19b9fIhk9qQ5znsjOV_Hs6tQ\",\"refresh_token\":\"KmlcEn3oVWdYoj_FWXoT5JAJ4iGtsjWT20AtQ6A - SP82tPf3HXzEgTOD4lXOjH06ueCndu_UmCdzysFzEOolIAVdmc907HDKvnNAmdVDqdtFZaP43MeUUj6mByg0JuBj\",\"scope\":\"openid\",\"id_token\":\"eyJraWQiOiI0MzM4ZGZkNS1mNjFiLTQyZDMtODhiMS03NDNiZjA4ZmQ3MGEiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJraHllb0B3b25pay5jb20iLCJkZXB0TmFtZSI6IlRGIiwiaXNzIjoiaHR0cDovL3d3dy5icml0eXdvcmtzLmNvbS9zc28iLCJlcElkIjoiTTI0MDcxNjA4MjEyNUE3MDYzMzYiLCJlbXBObyI6IjAxMjk2IiwidXNlck5hbWUiOiLsl6zqtJHtmLgiLCJ1c2VySWQiOiJraHllb0B3b25pay5jb20iLCJhdWQiOiJCUkE3ME9JREMwMDIwIiwiYXpwIjoiQlJBNzBPSURDMDAyMCIsInVzZXJFbWFpbCI6ImtoeWVvQHdvbmlrLmNvbSIsImV4cCI6MTczNDA3MzkxMCwiaWF0IjoxNzM0MDcyMTEwfQ.f06U_BtzZ3sqHyi2juYP3tt7vneGAzVF3tg_emge0qdtpEqT7X4lVNoRk4o4jgzaCIghqyEnGEWW7DGWmdOcbFoa2ierdG - U_6ThUI66IRWqDsoBJ--R_xkF - hnxvU8fX09Wpj7yQDT8_yM_50NONfAwf9Y3UTQjpmx8Hwu7yuXv5aoIa_XveSODgELFGgNHUDTfGcKVPRk09RJ9nhIN806KMEjwjorhil6kKsSlgKPY036b6tASq8gRU - PKhxlgCLRYEXB5mhA5ZG7ir2CaVXwjzZonos1HJBabnyWj3t27v4ofE6PN96ltdDWIjsiJQjKemzfqe - PXUTIor9aZWA\",\"token_type\":\"Bearer\",\"expires_in\":600}";

                JObject result = JObject.Parse(strResponse);
                string id_token = result?["id_token"].ToString();

                string[] splits = id_token?.Split('.');

                if (splits.Length > 1)
                {
                    System.Text.UTF8Encoding encoder = new System.Text.UTF8Encoding();
                    System.Text.Decoder utf8Decode = encoder.GetDecoder();

                    string split = splits[1];
                    split = split.Replace(' ', '+').Replace('-', '+').Replace('_', '/').PadRight(4 * ((split.Length + 3) / 4), '=');

                    byte[] todecode_byte = Convert.FromBase64String(split);
                    int charCount = utf8Decode.GetCharCount(todecode_byte, 0, todecode_byte.Length);
                    char[] decoded_char = new char[charCount];
                    utf8Decode.GetChars(todecode_byte, 0, todecode_byte.Length, decoded_char, 0);
                    string info = new String(decoded_char);

                }
            
                JObject jLoginOption = JObject.Parse(strLoginOption);
                if (jLoginOption != null && jLoginOption["ssoInfo"] != null && jLoginOption["ssoInfo"]["clientID"] != null && jLoginOption["ssoInfo"]["clientSecret"] != null && jLoginOption["ssoInfo"]["sysUrl"] != null)
                {
                    strClientID = jLoginOption["ssoInfo"]["clientID"].ToString();
                    strClientSecret = jLoginOption["ssoInfo"]["clientSecret"].ToString();
                    strSysUrl = jLoginOption["ssoInfo"]["sysUrl"].ToString();
                }
                else
                {
                    res.Message = $"clientID, clientSecret 설정 값이 없습니다. 관리자에게 문의해주세요.";
                    return res;
                }

                string strRedirectUrl = strSysUrl + "/accessWonikSSO";
                string strQueryString = "response_type=code&client_id=" + strClientID + "&scope=openid&redirect_uri=" + strRedirectUrl;
                string strFullRedirectUrl = strAuthUrl + "?" + strQueryString;

                res.URL = strFullRedirectUrl;
                res.Success = true;
                return res;
            }
            catch (Exception e)
            {
                res.Message = $"RequestSSOUrl 예외 발생 ({e.Message})";
                return res;
            }            
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
    }
}
