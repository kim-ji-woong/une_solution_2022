using SOPManager.BLL.Models.Response;
using SOPManager.Model.Sop.Account;
using System;
using System.Collections.Generic;
using System.Text;

namespace SOPManager.BLL.Models
{
    [Serializable]
    public class ApplicationUser
    {
        private int m_nID = -1;
        private int m_nLevelID = -1;
        private string m_strLevel = "";
        private string m_strUserID = "";
        private string m_strNickName = "";
        private string m_strSessionKey = "";
        private object m_options = new object();
        private int m_nSiteID = -1;

        public int ID
        {
            get { return m_nID; }
            set { m_nID = value; }
        }

        public int LevelID
        {
            get { return m_nLevelID; }
            set { m_nLevelID = value; }
        }

        public string Level
        {
            get { return m_strLevel; }
            set { m_strLevel = value; }
        }

        public string UserID
        {
            get { return m_strUserID; }
            set { m_strUserID = value; }
        }

        public string NickName
        {
            get { return m_strNickName; }
            set { m_strNickName = value; }
        }

        public string SessionKey 
        { 
            get { return m_strSessionKey; }
            set { m_strSessionKey = value; }
        }

        public object Options
        {
            get { return m_options; }
            set { m_options = value; }
        }

        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }

        public static ApplicationUser MakeUser(User user, Level level, string strSessionKey)
        {
            ApplicationUser appUser = new ApplicationUser();
            appUser.ID = user.ID;
            appUser.LevelID = user.UserLevel;
            appUser.Level = level.LevelName;
            appUser.UserID = user.UserID;
            appUser.NickName = user.NickName;
            appUser.SessionKey = strSessionKey;
            appUser.SiteID = user.SiteID;

            return appUser;
        }
    }

    public class ResponseSiteID : MessageResult
    {
        private List<int> m_nSiteIDs = null;

        public List<int> SiteIDs
        {
            get { return m_nSiteIDs; }
            set { m_nSiteIDs = value; }
        }
    }

    public class LoginResult : MessageResult
    {
        private ApplicationUser m_user = null;

        public ApplicationUser User
        {
            get { return m_user; }
            set { m_user = value; }
        }

        public LoginResult()
            : base()
        {
        }

        public LoginResult(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseLoginKey : MessageResult
    {
        private string m_strLoginKey = "";
        private string m_strSalt = "";
        private bool m_externalLogin = false;

        public string LoginKey
        {
            get { return m_strLoginKey; }
            set { m_strLoginKey = value; }
        }

        public string Salt
        {
            get { return m_strSalt; }
            set { m_strSalt = value; }
        }

        public bool ExternalLogin
        {
            get { return m_externalLogin; }
            set { m_externalLogin = value; }
        }
    }
}
