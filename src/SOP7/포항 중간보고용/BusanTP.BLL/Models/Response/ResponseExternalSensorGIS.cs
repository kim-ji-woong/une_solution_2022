using System.Collections.Generic;

namespace BusanTP.BLL.Models.Response
{
    public class ResponseExternalSensorGIS : MessageResult
    {
        private List<BusanTP.Model.SensorGIS> m_sensorGISs = new List<BusanTP.Model.SensorGIS>();

        public List<BusanTP.Model.SensorGIS> SensorGISs
        {
            get { return m_sensorGISs; }
            set { m_sensorGISs = value; }
        }
        
        public ResponseExternalSensorGIS() : base()
        {
        }   
        
        public ResponseExternalSensorGIS(bool success, string message) : base(success, message)
        {
        }
    }
}