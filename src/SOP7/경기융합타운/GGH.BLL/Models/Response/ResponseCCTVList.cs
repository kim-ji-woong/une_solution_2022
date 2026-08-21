using System.Collections.Generic;

namespace GGH.BLL.Models.Response
{
    public class ResponseCCTVList : MessageResult
    {
        public class CCTVData
        {
            private int m_nID = -1;
            private string m_strBuildingName = null;
            private string m_strFloorName = null;
            private string m_strPosition = null;
            private string m_strIP = null;
            private string m_strDeviceID = null;
            private string m_strDescription = null;

            public int ID
            {
                get { return m_nID; }
                set { m_nID = value; }
            }

            public string BuildingName
            {
                get { return m_strBuildingName; }
                set { m_strBuildingName = value; }
            }

            public string FloorName
            {
                get { return m_strFloorName; }
                set { m_strFloorName = value; }
            }

            public string Position
            {
                get { return m_strPosition; }
                set { m_strPosition = value; }
            }

            public string IP
            {
                get { return m_strIP; }
                set { m_strIP = value; }
            }

            public string DeviceID
            {
                get { return m_strDeviceID; }
                set { m_strDeviceID = value; }
            }

            public string Description
            {
                get { return m_strDescription; }
                set { m_strDescription = value; }
            }
        }

        private List<CCTVData> m_cctvList = new List<CCTVData>();

        public List<CCTVData> CCTVList
        {
            get { return m_cctvList; }
        }

        public ResponseCCTVList()
            : base()
        {
        }

        public ResponseCCTVList(bool success, string message)
            : base(success, message)
        {
        }
    }
}
