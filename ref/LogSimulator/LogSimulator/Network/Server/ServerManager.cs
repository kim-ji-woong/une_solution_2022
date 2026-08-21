using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using dnsTcpLib2;

namespace LogSimulator.Network.Server
{
    class ServerManager
    {
        private TcpServer m_server = null;
        private ServiceProvider m_provider = null;
        private Udp.Client m_udpClient = null;
        private bool m_isTcp = true;

        public bool Start(string strServerIP, int port, bool isTcp)
        {
            if (isTcp)
            {
                m_provider = new ServiceProvider();
                m_server = new TcpServer(m_provider, port);
                return m_server.Start();
            }
            else
            {
                m_udpClient = new Udp.Client();
                m_udpClient.Start(strServerIP, port);
            }

            return true;
        }

        public bool Send(byte[] bytes, int size)
        {
            if (m_provider != null)
                return m_provider.Send(bytes, size);

            m_udpClient.Send(bytes);
            return true;
        }
    }
}
