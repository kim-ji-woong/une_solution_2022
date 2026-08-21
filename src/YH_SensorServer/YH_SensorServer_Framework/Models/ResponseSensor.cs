using System.Collections.Generic;

namespace YH_SensorServer_Framework.Models
{
    public class ResponseSensor : MessageResult
    {
        private List<SensorValueEx> m_sensorValues = new List<SensorValueEx>();

        public List<SensorValueEx> Sensors
        {
            get { return m_sensorValues; }
            set { m_sensorValues = value; }
        }

        public ResponseSensor()
            : base()
        {
        }

        public ResponseSensor(bool success, string message)
            : base(success, message)
        {
        }
    }
}
