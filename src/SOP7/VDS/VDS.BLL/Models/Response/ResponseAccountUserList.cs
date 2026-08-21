using System.Collections.Generic;
using VDS.Model;
using VDS.Model.Account;

namespace VDS.BLL.Models.Response
{
    public class ResponseAccountUserList : MessageResult
    {
        private List<AccountUserEx> m_users = new List<AccountUserEx>();
        private List<Level> m_levels = new List<Level>();

        public List<AccountUserEx> Users
        {
            get { return m_users; }
            set { m_users = value; }
        }

        public List<Level> Levels
        {
            get { return m_levels; }
            set { m_levels = value; }
        }

        public ResponseAccountUserList()
            : base()
        {
        }

        public ResponseAccountUserList(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseAccountUserDataList : MessageResult
    {
        private List<AccountUser2> m_users = new List<AccountUser2>();

        public List<AccountUser2> Users
        {
            get { return m_users; }
            set { m_users = value; }
        }

        public ResponseAccountUserDataList()
            : base()
        {
        }

        public ResponseAccountUserDataList(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseAccountUserData : MessageResult
    {
        private AccountUser2 m_user = null;

        public AccountUser2 User
        {
            get { return m_user; }
            set { m_user = value; }
        }

        public ResponseAccountUserData()
            : base()
        {
        }

        public ResponseAccountUserData(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class AccountUserEx
    {
        private int m_nUserID = -1;
        private Level m_userLevel = null;
        private string m_strUserID = "";
        private string m_strNickName = "";
        private string m_strSalt = "";
        
        public int ID
        {
            get { return m_nUserID; }
            set { m_nUserID = value; }
        }

        public Level UserLevel
        {
            get { return m_userLevel; }
            set { m_userLevel = value; }
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

        public string Salt
        {
            get { return m_strSalt; }
            set { m_strSalt = value; }
        }
    }

    public class AccountUser2
    {
        private int m_nID = -1;
        private Level m_userLevel = null;
        private string m_strUserID = "";
        private string m_strNickName = "";
        private UserData m_userData = null;
        private List<Model.DataCenter.DataCenter> m_dataCenters = new List<Model.DataCenter.DataCenter>();

        public int ID
        {
            get { return m_nID; }
            set { m_nID = value; }
        }

        public Level UserLevel
        {
            get { return m_userLevel; }
            set { m_userLevel = value; }
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

        public AccountUser2()
        {
        }

        public AccountUser2(User user, UserData userData, Level level, ICollection<Model.DataCenter.DataCenter> dataCenters)
        {
            ID = user.ID;
            UserLevel = level;
            UserID = user.UserID;
            NickName = user.NickName;
            UserData = userData;
            DataCenters.AddRange(dataCenters);
        }
    }

    public class ResponseAccountLevels : MessageResult
    {
        private List<Level> m_levels = new List<Level>();

        public List<Level> Levels
        {
            get { return m_levels; }
            set { m_levels = value; }
        }

        public ResponseAccountLevels()
            : base()
        {
        }

        public ResponseAccountLevels(bool success, string message)
            : base(success, message)
        {
        }
    }
}
