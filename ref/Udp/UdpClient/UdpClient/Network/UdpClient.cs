using System;
using System.Net;
using System.Collections;
using System.Net.Sockets;
using System.Threading;
using System.Text;

namespace UdpClient.Network
{
    public class UdpClient
    {
        private string m_strIP = "";
        private int m_nPortNo = -1;

        public UdpClient()
        {
        }

        public void Start(string strIP, int portNo)
        {
            m_strIP = strIP;
            m_nPortNo = portNo;
        }

        public void Send(byte[] bytes)
        {
            System.Net.Sockets.UdpClient client = new System.Net.Sockets.UdpClient(m_strIP, m_nPortNo);
            client.Send(bytes, bytes.Length);
            client.Close();
        }
    }
}
