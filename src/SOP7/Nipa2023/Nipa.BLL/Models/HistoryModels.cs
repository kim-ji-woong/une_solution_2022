using System;
using System.Collections.Generic;
using Nipa.Model.Sdms.History;

namespace Nipa.BLL.Models
{
    public class SensorZoneKey
    {
        private int m_nSensorZoneHistoryID = -1;
        private int m_nSensorZoneID = -1;
        private int m_nSensorType = -1;
        private int m_nZoneID = -1;
        private SensorReaction.ReactionTypes m_reactionType = SensorReaction.ReactionTypes.NONE;
        private List<int> m_allSensorZoneIDs = new List<int>();
        private string m_strEndTime = "";

        public int SensorZoneHistoryID
        {
            get { return m_nSensorZoneHistoryID; }
            set { m_nSensorZoneHistoryID = value; }
        }

        public int SensorZoneID
        {
            get { return m_nSensorZoneID; }
            set { m_nSensorZoneID = value; }
        }

        public int SensorType
        {
            get { return m_nSensorType; }
            set { m_nSensorType = value; }
        }

        public int ZoneID
        {
            get { return m_nZoneID; }
            set { m_nZoneID = value; }
        }

        public SensorReaction.ReactionTypes ReactionType
        {
            get { return m_reactionType; }
            set { m_reactionType = value; }
        }

        public List<int> AllSensorZoneIDs
        {
            get { return m_allSensorZoneIDs; }
            set { m_allSensorZoneIDs = value; }
        }

        public string EndTime
        {
            get { return m_strEndTime; }
            set { m_strEndTime = value; }
        }
    }

    public class SensorDetectHistoryData
    {
        private int m_nSensorZoneHistoryID = -1;
        private int m_nReactionType = -1;
        private string m_strTime = "";
        private string m_strEndTime = "";
        private string m_strType = "";
        private string m_strSensorName = "";
        private string m_strZoneName = "";
        private string m_strRealMode = "";
        private string m_strDetectType = ""; //감지 유형 ?
        private string m_strDetectInfo = ""; //감지 정보 ?
        private string m_strAlarmLevel = "";
        private string m_strSopBeginTime = "";
        private string m_strSopEndTime = "";
        private string m_strSopName = "";
        private int m_nActionStepHistoryID = -1;
        private string m_strMemo = "";
        private List<int> m_allSensorZoneIDs = null;
        private int m_nSensorZoneID = -1;

        public int SensorZoneHistoryID
        {
            get { return m_nSensorZoneHistoryID; }
            set { m_nSensorZoneHistoryID = value; }
        }
        public int ReactionType
        {
            get { return m_nReactionType; }
            set { m_nReactionType = value; }
        }
        public string Time
        {
            get { return m_strTime; }
            set { m_strTime = value; }
        }
        public string EndTime
        {
            get { return m_strEndTime; }
            set { m_strEndTime = value; }
        }
        public string Type
        {
            get { return m_strType; }
            set { m_strType = value; }
        }
        public string SensorName
        {
            get { return m_strSensorName; }
            set { m_strSensorName = value; }
        }
        public string ZoneName
        {
            get { return m_strZoneName; }
            set { m_strZoneName = value; }
        }
        public string RealMode
        {
            get { return m_strRealMode; }
            set { m_strRealMode = value; }
        }
        public string DetectType
        {
            get { return m_strDetectType; }
            set { m_strDetectType = value; }
        }
        public string DetectInfo
        {
            get { return m_strDetectInfo; }
            set { m_strDetectInfo = value; }
        }
        public string AlarmLevel
        {
            get { return m_strAlarmLevel; }
            set { m_strAlarmLevel = value; }
        }
        public string SopBeginTime
        {
            get { return m_strSopBeginTime; }
            set { m_strSopBeginTime = value; }
        }
        public string SopEndTime
        {
            get { return m_strSopEndTime; }
            set { m_strSopEndTime = value; }
        }
        public string SopName
        {
            get { return m_strSopName; }
            set { m_strSopName = value; }
        }
        public int ActionStepHistoryID
        {
            get { return m_nActionStepHistoryID; }
            set { m_nActionStepHistoryID = value; }
        }
        public string Memo
        {
            get { return m_strMemo; }
            set { m_strMemo = value; }
        }
        public List<int> AllSensorZoneIDs
        {
            get { return m_allSensorZoneIDs; }
            set { m_allSensorZoneIDs = value; }
        }
        public int SensorZoneID
        {
            get { return m_nSensorZoneID; }
            set { m_nSensorZoneID = value; }
        }
    }

    public class SensorDetectAnalysisData
    {
        private int m_nSensorZoneHistoryID = -1;
        private int m_nSensorZoneID = -1;
        private string m_strType = "";
        private int m_nZoneID = -1;
        private string m_strZoneName = "";
        private string m_strSensorName = "";
        private int m_nDetectCount = 0; // 탐지 횟수
        private double m_nDetectRate = 0; // 탐지률(%)
        private int m_nEndCount = 0;    // 현장 복구 횟수
        private int m_nUserResetCount = 0;   // 사용자 복구 횟수
        private int m_nMalfunctionCount = 0; // 오작동, 사용자복구(누출) 횟수
        private int m_nTimeoutCount = 0;    // 자동복구 횟수(시간초과)
        private double m_fMalfunctionRate = 0.0f; // 오작동률(%)

        public int SensorZoneHistoryID
        {
            get { return m_nSensorZoneHistoryID; }
            set { m_nSensorZoneHistoryID = value; }
        }
        public int SensorZoneID
        {
            get { return m_nSensorZoneID; }
            set { m_nSensorZoneID = value; }
        }
        public string Type
        {
            get { return m_strType; }
            set { m_strType = value; }
        }
        public int ZoneID
        {
            get { return m_nZoneID; }
            set { m_nZoneID = value; }
        }
        public string ZoneName
        {
            get { return m_strZoneName; }
            set { m_strZoneName = value; }
        }
        public string SensorName
        {
            get { return m_strSensorName; }
            set { m_strSensorName = value; }
        }
        public int DetectCount
        {
            get { return m_nDetectCount; }
            set { m_nDetectCount = value; }
        }
        public double DetectRate
        {
            get { return m_nDetectRate; }
            set { m_nDetectRate = value; }
        }
        public int UserResetCount
        {
            get { return m_nUserResetCount; }
            set { m_nUserResetCount = value; }
        }
        public int EndCount
        {
            get { return m_nEndCount; }
            set { m_nEndCount = value; }
        }
        public int MalfunctionCount
        {
            get { return m_nMalfunctionCount; }
            set { m_nMalfunctionCount = value; }
        }
        public double MalfunctionRate
        {
            get { return m_fMalfunctionRate; }
            set { m_fMalfunctionRate = value; }
        }

        public int TimeoutCount
        {
            get { return m_nTimeoutCount; }
            set { m_nTimeoutCount = value; }
        }
    }

    public class SOPHistoryData
    {
        private int m_nSensorZoneHistoryID = -1;
        private int m_nActionStepHistoryID = -1;
        private int m_nLastAccessedUserID = -1;
        private string m_strDisasterName = "";
        private string m_strSopName = "";
        private string m_strActionStepName = "";
        private string m_strSensorName = "";
        private string m_strRealMode = "";
        private string m_strPosition = "";
        private string m_strBeginTime = "";
        private string m_strEndTime = "";
        private string m_strUserName = "";
        private List<int> m_allSensorZoneIDs = null;

        public int SensorZoneHistoryID
        {
            get { return m_nSensorZoneHistoryID; }
            set { m_nSensorZoneHistoryID = value; }
        }
        public int ActionStepHistoryID
        {
            get { return m_nActionStepHistoryID; }
            set { m_nActionStepHistoryID = value; }
        }
        public int LastAccessedUserID
        {
            get { return m_nLastAccessedUserID; }
            set { m_nLastAccessedUserID = value; }
        }
        public string DisasterName
        {
            get { return m_strDisasterName; }
            set { m_strDisasterName = value; }
        }
        public string SopName
        {
            get { return m_strSopName; }
            set { m_strSopName = value; }
        }
        public string ActionStepName
        {
            get { return m_strActionStepName; }
            set { m_strActionStepName = value; }
        }
        public string SensorName
        {
            get { return m_strSensorName; }
            set { m_strSensorName = value; }
        }
        public string RealMode
        {
            get { return m_strRealMode; }
            set { m_strRealMode = value; }
        }
        public string Position
        {
            get { return m_strPosition; }
            set { m_strPosition = value; }
        }
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
        public string UserName
        {
            get { return m_strUserName; }
            set { m_strUserName = value; }
        }
        public List<int> AllSensorZoneIDs
        {
            get { return m_allSensorZoneIDs; }
            set { m_allSensorZoneIDs = value; }
        }
    }

    public class SopHistoryComponentData
    {
        private int m_nActionStepHistoryID = -1;
        private int m_nComponentHistoryID = -1;
        private int m_nComponentID = -1;
        private int m_nComponentType = -1;
        private string m_strSectionName = "";
        private List<string> m_teamList = new List<string>();
        private string m_strTime = "";
        private int m_nStatus = -1;
        private string m_strStatus = "";
        private int m_nUserID = -1;
        private string m_strUserName = "";
        private string m_strCompletion = "확인";
        private List<ComponentHistoryDetailData> m_missionDatas = new List<ComponentHistoryDetailData>();

        public int ActionStepHistoryID
        {
            get { return m_nActionStepHistoryID; }
            set { m_nActionStepHistoryID = value; }
        }
        public int ComponentHistoryID
        {
            get { return m_nComponentHistoryID; }
            set { m_nComponentHistoryID = value; }
        }
        public int ComponentID
        {
            get { return m_nComponentID; }
            set { m_nComponentID = value; }
        }
        public int ComponentType
        {
            get { return m_nComponentType; }
            set { m_nComponentType = value; }
        }
        public string SectionName
        {
            get { return m_strSectionName; }
            set { m_strSectionName = value; }
        }
        public List<string> TeamList
        {
            get { return m_teamList; }
            set { m_teamList = value; }
        }
        public string Time
        {
            get { return m_strTime; }
            set { m_strTime = value; }
        }
        public int Status
        {
            get { return m_nStatus; }
            set { m_nStatus = value; }
        }
        public string strStatus
        {
            get { return m_strStatus; }
            set { m_strStatus = value; }
        }
        public int UserID
        {
            get { return m_nUserID; }
            set { m_nUserID = value; }
        }
        public string UserName
        {
            get { return m_strUserName; }
            set { m_strUserName = value; }
        }
        public string Completion
        {
            get { return m_strCompletion; }
            set { m_strCompletion = value; }
        }
        public List<ComponentHistoryDetailData> MissionDatas
        {
            get { return m_missionDatas; }
            set { m_missionDatas = value; }
        }
    }

    public class ComponentHistoryDetailData
    {
        private int m_nDataIndex = -1;
        private string m_strSectionName = "";
        private string m_strMissionText = "";
        private string m_strTime = "";
        private string m_strCompletion = "미완료";

        public int DataIndex
        {
            get { return m_nDataIndex; }
            set { m_nDataIndex = value; }
        }
        public string SectionName
        {
            get { return m_strSectionName; }
            set { m_strSectionName = value; }
        }
        public string MissionText
        {
            get { return m_strMissionText; }
            set { m_strMissionText = value; }
        }
        public string Completion
        {
            get { return m_strCompletion; }
            set { m_strCompletion = value; }
        }
        public string Time
        {
            get { return m_strTime; }
            set { m_strTime = value; }
        }
    }
}
