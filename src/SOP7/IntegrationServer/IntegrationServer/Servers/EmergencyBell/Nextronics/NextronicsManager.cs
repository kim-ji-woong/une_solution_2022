using dnsCommunicateSopServer;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsSopID;
using IntegrationServer.Datas;
using IntegrationServer.Managers;
using System.Collections.Generic;
using dnsTcpLib2;
using dnsData.Sensor;
using Nipa.Model.Sdms.Sensor;

namespace IntegrationServer.Servers.EmergencyBell.Nextronics
{
    using ViewModels.Sdms;

    class NextronicsManager : IServer
    {
        #region IServer 인터페이스
        private int m_nServerSeqNo = -1;
        public int ServerSeqNo => m_nServerSeqNo;

        public ID.ServerTypes ServerType => ID.ServerTypes.EmergencyBell_Nextronics;

        private string m_strServerAlias = string.Empty;
        public string ServerAlias => m_strServerAlias;

        private bool m_isStarted = false;

        public bool IsConnected
        {
            get { return m_isStarted; }
        }

        public Logger Logger { get; set; }

        private ServerManager m_serverManager = null;
        public ServerManager GetServerManager()
        {
            return m_serverManager;
        }

        public void Start()
        {
            m_isStarted = true;

            m_serverProvider = new ServerProvider(this);
            m_server = new TcpServer(m_serverProvider, m_nPort);
            m_server.Start();
        }

        public void Stop()
        {
            m_serverProvider.ClearData();
            m_server.Stop();

            m_isStarted = false;
        }
        #endregion

        private DataManager m_dataManager = null;
        private SopQueryManager m_sopQueryManager = null;
        private int m_nSiteID = -1;
        private int m_nPort = -1;

        private TcpServer m_server = null;
        private ServerProvider m_serverProvider = null;
        private string m_strSOPWebServerURL = null;

        // 비상벨 센서 목록
        // Key : SensorTag.ID
        private Dictionary<int, SensorTag> m_dicSensorTags = new Dictionary<int, SensorTag>();
        // Key : TagNo
        private Dictionary<int, SensorTag> m_dicSensorTags2 = new Dictionary<int, SensorTag>();

        public NextronicsManager(ServerManager serverManager, DataManager dataManager, string strSOPWebServerURL, int nSiteID, int nServerSeqNo, int nPort, string strServerAlias, bool use)
        {
            m_serverManager = serverManager;
            m_dataManager = (DataManager)dataManager.Clone();
            m_sopQueryManager = new SopQueryManager(strSOPWebServerURL);

            m_nSiteID = nSiteID;
            m_nServerSeqNo = nServerSeqNo;
            m_nPort = nPort;
            m_strServerAlias = strServerAlias;
            m_strSOPWebServerURL = strSOPWebServerURL;

            m_dicSensorTags = SensorManager.LoadSensors(m_dataManager, m_nSiteID, (int)dnsData.Sensor.Facility.FacilityType.EmergencyBell);
            SetSensorTags(m_dicSensorTags);
        }

        private void SetSensorTags(Dictionary<int, SensorTag> dicSensorTags)
        {
            if (dicSensorTags != null)
            {
                foreach (KeyValuePair<int, SensorTag> pair in dicSensorTags)
                {
                    m_dicSensorTags2[pair.Value.TagNo] = pair.Value;
                }
            }
        }

        public void ProcessData(int tagNo, bool isAlarm)
        {
            if (tagNo == 0 && isAlarm == false)
            {
                SendAllClear();
            }
            else
            {
                SensorTag sensorTag;

                if (m_dicSensorTags2.TryGetValue(tagNo, out sensorTag))
                {
                    m_serverManager.SendSensorData(m_sopQueryManager, sensorTag.SensorType, sensorTag.ID, sensorTag.SensorZoneID, isAlarm);
                }
            }
        }

        // 같은 Site 내에서 알람 상태인 모든 비상벨 알람을 종료시킨다.
        private void SendAllClear()
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1}", CurrentAlarm.Fields.SensorType, (int)Facility.FacilityType.EmergencyBell);
            IEnumerable<CurrentAlarm> currentAlarms = m_dataManager.GetSelect().Select<CurrentAlarm>(strCondition, out strErrorMessage);

            if (currentAlarms == null)
                WriteLog(strErrorMessage, LogTypes.Error);
            else
            {
                string strSensorZoneIDs = null;

                foreach (CurrentAlarm alarm in currentAlarms)
                {
                    if (alarm.AlarmSensorZoneIDs == null || alarm.AlarmSensorZoneIDs.Length == 0)
                        continue;

                    if (strSensorZoneIDs == null)
                        strSensorZoneIDs = alarm.AlarmSensorZoneIDs;
                    else
                        strSensorZoneIDs += "," + alarm.AlarmSensorZoneIDs;
                }

                if (strSensorZoneIDs == null)
                    return;

                // 현재 알람상태인 모든 비상벨 알람을 얻어온다.(같은 Site 내에서...)
                string strSQL = string.Format("Select a.{0} sensorZoneID, c.{11} sensorTagInfoID from {1} a, {2} b, {12} c where a.{3} = {4} and a.{5} = b.{6} and a.{5} in (Select {6} from {2} where {7} = {4} and {8} = {9}) and a.{0} in ({10}) and a.{0} = c.{13}",
                    SensorZone.Fields.ID,
                    SensorZone.TableName, ViewModels.Sdms.Sensor.EtcSensor.TableName,
                    SensorZone.Fields.SensorType, (int)Facility.FacilityType.EmergencyBell,
                    SensorZone.Fields.OrgSensorID, ViewModels.Sdms.Sensor.EtcSensor.Fields.ID,
                    ViewModels.Sdms.Sensor.EtcSensor.Fields.MaterialType,
                    ViewModels.Sdms.Sensor.EtcSensor.Fields.SiteID, m_nSiteID,
                    strSensorZoneIDs,
                    TagInfo.Fields.ID,
                    TagInfo.TableName,
                    TagInfo.Fields.SensorZoneID);

                IEnumerable<dynamic> results = m_dataManager.GetSelect().Select(strSQL, out strErrorMessage);

                if (results == null)
                {
                    WriteLog(strErrorMessage);
                }
                else
                {
                    foreach (var item in results)
                    {
                        int sensorZoneID = item.sensorZoneID;
                        int sensorTagInfoID = item.sensorTagInfoID;
                        m_serverManager.SendSensorData(m_sopQueryManager, (int)Facility.FacilityType.EmergencyBell, sensorTagInfoID, sensorZoneID, false);
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
    }
}
