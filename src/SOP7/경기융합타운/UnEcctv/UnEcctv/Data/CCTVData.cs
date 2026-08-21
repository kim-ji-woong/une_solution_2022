namespace UnEcctv.Data
{
    public class CCTVData
    {
        private string m_strTitle = "";
        private int m_nID = -1;
        private string m_strUrl = "";

        public int ID
        {
            get { return m_nID; }
            set { m_nID = value; }
        }

        public string Title
        {
            get { return m_strTitle; }
            set { m_strTitle = value; }
        }

        public string Url
        {
            get { return m_strUrl; }
            set { m_strUrl = value; }
        }
    }
}
