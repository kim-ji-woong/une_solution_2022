using System.Collections.Generic;

namespace Nipa.BLL.Models.Request
{
    public class RequestSensorList
    {
        private bool m_requestFireSensors = false;
        private bool m_requestGasSensors = false;
        private bool m_requestAtmosphereSensors = false;
        private bool m_requestEmergencyBells = false;
        private bool m_requestWorkerTags = false;
        private bool m_requestThermalCCTVs = false;
        private bool m_requestCCTVs = false;
        private int m_nCampusID = -1;

        public bool RequestFireSensors
        {
            get { return m_requestFireSensors; }
            set { m_requestFireSensors = value; }
        }

        public bool RequestGasSensors
        {
            get { return m_requestGasSensors; }
            set { m_requestGasSensors = value; }
        }

        public bool RequestAtmosphereSensors
        {
            get { return m_requestAtmosphereSensors; }
            set { m_requestAtmosphereSensors = value; }
        }

        public bool RequestEmergencyBells
        {
            get { return m_requestEmergencyBells; }
            set { m_requestEmergencyBells = value; }
        }

        public bool RequestWorkerTags
        {
            get { return m_requestWorkerTags; }
            set { m_requestWorkerTags = value; }
        }

        public bool RequestThermalCCTVs
        {
            get { return m_requestThermalCCTVs; }
            set { m_requestThermalCCTVs = value; }
        }

        public bool RequestCCTVs
        {
            get { return m_requestCCTVs; }
            set { m_requestCCTVs = value; }
        }

        public int CampusID
        {
            get { return m_nCampusID; }
            set { m_nCampusID = value; }
        }
    }

    public class RequestBuildingGroupList
    {
        private int m_nCampusID = -1;

        public int CampusID
        {
            get { return m_nCampusID; }
            set { m_nCampusID = value; }
        }
    }

    public class RequestZoneList
    {
        private int m_nCampusID = -1;

        public int CampusID
        {
            get { return m_nCampusID; }
            set { m_nCampusID = value; }
        }
    }

    public class RequestZoneData
    {
        // 0 보다 작으면 outdoor
        private int m_nZoneID = -1;

        // 0 보다 작으면 outdoor
        public int ZoneID
        {
            get { return m_nZoneID; }
            set { m_nZoneID = value; }
        }
    }

    public class RequestSaveViewport
    {
        // 0 보다 작으면 outdoor
        private int m_nZoneID = -1;
        private float m_fCameraPositionX = 0;
        private float m_fCameraPositionY = 0;
        private float m_fCameraPositionZ = 0;
        private float m_fCameraRotationX = 0;
        private float m_fCameraRotationY = 0;
        private float m_fCameraRotationZ = 0;

        public float CameraPositionX
        {
            get { return m_fCameraPositionX; }
            set { m_fCameraPositionX = value; }
        }

        public float CameraPositionY
        {
            get { return m_fCameraPositionY; }
            set { m_fCameraPositionY = value; }
        }

        public float CameraPositionZ
        {
            get { return m_fCameraPositionZ; }
            set { m_fCameraPositionZ = value; }
        }

        public float CameraRotationX
        {
            get { return m_fCameraRotationX; }
            set { m_fCameraRotationX = value; }
        }

        public float CameraRotationY
        {
            get { return m_fCameraRotationY; }
            set { m_fCameraRotationY = value; }
        }

        public float CameraRotationZ
        {
            get { return m_fCameraRotationZ; }
            set { m_fCameraRotationZ = value; }
        }

        // 0 보다 작으면 outdoor
        public int ZoneID
        {
            get { return m_nZoneID; }
            set { m_nZoneID = value; }
        }
    }

    public class RequestFacilityList
    {
        private int m_nCampusID = -1;

        public int CampusID
        {
            get { return m_nCampusID; }
            set { m_nCampusID = value; }
        }
    }

    public class RequestFacilityData
    {
        private int m_nFacilityID = -1;

        public int FacilityID
        {
            get { return m_nFacilityID; }
            set { m_nFacilityID = value; }
        }
    }

    public class RequestPSMSensorInfo
    {
        private int m_nSensorID = -1;

        public int SensorID
        {
            get { return m_nSensorID; }
            set { m_nSensorID = value; }
        }
    }

    public class RequestCampusData
    {
        private int m_nCampusID = -1;

        public int CampusID
        {
            get { return m_nCampusID; }
            set { m_nCampusID = value; }
        }
    }

    public class RequestAPStatistics
    {
        private int m_nCampusID = -1;

        public int CampusID
        {
            get { return m_nCampusID; }
            set { m_nCampusID = value; }
        }
    }

    public class RequestWorkerStatistics
    {
        private int m_nCampusID = -1;

        public int CampusID
        {
            get { return m_nCampusID; }
            set { m_nCampusID = value; }
        }
    }

    public class RequestAPList
    {
        private int m_nCampusID = -1;

        public int CampusID
        {
            get { return m_nCampusID; }
            set { m_nCampusID = value; }
        }
    }

    public class RequestWorkerList
    {
        private int m_nCampusID = -1;

        public int CampusID
        {
            get { return m_nCampusID; }
            set { m_nCampusID = value; }
        }
    }

    public class RequestRealSensorData
    {
        private int m_nTargetTypeID = -1;
        private int m_nCurrentTypeID = -1;
        private int m_nSensorID = -1;
        private int m_nZoneID = -1;

        public int TargetTypeID
        {
            get { return m_nTargetTypeID; }
            set { m_nTargetTypeID = value; }
        }

        public int CurrentTypeID
        {
            get { return m_nCurrentTypeID; }
            set { m_nCurrentTypeID = value; }
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
    }
}
