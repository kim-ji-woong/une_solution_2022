using System;
using System.Collections.Generic;
using System.Text;

namespace Hydrogen.BLL.Models.Data
{
    public class RequestSaveSettings_Hydrogen
    {
        private int? m_nSiteID = null;
        private int m_nUserID = -1;
        //private ShortcutKey m_shortcutKey = null;
        private string m_strIdleTime = null;
        private string m_strUseReceiveH2 = null;
        private string m_strUseReceiveFlow = null;
        private string m_strUseReceiveConductivity = null;
        private string m_strUseReceiveTemp = null;
        private string m_strUseReceivePressure = null;
        private string m_strUseReceiveGAS = null;
        private string m_strUseScreenMove = null;
        private string m_strExeCautionSOP = null;
        private string m_strExeAlartSOP = null;
        private string m_strExeSeriousSOP = null;
        private string m_strUseAutoMoveSOPScreen = null;
        //private string m_strUseBroadcast = null;
        private string m_strUseSMS = null;
        private string m_strUseEmail = null;
        private string m_strUseConfirm = null;
        private string m_strWorkingBeginHour = null;
        private string m_strWorkingEndHour = null;
        private string m_strUseResultSummary = null;
        private string m_strSOPWaitEndTime = null;
        private string m_strMoveDisplayAlarm = null;
        private string m_strUsePoiFocus = null;
        //private string m_strUsePoiHighlight = null;
        //private string m_strUseAlarmArea = null;
        private string m_strAlarmAutoEnd = null;

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

        //public ShortcutKey ShortcutKey
        //{
        //    get { return m_shortcutKey; }
        //    set { m_shortcutKey = value; }
        //}

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

        public string UseReceiveTemp
        {
            get { return m_strUseReceiveTemp; }
            set { m_strUseReceiveTemp = value; }
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

        //public string UseBroadcast
        //{
        //    get { return m_strUseBroadcast; }
        //    set { m_strUseBroadcast = value; }
        //}

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

    public class RequestResetPopup
    {
        private int? m_nUserID = null;
        public int? UserID
        {
            get { return m_nUserID; }
            set { m_nUserID = value; }
        }

        private PopupState m_popupState = null;
        public PopupState PopupState
        {
            get { return m_popupState; }
            set { m_popupState = value; }
        }
    }

    public class PopupState
    {
        private PopupLocation m_statusInfo = null;
        public PopupLocation StatusInfo
        {
            get { return m_statusInfo; }
            set { m_statusInfo = value; }
        }

        private PopupLocation m_dashboardPop = null;
        public PopupLocation DashboardPop
        {
            get { return m_dashboardPop; }
            set { m_dashboardPop = value; }
        }

        private PopupLocation m_eventInfoNew = null;
        public PopupLocation EventInfoNew
        {
            get { return m_eventInfoNew; }
            set { m_eventInfoNew = value; }
        }

        private PopupLocation m_compoundData = null;
        public PopupLocation CompoundData
        {
            get { return m_compoundData; }
            set { m_compoundData = value; }
        }
    }

    public class PopupLocation
    {
        private string m_strX = "";
        private string m_strY = "";
        private string m_strHeight = "";
        private string m_strWidth = "";

        public string X
        {
            get { return m_strX; }
            set { m_strX = value; }
        }

        public string Y
        {
            get { return m_strY; }
            set { m_strY = value; }
        }

        public string Height
        {
            get { return m_strHeight; }
            set { m_strHeight = value; }
        }

        public string Width
        {
            get { return m_strWidth; }
            set { m_strWidth = value; }
        }
    }

    public class ReqAnomalyDetection
    {
        public string component_id { get; set; }
        public string asset_type { get; set; }
        public string location_type { get; set; }
        public string sensor_type { get; set; }
        public string unit_type { get; set; }
        public string id_ext { get; set; }
        public string measure_id { get; set; }
        public anomalies data_anomalies { get; set; }
        public diagnosis data_diagnosis { get; set; }

    }

    public class anomalies
    {
        public string status { get; set; }
        public int length { get; set; }
        public string base_read_data_time { get; set; }
        public float reconstruction_error_threshold { get; set; }
        public List<anomaly> data_list { get; set; }
    }

    public class anomaly
    {
        public string read_data_time { get; set; }
        public string timestamp { get; set; }
        public float point_value_original { get; set; }
        public float point_value_reconstruct { get; set; }
        public float error_abs_value { get; set; }
        public bool is_anomaly { get; set; }
    }

    public class diagnosis
    {
        public string status { get; set; }
        public int length { get; set; }
        public string base_read_data_time { get; set; }
        public string pattern_type { get; set; }
    }
}
