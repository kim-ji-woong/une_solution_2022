namespace YH_SensorServer_Framework.Models
{
    public class SensorConfig
    {
        private int m_nSensorID = -1;
        private float? m_fAlarmLimit1 = null;
        private float? m_fAlarmLimit2 = null;
        private float? m_fAlarmLimit3 = null;

        public int SensorID
        {
            get { return m_nSensorID; }
            set { m_nSensorID = value; }
        }

        public float? AlarmLimit1
        {
            get { return m_fAlarmLimit1; }
            set { m_fAlarmLimit1 = value; }
        }

        public float? AlarmLimit2
        {
            get { return m_fAlarmLimit2; }
            set { m_fAlarmLimit2 = value; }
        }

        public float? AlarmLimit3
        {
            get { return m_fAlarmLimit3; }
            set { m_fAlarmLimit3 = value; }
        }
    }
}
