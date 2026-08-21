using SOPManager.BLL.Models.Request;
using System.Collections.Generic;

namespace Industrial.BLL.Model.Request
{
    public class RequestData
    {
        private bool? m_requestAllSensors = null;
        private RequestSaveViewport m_requestSaveViewport = null;
        private bool? m_requestViewport = null;
        private bool? m_requestMaterialAlarmDatas = null;
        private bool? m_requestSensorDatas = null;
        private bool? m_requestSensorDataHistory = null;
        private bool? m_requestMaterialLinks = null;
        private bool? m_requestPublicData = null;
        private bool? m_requestSensorLink = null;
        private bool? m_requestYeosuSettings = null;
        private RequestYeosuSaveSettings m_requestYeosuSaveSettings = null;
        private bool? m_requestDownloadSensor = null;
        private RequestSendSMS m_requestSendSMS = null;
        private UpdateSensorCoordinates m_updateSensorCoordinates = null;
        private RequestSensorDataHistoryByConditions m_requestSensorDataHistoryByConditions = null;

        public bool? RequestAllSensors
        {
            get { return m_requestAllSensors; }
            set { m_requestAllSensors = value; }
        }

        public RequestSaveViewport RequestSaveViewport
        {
            get { return m_requestSaveViewport; }
            set { m_requestSaveViewport = value; }
        }

        public bool? RequestViewport
        {
            get { return m_requestViewport; }
            set { m_requestViewport = value; }
        }

        // 센서타입별 알람설정값을 얻어온다.
        public bool? RequestMaterialAlarmDatas
        {
            get { return m_requestMaterialAlarmDatas; }
            set { m_requestMaterialAlarmDatas = value; }
        }

        public bool? RequestPublicData
        {
            get { return m_requestPublicData; }
            set { m_requestPublicData = value; }
        }

        public bool? RequestMaterialLinks
        {
            get { return m_requestMaterialLinks; }
            set { m_requestMaterialLinks = value; }
        }
        public bool? RequestSensorDataHistory
        {
            get { return m_requestSensorDataHistory; }
            set { m_requestSensorDataHistory = value; }
        }

        public bool? RequestSensorDatas
        {
            get { return m_requestSensorDatas; }
            set { m_requestSensorDatas = value; }
        }

        public bool? RequestSensorLink
        {
            get { return m_requestSensorLink; }
            set { m_requestSensorLink = value; }
        }

        public bool? RequestYeosuSettings
        {
            get { return m_requestYeosuSettings; }
            set { m_requestYeosuSettings = value; }
        }

        public RequestYeosuSaveSettings RequestYeosuSaveSettings
        {
            get { return m_requestYeosuSaveSettings; }
            set { m_requestYeosuSaveSettings = value; }
        }

        public bool? RequestDownloadSensor
        {
            get { return m_requestDownloadSensor; }
            set { m_requestDownloadSensor = value; }
        }

        public RequestSendSMS RequestTestSMS
        {
            get { return m_requestSendSMS; }
            set { m_requestSendSMS = value; }
        }

        public UpdateSensorCoordinates UpdateSensorCoordinates
        {
            get { return m_updateSensorCoordinates; }
            set { m_updateSensorCoordinates = value; }
        }

        public RequestSensorDataHistoryByConditions RequestSensorDataHistoryByConditions
        {
            get { return m_requestSensorDataHistoryByConditions; }
            set { m_requestSensorDataHistoryByConditions = value; }
        }

    }

    public class RequestSensorDataHistoryByConditions
    {
        //sensorType, zoneID, materials, dataPeriodType, beginDate, endDate
        private int m_nSensorType = -1;
        private List<int> m_nZoneIDs = null;
        private List<int> m_strMaterials = null;
        private int m_nDataPeriodType = 0;
        private string m_strBeginDate = "";
        private string m_strEndDate = "";

        public int SensorType
        {
            get { return m_nSensorType; }
            set { m_nSensorType = value; }
        }

        public List<int> ZoneIDs
        {
            get { return m_nZoneIDs; }
            set { m_nZoneIDs = value; }
        }

        public List<int> Materials
        {
            get { return m_strMaterials; }
            set { m_strMaterials = value; }
        }

        public int DataPeriodType
        {
            get { return m_nDataPeriodType; }
            set { m_nDataPeriodType = value; }
        }

        public string BeginDate
        {
            get { return m_strBeginDate; }
            set { m_strBeginDate = value; }
        }

        public string EndDate
        {
            get { return m_strEndDate; }
            set { m_strEndDate = value; }
        }
    }

    public class RequestYeosuSaveSettings
    {
        private string m_strUseReceiveAtmosphere = "";
        private string m_strUseReceiveWater = "";
        private string m_strUseReceiveVOC = "";
        private string m_strUseReceiveOU = "";

        public string UseReceiveAtmosphere
        {
            get { return m_strUseReceiveAtmosphere; }
            set { m_strUseReceiveAtmosphere= value; }
        }

        public string UseReceiveWater
        {
            get { return m_strUseReceiveWater; }
            set { m_strUseReceiveWater = value; }
        }
        public string UseReceiveVOC
        {
            get { return m_strUseReceiveVOC; }
            set { m_strUseReceiveVOC = value; }
        }
        public string UseReceiveOU
        {
            get { return m_strUseReceiveOU; }
            set { m_strUseReceiveOU = value; }
        }
    }

    public class RequestSaveViewport
    {
        private float m_locationX = 0;
        private float m_locationY = 0;
        private float m_locationZ = 0;
        private float m_rotationX = 0;
        private float m_rotationY = 0;
        private float m_rotationZ = 0;

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
    }

    public class RequestSendSMS
    {
        private string m_message = "";

        public string Message
        {
            get { return m_message; }
        }
    }

    public class UpdateSensorCoordinates
    {
        private List<Coordinates> m_coordinates = new List<Coordinates>();

        public List<Coordinates> Coordinates
        {
            get { return m_coordinates; }
            set { m_coordinates = value; }
        }
    }

    public class Coordinates
    {
        private int m_nID = -1;
        private string latitude = null;
        private string longitude = null;
        private string x = null;
        private string y = null;

        public int ID
        {
            get { return m_nID; }
            set { m_nID = value; }
        }

        public string Latitude
        {
            get { return latitude; }
            set { latitude = value; }
        }

        public string Longitude
        {
            get { return longitude; }
            set { longitude = value; }
        }

        public string X
        {
            get { return x; }
            set { x = value; }
        }

        public string Y
        {
            get { return y; }
            set { y = value; }
        }
    }

}
