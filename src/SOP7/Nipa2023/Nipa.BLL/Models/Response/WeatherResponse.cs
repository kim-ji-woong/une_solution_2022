using System.Collections.Generic;

namespace Nipa.BLL.Models.Response
{
    public class ResponseCurrentWeatherDatas : MessageResult
    {
        private List<WeatherData> m_weatherDatas = new List<WeatherData>();

        public List<WeatherData> WeatherDatas
        {
            get { return m_weatherDatas; }
        }

        public ResponseCurrentWeatherDatas()
            : base()
        {
        }

        public ResponseCurrentWeatherDatas(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseWeeklyInfo : MessageResult
    {
        private List<WeatherWeeklyData> m_datas = null;

        public List<WeatherWeeklyData> Datas
        {
            get { return m_datas; }
            set { m_datas = value; }
        }
    }
}
