namespace CCTVMonitor.Proc
{
    class ProcessData
    {
        private string m_strGuid = "";
        private int m_nUserID = -1;
        private int? m_sensorZoneHistoryID = null;

        public string Guid
        {
            get { return m_strGuid; }
            set { m_strGuid = value; }
        }

        public int UserID
        {
            get { return m_nUserID; }
            set { m_nUserID = value; }
        }

        public int? SensorZoneHistoryID
        {
            get { return m_sensorZoneHistoryID; }
            set { m_sensorZoneHistoryID = value; }
        }

        public ProcessData()
        {
        }

        public ProcessData(string guid, int userID, int? sensorZoneHistoryID)
        {
            m_strGuid = guid;
            m_nUserID = userID;
            m_sensorZoneHistoryID = sensorZoneHistoryID;
        }
    }
}
