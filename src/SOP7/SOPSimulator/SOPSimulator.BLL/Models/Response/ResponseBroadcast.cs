using System;
using System.Collections.Generic;
using System.Text;

namespace SOPSimulator.BLL.Models.Response
{
    public class ResponseBroadcastRunning
    {
        private bool m_success = false;
        private string m_strMessage = "";
        private bool m_runBroadcast = false;

        public bool Success
        {
            get { return m_success; }
            set { m_success = value; }
        }

        public string Message
        {
            get { return m_strMessage; }
            set { m_strMessage = value; }
        }

        // 실행중인 방송이 있는가?
        public bool RunBroadcast
        {
            get { return m_runBroadcast; }
            set { m_runBroadcast = value; }
        }

        public ResponseBroadcastRunning()
        {
        }

        public ResponseBroadcastRunning(bool success, string message, bool run)
        {
            m_success = success;
            m_strMessage = message;
            m_runBroadcast = run;
        }
    }
}
