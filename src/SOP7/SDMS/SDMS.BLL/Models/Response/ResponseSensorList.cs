using System.Collections.Generic;

namespace SDMS.BLL.Models.Response
{
    using Models.Data.Sensor;
    using Model.Spatial;

    public class ResponseSensorList : MessageResult
    {
        private List<FireSensor> m_fireSensors = null;
        private List<PSMSensor> m_psmSensors = null;
        private List<EtcSensor> m_etcSensors = null;
        private List<CCTVSensor> m_cctvs = null;
        private List<EtcSensor> m_earthquakeSensors = null;
        private List<EtcSensor> m_strongWindSensors = null;
        private List<EtcSensor> m_environmentSensors = null;
        private List<EtcSensor> m_manufactureSensors = null;
        private List<EtcSensor> m_emergencyBellSensors = null;
        private List<EtcSensor> m_laserSensors = null;
        private List<EtcSensor> m_doorSensors = null;
        private List<EtcSensor> m_lowBatterySensors = null;
        private List<EtcSensor> m_speedDetectionSensors = null;
        private int m_nTotalCount = 0;

        public List<FireSensor> FireSensors
        {
            get { return m_fireSensors; }
            set { m_fireSensors = value; }
        }

        public List<PSMSensor> PSMSensors
        {
            get { return m_psmSensors; }
            set { m_psmSensors = value; }
        }

        public List<EtcSensor> EtcSensors
        {
            get { return m_etcSensors; }
            set { m_etcSensors = value; }
        }

        public List<CCTVSensor> Cctvs
        {
            get { return m_cctvs; }
            set { m_cctvs = value; }
        }

        public List<EtcSensor> EarthquakeSensors
        {
            get { return m_earthquakeSensors; }
            set { m_earthquakeSensors = value; }
        }

        public List<EtcSensor> StrongWindSensors
        {
            get { return m_strongWindSensors; }
            set { m_strongWindSensors = value; }
        }

        public List<EtcSensor> EnvironmentSensors
        {
            get { return m_environmentSensors; }
            set { m_environmentSensors = value; }
        }

        public List<EtcSensor> ManufactureSensors
        {
            get { return m_manufactureSensors; }
            set { m_manufactureSensors = value; }
        }

        public List<EtcSensor> EmergencyBellSensors
        {
            get { return m_emergencyBellSensors; }
            set { m_emergencyBellSensors = value; }
        }
        
        public List<EtcSensor> LaserSensors
        {
            get { return m_laserSensors; }
            set { m_laserSensors = value; }
        }
        
        public List<EtcSensor> DoorSensors
        {
            get { return m_doorSensors; }
            set { m_doorSensors = value; }
        }

        public List<EtcSensor> LowBatterySensors
        {
            get { return m_lowBatterySensors; }
            set { m_lowBatterySensors = value; }
        }

        public List<EtcSensor> SpeedDetectionSensors
        {
            get { return m_speedDetectionSensors; }
            set { m_speedDetectionSensors = value; }
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

    public class ResponseIndoorDatas : ResponseSensorList
    {
        private int m_nZoneID = -1;
        private List<EquipmentZone> m_equipZones = new List<EquipmentZone>();

        public int ZoneID
        {
            get { return m_nZoneID; }
            set { m_nZoneID = value; }
        }

        public List<EquipmentZone> EquipZones
        {
            get { return m_equipZones; }
            set { m_equipZones = value; }
        }
    }

    public class ResponseRangeSensors : MessageResult
    {
        private ICollection<RangeSensor> m_rangeSensors = null;
        private ICollection<RangeSensor> m_rangePSMSensors = null;
        private ICollection<RangeSensor> m_rangeETCSensors = null;

        public ICollection<RangeSensor> Sensors
        {
            get { return m_rangeSensors; }
            set { m_rangeSensors = value; }
        }
        public ICollection<RangeSensor> PsmSensors
        {
            get { return m_rangePSMSensors; }
            set { m_rangePSMSensors = value; }
        }
        public ICollection<RangeSensor> EtcSensors
        {
            get { return m_rangeETCSensors; }
            set { m_rangeETCSensors = value; }
        }

        public ResponseRangeSensors()
            : base()
        {
        }

        public ResponseRangeSensors(bool success, string message)
            : base(success, message)
        {
        }
    }
}
