namespace SOPAlone.Model.Sop.Spatial
{
    /// <summary>
    /// 건물내 하나의 층을 나타내거나 건물외부의 외부영역을 나타낸다.
    /// </summary>
    public class Zone
    {
        public enum Fields { ID, BuildingID, ZoneName, DisplayText, FloorIndex, AddFloor };

        private int m_nID = -1;
        // 건물외부를 표현할 경우 m_nBuildingID는 null이다.
        private int? m_nBuildingID = null;
        private string m_strZoneName = "";
        // 화면에 표시할 이름(Null이면 GroupName이 사용된다.)
        private string m_strDisplayText = null;
        // 건물외부를 표현할 경우 m_nFloorIndex는 null이다.
        // 1층이면 0, 2층이면 1, 지하일 경우 음수
        private int? m_nFloorIndex = null;
        // 1.4층, 2.5층과 같은 층을 나타내기 위한 소수점
        private float? m_fAddFloor = null;
        
        public int ID
        {
            get { return m_nID; }
            set { m_nID = value; }
        }

        /// <summary>
        /// 건물외부를 표현할 경우 m_nBuildingID는 null이다.
        /// </summary>
        public int? BuildingID
        {
            get { return m_nBuildingID; }
            set { m_nBuildingID = value; }
        }

        public string ZoneName
        {
            get { return m_strZoneName; }
            set { m_strZoneName = value; }
        }

        /// <summary>
        /// 화면에 표시할 이름(Null이면 GroupName이 사용된다.)
        /// </summary>
        public string DisplayText
        {
            get { return m_strDisplayText; }
            set { m_strDisplayText = value; }
        }

        /// <summary>
        /// 건물외부를 표현할 경우 m_nFloorIndex는 null이다.
        /// 1층이면 0, 2층이면 1, 지하일 경우 음수
        /// </summary>
        public int? FloorIndex
        {
            get { return m_nFloorIndex; }
            set { m_nFloorIndex = value; }
        }

        /// <summary>
        /// 1.4층, 2.5층과 같은 층을 나타내기 위한 소수점
        /// </summary>
        public float? AddFloor
        {
            get { return m_fAddFloor; }
            set { m_fAddFloor = value; }
        }

        public static string TableName
        {
            get { return "SopSpatialZone"; }
        }

        public static string GetFieldName(Fields field, out bool isNullable)
        {
            if (field == Fields.BuildingID ||
                field == Fields.DisplayText ||
                field == Fields.FloorIndex ||
                field == Fields.AddFloor)
                isNullable = true;
            else
                isNullable = false;

            return field.ToString();
        }
    }
}
