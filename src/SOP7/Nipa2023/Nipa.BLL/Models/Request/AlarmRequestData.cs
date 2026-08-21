namespace Nipa.BLL.Models.Request
{
    public class RequestAlarmPeriod
    {
        private int m_nBeginDate = 0;
        private int m_nEndDate = 0;

        // YYYY * 10000 + MM * 100 + DD
        public int BeginDate
        {
            get { return m_nBeginDate; }
            set { m_nBeginDate = value; }
        }

        // YYYY * 10000 + MM * 100 + DD
        public int EndDate
        {
            get { return m_nEndDate; }
            set { m_nEndDate = value; }
        }
    }

    public class RequestClearAlarm
    {
        private int m_nSensorZoneID = -1;
        private int m_nSensorZoneHistoryID = -1;
        private int m_nAccessedUserID = -1;
        private string m_strMemo = null;
        private bool m_isMalfunction = true;

        public int SensorZoneID
        {
            get { return m_nSensorZoneID; }
            set { m_nSensorZoneID = value; }
        }

        public int SensorZoneHistoryID
        {
            get { return m_nSensorZoneHistoryID; }
            set { m_nSensorZoneHistoryID = value; }
        }

        public int AccessedUserID
        {
            get { return m_nAccessedUserID; }
            set { m_nAccessedUserID = value; }
        }

        public string Memo
        {
            get { return m_strMemo; }
            set { m_strMemo = value; }
        }

        public bool IsMalfunction
        {
            get { return m_isMalfunction; }
            set { m_isMalfunction = value; }
        }
    }

    /// <summary>
    /// 상황 전파
    /// </summary>
    public class RequestSituationNotice
    {
        private int m_nSensorType = -1;
        public int SensorType
        {
            get { return m_nSensorType; }
            set { m_nSensorType = value; }
        }

        private int m_nSensorZoneID = -1;
        public int SensorZoneID
        {
            get { return m_nSensorZoneID; }
            set { m_nSensorZoneID = value; }
        }
    }
}
