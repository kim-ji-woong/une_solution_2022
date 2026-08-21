using System;
using System.Collections.Generic;
using dnsTcpLib2;

namespace IntegrationServer.Servers.Earthquake.GG
{
    class TcpServerProvider : TcpServiceProvider
    {
        private TcpController m_controller = null;

        public TcpServerProvider(TcpController controller)
        {
            m_controller = controller;
        }

        public override object Clone()
        {
            return new TcpServerProvider(m_controller);
        }

        public override void OnAcceptConnection(ConnectionState state)
        {
            state.LengthAdd = false;
            m_controller.WriteLog("OnAccept : " + state.IPAddress);
        }

        public override bool OnReceiveData(ConnectionState state)
        {
            if (!base.OnReceiveData(state))
                return false;

            m_controller.ProcessMessage(ReceivedData, ReceivedData.Length);
            return true;
        }

        public override void OnDropConnection(ConnectionState state)
        {
        }
    }
}
