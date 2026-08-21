using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using dnsTcpLib2;

namespace IntegrationServer.Servers.EmergencyBell.Nextronics
{
    class ServerProvider : TcpServiceProvider
    {
        private NextronicsManager m_mgr = null;

        public ServerProvider(NextronicsManager mgr)
        {
            m_mgr = mgr;
        }

        public override object Clone()
        {
            return new ServerProvider(m_mgr);
        }

        public override void OnAcceptConnection(ConnectionState state)
        {
            state.LengthAdd = false;

            System.Net.IPEndPoint endPoint = (System.Net.IPEndPoint)state.RemoteEndPoint;
            string strIP = endPoint.Address.ToString();

            string strLog = string.Format("{0} connected...", strIP);
            m_mgr.WriteLog(strLog);
        }

        public override void OnDropConnection(ConnectionState state)
        {
            System.Net.IPEndPoint endPoint = (System.Net.IPEndPoint)state.RemoteEndPoint;
            string strIP = endPoint.Address.ToString();

            string strLog = string.Format("{0} disconnected...", strIP);
            m_mgr.WriteLog(strLog);
        }

        public override bool OnReceiveData(ConnectionState state)
        {
            if (!base.OnReceiveData(state))
                return false;

            byte[] receivedData = state.RecivedBuffer;

            if (receivedData == null)
                return false;

            Encoding encoding = Encoding.GetEncoding("ks_c_5601");
            string strReceived = encoding.GetString(receivedData, 0, receivedData.Length);
            m_mgr.WriteLog(strReceived);

            return ParseData(strReceived);
        }

        private bool ParseData(string strData)
        {
            //string str = "<start=0045&0>$version=2.0$sensor=144$state=1";

            int? sensorID = GetInt(strData, "sensor");
            int? state = GetInt(strData, "state");

            if (sensorID != null && state != null)
            {
                m_mgr.ProcessData((int)sensorID, (int)state == 1);
                return true;
            }

            return false;
        }

        private int? GetInt(string strData, string strTarget)
        {
            int index = strData.IndexOf(strTarget);

            if (index > 0)
            {
                index = strData.IndexOf('=', index + 1);

                if (index > 0)
                {
                    int no = 0;
                    int len = strData.Length;

                    for (int i = index+1; i < len; i++)
                    {
                        char ch = strData[i];

                        if (ch >= '0' && ch <= '9')
                            no = no * 10 + (int)(ch - '0');
                        else
                            break;
                    }

                    return no;
                }
            }

            return null;
        }
    }
}
