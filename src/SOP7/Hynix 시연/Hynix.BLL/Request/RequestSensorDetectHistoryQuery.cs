namespace Hynix.BLL.Request
{
    public class RequestSensorDetectHistoryQuery
    {
        private int m_nLastSensorZoneHistoryID = -1;
        private int m_nRowCount = 10; // 한 페이지에 보여줄 row 개수
        private int m_nSiteID = -1;
        private string m_strCondition = null;

        public int LastSensorZoneHistoryID
        {
            get { return m_nLastSensorZoneHistoryID; }
            set { m_nLastSensorZoneHistoryID = value; }
        }

        public int RowCount
        {
            get { return m_nRowCount; }
            set { m_nRowCount = value; }
        }

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
