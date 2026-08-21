using System;
using SDMS.Model.Sensor;

namespace PlcSensorServer.Data
{
    public class EtcSensor : ETC
    {
        private int m_nSensorZoneID = -1;
        private int m_nSensorTagInfoID = -1;
        private DateTime m_dtAlarm = new DateTime();
        private bool m_isAlarmStatus = false;

        public int SensorZoneID
        {
            get { return m_nSensorZoneID; }
            set { m_nSensorZoneID = value; }
        }

        public int SensorTagInfoID
        {
            get { return m_nSensorTagInfoID; }
            set { m_nSensorTagInfoID = value; }
        }

        public DateTime AlarmTime
        {
            get { return m_dtAlarm; }
            set { m_dtAlarm = value; }
        }

        public bool IsAlarmStatus
        {
            get { return m_isAlarmStatus; }
            set { m_isAlarmStatus = value; }
        }

        public EtcSensor()
        {
        }

        public EtcSensor(ETC sensor)
        {
            this.CurrentData = sensor.CurrentData;
            this.Department = sensor.Department;
            this.DepartmentPhoneNumber = sensor.DepartmentPhoneNumber;
            this.Enabled = sensor.Enabled;
            this.ID = sensor.ID;
            this.MaterialType = sensor.MaterialType;
            this.Name = sensor.Name;
            this.PositionName = sensor.PositionName;
            this.Status = sensor.Status;
            this.UniqueKey = sensor.UniqueKey;
            this.X = sensor.X;
            this.Y = sensor.Y;
            this.Z = sensor.Z;
            this.ZoneID = sensor.ZoneID;
        }
    }
}
