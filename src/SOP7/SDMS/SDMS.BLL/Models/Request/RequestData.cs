using UnE.Geometry;
using System.Collections.Generic;

namespace SDMS.BLL.Models.Request
{
    using Data;

    public class RequestData
    {
        private RequestBuildingGroupList m_requestBuildingGroupList = null;
        private RequestGltfDataList m_requestGltfDataList = null;
        private RequestSaveViewport m_requestSaveViewport = null;
        private RequestMoveBuildingNameText m_requestMoveBuildingNameText = null;
        private RequestMoveEquipZoneNameText m_requestMoveEquipZoneNameText = null;
        private RequestSensorList m_requestSensorList = null;
        private RequestMoveSensor m_requestMoveSensor = null;
        private RequestMalfunction m_requestMalfunction = null;
        private RequestSituationNotice m_requestSituationNotice = null;
        private RequestEquipZoneCCTV m_requestEquipZoneCCTV = null;
        private RequestEquipZoneCCTVFromSensor m_requestEquipZoneCCTVFromSensor = null;
        private RequestEquipZoneSensorList m_requestEquipZoneSensorList = null;
        private RequestUpdateEquipZoneCCTVs m_requestUpdateEquipZoneCCTVs = null;
        private RequestGetOrgSensorID m_requestGetOrgSensorID = null;
        private RequestSensorCount m_requestSensorCount = null;
        private bool? m_requestStreamServerURL = null;
        private bool? m_requestFacilityTypes = null;
        private RequestFacilityType m_requestFacilityType = null;
        private bool? m_requestAllFacilityInfo = null;
        private RequestUpdatePOIPosition m_requestUpdatePOIPosition = null;
        private RequestUpdatePOIPositions m_requestUpdatePOIPositions = null;
        private RequestUpdateCCTVs m_requestUpdateCCTVs = null;
        private RequestFacilityInfoData m_requestFacilityInfoData = null;
        private RequestBuildingData m_requestBuildingData = null;
        private RequestBuildingGroupData m_requestBuildingGroupData = null;
        private RequestOuterData m_requestOuterDatas = null;
        private RequestIndoorData m_requestIndoorDatas = null;
        private RequestSaveIndoorModelViewport m_requestSaveIndoorModelViewport = null;
        private RequestSaveOrthoModelViewport m_requestSaveOrthoModelViewport = null;
        private RequestFakeWalls m_requestFakeWalls = null;
        private RequestUpdateFakeWall m_requestUpdateFakeWall = null;
        private RequestUpdateFakeWalls m_requestUpdateFakeWalls = null;
        private RequestManualReport m_requestManualReport = null;
        private RequestAllClearReport m_requestAllClearReport = null;
        private RequestClearManualReport m_requestClearManualReport = null;
        private bool? m_requestNewCCTVList = null;
        private bool? m_requestTodayAlarmData = null;
        private bool? m_requestGetSiteID = null;
        private bool? m_requestGetSpreadMessage = null;
        private RequestSetSpreadMessage m_requestSetSpreadMessage = null;
        private bool? m_requestMaterials = null;
        private bool? m_requestRangeSensors = null;
        private ReqeustImagePath m_requestImagePath = null;
        private bool? m_requestworkerInfos = null;
        private bool? m_requestSensorZoneHistories = null;
        private RequestUpdateEquipZoneAreas m_requestUpdateEquipZoneAreas = null;
        private RequestEquipZoneAreas m_requestEquipZoneAreas = null;
        private RequestUpdateSensorEquipZones m_requestUpdateSensorEquipZones = null;
        private RequestGetAlarmMemos m_requestGetAlarmMemos = null;
        private bool? m_requestYearStatus = null;
        private RequestUpdateSensorCoordinatesFor2D m_requestUpdateSensorCoordinatesFor2D = null;
        private RequestUpdateSensorsFor2D m_requestUpdateSensorsFor2D = null;
        private RequestElevator m_requestElevators = null;
        private RequestAlarmData m_requestAlarmData = null;
        private UpdateSensorEnabled m_updateSensorEnabled = null;
        private RequestAllDoors m_requestAllDoors = null;
        private RequestDoorStatus m_requestDoorStatus = null;

        public bool? RequestSensorZoneHistories
        {
            get { return m_requestSensorZoneHistories; }
            set { m_requestSensorZoneHistories = value; }
        }

        public RequestBuildingGroupList RequestBuildingGroupList
        {
            get { return m_requestBuildingGroupList; }
            set { m_requestBuildingGroupList = value; }
        }

        public RequestGltfDataList RequestGltfDataList
        {
            get { return m_requestGltfDataList; }
            set { m_requestGltfDataList = value; }
        }

        public RequestSaveViewport RequestSaveViewport
        {
            get { return m_requestSaveViewport; }
            set { m_requestSaveViewport = value; }
        }

        public RequestMoveBuildingNameText RequestMoveBuildingNameText
        {
            get { return m_requestMoveBuildingNameText; }
            set { m_requestMoveBuildingNameText = value; }
        }

        public RequestMoveEquipZoneNameText RequestMoveEquipZoneNameText
        {
            get { return m_requestMoveEquipZoneNameText; }
            set { m_requestMoveEquipZoneNameText = value; }
        }

        public RequestSensorList RequestSensorList
        {
            get { return m_requestSensorList; }
            set { m_requestSensorList = value; }
        }

        public RequestMoveSensor RequestMoveSensor
        {
            get { return m_requestMoveSensor; }
            set { m_requestMoveSensor = value; }
        }

        public RequestMalfunction RequestMalfunction
        {
            get { return m_requestMalfunction; }
            set { m_requestMalfunction = value; }
        }

        public RequestSituationNotice RequestSituationNotice
        {
            get { return m_requestSituationNotice; }
            set { m_requestSituationNotice = value; }
        }

        public RequestEquipZoneCCTV RequestEquipZoneCCTV
        {
            get { return m_requestEquipZoneCCTV; }
            set { m_requestEquipZoneCCTV = value; }
        }

        public RequestEquipZoneCCTVFromSensor RequestEquipZoneCCTVFromSensor
        {
            get { return m_requestEquipZoneCCTVFromSensor; }
            set { m_requestEquipZoneCCTVFromSensor = value; }
        }

        public RequestEquipZoneSensorList RequestEquipZoneSensorList
        {
            get { return m_requestEquipZoneSensorList; }
            set { m_requestEquipZoneSensorList = value; }
        }

        public RequestUpdateEquipZoneCCTVs RequestUpdateEquipZoneCCTVs
        {
            get { return m_requestUpdateEquipZoneCCTVs; }
            set { m_requestUpdateEquipZoneCCTVs = value; }
        }

        public RequestGetOrgSensorID RequestGetOrgSensorID
        {
            get { return m_requestGetOrgSensorID; }
            set { m_requestGetOrgSensorID = value; }
        }

        public RequestSensorCount RequestSensorCount
        {
            get { return m_requestSensorCount; }
            set { m_requestSensorCount = value; }
        }

        public bool? RequestStreamServerURL
        {
            get { return m_requestStreamServerURL; }
            set { m_requestStreamServerURL = value; }
        }
        public bool? RequestFacilityTypes
        {
            get { return m_requestFacilityTypes; }
            set { m_requestFacilityTypes = value; }
        }
        public RequestFacilityType RequestFacilityType
        {
            get { return m_requestFacilityType; }
            set { m_requestFacilityType = value; }
        }

        public bool? RequestAllFacilityInfo
        {
            get { return m_requestAllFacilityInfo; }
            set { m_requestAllFacilityInfo = value; }
        }

        public RequestUpdatePOIPosition RequestUpdatePOIPosition
        {
            get { return m_requestUpdatePOIPosition; }
            set { m_requestUpdatePOIPosition = value; }
        }

        public RequestUpdatePOIPositions RequestUpdatePOIPositions
        {
            get { return m_requestUpdatePOIPositions; }
            set { m_requestUpdatePOIPositions = value; }
        }

        public RequestUpdateCCTVs RequestUpdateCCTVs
        {
            get { return m_requestUpdateCCTVs; }
            set { m_requestUpdateCCTVs = value; }
        }

        public RequestFacilityInfoData RequestFacilityInfoData
        {
            get { return m_requestFacilityInfoData; }
            set { m_requestFacilityInfoData = value; }
        }

        public RequestBuildingData RequestBuildingData
        {
            get { return m_requestBuildingData; }
            set { m_requestBuildingData = value; }
        }

        public RequestBuildingGroupData RequestBuildingGroupData
        {
            get { return m_requestBuildingGroupData; }
            set { m_requestBuildingGroupData = value; }
        }

        public RequestOuterData RequestOuterDatas
        {
            get { return m_requestOuterDatas; }
            set { m_requestOuterDatas = value; }
        }

        public RequestIndoorData RequestIndoorDatas
        {
            get { return m_requestIndoorDatas; }
            set { m_requestIndoorDatas = value; }
        }

        public RequestSaveIndoorModelViewport RequestSaveIndoorModelViewport
        {
            get { return m_requestSaveIndoorModelViewport; }
            set { m_requestSaveIndoorModelViewport = value; }
        }

        public RequestSaveOrthoModelViewport RequestSaveOrthoModelViewport
        {
            get { return m_requestSaveOrthoModelViewport; }
            set { m_requestSaveOrthoModelViewport = value; }
        }

        public RequestFakeWalls RequestFakeWalls
        {
            get { return m_requestFakeWalls; }
            set { m_requestFakeWalls = value; }
        }

        public RequestUpdateFakeWall RequestUpdateFakeWall
        {
            get { return m_requestUpdateFakeWall; }
            set { m_requestUpdateFakeWall = value; }
        }

        public RequestUpdateFakeWalls RequestUpdateFakeWalls
        {
            get { return m_requestUpdateFakeWalls; }
            set { m_requestUpdateFakeWalls = value; }
        }

        public RequestManualReport RequestManualReport
        {
            get { return m_requestManualReport; }
            set { m_requestManualReport = value; }
        }

        public RequestAllClearReport RequestAllClearReport
        {
            get { return m_requestAllClearReport; }
            set { m_requestAllClearReport = value; }
        }

        public RequestClearManualReport RequestClearManualReport
        {
            get { return m_requestClearManualReport; }
            set { m_requestClearManualReport = value; }
        }

        public bool? RequestNewCCTVList
        {
            get { return m_requestNewCCTVList; }
            set { m_requestNewCCTVList = value; }
        }

        public bool? RequestTodayAlarmData
        {
            get { return m_requestTodayAlarmData; }
            set { m_requestTodayAlarmData = value; }
        }

        public bool? RequestGetSiteID
        {
            get { return m_requestGetSiteID; }
            set { m_requestGetSiteID = value; }
        }

        public bool? RequestGetSpreadMessage
        {
            get { return m_requestGetSpreadMessage; }
            set { m_requestGetSpreadMessage = value; }
        }

        public RequestSetSpreadMessage RequestSetSpreadMessage
        {
            get { return m_requestSetSpreadMessage; }
            set { m_requestSetSpreadMessage = value; }
        }

        public bool? RequestMaterials
        {
            get { return m_requestMaterials; }
            set { m_requestMaterials = value; }
        }

        public bool? RequestRangeSensors
        {
            get { return m_requestRangeSensors; }
            set { m_requestRangeSensors = value; }
        }

        public ReqeustImagePath RequestImagePath
        {
            get { return m_requestImagePath; }
            set { m_requestImagePath = value; }
        }

        public bool? RequestWorkerInfos
        {
            get { return m_requestworkerInfos; }
            set { m_requestworkerInfos = value; }
        }

        public RequestUpdateEquipZoneAreas RequestUpdateEquipZoneAreas
        {
            get { return m_requestUpdateEquipZoneAreas; }
            set { m_requestUpdateEquipZoneAreas = value; }
        }

        public RequestEquipZoneAreas RequestEquipZoneAreas
        {
            get { return m_requestEquipZoneAreas; }
            set { m_requestEquipZoneAreas = value; }
        }

        public RequestUpdateSensorEquipZones RequestUpdateSensorEquipZones
        {
            get { return m_requestUpdateSensorEquipZones; }
            set { m_requestUpdateSensorEquipZones = value; }
        }

        public RequestGetAlarmMemos RequestGetAlarmMemos
        {
            get { return m_requestGetAlarmMemos; }
            set { m_requestGetAlarmMemos = value; }
        }

        public bool? RequestYearStatus
        {
            get { return m_requestYearStatus; }
            set { m_requestYearStatus = value; }
        }

        public RequestUpdateSensorCoordinatesFor2D RequestUpdateSensorCoordinatesFor2D
        {
            get { return m_requestUpdateSensorCoordinatesFor2D; }
            set { m_requestUpdateSensorCoordinatesFor2D = value; }
        }

        public RequestUpdateSensorsFor2D RequestUpdateSensorsFor2D
        {
            get { return m_requestUpdateSensorsFor2D; }
            set { m_requestUpdateSensorsFor2D = value; }
        }

        public RequestElevator RequestElevators
        {
            get { return m_requestElevators; }
            set { m_requestElevators = value; }
        }

        public RequestAlarmData RequestAlarmData
        {
            get { return m_requestAlarmData; }
            set { m_requestAlarmData = value; }
        }

        public UpdateSensorEnabled UpdateSensorEnabled
        {
            get { return m_updateSensorEnabled; }
            set { m_updateSensorEnabled = value; }
        }

        public RequestAllDoors RequestAllDoors
        {
            get { return m_requestAllDoors; }
            set { m_requestAllDoors = value; }
        }

        public RequestDoorStatus RequestDoorStatus
        {
            get { return m_requestDoorStatus; }
            set { m_requestDoorStatus = value; }
        }
    }

    public class RequestElevator
    {
        private int m_nSiteID = -1;
        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }
    }

    public class RequestOuterData
    {
        private List<int> m_siteIDs = null;
        public List<int> SiteIDs
        {
            get { return m_siteIDs; }
            set { m_siteIDs = value; }
        }
    }

    public class RequestIndoorData
    {
        private int m_nZoneID = -1;
        private List<int> m_siteIDs = null;
        public int ZoneID
        {
            get { return m_nZoneID; }
            set { m_nZoneID = value; }
        }
        public List<int> SiteIDs
        {
            get { return m_siteIDs; }
            set { m_siteIDs = value; }
        }
    }

    public class RequestFacilityInfoData
    {
        private string m_strModelName = "";

        public string ModelName
        {
            get { return m_strModelName; }
            set { m_strModelName = value; }
        }
    }

    public class RequestBuildingData
    {
        private string m_strBuildingName = "";

        public string BuildingName
        {
            get { return m_strBuildingName; }
            set { m_strBuildingName = value; }
        }
    }

    public class RequestBuildingGroupData
    {
        private int m_nBuildingGroupID = -1;

        public int BuildingGroupID
        {
            get { return m_nBuildingGroupID; }
            set { m_nBuildingGroupID = value; }
        }
    }

    public class RequestMoveSensor
    {
        private string m_strSensorType = "";
        private int m_nSensorID = -1;
        private float x = 0;
        private float z = 0;

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

        public float X
        {
            get { return x; }
            set { x = value; }
        }

        public float Z
        {
            get { return z; }
            set { z = value; }
        }
    }

    public class RequestSensorList
    {
        private bool m_requestFireSensors = false;
        private bool m_requestPSMSensors = false;
        private bool m_requestEtcSensors = false;
        private bool m_requestCCTVs = false;
        private bool m_requestEarthquakeSensors = false;
        private bool m_requestStrongWindSensors = false;
        private bool m_requestEnvironmentSensors = false;
        private bool m_requestManufactureSensors = false;
        private bool m_requestEmergencyBellSensors = false;
        private bool m_requestLaserSensors = false;
        private bool m_requestDoorSensors = false;
        private bool m_requestLowBatterySensors = false;
        private bool m_requestSpeedDetectionSensors = false;
        private List<int> m_siteIDs = null;
        private bool? m_enabled = null;
        private string m_strSearchText = null;
        private int? m_pageIndex = null;
        private int? m_pageItemCount = null;

        public bool RequestFireSensors
        {
            get { return m_requestFireSensors; }
            set { m_requestFireSensors = value; }
        }

        public bool RequestPSMSensors
        {
            get { return m_requestPSMSensors; }
            set { m_requestPSMSensors = value; }
        }

        public bool RequestEtcSensors
        {
            get { return m_requestEtcSensors; }
            set { m_requestEtcSensors = value; }
        }

        public bool RequestCCTVs
        {
            get { return m_requestCCTVs; }
            set { m_requestCCTVs = value; }
        }

        public bool RequestEarthquakeSensors
        {
            get { return m_requestEarthquakeSensors; }
            set { m_requestEarthquakeSensors = value; }
        }

        public bool RequestStrongWindSensors
        {
            get { return m_requestStrongWindSensors; }
            set { m_requestStrongWindSensors = value; }
        }

        public bool RequestEnvironmentSensors
        {
            get { return m_requestEnvironmentSensors; }
            set { m_requestEnvironmentSensors = value; }
        }

        public bool RequestManufactureSensors
        {
            get { return m_requestManufactureSensors; }
            set { m_requestManufactureSensors = value; }
        }

        public bool RequestEmergencyBellSensors
        {
            get { return m_requestEmergencyBellSensors; }
            set { m_requestEmergencyBellSensors = value; }
        }
        
        public bool RequestLaserSensors
        {
            get { return m_requestLaserSensors; }
            set { m_requestLaserSensors = value; }
        }
        
        public bool RequestDoorSensors
        {
            get { return m_requestDoorSensors; }
            set { m_requestDoorSensors = value; }
        }

        public bool RequestLowBatterySensors
        {
            get { return m_requestLowBatterySensors; }
            set { m_requestLowBatterySensors = value; }
        }

        public bool RequestSpeedDetectionSensors
        {
            get { return m_requestSpeedDetectionSensors; }
            set { m_requestSpeedDetectionSensors = value; }
        }

        public List<int> SiteIDs
        {
            get { return m_siteIDs; }
            set { m_siteIDs = value; }
        }

        public bool? Enabled
        {
            get { return m_enabled; }
            set { m_enabled = value; }
        }

        public string SearchText
        {
            get { return m_strSearchText; }
            set { m_strSearchText = value; }
        }

        public int? PageIndex
        {
            get { return m_pageIndex; }
            set { m_pageIndex = value; }
        }

        public int? PageItemCount
        {
            get { return m_pageItemCount; }
            set { m_pageItemCount = value; }
        }
    }

    public class RequestMoveBuildingNameText
    {
        private string m_strBuildingGroupName = "";
        private string m_strBuildingName = "";
        private float x = 0;
        private float y = 0;
        private float z = 0;

        public string BuildingGroupName
        {
            get { return m_strBuildingGroupName; }
            set { m_strBuildingGroupName = value; }
        }

        public string BuildingName
        {
            get { return m_strBuildingName; }
            set { m_strBuildingName = value; }
        }

        public float X
        {
            get { return x; }
            set { x = value; }
        }

        public float Y
        {
            get { return y; }
            set { y = value; }
        }

        public float Z
        {
            get { return z; }
            set { z = value; }
        }
    }

    public class RequestMoveEquipZoneNameText
    {
        private int m_nEquipZoneID = 0;
        private string m_strDisplayText = "";
        private float x = 0;
        private float y = 0;
        private float z = 0;

        public int EquipZoneID
        {
            get { return m_nEquipZoneID; }
            set { m_nEquipZoneID = value; }
        }

        public string DisplayText
        {
            get { return m_strDisplayText; }
            set { m_strDisplayText = value; }
        }

        public float X
        {
            get { return x; }
            set { x = value; }
        }

        public float Y
        {
            get { return y; }
            set { y = value; }
        }

        public float Z
        {
            get { return z; }
            set { z = value; }
        }
    }

    public class RequestSaveViewport
    {
        private int? m_userID = null;
        private string m_strModelName = "";
        private string m_strModelFile = "";
        private string m_strModelDisplayText = null;
        private Vertex3D m_vCameraPosition = null;
        private Quaternion m_qCameraQuaternion = null;
        private Vertex3D m_vCameraRotation = null;
        private Vertex3D m_vOrbitTarget = null;
        private int m_nCameraFov = 0;
        private float m_fCameraFar = 0;
        private float m_fCameraNear = 0;
        private int? m_nFloorIndex = null;
        private int? m_nBuildingGroupID = null;
        private int? m_nBuildingID = null;
        private int? m_nZoneID = null;

        public int? UserID
        {
            get { return m_userID; }
            set { m_userID = value; }
        }

        public string ModelName
        {
            get { return m_strModelName; }
            set { m_strModelName = value; }
        }

        public string ModelFile
        {
            get { return m_strModelFile; }
            set { m_strModelFile = value; }
        }

        public string ModelDisplayText
        {
            get { return m_strModelDisplayText; }
            set { m_strModelDisplayText = value; }
        }

        public Vertex3D CameraPosition
        {
            get { return m_vCameraPosition; }
            set { m_vCameraPosition = value; }
        }

        public Quaternion CameraQuaternion
        {
            get { return m_qCameraQuaternion; }
            set { m_qCameraQuaternion = value; }
        }

        public Vertex3D CameraRotation
        {
            get { return m_vCameraRotation; }
            set { m_vCameraRotation = value; }
        }

        public Vertex3D OrbitTarget
        {
            get { return m_vOrbitTarget; }
            set { m_vOrbitTarget = value; }
        }

        public int Fov
        {
            get { return m_nCameraFov; }
            set { m_nCameraFov = value; }
        }

        public float Near
        {
            get { return m_fCameraNear; }
            set { m_fCameraNear = value; }
        }

        public float Far
        {
            get { return m_fCameraFar; }
            set { m_fCameraFar = value; }
        }

        public int? FloorIndex
        {
            get { return m_nFloorIndex; }
            set { m_nFloorIndex = value; }
        }

        public int? BuildingGroupID
        {
            get { return m_nBuildingGroupID; }
            set { m_nBuildingGroupID = value; }
        }

        public int? BuildingID
        {
            get { return m_nBuildingID; }
            set { m_nBuildingID = value; }
        }

        public int? ZoneID
        {
            get { return m_nZoneID; }
            set { m_nZoneID = value; }
        }
    }

    public class RequestMalfunction
    {
        private int m_nSensorType = -1;
        public int SensorType
        {
            get { return m_nSensorType; }
            set { m_nSensorType = value; }
        }

        private int m_nSensorZoneID = -1;
        public int SensorZoneID
        {
            get { return m_nSensorZoneID; }
            set { m_nSensorZoneID = value; }
        }

        private int m_nAccessedUserID = -1;
        public int AccessedUserID
        {
            get { return m_nAccessedUserID; }
            set { m_nAccessedUserID = value; }
        }

        private bool m_isMalfunction = true;
        public bool IsMalfunction
        {
            get { return m_isMalfunction; }
            set { m_isMalfunction = value; }
        }
    }

    /// <summary>
    /// 상황 전파
    /// </summary>
    public class RequestSituationNotice
    {
        private int m_nSensorType = -1;
        public int SensorType
        {
            get { return m_nSensorType; }
            set { m_nSensorType = value; }
        }

        private int m_nSensorZoneID = -1;
        public int SensorZoneID
        {
            get { return m_nSensorZoneID; }
            set { m_nSensorZoneID = value; }
        }
    }

    public class RequestEquipZoneCCTV
    {
        private int m_nEquipZoneID = -1;

        public int EquipZoneID
        {
            get { return m_nEquipZoneID; }
            set { m_nEquipZoneID = value; }
        }
    }

    public class RequestEquipZoneCCTVFromSensor
    {
        private string m_strSensorType = "";
        private int m_nSensorID = -1;

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
    }

    // 같은 EquipZone 내에 존재하는 같은 SensorType의 Sensor들을 요청한다.
    public class RequestEquipZoneSensorList
    {
        private string m_strSensorType = "";
        private int m_nSensorID = -1;

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
    }

    public class RequestUpdateEquipZoneCCTVs
    {
        private List<Model.CCTV.EquipZoneCCTV> m_equipZoneCCTVs = new List<Model.CCTV.EquipZoneCCTV>();

        public List<Model.CCTV.EquipZoneCCTV> EquipZoneCCTVs
        {
            get { return m_equipZoneCCTVs; }
            set { m_equipZoneCCTVs = value; }
        }
    }

    public class RequestGetOrgSensorID
    {
        private int m_nSensorZoneID = -1;

        public int SensorZoneID
        {
            get { return m_nSensorZoneID; }
            set { m_nSensorZoneID = value; }
        }
    }

    public class RequestFacilityType
    {
        private int m_nFacilityTypeID = -1;

        public int FacilityTypeID
        {
            get { return m_nFacilityTypeID; }
            set { m_nFacilityTypeID = value; }
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

    public class RequestUpdatePOIPositions
    {
        private List<RequestUpdatePOIPosition> m_datas = new List<RequestUpdatePOIPosition>();
        private IUpdateDataManager m_updateDataManager = null;

        public List<RequestUpdatePOIPosition> Datas
        {
            get { return m_datas; }
            set { m_datas = value; }
        }

        public IUpdateDataManager UpdateDataManager
        {
            get { return m_updateDataManager; }
            set { m_updateDataManager = value; }
        }
    }

    public class UpdateCCTV
    {
        private int m_nID = -1;
        private int? m_nZoneID = -1;
        private float? x = 0;
        private float? y = 0;
        private float? z = 0;

        public int ID
        {
            get { return m_nID; }
            set { m_nID = value; }
        }

        public int? ZoneID
        {
            get { return m_nZoneID; }
            set { m_nZoneID = value; }
        }

        public float? X
        {
            get { return x; }
            set { x = value; }
        }

        public float? Y
        {
            get { return y; }
            set { y = value; }
        }

        public float? Z
        {
            get { return z; }
            set { z = value; }
        }
    }

    public class RequestUpdateCCTVs
    {
        private int m_nUserID = -1;
        private List<UpdateCCTV> m_updateCCTVs = new List<UpdateCCTV>();

        public int UserID
        {
            get { return m_nUserID; }
            set { m_nUserID = value; }
        }

        public List<UpdateCCTV> UpdateCCTVs
        {
            get { return m_updateCCTVs; }
            set { m_updateCCTVs = value; }
        }
    }

    public class RequestSaveIndoorModelViewport
    {
        private int? m_userID = null;
        private string m_strModelName = "";
        private Vertex3D m_vCameraPos = null;
        private Quaternion m_qCameraQuaternion = null;
        private Vertex3D m_vCameraRotation = null;
        private Vertex3D m_vOrbitTarget = null;
        // 이 값이 null이면 m_strModelName을 이용하여 업데이트 한다.
        private int? m_nZoneID = null;

        public int? UserID
        {
            get { return m_userID; }
            set { m_userID = value; }
        }

        public string ModelName
        {
            get { return m_strModelName; }
            set { m_strModelName = value; }
        }

        public Vertex3D CameraPosition
        {
            get { return m_vCameraPos; }
            set { m_vCameraPos = value; }
        }

        public Quaternion CameraQuaternion
        {
            get { return m_qCameraQuaternion; }
            set { m_qCameraQuaternion = value; }
        }

        public Vertex3D CameraRotation
        {
            get { return m_vCameraRotation; }
            set { m_vCameraRotation = value; }
        }

        public Vertex3D OrbitTarget
        {
            get { return m_vOrbitTarget; }
            set { m_vOrbitTarget = value; }
        }

        // 이 값이 null이면 ModelName을 이용하여 업데이트 한다.
        public int? ZoneID
        {
            get { return m_nZoneID; }
            set { m_nZoneID = value; }
        }
    }

    public class RequestSaveOrthoModelViewport
    {
        private int? m_userID = null;
        private string m_strModelName = "";
        private Vertex3D m_vCameraPos = null;
        private Quaternion m_qCameraQuaternion = null;
        private Vertex3D m_vCameraRotation = null;
        private Vertex3D m_vTarget = null;
        private float m_fZoom = 1.0f;
        private int? m_nZoneID = null;

        public int? UserID
        {
            get { return m_userID; }
            set { m_userID = value; }
        }

        public string ModelName
        {
            get { return m_strModelName; }
            set { m_strModelName = value; }
        }

        public Vertex3D CameraPosition
        {
            get { return m_vCameraPos; }
            set { m_vCameraPos = value; }
        }

        public Quaternion CameraQuaternion
        {
            get { return m_qCameraQuaternion; }
            set { m_qCameraQuaternion = value; }
        }

        public Vertex3D CameraRotation
        {
            get { return m_vCameraRotation; }
            set { m_vCameraRotation = value; }
        }

        public Vertex3D Target
        {
            get { return m_vTarget; }
            set { m_vTarget = value; }
        }

        public float Zoom
        {
            get { return m_fZoom; }
            set { m_fZoom = value; }
        }

        public int? ZoneID
        {
            get { return m_nZoneID; }
            set { m_nZoneID = value; }
        }
    }

    public class RequestFakeWalls
    {
        private int m_nZoneID = -1;

        public int ZoneID
        {
            get { return m_nZoneID; }
            set { m_nZoneID = value; }
        }
    }

    public class RequestUpdateFakeWall
    {
        public enum UpdateMode { None = 0, Add, Move, Rotate, Resize, Delete };

        private int m_nUserID = -1;
        private int m_nFakeWallID = -1;
        private int m_nZoneID = -1;
        private float x = 0;
        private float y = 0;
        private float z = 0;
        private float m_fRotate = 0;
        private float m_fScale = 0;
        private int m_nMode = (int)UpdateMode.None;

        public int UserID
        {
            get { return m_nUserID; }
            set { m_nUserID = value; }
        }

        public int FakeWallID
        {
            get { return m_nFakeWallID; }
            set { m_nFakeWallID = value; }
        }

        public int ZoneID
        {
            get { return m_nZoneID; }
            set { m_nZoneID = value; }
        }

        public float X
        {
            get { return x; }
            set { x = value; }
        }

        public float Y
        {
            get { return y; }
            set { y = value; }
        }

        public float Z
        {
            get { return z; }
            set { z = value; }
        }

        // Radian
        public float Rotate
        {
            get { return m_fRotate; }
            set { m_fRotate = value; }
        }

        public float Scale
        {
            get { return m_fScale; }
            set { m_fScale = value; }
        }

        // UpdateMode
        public int Mode
        {
            get { return m_nMode; }
            set { m_nMode = value; }
        }
    }

    public class RequestManualReport
    {
        private string m_strDateTime = "";
        private int m_nSensorType = -1;
        private int m_nSensorZoneID = -1;
        private int m_nZoneID = -1;
        private int m_nAlarmDepth = -1;
        private string m_strReportPerson = "";
        private string m_strMemo = "";

        public string DateTime
        {
            get { return m_strDateTime; }
            set { m_strDateTime = value; }
        }

        public int SensorType
        {
            get { return m_nSensorType; }
            set { m_nSensorType = value; }
        }

        public int SensorZoneID
        {
            get { return m_nSensorZoneID; }
            set { m_nSensorZoneID = value; }
        }

        public int ZoneID
        {
            get { return m_nZoneID; }
            set { m_nZoneID = value; }
        }

        public int AlarmDepth
        {
            get { return m_nAlarmDepth; }
            set { m_nAlarmDepth = value; }
        }

        public string ReportPerson
        {
            get { return m_strReportPerson; }
            set { m_strReportPerson = value; }
        }

        public string Memo
        {
            get { return m_strMemo; }
            set { m_strMemo = value; }
        }
    }

    public class RequestClearManualReport
    {        
        private int m_nSensorType = -1;
        private int m_nSensorZoneID = -1;
        private int m_nSensorZoneHistoryID = -1;
        private int m_nAccessedUserID = -1;

        public int SensorType
        {
            get { return m_nSensorType; }
            set { m_nSensorType = value; }
        }

        public int SensorZoneID
        {
            get { return m_nSensorZoneID; }
            set { m_nSensorZoneID = value; }
        }

        public int SensorZoneHistoryID
        {
            get { return m_nSensorZoneHistoryID; }
            set { m_nSensorZoneHistoryID = value; }
        }

        public int AccessedUserID
        {
            get { return m_nAccessedUserID; }
            set { m_nAccessedUserID = value; }
        }
    }

    public class RequestAllClearReport
    {
        private int m_nSensorType = -1;

        public int SensorType
        {
            get { return m_nSensorType; }
            set { m_nSensorType = value; }
        }
    }

    public class RequestUpdateFakeWalls
    {
        private List<RequestUpdateFakeWall> m_updateDatas = new List<RequestUpdateFakeWall>();

        public List<RequestUpdateFakeWall> UpdateDatas
        {
            get { return m_updateDatas; }
            set { m_updateDatas = value; }
        }
    }

    public class RequestSetSpreadMessage
    {
        private List<SDMS.Model.Config.SpreadMessage> m_addSpreadMessage = null;
        private List<SDMS.Model.Config.SpreadMessage> m_updateSpreadMessage = null;
        private List<SDMS.Model.Config.SpreadMessage> m_removeSpreadMessage = null;

        public List<SDMS.Model.Config.SpreadMessage> AddSpreadMessage
        {
            get { return m_addSpreadMessage; }
            set { m_addSpreadMessage = value; }
        }

        public List<SDMS.Model.Config.SpreadMessage> UpdateSpreadMessage
        {
            get { return m_updateSpreadMessage; }
            set { m_updateSpreadMessage = value; }
        }

        public List<SDMS.Model.Config.SpreadMessage> RemoveSpreadMessage
        {
            get { return m_removeSpreadMessage; }
            set { m_removeSpreadMessage = value; }
        }
    }

    public class RequestGltfDataList
    {
        private int m_nUserID = -1;
        private List<int> m_siteIDs = null;

        public int UserID
        {
            get { return m_nUserID; }
            set { m_nUserID = value; }
        }

        public List<int> SiteIDs
        {
            get { return m_siteIDs; }
            set { m_siteIDs = value; }
        }
    }

    public class RequestBuildingGroupList
    {
        private List<int> m_siteIDs = null;

        public List<int> SiteIDs
        {
            get { return m_siteIDs; }
            set { m_siteIDs = value; }
        }
    }

    public class ReqeustImagePath 
    {
        private int m_zoneID = -1;
        private string m_filePath = "";

        public int ZoneID
        {
            get { return m_zoneID; }
            set { m_zoneID = value; }
        }

        public string FilePath
        {
            get { return m_filePath; }
            set { m_filePath = value; }
        }
    }

    public class RequestUpdateEquipZoneAreas
    {
        private List<RequestUpdateEquipZoneArea> m_updateDatas = new List<RequestUpdateEquipZoneArea>();

        public List<RequestUpdateEquipZoneArea> UpdateDatas
        {
            get { return m_updateDatas; }
            set { m_updateDatas = value; }
        }
    }

    public class RequestUpdateEquipZoneArea
    {
        public enum UpdateMode { None = 0, Add, Move, Rotate, Resize, Delete };

        private int m_nUserID = -1;
        private int m_nZoneID = -1;
        private int m_nEquipZoneID = -1;        
        private List<EquipZoneAreaLine> m_lines = null;
        private int m_nMode = (int)UpdateMode.None;

        public int UserID
        {
            get { return m_nUserID; }
            set { m_nUserID = value; }
        }

        public int ZoneID
        {
            get { return m_nZoneID; }
            set { m_nZoneID = value; }
        }

        public int EquipZoneID
        {
            get { return m_nEquipZoneID; }
            set { m_nEquipZoneID = value; }
        }

        public List<EquipZoneAreaLine> Lines
        {
            get { return m_lines; }
            set { m_lines = value; }
        }

        public int Mode
        {
            get { return m_nMode; }
            set { m_nMode = value; }
        }
    }

    public class EquipZoneAreaLine
    {
        public double X { get; set; }
        public double Z { get; set; }
    }

    public class RequestEquipZoneAreas
    {
        private int m_nZoneID = -1;

        public int ZoneID
        {
            get { return m_nZoneID; }
            set { m_nZoneID = value; }
        }
    }

    public class RequestSensorCount
    {
        public int? SiteID { get; set; }
    }

    public class RequestUpdateSensorEquipZones
    {
        private List<RequestUpdateSensorEquipZone> m_updateDatas = new List<RequestUpdateSensorEquipZone>();

        public List<RequestUpdateSensorEquipZone> UpdateDatas
        {
            get { return m_updateDatas; }
            set { m_updateDatas = value; }
        }
    }

    public class RequestUpdateSensorEquipZone
    {
        private int m_nUserID = -1;
        private string m_strSensorType = "";
        private int m_nSensorID = -1;
        private int m_nEquipZoneID = -1;
        private int m_nZoneID = -1;

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

        public int EquipZoneID
        {
            get { return m_nEquipZoneID; }
            set { m_nEquipZoneID = value; }
        }

        public int ZoneID
        {
            get { return m_nZoneID; }
            set { m_nZoneID = value; }
        }
    }

    public class RequestGetAlarmMemos
    {
        public List<int> SensorZoneHistoryIDs { get; set; }
    }

    public class RequestUpdateSensorsFor2D
    {
        private List<RequestUpdateSensorFor2D> m_updateDatas = new List<RequestUpdateSensorFor2D>();
        
        public List<RequestUpdateSensorFor2D> UpdateDatas
        {
            get { return m_updateDatas; }
            set { m_updateDatas = value; }
        }
    }

    public class RequestUpdateSensorCoordinatesFor2D
    {
        private int m_nSensorType = -1;
        private int m_nSensorID = -1;
        private int x = 0;
        private int y = 0;

        public int SensorType
        {
            get { return m_nSensorType; }
            set { m_nSensorType = value; }
        }

        public int SensorID
        {
            get { return m_nSensorID; }
            set { m_nSensorID = value; }
        }

        public int X
        {
            get { return x; }
            set { x = value; }
        }

        public int Y
        {
            get { return y; }
            set { y = value; }
        }
    }

    public class RequestUpdateSensorFor2D
    {
        private int m_ID = -1;
        private string m_strName = "";

        public int ID
        {
            get { return m_ID; }
            set { m_ID = value; }
        }

        public string Name
        {
            get { return m_strName; }
            set { m_strName = value; }
        }
    }

    public class RequestAlarmData
    {
        private int m_nSensorZoneHistoryID = -1;

        public int SensorZoneHistoryID
        {
            get { return m_nSensorZoneHistoryID; }
            set { m_nSensorZoneHistoryID = value; }
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

    /// 전체 출입문 목록 얻어오기
    public class RequestAllDoors
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
}
