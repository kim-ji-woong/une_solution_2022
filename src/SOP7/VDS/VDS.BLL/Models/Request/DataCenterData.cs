using System;
using System.Collections.Generic;
using System.Text;

namespace VDS.BLL.Models.Request
{
    /// <summary>
    /// 모든 길이 단위는 mm
    /// </summary>
    public class RequestAddDataCenter
    {
        private int m_nSiteID = -1;
        private int m_nNationID = -1;
        private string m_strCenterName = "";
        private string m_strCenterType = "";
        private string m_strCreationType = "";
        private float m_fLatitude = 0;
        private float m_fLongitude = 0;
        private float m_fWidth = 0;
        private float m_fDepth = 0;
        private float m_fHeight = 0;
        private int m_nStartX = 0;
        private int m_nStartY = 0;
        private float m_fTileElevation = 0;
        private float m_utc = 0;
        private string m_strMemo = null;
        private bool m_isClone = false;
        private int? m_nParentID = null;
        private string m_strManagerTeam = null;
        private string m_strManager = null;
        private int m_nUserID = -1;
        private string m_strCompany = "";

        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }

        public int NationID
        {
            get { return m_nNationID; }
            set { m_nNationID = value; }
        }

        public string CenterName
        {
            get { return m_strCenterName; }
            set { m_strCenterName = value; }
        }

        public string CenterType
        {
            get { return m_strCenterType; }
            set { m_strCenterType = value; }
        }

        public string CreationType
        {
            get { return m_strCreationType; }
            set { m_strCreationType = value; }
        }

        public float Latitude
        {
            get { return m_fLatitude; }
            set { m_fLatitude = value; }
        }

        public float Longitude
        {
            get { return m_fLongitude; }
            set { m_fLongitude = value; }
        }

        public float Width
        {
            get { return m_fWidth; }
            set { m_fWidth = value; }
        }

        public float Depth
        {
            get { return m_fDepth; }
            set { m_fDepth = value; }
        }

        public float Height
        {
            get { return m_fHeight; }
            set { m_fHeight = value; }
        }

        public int StartX
        {
            get { return m_nStartX; }
            set { m_nStartX = value; }
        }

        public int StartY
        {
            get { return m_nStartY; }
            set { m_nStartY = value; }
        }

        public float TileElevation
        {
            get { return m_fTileElevation; }
            set { m_fTileElevation = value; }
        }

        public float UTC
        {
            get { return m_utc; }
            set { m_utc = value; }
        }

        public string Memo
        {
            get { return m_strMemo; }
            set { m_strMemo = value; }
        }

        public bool IsClone
        {
            get { return m_isClone; }
            set { m_isClone = value; }
        }

        public int? ParentID
        {
            get { return m_nParentID; }
            set { m_nParentID = value; }
        }

        public string ManagerTeam
        {
            get { return m_strManagerTeam; }
            set { m_strManagerTeam = value; }
        }

        public string Manager
        {
            get { return m_strManager; }
            set { m_strManager = value; }
        }

        public int UserID
        {
            get { return m_nUserID; }
            set { m_nUserID = value; }
        }

        public string Company
        {
            get { return m_strCompany; }
            set { m_strCompany = value; }
        }
    }

    public class RequestUserDataCenters
    {
        private int m_nUserID = -1;

        public int UserID
        {
            get { return m_nUserID; }
            set { m_nUserID = value; }
        }
    }

    public class RequestGetDataCenters
    {
        private int m_nUserID = -1;
        private int m_nNationID = -1;
        private int m_nSiteID = -1;
        private string m_strCreationType = null;
        private string m_strCompany = null;

        public int UserID
        {
            get { return m_nUserID; }
            set { m_nUserID = value; }
        }

        public int NationID
        {
            get { return m_nNationID; }
            set { m_nNationID = value; }
        }

        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }

        public string CreationType
        {
            get { return m_strCreationType; }
            set { m_strCreationType = value; }
        }

        public string Company
        {
            get { return m_strCompany; }
            set { m_strCompany = value; }
        }
    }

    public class RequestGetDataCenter
    {
        private int m_nDataCenterID = -1;

        public int DataCenterID
        {
            get { return m_nDataCenterID; }
            set { m_nDataCenterID = value; }
        }
    }

    public class RequestUpdateDataCenter
    {
        private int m_nDataCenterID = -1;
        private string m_strMemo = null;

        public int DataCenterID
        {
            get { return m_nDataCenterID; }
            set { m_nDataCenterID = value; }
        }

        public string Memo
        {
            get { return m_strMemo; }
            set { m_strMemo = value; }
        }
    }

    public class RequestUpdateDataCenters
    {
        public class UpdateData
        {
            private int m_nDataCenterID = -1;
            private string m_strCenterName = null;
            private string m_strType = null;
            private string m_strCreationType = null;
            private string m_strMemo = null;

            public int DataCenterID
            {
                get { return m_nDataCenterID; }
                set { m_nDataCenterID = value; }
            }

            public string CenterName
            {
                get { return m_strCenterName; }
                set { m_strCenterName = value; }
            }

            public string Type
            {
                get { return m_strType; }
                set { m_strType = value; }
            }

            public string CreationType
            {
                get { return m_strCreationType; }
                set { m_strCreationType = value; }
            }

            public string Memo
            {
                get { return m_strMemo; }
                set { m_strMemo = value; }
            }
        }

        private List<UpdateData> m_updateDatas = new List<UpdateData>();

        public List<UpdateData> UpdateDatas
        {
            get { return m_updateDatas; }
            set { m_updateDatas = value; }
        }
    }

    public class RequestDeleteDataCenters
    {
        private List<int> m_dataCenterIDs = new List<int>();

        public List<int> DataCenterIDs
        {
            get { return m_dataCenterIDs; }
            set { m_dataCenterIDs = value; }
        }
    }

    public class RequestSiteDataCenters
    {
        private int m_nSiteID = -1;
        private int? m_nUserID = null;

        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }

        public int? UserID
        {
            get { return m_nUserID; }
            set { m_nUserID = value; }
        }
    }

    public class RequestSiteNDataCenters
    {
        private int m_nUserID = -1;

        public int UserID
        {
            get { return m_nUserID; }
            set { m_nUserID = value; }
        }
    }

    public class RequestSiteCompanies
    {
        private int m_nSiteID = -1;

        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }
    }
}
