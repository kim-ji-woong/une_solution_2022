using System;

namespace SyswillAlarmMonitor.Models
{
    using Sdms.Sensor;

    class AlarmSensor : IComparable
    {
        private Sdms.History.SensorZone m_sensorZoneHistory = null;
        private SensorZone m_sensorZone = null;
        private TagInfo m_tagInfo = null;
        private bool m_isAlarm = false;
        private AlarmData.AlarmTypes m_alarmType = AlarmData.AlarmTypes.None;
        private int m_nAlarmLevel = 0;

        public Sdms.History.SensorZone SensorZoneHistory
        {
            get { return m_sensorZoneHistory; }
            set { m_sensorZoneHistory = value; }
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

        public bool IsAlarm
        {
            get { return m_isAlarm; }
            set { m_isAlarm = value; }
        }

        public AlarmData.AlarmTypes AlarmType
        {
            get { return m_alarmType; }
            set { m_alarmType = value; }
        }

        public int AlarmLevel
        {
            get { return m_nAlarmLevel; }
            set { m_nAlarmLevel = value; }
        }

        public int CompareTo(object obj)
        {
            AlarmSensor alarmSensor = (AlarmSensor)obj;

            if (this.SensorZone == null || alarmSensor.SensorZone == null)
                return 0;

            return this.SensorZone.ID.CompareTo(alarmSensor.SensorZone.ID);
        }
    }
}
