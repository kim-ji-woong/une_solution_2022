using dnsCommunicateSopServer;
using IntegrationServer.Datas;
using IntegrationServer.Managers;
using System;
using System.Collections.Generic;
using IntegrationServer.ViewModels.Sdms;
using System.Threading;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using static dnsData.Sensor.Facility;
using static dnsSopID.ID;

namespace IntegrationServer.Servers.Fire.Taesan
{    
    /// <summary>
    /// 화재-동방 통신 관리
    /// </summary>
    public class TaesanManager : IServer
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
            m_runThread = false;
            if (m_provider != null && m_provider.Client != null)
                m_provider.Client.Close();
        }
        private ServerManager m_serverManager = null;
        public ServerManager GetServerManager()
        {
            return m_serverManager;
        }
        public ServerTypes ServerType { get { return ServerTypes.Fire_Taesan; } }
        public bool IsConnected { get { return m_provider.IsConnected; } }
        public Logger Logger { get; set; }
        private string m_strServerAlias = "";
        public string ServerAlias { get { return m_strServerAlias; } }
        #endregion

        private string m_strServerIP = string.Empty;
        private int m_nPort = -1;

        private TaesanProvider m_provider = null;        

        private bool m_runThread = false;
        // 현재 DB에 저장된 상태값
        private bool m_bDBConnectState = false;
        private SopQueryManager m_sopQueryManager = null;
        private DataManager m_dataManager = null;

        private int m_nSiteID = -1;
        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }        

        public TaesanManager(ServerManager serverManager, string strSOPWebServerURL, int nServerSeqNo, int nSiteID, string strServerIP, int nPort, DataManager dataManager)
        {
            m_serverManager = serverManager;
            m_sopQueryManager = new SopQueryManager(strSOPWebServerURL);
            m_dataManager = (DataManager)dataManager.Clone();

            m_nServerSeqNo = nServerSeqNo;
            m_nSiteID = nSiteID;
            m_strServerIP = strServerIP;
            m_nPort = nPort;

            m_provider = new TaesanProvider(this, m_nServerSeqNo);
            m_provider.LengthAdd = false;
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
                            if (m_nPort > 0)
                            {
                                m_provider.Connect(m_strServerIP, m_nPort);
                                this.Logger.Write(LogTypes.Info, ServerType, m_nServerSeqNo, "[Connection Info] " + m_strServerIP + ":" + m_nPort + " / " + m_provider.IsConnected);

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
                    this.Logger.Write(LogTypes.Error, ServerType, m_nServerSeqNo, "ConnectionThread() : " + e.Message);
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

        public void SendAllClear(int? nSiteID)
        {
            m_serverManager.SendAllClear(m_sopQueryManager, nSiteID);
        }

        public void SendAllClearAsync()
        {
            m_serverManager.SendAllClearAsync(m_sopQueryManager);
        }

        public List<SensorTag> GetAlarmSensorTags(string strReceiverName)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1}", CurrentAlarm.Fields.SensorType.ToString(), (int)dnsData.Sensor.Facility.FacilityType.FIRE_SENSOR);
            IEnumerable<CurrentAlarm> currentAlarms = m_dataManager.GetSelect().Select<CurrentAlarm>(strCondition, out strErrorMessage);

            List<SensorTag> results = new List<SensorTag>();
            string strTagHeader = strReceiverName.ToLower().Trim().EndsWith("a") ? "10" : "11";

            if (currentAlarms == null)
            {
                this.Logger.Write(LogTypes.Error, ServerType, m_nServerSeqNo, "Select CurrentAlarm Query Error : " + strErrorMessage);
                return null;
            }
            else
            {
                Dictionary<int, int> dicSensorZoneIDs = new Dictionary<int, int>();

                foreach (CurrentAlarm alarm in currentAlarms)
                {
                    if (alarm.AlarmSensorZoneIDs == null)
                        continue;

                    string[] tokens = alarm.AlarmSensorZoneIDs.Split(',');

                    foreach (string strToken in tokens)
                    {
                        int sensorZoneID;

                        if (int.TryParse(strToken.Trim(), out sensorZoneID))
                            dicSensorZoneIDs[sensorZoneID] = sensorZoneID;
                    }
                }

                if (dicSensorZoneIDs.Count > 0)
                {
                    string strSensorZoneIDs = string.Join(",", dicSensorZoneIDs.Values);
                    strCondition = string.Format("{0} in ({1})", Nipa.Model.Sdms.Sensor.TagInfo.Fields.SensorZoneID.ToString(), strSensorZoneIDs);
                    IEnumerable<Nipa.Model.Sdms.Sensor.TagInfo> tagInfos = m_dataManager.GetSelect().Select<Nipa.Model.Sdms.Sensor.TagInfo>(strCondition, out strErrorMessage);

                    if (tagInfos == null)
                    {
                        this.Logger.Write(LogTypes.Error, ServerType, m_nServerSeqNo, "Select TagInfo Query Error : " + strErrorMessage);
                        return null;
                    }

                    Dictionary<int, SensorTag> sensorTags = SensorManager.Instance.FindSensors(m_nServerSeqNo);

                    if (sensorTags == null)
                    {
                        this.Logger.Write(LogTypes.Error, ServerType, m_nServerSeqNo, string.Format("ServerType {0} FindSensors(...) Error", m_nServerSeqNo));
                        return null;
                    }

                    foreach (Nipa.Model.Sdms.Sensor.TagInfo tagInfo in tagInfos)
                    {
                        string strTagNo = tagInfo.TagNo.ToString();

                        if (strTagNo.StartsWith(strTagHeader) == false)
                            continue;

                        SensorTag sensorTag;

                        if (sensorTags.TryGetValue(tagInfo.ID, out sensorTag))
                            results.Add(sensorTag);
                    }
                }
            }

            return results;
        }
    }
}
