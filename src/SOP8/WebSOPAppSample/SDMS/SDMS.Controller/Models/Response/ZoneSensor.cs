namespace SDMS.Controller.Models.Response
{
    public class ZoneSensor
    {
        private int m_nZoneID = -1;
        private string m_strZoneName = "";
        private int m_nSensorID = -1;
        private string m_strSensorName = "";

        public int ZoneID
        {
            get { return m_nZoneID; }
            set { m_nZoneID = value; }
        }

        public string ZoneName
        {
            get { return m_strZoneName; }
            set { m_strZoneName = value; }
        }

        public int SensorID
        {
            get { return m_nSensorID; }
            set { m_nSensorID = value; }
        }

        public string SensorName
        {
            get { return m_strSensorName; }
            set { m_strSensorName = value; }
        }
    }
}
