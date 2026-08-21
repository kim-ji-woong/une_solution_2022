using System.Collections;
using System.Collections.Generic;
using SDMS.IDAL;
using SDMS.Model.History;
using SDMS.Model.Sensor;
using SDMS.Model.Spatial;
using Common.Model.History;
using dnsData.Sensor;
using History.IBLL.Models.Response;
using SOPManager.Model.Sop.Category;

namespace GGH.BLL
{
    using Models.Request;
    using Models.Response;
    using Models.Alarm;
    using Report;

    public class ReportManager
    {
        private IDataManager m_dataManager = null;
        private Common.IDAL.IDataManager m_commonDataManager = null;

        public ReportManager(IDataManager dataManager, Common.IDAL.IDataManager commonDataManager)
        {
            m_dataManager = dataManager;
            m_commonDataManager = commonDataManager;
        }

        public ResponseWordInfo GetAlarmReport(RequestAlarmReport data, History.IBLL.IProcessManager historyProcessManager)
        {
            string strErrorMessage;

            // Key : SensorZoneHistoryID
            Dictionary<int, AlarmData> dicAlarms = GetAlarmTime(data.SensorZoneHistoryIDs, out strErrorMessage);

            if (dicAlarms == null)
                return new ResponseWordInfo(false, strErrorMessage);

            if (GetSensor(dicAlarms, out strErrorMessage) == false)
                return new ResponseWordInfo(false, strErrorMessage);

            if (GetActionStepHistory(dicAlarms, historyProcessManager, out strErrorMessage) == false)
                return new ResponseWordInfo(false, strErrorMessage);

            AlarmSopReport report = new AlarmSopReport(m_dataManager, m_commonDataManager);
            return report.MakeReport(dicAlarms);
        }

        public ResponseWordInfo GetSopReport(RequestSopReport data, History.IBLL.IProcessManager historyProcessManager)
        {
            // Key : ActionStepHistoryID
            Dictionary<int, AlarmData> dicActionStepAlarmData = new Dictionary<int, AlarmData>();
            string strActionStepHistoryIDs = null;

            foreach (int actionStepHistoryID in data.ActionStepHistoryIDs)
            {
                ResponseSOPComponentHistories sopComponentHistories = historyProcessManager.DisplaySOPComponentHistories(actionStepHistoryID);

                if (sopComponentHistories == null)
                    return new ResponseWordInfo(false, "Database로부터 SOP 실행이력을 읽어오지 못하였습니다.");

                AlarmData alarmData = new AlarmData();

                if (sopComponentHistories.SOPComponentHistoryDatas != null && sopComponentHistories.SOPComponentHistoryDatas.Count > 0)
                    alarmData.SopComponentHistoryDatas.AddRange(sopComponentHistories.SOPComponentHistoryDatas);

                dicActionStepAlarmData[actionStepHistoryID] = alarmData;

                if (strActionStepHistoryIDs == null)
                    strActionStepHistoryIDs = actionStepHistoryID.ToString();
                else
                    strActionStepHistoryIDs += ", " + actionStepHistoryID.ToString();
            }

            if (strActionStepHistoryIDs != null)
                SetDisaster(strActionStepHistoryIDs, dicActionStepAlarmData);

            SopReport report = new SopReport(m_dataManager, m_commonDataManager);
            return report.MakeReport(dicActionStepAlarmData);
        }

        private bool GetSensor(Dictionary<int, AlarmData> dicAlarms, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (dicAlarms.Count == 0)
                return true;

            string strCondition = string.Format("{0}.{1} in ({2})", SensorZoneHistory.TableName, SensorZoneHistory.Fields.ID, string.Join(",", dicAlarms.Keys));
            ArrayList arrDatas = m_dataManager.GetSelectManager().JoinSensorZoneSensorZoneHistory(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return false;

            // Key : EquipZone ID
            Dictionary<int, List<AlarmData>> dicEquipZoneAlarms = new Dictionary<int, List<AlarmData>>();
            int nDataCount = arrDatas.Count;

            Dictionary<int, AlarmData> dicFireAlarms = new Dictionary<int, AlarmData>();
            Dictionary<int, AlarmData> dicPsmAlarms = new Dictionary<int, AlarmData>();
            Dictionary<int, AlarmData> dicEtcAlarms = new Dictionary<int, AlarmData>();

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (arrDatas[i + 1] is SensorZoneHistory && arrDatas[i] is SensorZone)
                {
                    SensorZoneHistory sensorZoneHistory = (SensorZoneHistory)arrDatas[i + 1];
                    SensorZone sensorZone = (SensorZone)arrDatas[i];

                    AlarmData alarmData;

                    if (dicAlarms.TryGetValue(sensorZoneHistory.ID, out alarmData) == false)
                        continue;

                    Facility.FacilityType facilityType = Facility.ToFacilityType(sensorZone.SensorType);
                    alarmData.SensorTypeName = Facility.GetFacilityTypeString(facilityType);

                    if (facilityType == Facility.FacilityType.FIRE_SENSOR)
                        alarmData.SensorTypeEngName = "fire";
                    else if (facilityType == Facility.FacilityType.EmergencyBell)
                        alarmData.SensorTypeEngName = "emergencyBell";

                    List<AlarmData> alarmDatas;

                    if (dicEquipZoneAlarms.TryGetValue(sensorZone.EquipZoneID, out alarmDatas) == false)
                    {
                        alarmDatas = new List<AlarmData>();
                        dicEquipZoneAlarms[sensorZone.EquipZoneID] = alarmDatas;
                    }

                    alarmData.SiteID = sensorZoneHistory.SiteID;
                    alarmData.SensorZoneID = sensorZone.ID;
                    alarmDatas.Add(alarmData);

                    if (sensorZone.OrgSensorID != null)
                    {
                        if (facilityType == Facility.FacilityType.FIRE_SENSOR)
                            dicFireAlarms[(int)sensorZone.OrgSensorID] = alarmData;
                        else if (facilityType == Facility.FacilityType.PSM_SENSOR)
                            dicPsmAlarms[(int)sensorZone.OrgSensorID] = alarmData;
                        else
                            dicEtcAlarms[(int)sensorZone.OrgSensorID] = alarmData;
                    }
                }
            }

            if (SetFireSensors(dicFireAlarms, out strErrorMessage) == false)
                return false;

            if (SetPsmSensors(dicPsmAlarms, out strErrorMessage) == false)
                return false;

            if (SetEtcSensors(dicEtcAlarms, out strErrorMessage) == false)
                return false;

            return SetAlarmLocation(dicEquipZoneAlarms, out strErrorMessage);
        }

        private bool SetEtcSensors(Dictionary<int, AlarmData> dicEtcAlarms, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (dicEtcAlarms.Count == 0)
                return true;

            string strCondition = string.Format("{0} in ({1})", ETC.Fields.ID, string.Join(",", dicEtcAlarms.Keys));
            List<ETC> sensors = m_dataManager.GetSelectManager().SelectETCSensors(null, strCondition, out strErrorMessage);

            if (sensors == null)
                return false;

            AlarmData alarmData;

            foreach (ETC sensor in sensors)
            {
                if (dicEtcAlarms.TryGetValue(sensor.ID, out alarmData) == false)
                    continue;

                alarmData.SensorName = sensor.Name;
            }

            return true;
        }

        private bool SetPsmSensors(Dictionary<int, AlarmData> dicPsmAlarms, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (dicPsmAlarms.Count == 0)
                return true;

            string strCondition = string.Format("{0} in ({1})", PSM.Fields.ID, string.Join(",", dicPsmAlarms.Keys));
            List<PSM> sensors = m_dataManager.GetSelectManager().SelectPSMSensors(null, strCondition, out strErrorMessage);

            if (sensors == null)
                return false;

            AlarmData alarmData;

            foreach (PSM sensor in sensors)
            {
                if (dicPsmAlarms.TryGetValue(sensor.ID, out alarmData) == false)
                    continue;

                alarmData.SensorName = sensor.Name;
            }

            return true;
        }

        private bool SetFireSensors(Dictionary<int, AlarmData> dicFireAlarms, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (dicFireAlarms.Count == 0)
                return true;

            string strCondition = string.Format("{0} in ({1})", Fire.Fields.ID, string.Join(",", dicFireAlarms.Keys));
            List<Fire> sensors = m_dataManager.GetSelectManager().SelectFireSensors(null, strCondition, out strErrorMessage);

            if (sensors == null)
                return false;

            AlarmData alarmData;

            foreach (Fire sensor in sensors)
            {
                if (dicFireAlarms.TryGetValue(sensor.ID, out alarmData) == false)
                    continue;

                alarmData.SensorName = sensor.Name;
            }

            return true;
        }

        private bool SetAlarmLocation(Dictionary<int, List<AlarmData>> dicEquipZoneAlarms, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (dicEquipZoneAlarms.Count == 0)
                return true;

            string strCondition = string.Format("{0} in ({1})", EquipmentZone.Fields.ID, string.Join(",", dicEquipZoneAlarms.Keys));
            List<EquipmentZone> equipZones = m_dataManager.GetSelectManager().SelectEquipmentZones(null, strCondition, out strErrorMessage);

            if (equipZones == null)
                return false;

            Dictionary<int, int> dicZoneIDs = new Dictionary<int, int>();
            Dictionary<int, Dictionary<int, EquipmentZone>> dicZoneEquipZones = new Dictionary<int, Dictionary<int, EquipmentZone>>();

            Dictionary<int, EquipmentZone> dicEquipZones;

            foreach (EquipmentZone equipZone in equipZones)
            {
                foreach (int zoneID in equipZone.LinkedZoneIDs)
                {
                    dicZoneIDs[zoneID] = zoneID;

                    if (dicZoneEquipZones.TryGetValue(zoneID, out dicEquipZones) == false)
                    {
                        dicEquipZones = new Dictionary<int, EquipmentZone>();
                        dicZoneEquipZones[zoneID] = dicEquipZones;
                    }

                    dicEquipZones[equipZone.ID] = equipZone;
                }
            }

            if (dicZoneIDs.Count == 0)
                return true;

            string strZoneIDs = null;

            foreach (KeyValuePair<int, int> pair in dicZoneIDs)
            {
                if (strZoneIDs == null)
                    strZoneIDs = pair.Key.ToString();
                else
                    strZoneIDs += "," + pair.Key.ToString();
            }

            strCondition = string.Format("{0}.{1} in ({2})", Zone.TableName, Zone.Fields.ID, strZoneIDs);
            ArrayList arrDatas = m_dataManager.GetSelectManager().JoinZoneBuilding(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return false;

            List<AlarmData> alarmDatas;
            int nDataCount = arrDatas.Count;

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (arrDatas[i] is Zone && (arrDatas[i + 1] == null || arrDatas[i + 1] is Building))
                {
                    Zone zone = (Zone)arrDatas[i];
                    Building building = (Building)arrDatas[i + 1];

                    if (dicZoneEquipZones.TryGetValue(zone.ID, out dicEquipZones) == false)
                        continue;

                    foreach (KeyValuePair<int, EquipmentZone> pair in dicEquipZones)
                    {
                        if (dicEquipZoneAlarms.TryGetValue(pair.Key, out alarmDatas) == false)
                            continue;

                        foreach (AlarmData alarmData in alarmDatas)
                        {
                            alarmData.Location = GetLocation(building, zone, pair.Value);
                            alarmData.ZoneID = zone.ID;
                        }
                    }
                }
            }

            return true;
        }

        private string GetLocation(Building building, Zone zone, EquipmentZone equipZone)
        {
            string strZoneName = "";

            if (building == null)
                strZoneName = zone.DisplayText;
            else
                strZoneName = building.DisplayText + " " + zone.DisplayText;

            if (strZoneName.Contains(equipZone.DisplayText) == false)
                strZoneName += " " + equipZone.DisplayText;

            return strZoneName;
        }

        private bool GetActionStepHistory(Dictionary<int, AlarmData> dicAlarms, History.IBLL.IProcessManager historyProcessManager, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (dicAlarms.Count == 0)
                return true;

            string strCondition = string.Format("{0} in ({1})", ActionStepHistory.Fields.SensorZoneHistoryID, string.Join(",", dicAlarms.Keys));
            List<ActionStepHistory> actionStepHistories = m_commonDataManager.GetSelectManager().SelectActionStepHistories(strCondition, out strErrorMessage);

            if (actionStepHistories == null)
                return false;

            AlarmData alarmData;

            // Key : ActionStepHistoryID
            Dictionary<int, AlarmData> dicActionStepAlarmData = new Dictionary<int, AlarmData>();
            string strActionStepHistoryIDs = null;

            foreach (ActionStepHistory actionStepHistory in actionStepHistories)
            {
                if (actionStepHistory.SensorZoneHistoryID == null)
                    continue;

                if (dicAlarms.TryGetValue((int)actionStepHistory.SensorZoneHistoryID, out alarmData))
                    alarmData.ActionStepHistory = actionStepHistory;

                ResponseSOPComponentHistories response = historyProcessManager.DisplaySOPComponentHistories(actionStepHistory.ID);

                if (response == null || response.SOPComponentHistoryDatas == null || response.SOPComponentHistoryDatas.Count == 0)
                {
                    alarmData.ActionStepHistory = null;
                }
                else
                {
                    if (strActionStepHistoryIDs == null)
                        strActionStepHistoryIDs = actionStepHistory.ID.ToString();
                    else
                        strActionStepHistoryIDs += "," + actionStepHistory.ID.ToString();

                    dicActionStepAlarmData[actionStepHistory.ID] = alarmData;
                    alarmData.SopComponentHistoryDatas.AddRange(response.SOPComponentHistoryDatas);
                }
            }

            if (strActionStepHistoryIDs != null)
                SetDisaster(strActionStepHistoryIDs, dicActionStepAlarmData);

            return true;
        }

        private void SetDisaster(string strActionStepHistoryIDs, Dictionary<int, AlarmData> dicActionStepAlarmData)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0}.{1} in ({2})", ActionStepHistory.TableName, ActionStepHistory.Fields.ID, strActionStepHistoryIDs);
            ArrayList arrDatas = m_commonDataManager.GetSelectManager().JoinActionStepHistoryActionStepDisaster(null, null, null, strCondition, out strErrorMessage);

            if (arrDatas == null)
                return;

            AlarmData alarmData;
            int nDataCount = arrDatas.Count;

            for (int i=0;i<nDataCount-2;i+=3)
            {
                if (arrDatas[i] is ActionStepHistory && arrDatas[i + 1] is ActionStep && arrDatas[i + 2] is Disaster)
                {
                    ActionStepHistory actionStepHistory = (ActionStepHistory)arrDatas[i];
                    ActionStep actionStep = (ActionStep)arrDatas[i + 1];
                    Disaster disaster = (Disaster)arrDatas[i + 2];

                    if (dicActionStepAlarmData.TryGetValue(actionStepHistory.ID, out alarmData))
                    {
                        if (alarmData.ActionStepHistory == null)
                            alarmData.ActionStepHistory = actionStepHistory;

                        alarmData.SopName = disaster.DisasterName;
                        alarmData.ActionStepName = actionStep.StepName;
                    }
                }
            }
        }

        private Dictionary<int, AlarmData> GetAlarmTime(List<int> sensorZoneHistoryIDs, out string strErrorMessage)
        {
            strErrorMessage = null;

            Dictionary<int, AlarmData> dicAlarms = new Dictionary<int, AlarmData>();

            if (sensorZoneHistoryIDs.Count == 0)
                return dicAlarms;

            string strCondition = string.Format("{0} in ({1})", SensorReactionHistory.Fields.SensorZoneHistoryID, string.Join(",", sensorZoneHistoryIDs.ToArray()));
            List<SensorReactionHistory> sensorReactionHistories = m_dataManager.GetSelectManager().SelectSensorReactionHistories(null, strCondition, out strErrorMessage);

            if (sensorReactionHistories == null)
                return null;

            AlarmData alarmData;

            foreach (var sensorReactionHistory in sensorReactionHistories)
            {
                if (dicAlarms.TryGetValue(sensorReactionHistory.SensorZoneHistoryID, out alarmData) == false)
                {
                    alarmData = new AlarmData();
                    alarmData.SensorZoneHistoryID = sensorReactionHistory.SensorZoneHistoryID;
                    dicAlarms[alarmData.SensorZoneHistoryID] = alarmData;
                }

                alarmData.SensorReactionHistories.Add(sensorReactionHistory);

                if (sensorReactionHistory.ReactionType == SensorReactionHistory.ReactionTypes.BEGIN_STATUS)
                {
                    alarmData.BeginTime = sensorReactionHistory.Time;
                    SetAlarmDepth(sensorReactionHistory, alarmData);
                }
                else if (sensorReactionHistory.ReactionType == SensorReactionHistory.ReactionTypes.CHANGE_ALARM_DEPTH)
                    SetAlarmDepth(sensorReactionHistory, alarmData);
                else if (sensorReactionHistory.ReactionType == SensorReactionHistory.ReactionTypes.END_STATUS ||
                    sensorReactionHistory.ReactionType == SensorReactionHistory.ReactionTypes.USER_RESET ||
                    sensorReactionHistory.ReactionType == SensorReactionHistory.ReactionTypes.TIME_OUT)
                    alarmData.EndTime = sensorReactionHistory.Time;
            }

            return dicAlarms;
        }

        private void SetAlarmDepth(SensorReactionHistory sensorReactionHistory, AlarmData alarmData)
        {
            if (sensorReactionHistory.Param5 == null)
                return;

            int alarmDepth;

            if (int.TryParse(sensorReactionHistory.Param5, out alarmDepth))
                alarmData.AlarmDepth = alarmDepth;
        }
    }
}
