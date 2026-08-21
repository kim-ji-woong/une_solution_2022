namespace SDMS.Model.Sensor
{
    /// <summary>
    /// SdmsSensorPSM 누출센서(또는 유해화학물질 센서)
    /// </summary>
    public class PSM : IIDObject
    {
        public enum Fields { 
            ID, Name, PositionName, X, Y, Z, ZoneID, CurrentData, EquipZoneID, Department, 
            DepartmentPhoneNumber, Enabled, Status, UniqueKey, MaterialType, LimitBase, LimitType, LimitValue, SiteID
        };
        public enum Limit_Type { Normal = 1, OnOff, Distri }

        private int m_nID = -1;
        // 센서 이름
        private string m_strName = "";
        // 센서 설치 위치
        private string m_strPositionName = null;
        private float? m_x = null;
        private float? m_y = null;
        private float? m_z = null;
        private int m_nZoneID = -1;
        // 센서의 현재값
        private float? m_fCurrentData = null;
        private int m_nEquipZoneID = -1;
        private string m_strDepartment = null;
        private string m_strDepartmentPhoneNumber = null;
        private bool? m_enabled = null;
        private int? m_nStatus = null;
        private string m_strUniqueKey = null;
        private int? m_nMaterialType = null;

        private float? m_fLimitBase = null;
        private int? m_nLimitType = null;
        private string m_strLimitValue = null;
        private int? m_nSiteID = null;

        public int ID
        {
            get { return m_nID; }
            set { m_nID = value; }
        }

        /// <summary>
        /// 센서 이름
        /// </summary>
        public string Name
        {
            get { return m_strName; }
            set { m_strName = value; }
        }

        /// <summary>
        /// 센서 설치 위치
        /// </summary>
        public string PositionName
        {
            get { return m_strPositionName; }
            set { m_strPositionName = value; }
        }

        public float? X
        {
            get { return m_x; }
            set { m_x = value; }
        }

        public float? Y
        {
            get { return m_y; }
            set { m_y = value; }
        }

        public float? Z
        {
            get { return m_z; }
            set { m_z = value; }
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

        /// <summary>
        /// 센서의 현재값
        /// </summary>
        public float? CurrentData
        {
            get { return m_fCurrentData; }
            set { m_fCurrentData = value; }
        }

        /// <summary>
        /// 센서 탐지시 연락해야할(혹은 조치해야할) 부서
        /// </summary>
        public string Department
        {
            get { return m_strDepartment; }
            set { m_strDepartment = value; }
        }

        /// <summary>
        /// 센서 탐지시 연락해야할(혹은 조치해야할) 부서의 전화번호
        /// </summary>
        public string DepartmentPhoneNumber
        {
            get { return m_strDepartmentPhoneNumber; }
            set { m_strDepartmentPhoneNumber = value; }
        }

        public bool? Enabled
        {
            get { return m_enabled; }
            set { m_enabled = value; }
        }

        public int? Status
        {
            get { return m_nStatus; }
            set { m_nStatus = value; }
        }

        public string UniqueKey
        {
            get { return m_strUniqueKey; }
            set { m_strUniqueKey = value; }
        }

        /// <summary>
        /// 유해 화학물질 종류
        /// </summary>
        public int? MaterialType
        {
            get { return m_nMaterialType; }
            set { m_nMaterialType = value; }
        }
        /// <summary>
        /// 임계치 기준(시작)값
        /// </summary>
        public float? LimitBase
        {
            get { return m_fLimitBase; }
            set { m_fLimitBase = value; }
        }
        /// <summary>
        /// 임계치 종류(1:일반형, 2:분포형)
        /// </summary>
        public int? LimitType
        {
            get { return m_nLimitType; }
            set { m_nLimitType = value; }
        }
        /// <summary>
        /// 임계치 값 (UseLimitLevel 유무 (ex False,True,True >> 관심:사용안함, 경계:사용, 주의:사용, 심각:사용안함) | LimitLevel 값 (ex 2,5,10 >> 관심:2, 경계:5, 주의:10, 심각:NULL))
        /// </summary>
        public string LimitValue
        {
            get { return m_strLimitValue; }
            set { m_strLimitValue = value; }
        }
        public int? SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }

        public static string TableName
        {
            get { return "SdmsSensorPSM"; }
        }

        public static string GetFieldName(Fields field, out bool isNullable)
        {
            if (field == Fields.ID ||
                field == Fields.Name ||
                field == Fields.ZoneID ||
                field == Fields.EquipZoneID ||
                field == Fields.UniqueKey)
                isNullable = false;
            else
                isNullable = true;

            return field.ToString();
        }
    }
}
