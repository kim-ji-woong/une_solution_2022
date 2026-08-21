using System.Collections.Generic;

namespace BusanTP.BLL.Models.Response
{
    public class ResponseWeatherHistory : MessageResult
    {
        private List<Model.SensorDataHistory> m_sensorDataHistories = new List<Model.SensorDataHistory>();   
        
        public List<Model.SensorDataHistory> SensorDataHistories
        {
            get { return m_sensorDataHistories; }
            set { m_sensorDataHistories = value; }
        }
        
        public ResponseWeatherHistory() : base()
        {
        }

        public ResponseWeatherHistory(bool success, string message) : base(success, message)
        {
        }
    }
}