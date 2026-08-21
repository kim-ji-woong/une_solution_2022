namespace SOPManager.BLL.Models.Response
{
    public class ResponseSaveXml : MessageResult
    {
        private string m_strXmlPath = null;

        public string XmlPath
        {
            get { return m_strXmlPath; }
            set { m_strXmlPath = value; }
        }

        public ResponseSaveXml()
            : base()
        {
        }

        public ResponseSaveXml(bool success, string message)
            : base(success, message)
        {
        }

        public static string GetXmlPath(SOP.SOPData sopData)
        {
            string strPath = null;

            if (sopData.DisasterCategory == null)
                return null;
            else
                strPath = sopData.DisasterCategory.CategoryName;

            if (sopData.SubDisasterCategory == null)
                return null;
            else
                strPath += "/" + sopData.SubDisasterCategory.SubCategoryName;

            if (sopData.Disaster == null)
                return null;
            else
                strPath += "/" + sopData.Disaster.DisasterName;

            return strPath;
        }
    }
}
