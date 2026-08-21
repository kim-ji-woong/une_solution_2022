using Nipa.Model.Sdms.Sensor;

namespace IntegrationServer.ViewModels.Worker.SWayM
{
    public class Gas
    {
        private PSM m_sensor = null;
        private int m_nSensorZoneID = -1;
        private int m_nTagInfoID = -1;
        private string m_strGasType = "";
        private double m_data = -1;

        public PSM Sensor
        {
            get { return m_sensor; }
            set { m_sensor = value; }
        }

        public int SensorZoneID
        {
            get { return m_nSensorZoneID; }
            set { m_nSensorZoneID = value; }
        }

        public int TagInfoID
        {
            get { return m_nTagInfoID; }
            set { m_nTagInfoID = value; }
        }

        public string GasType
        {
            get { return m_strGasType; }
            set { m_strGasType = value; }
        }

        public double Data
        {
            get { return m_data; }
            set { m_data = value; }
        }
    }
}
