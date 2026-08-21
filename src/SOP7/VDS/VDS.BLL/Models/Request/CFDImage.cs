namespace VDS.BLL.Models.Request
{
    public class RequestCFDImages
    {
        private int m_nDataCenterID = -1;

        public int DataCenterID
        {
            get { return m_nDataCenterID; }
            set { m_nDataCenterID = value; }
        }
    }
}
