using System.Collections.Generic;
using BusanTP.Model;

namespace BusanTP.BLL.Models.Request
{
    public class RequestData
    {
        private bool? m_requestAllSensors = null;
        private bool? m_requestExternalSensors = null;
        private bool? m_requestExternalSensorTypes = null;
        private bool? m_requestExternalMaterials = null;
        private bool? m_requestAlarmMemo = null;
        private bool? m_requestBusanSdmsOptions = null;
        private RequestResetPopup m_requestResetPopup = null;
        private RequestUpdateUseReceives m_requestUpdateUseReceives = null;
        private bool? m_requestExternalSensorGIS = null;
        private bool? m_requestExternalPOIInfo = null;
        
        public bool? RequestAllSensors
        {
            get { return m_requestAllSensors; }
            set { m_requestAllSensors = value; }
        }
        
        public bool? RequestExternalSensors
        {
            get { return m_requestExternalSensors; }
            set { m_requestExternalSensors = value; }
        }

        public bool? RequestExternalSensorTypes 
        {
            get { return m_requestExternalSensorTypes; }
            set { m_requestExternalSensorTypes = value; }
        }
        
        public bool? RequestExternalMaterials
        {
            get { return m_requestExternalMaterials; }
            set { m_requestExternalMaterials = value; }
        }
        
        public bool? RequestAlarmMemo
        {
            get { return m_requestAlarmMemo; }
            set { m_requestAlarmMemo = value; }
        }

        public bool? RequestBusanSdmsOptions 
        {
            get { return m_requestBusanSdmsOptions; }
            set { m_requestBusanSdmsOptions = value; }
        }
        
        public RequestResetPopup RequestResetPopup
        {
            get { return m_requestResetPopup; }
            set { m_requestResetPopup = value; }
        }
        
        public RequestUpdateUseReceives RequestUpdateUseReceives
        {
            get { return m_requestUpdateUseReceives; }
            set { m_requestUpdateUseReceives = value; }
        }
        
        public bool? RequestExternalSensorGIS
        {
            get { return m_requestExternalSensorGIS; }
            set { m_requestExternalSensorGIS = value; }
        }
        
        public bool? RequestExternalPOIInfo
        {
            get { return m_requestExternalPOIInfo; }
            set { m_requestExternalPOIInfo = value; }
        }
    }

    public class RequestResetPopup
    {
        private int m_nUserID = -1;
        public int UserID
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

    public class RequestUpdateUseReceives
    {
        private List<SdmsOption> m_sdmsOptions = null;
        
        public List<SdmsOption> SdmsOptions
        {
            get { return m_sdmsOptions; }
            set { m_sdmsOptions = value; }
        }
    }
    
    public class PopupState
    {
        private PopupLocation m_weatherInfo = null;
        public PopupLocation WeatherInfo
        {
            get { return m_weatherInfo; }
            set { m_weatherInfo = value; }
        }

        private PopupLocation m_statusInfo = null;
        public PopupLocation StatusInfo
        {
            get { return m_statusInfo; }
            set { m_statusInfo = value; }
        }

        private PopupLocation m_statusPsmSensorInfo = null;
        public PopupLocation StatusPsmSensorInfo
        {
            get { return m_statusPsmSensorInfo; }
            set { m_statusPsmSensorInfo = value; }
        }

        private PopupLocation m_miniMap = null;
        public PopupLocation MiniMap
        {
            get { return m_miniMap; }
            set { m_miniMap = value; }
        }

        private PopupLocation m_event = null;
        public PopupLocation Event
        {
            get { return m_event; }
            set { m_event = value; }
        }

        private PopupLocation m_cctvInfo = null;
        public PopupLocation CctvInfo
        {
            get { return m_cctvInfo; }
            set { m_cctvInfo = value; }
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
}