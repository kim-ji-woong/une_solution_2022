using System.Collections.Generic;
using BusanTP.Model;
using SOPManager.Model.Sop.Account;

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
        private RequestUpdateUseReceives m_requestUpdateUseReceives = null; // 센서알람 유형 사용 유무
        private bool? m_requestExternalSensorGIS = null; // 건물(위치)정보
        private bool? m_requestExternalPOIInfo = null; // POI 정보
        private bool? m_requestViewport = null; // 저장된 초기화면 호출
        private RequestSaveViewport m_requestSaveViewport = null; // 초기화면 설정
        private bool? m_requestUserMemos = null; // 사용자 메모목록
        private RequestSaveUser m_requestSaveUser = null; // 사용자 정보 저장 (권한, 메모)
        private RequestRemoveUser m_requestRemoveUser = null; // 사용자 삭제
        private RequestAddUser m_requestAddUser = null; // 사용자 추가
        private RequestSendPassword m_requestSendPassword = null; // 임시 비밀번호 발급
        private RequestSensorDataHistories m_requestSensorDataHistories = null; // 센서 데이터 히스토리 조회
        private RequestWeatherHistory m_requestWeatherHistory = null;
        private bool? m_requestAccountUsers = null;
        private bool? m_requestTestOptions = null;
        
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

        public bool? RequestViewport
        {
            get { return m_requestViewport; }
            set { m_requestViewport = value; }
        }
        
        public RequestSaveViewport RequestSaveViewport
        {
            get { return m_requestSaveViewport; }
            set { m_requestSaveViewport = value; }
        }
        
        public bool? RequestUserMemos
        {
            get { return m_requestUserMemos; }
            set { m_requestUserMemos = value; }
        }
        
        public RequestSaveUser RequestSaveUser
        {
            get { return m_requestSaveUser; }
            set { m_requestSaveUser = value; }
        }
        
        public RequestRemoveUser RequestRemoveUser
        {
            get { return m_requestRemoveUser; }
            set { m_requestRemoveUser = value; }
        }
        
        public RequestAddUser RequestAddUser
        {
            get { return m_requestAddUser; }
            set { m_requestAddUser = value; }
        }
        
        public RequestSendPassword RequestSendPassword
        {
            get { return m_requestSendPassword; }
            set { m_requestSendPassword = value; }
        }
        
        public RequestSensorDataHistories RequestSensorDataHistories
        {
            get { return m_requestSensorDataHistories; }
            set { m_requestSensorDataHistories = value; }
        }
        
        public RequestWeatherHistory RequestWeatherHistory
        {
            get { return m_requestWeatherHistory; }
            set { m_requestWeatherHistory = value; }
        }

        public bool? RequestAccountUsers
        {
            get {return m_requestAccountUsers; }
            set { m_requestAccountUsers = value; }
        }
        
        public bool? RequestTestOptions
        {
            get { return m_requestTestOptions; }
            set { m_requestTestOptions = value; }
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
        
        private PopupLocation m_simulation = null;
        public PopupLocation Simulation
        {
            get { return m_simulation; }
            set { m_simulation = value; }
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

    public class RequestSaveViewport
    {
        private int m_spaceID = 0;
        private float m_locationX = 0;
        private float m_locationY = 0;
        private float m_locationZ = 0;
        private float m_rotationX = 0;
        private float m_rotationY = 0;
        private float m_rotationZ = 0;
        private float m_zoom = 0;
        
        public int SpaceID
        {
            get { return m_spaceID; }
            set { m_spaceID = value; }
        }
        
        public float LocationX
        {
            get { return m_locationX; }
            set { m_locationX = value; }
        }
        
        public float LocationY
        {
            get { return m_locationY; }
            set { m_locationY = value; }
        }
        
        public float LocationZ
        {
            get { return m_locationZ; }
            set { m_locationZ = value; }
        }
        
        public float RotationX
        {
            get { return m_rotationX; }
            set { m_rotationX = value; }
        }
        
        public float RotationY
        {
            get { return m_rotationY; }
            set { m_rotationY = value; }
        }
        
        public float RotationZ
        {
            get { return m_rotationZ; }
            set { m_rotationZ = value; }
        }
        
        public float Zoom
        {
            get { return m_zoom; }
            set { m_zoom = value; }
        }
    }

    public class RequestSaveUser
    {
        private int m_nUserID = -1;
        private int m_nUserLevel = -1;
        private string memo = "";
        
        public int UserID
        {
            get { return m_nUserID; }
            set { m_nUserID = value; }
        }
        
        public int UserLevel
        {
            get { return m_nUserLevel; }
            set { m_nUserLevel = value; }
        }
        
        public string Memo
        {
            get { return memo; }
            set { memo = value; }
        }
    }
    
    public class RequestRemoveUser
    {
        private int m_nUserID = -1;
        
        public int UserID
        {
            get { return m_nUserID; }
            set { m_nUserID = value; }
        }
    }

    public class RequestAddUser
    {
        private int m_nMemberID = -1;
        private int m_nUserLevel = -1;
        private string m_strUserID = "";
        private string m_strNickName = "";
        private int m_nSiteID = -1;
        
        public int MemberID
        {
            get { return m_nMemberID; }
            set { m_nMemberID = value; }
        }
        
        public int UserLevel
        {
            get { return m_nUserLevel; }
            set { m_nUserLevel = value; }
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
        
        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }
    }

    public class RequestSendPassword
    {
        private string m_strName = "";
        private string m_nPhone = "";
        private string m_strEnc = "";
        private string m_strKey = "";
        
        public string Name
        {
            get { return m_strName; }
            set { m_strName = value; }
        }
        
        public string Phone
        {
            get { return m_nPhone; }
            set { m_nPhone = value; }
        }
        
        public string Enc
        {
            get { return m_strEnc; }
            set { m_strEnc = value; }
        }
        
        public string Key
        {
            get { return m_strKey; }
            set { m_strKey = value; }
        }
    }

    public class RequestWeatherHistory
    {
        private int m_nZoneID = -1;
        
        public int ZoneID
        {
            get { return m_nZoneID; }
            set { m_nZoneID = value; }
        }
    }

    public class RequestSensorDataHistories
    {
        private string m_strBeginTime = "";
        private string m_strEndTime = "";
        private List<int> m_nBuildingIDs = null; // -1: 전체
        private List<int> m_nMaterialIDs = null;
        private bool periodType = false; // false: 1시간 , true: 5분
        
        public string BeginDate
        {
            get { return m_strBeginTime; }
            set { m_strBeginTime = value; }
        }
        
        public string EndDate
        {
            get { return m_strEndTime; }
            set { m_strEndTime = value; }
        }
        
        public List<int> BuildingIDs
        {
            get { return m_nBuildingIDs; }
            set { m_nBuildingIDs = value; }
        }
        
        public List<int> MaterialIDs
        {
            get { return m_nMaterialIDs; }
            set { m_nMaterialIDs = value; }
        }
        
        public bool PeriodType
        {
            get { return periodType; }
            set { periodType = value; }
        }
        
    }
}