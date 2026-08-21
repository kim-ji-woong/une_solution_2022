using Hydrogen.BLL.Models.Data;
using Hydrogen.BLL.Models.Sensor;
using SDMS.Model.Sensor;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Hydrogen.BLL.Models
{
    public class Result
    {
        private bool m_result = false;

        public bool Success
        {
            get { return m_result; }
            set { m_result = value; }
        }
    }

    public class MessageResult : Result
    {
        private string m_strMessage = "";

        public string Message
        {
            get { return m_strMessage; }
            set { m_strMessage = value; }
        }

        public MessageResult()
        {
        }

        public MessageResult(bool success, string strMessage)
        {
            Success = success;
            m_strMessage = strMessage;
        }
    }

    public class ResponseSensorList : MessageResult
    {
        private List<EtcSensor> m_h2Sensors = null;
        private List<EtcSensor> m_tempSensors = null;
        private List<EtcSensor> m_flowSensors = null;
        private List<EtcSensor> m_conductSensors = null;
        private List<EtcSensor> m_gasSensors = null;
        private List<EtcSensor> m_pressureSensors = null;

        private List<EtcSensor> m_h2LowSensors = null;
        private List<EtcSensor> m_o2Sensors = null;
        private List<EtcSensor> m_h2JAGSensors = null;
        private List<EtcSensor> m_o2JAGSensors = null;

        private int m_nTotalCount = 0;

        public List<EtcSensor> H2Sensors
        {
            get { return m_h2Sensors; }
            set { m_h2Sensors = value; }
        }

        public List<EtcSensor> TempSensors
        {
            get { return m_tempSensors; }
            set { m_tempSensors = value; }
        }

        public List<EtcSensor> FlowSensors
        {
            get { return m_flowSensors; }
            set { m_flowSensors = value; }
        }

        public List<EtcSensor> ConductSensors
        {
            get { return m_conductSensors; }
            set { m_conductSensors = value; }
        }

        public List<EtcSensor> GASSensors
        {
            get { return m_gasSensors; }
            set { m_gasSensors = value; }
        }

        public List<EtcSensor> PressureSensors
        {
            get { return m_pressureSensors; }
            set { m_pressureSensors = value; }
        }

        public List<EtcSensor> H2LowSensors
        {
            get { return m_h2LowSensors; }
            set { m_h2LowSensors = value; }
        }
        public List<EtcSensor> O2Sensors
        {
            get { return m_o2Sensors; }
            set { m_o2Sensors = value; }
        }
        public List<EtcSensor> H2JAGSensors
        {
            get { return m_h2JAGSensors; }
            set { m_h2JAGSensors = value; }
        }
        public List<EtcSensor> O2JAGSensors
        {
            get { return m_o2JAGSensors; }
            set { m_o2JAGSensors = value; }
        }
        public int TotalCount
        {
            get { return m_nTotalCount; }
            set { m_nTotalCount = value; }
        }

        public ResponseSensorList()
            : base()
        {
        }

        public ResponseSensorList(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseSensorCount : MessageResult
    {
        // 전체 기타센서 개수
        private int m_nH2ensorCount = 0;
        // 사용할수 없는 기타센서 개수
        private int m_nDisabledH2SensorCount = 0;
        private int m_nTempensorCount = 0;
        private int m_nDisabledTempSensorCount = 0;
        private int m_nFlowensorCount = 0;
        private int m_nDisabledFlowSensorCount = 0;
        private int m_nConductensorCount = 0;
        private int m_nDisabledConductSensorCount = 0;
        private int m_nGASensorCount = 0;
        private int m_nDisabledGASSensorCount = 0;
        private int m_nPressureensorCount = 0;
        private int m_nDisabledPressureSensorCount = 0;

        private int m_nH2LowSensorCount = 0;
        private int m_nDisabledH2LowSensorCount = 0;
        private int m_nO2SensorCount = 0;
        private int m_nDisabledO2SensorCount = 0;

        private int m_nH2JAGSensorCount = 0;
        private int m_nDisabledH2JAGSensorCount = 0;
        private int m_nO2JAGSensorCount = 0;
        private int m_nDisabledO2JAGSensorCount = 0;

        // 전체 기타센서 개수
        public int H2SensorCount
        {
            get { return m_nH2ensorCount; }
            set { m_nH2ensorCount = value; }
        }
        // 사용할수 없는 기타센서 개수
        public int DisabledH2SensorCount
        {
            get { return m_nDisabledH2SensorCount; }
            set { m_nDisabledH2SensorCount = value; }
        }

        public int TempSensorCount
        {
            get { return m_nTempensorCount; }
            set { m_nTempensorCount = value; }
        }
        public int DisabledTempSensorCount
        {
            get { return m_nDisabledTempSensorCount; }
            set { m_nDisabledTempSensorCount = value; }
        }

        public int FlowSensorCount
        {
            get { return m_nFlowensorCount; }
            set { m_nFlowensorCount = value; }
        }
        // 사용할수 없는 기타센서 개수
        public int DisabledFlowSensorCount
        {
            get { return m_nDisabledFlowSensorCount; }
            set { m_nDisabledFlowSensorCount = value; }
        }

        public int ConductSensorCount
        {
            get { return m_nConductensorCount; }
            set { m_nConductensorCount = value; }
        }
        // 사용할수 없는 기타센서 개수
        public int DisabledConductSensorCount
        {
            get { return m_nDisabledConductSensorCount; }
            set { m_nDisabledConductSensorCount = value; }
        }

        public int GASSensorCount
        {
            get { return m_nGASensorCount; }
            set { m_nGASensorCount = value; }
        }
        // 사용할수 없는 기타센서 개수
        public int DisabledGASSensorCount
        {
            get { return m_nDisabledGASSensorCount; }
            set { m_nDisabledGASSensorCount = value; }
        }

        public int PressureSensorCount
        {
            get { return m_nPressureensorCount; }
            set { m_nPressureensorCount = value; }
        }
        // 사용할수 없는 기타센서 개수
        public int DisabledPressureSensorCount
        {
            get { return m_nDisabledPressureSensorCount; }
            set { m_nDisabledPressureSensorCount = value; }
        }

        public int H2LowSensorCount
        {
            get { return m_nH2LowSensorCount; }
            set { m_nH2LowSensorCount = value; }
        }
        public int DisabledH2LowSensorCount
        {
            get { return m_nDisabledH2LowSensorCount; }
            set { m_nDisabledH2LowSensorCount = value; }
        }

        public int O2SensorCount
        {
            get { return m_nO2SensorCount; }
            set { m_nO2SensorCount = value; }
        }
        public int DisabledO2SensorCount
        {
            get { return m_nDisabledO2SensorCount; }
            set { m_nDisabledO2SensorCount = value; }
        }

        public int H2JAGSensorCount
        {
            get { return m_nH2JAGSensorCount; }
            set { m_nH2JAGSensorCount = value; }
        }
        public int DisabledH2JAGSensorCount
        {
            get { return m_nDisabledH2JAGSensorCount; }
            set { m_nDisabledH2JAGSensorCount = value; }
        }
        public int O2JAGSensorCount
        {
            get { return m_nO2JAGSensorCount; }
            set { m_nO2JAGSensorCount = value; }
        }
        public int DisabledO2JAGSensorCount
        {
            get { return m_nDisabledO2JAGSensorCount; }
            set { m_nDisabledO2JAGSensorCount = value; }
        }
    }

    public class ResponseHydrogenEquipZoneSensorList : MessageResult
    {
        private int m_nEquipZoneID = -1;
        private string m_strEquipZoneName = "";
        private string m_strSensorType = "";
        private List<int> m_sensorIDs = new List<int>();

        public int EquipZoneID
        {
            get { return m_nEquipZoneID; }
            set { m_nEquipZoneID = value; }
        }

        public string EquipZoneName
        {
            get { return m_strEquipZoneName; }
            set { m_strEquipZoneName = value; }
        }

        public string SensorType
        {
            get { return m_strSensorType; }
            set { m_strSensorType = value; }
        }

        public List<int> SensorIDs
        {
            get { return m_sensorIDs; }
            set { m_sensorIDs = value; }
        }
    }

    public class ResponseAddAccount : MessageResult
    {
        public int AccountID { get; set; }
    }

    public class ResponseDoubleCheckID : MessageResult
    {
        public bool IsDouble { get; set; }
    }

    public class ResponseMinMaxIndex
    {
        private int m_nMinReactionHistoryID = -1;
        private int m_nMaxReactionHistoryID = -1;

        public int MinReactionHistoryID
        {
            get { return m_nMinReactionHistoryID; }
            set { m_nMinReactionHistoryID = value; }
        }

        public int MaxReactionHistoryID
        {
            get { return m_nMaxReactionHistoryID; }
            set { m_nMaxReactionHistoryID = value; }
        }
    }

    public class ResponseCountIndex
    {
        private int m_nCount = -1;

        public int Count
        {
            get { return m_nCount; }
            set { m_nCount = value; }
        }
    }

    public class ResponseSensorDetectHistories
    {
        private List<SensorDetectHistoryData> m_sensorDetectHistoryDatas = new List<SensorDetectHistoryData>();
        public List<SensorDetectHistoryData> SensorDetectHistoryDatas
        {
            get { return m_sensorDetectHistoryDatas; }
            set { m_sensorDetectHistoryDatas = value; }
        }

        private int m_nLastSensorReactionHistoryID = -1;
        public int LastSensorReactionHistoryID
        {
            get { return m_nLastSensorReactionHistoryID; }
            set { m_nLastSensorReactionHistoryID = value; }
        }
    }

    public class ResponseSettings : MessageResult
    {
        private string m_strIdleTime = null;

        private string m_strUseScreenMove = null;
        private string m_strUseReceiveH2 = null;
        private string m_strUseReceiveTemp = null;
        private string m_strUseReceiveFlow = null;
        private string m_strUseReceiveConductivity = null;
        private string m_strUseReceivePressure = null;
        private string m_strUseReceiveGAS = null;

        private string m_strMoveDisplayAlarm = null;
        private string m_strUsePoiFocus = null;

        private string m_strExeCautionSOP = null;
        private string m_strExeAlartSOP = null;
        private string m_strExeSeriousSOP = null;

        private string m_strUseAutoMoveSOPScreen = null;
        private string m_strUseSMS = null;
        private string m_strUseEmail = null;
        private string m_strUseConfirm = null;
        private string m_strWorkingBeginHour = null;
        private string m_strWorkingEndHour = null;
        private string m_strUseResultSummary = null;

        private string m_strSOPWaitEndTime = null;

        private string m_strAlarmAutoEnd = null;



        public string IdleTime
        {
            get { return m_strIdleTime; }
            set { m_strIdleTime = value; }
        }

        public string UseReceiveH2
        {
            get { return m_strUseReceiveH2; }
            set { m_strUseReceiveH2 = value; }
        }

        public string UseReceiveTemp
        {
            get { return m_strUseReceiveTemp; }
            set { m_strUseReceiveTemp = value; }
        }

        public string UseReceiveFlow
        {
            get { return m_strUseReceiveFlow; }
            set { m_strUseReceiveFlow = value; }
        }

        public string UseReceiveConductivity
        {
            get { return m_strUseReceiveConductivity; }
            set { m_strUseReceiveConductivity = value; }
        }

        public string UseReceivePressure
        {
            get { return m_strUseReceivePressure; }
            set { m_strUseReceivePressure = value; }
        }

        public string UseReceiveGAS
        {
            get { return m_strUseReceiveGAS; }
            set { m_strUseReceiveGAS = value; }
        }

        public string UseScreenMove
        {
            get { return m_strUseScreenMove; }
            set { m_strUseScreenMove = value; }
        }

        public string ExeCautionSOP
        {
            get { return m_strExeCautionSOP; }
            set { m_strExeCautionSOP = value; }
        }

        public string ExeAlartSOP
        {
            get { return m_strExeAlartSOP; }
            set { m_strExeAlartSOP = value; }
        }

        public string ExeSeriousSOP
        {
            get { return m_strExeSeriousSOP; }
            set { m_strExeSeriousSOP = value; }
        }

        public string UseAutoMoveSOPScreen
        {
            get { return m_strUseAutoMoveSOPScreen; }
            set { m_strUseAutoMoveSOPScreen = value; }
        }

        public string UseSMS
        {
            get { return m_strUseSMS; }
            set { m_strUseSMS = value; }
        }

        public string UseEmail
        {
            get { return m_strUseEmail; }
            set { m_strUseEmail = value; }
        }

        public string UseConfirm
        {
            get { return m_strUseConfirm; }
            set { m_strUseConfirm = value; }
        }

        public string WorkingBeginHour
        {
            get { return m_strWorkingBeginHour; }
            set { m_strWorkingBeginHour = value; }
        }

        public string WorkingEndHour
        {
            get { return m_strWorkingEndHour; }
            set { m_strWorkingEndHour = value; }
        }

        public string UseResultSummary
        {
            get { return m_strUseResultSummary; }
            set { m_strUseResultSummary = value; }
        }

        public string SOPWaitEndTime
        {
            get { return m_strSOPWaitEndTime; }
            set { m_strSOPWaitEndTime = value; }
        }        

        public string MoveDisplayAlarm
        {
            get { return m_strMoveDisplayAlarm; }
            set { m_strMoveDisplayAlarm = value; }
        }

        public string UsePoiFocus
        {
            get { return m_strUsePoiFocus; }
            set { m_strUsePoiFocus = value; }
        }

        public string AlarmAutoEnd
        {
            get { return m_strAlarmAutoEnd; }
            set { m_strAlarmAutoEnd = value; }
        }
    }

    public class LoginResult : MessageResult
    {
        private ApplicationUser m_user = null;

        public ApplicationUser User
        {
            get { return m_user; }
            set { m_user = value; }
        }

        public LoginResult()
            : base()
        {
        }

        public LoginResult(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ApplicationUser
    {
        private int m_nID = -1;
        private int m_nLevelID = -1;
        private string m_strLevel = "";
        private string m_strUserID = "";
        private string m_strNickName = "";
        private string m_strSessionKey = "";
        private object m_options = new object();
        private int m_nSiteID = -1;

        public int ID
        {
            get { return m_nID; }
            set { m_nID = value; }
        }

        public int LevelID
        {
            get { return m_nLevelID; }
            set { m_nLevelID = value; }
        }

        public string Level
        {
            get { return m_strLevel; }
            set { m_strLevel = value; }
        }

        public string UserID
        {
            get { return m_strUserID; }
            set { m_strUserID = value; }
        }

        public string NickName
        {
            get { return m_strNickName; }
            set { m_strNickName = value; }
        }

        public string SessionKey
        {
            get { return m_strSessionKey; }
            set { m_strSessionKey = value; }
        }

        public object Options
        {
            get { return m_options; }
            set { m_options = value; }
        }

        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }

        public static ApplicationUser MakeUser(SOPManager.Model.Sop.Account.User user, SOPManager.Model.Sop.Account.Level level, string strSessionKey)
        {
            ApplicationUser appUser = new ApplicationUser();
            appUser.ID = user.ID;
            appUser.LevelID = user.UserLevel;
            appUser.Level = level.LevelName;
            appUser.UserID = user.UserID;
            appUser.NickName = user.NickName;
            appUser.SessionKey = strSessionKey;
            appUser.SiteID = user.SiteID;

            return appUser;
        }
    }

    public class ResponseAnomalyDetections : MessageResult
    {
        public ETC Sensor { get; set; }
        public List<AnomalyDetectionData> AnomalyDetections { get; set; }
    }

    public class ResponseSimulationData : MessageResult
    {
        public ResponseSimulationData()
        {            
            this.P_Buf1 = new TimeSeriesData("{ \"ko\":\"압력\", \"en\":\"Pressure\"}", 20, 19.5, 0, 0);
            this.T_Buf1 = new TimeSeriesData("{ \"ko\":\"온도\", \"en\":\"Temperature\"}");

            this.T_TkM = new TimeSeriesData("{ \"ko\":\"온도\", \"en\":\"Temperature\"}", 65, 55, -25, -29);
            this.P_MBk = new TimeSeriesData("{ \"ko\":\"압력\", \"en\":\"Pressure\"}", 86, 85, 50, 0);
            this.DeFuel_MBk = new TimeSeriesData("{ \"ko\":\"유량\", \"en\":\"Flow\"}");

            this.T_TkH = new TimeSeriesData("{ \"ko\":\"온도\", \"en\":\"Temperature\"}", 97, 95, 50, 0);
            this.P_HBk = new TimeSeriesData("{ \"ko\":\"압력\", \"en\":\"Pressure\"}", 65, 55, -25, -29);
            this.DeFuel_HBk = new TimeSeriesData("{ \"ko\":\"유량\", \"en\":\"Flow\"}");

            this.m_MCp1 = new TimeSeriesData("{ \"ko\":\"유량\", \"en\":\"Flow\"}");
        }

        public double MaxTime { get; set; }
        public double ChargeTemp { get; set; }
        public double ChargePressure { get; set; }
        public double ChargeRate { get; set; }
        public double ChargeTime { get; set; }

        // 저압탱크
        public TimeSeriesData P_Buf1 { get; set; }
        public TimeSeriesData T_Buf1 { get; set; }

        // 중압탱크
        public TimeSeriesData T_TkM { get; set; }
        public TimeSeriesData P_MBk { get; set; }
        public TimeSeriesData DeFuel_MBk { get; set; }

        // 고압탱크
        public TimeSeriesData T_TkH { get; set; }
        public TimeSeriesData P_HBk { get; set; }
        public TimeSeriesData DeFuel_HBk { get; set; }

        // 압축기
        public TimeSeriesData m_MCp1 { get; set; }
    }

    // 시계열 데이터를 담는 클래스
    public class TimeSeriesData
    {
        public string Name { get; set; }
        public double Max { get; set; }
        public double Min { get; set; }

        public double? HH { get; set; }
        public double? H { get; set; }
        public double? L { get; set; }
        public double? LL { get; set; }

        public Dictionary<double, double> Values { get; set; }

        public TimeSeriesData()
        {
            Values = new Dictionary<double, double>();
        }
        public TimeSeriesData(string strName)
        {
            Values = new Dictionary<double, double>();
            Name = strName;
        }
        public TimeSeriesData(string strName, double? dHH, double? dH, double? dL, double? dLL)
        {
            Values = new Dictionary<double, double>();
            Name = strName;
            HH = dHH;
            H = dH;
            L = dL;
            LL = dLL;
        }

        public double GetMax() 
        {
            double dMax = Values.Count > 0 ? Values.Values.Max() : 0;

            if (HH.HasValue && HH.Value > dMax)
                dMax = HH.Value;
            if (H.HasValue && H.Value > dMax)
                dMax = H.Value;
            if (L.HasValue && L.Value > dMax)
                dMax = L.Value;
            if (LL.HasValue && LL.Value > dMax)
                dMax = LL.Value;

            dMax += 10;

            return dMax;
        }

        public double GetMin() 
        {
            double dMin = Values.Count > 0 ? Values.Values.Min() : 0;

            if (HH.HasValue && HH.Value < dMin)
                dMin = HH.Value;
            if (H.HasValue && H.Value < dMin)
                dMin = H.Value;
            if (L.HasValue && L.Value < dMin)
                dMin = L.Value;
            if (LL.HasValue && LL.Value < dMin)
                dMin = LL.Value;

            dMin -= 10;

            return dMin;
        }
    }








    public class DamageScope
    {
        public string node { get; set; }
        /// <summary>
        /// 누출량
        /// </summary>
        public double leak_amount { get; set; }
        /// <summary>
        /// 누출면적
        /// </summary>
        public double leak_area { get; set; }
        /// <summary>
        /// 크렉 사이즈
        /// </summary>
        public double crack_size { get; set; }
        /// <summary>
        /// 압력
        /// </summary>
        public double pressure { get; set; }
        /// <summary>
        /// 온도
        /// </summary>
        public double temperature { get; set; }

        public Radius risk_1 { get; set; }
        public Radius risk_2 { get; set; }
        public Radius risk_3 { get; set; }
        public Radius risk_4 { get; set; }
        public Radius risk_5 { get; set; }
    }

    public class Radius
    {
        public double inner_radius { get; set; }
        public double outer_radius { get; set; }
    }    

    public class ResponseDamageScope : MessageResult
    {
        public DamageScope node1 { get; set; }
        public DamageScope node2 { get; set; }
        public DamageScope node3_1 { get; set; }
        public DamageScope node3_2 { get; set; }
        public DamageScope node3_3 { get; set; }
        public DamageScope node4 { get; set; }
        public DamageScope node5 { get; set; }
        public DamageScope node6_1 { get; set; }
        public DamageScope node6_2 { get; set; }
        public DamageScope node6_3 { get; set; }
        public DamageScope node7 { get; set; }
        public DamageScope node8 { get; set; }
        public DamageScope node9 { get; set; }
        public DamageScope node10 { get; set; }

        /// <summary>
        /// 중압 압축기
        /// </summary>
        public DamageScope e1 { get; set; }
        /// <summary>
        /// 고압 압축기
        /// </summary>
        public DamageScope e2 { get; set; }
        /// <summary>
        /// 저압 용기1
        /// </summary>
        public DamageScope e3_1 { get; set; }
        /// <summary>
        /// 저압 용기2
        /// </summary>
        public DamageScope e3_2 { get; set; }
        /// <summary>
        /// 저압 용기3
        /// </summary>
        public DamageScope e3_3 { get; set; }
        /// <summary>
        /// 고압 용기1
        /// </summary>
        public DamageScope e4_1 { get; set; }
        /// <summary>
        /// 고압 용기2
        /// </summary>
        public DamageScope e4_2 { get; set; }
        /// <summary>
        /// 고압 용기3
        /// </summary>
        public DamageScope e4_3 { get; set; }
        /// <summary>
        /// 냉각기
        /// </summary>
        public DamageScope e5 { get; set; }

        public ResponseDamageScope()
            : base()
        {
        }

        public ResponseDamageScope(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseRisk : MessageResult
    {
        public RiskInfo node1 { get; set; }
        public RiskInfo node2 { get; set; }
        public RiskInfo node3_1 { get; set; }
        public RiskInfo node3_2 { get; set; }
        public RiskInfo node3_3 { get; set; }
        public RiskInfo node4 { get; set; }
        public RiskInfo node5 { get; set; }
        public RiskInfo node6_1 { get; set; }
        public RiskInfo node6_2 { get; set; }
        public RiskInfo node6_3 { get; set; }
        public RiskInfo node7 { get; set; }
        public RiskInfo node8 { get; set; }
        public RiskInfo node9 { get; set; }
        public RiskInfo node10 { get; set; }

        /// <summary>
        /// 중압 압축기
        /// </summary>
        public RiskInfo e1 { get; set; }
        /// <summary>
        /// 고압 압축기
        /// </summary>
        public RiskInfo e2 { get; set; }
        /// <summary>
        /// 저압 용기1
        /// </summary>
        public RiskInfo e3_1 { get; set; }
        /// <summary>
        /// 저압 용기2
        /// </summary>
        public RiskInfo e3_2 { get; set; }
        /// <summary>
        /// 저압 용기3
        /// </summary>
        public RiskInfo e3_3 { get; set; }
        /// <summary>
        /// 고압 용기1
        /// </summary>
        public RiskInfo e4_1 { get; set; }
        /// <summary>
        /// 고압 용기2
        /// </summary>
        public RiskInfo e4_2 { get; set; }
        /// <summary>
        /// 고압 용기3
        /// </summary>
        public RiskInfo e4_3 { get; set; }
        /// <summary>
        /// 냉각기
        /// </summary>
        public RiskInfo e5 { get; set; }


        public ResponseRisk()
            : base()
        {
        }

        public ResponseRisk(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class RiskInfo
    {
        public string node { get; set; }
        /// <summary>
        /// 노드 설명
        /// </summary>
        public string nodeInfo { get; set; }
        public string scenario_id { get; set; }
        public string emergency_reference { get; set; }
        public string emergency_response { get; set; }
        public string event_scenario { get; set; }
        public string hazard_scenario { get; set; }
        public string preventive_action { get; set; }
        public string preventive_reference { get; set; }
        /// <summary>
        /// 공정 파라미터
        /// </summary>
        public string proc_param { get; set; }
        /// <summary>
        /// 원인
        /// </summary>
        public string cause { get; set; }
        /// <summary>
        /// 이탈
        /// </summary>
        public string break_away { get; set; }
        public int? risk { get; set; }
    }

    public class ResponseRiskAssessInfo : MessageResult
    {
        public int ID { get; set; }
        public int SensorID { get; set; }
        public string SensorName { get; set; }
        public string Parameter { get; set; }
        public string Deviation { get; set; }
        public string Cause { get; set; }        
        public string event_scenario { get; set; }
        public string hazard_scenario { get; set; }
        public string action { get; set; }
        public string reference { get; set; }
        public string status { get; set; }

        public ResponseRiskAssessInfo()
            : base()
        {
        }

        public ResponseRiskAssessInfo(bool success, string message)
            : base(success, message)
        {
        }
    }
}
