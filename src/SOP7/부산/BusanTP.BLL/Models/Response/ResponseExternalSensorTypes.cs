using System.Collections.Generic;

namespace BusanTP.BLL.Models.Response
{
    public class ResponseExternalSensorTypes : MessageResult
    {
        private List<BusanTP.Model.SensorType> m_sensorTypes = new List<BusanTP.Model.SensorType>();
        
        public List<BusanTP.Model.SensorType> SensorTypes
        {
            get { return m_sensorTypes; }
            set { m_sensorTypes = value; }
        }
        
        public ResponseExternalSensorTypes() : base()
        {
        }
        
        public ResponseExternalSensorTypes(bool success, string message) : base(success, message)
        {
        }
    }
}