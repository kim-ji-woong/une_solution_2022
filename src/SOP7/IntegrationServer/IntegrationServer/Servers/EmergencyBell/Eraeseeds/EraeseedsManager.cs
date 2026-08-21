using dnsCommunicateSopServer;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsSopID;
using IntegrationServer.Datas;
using IntegrationServer.Managers;
using System.Collections.Generic;

namespace IntegrationServer.Servers.EmergencyBell.Eraeseeds
{
    class EraeseedsManager : IServer
    {
        #region IServer 인터페이스
        private int m_nServerSeqNo = -1;
        public int ServerSeqNo => m_nServerSeqNo;

        public ID.ServerTypes ServerType => ID.ServerTypes.EmergencyBell_Eraeseeds;

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
            m_provider.Start();
        }

        public void Stop()
        {
            m_provider.Stop();
            m_isStarted = false;
        }
        #endregion

        private DataManager m_dataManager = null;
        private SopQueryManager m_sopQueryManager = null;
        private int m_nSiteID = -1;
        private string m_strServerIP = string.Empty;
        private int m_nPort = -1;

        // 비상벨 센서 목록
        // Key : SensorTag.ID
        private Dictionary<int, SensorTag> m_dicSensorTags = new Dictionary<int, SensorTag>();
        // Key : SensorTag.Description
        private Dictionary<string, SensorTag> m_dicSensorTags2 = new Dictionary<string, SensorTag>();

        public string ServerIP
        {
            get { return m_strServerIP; }
            set { m_strServerIP = value; }
        }

        public int Port
        {
            get { return m_nPort; }
            set { m_nPort = value; }
        }

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

        private ClientProvider m_provider = null;

        public EraeseedsManager(ServerManager serverManager, DataManager dataManager, string strSOPWebServerURL, int nSiteID, int nServerSeqNo, string strServerIP, int nPort, string strServerAlias, bool use)
        {
            m_serverManager = serverManager;
            m_dataManager = (DataManager)dataManager.Clone();
            m_sopQueryManager = new SopQueryManager(strSOPWebServerURL);

            m_nSiteID = nSiteID;
            m_nServerSeqNo = nServerSeqNo;
            m_strServerIP = strServerIP;
            m_nPort = nPort;
            m_strServerAlias = strServerAlias;
            m_strSOPWebServerURL = strSOPWebServerURL;
            m_use = use;

            m_dicSensorTags = SensorManager.LoadSensors(m_dataManager, m_nSiteID, (int)dnsData.Sensor.Facility.FacilityType.EmergencyBell);
            SetSensorTags(m_dicSensorTags);

            m_provider = new ClientProvider(this, m_nServerSeqNo);
            m_provider.LengthAdd = false;
        }

        private void SetSensorTags(Dictionary<int, SensorTag> dicSensorTags)
        {
            if (dicSensorTags != null)
            {
                foreach (KeyValuePair<int, SensorTag> pair in dicSensorTags)
                {
                    if (pair.Value.Description != null)
                        m_dicSensorTags2[pair.Value.Description] = pair.Value;
                }
            }
        }

        public string WriteBinaryLog(byte[] bytes, int nIndex, int len, string strTag)
        {
            string strBytesLog = Logger.GetByteString(bytes, nIndex, len);
            WriteLog(strTag + " : " + strBytesLog, LogTypes.Info);
            return strTag + " : " + strBytesLog;
        }

        public void WriteLog(string strLog, LogTypes type = LogTypes.Info)
        {
            if (this.Logger != null)
                this.Logger.Write(type, ServerType, m_nServerSeqNo, strLog);
            else
                Logger.Instance.Write(type, ServerType, m_nServerSeqNo, strLog);
        }

        public void ProcessData(byte cmd, byte[] bytes, int len)
        {
            SensorTag sensorTag = null;
            bool isAlarm = false;

            if (cmd == Cep5000.EventOn || cmd == Cep5000.EventOff)
            {
                isAlarm = cmd == Cep5000.EventOn;
                sensorTag = Cep5000.GetSensor(cmd, len, bytes, m_dicSensorTags2);
            }
            else if (cmd == Cep5200.EventOn || cmd == Cep5200.EventOff || cmd == Cep5200.EventOnV2 || cmd == Cep5200.EventOffV2)
            {
                isAlarm = cmd == Cep5200.EventOn || cmd == Cep5200.EventOnV2;
                sensorTag = Cep5200.GetSensor(cmd, len, bytes, m_dicSensorTags2, this.Logger, m_nServerSeqNo);
            }
            else if (cmd == Cep5200.EquipList || cmd == Cep5200.EquipName || cmd == Cep5200.EquipStatus)
                Cep5200.GetSensor(cmd, len, bytes, m_dicSensorTags2, this.Logger, m_nServerSeqNo);

            if (sensorTag != null)
                SendSensorData(sensorTag, isAlarm);
        }

        public bool SendSensorData(SensorTag sensorTag, bool isAlarm)
        {
            return m_serverManager.SendSensorData(m_sopQueryManager, sensorTag.SensorType, sensorTag.ID, sensorTag.SensorZoneID, isAlarm);
        }
    }
}
