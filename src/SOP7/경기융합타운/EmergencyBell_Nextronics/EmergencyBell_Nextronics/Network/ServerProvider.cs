using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using dnsTcpLib2;

namespace EmergencyBell_Nextronics.Network
{
    class ServerProvider : TcpServiceProvider
    {
        private NetworkManager m_mgr = null;

        public ServerProvider(NetworkManager mgr)
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
            return true;
        }
    }
}
