using dnsCommunicateSopServer;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsData.Sensor;
using dnsSopID;
using IntegrationServer.Datas;
using Nipa.Model.Sdms.Sensor;
using Nipa.Model.Sdms.Spatial;
using System;
using System.Collections.Generic;
using System.Text;
using static AgentFactory.BLL.ServerType;

namespace IntegrationServer.Servers.Blackout.GG_G
{
    class BlackoutGG_GManager : IServer
    {
        private int m_nServerSeqNo = -1;
        public int ServerSeqNo { get { return m_nServerSeqNo; } }

        public ServerTypes ServerType { get { return ServerTypes.Blackout_GG_G; } }

        private string m_strServerAlias = "";
        public string ServerAlias { get { return m_strServerAlias; } }

        private bool m_isStarted = false;
        public bool IsConnected { get { return m_isStarted; } }

        public Logger Logger { get; set; }

        private ServerManager m_serverManager = null;
        public ServerManager GetServerManager() { return m_serverManager; }

        private ClientProvider m_provider = null;

        private bool m_bIsAlarm = false;

        private DataManager m_dataManager = null;
        public DataManager DataManager { get { return m_dataManager; } }

        private SopQueryManager m_sopQueryManager = null;

        public string SOPWebServerURL { get; set; }
        public string ServerIP { get; set; }

        // 모드버스 기본 Port
        private int m_nPort = 502;
        public int Port
        {
            get { return m_nPort; }
            set { m_nPort = value; }
        }

        private int m_nSiteID = -1;
        public int SiteID { get { return m_nSiteID; } }

        private bool m_use = false;
        public bool Use { get { return m_use; } }

        private SensorZone m_sensorZone = null;
        private TagInfo m_tag = null;

        public BlackoutGG_GManager(ServerManager serverManager, DataManager dataManager, string strSOPWebServerURL, int nServerSeqNo, int nSiteID, string strServerIP, int nPort, string strServerAlias, bool use)
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

            Init();

            m_provider = new ClientProvider(this, m_nServerSeqNo);
            m_provider.LengthAdd = false;
        }

        private void Init()
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1} and {2} in (Select {3} from {4} where {5} = {6})",
                SensorZone.Fields.SensorType,
                (int)Facility.FacilityType.BLACKOUT,
                SensorZone.Fields.EquipZoneID,
                EquipmentZone.Fields.ID,
                EquipmentZone.TableName,
                EquipmentZone.Fields.SiteID,
                m_nSiteID);


            SensorZone sensorZone = m_dataManager.GetSelect().SelectFirst<SensorZone>(strCondition, out strErrorMessage);
            if (sensorZone == null)
            {
                WriteLog($"Init() SensorZone 실패: " + strErrorMessage, LogTypes.Error);
                return;
            }

            strCondition = string.Format("{0} = {1}", TagInfo.Fields.SensorZoneID, sensorZone.ID);

            TagInfo tag = m_dataManager.GetSelect().SelectFirst<TagInfo>(strCondition, out strErrorMessage);
            if (tag == null)
            {
                WriteLog($"Init() TagInfo 실패: " + strErrorMessage, LogTypes.Error);
                return;
            }

            m_sensorZone = sensorZone;
            m_tag = tag;
        }

        public void Start()
        {
            m_provider.Start();
            m_isStarted = true;
        }

        public void Stop()
        {
            m_provider.Stop();
            m_isStarted = false;
        }

        public void CheckAlarm(byte[] arrData, bool bIsReverse = true)
        {
            if (arrData == null || arrData.Length == 0 || arrData.Length != ClientProvider.RequestLength * ClientProvider.RegisterLength)
                return;

            byte[] arr2000 = new byte[ClientProvider.FloatLeng];
            byte[] arr2002 = new byte[ClientProvider.FloatLeng];
            byte[] arr2004 = new byte[ClientProvider.FloatLeng];

            Array.Copy(arrData, 0, arr2000, 0, ClientProvider.FloatLeng);
            Array.Copy(arrData, (2 * ClientProvider.RegisterLength), arr2002, 0, ClientProvider.FloatLeng);
            Array.Copy(arrData, (4 * ClientProvider.RegisterLength), arr2004, 0, ClientProvider.FloatLeng);

            if (bIsReverse)
            {
                Array.Reverse(arr2000);
                Array.Reverse(arr2002);
                Array.Reverse(arr2004);
            }

            float fVolA = BitConverter.ToSingle(arr2000, 0);
            float fVolB = BitConverter.ToSingle(arr2002, 0);
            float fVolC = BitConverter.ToSingle(arr2004, 0);

            WriteLog($"CheckAlarm 데이터 상전압 A: {fVolA}, 상전압 B: {fVolB}, 상전압 C: {fVolC}", LogTypes.Info);
 
            //if (fVolA <= 20 || fVolB <= 20 || fVolC <= 20)
            if (fVolA <= 5000 || fVolB <= 5000 || fVolC <= 5000)
            {
                if (m_bIsAlarm == false)
                {   // 알람 발생
                    if (m_serverManager.SendSensorData(m_sopQueryManager, (int)Facility.FacilityType.BLACKOUT, m_tag.ID, m_tag.SensorZoneID.Value, true))
                    {
                        WriteLog($"정전 알람 발생 (SendSensorData 성공, Tag ID: {m_tag.ID}, SensorZoneID: {m_tag.SensorZoneID.Value})", LogTypes.Info);
                        m_bIsAlarm = true;
                    }
                    else
                    {
                        WriteLog($"SendSensorData 알람 발생 실패, Tag ID: {m_tag.ID}, SensorZoneID: {m_tag.SensorZoneID.Value})", LogTypes.Info);
                    }
                }
            }
            else if (m_bIsAlarm == true)
            {   // 알람 해제
                if (m_serverManager.SendSensorData(m_sopQueryManager, (int)Facility.FacilityType.BLACKOUT, m_tag.ID, m_tag.SensorZoneID.Value, false))
                {
                    WriteLog($"정전 알람 해제 (SendSensorData 성공, Tag ID: {m_tag.ID}, SensorZoneID: {m_tag.SensorZoneID.Value})", LogTypes.Info);
                    m_bIsAlarm = true;
                }
                else
                {
                    WriteLog($"SendSensorData 알람 해제 실패, Tag ID: {m_tag.ID}, SensorZoneID: {m_tag.SensorZoneID.Value})", LogTypes.Info);
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

        public string WriteBinaryLog(byte[] bytes, int nIndex, int len, string strTag)
        {
            string strBytesLog = Logger.GetByteString(bytes, nIndex, len);
            WriteLog(strTag + " : " + strBytesLog, LogTypes.Info);
            return strTag + " : " + strBytesLog;
        }
    }
}
