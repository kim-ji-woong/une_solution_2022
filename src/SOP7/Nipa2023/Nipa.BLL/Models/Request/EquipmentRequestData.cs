using System;
using System.Collections.Generic;
using System.Text;

namespace Nipa.BLL.Models.Request
{
    public class RequestAP
    {
        private int m_nCapmusID = -1;

        public int CampusID
        {
            get { return m_nCapmusID; }
            set { m_nCapmusID = value; }
        }
    }

    public class RequestWorkerTag
    {
        private int m_nCapmusID = -1;

        public int CampusID
        {
            get { return m_nCapmusID; }
            set { m_nCapmusID = value; }
        }
    }

    public class RequestMESData
    {
        // 생산현황, 품질현황, 구매현황, 매출현황
        public enum DataType { None = -1, Product = 0, Quality, Buy, Sell };

        private int m_nType = (int)DataType.None;
        private int m_nCampusID = -1;

        // DataType
        public int Type
        {
            get { return m_nType; }
            set { m_nType = value; }
        }

        public int CampusID
        {
            get { return m_nCampusID; }
            set { m_nCampusID = value; }
        }
    }

    public class RequestMESEquipmentData
    {
        private List<int> m_equipmentIDs = new List<int>();

        public List<int> EquipmentIDs
        {
            get { return m_equipmentIDs; }
            set { m_equipmentIDs = value; }
        }
    }
}
