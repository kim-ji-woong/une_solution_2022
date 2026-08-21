using System.Collections.Generic;

namespace BusanTP.BLL.Models.Response
{
    public class ResponseExternalSensors : MessageResult
    {
        private List<BusanTP.Model.Sensor> m_sensors = new List<BusanTP.Model.Sensor>();
        
        public List<BusanTP.Model.Sensor> Sensors
        {
            get { return m_sensors; }
            set { m_sensors = value; }
        }
        
        public ResponseExternalSensors() : base()
        {
        }
        
        public ResponseExternalSensors(bool success, string message) : base(success, message)
        {
        }
    }
}