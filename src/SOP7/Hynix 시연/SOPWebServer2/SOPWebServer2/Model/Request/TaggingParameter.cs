using System;

namespace SOPWebServer2.Model.Request
{
    public class TaggingParameter
    {
        private int m_nSensorZoneID = -1;
        private DateTime? m_timeStamp = null;
        private int? m_cardReaderID = null;
        private int? m_smartTagReaderID = null;

        public int SensorZoneID
        {
            get { return m_nSensorZoneID; }
            set { m_nSensorZoneID = value; }
        }

        public DateTime? Timestamp
        {
            get { return m_timeStamp; }
            set { m_timeStamp = value; }
        }

        public int? CardReaderID
        {
            get { return m_cardReaderID; }
            set { m_cardReaderID = value; }
        }

        public int? SmartTagReaderID
        {
            get { return m_smartTagReaderID; }
            set { m_smartTagReaderID = value; }
        }
    }
}
