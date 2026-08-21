namespace SDMS.Controller.Models.Response
{
    public class LinkedSop
    {
        private string m_strDisasterCategoryName = null;
        private string m_strSubDisasterCategoryName = null;
        private string m_strDisasterName = null;

        public string DisasterCategoryName
        {
            get { return m_strDisasterCategoryName; }
            set { m_strDisasterCategoryName = value; }
        }

        public string SubDisasterCategoryName
        {
            get { return m_strSubDisasterCategoryName; }
            set { m_strSubDisasterCategoryName = value; }
        }

        public string DisasterName
        {
            get { return m_strDisasterName; }
            set { m_strDisasterName = value; }
        }
    }
}
