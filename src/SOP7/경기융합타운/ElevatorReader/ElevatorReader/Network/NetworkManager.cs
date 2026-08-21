using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;

namespace ElevatorReader.Network
{
    class NetworkManager
    {
        private string m_strIP = "";
        private int m_nPort = -1;
        private Provider m_clientProvider = null;
        private bool m_runThread = false;

        public NetworkManager()
        {
        }

        public void Start(string strIP, int nPort)
        {
            m_strIP = strIP;
            m_nPort = nPort;

            Thread t = new Thread(new ThreadStart(ConnectionThread));
            t.Start();
        }

        public void Stop()
        {
            m_runThread = false;
        }

        private void ConnectionThread()
        {
            if (m_runThread)
                return;

            m_runThread = true;
            // 센서상태 요청
            byte[] bytes = new byte[7] { (byte)'S', (byte)'T', (byte)'X', (byte)'R', (byte)'E', (byte)'T', (byte)'X' };

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
                                    WriteLog("[Connection Info] " + m_strIP + ":" + m_nPort + " / " + m_clientProvider.IsConnected);
                                }
                            }
                        }
                    }

                    Thread.Sleep(1000);
                    //Thread.Sleep(3000);
                }
                catch (Exception e)
                {
                    WriteLog("[ERROR] ConnectionThread() : " + e.Message);
                    System.Diagnostics.Trace.WriteLine("[ERROR] ConnectionThread() : " + e.Message);
                }
            }

            if (m_clientProvider != null && m_clientProvider.IsConnected)
                m_clientProvider.Close();
        }

        public void WriteLog(string strLog)
        {
            DateTime dtNow = DateTime.Now;
            string strTime = string.Format("[{0}-{1:00}-{2:00} {3:00}:{4:00}:{5:00}]",
                dtNow.Year, dtNow.Month, dtNow.Day,
                dtNow.Hour, dtNow.Minute, dtNow.Second);

            Logger.Instance.Write(string.Format("{0} : {1}", strTime, strLog));
        }
    }
}
