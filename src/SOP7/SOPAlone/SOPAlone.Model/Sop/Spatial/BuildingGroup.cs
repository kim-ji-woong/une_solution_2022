namespace SOPAlone.Model.Sop.Spatial
{
    /// <summary>
    /// 건물그룹
    /// 여러개의 건물들이 모여 건물그룹을 이룬다.
    /// </summary>
    public class BuildingGroup
    {
        public enum Fields { ID, GroupName, DisplayText, SiteID };

        private int m_nID = -1;
        private string m_strGroupName = "";
        // 화면에 표시할 이름(Null이면 GroupName이 사용된다.)
        private string m_strDisplayText = null;
        private int m_nSiteID = -1;

        public int ID
        {
            get { return m_nID; }
            set { m_nID = value; }
        }

        public string GroupName
        {
            get { return m_strGroupName; }
            set { m_strGroupName = value; }
        }

        /// <summary>
        /// 화면에 표시할 이름(Null이면 GroupName이 사용된다.)
        /// </summary>
        public string DisplayText
        {
            get { return m_strDisplayText; }
            set { m_strDisplayText = value; }
        }

        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }

        public static string TableName
        {
            get { return "SopSpatialBuildingGroup"; }
        }

        public static string GetFieldName(Fields field, out bool isNullable)
        {
            if (field == Fields.DisplayText)
                isNullable = true;
            else
                isNullable = false;

            return field.ToString();
        }
    }
}
