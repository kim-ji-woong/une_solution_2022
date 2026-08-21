using System;

namespace SOPWebServer2.Model.Request
{
    public class AddMovingPosition
    {
        private int m_nSensorZoneHistoryID = -1;
        private DateTime m_timeStamp = new DateTime();
        private string m_strPosition = "";

        public int SensorZoneHistoryID
        {
            get { return m_nSensorZoneHistoryID; }
            set { m_nSensorZoneHistoryID = value; }
        }

        public DateTime Timestamp
        {
            get { return m_timeStamp; }
            set { m_timeStamp = value; }
        }

        public string Position
        {
            get { return m_strPosition; }
            set { m_strPosition = value; }
        }
    }
}
