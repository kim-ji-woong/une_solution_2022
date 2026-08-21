namespace SOPAlone.Model.Sop.Sensor
{
    public class FacilityType
    {
        public enum Fields { FacilityTypeID, TypeName, DisplayText, SiteID };

        private int m_nFacilityTypeID = -1;
        private string m_strTypeName = "";
        private string m_strDisplayText = null;
        private int m_nSiteID = -1;
        public int FacilityTypeID
        {
            get { return m_nFacilityTypeID; }
            set { m_nFacilityTypeID = value; }
        }

        public string TypeName
        {
            get { return m_strTypeName; }
            set { m_strTypeName = value; }
        }

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
            get { return "SopSensorFacilityType"; }
        }
    }
}
