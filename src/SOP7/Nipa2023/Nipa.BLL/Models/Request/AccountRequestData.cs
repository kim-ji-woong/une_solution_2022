using System;
using System.Collections.Generic;
using Nipa.Model.Account;

namespace Nipa.BLL.Models.Request
{
    public class AccountRequestData
    {
        private LoginData m_requestLogin = null;
        private RequestLoginKey m_requestLoginKey = null;

        public LoginData RequestLogin
        {
            get { return m_requestLogin; }
            set { m_requestLogin = value; }
        }

        public RequestLoginKey RequestLoginKey
        {
            get { return m_requestLoginKey; }
            set { m_requestLoginKey = value; }
        }
    }

    public class LoginData
    {
        private string m_strValue = "";
        private string m_strKey = "";

        public string Value
        {
            get { return m_strValue; }
            set { m_strValue = value; }
        }

        public string Key
        {
            get { return m_strKey; }
            set { m_strKey = value; }
        }
    }

    public class RequestLoginKey
    {
        private long? num = null;
        private string m_strUserID = null;

        public long? Num
        {
            get { return num; }
            set { num = value; }
        }

        public string UserID
        {
            get { return m_strUserID; }
            set { m_strUserID = value; }
        }
    }

    public class CheckLoginSession
    {
        private int m_nUserID = -1;
        private string m_strSessionKey = "";

        public int UserID
        {
            get { return m_nUserID; }
            set { m_nUserID = value; }
        }

        public string SessionKey
        {
            get { return m_strSessionKey; }
            set { m_strSessionKey = value; }
        }
    }

    public class RequestSaveAccountOption
    {
        private Option m_saveOption = null;

        public Option SaveOption
        {
            get { return m_saveOption; }
            set { m_saveOption = value; }
        }
    }

    public class RequestOption
    {
        private int m_nUserID = -1;
        private string m_strCategory = "";

        public int UserID
        {
            get { return m_nUserID; }
            set { m_nUserID = value; }
        }

        public string Category
        {
            get { return m_strCategory; }
            set { m_strCategory = value; }
        }
    }

    public class RequestUserList
    {
        private int m_nSiteID = -1;

        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }
    }

    public class UpdateUser
    {
        private List<int> m_deleteUserIDs = new List<int>();
        private List<UpdateUserData> m_updateUsers = new List<UpdateUserData>();

        public List<int> DeleteUserIDs
        {
            get { return m_deleteUserIDs; }
            set { m_deleteUserIDs = value; }
        }

        public List<UpdateUserData> UpdateUsers
        {
            get { return m_updateUsers; }
            set { m_updateUsers = value; }
        }
    }

    public class RequestRegularMemberList
    {
        private int m_nSiteID = -1;
        private string m_strKeyword = "";

        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }

        public string Keyword
        {
            get { return m_strKeyword; }
            set { m_strKeyword = value; }
        }
    }

    public class RequestCreateUser
    {
        private int m_nRegularMemberID = -1;
        private string m_strUserID = null;
        private int m_nAccountLevelID = -1;
        private int m_nSiteID = -1;

        public int RegularMemberID
        {
            get { return m_nRegularMemberID; }
            set { m_nRegularMemberID = value; }
        }

        public string UserID
        {
            get { return m_strUserID; }
            set { m_strUserID = value; }
        }

        public int AccountLevelID
        {
            get { return m_nAccountLevelID; }
            set { m_nAccountLevelID = value; }
        }

        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }
    }

    public class RequestChangePassword
    {
        private string m_strOldValue = "";
        private string m_strNewValue = "";
        private string m_strKey = "";

        public string OldValue
        {
            get { return m_strOldValue; }
            set { m_strOldValue = value; }
        }

        public string NewValue
        {
            get { return m_strNewValue; }
            set { m_strNewValue = value; }
        }

        public string Key
        {
            get { return m_strKey; }
            set { m_strKey = value; }
        }
    }

    public class RequestFindPassword
    {
        private string m_strUserName = "";
        private string m_strPhoneNumber = "";

        public string UserName
        {
            get { return m_strUserName; }
            set { m_strUserName = value; }
        }

        public string PhoneNumber
        {
            get { return m_strPhoneNumber; }
            set { m_strPhoneNumber = value; }
        }
    }
}
