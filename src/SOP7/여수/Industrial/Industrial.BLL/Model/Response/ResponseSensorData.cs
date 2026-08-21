using Industrial.BLL.Model.Etc;
using SensorServer.Model.Yeosu;
using System;
using System.Collections.Generic;
using System.Text;
using EtcSensorData = SensorServer.Model.Yeosu.EtcSensorData;

namespace Industrial.BLL.Model.Response
{
    public class ResponseSensorDatas : MessageResult
    {
        private List<SensorData> m_responseSensorDatas = new List<SensorData>();

        public List<SensorData> SensorDatas
        {
            get { return m_responseSensorDatas; }
        }

        public ResponseSensorDatas() : base()
        {

        }

        public ResponseSensorDatas(bool success, string message) : base(success, message)
        {

        }
    }
}
