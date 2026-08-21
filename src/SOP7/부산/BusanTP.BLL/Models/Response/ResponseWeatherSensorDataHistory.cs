using System.Collections.Generic;

namespace BusanTP.BLL.Models.Response
{
    public class ResponseWeatherSensorDataHistory : MessageResult
    {
        private List<Model.WeatherSensorDataHistory> m_sensorDataHistories = new List<Model.WeatherSensorDataHistory>();
        
        public List<Model.WeatherSensorDataHistory> WeatherSensorDataHistories
        {
            get { return m_sensorDataHistories; }
            set { m_sensorDataHistories = value; }
        }
        
        public ResponseWeatherSensorDataHistory() : base()
        {
        }
        
        public ResponseWeatherSensorDataHistory(bool success, string message) : base(success, message)
        {
        }
    }
}