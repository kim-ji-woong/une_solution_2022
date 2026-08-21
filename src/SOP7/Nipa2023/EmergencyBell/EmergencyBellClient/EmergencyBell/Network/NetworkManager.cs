using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;

namespace EmergencyBell.Network
{
    public class NetworkManager
    {
        private ClientProvider m_clientProvider = null;
        private string m_strIP = "";
        private int m_nPort = 0;
        private bool m_runThread = false;

        public NetworkManager(string strIP, int nPort)
        {
            m_strIP = strIP;
            m_nPort = nPort;

            m_clientProvider = new ClientProvider(this);
            m_clientProvider.LengthAdd = false;

            Start();
        }

        private void Start()
        {
            Thread t = new Thread(new ThreadStart(ConnectionThread));
            t.Start();
        }

        public void Stop()
        {
            m_runThread = false;
        }

        public void Send(byte[] bytes, int offset, int len)
        {
            if (m_clientProvider != null && m_clientProvider.IsConnected)
            {
                m_clientProvider.SendData(bytes, offset, len);
            }
        }

        private void ConnectionThread()
        {
            m_runThread = true;
            // 센서상태 요청
            byte[] bytes = new byte[6] { 0xa2, 0x01, 0x31, 0x01, 0x00, 0xd5 };
            
            while (m_runThread)
            {
                try
                {
                    if (m_clientProvider.IsConnected)
                    {
                        // 10초 이상 아무 신호를 못받으면 접속이 끊어진 것으로 간주한다.
                        if (m_clientProvider.PingCount > 10)
                        {
                            lock (m_clientProvider)
                            {
                                m_clientProvider.Close();
                            }
                        }
                        else
                            m_clientProvider.PingCount++;

                        if (m_clientProvider.IsConnected)
                        {
                            if (m_clientProvider.HasAlarm)
                                m_clientProvider.ClearSensorMemory();

                            m_clientProvider.SendData(bytes, 0, bytes.Length);
                        }
                    }

                    if (!m_clientProvider.IsConnected)
                    {
                        if (m_nPort > 0)
                        {
                            lock (m_clientProvider)
                            {
                                if (m_clientProvider.Connect(m_strIP, m_nPort))
                                {
                                    m_clientProvider.PingCount = 0;
                                    Logger.Instance.Write("[Connection Info] " + m_strIP + ":" + m_nPort + " / " + m_clientProvider.IsConnected);
                                }
                            }
                        }
                    }

                    Thread.Sleep(3000);
                }
                catch (Exception e)
                {
                    Logger.Instance.Write("[ERROR] ConnectionThread() : " + e.Message);
                    System.Diagnostics.Trace.WriteLine("[ERROR] ConnectionThread() : " + e.Message);
                }
            }
        }
    }
}
