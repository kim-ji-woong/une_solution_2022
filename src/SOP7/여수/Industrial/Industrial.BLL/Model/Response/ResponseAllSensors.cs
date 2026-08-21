using System.Collections.Generic;

namespace Industrial.BLL.Model.Response
{
    using Org.BouncyCastle.Utilities;
    using Sensors;
    using System.Net;

    public class ResponseAllSensors : MessageResult
    {
        private List<Atmosphere> m_atmospheres = new List<Atmosphere>();
        private List<Weather> m_weathers = new List<Weather>();
        private List<Water> m_waters = new List<Water>();
        private List<VOC> m_vocs = new List<VOC>();
        private List<Stink> m_stinks = new List<Stink>();

        public List<Atmosphere> Atmospheres
        {
            get { return m_atmospheres; }
        }

        public List<Weather> Weathers
        {
            get { return m_weathers; }
        }

        public List<Water> Waters
        {
            get { return m_waters; }
        }

        public List<VOC> Vocs 
        {
            get { return m_vocs; }
        }

        public List<Stink> Stinks
        {
            get { return m_stinks; }
        }

        public ResponseAllSensors()
            : base()
        {
        }

        public ResponseAllSensors(bool success, string message)
            : base(success, message)
        {
        }
    }
}
