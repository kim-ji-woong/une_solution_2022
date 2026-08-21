namespace SOPAlone.Model.Sop.Spatial
{
    public class Building
    {
        public enum Fields { ID, BuildingGroupID, BuildingName, DisplayText, MaxFloor, MinFloor };

        private int m_nID = -1;
        private int m_nBuildingGroupID = -1;
        private string m_strBuildingName = "";
        private string m_strDisplayText = null;
        // 건물 가장 꼭대기 층(1층이면 0, 2층이면 1, 지하일 경우 음수)
        private int m_nMaxFloor = 0;
        // 건물 가장 아래층(1층이면 0, 2층이면 1, 지하일 경우 음수)
        private int m_nMinFloor = 0;
        // 화면에 표시할 이름(Null이면 GroupName이 사용된다.)
        
        public int ID
        {
            get { return m_nID; }
            set { m_nID = value; }
        }

        public int BuildingGroupID
        {
            get { return m_nBuildingGroupID; }
            set { m_nBuildingGroupID = value; }
        }

        public string BuildingName
        {
            get { return m_strBuildingName; }
            set { m_strBuildingName = value; }
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
        /// 건물 가장 꼭대기 층(1층이면 0, 2층이면 1, 지하일 경우 음수)
        /// </summary>n
        public int MaxFloor
        {
            get { return m_nMaxFloor; }
            set { m_nMaxFloor = value; }
        }

        /// <summary>
        /// 건물 가장 아래층(1층이면 0, 2층이면 1, 지하일 경우 음수)
        /// </summary>
        public int MinFloor
        {
            get { return m_nMinFloor; }
            set { m_nMinFloor = value; }
        }

        public static string GetFieldName(Fields field, out bool isNullable)
        {
            if (field == Fields.DisplayText)
                isNullable = true;
            else
                isNullable = false;

            return field.ToString();
        }

        public static string TableName
        {
            get { return "SopSpatialBuilding"; }
        }
    }
}
