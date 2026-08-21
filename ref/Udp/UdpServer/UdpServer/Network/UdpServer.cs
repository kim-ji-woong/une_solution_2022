using System;
using System.Net;
using System.Text;
using System.Net.Sockets;
using System.Threading;

namespace UdpServer.Network
{
    public class UdpServer
    {
        private Socket m_udpSocket = null;
        private IPostBox m_postBox = null;
        private int m_nPortNo = -1;

        public UdpServer(IPostBox postBox)
        {
            m_postBox = postBox;
        }

        public void Start(int portNo)
        {
            Thread t = new Thread(new ParameterizedThreadStart(Listen));
            t.Start(portNo);
        }

        private void Listen(object arg)
        {
            if (arg == null || arg is not int)
                return;

            int portNo = (int)arg;
            m_nPortNo = portNo;

            try
            {
                m_udpSocket = new Socket(AddressFamily.InterNetwork, SocketType.Dgram, ProtocolType.Udp);
                EndPoint localEP = new IPEndPoint(IPAddress.Any, portNo);
                EndPoint remoteEP = new IPEndPoint(IPAddress.None, portNo);

                m_udpSocket.Bind(localEP);

                byte[] receiveBuffer = new byte[512];

                try
                {
                    while (true)
                    {
                        // 기다리고 있다가 remoteEP 로부터 데이터를 받는다
                        // receivedSize  : 받은 바이트수
                        // receiveBuffer : 받은 데이터가 들어갈 저장소
                        // remoteEP      : 데이터를 받아올 원격컴퓨터의 IP종단점
                        int receivedSize = m_udpSocket.ReceiveFrom(receiveBuffer, ref remoteEP);
                        m_postBox.ProcessMessage(receiveBuffer, receivedSize);

                        // 받은 데이터(receiveBuffer)를 remoteEP 로 다시 보낸다
                        //m_udpSocket.SendTo(receiveBuffer, receivedSize, SocketFlags.None, remoteEP);
                    }
                }
                catch (SocketException se)
                {
                    //m_netManager.ShowErrorMessage(se.Message);
                }
                finally
                {
                    m_udpSocket.Close();
                }
            }
            catch (SocketException se)
            {
                //m_netManager.ShowErrorMessage(se.Message);
            }
        }

        public void Send(string strMessage)
        {
            if (m_udpSocket != null)
            {
                EndPoint remoteEP = new IPEndPoint(IPAddress.Any, m_nPortNo);
                m_udpSocket.SendTo(MakeBytes(strMessage), remoteEP);
            }
        }

        private byte[] MakeBytes(string data)
        {
            UTF8Encoding enc = new UTF8Encoding();
            return enc.GetBytes(data);
        }
    }
}
