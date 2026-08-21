namespace Hynix.BLL.Request
{
    public class RequestSensorDetectAnalysisQuery
    {
        private int m_nSiteID = -1;
        private string m_strCondition = null;

        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }

        public string Condition
        {
            get { return m_strCondition; }
            set { m_strCondition = value; }
        }
    }
}
