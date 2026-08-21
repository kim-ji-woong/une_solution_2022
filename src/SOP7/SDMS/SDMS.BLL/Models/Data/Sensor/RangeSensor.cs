namespace SDMS.BLL.Models.Data.Sensor
{
    public class RangeSensor
    {
        private int m_nSensorID = -1;
        private string m_strSensorName = "";
        // PSM, ETC, ...
        private string m_strSensorType = "";
        private int m_nSensorTypeID = -1;
        // O2, H2, ...
        private string m_strMaterialType = "";
        private string m_strUniqueKey = "";
        private int? m_nBuildingGroupID = null;
        private int? m_nBuildingID = null;
        private int m_nZoneID = -1;
        private int? m_nEquipZoneID = null;
        private string m_strBuildingGroupName = null;
        private string m_strBuildingName = null;
        private string m_strZoneName = "";
        private string m_strEquipZoneName = null;
        private bool m_useLimitLevel1 = false;
        private bool m_useLimitLevel2 = false;
        private bool m_useLimitLevel3 = false;
        private double? m_limitLevel1 = null;
        private double? m_limitLevel2 = null;
        private double? m_limitLevel3 = null;
        // 센서 상태 (임계치가 없을 경우 쓰임)
        private int? m_nStatus = null;
        private bool? m_bEnabled = null;

        private string m_strLimitBase = null;
        private int? m_nLimitType = null;
        private string m_strLimitValue = null;

        // 단위
        private string m_uom = "";
        private string m_strCurrentData = null;

        public int ID
        {
            get { return m_nSensorID; }
            set { m_nSensorID = value; }
        }

        public string Name
        {
            get { return m_strSensorName; }
            set { m_strSensorName = value; }
        }

        // PSM, ETC, ...
        public string SensorType
        {
            get { return m_strSensorType; }
            set { m_strSensorType = value; }
        }

        // dnsData.Sensor.Facility.FacilityType
        public int SensorTypeID
        {
            get { return m_nSensorTypeID; }
            set { m_nSensorTypeID = value; }
        }

        // O2, H2, ...
        public string MaterialType
        {
            get { return m_strMaterialType; }
            set { m_strMaterialType = value; }
        }

        public string UniqueKey
        {
            get { return m_strUniqueKey; }
            set { m_strUniqueKey = value; }
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

        public int ZoneID
        {
            get { return m_nZoneID; }
            set { m_nZoneID = value; }
        }

        public int? EquipZoneID
        {
            get { return m_nEquipZoneID; }
            set { m_nEquipZoneID = value; }
        }

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

        public string ZoneName
        {
            get { return m_strZoneName; }
            set { m_strZoneName = value; }
        }

        public string EquipZoneName
        {
            get { return m_strEquipZoneName; }
            set { m_strEquipZoneName = value; }
        }

        public bool UseLimitLevel1
        {
            get { return m_useLimitLevel1; }
            set { m_useLimitLevel1 = value; }
        }

        public bool UseLimitLevel2
        {
            get { return m_useLimitLevel2; }
            set { m_useLimitLevel2 = value; }
        }

        public bool UseLimitLevel3
        {
            get { return m_useLimitLevel3; }
            set { m_useLimitLevel3 = value; }
        }

        public double? LimitLevel1
        {
            get { return m_limitLevel1; }
            set { m_limitLevel1 = value; }
        }

        public double? LimitLevel2
        {
            get { return m_limitLevel2; }
            set { m_limitLevel2 = value; }
        }

        public double? LimitLevel3
        {
            get { return m_limitLevel3; }
            set { m_limitLevel3 = value; }
        }

        public string Uom
        {
            get { return m_uom; }
            set { m_uom = value; }
        }

        public string CurrentData
        {
            get { return m_strCurrentData; }
            set { m_strCurrentData = value; }
        }

        public string LimitBase
        {
            get { return m_strLimitBase; }
            set { m_strLimitBase = value; }
        }

        public int? LimitType
        {
            get { return m_nLimitType; }
            set { m_nLimitType = value; }
        }

        public string LimitValue
        {
            get { return m_strLimitValue; }
            set { m_strLimitValue = value; }
        }

        /// <summary>
        /// 센서 상태 (임계치가 없을 경우 쓰임)
        /// </summary>
        public int? Status
        {
            get { return m_nStatus; }
            set { m_nStatus = value; }
        }

        /// <summary>
        /// 센서 ON/OFF 상태
        /// </summary>
        public bool? Enabled
        {
            get { return m_bEnabled; }
            set { m_bEnabled = value; }
        }
    }
}
