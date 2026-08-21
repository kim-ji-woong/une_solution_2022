using VDS.Model;
using System.Collections.Generic;

namespace VDS.BLL.Models.Response
{
    public class ResponseDataCenter : MessageResult
    {
        private Model.DataCenter.DataCenter m_dataCenter = null;

        public Model.DataCenter.DataCenter DataCenter
        {
            get { return m_dataCenter; }
            set { m_dataCenter = value; }
        }

        public ResponseDataCenter()
            : base()
        {
        }

        public ResponseDataCenter(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseDataCenterList : MessageResult
    {
        private List<DataCenterEx> m_dataCenters = new List<DataCenterEx>();

        public List<DataCenterEx> DataCenters
        {
            get { return m_dataCenters; }
            set { m_dataCenters = value; }
        }

        public ResponseDataCenterList()
            : base()
        {
        }

        public ResponseDataCenterList(bool success, string message)
            : base(success, message)
        {
        }
    }
}
