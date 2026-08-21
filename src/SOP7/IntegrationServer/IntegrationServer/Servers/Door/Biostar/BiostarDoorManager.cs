using System;
using static dnsSopID.ID;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using System.Collections.Generic;
using System.Threading;
using IntegrationServer.Managers;

namespace IntegrationServer.Servers.Door.Biostar
{
    using ViewModels.Option;
    using Datas;
    using ViewModels.Sdms.Sensor;
    using Data;

    class BiostarDoorManager : IServer
    {
        private ServerManager m_serverManager = null;
        private int m_nServerSeqNo = -1;

        private IDataManager m_dataManager = null;
        private bool m_runThread = false;

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
                return ServerTypes.Door_Biostar;
            }
        }

        public bool IsConnected
        {
            get
            {
                return false;
            }
        }

        private int m_nSiteID = -1;
        private string m_strServerIP = "";
        private int m_nPort = 0;

        private string m_strServerAlias = "";
        public string ServerAlias { get { return m_strServerAlias; } }

        // 출입문 목록
        // Key : Sensor UniqueKey
        private Dictionary<string, EtcSensor> m_dicDoors = new Dictionary<string, EtcSensor>();
        private LoginManager m_loginManager = null;

        public BiostarDoorManager(ServerManager serverManager, IDataManager dataManager, int nServerSeqNo, int nSiteID, string strServerIP, int nPort, string strServerAlias, Dictionary<ServerProperty, object> serverProperties)
        {
            m_serverManager = serverManager;
            m_nServerSeqNo = nServerSeqNo;
            m_strServerAlias = strServerAlias;

            m_nSiteID = nSiteID;
            m_strServerIP = strServerIP.ToLower().StartsWith("http") ? strServerIP : "https://" + strServerIP;
            m_nPort = nPort;

            m_dataManager = dataManager;
            m_loginManager = new LoginManager(serverProperties);

            LoadDoors(m_dataManager, m_nSiteID, (int)dnsData.Sensor.Facility.FacilityType.DOOR);
            //SensorManager.LoadSensors(m_dataManager, m_nSiteID, (int)dnsData.Sensor.Facility.FacilityType.DOOR);
        }

        public ServerManager GetServerManager()
        {
            return m_serverManager;
        }

        public void Start()
        {
            Thread t = new Thread(new ThreadStart(MonitoringThread));
            t.Start();
        }

        public void Stop()
        {
            m_runThread = false;
        }

        private void LoadDoors(IDataManager dataManager, int nSiteID, int nSensorType)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1} and {2} = {3}", EtcSensor.Fields.SiteID, nSiteID, EtcSensor.Fields.MaterialType, nSensorType);
            IEnumerable<EtcSensor> sensors = dataManager.GetSelect().Select<EtcSensor>(strCondition, out strErrorMessage);

            if (sensors == null)
            {
                WriteLog("Read EtcSensor Fail : " + strErrorMessage);
                return;
            }

            m_dicDoors.Clear();

            foreach (var sensor in sensors)
            {
                m_dicDoors[sensor.UniqueKey] = sensor;
            }
        }

        private void MonitoringThread(/*object args*/)
        {
            if (m_runThread)
                return;

            m_runThread = true;

            string strErrorMessage;
            string strServerIP = m_nPort == 80 || m_nPort == 0 ? m_strServerIP : m_strServerIP + ":" + m_nPort;

            if (m_loginManager.SessionID != null)
            {
                m_loginManager.Logout(strServerIP, out strErrorMessage);
            }

            while (m_runThread)
            {
                for (int i = 0; i < 3600; i++)
                {
                    try
                    {
                        if (m_loginManager.SessionID == null || m_loginManager.SessionID.Length == 0)
                        {
                            if (m_loginManager.Login(strServerIP, out strErrorMessage) == false)
                            {
                                WriteLog("로그인 실패 : " + strErrorMessage, LogTypes.Error);
                            }
                            else
                                WriteLog("로그인 성공");
                        }
                        else
                        {
                            // 2초에 한번씩만 조회한다.
                            if (i % 2 == 0)
                            {
                                string strResult = DoorManager.RequestStatus(strServerIP, m_loginManager.SessionID, out strErrorMessage);

                                if (strResult == null)
                                {
                                    WriteLog(strErrorMessage, LogTypes.Error);
                                }
                                else
                                {
                                    List<Door> doors = DoorManager.GetStatus(strResult, out strErrorMessage);

                                    if (doors == null)
                                        WriteLog(strErrorMessage, LogTypes.Error);
                                    else
                                        UpdateDoorStatus(doors);
                                }
                            }
                        }

                        if (!m_runThread)
                            break;

                        Thread.Sleep(1000);
                    }
                    catch (Exception e)
                    {
                        WriteLog("[ERROR] MonitoringThread() : " + e.Message);
                        System.Diagnostics.Trace.WriteLine("[ERROR] MonitoringThread() : " + e.Message);
                    }
                }

                // 한시간에 한번씩 로그아웃 한다.
                if (m_loginManager.Logout(strServerIP, out strErrorMessage) == false)
                    WriteLog("로그아웃 실패 : " + strErrorMessage, LogTypes.Error);
                else
                    WriteLog("로그아웃 성공");

                Thread.Sleep(1000);
            }
        }

        private void UpdateDoorStatus(List<Door> doors)
        {
            string strErrorMessage;
            Dictionary<int, int> dicChangedSensorStatus = new Dictionary<int, int>();
            Dictionary<int, EtcSensor> dicSensors = new Dictionary<int, EtcSensor>();

            EtcSensor sensor;

            // 상태가 바뀐 출입문만 선별적으로 업데이트 한다.
            foreach (Door door in doors)
            {
                if (m_dicDoors.TryGetValue(door.ID.ToString(), out sensor))
                {
                    if (door.IsOpen)
                    {
                        if (sensor.Status == null || sensor.Status != (int)DDS.DoorManager.DoorStatus.Opened)
                        {
                            dicChangedSensorStatus[sensor.ID] = (int)DDS.DoorManager.DoorStatus.Opened;
                            dicSensors[sensor.ID] = sensor;
                        }
                    }
                    else
                    {
                        if (sensor.Status == null || sensor.Status != (int)DDS.DoorManager.DoorStatus.Closed)
                        {
                            dicChangedSensorStatus[sensor.ID] = (int)DDS.DoorManager.DoorStatus.Closed;
                            dicSensors[sensor.ID] = sensor;
                        }
                    }
                }
            }

            if (dicChangedSensorStatus.Count == 0)
                return;

            Dictionary<EtcSensor.Fields, object> dicSets = new Dictionary<EtcSensor.Fields, object>();

            foreach (KeyValuePair<int, int> pair in dicChangedSensorStatus)
            {
                string strCondition = string.Format("{0} = {1}", EtcSensor.Fields.ID, pair.Key);
                dicSets[EtcSensor.Fields.Status] = pair.Value;

                if (m_dataManager.GetUpdate().Update<EtcSensor, EtcSensor.Fields>(dicSets, strCondition, out strErrorMessage))
                {
                    if (dicSensors.TryGetValue(pair.Key, out sensor))
                        sensor.Status = pair.Value;
                }
            }
        }

        private void WriteLog(string strLog, LogTypes type = LogTypes.Info)
        {
            if (this.Logger != null)
                this.Logger.Write(type, ServerType, m_nServerSeqNo, strLog);
            else
                Logger.Instance.Write(type, ServerType, m_nServerSeqNo, strLog);
        }
    }
}
