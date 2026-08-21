using System.Collections.Generic;
using BusanTP.BLL.Models.Sensor;

namespace BusanTP.BLL.Models.Response
{
    public class ResponseAllSensors : MessageResult
    {
        private List<Atmosphere> m_atmospheres = new List<Atmosphere>();
        private List<Weather> m_weathers = new List<Weather>();
        private List<KWeather> m_kWeathers = new List<KWeather>();
        private List<Electricity> m_electricities = new List<Electricity>();
        
        public List<Atmosphere> Atmospheres
        {
            get { return m_atmospheres; }
        }
        
        public List<Weather> Weathers
        {
            get { return m_weathers; }
        }
        
        public List<KWeather> KWeathers
        {
            get { return m_kWeathers; }
        }
        
        public List<Electricity> Electricities
        {
            get { return m_electricities; }
        }
        
        public ResponseAllSensors() : base()
        {
        }
        
        public ResponseAllSensors(bool success, string message) : base(success, message)
        {
        }
    }
}