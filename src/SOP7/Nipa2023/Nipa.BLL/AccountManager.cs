using System;
using dnsDapperDBUtil;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Nipa.Model.Account;
using Nipa.Model.Sop.Team;
using Nipa.DAL;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using Newtonsoft.Json.Linq;
using System.Security.Cryptography;
using System.Text;

namespace Nipa.BLL
{
    using Models;
    using Models.Response;
    using Models.Request;
    using Common.Model.History;

    public class AccountManager
    {
        private static string key = new string(new char[] { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6' });

        // LoginFailLimit 이상 로그인 실패시(비밀번호 잘못 입력) 계정을 잠근다.(사용할수 없도록 한다.)
        private const int LoginFailLimit = 5;
        // 계정을 잠그는 시간
        private const int LockLoginMinutes = 30;

        public const string LoginFailMessage = "ID 또는 비밀번호를 잘못 입력하였습니다.";

        private IDataManager m_dataManager = null;
        private JoinManager m_joinManager = null;
        private ProcessManager m_processManager = null;

        public AccountManager(IDataManager manager, ProcessManager processManager)
        {
            m_dataManager = manager;
            m_joinManager = new JoinManager(m_dataManager);
            m_processManager = processManager;
        }

        public LoginResult Login(string strUserID, string strPW, string strSessionKey, string strExternalLoginURL, int? externalSiteID, bool autoLogin)
        {
            LoginResult result = null;
            User user = null;
            Level level = null;
            string strErrorMessage = null;

            if (strExternalLoginURL != null && strExternalLoginURL.Length > 0 && externalSiteID != null)
            {
                result = ExternalLogin(strUserID, strPW, strExternalLoginURL, (int)externalSiteID, strSessionKey, autoLogin, out user, out level);

                if (result.Success == false)
                    return result;
                else if (result.User == null)
                {
                    result.Success = false;
                    result.Message = LoginFailMessage;
                }

                return result;
            }
            else
            {
                result = new LoginResult();

                // ID 값으로 유저를 검색
                string strCondition = string.Format("{0} = '{1}'", User.Fields.UserID.ToString(), strUserID);

                IEnumerable<User> users = m_dataManager.GetSelect().Select<User>(strCondition, out strErrorMessage);
                if (users == null)
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }
                else if (ProcessManager.IsEmpty(users))
                {
                    result.Success = false;
                    result.Message = LoginFailMessage;
                    return result;
                }

                ProcessManager.FirstElement(users, ref user);
                //user = users[0];

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
                    }

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

            IEnumerable<Level> levels = m_dataManager.GetSelect().Select<Level>(string.Format("{0} = {1}", Level.Fields.ID, user.UserLevel), out strErrorMessage);

            if (levels == null || ProcessManager.IsEmpty(levels))
            {
                result.Success = false;
                result.Message = strErrorMessage;
                return result;
            }

            ProcessManager.FirstElement(levels, ref level);

            // 로그인 성공 시 PasswordCode 초기화
            user.PasswordCode = null;

            if (m_dataManager.GetUpdate().Update<User>(user, string.Format("{0} = {1}", User.Fields.ID, user.ID), out strErrorMessage) == false)
            {
                result.Success = false;
                result.Message = "PasswordCode 초기화 실패";
                return result;
            }

            RegularMember regularMember = GetRegularMember(user);

            result.User = ApplicationUser.MakeUser(user, level, regularMember, strSessionKey);

            result.Success = true;
            result.State = (int)LoginResult.LoginState.Login;

            return result;
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

            return m_dataManager.GetUpdate().Update<User>(user, string.Format("{0} = {1}", User.Fields.ID.ToString(), user.ID), out strErrorMessage);
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
                        m_dataManager.GetUpdate().Update<User>(user, string.Format("{0} = {1}", User.Fields.ID.ToString(), user.ID), out strErrorMessage);
                    }
                }
            }

            return true;
        }

        private LoginResult ExternalLogin(string strUserID, string strPW, string strExternalLoginURL, int externalSiteID, string strSessionKey, bool autoLogin, out User user, out Level level)
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

                return GetExternalLoginResult(strResult, strSessionKey, externalSiteID, autoLogin);
            }
            catch (System.Net.WebException ex)
            {
                strErrorMessage = ex.Message;
            }

            result.Success = false;
            result.Message = strErrorMessage;
            return result;
        }

        private LoginResult GetExternalLoginResult(string strResult, string strSessionKey, int externalSiteID, bool autoLogin = false)
        {
            string strErrorMessage;
            string strUserID, strUserName, strTeamName;
            bool success = GetJsonResult(JObject.Parse(strResult), out strUserID, out strUserName, out strTeamName, out strErrorMessage);

            if (success == false)
                return new LoginResult(false, strErrorMessage);

            LoginResult result = new LoginResult();
            IEnumerable<Level> levels = m_dataManager.GetSelect().Select<Level>(null, out strErrorMessage);

            if (levels == null)
            {
                result.Success = false;
                result.Message = strErrorMessage;
                return result;
            }
            else if (ProcessManager.IsEmpty(levels))
            {
                result.Success = false;
                result.Message = "Account Level이 존재하지 않습니다.";
                return result;
            }

            Level level = null;
            ProcessManager.FirstElement(levels, ref level);

            // ID 조회 
            User user = null;

            string strCondition = string.Format("{0} = '{1}'", User.Fields.UserID.ToString(), strUserID);

            IEnumerable<User> users = m_dataManager.GetSelect().Select<User>(strCondition, out strErrorMessage);

            if (users == null)
            {
                result.Success = false;
                result.Message = strErrorMessage;
                return result;
            }
            else if (ProcessManager.IsEmpty(users))
            {   // 없으면 새로 생성
                int nRegularMemberID = GetRegularMemberID(strUserName, strTeamName, strUserID, externalSiteID, out strErrorMessage);

                if (nRegularMemberID < 0)
                    return new LoginResult(false, strErrorMessage);

                User _user = new User();
                _user.NickName = strUserName;
                _user.Password = "";
                _user.Salt = MakeSalt();
                _user.UserLevel = level.ID;
                _user.UserID = strUserID;
                _user.SiteID = externalSiteID;
                _user.MemberID = nRegularMemberID;

                int addedID;

                if (m_dataManager.GetCreate().Insert<User>(_user, out addedID, out strErrorMessage) == false)
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }
                else
                {
                    user = _user;
                    user.ID = addedID;
                }
            }
            else
            {
                ProcessManager.FirstElement(users, ref user);

                strCondition = string.Format("{0} = {1}", Level.Fields.ID.ToString(), user.UserLevel);
                level = m_dataManager.GetSelect().SelectFirst<Level>(strCondition, out strErrorMessage);

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
            loginUser.Name = strUserName;
            loginUser.UserID = strUserID;
            loginUser.SessionKey = strSessionKey;
            loginUser.UserLevel = level;
            loginUser.SiteID = user.SiteID;

            result.Success = true;
            result.Message = "";
            result.User = loginUser;
            return result;
        }

        private int GetRegularMemberID(string strMemberName, string strTeamName, string strEmail, int siteID, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = '{1}'", Regular.Fields.TeamName, strTeamName);

            int addedID = -1;
            Regular team = m_dataManager.GetSelect().SelectFirst<Regular>(strCondition, out strErrorMessage);

            if (team == null)
            {
                if (strErrorMessage != null)
                    return -1;
                else
                {
                    team = new Regular();
                    team.TeamName = strTeamName;
                    team.SiteID = siteID;

                    if (m_dataManager.GetCreate().Insert<Regular>(team, out addedID, out strErrorMessage) == false)
                        return -1;
                    else
                        team.ID = addedID;
                }
            }

            if (strEmail == null)
                strCondition = string.Format("{0} = {1} and {2} = '{3}' and {4} is NULL", RegularMember.Fields.RegularID, team.ID, RegularMember.Fields.MemberName, strMemberName, RegularMember.Fields.Email);
            else
                strCondition = string.Format("{0} = {1} and {2} = '{3}' and {4} = '{5}'", RegularMember.Fields.RegularID, team.ID, RegularMember.Fields.MemberName, strMemberName, RegularMember.Fields.Email, strEmail);

            IEnumerable<RegularMember> members = m_dataManager.GetSelect().Select<RegularMember>(strCondition, out strErrorMessage);

            if (members == null)
                return -1;

            foreach (RegularMember _member in members)
            {
                return _member.ID;
            }

            RegularMember member = new RegularMember();
            member.RegularID = team.ID;
            member.MemberName = strMemberName;
            member.Email = strEmail;
            member.StatusID = (int)RegularMember.WorkStatus.Normal;

            if (m_dataManager.GetCreate().Insert<RegularMember>(member, out addedID, out strErrorMessage) == false)
                return -1;

            return addedID;
        }

        private bool UpdateSession(int nUserID, string strSessionKey, bool autoLogin, out string strErrorMessage)
        {
            strErrorMessage = "";

            // 해당 유저 세션 유무 확인
            string strCondition = string.Format("{0} = {1}", Session.Fields.AccountUserID.ToString(), nUserID);

            IEnumerable<Session> sessions = m_dataManager.GetSelect().Select<Session>(strCondition, out strErrorMessage);
            if (sessions == null)
            {
                return false;
            }

            // 있으면 삭제 후 생성, 없으면 생성
            if (ProcessManager.IsEmpty(sessions) == false)
            {
                strCondition = string.Format("{0} = {1}", Session.Fields.AccountUserID.ToString(), nUserID);

                if (!m_dataManager.GetDelete().Delete<Session>(strCondition, out strErrorMessage))
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

            int addedID;
            if (m_dataManager.GetCreate().Insert<Session>(_session, out addedID, out strErrorMessage) == false)
                return false;

            return true;
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
            else
            {
                strErrorMessage = "Parameter가 부족합니다.";
                return null;
            }

            strErrorMessage = null;
            IEnumerable<User> users = m_dataManager.GetSelect().Select<User>(string.Format("{0} = '{1}'", User.Fields.UserID.ToString(), data.UserID), out strErrorMessage);

            if (users == null)
                return null;
            else if (ProcessManager.IsEmpty(users))
            {
                return MakeSalt();
            }

            User user = null;
            ProcessManager.FirstElement(users, ref user);

            return user.Salt;
        }

        public LoginResult CheckLoginSession(int nUserID, string strSessionKey)
        {
            string strErrorMessage;
            LoginResult result = new LoginResult();

            try
            {
                Dictionary<Session.Fields, object> dicConditions = new Dictionary<Session.Fields, object>();
                dicConditions[Session.Fields.AccountUserID] = nUserID;

                string strResultMessage = null;
                string strAdditionalConditions = string.Format("a.{0} = {1}", Session.Fields.AccountUserID, nUserID);
                ArrayList arrResult = m_joinManager.JoinSessionUserLevel(strAdditionalConditions, out strResultMessage);

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
                                    m_dataManager.GetUpdate().Update<Session>(session, null, out strErrorMessage);
                                }
                            }

                            RegularMember regularMember = GetRegularMember(user);

                            result.Success = true;
                            result.Message = "해당 Session은 유효합니다.";
                            result.User = Models.ApplicationUser.MakeUser(user, level, regularMember, session.SessionKey);

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

        private RegularMember GetRegularMember(User user)
        {
            if (user.MemberID != null)
            {
                string strErrorMessage;
                string strCondition = string.Format("{0} = {1}", RegularMember.Fields.ID, user.MemberID);
                RegularMember regularMember = m_dataManager.GetSelect().SelectFirst<RegularMember>(strCondition, out strErrorMessage);

                if (regularMember != null)
                    return regularMember;
            }

            return null;
        }

        public ResponseAccountOption SaveAccountOption(Option option)
        {
            string strErrorMessage = null;

            if (option.ID <= 0)
            {
                int? id = GetAccountOptionID(option, out strErrorMessage);

                if (id == null && strErrorMessage != null)
                {
                    ResponseAccountOption response = new ResponseAccountOption(false, strErrorMessage);
                    return response;
                }
            }

            bool success = false;

            if (option.ID <= 0)
            {   // 없으면 생성
                int addedID;
                success = m_dataManager.GetCreate().Insert<Option>(option, out addedID, out strErrorMessage);

                if (success)
                    option.ID = addedID;
            }
            else
            {   // 있으면 업데이트
                success = m_dataManager.GetUpdate().Update<Option>(option, null, out strErrorMessage);
            }

            ResponseAccountOption res = new ResponseAccountOption();

            if (success == false)
            {
                res.Success = false;
                res.Message = strErrorMessage;
            }
            else
            {
                res.Success = true;
                if (res.Options == null)
                    res.Options = new List<Option>();
                res.Options.Add(option);
            }

            return res;
        }

        private int? GetAccountOptionID(Option option, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = {1} and {2} = '{3}' and {4} = '{5}'",
                Option.Fields.UserID, option.UserID,
                Option.Fields.Category, option.Category,
                Option.Fields.SubCategory, option.SubCategory);

            IEnumerable<Option> options = m_dataManager.GetSelect().Select<Option>(strCondition, out strErrorMessage);

            if (options == null)
                return null;

            foreach (Option _option in options)
            {
                option.ID = _option.ID;
                return option.ID;
            }

            return null;
        }

        public ResponseUserList GetUserList(RequestUserList data)
        {
            string strErrorMessage = null;
            ArrayList arrDatas = m_joinManager.JoinUserRegularRegularMember(string.Format("a.{0} = {1}", User.Fields.SiteID, data.SiteID), out strErrorMessage);

            if (arrDatas == null)
                return new ResponseUserList(false, strErrorMessage);

            IEnumerable<Options> teamOptions = m_dataManager.GetSelect().Select<Options>(null, out strErrorMessage);

            if (teamOptions == null)
                return new ResponseUserList(false, strErrorMessage);

            Dictionary<int, string> dicJobLevels = new Dictionary<int, string>();
            Dictionary<int, string> dicJobPositions = new Dictionary<int, string>();

            GetJobLevelPositions(teamOptions, dicJobLevels, dicJobPositions);

            ResponseUserList response = new ResponseUserList(true, "");

            int nDataCount = arrDatas.Count;

            for (int i=0;i<nDataCount-2;i+=3)
            {
                if (arrDatas[i] is User && arrDatas[i + 1] is Regular && arrDatas[i + 2] is RegularMember)
                {
                    UserEx user = UserEx.MakeUser((User)arrDatas[i], (Regular)arrDatas[i + 1], (RegularMember)arrDatas[i + 2]);
                    response.Users.Add(user);

                    if (user.RegularMember.JobLevelID != null)
                    {
                        string strJobLevelName;

                        if (dicJobLevels.TryGetValue((int)user.RegularMember.JobLevelID, out strJobLevelName))
                            user.RegularMember.JobLevel = strJobLevelName;
                    }

                    if (user.RegularMember.JobPositionID != null)
                    {
                        string strJobPositionName;

                        if (dicJobPositions.TryGetValue((int)user.RegularMember.JobPositionID, out strJobPositionName))
                            user.RegularMember.JobPosition = strJobPositionName;
                    }
                }
            }

            return response;
        }

        public ResponseUserLevelList GetUserLevelList()
        {
            string strErrorMessage = null;
            IEnumerable<Level> levels = m_dataManager.GetSelect().Select<Level>(null, out strErrorMessage);

            if (levels == null)
                return new ResponseUserLevelList(false, strErrorMessage);

            ResponseUserLevelList response = new ResponseUserLevelList(true, "");
            response.Levels.AddRange(levels);
            return response;
        }

        public MessageResult UpdateUsers(UpdateUser data)
        {
            string strErrorMessage;

            if (m_dataManager.BeginBatch(out strErrorMessage) == false)
                return new MessageResult(false, strErrorMessage);

            string strIDs = "";

            foreach (int id in data.DeleteUserIDs)
            {
                if (strIDs.Length == 0)
                    strIDs = id.ToString();
                else
                    strIDs += "," + id.ToString();
            }

            if (strIDs.Length > 0)
            {
                Dictionary<Nipa.Model.Sop.History.ActionStep.Fields, object> dicSets = new Dictionary<Model.Sop.History.ActionStep.Fields, object>();
                dicSets[Nipa.Model.Sop.History.ActionStep.Fields.LastAccessedUserID] = null;

                string strConditions = string.Format("{0} in ({1})", Nipa.Model.Sop.History.ActionStep.Fields.LastAccessedUserID, strIDs);

                if (m_dataManager.GetUpdate().Update<Nipa.Model.Sop.History.ActionStep, Nipa.Model.Sop.History.ActionStep.Fields>(dicSets, strConditions, out strErrorMessage) == false)
                {
                    MessageResult result = new MessageResult(false, strErrorMessage);
                    m_dataManager.BatchRollback(out strErrorMessage);
                    return result;
                }

                Dictionary<Nipa.Model.Sop.History.Component.Fields, object> dicSets2 = new Dictionary<Model.Sop.History.Component.Fields, object>();
                dicSets2[Nipa.Model.Sop.History.Component.Fields.AccessedUserID] = null;
                strConditions = string.Format("{0} in ({1})", Nipa.Model.Sop.History.Component.Fields.AccessedUserID, strIDs);

                if (m_dataManager.GetUpdate().Update<Nipa.Model.Sop.History.Component, Nipa.Model.Sop.History.Component.Fields>(dicSets2, strConditions, out strErrorMessage) == false)
                {
                    MessageResult result = new MessageResult(false, strErrorMessage);
                    m_dataManager.BatchRollback(out strErrorMessage);
                    return result;
                }

                Dictionary<SOPManager.Model.Sop.Category.Version.Fields, object> dicSets3 = new Dictionary<SOPManager.Model.Sop.Category.Version.Fields, object>();
                dicSets3[SOPManager.Model.Sop.Category.Version.Fields.OwnerID] = null;
                strConditions = string.Format("{0} in ({1})", SOPManager.Model.Sop.Category.Version.Fields.OwnerID, strIDs);

                dnsDapperDBUtil.Manager.WebDBManager dbMgr = m_dataManager.GetDBManager();
                SOPManager.DAL.DataManager sopDataManager = new SOPManager.DAL.DataManager((int)dbMgr.DatabaseType, dbMgr.DbHost, dbMgr.DbName, dbMgr.DbID, dbMgr.DbPw, 1);

                if (sopDataManager.GetUpdateManager().UpdateVersion(dicSets3, strConditions, out strErrorMessage) == false)
                {
                    MessageResult result = new MessageResult(false, strErrorMessage);
                    m_dataManager.BatchRollback(out strErrorMessage);
                    return result;
                }

                strConditions = string.Format("{0} in ({1})", Option.Fields.UserID, strIDs);

                if (m_dataManager.GetDelete().Delete<Option>(strConditions, out strErrorMessage) == false)
                {
                    MessageResult result = new MessageResult(false, strErrorMessage);
                    m_dataManager.BatchRollback(out strErrorMessage);
                    return result;
                }

                strConditions = string.Format("{0} in ({1})", Session.Fields.AccountUserID, strIDs);

                if (m_dataManager.GetDelete().Delete<Session>(strConditions, out strErrorMessage) == false)
                {
                    MessageResult result = new MessageResult(false, strErrorMessage);
                    m_dataManager.BatchRollback(out strErrorMessage);
                    return result;
                }

                strConditions = string.Format("{0} in ({1})", User.Fields.ID, strIDs);
                
                if (m_dataManager.GetDelete().Delete<User>(strConditions, out strErrorMessage) == false)
                {
                    MessageResult result = new MessageResult(false, strErrorMessage);
                    m_dataManager.BatchRollback(out strErrorMessage);
                    return result;
                }
                                
                string strSQL = $"update {ActionStepHistory.TableName} set {ActionStepHistory.Fields.LastAccessedUserID}=null where {ActionStepHistory.Fields.LastAccessedUserID} in ({strIDs})";
                if (m_dataManager.GetUpdate().Update(strSQL, out strErrorMessage) == false)
                {
                    MessageResult result = new MessageResult(false, strErrorMessage);
                    m_dataManager.BatchRollback(out strErrorMessage);
                    return result;
                }

                strSQL = $"update {ComponentHistory.TableName} set {ComponentHistory.Fields.AccessedUserID}=null where {ComponentHistory.Fields.AccessedUserID} in ({strIDs})";
                if (m_dataManager.GetUpdate().Update(strSQL, out strErrorMessage) == false)
                {
                    MessageResult result = new MessageResult(false, strErrorMessage);
                    m_dataManager.BatchRollback(out strErrorMessage);
                    return result;
                }
            }

            foreach (UpdateUserData updateData in data.UpdateUsers)
            {
                string strConditions = string.Format("{0} = {1}", User.Fields.ID, updateData.ID);

                Dictionary<User.Fields, object> dicSets = new Dictionary<User.Fields, object>();
                dicSets[User.Fields.UserID] = updateData.UserID;
                dicSets[User.Fields.UserLevel] = updateData.LevelID;

                if (m_dataManager.GetUpdate().Update<User, User.Fields>(dicSets, strConditions, out strErrorMessage) == false)
                {
                    MessageResult result = new MessageResult(false, strErrorMessage);
                    m_dataManager.BatchRollback(out strErrorMessage);
                    return result;
                }
            }

            if (m_dataManager.BatchCommit(out strErrorMessage) == false)
                return new MessageResult(false, strErrorMessage);

            return new MessageResult(true, "");
        }

        public ResponseOption GetOption(RequestOption data)
        {
            string strErrorMessage;
            string strConditions = string.Format("{0} = {1} and {2} = '{3}'", Option.Fields.UserID, data.UserID, Option.Fields.Category, data.Category);
            IEnumerable<Option> options = m_dataManager.GetSelect().Select<Option>(strConditions, out strErrorMessage);

            if (options == null)
                return new ResponseOption(false, strErrorMessage);

            ResponseOption response = new ResponseOption(true, "");
            response.Options.AddRange(options);
            return response;
        }

        private void GetJobLevelPositions(IEnumerable<Model.Sop.Team.Options> teamOptions, Dictionary<int, string> dicJobLevels, Dictionary<int, string> dicJobPositions)
        {
            foreach (Model.Sop.Team.Options teamOption in teamOptions)
            {
                if (teamOption.PropertyName.ToLower() == "joblevel")
                    dicJobLevels[teamOption.PropertyID] = teamOption.PropertyValue;
                else if (teamOption.PropertyName.ToLower() == "jobposition")
                    dicJobPositions[teamOption.PropertyID] = teamOption.PropertyValue;
            }
        }

        public ResponseRegularMemberList GetRegularMemberList(RequestRegularMemberList data)
        {
            if (data.Keyword == null || data.Keyword.Trim().Length == 0)
                return new ResponseRegularMemberList(true, "");

            string strErrorMessage;
            string strConditions = string.Format("a.{0} = {1}", Regular.Fields.SiteID, data.SiteID);
            ArrayList arrDatas = m_joinManager.JoinRegularRegularMember(strConditions, out strErrorMessage);

            if (arrDatas == null)
                return new ResponseRegularMemberList(false, strErrorMessage);

            IEnumerable<Options> teamOptions = m_dataManager.GetSelect().Select<Options>(null, out strErrorMessage);

            if (teamOptions == null)
                return new ResponseRegularMemberList(false, strErrorMessage);

            Dictionary<int, string> dicJobLevels = new Dictionary<int, string>();
            Dictionary<int, string> dicJobPositions = new Dictionary<int, string>();

            GetJobLevelPositions(teamOptions, dicJobLevels, dicJobPositions);

            Dictionary<int, RegularTeam> dicTeams = new Dictionary<int, RegularTeam>();
            int nDataCount = arrDatas.Count;

            RegularTeam team = null;

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (arrDatas[i] is Regular && arrDatas[i + 1] is RegularMember)
                {
                    Regular regular = (Regular)arrDatas[i];
                    RegularMember _member = (RegularMember)arrDatas[i + 1];

                    if (dicTeams.TryGetValue(regular.ID, out team) == false)
                    {
                        team = new RegularTeam(regular);
                        dicTeams[regular.ID] = team;
                    }

                    RegularMemberEx member = new RegularMemberEx(_member, regular);

                    string strJobLevelName = "", strJobPositionName = "";

                    if (member.JobLevelID != null && dicJobLevels.TryGetValue((int)member.JobLevelID, out strJobLevelName))
                        member.JobLevel = strJobLevelName;

                    if (member.JobPositionID != null && dicJobPositions.TryGetValue((int)member.JobPositionID, out strJobPositionName))
                        member.JobPosition = strJobPositionName;

                    team.Members.Add(member);
                }
            }

            string strKeyword = data.Keyword.Trim().ToLower();
            ResponseRegularMemberList response = new ResponseRegularMemberList(true, "");

            foreach (KeyValuePair<int, RegularTeam> pair in dicTeams)
            {
                if (pair.Value.TeamName.ToLower().Contains(strKeyword))
                    response.Teams.Add(pair.Value);
                else
                {
                    List<int> removeIndices = new List<int>();

                    for (int i=pair.Value.Members.Count-1;i>=0;i--)
                    {
                        RegularMemberEx member = pair.Value.Members[i];

                        if (member.MemberName.ToLower().Contains(strKeyword))
                            continue;
                        if (member.JobLevel.ToLower().Contains(strKeyword))
                            continue;
                        if (member.JobPosition.ToLower().Contains(strKeyword))
                            continue;
                        if (member.MemberID != null && member.MemberID.ToLower().Contains(strKeyword))
                            continue;
                        if (member.OfficePhoneNumber != null && member.OfficePhoneNumber.ToLower().Contains(strKeyword))
                            continue;
                        if (member.PhoneNumber != null && member.PhoneNumber.ToLower().Contains(strKeyword))
                            continue;
                        if (member.Email != null && member.Email.ToLower().Contains(strKeyword))
                            continue;

                        removeIndices.Add(i);
                    }

                    foreach (int index in removeIndices)
                    {
                        pair.Value.Members.RemoveAt(index);
                    }

                    if (pair.Value.Members.Count > 0)
                        response.Teams.Add(pair.Value);
                }
            }

            return response;
        }

        public ResponseCreateUser CreateUser(RequestCreateUser data, string strSolutionName)
        {
            string strErrorMessage;
            string strConditions = string.Format("b.{0} = {1}", RegularMember.Fields.ID, data.RegularMemberID);
            ArrayList arrDatas = m_joinManager.JoinRegularRegularMember(strConditions, out strErrorMessage);

            if (arrDatas == null)
                return new ResponseCreateUser(false, strErrorMessage);
            else if (arrDatas.Count < 2)
                return new ResponseCreateUser(false, "신규 생성할 계정의 정규조직원 정보를 확인할 수 없습니다.");

            Regular regular = (Regular)arrDatas[0];
            RegularMember member = (RegularMember)arrDatas[1];

            string strPasswordOrigin = MakeRandomPassword();

            User user = new User();
            user.MemberID = data.RegularMemberID;
            user.NickName = data.UserID;
            user.Salt = MakeSalt();
            user.Password = PasswordHash(strPasswordOrigin, user.Salt);
            user.SiteID = data.SiteID;
            user.UserID = data.UserID;
            user.UserLevel = data.AccountLevelID;

            int addedID;

            if (m_dataManager.GetCreate().Insert<User>(user, out addedID, out strErrorMessage) == false)
                return new ResponseCreateUser(false, strErrorMessage);

            if (member.PhoneNumber != null && member.PhoneNumber.Trim().Length > 0)
            {
                RegularMemberEx _member = new RegularMemberEx(member, regular);
                dnsSMS.IMessageClient client = dnsSMS.MessageClientFactory.CreateMessageClient();

                string strTag = strSolutionName != null && strSolutionName.Trim().Length > 0 ? "[" + strSolutionName.Trim() + "]" : "";

                dnsSMS.MessageContent message = new dnsSMS.MessageContent();
                message.Message = strTag + "계정이 생성되었습니다. " + data.UserID + " / " + strPasswordOrigin;
                message.PhoneNumbers.Add(_member.PhoneNumber);

                client.SendSMS(message);
            }

            System.Diagnostics.Trace.WriteLine("New User : " + user.UserID + " / " + strPasswordOrigin);

            user.ID = addedID;

            ResponseCreateUser response = new ResponseCreateUser(true, "");
            response.User = UserEx.MakeUser(user, regular, member);
            return response;
        }

        private string MakeRandomPassword()
        {
            string strKeys = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890_";
            int max = strKeys.Length - 1;

            string strPassword = "";
            Random rand = new Random((int)DateTime.Now.ToBinary());

            for (int i=0;i<10;i++)
            {
                int index = rand.Next(0, max);
                strPassword += strKeys[index];
            }

            return strPassword;
        }

        private string PasswordHash(string strPassword, string strSalt)
        {
            SHA256 sha = SHA256.Create();
            byte[] bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(strPassword + strSalt));
            string strHash = BitConverter.ToString(bytes).Replace("-", "").ToLower();
            return strHash;
        }

        public MessageResult ChangePassword(string strUserID, string strOldPW, string strNewPW, string strSessionKey)
        {
            string strErrorMessage = null;

            // ID 값으로 유저를 검색
            string strCondition = string.Format("{0} = '{1}'", User.Fields.UserID.ToString(), strUserID);

            IEnumerable<User> users = m_dataManager.GetSelect().Select<User>(strCondition, out strErrorMessage);
            if (users == null)
            {
                return new MessageResult(false, strErrorMessage);
            }
            else if (ProcessManager.IsEmpty(users))
            {
                return new MessageResult(false, "사용자 정보를 찾을수 없습니다.");
            }

            User user = null;
            ProcessManager.FirstElement(users, ref user);
            
            if (user.Password != strOldPW)
            {
                return new MessageResult(false, "현재 비밀번호가 일치하지 않습니다.");
            }

            Dictionary<User.Fields, object> dicSets = new Dictionary<User.Fields, object>();
            dicSets[User.Fields.Password] = strNewPW;

            strCondition = string.Format("{0} = {1}", User.Fields.ID, user.ID);

            if (m_dataManager.GetUpdate().Update<User, User.Fields>(dicSets, strCondition, out strErrorMessage) == false)
                return new MessageResult(false, strErrorMessage);

            return new MessageResult(true, "");
        }

        public MessageResult FindPassword(RequestFindPassword data, string strSolutionName)
        {
            string strPhoneNumber = "";
            int len = data.PhoneNumber.Length;

            for (int i=0;i<len;i++)
            {
                if (data.PhoneNumber[i] >= '0' && data.PhoneNumber[i] <= '9')
                {
                    strPhoneNumber += data.PhoneNumber[i];
                }
            }

            string strErrorMessage;
            string strEncryptedPhoneNumber = AES256Cipher.AES_encrypt(strPhoneNumber);

            string strCondition = string.Format("c.{0} = '{1}' and c.{2} = '{3}'",
                RegularMember.Fields.MemberName, data.UserName,
                RegularMember.Fields.PhoneNumber, strEncryptedPhoneNumber);

            ArrayList arrDatas = m_joinManager.JoinUserRegularRegularMember(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return new MessageResult(false, strErrorMessage);

            int nDataCount = arrDatas.Count;

            for (int i=0;i<nDataCount-2;i+=3)
            {
                if (arrDatas[i] is User && arrDatas[i + 1] is Regular && arrDatas[i + 2] is RegularMember)
                {
                    User user = (User)arrDatas[i];

                    string strPasswordOrigin = MakeRandomPassword();

                    user.Salt = MakeSalt();
                    user.Password = PasswordHash(strPasswordOrigin, user.Salt);

                    if (m_dataManager.GetUpdate().Update<User>(user, null, out strErrorMessage))
                    {
                        dnsSMS.IMessageClient client = dnsSMS.MessageClientFactory.CreateMessageClient();

                        string strTag = strSolutionName != null && strSolutionName.Trim().Length > 0 ? "[" + strSolutionName.Trim() + "]" : "";

                        dnsSMS.MessageContent message = new dnsSMS.MessageContent();
                        message.Message = strTag + "임시 비밀번호 : " + strPasswordOrigin;
                        message.PhoneNumbers.Add(strPhoneNumber);

                        client.SendSMS(message);
                        return new MessageResult(true, "");
                    }
                }
            }

            return new MessageResult(false, "입력된 정보에 해당하는 사용자 계정을 찾을수 없습니다.");
        }
    }
}
