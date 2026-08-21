namespace DbBackup.Models.Request
{
    class SensorParameter
    {
        private int m_nHeader = 0;
        private string m_strClientInfo = "";

        public int Header
        {
            get { return m_nHeader; }
            set { m_nHeader = value; }
        }

        public string ClientInfo
        {
            get { return m_strClientInfo; }
            set { m_strClientInfo = value; }
        }

        public SensorParameter()
        {
        }

        public SensorParameter(int header, string strClientInfo)
        {
            m_nHeader = header;
            m_strClientInfo = strClientInfo;
        }
    }
}
