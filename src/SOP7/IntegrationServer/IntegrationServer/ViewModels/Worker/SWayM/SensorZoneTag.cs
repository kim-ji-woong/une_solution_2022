using Nipa.Model.Sdms.Sensor;

namespace IntegrationServer.ViewModels.Worker.SWayM
{
    public class SensorZoneTag
    {
        private int m_nApNo = -1;
        private SensorZone m_sensorZone = null;
        private TagInfo m_tagInfo = null;

        public int ApNo
        {
            get { return m_nApNo; }
            set { m_nApNo = value; }
        }

        public SensorZone SensorZone
        {
            get { return m_sensorZone; }
            set { m_sensorZone = value; }
        }

        public TagInfo TagInfo
        {
            get { return m_tagInfo; }
            set { m_tagInfo = value; }
        }

        public SensorZoneTag(SensorZone sensorZone, TagInfo tagInfo)
        {
            m_sensorZone = sensorZone;
            m_tagInfo = tagInfo;
        }
    }

    public class AlarmSensor
    {
        private SensorZoneTag m_sensorZoneTag = null;
        private WorkerEvent m_workerEvent = null;
        private int m_nSensorZoneHistoryID = -1;

        public SensorZoneTag SensorZoneTag
        {
            get { return m_sensorZoneTag; }
            set { m_sensorZoneTag = value; }
        }

        public WorkerEvent WorkerEvent
        {
            get { return m_workerEvent; }
            set { m_workerEvent = value; }
        }

        public int SensorZoneHistoryID
        {
            get { return m_nSensorZoneHistoryID; }
            set { m_nSensorZoneHistoryID = value; }
        }

        public AlarmSensor(SensorZoneTag sensorZoneTag, WorkerEvent workerEvent)
        {
            m_sensorZoneTag = sensorZoneTag;
            m_workerEvent = workerEvent;
        }
    }
}
