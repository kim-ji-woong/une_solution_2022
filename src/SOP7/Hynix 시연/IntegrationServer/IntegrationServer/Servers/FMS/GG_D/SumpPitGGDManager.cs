using dnsCommunicateSopServer;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsData.Sensor;
using dnsSopID;
using IntegrationServer.Datas;
using Nipa.Model.Sdms.Sensor;
using Nipa.Model.Sdms.Spatial;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using static AgentFactory.BLL.ServerType;

namespace IntegrationServer.Servers.FMS.GG_D
{
    class SumpPitGGDManager : IServer
    {
        private int m_nServerSeqNo = -1;
        public int ServerSeqNo { get { return m_nServerSeqNo; } }

        public ServerTypes ServerType { get { return ServerTypes.Fms_SumpPit_GG_D; } }

        private string m_strServerAlias = "";
        public string ServerAlias { get { return m_strServerAlias; } }

        private bool m_isStarted = false;
        public bool IsConnected { get { return m_isStarted; } }

        public Logger Logger { get; set; }

        private ServerManager m_serverManager = null;
        public ServerManager GetServerManager() { return m_serverManager; }

        private ClientProvider m_provider = null;

        private DataManager m_dataManager = null;
        public DataManager DataManager { get { return m_dataManager; } }

        private SopQueryManager m_sopQueryManager = null;

        public string ServerIP { get; set; }

        // 모드버스 기본 Port
        private int m_nPort = 502;
        public int Port
        {
            get { return m_nPort; }
            set { m_nPort = value; }
        }

        public string SOPWebServerURL { get; set; }
        private int m_nSiteID = -1;
        public int SiteID { get { return m_nSiteID; } }

        private bool m_use = false;
        public bool Use { get { return m_use; } }

        private SensorZone m_sensorZone = null;
        private TagInfo m_tag = null;

        private bool m_bIsAlarm = false;

        private int m_nAlarmDepth = 0;

        public SumpPitGGDManager(ServerManager serverManager, DataManager dataManager, string strSOPWebServerURL, int nServerSeqNo, int nSiteID, string strServerIP, int nPort, string strServerAlias, bool use)
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
                (int)Facility.FacilityType.SUBMERGENCY,
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
            if (arrData == null || arrData.Length == 0 || arrData.Length != (ClientProvider.RequestLength / ClientProvider.DividBit))
                return;

            byte[] arrByte = new byte[ClientProvider.RequestLength / ClientProvider.DividBit];

            Array.Copy(arrData, 0, arrByte, 0, ClientProvider.RequestLength / ClientProvider.DividBit);

            //Array.Reverse(arrByte);

            BitArray bitArr = new BitArray(arrByte);

            bool b10024 = bitArr[0]; // 영구 배수 고수위경보-1
            bool b10027 = bitArr[3]; // 영구 배수 고수위경보-2
            bool b10030 = bitArr[6]; // 영구 배수 고수위경보-3

            bool b10049 = bitArr[25]; // 기계실 배수 고수위 경보-1
            bool b10052 = bitArr[28]; // 기계실 배수 고수위 경보-2

            bool b10060 = bitArr[36]; // P-18 D.A 배수 고수위경보

            bool b10098 = bitArr[74]; // P-18 D.A 배수 고수위경보

            bool b10119 = bitArr[95]; // P-12 D.A 배수 고수위 경보-1
            bool b10122 = bitArr[98]; // P-12 D.A 배수 고수위 경보-2

            //byte[] arr2384 = new byte[ClientProvider.RegisterLength];
            //byte[] arr2385 = new byte[ClientProvider.RegisterLength];
            //byte[] arr2386 = new byte[ClientProvider.RegisterLength];

            //Array.Copy(arrData, 0, arr2384, 0, ClientProvider.RegisterLength);
            //Array.Copy(arrData, (1 * ClientProvider.RegisterLength), arr2385, 0, ClientProvider.RegisterLength);
            //Array.Copy(arrData, (2 * ClientProvider.RegisterLength), arr2386, 0, ClientProvider.RegisterLength);

            //if (bIsReverse)
            //{
            //    Array.Reverse(arr2384);
            //    Array.Reverse(arr2385);
            //    Array.Reverse(arr2386);
            //}

            //UInt16 n2384 = BitConverter.ToUInt16(arr2384, 0);
            //UInt16 n2385 = BitConverter.ToUInt16(arr2385, 0);
            //UInt16 n2386 = BitConverter.ToUInt16(arr2386, 0);

            WriteLog($"수신 데이터 " +
                $"영구 배수 고수위경보-1 {b10024}, " +
                $"영구 배수 고수위경보-2 {b10027}, " +
                $"영구 배수 고수위경보-3 {b10030}, " +
                $"기계실 배수 고수위 경보-1 {b10049}, " +
                $"기계실 배수 고수위 경보-2 {b10052}, " +
                $"P-18 D.A 배수 고수위경보 {b10060}, " +
                $"P-18 D.A 배수 고수위경보 {b10098}, " +
                $"P-12 D.A 배수 고수위 경보-1 {b10119}, " +
                $"P-12 D.A 배수 고수위 경보-2 {b10122}, ", LogTypes.Info);

            int nAlarmCnt = 0;

            if (b10024 == true)
                nAlarmCnt++;
            if (b10027 == true)
                nAlarmCnt++;
            if (b10030 == true)
                nAlarmCnt++;
            if (b10049 == true)
                nAlarmCnt++;
            if (b10052 == true)
                nAlarmCnt++;
            if (b10060 == true)
                nAlarmCnt++;
            if (b10098 == true)
                nAlarmCnt++;
            if (b10119 == true)
                nAlarmCnt++;
            if (b10122 == true)
                nAlarmCnt++;

            int nAlarmDepth = 0;
            if (nAlarmCnt >= 7)
            {   // 심각
                nAlarmDepth = 4;
            }
            else if (nAlarmCnt >= 5)
            {   // 경계
                nAlarmDepth = 3;
            }
            else if (nAlarmCnt >= 3)
            {   // 주의
                nAlarmDepth = 2;
            }

            if (m_nAlarmDepth != nAlarmDepth)
            {   // 알람 단계가 변경
                if (nAlarmDepth == 0)
                {   // 알람 해제
                    if (m_serverManager.SendSensorData(m_sopQueryManager, (int)Facility.FacilityType.SUBMERGENCY, m_tag.ID, m_tag.SensorZoneID.Value, false))
                    {
                        WriteLog($"SendSensorData 성공 알람 해제 Tag ID: {m_tag.ID}, SensorZoneID: {m_tag.SensorZoneID.Value}", LogTypes.Info);
                        m_nAlarmDepth = nAlarmDepth;
                    }
                }
                else
                {   // 알람 단계 변화
                    if (m_serverManager.SendSensorData(m_sopQueryManager, (int)Facility.FacilityType.SUBMERGENCY, m_tag.ID, m_tag.SensorZoneID.Value, true, nAlarmDepth))
                    {
                        WriteLog($"SendSensorData 성공 알람 발생 단계({nAlarmDepth}) Tag ID: {m_tag.ID}, SensorZoneID: {m_tag.SensorZoneID.Value}", LogTypes.Info);
                        m_nAlarmDepth = nAlarmDepth;
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

        public string WriteBinaryLog(byte[] bytes, int nIndex, int len, string strTag)
        {
            string strBytesLog = Logger.GetByteString(bytes, nIndex, len);
            WriteLog(strTag + " : " + strBytesLog, LogTypes.Info);
            return strTag + " : " + strBytesLog;
        }
    }
}
