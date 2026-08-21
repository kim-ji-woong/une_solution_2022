using dnsCommunicateSopServer;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using IntegrationServer.Datas;
using IntegrationServer.Managers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using static AgentFactory.BLL.ServerType;

namespace IntegrationServer.Servers.ContactSignal.Sollae
{
    public class ContactManager : IServer
    {
        private ServerManager m_serverManager = null;
        public ServerManager GetServerManager()
        {
            return m_serverManager;
        }

        public ServerTypes ServerType { get { return ServerTypes.ContactSignal; } }

        private int m_nServerSeqNo = -1;
        public int ServerSeqNo { get { return m_nServerSeqNo; } }

        private bool m_runThread = false;
        public void Stop()
        {
            m_provider.Stop();
        }

        public void Start()
        {
            m_provider.Start();
        }

        private ContactProvider m_provider = null;
        public bool IsConnected { get { return m_provider.IsConnected; } }
        public Logger Logger { get; set; }
        private SopQueryManager m_sopQueryManager = null;

        private int m_nSiteID = -1;
        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }

        private string m_strServerIP = string.Empty;
        public string ServerIP { get { return m_strServerIP; } }

        private int m_nPort = -1;
        public int Port { get { return m_nPort; } }

        private Dictionary<ServerProperty, object> m_serverProperties = null;
        public Dictionary<ServerProperty, object> ServerProperties { get { return m_serverProperties; } }

        private int? m_nContactType = (int)ContactTypes.First_Dry;
        private int? m_nContactSensorType = null;
        private int? m_nContactSensorID = null;
        private int? m_nContactAlarmDepth = (int)AlarmDepths.None;

        private bool m_bCurrentAlarmOn = false;

        private DataManager m_dataManager = null;
        public DataManager DataManager { get { return m_dataManager; } }

        public bool Use { get; set; }
        public string SOPWebServerURL { get; set; }

        private string m_strServerAlias = "";
        public string ServerAlias { get { return m_strServerAlias; } }

        public ContactManager(ServerManager serverManager, DataManager dataManager, string strSOPWebServerURL, int nServerSeqNo, int nSiteID, string strServerIP, int nPort, Dictionary<ServerProperty, object> serverProperties,
            string strServerAlias, bool bUse)
        {
            m_serverManager = serverManager;
            m_dataManager = (DataManager)dataManager.Clone();
            m_sopQueryManager = new SopQueryManager(strSOPWebServerURL);

            m_nServerSeqNo = nServerSeqNo;
            m_nSiteID = nSiteID;
            m_strServerIP = strServerIP;
            m_nPort = nPort;
            m_strServerAlias = strServerAlias;

            this.Use = bUse;
            this.SOPWebServerURL = strSOPWebServerURL;

            m_serverProperties = serverProperties;

            foreach (KeyValuePair<ServerProperty, object> pair in serverProperties)
            {
                ServerProperty key = pair.Key;

                if (pair.Value == null)
                    continue;

                if (key == ServerProperty.ContactType)
                {
                    string strContactType = pair.Value.ToString();
                    if (int.TryParse(strContactType, out int nContactType))
                        m_nContactType = nContactType;
                }                    
                else if (key == ServerProperty.ContactSensorType)
                {
                    string strContactSensorType = pair.Value.ToString();
                    if (int.TryParse(strContactSensorType, out int nContactSensorType))
                        m_nContactSensorType = nContactSensorType;
                }
                else if (key == ServerProperty.ContactSensorID)
                {
                    string strContactSensorID = pair.Value.ToString();
                    if (int.TryParse(strContactSensorID, out int nContactSensorID))
                        m_nContactSensorID = nContactSensorID;
                }
                if (key == ServerProperty.ContactAlarmDepth)
                {
                    string strContactAlarmDepth = pair.Value.ToString();
                    if (int.TryParse(strContactAlarmDepth, out int nContactAlarmDepth))
                        m_nContactAlarmDepth = nContactAlarmDepth;
                }
            }

            m_provider = new ContactProvider(this, m_nServerSeqNo);
            m_provider.LengthAdd = false;
        }

        public void CheckContactSignal(ContactData data)
        {
            if (data == null)
                return;

            if (m_nContactSensorType.HasValue == false ||
                m_nContactSensorID.HasValue == false ||
                m_nContactAlarmDepth.HasValue == false)
            {
                string strError = "SensorType, SensorID, AlarmDepth 설정값이 없습니다. 확인해주세요.";
                throw new ApplicationException(strError);
            }



            bool bAlarmOn = false;

            // 옵션 읽고
            if (m_nContactType == (int)ContactTypes.First_Dry && data.First_Dry == true)
                bAlarmOn = true;
            else if (m_nContactType == (int)ContactTypes.Second_Wet && data.Second_Wet == true)
                bAlarmOn = true;
            else if (m_nContactType == (int)ContactTypes.Both && (data.First_Dry || data.Second_Wet))
                bAlarmOn = true;




            // 알람 체크
            if (bAlarmOn == true && m_bCurrentAlarmOn == false)
            {
                // 알람 발생 신호
                Logger.Write(LogTypes.Info, ServerTypes.ContactSignal, m_nServerSeqNo, "Contact 알람 발생");

                m_bCurrentAlarmOn = bAlarmOn;
                SensorTag sensorTag = SensorManager.Instance.FindSensorByOrgSensorID(m_nServerSeqNo, m_nContactSensorID.Value);
                if (sensorTag == null)
                {
                    string strError = $"해당 SensorTag 값이 없습니다. ServerSeqNo: {m_nServerSeqNo.ToString()}, SensorID: {m_nContactSensorID.Value.ToString()}";
                    throw new ApplicationException(strError);
                }

                SendSensorData(sensorTag, m_nContactSensorType.Value, true, m_nContactAlarmDepth.Value);
            }
            else if (bAlarmOn == false && m_bCurrentAlarmOn == true)
            {
                // 알람 해제 신호
                Logger.Write(LogTypes.Info, ServerTypes.ContactSignal, m_nServerSeqNo, "Contact 알람 해제");

                m_bCurrentAlarmOn = bAlarmOn;
                SensorTag sensorTag = SensorManager.Instance.FindSensorByOrgSensorID(m_nServerSeqNo, m_nContactSensorID.Value);
                if (sensorTag == null)
                {
                    string strError = $"해당 SensorTag 값이 없습니다. ServerSeqNo: {m_nServerSeqNo.ToString()}, SensorID: {m_nContactSensorID.Value.ToString()}";
                    throw new ApplicationException(strError);
                }

                SendSensorData(sensorTag, m_nContactSensorType.Value, false, m_nContactAlarmDepth.Value);
            }
        }

        public bool SendSensorData(SensorTag sensorTag, int nfacilityType, bool bIsAlarm, int nAlarmLevel)
        {
            if (nAlarmLevel == (int)AlarmDepths.None)
                return m_serverManager.SendSensorData(m_sopQueryManager, nfacilityType, sensorTag.ID, sensorTag.SensorZoneID, bIsAlarm);
            else
                return m_serverManager.SendSensorData(m_sopQueryManager, nfacilityType, sensorTag.ID, sensorTag.SensorZoneID, bIsAlarm, nAlarmLevel);
        }
    }

    public class ContactData
    {
        private bool m_bFirst_Dry = false;
        public bool First_Dry
        {
            get { return m_bFirst_Dry; }
            set { m_bFirst_Dry = value; }
        }

        private bool m_bSecond_Wet = false;
        public bool Second_Wet 
        { 
            get { return m_bSecond_Wet; }
            set { m_bSecond_Wet = value; }
        }
    }
}
