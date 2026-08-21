using System;

namespace SOPWebServer.BLL.Request
{
    public class SendEvent
    {
        public enum EventTypes { None = 0, ForcedDoorOpen = 1 };

        private int m_nCardReaderID = -1;
        private DateTime m_timestamp = new DateTime();
        private int m_nEventType = (int)EventTypes.None;

        public int CardReaderID
        {
            get { return m_nCardReaderID; }
            set { m_nCardReaderID = value; }
        }

        public DateTime Timestamp
        {
            get { return m_timestamp; }
            set { m_timestamp = value; }
        }

        public int EventType
        {
            get { return m_nEventType; }
            set { m_nEventType = value; }
        }
    }
}
