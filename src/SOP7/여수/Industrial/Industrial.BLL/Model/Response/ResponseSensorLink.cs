using SensorServer.Model.Yeosu.External;
using System;
using System.Collections.Generic;
using System.Text;

namespace Industrial.BLL.Model.Response
{
    public class ResponseSensorLink : MessageResult
    {
        private List<SensorLink> m_responseSensorDatas = new List<SensorLink>();

        public List<SensorLink> SensorLinks
        {
            get { return m_responseSensorDatas;}
        }

        public ResponseSensorLink() : base()
        {

        }

        public ResponseSensorLink(bool success, string message) : base(success, message)
        {

        }
    }
}
