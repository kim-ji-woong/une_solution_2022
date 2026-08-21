using System;
using System.Collections;
using System.Collections.Generic;
using SDMS.BLL.Models.Response;
using SDMS.BLL.Models.Alarm;
using Hynix.IDAL;
using AgentFactory.BLL;
using Hynix.Model.History;
using dnsCommunicateSopServer;
using SDMS.Model.Sensor;

namespace Hynix.BLL.Process
{
    using Response;

    class AlarmManager
    {
        private class AlarmHistory
        {
            private SDMS.Model.History.SensorReactionHistory m_sensorReactionHistory = null;
            private int m_nSensorType = -1;

            public SDMS.Model.History.SensorReactionHistory SensorReactionHistory
            {
                get { return m_sensorReactionHistory; }
                set { m_sensorReactionHistory = value; }
            }

            public int SensorType
            {
                get { return m_nSensorType; }
                set { m_nSensorType = value; }
            }

            public AlarmHistory()
            {
            }

            public AlarmHistory(SDMS.Model.History.SensorReactionHistory sensorReactionHistory, int sensorType)
            {
                m_sensorReactionHistory = sensorReactionHistory;
                m_nSensorType = sensorType;
            }
        }

        private IDataManager m_dataManager = null;
        private SDMS.IDAL.IDataManager m_sdmsDataManager = null;

        public AlarmManager(IDataManager dataManager, SDMS.IDAL.IDataManager sdmsDataManager)
        {
            m_dataManager = dataManager;
            m_sdmsDataManager = sdmsDataManager;
        }

        public ResponseTodayAlarmDataEx ToTodayAlarmDataEx(ResponseTodayAlarmData data)
        {
            if (data.Success == false)
                return new ResponseTodayAlarmDataEx(false, data.Message);

            // Key : SensorZoneHistoryID
            Dictionary<int, AlarmHistory> dicSensorZoneHistorySensorTypes = new Dictionary<int, AlarmHistory>();
            ResponseTodayAlarmDataEx response = new ResponseTodayAlarmDataEx(true, "");

            foreach (AlarmData alarmData in data.AlarmDatas)
            {
                AlarmDataEx alarmDataEx = ToAlarmDataEx(alarmData, dicSensorZoneHistorySensorTypes);
                response.AlarmDatas.Add(alarmDataEx);
            }

            if (dicSensorZoneHistorySensorTypes.Count > 0)
            {
                if (ReadSensorZoneHistorySensorTypes(dicSensorZoneHistorySensorTypes))
                {
                    SetFacilityTypes(response.AlarmDatas, dicSensorZoneHistorySensorTypes);
                }
            }

            return response;
        }

        public ResponseAlarmEx ToResponseAlarmEx(ResponseAlarm data)
        {
            ResponseAlarmEx response = new ResponseAlarmEx();
            // Key : SensorZoneHistoryID
            Dictionary<int, AlarmHistory> dicSensorZoneHistorySensorTypes = new Dictionary<int, AlarmHistory>();

            foreach (var alarm in data.AlarmDatas)
            {
                response.AlarmDatas.Add(ToAlarmDataEx(alarm, dicSensorZoneHistorySensorTypes));
            }

            foreach (var alarm in data.AllAlarmDatas)
            {
                response.AllAlarmDatas.Add(ToAlarmDataEx(alarm, dicSensorZoneHistorySensorTypes));
            }

            if (dicSensorZoneHistorySensorTypes.Count > 0)
            {
                if (ReadSensorZoneHistorySensorTypes(dicSensorZoneHistorySensorTypes))
                {
                    SetFacilityTypes(response.AlarmDatas, dicSensorZoneHistorySensorTypes);
                    SetFacilityTypes(response.AllAlarmDatas, dicSensorZoneHistorySensorTypes);
                }
            }

            return response;
        }

        public bool Malfunction(string strSopWebServerUrl, int sensorType, int sensorZoneID, int accessedUserID, bool isMalfunction)
        {
            bool isNullable;
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1}", SDMS.Model.Sensor.TagInfo.GetFieldName(SDMS.Model.Sensor.TagInfo.Fields.SensorZoneID, out isNullable), sensorZoneID);
            List<SDMS.Model.Sensor.TagInfo> tagInfos = m_sdmsDataManager.GetSelectManager().SelectSensorTagInfo(null, strCondition, out strErrorMessage);

            if (tagInfos == null || tagInfos.Count == 0)
                return false;

            ArrayList arrDatas = new ArrayList();
            arrDatas.Add(sensorType);
            arrDatas.Add(tagInfos[0].TagNo);
            arrDatas.Add(sensorZoneID);
            arrDatas.Add(false);

            try
            {
                SopQueryManager sopQueryManager = new SopQueryManager();
                sopQueryManager.SendAlarmMalfunctionQuery(isMalfunction, arrDatas, "POST", strSopWebServerUrl + "/api/Worker/SendEvent");
            }
            catch (Exception e)
            {
                System.Diagnostics.Trace.WriteLine(e.Message);
                return false;
            }

            return true;
        }

        private void SetFacilityTypes(List<AlarmDataEx> alarmDatas, Dictionary<int, AlarmHistory> dicSensorZoneHistorySensorTypes)
        {
            AlarmHistory alarmHistory;
            //int facilityType;

            foreach (var alarmData in alarmDatas)
            {
                if (dicSensorZoneHistorySensorTypes.TryGetValue(alarmData.SensorZoneHistoryID, out alarmHistory))
                {
                    alarmData.FacilityType = alarmHistory.SensorType;
                    //alarmData.FacilityType = facilityType;
                    alarmData.FacilityTypeString = Facility.GetFacilityTypeString((Facility.FacilityType)alarmHistory.SensorType);

                    if (alarmData.MaterialType != null)
                        alarmData.MaterialTypeString = alarmData.FacilityTypeString;

                    bool isNullable;

                    string strErrorMessage;
                    string strCondition = string.Format("{0} = {1}", SensorZoneInfo.GetFieldName(SensorZoneInfo.Fields.SensorZoneHistoryID, out isNullable), alarmData.SensorZoneHistoryID);
                    List<SensorZoneInfo> sensorZoneHistoryInfos = m_dataManager.GetSelectManager().SelectHynixSensorZoneHistoryInfos(null, strCondition, out strErrorMessage);

                    if (sensorZoneHistoryInfos != null)
                    {
                        alarmData.SensorZoneHistoryInfos.AddRange(sensorZoneHistoryInfos);
                    }
                }

                alarmData.TargetSensorID = FindTargetSensorID(alarmData, dicSensorZoneHistorySensorTypes);
            }
        }

        private bool ReadSensorZoneHistorySensorTypes(Dictionary<int, AlarmHistory> dicSensorZoneHistorySensorTypes)
        {
            bool isNullable;
            string strErrorMessage;
            string strCondition = string.Format("{0}.{1} in ({2}) and {3}.{4} = 0",
                SDMS.Model.History.SensorZoneHistory.TableName,
                SDMS.Model.History.SensorZoneHistory.GetFieldName(SDMS.Model.History.SensorZoneHistory.Fields.ID, out isNullable),
                string.Join(",", dicSensorZoneHistorySensorTypes.Keys),
                SDMS.Model.History.SensorReactionHistory.TableName,
                SDMS.Model.History.SensorReactionHistory.GetFieldName(SDMS.Model.History.SensorReactionHistory.Fields.ReactionType, out isNullable));

            ArrayList arrDatas = m_sdmsDataManager.GetSelectManager().JoinSensorZoneHistorySensorReactionHistory(strCondition, out strErrorMessage);

            if (arrDatas != null)
            {
                int nDataCount = arrDatas.Count;

                for (int i=0;i<nDataCount-1;i+=2)
                {
                    if (arrDatas[i] is SDMS.Model.History.SensorZoneHistory && arrDatas[i + 1] is SDMS.Model.History.SensorReactionHistory)
                    {
                        var sensorZoneHistory = (SDMS.Model.History.SensorZoneHistory)arrDatas[i];
                        var sensorReactionHistory = (SDMS.Model.History.SensorReactionHistory)arrDatas[i + 1];

                        if (sensorZoneHistory.SensorType == 961)
                            dicSensorZoneHistorySensorTypes[sensorZoneHistory.ID] = new AlarmHistory(sensorReactionHistory, (int)Facility.FacilityType.Event_ForcedDoorOpen);
                        else
                            dicSensorZoneHistorySensorTypes[sensorZoneHistory.ID] = new AlarmHistory(sensorReactionHistory, sensorZoneHistory.SensorType);
                    }
                }

                return true;
            }
            
            return false;
        }

        private AlarmDataEx ToAlarmDataEx(AlarmData alarmData, Dictionary<int, AlarmHistory> dicSensorZoneHistorySensorTypes)
        {
            AlarmDataEx alarmDataEx = new AlarmDataEx(alarmData);

            if (alarmDataEx.FacilityType >= (int)Facility.FacilityType.Event_ForcedDoorOpen && alarmDataEx.FacilityType <= (int)Facility.FacilityType.Event_NotPermittedItem)
            {
                alarmDataEx.FacilityTypeString = Facility.GetFacilityTypeString((Facility.FacilityType)alarmDataEx.FacilityType);

                if (alarmDataEx.MaterialType != null)
                    alarmDataEx.MaterialTypeString = alarmDataEx.FacilityTypeString;

                bool isNullable;

                string strErrorMessage;
                string strCondition = string.Format("{0} = {1}", SensorZoneInfo.GetFieldName(SensorZoneInfo.Fields.SensorZoneHistoryID, out isNullable), alarmDataEx.SensorZoneHistoryID);
                List<SensorZoneInfo> sensorZoneHistoryInfos = m_dataManager.GetSelectManager().SelectHynixSensorZoneHistoryInfos(null, strCondition, out strErrorMessage);

                if (sensorZoneHistoryInfos != null)
                {
                    alarmDataEx.SensorZoneHistoryInfos.AddRange(sensorZoneHistoryInfos);
                }
            }
            else if (alarmDataEx.FacilityType == (int)Facility.FacilityType.NONE)
                dicSensorZoneHistorySensorTypes[alarmDataEx.SensorZoneHistoryID] = null;

            return alarmDataEx;
        }

        private int? FindTargetSensorID(AlarmDataEx alarmData, Dictionary<int, AlarmHistory> dicSensorZoneHistorySensorTypes)
        {
            AlarmHistory alarmHistory;

            if (dicSensorZoneHistorySensorTypes.TryGetValue(alarmData.SensorZoneHistoryID, out alarmHistory))
            {
                if (alarmHistory.SensorReactionHistory.Param4 != null)
                {
                    int targetSensorID;

                    if (int.TryParse(alarmHistory.SensorReactionHistory.Param4.Trim(), out targetSensorID))
                        return targetSensorID;
                }
            }

            return null;
        }
    }
}
