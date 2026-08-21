namespace WebSOPApp.Model.Account
{
    public class ResponseSiteID : SOPManager.BLL.Models.Response.MessageResult
    {
        private int? m_siteID = null;

        public int? SiteID
        {
            get { return m_siteID; }
            set { m_siteID = value; }
        }

        public ResponseSiteID()
            : base()
        {
        }

        public ResponseSiteID(bool success, string message)
            : base(success, message)
        {
        }
    }
}
