using dnsCommunicateSopServer;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using IntegrationServer.Datas;
using IntegrationServer.Managers;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using static AgentFactory.BLL.ServerType;

namespace IntegrationServer.Servers.UPS.GG
{
    public class UpsGGManager : IServer
    {
        public static string Community = "public";

        public static string UpsSmartBatteryCapacity3 = "1.3.6.1.4.1.935.1.1.1.8.1.2.0";
        public static string UpsSmartInputLineVoltageR = "1.3.6.1.4.1.935.1.1.1.8.2.2.0";
        public static string UpsSmartInputLineVoltageS = "1.3.6.1.4.1.935.1.1.1.8.2.3.0";
        public static string UpsSmartInputLineVoltageT = "1.3.6.1.4.1.935.1.1.1.8.2.4.0";

        public static string UpsSmartInputState = "1.3.6.1.4.1.935.1.1.1.8.2.4.0";

        private string IP_100kva_1 = "192.168.26.183";
        private string IP_100kva_2 = "192.168.26.184";
        private string IP_100kva_3 = "192.168.26.185";
        private string IP_200kva = "192.168.26.186";
        private string IP_500kva_1 = "192.168.26.181";
        private string IP_500kva_2 = "192.168.26.182";

        //UniqueKey
        private static string UniqueKey_BLACKOUT = "UPS_BLACKOUT";
        private static string UniqueKey_100kva1 = "UPS_100kva1";
        private static string UniqueKey_100kva2 = "UPS_100kva2";
        private static string UniqueKey_100kva3 = "UPS_100kva3";
        private static string UniqueKey_200kva = "UPS_200kva";
        private static string UniqueKey_500kva1 = "UPS_500kva1";
        private static string UniqueKey_500kva2 = "UPS_500kva2";

        private static int BLACKOUT_Value = 500;    // 실제 V 값의 10배

        private static int Battery_Serious = 20;
        private static int Battery_Alert = 50;
        private static int Battery_Caution = 70;

        private static int BLACKOUT_STATE = 3;
        private static int BLACKOUT_BYPASS = 6;

        private int? m_nBlackoutID = null;

        Dictionary<string, UpsSensor> m_dicUpsSensors = new Dictionary<string, UpsSensor>();

        private int m_nServerSeqNo = -1;
        public int ServerSeqNo { get { return m_nServerSeqNo; } }

        private int m_nSiteID = -1;
        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }

        public ServerTypes ServerType { get { return ServerTypes.UPS_GG; } }

        private string m_strServerAlias = "";
        public string ServerAlias { get { return m_strServerAlias; } }

        public bool IsConnected
        {
            get { return m_runThread; }
        }

        public Logger Logger { get; set; }
        private SopQueryManager m_sopQueryMgr_Blackout = null;
        private SopQueryManager m_sopQueryMgr_Battery = null;

        private ServerManager m_serverManager = null;
        public ServerManager GetServerManager()
        {
            return m_serverManager;
        }

        public bool Use { get; set; }

        private DataManager m_dataManager = null;

        private bool m_runThread = false;
        private Thread m_Thread = null;

        private int m_nThreadDeley = 1000 * 30;

        public UpsGGManager(ServerManager serverManager, DataManager dataManager, string strSOPWebServerURL, int nServerSeqNo, int nSiteID, string strServerAlias, bool bUse)
        {
            m_serverManager = serverManager;
            m_dataManager = (DataManager)dataManager.Clone();
            m_sopQueryMgr_Blackout = new SopQueryManager(strSOPWebServerURL + "/api/BlackOutSensor");
            m_sopQueryMgr_Battery = new SopQueryManager(strSOPWebServerURL + "/api/BatterySensor");

            m_nServerSeqNo = nServerSeqNo;
            m_nSiteID = nSiteID;

            m_strServerAlias = strServerAlias;

            this.Use = bUse;

            Init();
        }
        
        private void Init()
        {   // 해당 센서 ID 불러오기
            string strErrorMessage;
            string strSQL = $"Select {Nipa.Model.Sdms.Sensor.ETC.Fields.ID}, {Nipa.Model.Sdms.Sensor.ETC.Fields.UniqueKey} from {Nipa.Model.Sdms.Sensor.ETC.TableName} where {Nipa.Model.Sdms.Sensor.ETC.Fields.UniqueKey} in ('{UniqueKey_BLACKOUT}', '{UniqueKey_100kva1}', '{UniqueKey_100kva2}', '{UniqueKey_100kva3}', '{UniqueKey_200kva}', '{UniqueKey_500kva1}', '{UniqueKey_500kva2}')";
            IEnumerable<dynamic> datas = m_dataManager.GetSelect().Select(strSQL, out strErrorMessage);
            if (datas == null)
                return;
            
            foreach (var data in datas)
            {
                if (data.ID != null && data.ID is int &&
                    data.UniqueKey != null && data.UniqueKey is string)
                {
                    string strUniqueKey = (string)data.UniqueKey;

                    if (strUniqueKey == UniqueKey_BLACKOUT)
                    {
                        //m_dicUpsSensors[UniqueKey_BLACKOUT] = new UpsSensor(data.ID, UniqueKey_BLACKOUT);
                        m_nBlackoutID = data.ID;
                    }
                    else if (strUniqueKey == UniqueKey_100kva1)
                        m_dicUpsSensors[UniqueKey_100kva1] = new UpsSensor(data.ID, UniqueKey_100kva1);
                    else if (strUniqueKey == UniqueKey_100kva2)
                        m_dicUpsSensors[UniqueKey_100kva2] = new UpsSensor(data.ID, UniqueKey_100kva2);
                    else if (strUniqueKey == UniqueKey_100kva3)
                        m_dicUpsSensors[UniqueKey_100kva3] = new UpsSensor(data.ID, UniqueKey_100kva3);
                    else if (strUniqueKey == UniqueKey_200kva)
                        m_dicUpsSensors[UniqueKey_200kva] = new UpsSensor(data.ID, UniqueKey_200kva);
                    else if (strUniqueKey == UniqueKey_500kva1)
                        m_dicUpsSensors[UniqueKey_500kva1] = new UpsSensor(data.ID, UniqueKey_500kva1);
                    else if (strUniqueKey == UniqueKey_500kva2)
                        m_dicUpsSensors[UniqueKey_500kva2] = new UpsSensor(data.ID, UniqueKey_500kva2);
                }
            }
        }

        public void Start()
        {
            if (m_runThread)
                return;

            m_runThread = true;

            m_Thread = new Thread(new ThreadStart(RequestThread));
            m_Thread.Start();
        }

        public void Stop()
        {
            m_runThread = false;

            //if (m_Thread != null && m_Thread.ThreadState != ThreadState.Stopped)
            //    m_Thread.Abort();
        }

        private void RequestThread()
        {
            //bool bIsAlarmBLACKOUT = false;
            int nBlackoutDepth = (int)AlarmDepths.None;

            int i = 0;

            while (m_runThread)
            {
                string strErrorMessage;

                try
                {
                    string strValue_100kva_1 = GetSNMP(IP_100kva_1, Community, UpsSmartBatteryCapacity3, out strErrorMessage);
                    if (strValue_100kva_1 == null || Int32.TryParse(strValue_100kva_1, out int nValue_100kva_1) == false)
                    {
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "100kva_1 UpsSmartBatteryCapacity3 Error: " + strErrorMessage);
                        Thread.Sleep(m_nThreadDeley);
                        continue;
                    }
                    else                    
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "GetSNMP 100kva_1 UpsSmartBatteryCapacity3: " + strValue_100kva_1);                    
                    string strUpsSmartInputLineVoltageR_100kva_1 = GetSNMP(IP_100kva_1, Community, UpsSmartInputLineVoltageR, out strErrorMessage);
                    if (strUpsSmartInputLineVoltageR_100kva_1 == null || Int32.TryParse(strUpsSmartInputLineVoltageR_100kva_1, out int nUpsSmartInputLineVoltageR_100kva_1) == false)
                    {
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "100kva_1 UpsSmartInputLineVoltageR Error: " + strErrorMessage);
                        Thread.Sleep(m_nThreadDeley);
                        continue;
                    }
                    else
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "GetSNMP 100kva_1 UpsSmartInputLineVoltageR: " + strUpsSmartInputLineVoltageR_100kva_1);
                    string strUpsSmartInputLineVoltageS_100kva_1 = GetSNMP(IP_100kva_1, Community, UpsSmartInputLineVoltageS, out strErrorMessage);
                    if (strUpsSmartInputLineVoltageS_100kva_1 == null || Int32.TryParse(strUpsSmartInputLineVoltageS_100kva_1, out int nUpsSmartInputLineVoltageS_100kva_1) == false)
                    {
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "100kva_1 UpsSmartInputLineVoltageS Error: " + strErrorMessage);
                        Thread.Sleep(m_nThreadDeley);
                        continue;
                    }
                    else
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "GetSNMP 100kva_1 UpsSmartInputLineVoltageS: " + strUpsSmartInputLineVoltageS_100kva_1);
                    string strUpsSmartInputLineVoltageT_100kva_1 = GetSNMP(IP_100kva_1, Community, UpsSmartInputLineVoltageT, out strErrorMessage);
                    if (strUpsSmartInputLineVoltageT_100kva_1 == null || Int32.TryParse(strUpsSmartInputLineVoltageT_100kva_1, out int nUpsSmartInputLineVoltageT_100kva_1) == false)
                    {
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "100kva_1 UpsSmartInputLineVoltageT Error: " + strErrorMessage);
                        Thread.Sleep(m_nThreadDeley);
                        continue;
                    }
                    else
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "GetSNMP 100kva_1 UpsSmartInputLineVoltageT: " + nUpsSmartInputLineVoltageT_100kva_1);
                    // 동작 상태
                    string strState_100kva_1 = GetSNMP(IP_100kva_1, Community, UpsSmartInputState, out strErrorMessage);
                    if (strState_100kva_1 == null || Int32.TryParse(strState_100kva_1, out int nState_100kva_1) == false)
                    {
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "100kva_1 UpsSmartInputState Error: " + strErrorMessage);
                        Thread.Sleep(m_nThreadDeley);
                        continue;
                    }
                    else
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "GetSNMP 100kva_1 UpsSmartInputState: " + strState_100kva_1);





                    string strValue_100kva_2 = GetSNMP(IP_100kva_2, Community, UpsSmartBatteryCapacity3, out strErrorMessage);
                    if (strValue_100kva_2 == null || Int32.TryParse(strValue_100kva_2, out int nValue_100kva_2) == false)
                    {
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "100kva_2 UpsSmartBatteryCapacity3 Error: " + strErrorMessage);
                        Thread.Sleep(m_nThreadDeley);
                        continue;
                    }
                    else
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "GetSNMP 100kva_2 UpsSmartBatteryCapacity3: " + strValue_100kva_2);
                    string strUpsSmartInputLineVoltageR_100kva_2 = GetSNMP(IP_100kva_2, Community, UpsSmartInputLineVoltageR, out strErrorMessage);
                    if (strUpsSmartInputLineVoltageR_100kva_2 == null || Int32.TryParse(strUpsSmartInputLineVoltageR_100kva_2, out int nUpsSmartInputLineVoltageR_100kva_2) == false)
                    {
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "100kva_2 UpsSmartInputLineVoltageR Error: " + strErrorMessage);
                        Thread.Sleep(m_nThreadDeley);
                        continue;
                    }
                    else
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "GetSNMP 100kva_2 UpsSmartInputLineVoltageR: " + nUpsSmartInputLineVoltageR_100kva_2);
                    string strUpsSmartInputLineVoltageS_100kva_2 = GetSNMP(IP_100kva_2, Community, UpsSmartInputLineVoltageS, out strErrorMessage);
                    if (strUpsSmartInputLineVoltageS_100kva_2 == null || Int32.TryParse(strUpsSmartInputLineVoltageS_100kva_2, out int nUpsSmartInputLineVoltageS_100kva_2) == false)
                    {
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "100kva_2 UpsSmartInputLineVoltageS Error: " + strErrorMessage);
                        Thread.Sleep(m_nThreadDeley);
                        continue;
                    }
                    else
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "GetSNMP 100kva_2 UpsSmartInputLineVoltageS: " + nUpsSmartInputLineVoltageS_100kva_2);
                    string strUpsSmartInputLineVoltageT_100kva_2 = GetSNMP(IP_100kva_2, Community, UpsSmartInputLineVoltageT, out strErrorMessage);
                    if (strUpsSmartInputLineVoltageT_100kva_2 == null || Int32.TryParse(strUpsSmartInputLineVoltageT_100kva_2, out int nUpsSmartInputLineVoltageT_100kva_2) == false)
                    {
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "100kva_2 UpsSmartInputLineVoltageT Error: " + strErrorMessage);
                        Thread.Sleep(m_nThreadDeley);
                        continue;
                    }
                    else
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "GetSNMP 100kva_2 UpsSmartInputLineVoltageT: " + nUpsSmartInputLineVoltageT_100kva_2);

                    // 동작 상태
                    string strState_100kva_2 = GetSNMP(IP_100kva_2, Community, UpsSmartInputState, out strErrorMessage);
                    if (strState_100kva_2 == null || Int32.TryParse(strState_100kva_2, out int nState_100kva_2) == false)
                    {
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "100kva_2 UpsSmartInputState Error: " + strErrorMessage);
                        Thread.Sleep(m_nThreadDeley);
                        continue;
                    }
                    else
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "GetSNMP 100kva_2 UpsSmartInputState: " + strState_100kva_2);





                    string strValue_100kva_3 = GetSNMP(IP_100kva_3, Community, UpsSmartBatteryCapacity3, out strErrorMessage);
                    if (strValue_100kva_3 == null || Int32.TryParse(strValue_100kva_3, out int nValue_100kva_3) == false)
                    {
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "100kva_3 UpsSmartBatteryCapacity3 Error: " + strErrorMessage);
                        Thread.Sleep(m_nThreadDeley);
                        continue;
                    }
                    else
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "GetSNMP 100kva_3 UpsSmartBatteryCapacity3: " + strValue_100kva_3);
                    string strUpsSmartInputLineVoltageR_100kva_3 = GetSNMP(IP_100kva_3, Community, UpsSmartInputLineVoltageR, out strErrorMessage);
                    if (strUpsSmartInputLineVoltageR_100kva_3 == null || Int32.TryParse(strUpsSmartInputLineVoltageR_100kva_3, out int nUpsSmartInputLineVoltageR_100kva_3) == false)
                    {
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "100kva_3 UpsSmartInputLineVoltageR Error: " + strErrorMessage);
                        Thread.Sleep(m_nThreadDeley);
                        continue;
                    }
                    else
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "GetSNMP 100kva_3 UpsSmartInputLineVoltageR: " + strUpsSmartInputLineVoltageR_100kva_3);
                    string strUpsSmartInputLineVoltageS_100kva_3 = GetSNMP(IP_100kva_3, Community, UpsSmartInputLineVoltageS, out strErrorMessage);
                    if (strUpsSmartInputLineVoltageS_100kva_3 == null || Int32.TryParse(strUpsSmartInputLineVoltageS_100kva_3, out int nUpsSmartInputLineVoltageS_100kva_3) == false)
                    {
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "100kva_3 UpsSmartInputLineVoltageS Error: " + strErrorMessage);
                        Thread.Sleep(m_nThreadDeley);
                        continue;
                    }
                    else
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "GetSNMP 100kva_3 UpsSmartInputLineVoltageS: " + strUpsSmartInputLineVoltageS_100kva_3);
                    string strUpsSmartInputLineVoltageT_100kva_3 = GetSNMP(IP_100kva_3, Community, UpsSmartInputLineVoltageT, out strErrorMessage);
                    if (strUpsSmartInputLineVoltageT_100kva_3 == null || Int32.TryParse(strUpsSmartInputLineVoltageT_100kva_3, out int nUpsSmartInputLineVoltageT_100kva_3) == false)
                    {
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "100kva_3 UpsSmartInputLineVoltageT Error: " + strErrorMessage);
                        Thread.Sleep(m_nThreadDeley);
                        continue;
                    }
                    else
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "GetSNMP 100kva_3 UpsSmartInputLineVoltageT: " + strUpsSmartInputLineVoltageT_100kva_3);
                    // 동작 상태
                    string strState_100kva_3 = GetSNMP(IP_100kva_3, Community, UpsSmartInputState, out strErrorMessage);
                    if (strState_100kva_3 == null || Int32.TryParse(strState_100kva_3, out int nState_100kva_3) == false)
                    {
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "100kva_3 UpsSmartInputState Error: " + strErrorMessage);
                        Thread.Sleep(m_nThreadDeley);
                        continue;
                    }
                    else
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "GetSNMP 100kva_3 UpsSmartInputState: " + strState_100kva_3);




                    string strValue_200kva = GetSNMP(IP_200kva, Community, UpsSmartBatteryCapacity3, out strErrorMessage);
                    if (strValue_200kva == null || Int32.TryParse(strValue_200kva, out int nValue_200kva) == false)
                    {
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "200kva UpsSmartBatteryCapacity3 Error: " + strErrorMessage);
                        Thread.Sleep(m_nThreadDeley);
                        continue;
                    }
                    else
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "GetSNMP 200kva UpsSmartBatteryCapacity3: " + strValue_200kva);
                    string strUpsSmartInputLineVoltageR_200kva = GetSNMP(IP_200kva, Community, UpsSmartInputLineVoltageR, out strErrorMessage);
                    if (strUpsSmartInputLineVoltageR_200kva == null || Int32.TryParse(strUpsSmartInputLineVoltageR_200kva, out int nUpsSmartInputLineVoltageR_200kva) == false)
                    {
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "200kva UpsSmartInputLineVoltageR Error: " + strErrorMessage);
                        Thread.Sleep(m_nThreadDeley);
                        continue;
                    }
                    else
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "GetSNMP 200kva UpsSmartInputLineVoltageR: " + strUpsSmartInputLineVoltageR_200kva);
                    string strUpsSmartInputLineVoltageS_200kva = GetSNMP(IP_200kva, Community, UpsSmartInputLineVoltageS, out strErrorMessage);
                    if (strUpsSmartInputLineVoltageS_200kva == null || Int32.TryParse(strUpsSmartInputLineVoltageS_200kva, out int nUpsSmartInputLineVoltageS_200kva) == false)
                    {
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "200kva UpsSmartInputLineVoltageS Error: " + strErrorMessage);
                        Thread.Sleep(m_nThreadDeley);
                        continue;
                    }
                    else
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "GetSNMP 200kva UpsSmartInputLineVoltageS: " + strUpsSmartInputLineVoltageS_200kva);
                    string strUpsSmartInputLineVoltageT_200kva = GetSNMP(IP_200kva, Community, UpsSmartInputLineVoltageT, out strErrorMessage);
                    if (strUpsSmartInputLineVoltageT_200kva == null || Int32.TryParse(strUpsSmartInputLineVoltageT_200kva, out int nUpsSmartInputLineVoltageT_200kva) == false)
                    {
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "200kva UpsSmartInputLineVoltageT Error: " + strErrorMessage);
                        Thread.Sleep(m_nThreadDeley);
                        continue;
                    }
                    else
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "GetSNMP 200kva UpsSmartInputLineVoltageT: " + strUpsSmartInputLineVoltageT_200kva);
                    // 동작 상태
                    string strState_200kva = GetSNMP(IP_200kva, Community, UpsSmartInputState, out strErrorMessage);
                    if (strState_200kva == null || Int32.TryParse(strState_200kva, out int nState_200kva) == false)
                    {
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "200kva UpsSmartInputState Error: " + strErrorMessage);
                        Thread.Sleep(m_nThreadDeley);
                        continue;
                    }
                    else
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "GetSNMP 200kva UpsSmartInputState: " + strState_200kva);








                    string strValue_500kva_1 = GetSNMP(IP_500kva_1, Community, UpsSmartBatteryCapacity3, out strErrorMessage);
                    if (strValue_500kva_1 == null || Int32.TryParse(strValue_500kva_1, out int nValue_500kva_1) == false)
                    {
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "500kva_1 UpsSmartBatteryCapacity3 Error: " + strErrorMessage);
                        Thread.Sleep(m_nThreadDeley);
                        continue;
                    }
                    else
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "GetSNMP 500kva_1 UpsSmartBatteryCapacity3: " + strValue_500kva_1);
                    string strUpsSmartInputLineVoltageR_500kva_1 = GetSNMP(IP_500kva_1, Community, UpsSmartInputLineVoltageR, out strErrorMessage);
                    if (strUpsSmartInputLineVoltageR_500kva_1 == null || Int32.TryParse(strUpsSmartInputLineVoltageR_500kva_1, out int nUpsSmartInputLineVoltageR_500kva_1) == false)
                    {
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "500kva_1 UpsSmartInputLineVoltageR Error: " + strErrorMessage);
                        Thread.Sleep(m_nThreadDeley);
                        continue;
                    }
                    else
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "GetSNMP 500kva_1 UpsSmartInputLineVoltageR: " + strUpsSmartInputLineVoltageR_500kva_1);
                    string strUpsSmartInputLineVoltageS_500kva_1 = GetSNMP(IP_500kva_1, Community, UpsSmartInputLineVoltageS, out strErrorMessage);
                    if (strUpsSmartInputLineVoltageS_500kva_1 == null || Int32.TryParse(strUpsSmartInputLineVoltageS_500kva_1, out int nUpsSmartInputLineVoltageS_500kva_1) == false)
                    {
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "500kva_1 UpsSmartInputLineVoltageS Error: " + strErrorMessage);
                        Thread.Sleep(m_nThreadDeley);
                        continue;
                    }
                    else
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "GetSNMP 500kva_1 UpsSmartInputLineVoltageS: " + strUpsSmartInputLineVoltageS_500kva_1);
                    string strUpsSmartInputLineVoltageT_500kva_1 = GetSNMP(IP_500kva_1, Community, UpsSmartInputLineVoltageT, out strErrorMessage);
                    if (strUpsSmartInputLineVoltageT_500kva_1 == null || Int32.TryParse(strUpsSmartInputLineVoltageT_500kva_1, out int nUpsSmartInputLineVoltageT_500kva_1) == false)
                    {
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "500kva_1 UpsSmartInputLineVoltageT Error: " + strErrorMessage);
                        Thread.Sleep(m_nThreadDeley);
                        continue;
                    }
                    else
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "GetSNMP 500kva_1 UpsSmartInputLineVoltageT: " + strUpsSmartInputLineVoltageT_500kva_1);
                    // 동작 상태
                    string strState_500kva_1 = GetSNMP(IP_500kva_1, Community, UpsSmartInputState, out strErrorMessage);
                    if (strState_500kva_1 == null || Int32.TryParse(strState_500kva_1, out int nState_500kva_1) == false)
                    {
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "500kva_1 UpsSmartInputState Error: " + strErrorMessage);
                        Thread.Sleep(m_nThreadDeley);
                        continue;
                    }
                    else
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "GetSNMP 500kva_1 UpsSmartInputState: " + strState_500kva_1);








                    string strValue_500kva_2 = GetSNMP(IP_500kva_2, Community, UpsSmartBatteryCapacity3, out strErrorMessage);
                    if (strValue_500kva_2 == null || Int32.TryParse(strValue_500kva_2, out int nValue_500kva_2) == false)
                    {
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "500kva_2 UpsSmartBatteryCapacity3 Error: " + strErrorMessage);
                        Thread.Sleep(m_nThreadDeley);
                        continue;
                    }
                    else
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "GetSNMP 500kva_1 UpsSmartBatteryCapacity3: " + strValue_500kva_2);
                    string strUpsSmartInputLineVoltageR_500kva_2 = GetSNMP(IP_500kva_2, Community, UpsSmartInputLineVoltageR, out strErrorMessage);
                    if (strUpsSmartInputLineVoltageR_500kva_2 == null || Int32.TryParse(strUpsSmartInputLineVoltageR_500kva_2, out int nUpsSmartInputLineVoltageR_500kva_2) == false)
                    {
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "500kva_2 UpsSmartInputLineVoltageR Error: " + strErrorMessage);
                        Thread.Sleep(m_nThreadDeley);
                        continue;
                    }
                    else
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "GetSNMP 500kva_1 UpsSmartInputLineVoltageR: " + strUpsSmartInputLineVoltageR_500kva_2);
                    string strUpsSmartInputLineVoltageS_500kva_2 = GetSNMP(IP_500kva_2, Community, UpsSmartInputLineVoltageS, out strErrorMessage);
                    if (strUpsSmartInputLineVoltageS_500kva_2 == null || Int32.TryParse(strUpsSmartInputLineVoltageS_500kva_2, out int nUpsSmartInputLineVoltageS_500kva_2) == false)
                    {
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "500kva_2 UpsSmartInputLineVoltageS Error: " + strErrorMessage);
                        Thread.Sleep(m_nThreadDeley);
                        continue;
                    }
                    else
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "GetSNMP 500kva_1 UpsSmartInputLineVoltageS: " + strUpsSmartInputLineVoltageS_500kva_2);
                    string strUpsSmartInputLineVoltageT_500kva_2 = GetSNMP(IP_500kva_2, Community, UpsSmartInputLineVoltageT, out strErrorMessage);
                    if (strUpsSmartInputLineVoltageT_500kva_2 == null || Int32.TryParse(strUpsSmartInputLineVoltageT_500kva_2, out int nUpsSmartInputLineVoltageT_500kva_2) == false)
                    {
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "500kva_2 UpsSmartInputLineVoltageT Error: " + strErrorMessage);
                        Thread.Sleep(m_nThreadDeley);
                        continue;
                    }
                    else
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "GetSNMP 500kva_1 UpsSmartInputLineVoltageT: " + strUpsSmartInputLineVoltageT_500kva_2);
                    // 동작 상태
                    string strState_500kva_2 = GetSNMP(IP_500kva_2, Community, UpsSmartInputState, out strErrorMessage);
                    if (strState_500kva_2 == null || Int32.TryParse(strState_500kva_2, out int nState_500kva_2) == false)
                    {
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "500kva_2 UpsSmartInputState Error: " + strErrorMessage);
                        Thread.Sleep(m_nThreadDeley);
                        continue;
                    }
                    else
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "GetSNMP 500kva_1 UpsSmartInputState: " + strState_500kva_2);






                    // UPS 알람 처리
                    // 수치에 따른 단계 파악
                    // 현 상태와 비교 후 알람 발생 및 해제
                    // 최대 알람값 구하기
                    int nMaxDepth = (int)AlarmDepths.Interest;

                    if (SendBatteryAlarm(nValue_100kva_1, UniqueKey_100kva1, ref nMaxDepth, out strErrorMessage) == false)
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "SendBatteryAlarm 100kva_1 Error: " + strErrorMessage);
                    if (SendBatteryAlarm(nValue_100kva_2, UniqueKey_100kva2, ref nMaxDepth, out strErrorMessage) == false)
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "SendBatteryAlarm 100kva_2 Error: " + strErrorMessage);
                    if (SendBatteryAlarm(nValue_100kva_3, UniqueKey_100kva3, ref nMaxDepth, out strErrorMessage) == false)
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "SendBatteryAlarm 100kva_3 Error: " + strErrorMessage);

                    if (SendBatteryAlarm(nValue_200kva, UniqueKey_200kva, ref nMaxDepth, out strErrorMessage) == false)
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "SendBatteryAlarm 200kva Error: " + strErrorMessage);

                    if (SendBatteryAlarm(nValue_500kva_1, UniqueKey_500kva1, ref nMaxDepth, out strErrorMessage) == false)
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "SendBatteryAlarm 500kva_1 Error: " + strErrorMessage);
                    if (SendBatteryAlarm(nValue_500kva_2, UniqueKey_500kva2, ref nMaxDepth, out strErrorMessage) == false)
                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "SendBatteryAlarm 500kva_2 Error: " + strErrorMessage);







                    // 정전 알람 처리
                    // 배터리 전압으로 구분하지 않고, UPS 동작 상태(정전발생, 바이패스 동작)가 2개 이상일 때, 정전으로 판단 수정 - 
                    int nBlackoutCnt = 0;

                    if (nState_100kva_1 == BLACKOUT_STATE || nState_100kva_1 == BLACKOUT_BYPASS)
                        nBlackoutCnt++;
                    if (nState_100kva_2 == BLACKOUT_STATE || nState_100kva_2 == BLACKOUT_BYPASS)
                        nBlackoutCnt++;
                    if (nState_100kva_3 == BLACKOUT_STATE || nState_100kva_3 == BLACKOUT_BYPASS)
                        nBlackoutCnt++;
                    if (nState_200kva == BLACKOUT_STATE || nState_200kva == BLACKOUT_BYPASS)
                        nBlackoutCnt++;
                    if (nState_500kva_1 == BLACKOUT_STATE || nState_500kva_1 == BLACKOUT_BYPASS)
                        nBlackoutCnt++;
                    if (nState_500kva_2 == BLACKOUT_STATE || nState_500kva_2 == BLACKOUT_BYPASS)
                        nBlackoutCnt++;

                    //if (nUpsSmartInputLineVoltageR_100kva_1 <= BLACKOUT_Value && nUpsSmartInputLineVoltageS_100kva_1 <= BLACKOUT_Value && nUpsSmartInputLineVoltageT_100kva_1 <= BLACKOUT_Value &&
                    //    nUpsSmartInputLineVoltageR_100kva_2 <= BLACKOUT_Value && nUpsSmartInputLineVoltageS_100kva_2 <= BLACKOUT_Value && nUpsSmartInputLineVoltageT_100kva_2 <= BLACKOUT_Value &&
                    //    nUpsSmartInputLineVoltageR_100kva_3 <= BLACKOUT_Value && nUpsSmartInputLineVoltageS_100kva_1 <= BLACKOUT_Value && nUpsSmartInputLineVoltageT_100kva_3 <= BLACKOUT_Value &&
                    //    nUpsSmartInputLineVoltageR_200kva <= BLACKOUT_Value && nUpsSmartInputLineVoltageS_200kva <= BLACKOUT_Value && nUpsSmartInputLineVoltageT_200kva <= BLACKOUT_Value &&
                    //    nUpsSmartInputLineVoltageR_500kva_1 <= BLACKOUT_Value && nUpsSmartInputLineVoltageS_500kva_1 <= BLACKOUT_Value && nUpsSmartInputLineVoltageT_500kva_1 <= BLACKOUT_Value &&
                    //    nUpsSmartInputLineVoltageR_500kva_2 <= BLACKOUT_Value && nUpsSmartInputLineVoltageS_500kva_2 <= BLACKOUT_Value && nUpsSmartInputLineVoltageT_500kva_2 <= BLACKOUT_Value)
                    if (nBlackoutCnt >= 2)
                    {   // 기존 정전 알람 단계와 현재 알람 단계가 다르다면 발생
                        if (nMaxDepth == (int)AlarmDepths.None)
                            nMaxDepth = (int)AlarmDepths.Interest;

                        if (nBlackoutDepth != nMaxDepth)
                        {
                            if (m_nBlackoutID.HasValue)
                            {
                                SensorTag sensorTag = SensorManager.Instance.FindSensorByOrgSensorID(m_nServerSeqNo, m_nBlackoutID.Value);
                                if (sensorTag == null)
                                    Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, $"해당 SensorTag 값이 없습니다. ServerSeqNo: {m_nServerSeqNo.ToString()}, SensorID: {m_nBlackoutID.Value.ToString()}");
                                else
                                {
                                    if (SendSensorData(sensorTag, (int)dnsData.Sensor.Facility.FacilityType.BLACKOUT, true, nMaxDepth) == false)
                                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, $"SendSensorData Error (TagID: {sensorTag.ID}, SensorZoneID: {sensorTag.SensorZoneID}, IsAlarm: True)");

                                    // 센서 상태값 업데이트
                                    Dictionary<Nipa.Model.Sdms.Sensor.ETC.Fields, object> dicSets = new Dictionary<Nipa.Model.Sdms.Sensor.ETC.Fields, object>();
                                    dicSets[Nipa.Model.Sdms.Sensor.ETC.Fields.Status] = nMaxDepth;

                                    string strCondition = string.Format("{0} = {1}", Nipa.Model.Sdms.Sensor.ETC.Fields.ID, m_nBlackoutID.Value);

                                    if (m_dataManager.GetUpdate().Update<Nipa.Model.Sdms.Sensor.ETC, Nipa.Model.Sdms.Sensor.ETC.Fields>(dicSets, strCondition, out strErrorMessage) == false)
                                        Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, $"ETC Update Error (ID: {m_nBlackoutID}, Status: {nMaxDepth})");                                    
                                }
                                    
                            }
                            else
                                Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, $"BlackoutID 값이 없습니다. ServerSeqNo: {m_nServerSeqNo.ToString()}");

                            nBlackoutDepth = nMaxDepth;
                        }
                    }
                    else if (nBlackoutDepth != (int)AlarmDepths.None)
                    {   // 정전 알람 해제
                        SensorTag sensorTag = SensorManager.Instance.FindSensorByOrgSensorID(m_nServerSeqNo, m_nBlackoutID.Value);
                        if (sensorTag == null)
                            Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, $"해당 SensorTag 값이 없습니다. ServerSeqNo: {m_nServerSeqNo.ToString()}, SensorID: {m_nBlackoutID.Value.ToString()}");
                        else
                        {
                            if (SendSensorData(sensorTag, (int)dnsData.Sensor.Facility.FacilityType.BLACKOUT, false, (int)AlarmDepths.None) == false)
                                Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, $"SendSensorData Error (TagID: {sensorTag.ID}, SensorZoneID: {sensorTag.SensorZoneID}, IsAlarm: False)");

                            // 센서 상태값 업데이트
                            Dictionary<Nipa.Model.Sdms.Sensor.ETC.Fields, object> dicSets = new Dictionary<Nipa.Model.Sdms.Sensor.ETC.Fields, object>();
                            dicSets[Nipa.Model.Sdms.Sensor.ETC.Fields.Status] = (int)AlarmDepths.None;

                            string strCondition = string.Format("{0} = {1}", Nipa.Model.Sdms.Sensor.ETC.Fields.ID, m_nBlackoutID.Value);

                            if (m_dataManager.GetUpdate().Update<Nipa.Model.Sdms.Sensor.ETC, Nipa.Model.Sdms.Sensor.ETC.Fields>(dicSets, strCondition, out strErrorMessage) == false)
                                Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, $"ETC Update Error (ID: {m_nBlackoutID}, Status: {(int)AlarmDepths.None})");
                        }
                        
                        nBlackoutDepth = (int)AlarmDepths.None;
                    }
                }
                catch (Exception e)
                {
                    Logger.Write(LogTypes.Info, ServerTypes.UPS_GG, m_nServerSeqNo, "RequestThread Error: " + e.Message);
                }               

                Thread.Sleep(m_nThreadDeley);
            }
        }

        private bool SendBatteryAlarm(int nBatteryValue, string strUniqueKey, ref int nMaxDepth, out string strErrorMessage)
        {
            strErrorMessage = null;

            // 현재 알람 단계 구하기
            int nAlarmDepth = CheckBatteryAlarmDepth(nBatteryValue);
            if (nAlarmDepth > nMaxDepth)
                nMaxDepth = nAlarmDepth;

            if (m_dicUpsSensors.ContainsKey(strUniqueKey) == false)
            {
                strErrorMessage = "해당 UniqueKey UPS 센서가 없습니다.: " + strUniqueKey;
                return false;
            }

            UpsSensor sensor = m_dicUpsSensors[strUniqueKey];


            SensorTag sensorTag = SensorManager.Instance.FindSensorByOrgSensorID(m_nServerSeqNo, sensor.ID.Value);
            if (sensorTag == null)
            {
                strErrorMessage = $"해당 SensorTag 값이 없습니다. ServerSeqNo: {m_nServerSeqNo.ToString()}, SensorID: {sensor.ID.Value.ToString()}";
                return false;
            }

            if (sensor.AlarmDepth != nAlarmDepth)
            {
                bool bIsAlarm = true;

                // 알람 해제
                if (nAlarmDepth == (int)AlarmDepths.None)
                    bIsAlarm = false;

                if (m_serverManager.SendSensorData(m_sopQueryMgr_Battery, (int)dnsData.Sensor.Facility.FacilityType.LowBattery, sensorTag.ID, sensorTag.SensorZoneID, bIsAlarm, nAlarmDepth) == false)
                {
                    strErrorMessage = $"SendSensorData Error (TagID: {sensorTag.ID}, SensorZoneID: {sensorTag.SensorZoneID}, IsAlarm: {bIsAlarm.ToString()})";
                    return false;
                }
            }


            // 현재 값 업데이트
            sensor.AlarmDepth = nAlarmDepth;

            Dictionary<Nipa.Model.Sdms.Sensor.ETC.Fields, object> dicSets = new Dictionary<Nipa.Model.Sdms.Sensor.ETC.Fields, object>();
            dicSets[Nipa.Model.Sdms.Sensor.ETC.Fields.CurrentData] = nBatteryValue.ToString();
            dicSets[Nipa.Model.Sdms.Sensor.ETC.Fields.Status] = nAlarmDepth;

            string strCondition = string.Format("{0} = {1}", Nipa.Model.Sdms.Sensor.ETC.Fields.ID, sensor.ID);

            if (m_dataManager.GetUpdate().Update<Nipa.Model.Sdms.Sensor.ETC, Nipa.Model.Sdms.Sensor.ETC.Fields>(dicSets, strCondition, out strErrorMessage) == false)
            {
                strErrorMessage = $"ETC Update Error (ID: {sensor.ID}, CurrentData: {nBatteryValue.ToString()})";
                return false;
            }
            



            return true;
        }

        private int CheckBatteryAlarmDepth(int nBatteryValue)
        {
            int nAlarmDepth = (int)AlarmDepths.None;

            if (nBatteryValue <= Battery_Serious)            
                nAlarmDepth = (int)AlarmDepths.Serious;
            else if (nBatteryValue <= Battery_Alert)
                nAlarmDepth = (int)AlarmDepths.Alert;
            else if (nBatteryValue <= Battery_Caution)
                nAlarmDepth = (int)AlarmDepths.Caution;            

            return nAlarmDepth;
        }

        private string GetSNMP(string strIP, string CommunityName, string strOID, out string strErrorMessage)
        {
            string strResult = null;
            strErrorMessage = null;

            try
            {
                var result = Lextm.SharpSnmpLib.Messaging.Messenger.Get(Lextm.SharpSnmpLib.VersionCode.V1,
                           new System.Net.IPEndPoint(System.Net.IPAddress.Parse(strIP), 161),
                           new Lextm.SharpSnmpLib.OctetString(CommunityName),
                           new List<Lextm.SharpSnmpLib.Variable> { new Lextm.SharpSnmpLib.Variable(new Lextm.SharpSnmpLib.ObjectIdentifier(strOID)) },
                           60000);

                Lextm.SharpSnmpLib.ISnmpData data = result[0].Data;
                strResult = data.ToString();
            }
            catch (Exception e)
            {
                strErrorMessage = e.Message;
                strResult = null;
            }

            return strResult;
        }

        public bool SendSensorData(SensorTag sensorTag, int nfacilityType, bool bIsAlarm, int nAlarmLevel)
        {
            if (nAlarmLevel == (int)AlarmDepths.None)
                return m_serverManager.SendSensorData(m_sopQueryMgr_Blackout, nfacilityType, sensorTag.ID, sensorTag.SensorZoneID, bIsAlarm);
            else
                return m_serverManager.SendSensorData(m_sopQueryMgr_Blackout, nfacilityType, sensorTag.ID, sensorTag.SensorZoneID, bIsAlarm, nAlarmLevel);
        }
    }

    public class UpsSensor
    {
        public int? ID { get; set; }
        public string UniqueKey { get; set; }
        public int AlarmDepth { get; set; }

        public UpsSensor()
        {

        }
        public UpsSensor(int? nID, string strUniqueKey)
        {
            this.ID = nID;
            this.UniqueKey = strUniqueKey;
            this.AlarmDepth = (int)AlarmDepths.None;
        }
    }
}
