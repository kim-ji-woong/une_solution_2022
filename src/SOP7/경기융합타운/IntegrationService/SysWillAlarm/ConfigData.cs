namespace SysWillAlarm
{
    public class ConfigData
    {
        private string m_strBaseUrl = "";
        private int m_nSiteID = -1;
        private string m_strDBHost = "";
        private string m_strDbId = "";
        private string m_strDbPw = "";
        private string m_strDbName = "";
        private int m_nDbType = 0;
        private string m_strSOPWebServerUrl = "";

        public string BaseUrl
        {
            get { return m_strBaseUrl; }
            set { m_strBaseUrl = value; }
        }

        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }

        public string DbHost
        {
            get { return m_strDBHost; }
            set { m_strDBHost = value; }
        }

        public string DbId
        {
            get { return m_strDbId; }
            set { m_strDbId = value; }
        }

        public string DbPw
        {
            get { return m_strDbPw; }
            set { m_strDbPw = value; }
        }

        public string DbName
        {
            get { return m_strDbName; }
            set { m_strDbName = value; }
        }

        public int DbType
        {
            get { return m_nDbType; }
            set { m_nDbType = value; }
        }

        public string SOPWebServerUrl
        {
            get { return m_strSOPWebServerUrl; }
            set { m_strSOPWebServerUrl = value; }
        }
    }
}
