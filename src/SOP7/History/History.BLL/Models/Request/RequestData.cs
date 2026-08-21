using System;
using System.Collections.Generic;
using System.Text;

namespace History.BLL.Models.Request
{
    public class RequestData
    {
        private RequestUserHistories m_requestUserHistories = null;
        private RequestGetMinMaxIndex m_requestGetMinMaxIndex = null;
        private RequestGetMinMaxIndex m_requestGetMinMaxIndex2 = null;
        private RequestSensorDetectHistories m_requestSensorDetectHistories = null;
        private RequestSOPHistories m_requestSOPHistories = null;
        private RequestSOPHistories2 m_requestSOPHistories2 = null;
        private RequestSOPComponentHistories m_requestSOPComponentHistories = null;
        private RequestSensorDetectAnalysis m_requestSensorDetectAnalysis = null;
        private RequestDisasterCategories m_requestDisasterCategories = null;
        private RequestUpdateAlarmMemo m_RequestUpdateAlarmMemo = null;
        private RequestAssessmentHistories m_RequestAssessmentHistories = null;
        private RequestAssessmentDetail m_RequestAssessmentDetail = null;
        private RequestLoadAssessmentClass m_RequestLoadAssessmentClass = null;

        public RequestUserHistories RequestUserHistories
        {
            get { return m_requestUserHistories; }
            set { m_requestUserHistories = value; }
        }

        public RequestGetMinMaxIndex RequestGetMinMaxIndex
        {
            get { return m_requestGetMinMaxIndex; }
            set { m_requestGetMinMaxIndex = value; }
        }

        // 특정 FacilityType 하나만 조회한다.
        public RequestGetMinMaxIndex RequestGetMinMaxIndex2
        {
            get { return m_requestGetMinMaxIndex2; }
            set { m_requestGetMinMaxIndex2 = value; }
        }

        public RequestSensorDetectHistories RequestSensorDetectHistories
        {
            get { return m_requestSensorDetectHistories; }
            set { m_requestSensorDetectHistories = value; }
        }

        public RequestSensorDetectAnalysis RequestSensorDetectAnalysis
        {
            get { return m_requestSensorDetectAnalysis; }
            set { m_requestSensorDetectAnalysis = value; }
        }

        public RequestSOPHistories RequestSOPHistories
        {
            get { return m_requestSOPHistories; }
            set { m_requestSOPHistories = value; }
        }

        public RequestSOPHistories2 RequestSOPHistories2
        {
            get { return m_requestSOPHistories2; }
            set { m_requestSOPHistories2 = value; }
        }

        public RequestSOPComponentHistories RequestSOPComponentHistories
        {
            get { return m_requestSOPComponentHistories; }
            set { m_requestSOPComponentHistories = value; }
        }
        public RequestDisasterCategories RequestDisasterCategories
        {
            get { return m_requestDisasterCategories; }
            set { m_requestDisasterCategories = value; }
        }

        public RequestUpdateAlarmMemo RequestUpdateAlarmMemo
        {
            get { return m_RequestUpdateAlarmMemo; }
            set { m_RequestUpdateAlarmMemo = value; }
        }

        public RequestAssessmentHistories RequestAssessmentHistories
        {
            get { return m_RequestAssessmentHistories; }
            set { m_RequestAssessmentHistories = value; }
        }

        public RequestAssessmentDetail RequestAssessmentDetail
        {
            get { return m_RequestAssessmentDetail; }
            set { m_RequestAssessmentDetail = value; }
        }

        public RequestLoadAssessmentClass RequestLoadAssessmentClass
        {
            get { return m_RequestLoadAssessmentClass; }
            set { m_RequestLoadAssessmentClass = value; }
        }
    }

    public class RequestUserHistories
    {
        private string m_strBeginTime = "";
        private string m_strEndTime = "";
        private int m_nSiteID = -1;

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

        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }
    }

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

        private int m_nSiteID = -1;
        // 이 값이 false이면 m_nFacilityType에 대해서만 조회한다.
        private bool m_justOneType = false;


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

        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }

        // 이 값이 false이면 m_nFacilityType에 대해서만 조회한다.
        public bool JustOneType
        {
            get { return m_justOneType; }
            set { m_justOneType = value; }
        }
    }

    public class RequestGetMinMaxIndex
    {
        private string m_strBeginTime = "";
        private string m_strEndTime = "";
        private int m_nFacilityType = -1;
        private int m_nBuildingGroupID = -1;
        private int m_nBuildingID = -1;
        private int m_nZoneID = -1;
        // 이 값이 false이면 m_nFacilityType에 대해서만 조회한다.
        private bool m_justOneType = false;

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

        // 이 값이 false이면 m_nFacilityType에 대해서만 조회한다.
        public bool JustOneType
        {
            get { return m_justOneType; }
            set { m_justOneType = value; }
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
        private int m_nSiteID = -1;
        // 이 값이 false이면 m_nFacilityType에 대해서만 조회한다.
        private bool m_justOneType = false;

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

        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }

        // 이 값이 false이면 m_nFacilityType에 대해서만 조회한다.
        public bool JustOneType
        {
            get { return m_justOneType; }
            set { m_justOneType = value; }
        }
    }

    public class RequestSOPHistories
    {
        private string m_strBeginTime = "";
        private string m_strEndTime = "";
        private int m_nSiteID = -1;

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

        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }

    }

    public class RequestSOPHistories2
    {
        private int m_nSensorZoneHistoryID = 0;

        public int SensorZoneHistoryID
        {
            get { return m_nSensorZoneHistoryID; }
            set { m_nSensorZoneHistoryID = value; }
        }
    }

    public class RequestSOPComponentHistories
    {
        private int m_nActionStepHistoryID = -1;
        public int ActionStepHistoryID
        {
            get { return m_nActionStepHistoryID; }
            set { m_nActionStepHistoryID = value; }
        }
    }

    public class RequestDisasterCategories
    {
        private int m_nSiteID = -1;
        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }
    }

    public class RequestUpdateAlarmMemo
    {
        private int m_nSensorZoneHistoryID = -1;
        private string m_strMemo = "";

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

    public class RequestAssessmentHistories
    {
        private string m_strBeginTime = "";
        private string m_strEndTime = "";
        private int m_nBuildingGroupID = -1;
        private int m_nBuildingID = -1;
        private int m_nZoneID = -1;
        private int m_nScore = -1;
        private string m_strEvaluator = "";
        private int m_nSiteID = -1;
        public int? EquipZoneID { get; set; }
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
        public int Score
        {
            get { return m_nScore; }
            set { m_nScore = value; }
        }
        public string Evaluator
        {
            get { return m_strEvaluator; }
            set { m_strEvaluator = value; }
        }
        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }
    }
    public class RequestAssessmentDetail
    {
        public int AssessmentID { get; set; }
        public int? SiteID { get; set; }
    }

    public class RequestLoadAssessmentClass
    {
        public int? SiteID { get; set; }
    }
}
