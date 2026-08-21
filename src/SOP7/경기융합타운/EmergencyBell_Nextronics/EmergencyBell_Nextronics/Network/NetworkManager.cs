using System;
using System.Collections.Generic;
using dnsTcpLib2;

namespace EmergencyBell_Nextronics.Network
{
    class NetworkManager
    {
        private int m_nPort = -1;
        private TcpServer m_server = null;
        private ServerProvider m_serverProvider = null;
        private IOwner m_owner = null;

        public NetworkManager(int port, IOwner owner)
        {
            m_nPort = port;
            m_owner = owner;
        }

        public void Start()
        {
            m_serverProvider = new ServerProvider(this);
            m_server = new TcpServer(m_serverProvider, m_nPort);
            m_server.Start();
        }

        public void WriteLog(string strLog)
        {
            if (m_owner != null)
                m_owner.WriteLog(strLog);
        }
    }

    interface IOwner
    {
        void WriteLog(string strLog);
    }
}
