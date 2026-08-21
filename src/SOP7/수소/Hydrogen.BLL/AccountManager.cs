using Hydrogen.BLL.Models;
using SOPManager.Model.Sop.Account;
using System;
using System.Collections.Generic;
using System.Text;

namespace Hydrogen.BLL
{
    public class AccountManager
    {
        SOPManager.IDAL.IDataManager m_sopDataManager = null;

        public AccountManager(SOPManager.IDAL.IDataManager sopDataManager)
        {
            m_sopDataManager = sopDataManager;
        }

        public MessageResult UpdateUserInfo(ReqUpdateUserInfo req)
        {
            MessageResult result = new MessageResult();
            string strErrorMessage = null;

            User user = m_sopDataManager.GetSelectManager().SelectUser(req.AccountID, out strErrorMessage);
            if (user == null)
            {
                result.Message = strErrorMessage;
                return result;
            }

            user.UserLevel = req.LevelID;

            if (m_sopDataManager.GetUpdateManager().UpdateUser(user) == false)
            {
                result.Message = $"UpdateUser error";
                return result;
            }

            // .TODO: 메모 업데이트 기능도 추가 필요

            result.Success = true;
            return result;
        }

        public ResponseAddAccount AddAccount(ReqAddAccount req)
        {
            ResponseAddAccount result = new ResponseAddAccount();
            string strErrorMessage = null;

            // 아이디
            string strUserID = req.UserID;
            // 닉네임은 이름
            string strNickName = req.MemberName;
            // 비밀번호는 임시 1234 부여
            string strPassword = "1234";

            // 비밀번호 암호화
            string strSalt = MakeSalt();
            strPassword = EncryptPassword(strPassword, strSalt);

            int nMemberID = req.MemberID;
            int nAccountLevel = req.AccountLevel;

            // 계정 유무 확인
            Dictionary<User.Fields, object> dicConditions = new Dictionary<User.Fields, object>();
            dicConditions[User.Fields.MemberID] = nMemberID;

            List<User> users = m_sopDataManager.GetSelectManager().SelectUsers(dicConditions, out strErrorMessage);
            if (users == null)
            {
                result.Success = false;
                result.Message = $"SelectUsers error ({strErrorMessage})";
                return result;
            }
            else if (users.Count > 0)
            {
                result.Success = false;
                result.Message = "The user already exists.";
                return result;
            }

            // 계정 생성
            User user = m_sopDataManager.GetCreateManager().CreateUser(nMemberID, nAccountLevel, strUserID, strPassword, strNickName, m_sopDataManager.SiteID, strSalt);
            if (user == null)
            {
                result.Success = false;
                result.Message = "CreateUser error";
                return result;
            }

            result.AccountID = user.ID;
            result.Success = true;
            return result;
        }

        public ResponseDoubleCheckID DoubleCheckID(ReqDoubleCheckID req)
        {
            ResponseDoubleCheckID result = new ResponseDoubleCheckID();
            string strErrorMessage = null;

            // 계정 유무 확인
            Dictionary<User.Fields, object> dicConditions = new Dictionary<User.Fields, object>();
            dicConditions[User.Fields.UserID] = req.UserID;

            List<User> users = m_sopDataManager.GetSelectManager().SelectUsers(dicConditions, out strErrorMessage);
            if (users == null)
            {
                result.Success = false;
                result.Message = $"SelectUsers error ({strErrorMessage})";
                return result;
            }
            else if (users.Count > 0)
            {
                result.IsDouble = true;
                result.Message = "The user already exists.";
            }
            else
            {
                result.IsDouble = false;
            }

            result.Success = true;
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

        private string EncryptPassword(string strPassword, string strSalt)
        {
            strPassword += strSalt;
            System.Security.Cryptography.SHA256Managed sha256Managed = new System.Security.Cryptography.SHA256Managed();
            byte[] encryptBytes = sha256Managed.ComputeHash(System.Text.Encoding.UTF8.GetBytes(strPassword));
            return BitConverter.ToString(encryptBytes).Replace("-", "").ToLower();
        }

        public LoginResult Login_Hydrogen(string strUserID, string strPW, string strSessionKey, bool autoLogin, string browserID)
        {
            const string LoginFailMessage = "ID 또는 비밀번호를 잘못 입력하였습니다.";

            LoginResult result = null;
            User user = null;
            Level level = null;
            string strErrorMessage = null;
          
            result = new LoginResult();

            // ID 값으로 유저를 검색
            Dictionary<User.Fields, object> dicConditions = new Dictionary<User.Fields, object>();
            dicConditions[User.Fields.UserID] = strUserID;

            List<User> users = m_sopDataManager.GetSelectManager().SelectUsers(dicConditions, out strErrorMessage);
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

            //if (CheckLoginFailCount(user, null, out strErrorMessage) == false)
            //{
            //    result.Success = false;
            //    result.Message = strErrorMessage;
            //    return result;
            //}

            if (user.Password != strPW)
            {
                //if (SetLoginFailCount(user, out strErrorMessage))
                //{
                //    strErrorMessage = LoginFailMessage;
                //    //strErrorMessage = "비밀번호가 일치하지 않습니다.";
                //}

                result.Success = false;
                result.Message = LoginFailMessage;
                return result;
            }


            if (UpdateSession(user.ID, strSessionKey, autoLogin, browserID, out strErrorMessage) == false)
            {
                result.Success = false;
                result.Message = strErrorMessage;
                return result;
            }

            level = m_sopDataManager.GetSelectManager().SelectLevel(user.UserLevel, out strErrorMessage);

            if (level == null)
            {
                result.Success = false;
                result.Message = strErrorMessage;
                return result;
            }

            // 로그인 성공 시 PasswordCode 초기화
            //user.PasswordCode = null;
            //if (m_dataManager.GetUpdateManager().UpdateUser(user) == false)
            //{
            //    result.Success = false;
            //    result.Message = "PasswordCode 초기화 실패";
            //    return result;
            //}

            result.User = ApplicationUser.MakeUser(user, level, strSessionKey);
            result.Success = true;
            return result;
        }

        private bool UpdateSession(int nUserID, string strSessionKey, bool autoLogin, string browserID, out string strErrorMessage)
        {
            strErrorMessage = "";

            // 해당 유저 세션 유무 확인
            Dictionary<Session.Fields, object> dicConditions_sessions = new Dictionary<Session.Fields, object>();
            dicConditions_sessions[Session.Fields.AccountUserID] = nUserID;

            List<Session> sessions = m_sopDataManager.GetSelectManager().SelectSessions(dicConditions_sessions, out strErrorMessage);
            if (sessions == null)
            {
                return false;
            }

            // 있으면 삭제 후 생성, 없으면 생성
            if (sessions.Count > 0)
            {
                string strCondition = "AccountUserID = " + nUserID;
                if (!m_sopDataManager.GetDeleteManager().DeleteSession(strCondition))
                {
                    strErrorMessage = m_sopDataManager.GetDeleteManager().GetErrorMessage();
                    return false;
                }
            }

            DateTime dtNow = DateTime.Now;

            Session session = m_sopDataManager.GetCreateManager().CreateSession(nUserID, strSessionKey, dtNow, dtNow, autoLogin, browserID);
            if (session == null)
            {
                strErrorMessage = m_sopDataManager.GetCreateManager().GetErrorMessage();
                return false;
            }

            return true;
        }
    }
}
