namespace Weather.BLL.Models.Request
{
    public class RequestData
    {
        private bool? m_requestWeatherInfo = null;
        private bool? m_requestWeatherInfo2 = null;
        private bool? m_requestWeatherWeeklyInfo = null;

        public bool? RequestWeatherInfo
        {
            get { return m_requestWeatherInfo; }
            set { m_requestWeatherInfo = value; }
        }

        public bool? RequestWeatherInfo2
        {
            get { return m_requestWeatherInfo2; }
            set { m_requestWeatherInfo2 = value; }
        }

        public bool? RequestWeatherWeeklyInfo
        {
            get { return m_requestWeatherWeeklyInfo; }
            set { m_requestWeatherWeeklyInfo = value; }
        }
    }
}
