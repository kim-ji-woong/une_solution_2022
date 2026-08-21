using System;
using System.Collections.Generic;
using System.Text;

namespace VDS.BLL.Models.Request
{
    public class RequestWorkData
    {
        private int m_nDataCenterID = -1;

        public int DataCenterID
        {
            get { return m_nDataCenterID; }
            set { m_nDataCenterID = value; }
        }
    }

    public class RequestSiteWorkData
    {
        private int m_nSiteID = -1;

        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }
    }
}
