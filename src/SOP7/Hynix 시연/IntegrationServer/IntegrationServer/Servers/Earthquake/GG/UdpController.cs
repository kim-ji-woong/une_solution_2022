using System;
using System.Threading;
using System.Net;
using System.Net.Sockets;

namespace IntegrationServer.Servers.Earthquake.GG
{
    class UdpController : IController
    {
        private Socket m_udpSocket = null;
        private bool m_runThread = false;
        private NetworkManager m_netMgr = null;
        private int m_nPortNo = -1;

        public UdpController(NetworkManager netMgr)
        {
            m_netMgr = netMgr;
        }

        public void Start(string strServerIP, int nPortNo)
        {
            Thread t2 = new Thread(new ParameterizedThreadStart(Listen));
            t2.Start(nPortNo);
        }

        private void Listen(object arg)
        {
            int nPortNo = (int)arg;
            m_nPortNo = nPortNo;
            m_runThread = true;

            try
            {
                m_udpSocket = new Socket(AddressFamily.InterNetwork, SocketType.Dgram, ProtocolType.Udp);
                EndPoint localEP = new IPEndPoint(IPAddress.Any, nPortNo);
                EndPoint remoteEP = new IPEndPoint(IPAddress.None, nPortNo);

                m_udpSocket.Bind(localEP);

                byte[] receiveBuffer = new byte[1024];

                try
                {
                    while (m_runThread)
                    {
                        // 기다리고 있다가 remoteEP 로부터 데이터를 받는다
                        // receivedSize  : 받은 바이트수
                        // receiveBuffer : 받은 데이터가 들어갈 저장소
                        // remoteEP      : 데이터를 받아올 원격컴퓨터의 IP종단점
                        int receivedSize = m_udpSocket.ReceiveFrom(receiveBuffer, ref remoteEP);
                        m_netMgr.ProcessMessage(receiveBuffer, receivedSize);

                        // 받은 데이터(receiveBuffer)를 remoteEP 로 다시 보낸다
                        //m_udpSocket.SendTo(receiveBuffer, receivedSize, SocketFlags.None, remoteEP);
                    }
                }
                catch (SocketException se)
                {
                    System.Diagnostics.Trace.WriteLine(se.Message);
                }
                finally
                {
                    m_udpSocket.Close();
                }
            }
            catch (SocketException se)
            {
                System.Diagnostics.Trace.WriteLine(se.Message);
            }
        }

        public void Stop()
        {
            m_runThread = false;

            if (m_nPortNo > 0)
            {
                // Listen 쓰레드를 강제 종료시키기 위해 빈 데이터를 보낸다.
                byte[] bytes = new byte[1];
                bytes[0] = 0x00;

                System.Net.Sockets.UdpClient client = new System.Net.Sockets.UdpClient("127.0.0.1", m_nPortNo);
                client.Send(bytes, bytes.Length);
                client.Close();
            }
        }
    }
}
