using System;

namespace IntegrationServer.ViewModels.Worker.SWayM
{
    public class WorkerEvent
    {
        // 긴급호출, 쓰러짐, 배터리교체, 장비협착, 2인1조
        public enum EventType { None = -1, EmergencyCall = 0, Collapse, ChangeBattery, Stuck, PairError }

        private EventType m_eventType = EventType.None;
        private DateTime m_dtTimeStamp = new DateTime();
        private string m_strEventID = "";
        private AP m_ap = null;
        private Worker m_worker = null;

        public EventType WorkerEventType
        {
            get { return m_eventType; }
            set { m_eventType = value; }
        }

        public DateTime TimeStamp
        {
            get { return m_dtTimeStamp; }
            set { m_dtTimeStamp = value; }
        }

        public string EventID
        {
            get { return m_strEventID; }
            set { m_strEventID = value; }
        }

        public AP AP
        {
            get { return m_ap; }
            set { m_ap = value; }
        }

        public Worker Worker
        {
            get { return m_worker; }
            set { m_worker = value; }
        }

        public static EventType ToEventType(string strEventType)
        {
            if (strEventType == "긴급호출" || strEventType == "EmergencyCall")
                return EventType.EmergencyCall;
            else if (strEventType == "쓰러짐" || strEventType == "Collapse")
                return EventType.Collapse;
            else if (strEventType == "배터리교체" || strEventType == "ChangeBattery")
                return EventType.ChangeBattery;
            else if (strEventType == "2인1조" || strEventType == "PairError")
                return EventType.PairError;
            else if (strEventType == "장비협착" || strEventType == "Stuck")
                return EventType.Stuck;

            return EventType.None;
        }
    }
}
