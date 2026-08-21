using System;
using System.Collections.Generic;
using System.Text;

namespace Hydrogen.BLL.Models
{
    public class ReqHydrogenEquipZoneSensorList
    {        
        public int SensorID { get; set; }
        public string SensorType { get; set; }
    }

    public class ReqUpdateUserInfo
    {
        public int AccountID { get; set; }
        public int LevelID { get; set; }
        public string Memo { get; set; }
    }

    public class ReqAddAccount
    {
        public int MemberID { get; set; }
        public int AccountLevel { get; set; }
        public string UserID { get; set; }
        public string MemberName { get; set; }
    }

    public class ReqDoubleCheckID
    {
        public string UserID { get; set; }
    }

    public class RequestGetMinMaxIndex
    {
        private string m_strBeginTime = "";
        private string m_strEndTime = "";
        private int m_nFacilityType = -1;
        private int m_nBuildingID = -1;
        private int m_nZoneID = -1;


        public string BeginTime
        {
            get { return m_strBeginTime; }
            set { m_strBeginTime = value; }
        }

        public string EndTime
        {
            get { return m_strEndTime; }
            set { m_strEndTime = value; }
        }

        public int FacilityType
        {
            get { return m_nFacilityType; }
            set { m_nFacilityType = value; }
        }
        public int BuildingID
        {
            get { return m_nBuildingID; }
            set { m_nBuildingID = value; }
        }
        public int ZoneID
        {
            get { return m_nZoneID; }
            set { m_nZoneID = value; }
        }
    }

    public class RequestSensorDetectHistories
    {
        private string m_strBeginTime = "";
        private string m_strEndTime = "";
        private int m_nFacilityType = -1;
        private int m_nBuildingID = -1;
        private int m_nZoneID = -1;

        private int m_nLastSensorZoneHistoryID = -1;
        private int m_nRowCount = 10; // 한 페이지에 보여줄 row 개수
        private bool m_bIsDesc = true; // 다음 페이지로 넘어갈 경우 작은값으로 조회, 이전페이지로 넘어갈 경우 큰값으로 조회

        private int m_nSiteID = -1;


        public string BeginTime
        {
            get { return m_strBeginTime; }
            set { m_strBeginTime = value; }
        }

        public string EndTime
        {
            get { return m_strEndTime; }
            set { m_strEndTime = value; }
        }

        public int FacilityType
        {
            get { return m_nFacilityType; }
            set { m_nFacilityType = value; }
        }
        public int BuildingID
        {
            get { return m_nBuildingID; }
            set { m_nBuildingID = value; }
        }
        public int ZoneID
        {
            get { return m_nZoneID; }
            set { m_nZoneID = value; }
        }

        public int LastSensorZoneHistoryID
        {
            get { return m_nLastSensorZoneHistoryID; }
            set { m_nLastSensorZoneHistoryID = value; }
        }

        public int RowCount
        {
            get { return m_nRowCount; }
            set { m_nRowCount = value; }
        }

        public bool IsDesc
        {
            get { return m_bIsDesc; }
            set { m_bIsDesc = value; }
        }

        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }
    }

    public class RequestSensorDetectHistories2
    {
        private string m_strBeginTime = "";
        private string m_strEndTime = "";
        private int m_nFacilityType = -1;
        private int m_nBuildingID = -1;
        private int m_nZoneID = -1;

        private int m_nRowCount = 10;   // 한 페이지에 보여줄 row 개수
        private int m_nLimitCount = 0;  // 조회 시작 넘버

        private int m_nSiteID = -1;


        public string BeginTime
        {
            get { return m_strBeginTime; }
            set { m_strBeginTime = value; }
        }

        public string EndTime
        {
            get { return m_strEndTime; }
            set { m_strEndTime = value; }
        }

        public int FacilityType
        {
            get { return m_nFacilityType; }
            set { m_nFacilityType = value; }
        }
        public int BuildingID
        {
            get { return m_nBuildingID; }
            set { m_nBuildingID = value; }
        }
        public int ZoneID
        {
            get { return m_nZoneID; }
            set { m_nZoneID = value; }
        }

        public int RowCount
        {
            get { return m_nRowCount; }
            set { m_nRowCount = value; }
        }

        public int LimitCount
        {
            get { return m_nLimitCount; }
            set { m_nLimitCount = value; }
        }

        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }
    }

    public class RequestSettings
    {
        private int? m_nSiteID = null;
        private int m_nUserID = -1;
        public int? SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }
        public int UserID
        {
            get { return m_nUserID; }
            set { m_nUserID = value; }
        }
    }

    public class ReqTodaySensorAnomalyDetections
    {
        public int SensorID { get; set; }
    }

    public class ReqSimulationData
    {
        public float T_AmbC { get; set; }
        public float P_HBk_0 { get; set; }
        public int D2On { get; set; }
        public int ContOn { get; set; }
        public int t_PreRun { get; set; }
        public int t_PreSet1 { get; set; }
        public int t_PreSet2 { get; set; }
        //public int Q_Fire { get; set; }
        public int CompMod { get; set; }


        public int? N_Source { get; set; }
        public float? P_Source { get; set; }
        public float? T_SourceC { get; set; }
        public int? m_Source { get; set; }


        public float? V_BufInd1 { get; set; }
        public int? N_Buf1 { get; set; }
        public float? P_BufMax1 { get; set; }
        public float? P_Buf_RC1 { get; set; }
        public float? P_Buf_01 { get; set; }
        public float? P_BufMin1 { get; set; }


        public int? N_MCp { get; set; }
        public float? P_CpInMaxM { get; set; }
        public float? P_CpInMinM { get; set; }
        public float? P_refM { get; set; }
        public float? T_refCM { get; set; }
        public float? m_Cp_refM { get; set; }
        public float? Sp_CpM { get; set; }
        public float? EtaVM { get; set; }
        public float? Eta_CompM { get; set; }
        public float? Eta_motorM { get; set; }
        public float? T_CoolSetCM { get; set; }
        public float? COPM { get; set; }


        public int? V_TkIndM { get; set; }
        public int? N_TkM { get; set; }
        public float? P_TkMaxM { get; set; }
        public float? P_TkMinM { get; set; }
        public int? FuMoOnM { get; set; }
        public float? T_Tk_0CM { get; set; }


        public float? V_TkIndH { get; set; }
        public int? N_TkH { get; set; }
        public float? P_TkMaxH { get; set; }
        public float? P_TkMinH { get; set; }
        public float? T_Tk_0CH { get; set; }


        public int? EA_Disp1 { get; set; }
        public int? P_Class1 { get; set; }
        public float? T_BaC1 { get; set; }
        public int? m_HFPLim1 { get; set; }
        public int? t_BrkMax1 { get; set; }
        public int? HFPMode1 { get; set; }
        public int? ComOn1 { get; set; }


        public int? V_TkMode1 { get; set; }
        public int? TVL1 { get; set; }
        public int? TV1 { get; set; }
        public float? P_Tk_01 { get; set; }
        public int? SOC_G1 { get; set; }
        public float? T_Tk_0C1 { get; set; }


        public int? EA_Disp2 { get; set; }
        public int? P_Class2 { get; set; }
        public float? T_BaC2 { get; set; }
        public int? m_HFPLim2 { get; set; }
        public int? t_BrkMax2 { get; set; }
        public int? HFPMode2 { get; set; }
        public int? ComOn2 { get; set; }


        public int? V_TkMode2 { get; set; }
        public int? TVL2 { get; set; }
        public int? TV2 { get; set; }
        public float? P_Tk_02 { get; set; }
        public int? SOC_G2 { get; set; }
        public float? T_Tk_0C2 { get; set; }
    }


    public class ReqDamageScope
    {
        public string mode { get; set; }
        public string node { get; set; }
        public int? risk_level { get; set; }
    }

    public class ReqRisk
    {
        public string mode { get; set; }
        public string node { get; set; }
        public int? risk_level { get; set; }
        public string param { get; set; }
        public string deviation { get; set; }
        public string language { get; set; }
    }

    public class ReqRiskAssessInfo
    {
        public int RiskAssessInfoID { get; set; }
        
    }
}
