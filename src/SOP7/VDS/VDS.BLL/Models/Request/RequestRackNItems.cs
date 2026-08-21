using System;
using System.Collections.Generic;
using System.Text;

namespace VDS.BLL.Models.Request
{
    public class RequestRackNItems
    {
        private int m_nDataCenterID = -1;

        public int DataCenterID
        {
            get { return m_nDataCenterID; }
            set { m_nDataCenterID = value; }
        }
    }

    public class RequestItem
    {
        private int m_nDataCenterID = -1;
        private int m_nItemID = -1;

        public int DataCenterID
        {
            get { return m_nDataCenterID; }
            set { m_nDataCenterID = value; }
        }

        public int ItemID
        {
            get { return m_nItemID; }
            set { m_nItemID = value; }
        }
    }

    public class RequestVdcStatistics
    {
        private int m_nDataCenterID = -1;

        public int DataCenterID
        {
            get { return m_nDataCenterID; }
            set { m_nDataCenterID = value; }
        }
    }
}
