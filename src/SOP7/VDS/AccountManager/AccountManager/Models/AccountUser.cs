using System.Collections.Generic;

namespace AccountManager.Models
{
    public class AccountUser
    {
        private int m_nUserID = -1;
        private Level m_userLevel = null;
        private string m_strUserID = "";
        private string m_strNickName = "";
        private string m_strSalt = "";
        private List<int> m_dataCenterIDs = null;
        private string m_strPassword = null;

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

        public List<int> DataCenterIDs
        {
            get { return m_dataCenterIDs; }
            set { m_dataCenterIDs = value; }
        }

        public string Password
        {
            get { return m_strPassword; }
            set { m_strPassword = value; }
        }
    }

    public class Level
    {
        public int ID { get; set; }
        public string LevelName { get; set; }
        public string LevelEngName { get; set; }

        public override string ToString()
        {
            return LevelName;
        }
    }
}
