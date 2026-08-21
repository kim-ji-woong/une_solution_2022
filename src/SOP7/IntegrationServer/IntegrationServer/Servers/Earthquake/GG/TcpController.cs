using System;
using System.Collections;
using System.Threading;
using dnsTcpLib2;

namespace IntegrationServer.Servers.Earthquake.GG
{
    using Datas;

    class TcpController : IController
    {
        private bool m_runThread = false;
        private NetworkManager m_netMgr = null;
        private TcpProvider m_provider = null;
        private TcpServer m_server = null;
        private bool m_isServerMode = true;

        public TcpController(NetworkManager netMgr)
        {
            m_netMgr = netMgr;
        }

        public void Start(string strServerIP, int nPortNo)
        {
            if (m_isServerMode)
            {
                TcpServerProvider provider = new TcpServerProvider(this);
                m_server = new TcpServer(provider, nPortNo);
                m_server.Start();
            }
            else
            {
                ArrayList arrDatas = new ArrayList();
                arrDatas.Add(strServerIP);
                arrDatas.Add(nPortNo);

                Thread t = new Thread(new ParameterizedThreadStart(ConnectionThread));
                t.Start(arrDatas);
            }
        }

        public void Stop()
        {
            m_runThread = false;

            if (m_isServerMode)
            {
                m_server.Stop();
            }
            else
            {
                if (m_provider != null && m_provider.Client != null)
                    m_provider.Client.Close();
            }
        }

        private void ConnectionThread(object arg)
        {
            ArrayList arrDatas = (ArrayList)arg;
            string strServerIP = (string)arrDatas[0];
            int nPortNo = (int)arrDatas[1];

            m_runThread = true;
            byte[] pingBytes = new byte[] { 0x00 };

            m_provider = new TcpProvider(this);

            while (m_runThread)
            {
                try
                {
                    if (m_provider.IsConnected)
                    {
                        // 10초 이상 아무 신호를 못받으면 접속이 끊어진 것으로 간주한다.
                        if (m_provider.PingCount > 10)
                        {
                            // 아무 신호나 보내본다.
                            int nResult = m_provider.Send(pingBytes, 0, 1);

                            if (nResult < 0)
                            {
                                lock (m_provider)
                                {
                                    m_provider.PingCount = 0;
                                    m_provider.Close();

                                    if (m_provider.Client.Client != null)
                                    {
                                        if (m_provider.Client.Connected)
                                            m_provider.Client.Close();

                                        System.Diagnostics.Trace.WriteLine("Close Provider1 : " + !m_provider.Client.Connected);
                                    }
                                }
                            }
                            else
                                m_provider.PingCount = 0;
                        }
                        else
                            m_provider.PingCount++;
                    }

                    if (!m_provider.IsConnected)
                    {
                        lock (m_provider)
                        {
                            if (nPortNo > 0)
                            {
                                m_provider.Connect(strServerIP, nPortNo);
                                m_netMgr.WriteLog("[Connection Info] " + strServerIP + ":" + nPortNo + " / " + m_provider.IsConnected);
                            }
                        }
                    }

                    Thread.Sleep(500);
                }
                catch (Exception e)
                {
                    m_netMgr.WriteLog("ConnectionThread() : " + e.Message, LogTypes.Error);
                }
            }
        }

        public void ProcessMessage(byte[] bytes, int len)
        {
            m_netMgr.ProcessMessage(bytes, len);
        }

        public void WriteLog(string strLog)
        {
            m_netMgr.WriteLog(strLog);
        }
    }
}
