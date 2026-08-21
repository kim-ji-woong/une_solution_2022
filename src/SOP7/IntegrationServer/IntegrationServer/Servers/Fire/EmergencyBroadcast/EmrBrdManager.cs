using dnsCommunicateSopServer;
using IntegrationServer.Datas;
using IntegrationServer.Managers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using static dnsData.Sensor.Facility;
using static dnsSopID.ID;

namespace IntegrationServer.Servers.Fire.EmergencyBroadcast
{    
    /// <summary>
    /// 화재-비상방송 프로토콜
    /// </summary>
    public class EmrBrdManager : IServer
    {
        #region IServer 인터페이스                        
        private int m_nServerSeqNo = -1;
        public int ServerSeqNo { get { return m_nServerSeqNo; } }
        public void Start()
        {
            Thread t = new Thread(new ThreadStart(ConnectionThread));
            t.Start();
        }
        public void Stop()
        {
            m_provider.Disconnect();
            m_runThread = false;            
        }
        private ServerManager m_serverManager = null;
        public ServerManager GetServerManager()
        {
            return m_serverManager;
        }
        public ServerTypes ServerType { get { return ServerTypes.Fire_EmergencyBroadcast; } }
        public bool IsConnected { get { return m_provider.IsConnected; } }
        public Logger Logger { get; set; }
        private string m_strServerAlias = "";
        public string ServerAlias { get { return m_strServerAlias; } }
        #endregion

        private string m_strServerIP = string.Empty;
        private int m_nPort = -1;

        private EmrBrdProvider m_provider = null;        

        private bool m_runThread = false;
        // 현재 DB에 저장된 상태값
        private bool m_bDBConnectState = false;
        private SopQueryManager m_sopQueryManager = null;

        public bool RecivedPoll { get; set; }

        public EmrBrdManager(ServerManager serverManager, string strSOPWebServerURL, int nServerSeqNo, string strServerIP, int nPort, string strServerAlias)
        {
            m_serverManager = serverManager;
            m_sopQueryManager = new SopQueryManager(strSOPWebServerURL);

            m_nServerSeqNo = nServerSeqNo;
            m_strServerIP = strServerIP;
            m_nPort = nPort;
            m_strServerAlias = strServerAlias;

            m_provider = new EmrBrdProvider(this, m_nServerSeqNo);
        }

        private void ConnectionThread()
        {
            m_runThread = true;
            byte[] pingBytes = new byte[] { 0x00 };

            while (m_runThread)
            {
                try
                {
                    if (m_provider.IsConnected)
                    {
                        if (m_bDBConnectState == false)
                        {   // 연결 상태 업데이트   
                            if (m_serverManager.UpdateConnectState(m_nServerSeqNo, ServerType, true))
                                m_bDBConnectState = true;
                        }

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
                        }
                        else
                            m_provider.PingCount++;
                    }

                    if (!m_provider.IsConnected)
                    {
                        lock (m_provider)
                        {
                            if (m_nPort > 0)
                            {
                                m_provider.Connect(m_strServerIP, m_nPort);
                                Logger.Write(LogTypes.Info, ServerType, m_nServerSeqNo, "[Connection Info] " + m_strServerIP + ":" + m_nPort + " / " + m_provider.IsConnected);

                                if (m_provider.IsConnected == false && m_bDBConnectState == true)
                                {   // 연결 상태 업데이트   
                                    if (m_serverManager.UpdateConnectState(m_nServerSeqNo, ServerType, false))
                                        m_bDBConnectState = false;
                                }
                            }
                        }
                    }

                    Thread.Sleep(500);
                }
                catch (Exception e)
                {
                    Logger.Write(LogTypes.Error, ServerType, m_nServerSeqNo, "ConnectionThread() : " + e.Message);
                }
            }
        }

        public bool SendSensorData(SensorTag sensorTag, bool bIsAlarm)
        {
            return m_serverManager.SendSensorData(m_sopQueryManager, (int)FacilityType.FIRE_SENSOR, sensorTag.ID, sensorTag.SensorZoneID, bIsAlarm);
        }

        public void SendSensorDataAsync(SensorTag sensorTag, bool bIsAlarm)
        {
            m_serverManager.SendSensorDataAsync(m_sopQueryManager, (int)FacilityType.FIRE_SENSOR, sensorTag.ID, sensorTag.SensorZoneID, bIsAlarm);
        }

        public void SendAllClear()
        {
            m_serverManager.SendAllClear(m_sopQueryManager);
        }

        public void SendAllClearAsync()
        {
            m_serverManager.SendAllClearAsync(m_sopQueryManager);
        }
    }
}
