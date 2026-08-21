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
using static dnsSopID.ID;

namespace IntegrationServer.Servers.FMS.GG_F
{
    public class SumpPitGGFManager : IServer
    {
        private int m_nServerSeqNo = -1;
        public int ServerSeqNo { get { return m_nServerSeqNo; } }

        public ID.ServerTypes ServerType { get { return ServerTypes.Fms_SumpPit_GG_F; } }

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

        public SumpPitGGFManager(ServerManager serverManager, DataManager dataManager, string strSOPWebServerURL, int nServerSeqNo, int nSiteID, string strServerIP, int nPort, string strServerAlias, bool use)
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
            if (arrData == null || arrData.Length == 0 || arrData.Length != (ClientProvider.RequestLength * ClientProvider.RegisterLength))
                return;

            byte[] arrByte = new byte[ClientProvider.RequestLength * ClientProvider.RegisterLength];

            Array.Copy(arrData, 0, arrByte, 0, ClientProvider.RequestLength * ClientProvider.RegisterLength);

            //Array.Reverse(arrByte);

            //BitArray bitArr = new BitArray(arrByte);

            //bool b1192 = bitArr[0]; // 기계실 배수-1 고수위 경보
            //bool b1193 = bitArr[1]; // 기계실 배수-2 고수위 경보
            //bool b1194 = bitArr[2]; // 지하주차장 배수-1 고수위 경보
            //bool b1195 = bitArr[3]; // 지하주차장 배수-2 고수위 경보
            //bool b1196 = bitArr[4]; // 지하주차장 배수-3 고수위 경보
            //bool b1197 = bitArr[5]; // 지하주차장 배수-4 고수위 경보
            //bool b1198 = bitArr[6]; // 영구배수-1 고수위 경보
            //bool b1199 = bitArr[7]; // 영구배수-2 고수위 경보
            //bool b1200 = bitArr[8]; // 영구배수-3 고수위 경보
            //bool b1201 = bitArr[9]; // 영구배수-4 고수위 경보

            //bool b1208 = bitArr[16]; // ELEV PIT 배수-1 고수위 경보
            //bool b1209 = bitArr[17]; // ELEV PIT 배수-2 고수위 경보
            //bool b1210 = bitArr[18]; // DA-1 우수 배수 고수위 경보
            //bool b1211 = bitArr[19]; // DA-2 우수 배수 고수위 경보

            byte[] arr2384 = new byte[ClientProvider.RegisterLength];
            byte[] arr2385 = new byte[ClientProvider.RegisterLength];
            byte[] arr2386 = new byte[ClientProvider.RegisterLength];
            byte[] arr2387 = new byte[ClientProvider.RegisterLength];
            byte[] arr2388 = new byte[ClientProvider.RegisterLength];
            byte[] arr2389 = new byte[ClientProvider.RegisterLength];
            byte[] arr2390 = new byte[ClientProvider.RegisterLength];
            byte[] arr2391 = new byte[ClientProvider.RegisterLength];
            byte[] arr2392 = new byte[ClientProvider.RegisterLength];
            byte[] arr2393 = new byte[ClientProvider.RegisterLength];
            byte[] arr2400 = new byte[ClientProvider.RegisterLength];
            byte[] arr2401 = new byte[ClientProvider.RegisterLength];
            byte[] arr2402 = new byte[ClientProvider.RegisterLength];
            byte[] arr2403 = new byte[ClientProvider.RegisterLength];

            Array.Copy(arrData, 0, arr2384, 0, ClientProvider.RegisterLength);
            Array.Copy(arrData, (1 * ClientProvider.RegisterLength), arr2385, 0, ClientProvider.RegisterLength);
            Array.Copy(arrData, (2 * ClientProvider.RegisterLength), arr2386, 0, ClientProvider.RegisterLength);
            Array.Copy(arrData, (3 * ClientProvider.RegisterLength), arr2387, 0, ClientProvider.RegisterLength);
            Array.Copy(arrData, (4 * ClientProvider.RegisterLength), arr2388, 0, ClientProvider.RegisterLength);
            Array.Copy(arrData, (5 * ClientProvider.RegisterLength), arr2389, 0, ClientProvider.RegisterLength);
            Array.Copy(arrData, (6 * ClientProvider.RegisterLength), arr2390, 0, ClientProvider.RegisterLength);
            Array.Copy(arrData, (7 * ClientProvider.RegisterLength), arr2391, 0, ClientProvider.RegisterLength);
            Array.Copy(arrData, (8 * ClientProvider.RegisterLength), arr2392, 0, ClientProvider.RegisterLength);
            Array.Copy(arrData, (9 * ClientProvider.RegisterLength), arr2393, 0, ClientProvider.RegisterLength);
            Array.Copy(arrData, (16 * ClientProvider.RegisterLength), arr2400, 0, ClientProvider.RegisterLength);
            Array.Copy(arrData, (17 * ClientProvider.RegisterLength), arr2401, 0, ClientProvider.RegisterLength);
            Array.Copy(arrData, (18 * ClientProvider.RegisterLength), arr2402, 0, ClientProvider.RegisterLength);
            Array.Copy(arrData, (19 * ClientProvider.RegisterLength), arr2403, 0, ClientProvider.RegisterLength);

            if (bIsReverse)
            {
                Array.Reverse(arr2384);
                Array.Reverse(arr2385);
                Array.Reverse(arr2386);
                Array.Reverse(arr2387);
                Array.Reverse(arr2388);
                Array.Reverse(arr2389);
                Array.Reverse(arr2390);
                Array.Reverse(arr2391);
                Array.Reverse(arr2392);
                Array.Reverse(arr2393);
                Array.Reverse(arr2400);
                Array.Reverse(arr2401);
                Array.Reverse(arr2402);
                Array.Reverse(arr2403);
            }                

            UInt16 n2384 = BitConverter.ToUInt16(arr2384, 0);
            UInt16 n2385 = BitConverter.ToUInt16(arr2385, 0);
            UInt16 n2386 = BitConverter.ToUInt16(arr2386, 0);
            UInt16 n2387 = BitConverter.ToUInt16(arr2387, 0);
            UInt16 n2388 = BitConverter.ToUInt16(arr2388, 0);
            UInt16 n2389 = BitConverter.ToUInt16(arr2389, 0);
            UInt16 n2390 = BitConverter.ToUInt16(arr2390, 0);
            UInt16 n2391 = BitConverter.ToUInt16(arr2391, 0);
            UInt16 n2392 = BitConverter.ToUInt16(arr2392, 0);
            UInt16 n2393 = BitConverter.ToUInt16(arr2393, 0);
            UInt16 n2400 = BitConverter.ToUInt16(arr2400, 0);
            UInt16 n2401 = BitConverter.ToUInt16(arr2401, 0);
            UInt16 n2402 = BitConverter.ToUInt16(arr2402, 0);
            UInt16 n2403 = BitConverter.ToUInt16(arr2403, 0);

            WriteLog($"수신 데이터 " +
                $"기계실 배수-1 고수위 경보 {n2384}, " +
                $"기계실 배수-2 고수위 경보 {n2385}, " +
                $"지하주차장 배수-1 고수위 경보 {n2386}, " +
                $"지하주차장 배수-2 고수위 경보 {n2387}, " +
                $"지하주차장 배수-3 고수위 경보 {n2388}, " +
                $"지하주차장 배수-4 고수위 경보 {n2389}, " +
                $"영구배수-1 고수위 경보 {n2390}, " +
                $"영구배수-2 고수위 경보 {n2391}, " +
                $"영구배수-3 고수위 경보 {n2392}, " +
                $"영구배수-4 고수위 경보 {n2393}, " +
                $"ELEV PIT 배수-1 고수위 경보 {n2400}, " +
                $"ELEV PIT 배수-2 고수위 경보 {n2401}, " +
                $"DA-1 우수 배수 고수위 경보 {n2402}, " +
                $"DA-2 우수 배수 고수위 경보 {n2403}, ", LogTypes.Info);

            int nAlarmCnt = 0;

            if (n2384 == 1)
                nAlarmCnt++;
            if (n2385 == 1)
                nAlarmCnt++;
            if (n2386 == 1)
                nAlarmCnt++;
            if (n2387 == 1)
                nAlarmCnt++;
            if (n2388 == 1)
                nAlarmCnt++;
            if (n2389 == 1)
                nAlarmCnt++;
            if (n2390 == 1)
                nAlarmCnt++;
            if (n2391 == 1)
                nAlarmCnt++;
            if (n2392 == 1)
                nAlarmCnt++;
            if (n2393 == 1)
                nAlarmCnt++;
            if (n2400 == 1)
                nAlarmCnt++;
            if (n2401 == 1)
                nAlarmCnt++;
            if (n2402 == 1)
                nAlarmCnt++;
            if (n2403 == 1)
                nAlarmCnt++;

            int nAlarmDepth = 0;
            if (nAlarmCnt >= 12)
            {   // 심각
                nAlarmDepth = 4;
            }                
            else if (nAlarmCnt >= 8)
            {   // 경계
                nAlarmDepth = 3;
            }
            else if (nAlarmCnt >= 5)
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
