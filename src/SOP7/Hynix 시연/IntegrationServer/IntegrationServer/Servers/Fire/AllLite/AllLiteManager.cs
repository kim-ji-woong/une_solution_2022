using dnsSopID;
using System;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsCommunicateSopServer;

namespace IntegrationServer.Servers.Fire.AllLite
{
    using Datas;
    using dnsData.Sensor;
    using IntegrationServer.Managers;
    using Nipa.Model.Sdms.Sensor;
    using ViewModels.Sdms.Sensor;
    using static AgentFactory.BLL.ServerType;

    /// <summary>
    /// 올라이트 화재
    /// </summary>
    public class AllLiteManager : IServer
    {
        #region IServer 인터페이스
        private int m_nServerSeqNo = -1;
        public int ServerSeqNo { get { return m_nServerSeqNo; } }

        public ServerTypes ServerType { get { return ServerTypes.Fire_AllLite; } }

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

        private bool m_bIsAlarm = false;
        private int m_nAlarmDepth = 0;

        private SensorZone m_sensorZone = null;
        private TagInfo m_tag = null;


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

        // Key : Byte 배열 Index
        private List<Dictionary<int, TagInfo>> m_sensorTagInfos = new List<Dictionary<int, TagInfo>>();
        // Key : Start Address
        private Dictionary<int, Dictionary<int, TagInfo>> m_sensorTagInfos2 = new Dictionary<int, Dictionary<int, TagInfo>>();
        private int m_nCurrentGroupIndex = -1;
        private int m_nGroupCount = 0;

        public AllLiteManager(ServerManager serverManager, DataManager dataManager, string strSOPWebServerURL, int nServerSeqNo, int nSiteID, string strServerIP, int nPort, string strServerAlias, bool use)
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
            string strCondition = string.Format("{0} in (Select {1} from {2} where {3} = {4} and {5} in (Select {6} from {7} where {8} = {9})) and {10} < 1000000",
                TagInfo.Fields.SensorZoneID,
                SensorZone.Fields.ID,
                SensorZone.TableName,
                SensorZone.Fields.SensorType, (int)Facility.FacilityType.FIRE_SENSOR,
                SensorZone.Fields.OrgSensorID,
                Fire.Fields.ID,
                Fire.TableName,
                Fire.Fields.SiteID, m_nSiteID,
                TagInfo.Fields.TagNo);

            IEnumerable<TagInfo> tagInfos = m_dataManager.GetSelect().Select<TagInfo>(strCondition, out strErrorMessage);

            if (tagInfos == null)
            {
                WriteLog($"Init() SensorSensorTagInfo 실패: " + strErrorMessage, LogTypes.Error);
                return;
            }

            Dictionary<int, TagInfo> tagList = null;
            bool newGroup = true;
            int beginIndex = 0, endIndex = 0;

            foreach (TagInfo tagInfo in tagInfos)
            {
                if (newGroup)
                {
                    tagList = new Dictionary<int, TagInfo>();
                    m_sensorTagInfos.Add(tagList);
                    m_sensorTagInfos2[tagInfo.TagNo] = tagList;

                    beginIndex = tagInfo.TagNo;
                    endIndex = beginIndex + ClientProvider.RequestLength;
                    newGroup = false;
                }

                if (tagInfo.TagNo < endIndex)
                    tagList[tagInfo.TagNo - beginIndex] = tagInfo;
                else
                    newGroup = true;
            }

            m_nGroupCount = m_sensorTagInfos.Count;

            if (m_nGroupCount > 0)
                m_nCurrentGroupIndex = 0;
        }

        public string WriteBinaryLog(byte[] bytes, int nIndex, int len, string strTag)
        {
            string strBytesLog = Logger.GetByteString(bytes, nIndex, len);
            WriteLog(strTag + " : " + strBytesLog, LogTypes.Info);
            return strTag + " : " + strBytesLog;
        }

        public void CheckAlarm(byte[] arrData, int startAddr)
        {
            if (arrData == null)// || arrData.Length == 0 || arrData.Length != ClientProvider.RequestLength * ClientProvider.RegisterLength)
                return;

            Dictionary<int, TagInfo> dicTagInfos = null;

            if (m_sensorTagInfos2.TryGetValue(startAddr, out dicTagInfos) == false)
                return;

            int len = arrData.Length;
            byte[] bytes = new byte[ClientProvider.RegisterLength];

            for (int i=0;i<len;i+=2)
            {
                for (int j = i; j < i + ClientProvider.RegisterLength; j++)
                {
                    bytes[j - i] = arrData[j];
                }

                Array.Reverse(bytes);
                UInt16 sensorData = BitConverter.ToUInt16(bytes);

                if (sensorData != 0)
                {
                    TagInfo tagInfo;

                    if (dicTagInfos.TryGetValue(i, out tagInfo))
                    {
                        string strLog = string.Format("Sensor Event : TagInfoID({0}), TagNo({1}), MapAddr({2}), Data({3})", tagInfo.ID, tagInfo.TagNo, tagInfo.Description, sensorData);
                        WriteLog(strLog);
                    }
                }
            }

            /*byte[] arr30999 = new byte[ClientProvider.RegisterLength];
            byte[] arr31000 = new byte[ClientProvider.RegisterLength];
            byte[] arr31001 = new byte[ClientProvider.RegisterLength];
            byte[] arr31002 = new byte[ClientProvider.RegisterLength];
            byte[] arr31003 = new byte[ClientProvider.RegisterLength];

            Array.Copy(arrData, 0, arr30999, 0, ClientProvider.RegisterLength);
            Array.Copy(arrData, 2, arr31000, 0, ClientProvider.RegisterLength);
            Array.Copy(arrData, 4, arr31001, 0, ClientProvider.RegisterLength);
            Array.Copy(arrData, 6, arr31002, 0, ClientProvider.RegisterLength);
            Array.Copy(arrData, 8, arr31003, 0, ClientProvider.RegisterLength);

            Array.Reverse(arr30999);
            Array.Reverse(arr31000);
            Array.Reverse(arr31001);
            Array.Reverse(arr31002);
            Array.Reverse(arr31003);

            BitArray bit30999 = new BitArray(arr30999);
            BitArray bit31000 = new BitArray(arr31000);
            BitArray bit31001 = new BitArray(arr31001);
            BitArray bit31002 = new BitArray(arr31002);
            BitArray bit31003 = new BitArray(arr31003);

            bool b31000_2 = bit31000[2];
            bool b31000_3 = bit31000[3];

            bool b31002_10 = bit31002[10];
            bool b31002_11 = bit31002[11];
            bool b31002_12 = bit31002[12];
            bool b31002_13 = bit31002[13];
            bool b31002_14 = bit31002[14];
            bool b31002_15 = bit31002[15];

            bool b31003_1 = bit31003[1];
            bool b31003_2 = bit31003[2];
            bool b31003_3 = bit31003[3];

            WriteLog($"집수정 수신 데이터: " +
                    $"{(b31000_2 ? "우수조고수위경보: " + b31000_2 + ", " : "")}" +
                    $"{(b31000_3 ? "우수조저수위경보: " + b31000_3 + ", " : "")}" +
                    $"{(b31002_10 ? "배수펌프1_고수위경보_기계실_P111A: " + b31002_10 + ", " : "")}" +
                    $"{(b31002_11 ? "배수펌프2_고수위경보_기계실_P111A: " + b31002_11 + ", " : "")}" +
                    $"{(b31002_12 ? "DDC_본기계M1_DI_45: " + b31002_12 + ", " : "")}" +
                    $"{(b31002_13 ? "배수펌프3_고수위경보_기계실오픈_P112A: " + b31002_13 + ", " : "")}" +
                    $"{(b31002_14 ? "배수펌프4_고수위경보_저수조_P111B: " + b31002_14 + ", " : "")}" +
                    $"{(b31002_15 ? "배수펌프5_고수위경보_기계실_P114B: " + b31002_15 + ", " : "")}" +
                    $"{(b31003_1 ? "배수펌프6_고수위경보_기계실오픈_P112B: " + b31003_1 + ", " : "")}" +
                    $"{(b31003_2 ? "배수펌프7_고수위경보_발전기오픈_P112C: " + b31003_2 + ", " : "")}" +
                    $"{(b31003_3 ? "배수펌프8_고수위경보_유류탱크오픈_P112D: " + b31003_3 : "")}", LogTypes.Info);

            int nAlarmCnt = 0;

            if (b31000_2)
                nAlarmCnt++;
            if (b31000_3)
                nAlarmCnt++;
            if (b31002_10)
                nAlarmCnt++;
            if (b31002_11)
                nAlarmCnt++;
            if (b31002_12)
                nAlarmCnt++;
            if (b31002_13)
                nAlarmCnt++;
            if (b31002_14)
                nAlarmCnt++;
            if (b31002_15)
                nAlarmCnt++;
            if (b31003_1)
                nAlarmCnt++;
            if (b31003_2)
                nAlarmCnt++;
            if (b31003_3)
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
            }*/
        }

        public void WriteLog(string strLog, LogTypes type = LogTypes.Info)
        {
            if (this.Logger != null)
                this.Logger.Write(type, ServerType, m_nServerSeqNo, strLog);
            else
                Logger.Instance.Write(type, ServerType, m_nServerSeqNo, strLog);
        }

        public int GetStartAddress()
        {
            if (m_nCurrentGroupIndex < 0 || m_nCurrentGroupIndex >= m_nGroupCount)
            {
                m_nCurrentGroupIndex = 0;
                return -1;
            }

            Dictionary<int, TagInfo> dicSensorTagInfos = m_sensorTagInfos[m_nCurrentGroupIndex++];

            if (m_nCurrentGroupIndex >= m_nGroupCount)
                m_nCurrentGroupIndex = -1;

            TagInfo firstTag;

            if (dicSensorTagInfos.TryGetValue(0, out firstTag) == false)
                return -1;

            return firstTag.TagNo;
        }
    }
}
