using System.Collections.Generic;
using GGH.Model.CCTV;
using UnE.Geometry;

namespace GGH.BLL.Models.Request
{
    using Response;

    public class RequestData
    {
        private bool? m_requestNvrList = null;
        private RequestUpdateNvrList m_updateNvrList = null;
        private bool? m_requestEvacuations = null;
        private bool? m_requestAlarmNEvacuations = null;
        private RequestCCTVList m_requestCCTVList = null;
        private UpdateCCTVList m_updateCCTVList = null;
        private RequestParkingGateList m_requestParkingGateList = null;
        // 화재시 열리지 않은 출입문 목록 얻어오기
        private RequestDoorStatus m_requestDoorStatus = null;
        private RequestExitList m_requestExitList = null;
        private RequestAllDoors m_requestAllDoors = null;
        private RequestUPSStatus m_requestUpsStatus = null;
        private UpdateSensorEnabled m_updateSensorEnabled = null;
        private RequestUpdatePOIPositions m_requestUpdatePOIPositions = null;
        private RequestUpdatePOIPosition m_requestUpdatePOIPosition = null;
        private RequestCCTVList2 m_requestCCTVList2 = null;
        private RequestEarthquakeHistory m_requestEarthquakeHistory = null;
        private bool? m_requestLastEarthquake = null;
        private RequestFirstAidEquipmentList m_requestFirstAidEquipmentList = null;
        private RequestNewFirstAidEquipment m_requestNewFirstAidEquipment = null;
        private RequestDeleteSensors m_requestDeleteSensors = null;
        private RequestAlarmReport m_requestAlarmReport = null;
        private RequestSopReport m_requestSopReport = null;
        private Common.BLL.Models.Request.RequestSaveSettings m_requestSaveSettings = null;
        private bool? m_requestUseParkingUplock = null;
        private UpdateParkingUplock m_updateParkingUplock = null;

        public bool? RequestNvrList
        {
            get { return m_requestNvrList; }
            set { m_requestNvrList = value; }
        }

        public RequestUpdateNvrList RequestUpdateNvrList
        {
            get { return m_updateNvrList; }
            set { m_updateNvrList = value; }
        }

        public bool? RequestEvacuations
        {
            get { return m_requestEvacuations; }
            set { m_requestEvacuations = value; }
        }

        public bool? RequestAlarmNEvacuations
        {
            get { return m_requestAlarmNEvacuations; }
            set { m_requestAlarmNEvacuations = value; }
        }

        public RequestCCTVList RequestCCTVList
        {
            get { return m_requestCCTVList; }
            set { m_requestCCTVList = value; }
        }

        public UpdateCCTVList UpdateCCTVList
        {
            get { return m_updateCCTVList; }
            set { m_updateCCTVList = value; }
        }

        public RequestCCTVList2 RequestCCTVList2
        {
            get { return m_requestCCTVList2; }
            set { m_requestCCTVList2 = value; }
        }

        public RequestParkingGateList RequestParkingGateList
        {
            get { return m_requestParkingGateList; }
            set { m_requestParkingGateList = value; }
        }

        // 화재시 열리지 않은 출입문 목록 얻어오기
        public RequestDoorStatus RequestDoorStatus
        {
            get { return m_requestDoorStatus; }
            set { m_requestDoorStatus = value; }
        }

        public RequestExitList RequestExitList
        {
            get { return m_requestExitList; }
            set { m_requestExitList = value; }
        }

        public RequestAllDoors RequestAllDoors
        {
            get { return m_requestAllDoors; }
            set { m_requestAllDoors = value; }
        }

        public RequestUPSStatus RequestUPSStatus
        {
            get { return m_requestUpsStatus; }
            set { m_requestUpsStatus = value; }
        }

        public UpdateSensorEnabled UpdateSensorEnabled
        {
            get { return m_updateSensorEnabled; }
            set { m_updateSensorEnabled = value; }
        }

        public RequestUpdatePOIPositions RequestUpdatePOIPositions
        {
            get { return m_requestUpdatePOIPositions; }
            set { m_requestUpdatePOIPositions = value; }
        }

        public RequestUpdatePOIPosition RequestUpdatePOIPosition
        {
            get { return m_requestUpdatePOIPosition; }
            set { m_requestUpdatePOIPosition = value; }
        }

        public RequestEarthquakeHistory RequestEarthquakeHistory
        {
            get { return m_requestEarthquakeHistory; }
            set { m_requestEarthquakeHistory = value; }
        }

        public bool? RequestLastEarthquake
        {
            get { return m_requestLastEarthquake; }
            set { m_requestLastEarthquake = value; }
        }

        public RequestFirstAidEquipmentList RequestFirstAidEquipmentList
        {
            get { return m_requestFirstAidEquipmentList; }
            set { m_requestFirstAidEquipmentList = value; }
        }

        public RequestNewFirstAidEquipment RequestNewFirstAidEquipment
        {
            get { return m_requestNewFirstAidEquipment; }
            set { m_requestNewFirstAidEquipment = value; }
        }

        public RequestDeleteSensors RequestDeleteSensors
        {
            get { return m_requestDeleteSensors; }
            set { m_requestDeleteSensors = value; }
        }

        public RequestAlarmReport RequestAlarmReport
        {
            get { return m_requestAlarmReport; }
            set { m_requestAlarmReport = value; }
        }

        public RequestSopReport RequestSopReport
        {
            get { return m_requestSopReport; }
            set { m_requestSopReport = value; }
        }

        public Common.BLL.Models.Request.RequestSaveSettings RequestSaveSettings
        {
            get { return m_requestSaveSettings; }
            set { m_requestSaveSettings = value; }
        }

        public bool? RequestUseParkingUplock
        {
            get { return m_requestUseParkingUplock; }
            set { m_requestUseParkingUplock = value; }
        }

        public UpdateParkingUplock UpdateParkingUplock
        {
            get { return m_updateParkingUplock; }
            set { m_updateParkingUplock = value; }
        }
    }

    public class RequestUpdateNvrList
    {
        private List<Nvr> m_updateList = new List<Nvr>();

        public List<Nvr> UpdateList
        {
            get { return m_updateList; }
            set { m_updateList = value; }
        }
    }

    public class RequestCCTVList
    {
        private int m_nSiteID = -1;

        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }
    }

    public class RequestCCTVList2
    {
        private List<int> m_cctvIDs = new List<int>();

        public List<int> CctvIDs
        {
            get { return m_cctvIDs; }
            set { m_cctvIDs = value; }
        }
    }

    public class UpdateCCTVList
    {
        private List<ResponseCCTVList.CCTVData> m_cctvList = new List<ResponseCCTVList.CCTVData>();

        public List<ResponseCCTVList.CCTVData> CCTVList
        {
            get { return m_cctvList; }
            set { m_cctvList = value; }
        }
    }

    public class RequestParkingGateList
    {
        private int m_nSiteID = -1;

        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }
    }

    // 화재시 열리지 않은 출입문 목록 얻어오기
    public class RequestDoorStatus
    {
        private int m_nSiteID = -1;

        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }
    }

    // 전체 출입문 목록 얻어오기
    public class RequestAllDoors
    {
        private int m_nSiteID = -1;

        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }
    }

    // 비상구 목록 얻어오기
    public class RequestExitList
    {
        private int m_nSiteID = -1;

        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }
    }

    public class RequestUPSStatus
    {
        private int m_nSiteID = -1;

        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }
    }

    public class UpdateSensorEnabled
    {
        public class SensorDatas
        {
            private string m_strSensorType = "";
            private List<int> m_sensorIDs = new List<int>();

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

        private List<SensorDatas> m_enabledSensors = new List<SensorDatas>();
        private List<SensorDatas> m_disabledSensors = new List<SensorDatas>();

        public List<SensorDatas> EnabledSensors
        {
            get { return m_enabledSensors; }
            set { m_enabledSensors = value; }
        }

        public List<SensorDatas> DisabledSensors
        {
            get { return m_disabledSensors; }
            set { m_disabledSensors = value; }
        }
    }

    public class RequestUpdatePOIPositions
    {
        private List<RequestUpdatePOIPosition> m_datas = new List<RequestUpdatePOIPosition>();

        public List<RequestUpdatePOIPosition> Datas
        {
            get { return m_datas; }
            set { m_datas = value; }
        }
    }

    public class RequestUpdatePOIPosition
    {
        private int m_nUserID = -1;
        private string m_strSensorType = "";
        private int m_nSensorID = -1;
        private int m_nZoneID = -1;
        private Vertex3D m_vPos = null;
        private string m_strText = null;

        public int UserID
        {
            get { return m_nUserID; }
            set { m_nUserID = value; }
        }

        public string SensorType
        {
            get { return m_strSensorType; }
            set { m_strSensorType = value; }
        }

        public int SensorID
        {
            get { return m_nSensorID; }
            set { m_nSensorID = value; }
        }

        public int ZoneID
        {
            get { return m_nZoneID; }
            set { m_nZoneID = value; }
        }

        public Vertex3D Position
        {
            get { return m_vPos; }
            set { m_vPos = value; }
        }

        public string Text
        {
            get { return m_strText; }
            set { m_strText = value; }
        }
    }

    public class RequestEarthquakeHistory
    {
        private int m_quaterNo = 1;

        public int QuaterNo
        {
            get { return m_quaterNo; }
            set { m_quaterNo = value; }
        }
    }

    public class RequestFirstAidEquipmentList
    {
        private int? m_siteID = null;

        public int? SiteID
        {
            get { return m_siteID; }
            set { m_siteID = value; }
        }
    }

    public class RequestNewFirstAidEquipment
    {
        private string m_strSensorType = null;

        public string SensorType
        {
            get { return m_strSensorType; }
            set { m_strSensorType = value; }
        }
    }

    public class RequestDeleteSensors
    {
        public class Sensor
        {
            private int m_nID = -1;
            private string m_strSensorType = "";

            public int ID
            {
                get { return m_nID; }
                set { m_nID = value; }
            }

            public string SensorType
            {
                get { return m_strSensorType; }
                set { m_strSensorType = value; }
            }
        }

        private List<Sensor> m_sensors = new List<Sensor>();

        public List<Sensor> Sensors
        {
            get { return m_sensors; }
            set { m_sensors = value; }
        }
    }

    public class RequestAlarmReport
    {
        private List<int> m_sensorZoneHistoryIDs = new List<int>();

        public List<int> SensorZoneHistoryIDs
        {
            get { return m_sensorZoneHistoryIDs; }
            set { m_sensorZoneHistoryIDs = value; }
        }
    }

    public class RequestSopReport
    {
        private List<int> m_actionStepHistoryIDs = new List<int>();

        public List<int> ActionStepHistoryIDs
        {
            get { return m_actionStepHistoryIDs; }
            set { m_actionStepHistoryIDs = value; }
        }
    }

    public class UpdateParkingUplock
    {
        private bool m_use = true;

        public bool Use
        {
            get { return m_use; }
            set { m_use = value; }
        }
    }
}
