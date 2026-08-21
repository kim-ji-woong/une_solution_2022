using System.Collections.Generic;
using VDS.Model;
using VDS.Model.Account;

namespace VDS.BLL.Models.Account
{
    public class ApplicationUser
    {
        private int m_nID = -1;
        private int m_nLevelID = -1;
        private string m_strUserID = "";
        private string m_strNickName = "";
        private string m_strSessionKey = "";
        private object m_options = new object();
        private Level m_userLevel = null;
        private UserData m_userData = null;
        private List<Model.DataCenter.DataCenter> m_dataCenters = new List<Model.DataCenter.DataCenter>();
        private Model.Site.Data m_siteData = null;

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

        public Level UserLevel
        {
            get { return m_userLevel; }
            set { m_userLevel = value; }
        }

        public UserData UserData
        {
            get { return m_userData; }
            set { m_userData = value; }
        }

        public List<Model.DataCenter.DataCenter> DataCenters
        {
            get { return m_dataCenters; }
            set { m_dataCenters = value; }
        }

        public Model.Site.Data SiteData
        {
            get { return m_siteData; }
            set { m_siteData = value; }
        }

        public static ApplicationUser MakeUser(User user, Level level, UserData userData, List<Model.DataCenter.DataCenter> dataCenters, string strSessionKey)
        {
            ApplicationUser appUser = new ApplicationUser();
            appUser.ID = user.ID;
            appUser.LevelID = user.UserLevel;
            appUser.UserID = user.UserID;
            appUser.NickName = user.NickName;
            appUser.SessionKey = strSessionKey;
            appUser.UserLevel = level;
            appUser.UserData = userData;
            appUser.DataCenters.AddRange(dataCenters);

            return appUser;
        }
    }
}
