using SensorServer.Model.Yeosu;
using System;
using System.Collections.Generic;
using System.Text;

namespace Industrial.BLL.Model.Response
{
    public class ResponseSensorDataHistory : MessageResult
    {
        private List<EtcSensorDataHistory> m_etcSensorDataHistory = new List<EtcSensorDataHistory>();

        private Dictionary<int, List<EtcSensorDataHistory>> m_dicEtcSensorDataHistory = new Dictionary<int, List<EtcSensorDataHistory>>();

        public List<EtcSensorDataHistory> EtcSensorDataHistories
        {
            get { return m_etcSensorDataHistory; }
        }

        public Dictionary<int, List<EtcSensorDataHistory>> DicEtcSensorDataHistory
        {
            get { return m_dicEtcSensorDataHistory; }
            set { m_dicEtcSensorDataHistory = value; }
        }

        public ResponseSensorDataHistory()
            : base()
        {
        }

        public ResponseSensorDataHistory(bool success, string message)
            : base(success, message)
        {
        }
    }
}
