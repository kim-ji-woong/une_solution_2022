using System;
using System.Collections.Generic;

namespace Nipa.BLL.Models.Request
{
    public class RequestSensorDetectHistories
    {
        private string m_strBeginTime = "";
        private string m_strEndTime = "";
        private int m_nFacilityType = -1;
        private int m_nBuildingGroupID = -1;
        private int m_nBuildingID = -1;
        private int m_nZoneID = -1;

        private int m_nLastSensorZoneHistoryID = -1;
        private int m_nRowCount = 10; // 한 페이지에 보여줄 row 개수
        private bool m_bIsDesc = true; // 다음 페이지로 넘어갈 경우 작은값으로 조회, 이전페이지로 넘어갈 경우 큰값으로 조회

        private int m_nCampusID = -1;

        public string BeginTime
        {
            get { return m_strBeginTime; }
            set { m_strBeginTime = value; }
        }

        public string EndTime
        {
            get { return m_strEndTime; }
            set { m_strEndTime = value; }
        }

        public int FacilityType
        {
            get { return m_nFacilityType; }
            set { m_nFacilityType = value; }
        }
        public int BuildingGroupID
        {
            get { return m_nBuildingGroupID; }
            set { m_nBuildingGroupID = value; }
        }
        public int BuildingID
        {
            get { return m_nBuildingID; }
            set { m_nBuildingID = value; }
        }
        public int ZoneID
        {
            get { return m_nZoneID; }
            set { m_nZoneID = value; }
        }

        public int LastSensorZoneHistoryID
        {
            get { return m_nLastSensorZoneHistoryID; }
            set { m_nLastSensorZoneHistoryID = value; }
        }

        public int RowCount
        {
            get { return m_nRowCount; }
            set { m_nRowCount = value; }
        }

        public bool IsDesc
        {
            get { return m_bIsDesc; }
            set { m_bIsDesc = value; }
        }

        public int CampusID
        {
            get { return m_nCampusID; }
            set { m_nCampusID = value; }
        }
    }

    public class UpdateSensorDetectHistoryMemo
    {
        private int m_nSensorZoneHistoryID = -1;
        private string m_strMemo = null;

        public int SensorZoneHistoryID
        {
            get { return m_nSensorZoneHistoryID; }
            set { m_nSensorZoneHistoryID = value; }
        }

        public string Memo
        {
            get { return m_strMemo; }
            set { m_strMemo = value; }
        }
    }

    public class RequestSensorDetectAnalysis
    {
        private string m_strBeginTime = "";
        private string m_strEndTime = "";
        private int m_nFacilityType = -1;
        private int m_nBuildingGroupID = -1;
        private int m_nBuildingID = -1;
        private int m_nZoneID = -1;

        private int m_nCampusID = -1;


        public string BeginTime
        {
            get { return m_strBeginTime; }
            set { m_strBeginTime = value; }
        }

        public string EndTime
        {
            get { return m_strEndTime; }
            set { m_strEndTime = value; }
        }

        public int FacilityType
        {
            get { return m_nFacilityType; }
            set { m_nFacilityType = value; }
        }
        public int BuildingGroupID
        {
            get { return m_nBuildingGroupID; }
            set { m_nBuildingGroupID = value; }
        }
        public int BuildingID
        {
            get { return m_nBuildingID; }
            set { m_nBuildingID = value; }
        }
        public int ZoneID
        {
            get { return m_nZoneID; }
            set { m_nZoneID = value; }
        }

        public int CampusID
        {
            get { return m_nCampusID; }
            set { m_nCampusID = value; }
        }
    }

    public class RequestSopDisasterCategoryList
    {
        private int m_nCampusID = -1;

        public int CampusID
        {
            get { return m_nCampusID; }
            set { m_nCampusID = value; }
        }
    }

    public class RequestSopSubDisasterCategoryList
    {
        private int m_nCampusID = -1;

        public int CampusID
        {
            get { return m_nCampusID; }
            set { m_nCampusID = value; }
        }
    }

    public class RequestSOPHistories
    {
        private string m_strBeginTime = "";
        private string m_strEndTime = "";
        private int m_nSubDisasterCategoryID = -1;
        private string m_strActionStepName = null;
        private string m_strLastAccessedUserName = null;
        private int m_nCampusID = -1;

        public string BeginTime
        {
            get { return m_strBeginTime; }
            set { m_strBeginTime = value; }
        }

        public string EndTime
        {
            get { return m_strEndTime; }
            set { m_strEndTime = value; }
        }

        public int SubDisasterCategoryID
        {
            get { return m_nSubDisasterCategoryID; }
            set { m_nSubDisasterCategoryID = value; }
        }

        public string ActionStepName
        {
            get { return m_strActionStepName; }
            set { m_strActionStepName = value; }
        }

        public string LastAccessedUserName
        {
            get { return m_strLastAccessedUserName; }
            set { m_strLastAccessedUserName = value; }
        }

        public int CampusID
        {
            get { return m_nCampusID; }
            set { m_nCampusID = value; }
        }
    }

    public class RequestSOPComponentHistories
    {
        private int m_nActionStepHistoryID = -1;
        private int m_nCampusID = -1;

        public int ActionStepHistoryID
        {
            get { return m_nActionStepHistoryID; }
            set { m_nActionStepHistoryID = value; }
        }

        public int CampusID
        {
            get { return m_nCampusID; }
            set { m_nCampusID = value; }
        }
    }
}
