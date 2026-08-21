using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;

namespace LogSimulator.Network.Udp
{
    class Client
    {
        private string m_strIP = "";
        private int m_nPortNo = -1;

        public Client()
        {
        }

        public void Start(string strIP, int portNo)
        {
            m_strIP = strIP;
            m_nPortNo = portNo;
        }

        public void Send(byte[] bytes)
        {
            UdpClient client = new System.Net.Sockets.UdpClient(m_strIP, m_nPortNo);
            client.Send(bytes, bytes.Length);
            client.Close();
        }
    }
}
