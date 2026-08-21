using System;
using System.Net.Sockets;
using dnsTcpLib2;

namespace IntegrationServer.Servers.Earthquake.GG
{
    class TcpProvider : ClientServiceProvider
    {
        private TcpController m_controller = null;

        // 현재 OnReceive()에서 받은 데이터를 처리중인가?
        private bool m_isReadingProcess = false;
        public bool IsReadingProcess
        {
            get { return m_isReadingProcess; }
        }

        private int m_nPingCount = 0;
        public int PingCount
        {
            get { return m_nPingCount; }
            set { m_nPingCount = value; }
        }

        public TcpProvider(TcpController mgr)
        {
            m_controller = mgr;
            this.LengthAdd = false;
            this.Client.Client.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.NoDelay, true);
        }

        public override void OnReceiveData()
        {
            try
            {
                lock (this)
                {
                    if (ReceivedData != null)
                    {
                        m_isReadingProcess = true;

                        int nBytesCount = ReceivedData.Length;

                        if (nBytesCount > 0)
                        {
                            m_nPingCount = 0;
                            byte[] bytes = ReceivedData;
                            ProcessData(bytes);
                        }
                    }

                    m_isReadingProcess = false;
                }
            }
            catch (Exception e)
            {
                System.Diagnostics.Trace.WriteLine("OnReceiveData Error : " + e.Message);
            }
        }

        public override void OnDropConnection()
        {
        }

        public void ProcessData(byte[] bytes)
        {
            m_controller.ProcessMessage(bytes, bytes.Length);
        }
    }
}
