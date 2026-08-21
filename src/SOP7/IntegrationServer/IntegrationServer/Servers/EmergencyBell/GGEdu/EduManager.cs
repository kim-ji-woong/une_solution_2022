using dnsCommunicateSopServer;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsSopID;
using IntegrationServer.Datas;
using IntegrationServer.Managers;
using System.Collections.Generic;

namespace IntegrationServer.Servers.EmergencyBell.GGEdu
{
    using ViewModels.Sdms;

    class EduManager : IServer
    {
        #region IServer 인터페이스
        private int m_nServerSeqNo = -1;
        public int ServerSeqNo => m_nServerSeqNo;

        public ID.ServerTypes ServerType => ID.ServerTypes.EmergencyBell_GGEducation;

        private string m_strServerAlias = string.Empty;
        public string ServerAlias => m_strServerAlias;

        public bool IsConnected
        {
            get { return m_dbManager.IsConnected; }
        }

        public Logger Logger { get; set; }

        private ServerManager m_serverManager = null;
        public ServerManager GetServerManager()
        {
            return m_serverManager;
        }

        public void Start()
        {
            m_dbManager.Start();
        }

        public void Stop()
        {
            m_dbManager.Stop();
        }
        #endregion

        private DataManager m_dataManager = null;
        private SopQueryManager m_sopQueryManager = null;
        private int m_nSiteID = -1;
        private string m_strServerIP = string.Empty;
        
        // 비상벨 센서 목록
        // Key : Zone ID
        private Dictionary<int, List<SensorTag>> m_dicZoneSensorTags = new Dictionary<int, List<SensorTag>>();
        // Key : Floor Index
        private Dictionary<int, List<SensorTag>> m_dicZoneSensorTags2 = new Dictionary<int, List<SensorTag>>();

        private DBManager m_dbManager = null;

        public DataManager DataManager
        {
            get { return m_dataManager; }
        }

        private string m_strSOPWebServerURL = "";
        public string SOPWebServerURL
        {
            get { return m_strSOPWebServerURL; }
        }

        private bool m_use = false;
        public bool Use
        {
            get { return m_use; }
        }

        public int SiteID
        {
            get { return m_nSiteID; }
        }

        public string ServerIP
        {
            get { return m_strServerIP; }
        }

        public EduManager(ServerManager serverManager, DataManager dataManager, string strSOPWebServerURL, int nSiteID, int nServerSeqNo, string strServerIP, string strServerAlias, bool use)
        {
            m_serverManager = serverManager;
            m_dataManager = (DataManager)dataManager.Clone();
            m_sopQueryManager = new SopQueryManager(strSOPWebServerURL);

            m_nSiteID = nSiteID;
            m_nServerSeqNo = nServerSeqNo;
            m_strServerIP = strServerIP;

            m_strServerAlias = strServerAlias;
            m_strSOPWebServerURL = strSOPWebServerURL;
            m_use = use;

            m_dicZoneSensorTags = SensorManager.LoadZoneSensors(m_dataManager, m_nSiteID, (int)dnsData.Sensor.Facility.FacilityType.EmergencyBell);
            SetSensorTags(m_dicZoneSensorTags);

            m_dbManager = new DBManager(strServerIP, this, m_dataManager);
        }

        private void SetSensorTags(Dictionary<int, List<SensorTag>> dicZoneSensorTags)
        {
            if (m_dicZoneSensorTags == null)
                return;

            string strErrorMessage;
            string strCondition = string.Format("{0} = {1}", Zone.Fields.SiteID, m_nSiteID);
            IEnumerable<Zone> zones = m_dataManager.GetSelect().Select<Zone>(strCondition, out strErrorMessage);

            if (zones != null)
            {
                Dictionary<int, Zone> dicZones = new Dictionary<int, Zone>();

                foreach (Zone zone in zones)
                {
                    dicZones[zone.ID] = zone;
                }

                m_dicZoneSensorTags2 = new Dictionary<int, List<SensorTag>>();

                foreach (KeyValuePair<int, List<SensorTag>> pair in dicZoneSensorTags)
                {
                    Zone zone;

                    if (dicZones.TryGetValue(pair.Key, out zone))
                    {
                        if (zone.FloorIndex != null)
                        {
                            m_dicZoneSensorTags2[(int)zone.FloorIndex] = pair.Value;
                        }
                    }
                }
            }
        }

        public void WriteLog(string strLog, LogTypes type = LogTypes.Info)
        {
            if (this.Logger != null)
                this.Logger.Write(type, ServerType, m_nServerSeqNo, strLog);
            else
                Logger.Instance.Write(type, ServerType, m_nServerSeqNo, strLog);
        }

        public void ProcessData(string strEmergencyBellName, int floorIndex, bool isAlarm)
        {
            List<SensorTag> sensorTags;

            if (m_dicZoneSensorTags2.TryGetValue(floorIndex, out sensorTags))
            {
                if (sensorTags.Count == 0)
                    return;

                // 첫번째 Tag를 사용한다.
                SensorTag sensorTag = sensorTags[0];
                SendSensorData(sensorTag, isAlarm);
            }
        }

        public bool SendSensorData(SensorTag sensorTag, bool isAlarm)
        {
            return m_serverManager.SendSensorData(m_sopQueryManager, sensorTag.SensorType, sensorTag.ID, sensorTag.SensorZoneID, isAlarm);
        }
    }
}
