namespace Hynix.BLL.Request
{
    public class SaveLogDeletePolicy
    {
        private int m_nDeleteOption = 0;
        private int m_nSiteID = -1;

        public int DeleteOption
        {
            get { return m_nDeleteOption; }
            set { m_nDeleteOption = value; }
        }

        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }
    }
}
