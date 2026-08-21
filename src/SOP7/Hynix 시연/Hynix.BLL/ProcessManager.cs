using Common.IDAL;
using SDMS.BLL.Models.Response;

namespace Hynix.BLL
{
    using Request;
    using Response;
    using Process;
    using System;

    public class ProcessManager
    {
        private IDataManager m_dataManager = null;
        private Hynix.IDAL.IDataManager m_hyDataManager = null;
        private SDMS.IDAL.IDataManager m_sdmsDataManager = null;
        private SOPManager.IDAL.IDataManager m_sopDataManager = null;
        private TeamEditor.IDAL.IDataManager m_teamDataManager = null;

        public ProcessManager(IDataManager dataManager, Hynix.IDAL.IDataManager hyDataManager, SDMS.IDAL.IDataManager sdmsDataManager, SOPManager.IDAL.IDataManager sopDataManager, TeamEditor.IDAL.IDataManager teamDataManager)
        {
            m_dataManager = dataManager;
            m_hyDataManager = hyDataManager;
            m_sdmsDataManager = sdmsDataManager;
            m_sopDataManager = sopDataManager;
            m_teamDataManager = teamDataManager;
        }

        public Hynix.IDAL.IDataManager HyDataManager
        {
            get { return m_hyDataManager; }
        }

        public SDMS.IDAL.IDataManager SdmsDataManager
        {
            get { return m_sdmsDataManager; }
        }

        public SOPManager.IDAL.IDataManager SopDataManager
        {
            get { return m_sopDataManager; }
        }

        public IDataManager CommonDataManager
        {
            get { return m_dataManager; }
        }

        public TeamEditor.IDAL.IDataManager TeamDataManager
        {
            get { return m_teamDataManager; }
        }

        public ResponseLogDeletePolicy RequestLogDeleteOption()
        {
            OptionManager optionManager = new OptionManager(m_dataManager);
            return optionManager.RequestLogDeletePolicy();
        }

        public MessageResult SaveLogDeletePolicy(SaveLogDeletePolicy data)
        {
            OptionManager optionManager = new OptionManager(m_dataManager);
            return optionManager.SaveLogDeletePolicy(data);
        }

        public ResponseAbnormalHistory GetAbnormalHistory(RequestAbnormalHistory data)
        {
            AbnormalManager abnormalManager = new AbnormalManager(m_hyDataManager);
            return abnormalManager.GetAbnormalHistory(data);
        }

        public ResponseTodayAlarmDataEx ToTodayAlarmDataEx(ResponseTodayAlarmData data)
        {
            AlarmManager alarmManager = new AlarmManager(m_hyDataManager, m_sdmsDataManager);
            return alarmManager.ToTodayAlarmDataEx(data);
        }

        public ResponseAlarmEx ToResponseAlarmEx(ResponseAlarm data)
        {
            AlarmManager alarmManager = new AlarmManager(m_hyDataManager, m_sdmsDataManager);
            return alarmManager.ToResponseAlarmEx(data);
        }

        public ResponseWorkerInfo RequestWorkerInfo(RequestWorkerInfo data)
        {
            ItemManager itemManager = new ItemManager(m_hyDataManager);
            return itemManager.GetWorkerInfo(data);
        }

        public ResponseItemInfo RequestItemInfo(RequestItemInfo data)
        {
            ItemManager itemManager = new ItemManager(m_hyDataManager);
            return itemManager.GetItemInfo(data);
        }

        public bool Malfunction(string strSopWebServerUrl, int sensorType, int sensorZoneID, int accessedUserID, bool isMalfunction)
        {
            AlarmManager alarmManager = new AlarmManager(m_hyDataManager, m_sdmsDataManager);
            return alarmManager.Malfunction(strSopWebServerUrl, sensorType, sensorZoneID, accessedUserID, isMalfunction);
        }

        public ResponseSensorListEx ToResponseSensorListEx(ResponseSensorList data)
        {
            SensorManager sensorManager = new SensorManager(m_hyDataManager);
            return sensorManager.ToResponseSensorListEx(data);
        }

        public History.BLL.Models.Response.ResponseSensorDetectHistories DisplaySensorDetectHistories(DateTime beginTime, DateTime endTime, int facilityType, int buildingGroupID, int buildingID, int zoneID, int nLastSensorZoneHistoryID, int rowCount, bool bIsDesc, int nSiteID, bool justOneType)
        {
            HistoryManager historyManager = new HistoryManager(this);
            return historyManager.DisplaySensorDetectHistories(beginTime, endTime, facilityType, buildingGroupID, buildingID, zoneID, nLastSensorZoneHistoryID, rowCount, bIsDesc, nSiteID, justOneType);
        }

        public History.BLL.Models.Response.ResponseSensorDetectHistories DisplaySensorDetectHistoryQuery(string strCondition, int nLastSensorZoneHistoryID, int rowCount, int nSiteID)
        {
            HistoryManager historyManager = new HistoryManager(this);
            return historyManager.DisplaySensorDetectHistoryQuery(strCondition, nLastSensorZoneHistoryID, rowCount, nSiteID, false);
        }

        public History.BLL.Models.Response.ResponseSensorDetectAnalysis DisplaySensorDetectAnalysis(DateTime beginTime, DateTime endTime, int facilityType, int buildingGroupID, int buildingID, int zoneID, int siteID, bool justOneType)
        {
            HistoryManager historyManager = new HistoryManager(this);
            return historyManager.DisplaySensorDetectAnalysis(beginTime, endTime, facilityType, buildingGroupID, buildingID, zoneID, siteID, justOneType);
        }

        public History.BLL.Models.Response.ResponseSensorDetectAnalysis DisplaySensorDetectAnalysisQuery(string strCondition, int siteID)
        {
            HistoryManager historyManager = new HistoryManager(this);
            return historyManager.DisplaySensorDetectAnalysisQuery(strCondition, siteID);
        }

        public ResponseSensorDetectCondition GetSensorDetectCondition(DateTime beginTime, DateTime endTime, int facilityType, int buildingGroupID, int buildingID, int zoneID)
        {
            HistoryManager historyManager = new HistoryManager(this);
            return historyManager.GetSensorDetectCondition(beginTime, endTime, facilityType, buildingGroupID, buildingID, zoneID);
        }
    }
}
