using System;
using System.Threading;
using dnsDapperDBUtil.DataAccessLayer.DAL;

namespace IntegrationServer.Servers.EmergencyBell.MPia
{
    using Datas;
    using static AgentFactory.BLL.ServerType;

    public class MPiaManager : IServer
    {
        private ServerManager m_serverManager = null;
        private int m_nServerSeqNo = -1;
        private string m_strServerIP = "";
        private int m_nPort = -1;
        private ServerModes m_serverMode = ServerModes.Client;
        private MPiaProvider m_clientProvider = null;
        private bool m_runThread = false;
        private MPiaSensorManager m_sensorManager = null;
        private MPiaAlarmManager m_alarmManager = null;

        public Logger Logger { get; set; }

        public int ServerSeqNo
        {
            get
            {
                return m_nServerSeqNo;
            }
        }

        public ServerTypes ServerType
        {
            get
            {
                return ServerTypes.EmergencyBell_MPia;
            }
        }

        public bool IsConnected
        {
            get
            {
                if (m_clientProvider == null || m_clientProvider.IsClientDisposed)
                    return false;

                return m_clientProvider.IsConnected;
            }
        }

        private string m_strServerAlias = "";
        public string ServerAlias { get { return m_strServerAlias; } }

        public MPiaManager(ServerManager serverManager, DataManager dataManager, string strSOPWebServerURL, int nServerSeqNo, string strServerIP, int nPort, string strSensorUniqueTag, string strServerAlias)
        {
            m_serverManager = serverManager;
            m_nServerSeqNo = nServerSeqNo;
            m_strServerIP = strServerIP;
            m_nPort = nPort;
            m_strServerAlias = strServerAlias;

            m_sensorManager = new MPiaSensorManager((DataManager)dataManager.Clone(), strSensorUniqueTag);
            m_alarmManager = new MPiaAlarmManager(/*dataManager, */strSOPWebServerURL);
        }

        public ServerManager GetServerManager()
        {
            return m_serverManager;
        }

        public void Start()
        {
            if (m_serverMode == ServerModes.Client)
                RunMPiaClient();
        }

        public void Stop()
        {
            m_runThread = false;
        }

        private void RunMPiaClient()
        {
            m_clientProvider = new MPiaProvider(this);
            m_clientProvider.LengthAdd = false;

            Thread t = new Thread(new ThreadStart(ConnectionThread));
            t.Start();
        }

        private void ConnectionThread()
        {
            if (m_runThread)
                return;

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
                            {
                                m_clientProvider.ClearSensorMemory();
                                Thread.Sleep(1000);
                            }

                            m_clientProvider.SendData(bytes, 0, bytes.Length);
                        }
                    }

                    if (!m_clientProvider.IsConnected)
                    {
                        if (m_nPort > 0)
                        {
                            lock (m_clientProvider)
                            {
                                if (m_clientProvider.Connect(m_strServerIP, m_nPort))
                                {
                                    m_clientProvider.PingCount = 0;
                                    WriteLog("[Connection Info] " + m_strServerIP + ":" + m_nPort + " / " + m_clientProvider.IsConnected);
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

        public void WriteLog(string strLog, LogTypes type = LogTypes.Info)
        {
            if (this.Logger != null)
                this.Logger.Write(type, ServerType, m_nServerSeqNo, strLog);
            else
                Logger.Instance.Write(type, ServerType, m_nServerSeqNo, strLog);
        }

        public void SendAlarm(int sensorNo)
        {
            Sensor sensor = m_sensorManager.GetSensor(sensorNo);

            if (sensor != null)
            {
                //m_sensorManager.UpdateSensor(sensor, 1);
                m_alarmManager.SendAlarm(sensor);
            }
        }
    }
}
