using System;
using System.Collections.Generic;
using Common.Model.History;
using SDMS.Model.History;
using History.IBLL.Models.Response;

namespace GGH.BLL.Models.Alarm
{
    class AlarmData
    {
        private int m_nSensorZoneHistoryID = -1;
        private DateTime m_dtBegin = new DateTime();
        private DateTime? m_dtEnd = null;
        private ActionStepHistory m_actionStepHistory = null;
        private List<SopHistoryComponentData> m_sopComponentHistoryDatas = new List<SopHistoryComponentData>();
        private string m_strSopName = null;
        private string m_strActionStepName = null;
        private int m_nAlarmDepth = 1;
        private string m_strSensorTypeName = "";
        private string m_strSensorTypeEngName = "";
        private string m_strLocation = "";
        private string m_strSensorName = "";
        private List<SensorReactionHistory> m_sensorReactionHistories = new List<SensorReactionHistory>();
        private int m_nSiteID = -1;
        private int m_nZoneID = -1;
        private int m_nSensorZoneID = -1;

        public int SensorZoneHistoryID
        {
            get { return m_nSensorZoneHistoryID; }
            set { m_nSensorZoneHistoryID = value; }
        }

        public DateTime BeginTime
        {
            get { return m_dtBegin; }
            set { m_dtBegin = value; }
        }

        public DateTime? EndTime
        {
            get { return m_dtEnd; }
            set { m_dtEnd = value; }
        }

        public ActionStepHistory ActionStepHistory
        {
            get { return m_actionStepHistory; }
            set { m_actionStepHistory = value; }
        }

        public List<SopHistoryComponentData> SopComponentHistoryDatas
        {
            get { return m_sopComponentHistoryDatas; }
            set { m_sopComponentHistoryDatas = value; }
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

        public int AlarmDepth
        {
            get { return m_nAlarmDepth; }
            set { m_nAlarmDepth = value; }
        }

        public string SensorTypeName
        {
            get { return m_strSensorTypeName; }
            set { m_strSensorTypeName = value; }
        }

        public string SensorTypeEngName
        {
            get { return m_strSensorTypeEngName; }
            set { m_strSensorTypeEngName = value; }
        }

        public string Location
        {
            get { return m_strLocation; }
            set { m_strLocation = value; }
        }

        public string SensorName
        {
            get { return m_strSensorName; }
            set { m_strSensorName = value; }
        }

        public List<SensorReactionHistory> SensorReactionHistories
        {
            get { return m_sensorReactionHistories; }
            set { m_sensorReactionHistories = value; }
        }

        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }

        public int ZoneID
        {
            get { return m_nZoneID; }
            set { m_nZoneID = value; }
        }

        public int SensorZoneID
        {
            get { return m_nSensorZoneID; }
            set { m_nSensorZoneID = value; }
        }
    }
}
