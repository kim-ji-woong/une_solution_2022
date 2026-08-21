using dnsSopID;
using System;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsCommunicateSopServer;

namespace IntegrationServer.Servers.Fire.Singwang
{
    using Datas;
    using dnsData.Sensor;
    using IntegrationServer.Managers;
    using Nipa.Model.Sdms.Sensor;
    using ViewModels.Sdms.Sensor;
    using static AgentFactory.BLL.ServerType;

    /// <summary>
    /// 신광전자 - 주택도시공사, 복합시설관 화재
    /// </summary>
    class SingwangManager : IServer
    {
        #region IServer 인터페이스
        private int m_nServerSeqNo = -1;
        public int ServerSeqNo { get { return m_nServerSeqNo; } }

        public ServerTypes ServerType { get { return ServerTypes.Fire_Singwang; } }

        private bool m_isStarted = false;

        public bool IsConnected
        {
            get { return m_isStarted; }
        }

        public Logger Logger { get; set; }

        private string m_strServerAlias = "";
        public string ServerAlias { get { return m_strServerAlias; } }

        private ServerManager m_serverManager = null;
        public ServerManager GetServerManager()
        {
            return m_serverManager;
        }

        public void Start()
        {
            if (m_dicSensorZoneTags != null)
            {
                // 통합서버가 꺼져있는 동안 발생했던 알람을 확인한다.
                CheckPrevAlarm(m_dicSensorZoneTags);
            }

            m_provider.Start();
            m_isStarted = true;
        }

        public void Stop()
        {
            m_provider.Stop();
            m_isStarted = false;
        }
        #endregion

        public string SOPWebServerURL { get; set; }

        public string ServerIP { get; set; }

        public int Port
        {
            get { return m_nPort; }
            set { m_nPort = value; }
        }

        public int SiteID
        {
            get { return m_nSiteID; }
        }

        public bool Use
        {
            get { return m_use; }
        }

        public DataManager DataManager
        {
            get { return m_dataManager; }
        }

        private DataManager m_dataManager = null;
        private SopQueryManager m_sopQueryManager = null;
        // 모드버스 기본 Port
        private int m_nPort = 502;

        private ClientProvider m_provider = null;
        private int m_nSiteID = -1;
        private bool m_use = false;

        // Key : TagNo(Start Address)
        private Dictionary<int, SensorTag> m_dicSensorTags = new Dictionary<int, SensorTag>();
        // Key : Group Name
        private Dictionary<string, SensorTagGroup> m_sensorTagGroups = new Dictionary<string, SensorTagGroup>();
        // Key : TagNo(Start Address)
        private Dictionary<int, SensorTag> m_dicAlarmSensorTags = new Dictionary<int, SensorTag>();
        // Key : SensorZone ID
        private Dictionary<int, SensorTag> m_dicSensorZoneTags = null;

        private int m_nSlaveID = 1;

        public int SlaveID
        {
            get { return m_nSlaveID; }
        }

        public SingwangManager(ServerManager serverManager, DataManager dataManager, string strSOPWebServerURL, int nServerSeqNo, int nSiteID, string strServerIP, int nPort, string strServerAlias, bool use)
        {
            m_serverManager = serverManager;
            m_dataManager = (DataManager)dataManager.Clone();
            m_sopQueryManager = new SopQueryManager(strSOPWebServerURL);

            m_nServerSeqNo = nServerSeqNo;
            this.ServerIP = strServerIP;
            m_nPort = nPort;
            m_strServerAlias = strServerAlias;

            this.SOPWebServerURL = strSOPWebServerURL;
            m_nSiteID = nSiteID;
            m_use = use;

            m_dicSensorZoneTags = Init();
            m_provider = new ClientProvider(this, strServerIP, m_sensorTagGroups, m_nSlaveID);
        }

        // 통합서버가 꺼져있는 동안 발생했던 알람을 확인한다.
        private void CheckPrevAlarm(Dictionary<int, SensorTag> dicSensorZoneTags)
        {
            string strErrorMessage;

            List<int> alarmSensorZoneIDs = AlarmManager.GetCurrentAlarmSensorZoneIDs(m_dataManager, out strErrorMessage);

            if (alarmSensorZoneIDs == null)
                System.Diagnostics.Trace.WriteLine(strErrorMessage);
            else
            {
                SensorTag sensorTag;

                foreach (int alarmSensorZoneID in alarmSensorZoneIDs)
                {
                    if (dicSensorZoneTags.TryGetValue(alarmSensorZoneID, out sensorTag))
                        m_dicAlarmSensorTags[sensorTag.TagNo] = sensorTag;
                }
            }
        }

        // Key : SensorZone ID
        private Dictionary<int, SensorTag> Init()
        {
            // Key : TagNo
            Dictionary<int, SensorTag> dicSensorTags = SensorManager.LoadSensors(m_dataManager, m_nSiteID, (int)dnsData.Sensor.Facility.FacilityType.FIRE_SENSOR);

            // Key : SensorZone ID
            Dictionary<int, SensorTag> dicSensorZoneTags = new Dictionary<int, SensorTag>();

            if (dicSensorTags != null)
            {
                SensorTagGroup group;

                foreach (KeyValuePair<int, SensorTag> pair in dicSensorTags)
                {
                    SensorTag sensorTag = pair.Value;

                    if (sensorTag.OrgSensorID >= 1000000)
                        continue;

                    string strGroupName = sensorTag.Description;

                    if (strGroupName == null || strGroupName.Length == 0)
                        continue;

                    if (m_sensorTagGroups.TryGetValue(strGroupName, out group) == false)
                    {
                        group = new SensorTagGroup(strGroupName);
                        m_sensorTagGroups[strGroupName] = group;
                    }

                    dicSensorZoneTags[sensorTag.SensorZoneID] = sensorTag;
                    m_dicSensorTags[sensorTag.TagNo] = sensorTag;
                    group.AddSensorTag(sensorTag);
                }
            }

            return dicSensorZoneTags;
        }

        public void CheckAlarm(short data, int tagNo)
        {
            SensorTag sensorTag;

            if (m_dicSensorTags.TryGetValue(tagNo, out sensorTag) == false)
                return;

            // 알람판단 기준 : 12번째 Flag
            short checkFlag = (short)(1 << 11);
            bool isAlarm = (data & checkFlag) == checkFlag;

            if (isAlarm)
            {
                // 이미 알람상태인지 확인
                if (m_dicAlarmSensorTags.ContainsKey(tagNo))
                    return;
                else
                {
                    m_dicAlarmSensorTags[tagNo] = sensorTag;
                    WriteLog("알람발생 : " + tagNo);
                }
            }
            else
            {
                // 이미 알람이 해제되었는지 확인
                if (m_dicAlarmSensorTags.ContainsKey(tagNo) == false)
                    return;
                else
                {
                    m_dicAlarmSensorTags.Remove(tagNo);
                    WriteLog("알람해제 : " + tagNo);
                }
            }

            m_serverManager.SendSensorData(m_sopQueryManager, (int)dnsData.Sensor.Facility.FacilityType.FIRE_SENSOR, sensorTag.ID, sensorTag.SensorZoneID, isAlarm);
        }

        public void WriteLog(string strLog, LogTypes type = LogTypes.Info)
        {
            if (this.Logger != null)
                this.Logger.Write(type, ServerType, m_nServerSeqNo, strLog);
            else
                Logger.Instance.Write(type, ServerType, m_nServerSeqNo, strLog);
        }
    }
}
