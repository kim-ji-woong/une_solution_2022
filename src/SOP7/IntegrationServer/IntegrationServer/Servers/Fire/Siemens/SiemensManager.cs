using dnsCommunicateSopServer;
using dnsTcpLib2;
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

namespace IntegrationServer.Servers.Fire.Siemens
{
    public class SiemensManager : IServer
    {
        #region IServer 인터페이스
        private ServerManager m_serverManager = null;
        public ServerManager GetServerManager()
        {
            return m_serverManager;
        }
        private int m_nServerSeqNo = -1;
        public int ServerSeqNo { get { return m_nServerSeqNo; } }

        public ServerTypes ServerType { get { return ServerTypes.Fire_Siemens; } }
        public bool IsConnected { get { return m_bIsConnected; } }
        private bool m_bIsConnected = false;
        public Logger Logger { get; set; }
        private string m_strServerAlias = "";
        public string ServerAlias { get { return m_strServerAlias; } }
        #endregion

        private ServerModes m_serverMode = ServerModes.Server;

        #region 서버 모드시 사용
        private TcpServer m_tcpServer = null;
        private SiemensServerProvider m_providerServer = null;
        #endregion

        #region 클라이언트 모드시 사용
        private SiemensClientProvider m_providerClient = null;

        private string m_strServerIP = string.Empty;
        private int m_nPort = -1;
        private bool m_runThread = false; 
        #endregion

        // 현재 DB에 저장된 상태값
        private bool m_bDBConnectState = false;
        private SopQueryManager m_sopQueryManager = null;

        public SiemensManager(ServerManager serverManager, string strSOPWebServerURL, int nServerSeqNo, string strServerIP, int nPort, ServerModes serverMode, string strServerAlias)
        {
            m_serverManager = serverManager;
            m_sopQueryManager = new SopQueryManager(strSOPWebServerURL);

            m_nServerSeqNo = nServerSeqNo;
            m_strServerIP = strServerIP;
            m_nPort = nPort;

            m_serverMode = serverMode;
            m_strServerAlias = strServerAlias;
        }

        public void Start()
        {
            SetConnect(true);
            if (m_serverMode == ServerModes.Server)
                RunSiemensServer();
            else if (m_serverMode == ServerModes.Client)
                RunSiemensClient();
        }

        private void SetConnect(bool bConnect)
        {
            m_bIsConnected = bConnect;
        }

        private void RunSiemensServer()
        {
            if (m_nPort > 0)
            {
                m_providerServer = new SiemensServerProvider(this, m_nServerSeqNo);
                m_tcpServer = new TcpServer(m_providerServer, m_nPort);
                m_tcpServer.Start();

                Logger.Write(LogTypes.Info, ServerType, m_nServerSeqNo, "RunSiemensServer Success");
            }
            else
                Logger.Write(LogTypes.Error, ServerType, m_nServerSeqNo, "RunSiemensServer Fail : Port = " + m_nPort);
        }

        private void RunSiemensClient()
        {
            m_providerClient = new SiemensClientProvider(this, m_nServerSeqNo);

            Thread t = new Thread(new ThreadStart(ConnectionThread));
            t.Start();
        }

        public void Stop()
        {
            m_runThread = false;
            SetConnect(false);
        }

        private void ConnectionThread()
        {
            m_runThread = true;
            byte[] pingBytes = new byte[] { 0x00 };

            while (m_runThread)
            {
                try
                {
                    if (m_providerClient.IsConnected)
                    {
                        if (m_bDBConnectState == false)
                        {   // 연결 상태 업데이트   
                            if (m_serverManager.UpdateConnectState(m_nServerSeqNo, ServerType, true))
                                m_bDBConnectState = true;

                            SetConnect(true);
                        }

                        // 10초 이상 아무 신호를 못받으면 접속이 끊어진 것으로 간주한다.
                        if (m_providerClient.PingCount > 10)
                        {
                            // 아무 신호나 보내본다.
                            int nResult = m_providerClient.Send(pingBytes, 0, 1);

                            if (nResult < 0)
                            {
                                lock (m_providerClient)
                                {
                                    m_providerClient.PingCount = 0;
                                    m_providerClient.Close();

                                    if (m_providerClient.Client.Client != null)
                                    {
                                        if (m_providerClient.Client.Connected)
                                            m_providerClient.Client.Close();

                                        System.Diagnostics.Trace.WriteLine("Close Provider1 : " + !m_providerClient.Client.Connected);
                                    }
                                }
                            }
                        }
                        else
                            m_providerClient.PingCount++;
                    }

                    if (!m_providerClient.IsConnected)
                    {
                        lock (m_providerClient)
                        {
                            if (m_nPort > 0)
                            {
                                m_providerClient.Connect(m_strServerIP, m_nPort);
                                Logger.Write(LogTypes.Info, ServerType, m_nServerSeqNo, "[Connection Info] " + m_strServerIP + ":" + m_nPort + " / " + m_providerClient.IsConnected);

                                if (m_providerClient.IsConnected == false && m_bDBConnectState == true)
                                {   // 연결 상태 업데이트   
                                    if (m_serverManager.UpdateConnectState(m_nServerSeqNo, ServerType, false))
                                        m_bDBConnectState = false;

                                    SetConnect(false);
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

        public void AddClient(ConnectionState state, ServerTypes serverType)
        {
            //if (m_frmDelegate == null)
            //    return;
            //else
            //{
            //    m_frmDelegate.GetControl().Invoke((MethodInvoker)delegate
            //    {
            //        m_frmDelegate.AddClient(state, GetClientTypeString(serverType));
            //    });
            //}
        }

        public void RemoveClient(ConnectionState state)
        {
            //Client.ClientData data = (Client.ClientData)state.Tag;

            //if (m_frmDelegate == null)
            //{
            //    return;
            //}
            //else
            //{
            //    m_frmDelegate.GetControl().Invoke((MethodInvoker)delegate
            //    {
            //        m_frmDelegate.RemoveClient(state);
            //    });
            //}
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
