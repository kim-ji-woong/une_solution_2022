using AgentFactory.BLL;
using dnsSopID;
using SDMS.Model.Sensor;
using SOPWebServer.BLL.Response;
using System.Collections;
using System.Collections.Generic;
using Hynix.Model;
using System;
using SDMS.Model.History;
using SDMS.Model.Spatial;

namespace SOPWebServer.BLL.Server
{
    using Models;

    class StealCardSensor : BaseServer
    {
        private const string EventTypeName = "꼬리물기";
        private const string EventType = "StealCard";

        private MainManager m_mainManager = null;

        public StealCardSensor(MainManager mainManager, Factory factory)
            : base(factory)
        {
            m_mainManager = mainManager;
            m_agent = factory.MakeAgent(Factory.AgentType.StealCard);
        }

        protected override void OnLoadEvent()
        {
        }

        protected override Result OnReceiveEvent(int header, string strClientInfo, ArrayList arrDatas)
        {
            if (header == Header.SENSOR_DATA)
                return ProcessSensorData(header, arrDatas, true);
            else if (header == Header.SENSOR_DATA_TEST)
                return ProcessSensorData(header, arrDatas, false);
            else if (header == Header.SENSOR_MALFUNCTION || header == Header.SENSOR_USER_RESET)
                return ProcessSensorData(header, arrDatas, false, null, true);

            return new MessageResult(false, ErrorMessageType.ToMessage(ErrorMessageType.UNKNOWN_COMMAND));
        }

        public static bool CheckEvent(MainManager mainManager, Hynix.Model.History.CardTag tagHistory, SensorZone sensorZone, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (sensorZone.OrgSensorID == null)
                return false;

            if (CheckAlarmTime(mainManager.CommonDataManager, EventType) == false)
            {
                return true;
            }

            CardReader cardReader = mainManager.HynixDataManager.GetSelectManager().SelectHynixCardReader(tagHistory.CardReaderID, out strErrorMessage);

            if (cardReader == null)
                return false;

            bool isNullable;
            int cardID = (int)sensorZone.OrgSensorID;

            if (cardReader.ZoneID >= 20000)
            {
                string strCondition = string.Format("{0} = {1} and {2} = {3}",
                    Hynix.Model.History.CardTag.GetFieldName(Hynix.Model.History.CardTag.Fields.CardID, out isNullable), cardID,
                    Hynix.Model.History.CardTag.GetFieldName(Hynix.Model.History.CardTag.Fields.CardReaderID, out isNullable), cardReader.CardReaderID);

                List<Hynix.Model.History.CardTag> cardTagHistories = mainManager.HynixDataManager.GetSelectManager().SelectHynixCardTagHistorys(null, strCondition, out strErrorMessage);

                if (cardTagHistories == null)
                    return false;

                if (UntaggingSensor.IsInWork(mainManager, cardTagHistories, out strErrorMessage))
                {
                    // 작업장 내에 있는데 외부식당에서 태깅이 검출되었다.
                    StealCardSensor server = new StealCardSensor(mainManager, mainManager.SensorManager.Factory);
                    server.ProcessAlarm(tagHistory, sensorZone, tagHistory.CardReaderID);
                    return true;
                }
            }

            
            return false;
        }

        private void ProcessAlarm(Hynix.Model.History.CardTag tagHistory, SensorZone sensorZone, int cardReaderID)
        {
            string strErrorMessage;
            int? sensorTagInfoID = WorkerManager.GetSensorTagID(m_mainManager, sensorZone.ID, out strErrorMessage);

            if (sensorTagInfoID == null)
                return;

            ArrayList arrDatas = new ArrayList();

            arrDatas.Add((int)Facility.FacilityType.Event_StealCard);
            arrDatas.Add((int)sensorTagInfoID);
            arrDatas.Add(sensorZone.ID);
            arrDatas.Add(1);

            // Alarm Level
            arrDatas.Add(2);

            arrDatas.Add(tagHistory.Time);

            ProcessSensorData(Header.SENSOR_DATA, arrDatas, true, cardReaderID);
        }

        private Result ProcessSensorData(int header, ArrayList arrDatas, bool isReal, int? cardReaderID = null, bool clearAlarm = false)
        {
            if (arrDatas.Count >= 4 && arrDatas[0] is int && arrDatas[1] is int && arrDatas[2] is int && arrDatas[3] is int)
            {
                int nSensorType = (int)arrDatas[0];
                int nSensorTagID = (int)arrDatas[1];
                int nSensorZoneID = (int)arrDatas[2];
                int nSensorData = (int)arrDatas[3];

                int? nAlarmLevel = null;
                int dataCount = arrDatas.Count;

                if (dataCount > 4 && arrDatas[4] is int)
                    nAlarmLevel = (int)arrDatas[4];

                if (nSensorData > 0 || clearAlarm == false)
                {
                    if (CheckAlarmTime(m_mainManager.CommonDataManager, EventType) == false)
                        return new Result(true);
                }

                DateTime dtEvent = DateTime.Now;

                if (dataCount > 4 && arrDatas[dataCount - 1] is DateTime)
                {
                    dtEvent = (DateTime)arrDatas[dataCount - 1];
                }

                Facility.FacilityType sensorType = Facility.ToFacilityType(nSensorType);
                SensorZoneGroup group = SensorZoneGroup.GetSensorZoneGroup(m_mainManager.SDMSDataManager, m_mainManager.SensorManager, nSensorZoneID, (int)Facility.FacilityType.Event_StealCard);
                //SensorZoneGroup group = m_mainManager.SensorManager.GetSensorZoneGroup(nSensorZoneID);

                if (group == null)
                    return GetErrorMessageResult(ErrorMessageType.UNKNOWN_SENSOR_ID);

                SensorZone sensorZone = m_mainManager.SensorManager.GetSensorZone(nSensorZoneID);

                if (sensorZone == null)
                    return GetErrorMessageResult(ErrorMessageType.UNKNOWN_SENSOR_ID);

                if (nSensorData > 0)
                {
                    // 알람 신호 받지 않음
                    int nSiteID = (group.EquipmentZone != null ? group.EquipmentZone.SiteID : m_mainManager.SDMSDataManager.SiteID);
                    bool useReceive = m_mainManager.SensorManager.GetUseReceive(nSensorType, nSiteID);
                    if (!useReceive)
                        return new Result(true);

                    // 알람 발생
                    AlarmData alarm;
                    int nResult = AddAlarm(group, nSensorTagID, sensorZone, isReal, nAlarmLevel, dtEvent, cardReaderID, out alarm);

                    if (alarm != null)
                    {
                        m_mainManager.ProcessManager.NewAlarm(alarm, group.GetAlarmSensorZoneIDs());
                    }

                    if (nResult == ErrorMessageType.SUCCESS)
                        return new Result(true);

                    return new MessageResult(false, ErrorMessageType.ToMessage(nResult));
                }
                else
                {
                    // 알람 해제
                    AlarmData _alarm = group.CurrentAlarm;

                    if (_alarm == null)
                        _alarm = ((Process.AlarmManager)m_mainManager.AlarmManager).FindAlarm(nSensorZoneID, Facility.ToFacilityType(nSensorType), m_mainManager.SDMSDataManager);

                    // 중복된 알람이 있으면 같이 복구한다.
                    List<AlarmData> alarms = m_mainManager.CheckDuplicateAlarms(_alarm);

                    foreach (AlarmData alarm in alarms)
                    {
                        group.CurrentAlarm = alarm;
                        AlarmData alarmPrev = alarm != null ? alarm.Clone() : null;

                        int nResult = ErrorMessageType.SUCCESS;

                        if (clearAlarm)
                        {
                            bool bChk = false;

                            foreach (KeyValuePair<SensorZone, int> pair in group.GetSensors())
                            {
                                int result = RemoveAlarm(group, pair.Key, isReal, header);
                                bChk = true;

                                if (result != ErrorMessageType.SUCCESS)
                                {
                                    nResult = result;
                                }
                            }

                            if (bChk == false)
                                nResult = RemoveAlarm(group, sensorZone, isReal, header);
                        }
                        else
                        {
                            nResult = RemoveAlarm(group, sensorZone, isReal, header);
                        }

                        if (alarm != null && group.CurrentAlarm == null)
                        {
                            alarm.Status = (int)SensorReactionHistory.ReactionTypes.END_STATUS;
                            m_agentFactory.ProcessManager.ClearAlarm(alarm);
                        }
                        else if (alarm != null && group.CurrentAlarm != null)
                        {
                            int nAlarmDepth = m_agent.GetAlarmDepth(m_mainManager.AlarmManager, group.GetSensors(), null);
                            alarm.AlarmDepth = nAlarmDepth;
                            ChangeAlarm(m_mainManager, group.CurrentAlarm, alarmPrev, group, sensorZone, 0);
                        }

                        if (nResult != ErrorMessageType.SUCCESS)
                            return new MessageResult(false, ErrorMessageType.ToMessage(nResult));
                    }

                    return new Result(true);
                }
            }

            return new MessageResult(false, ErrorMessageType.ToMessage(ErrorMessageType.INVALID_MESSAGE));
        }

        public int RemoveAlarm(SensorZoneGroup group, SensorZone sensorZone, bool isReal, int header)
        {
            DateTime timeStamp = DateTime.Now;

            if (group.RemoveSensorData(sensorZone, m_mainManager.SDMSDataManager) == false)
            {
                WriteLog("RemoveSensorData 실패 : " + sensorZone.ID.ToString());
                return ErrorMessageType.DB_EXCEPTION;
            }

            // sensorZone의 신호는 복구되었지만 같은 영역에 다른 신호가 아직 남아있는 상황
            if (group.GetSensors().Length > 0 && group.CurrentAlarm != null)
            {
                return ErrorMessageType.SUCCESS;
            }

            AlarmData alarm = group.CurrentAlarm;

            if (alarm == null)
            {
                return ErrorMessageType.SUCCESS;
            }

            EquipmentZone equipZone = m_mainManager.SensorManager.GetEquipmentZone(sensorZone.EquipZoneID);
            string strMessage = GetClearMessage(Facility.ToFacilityType(sensorZone.SensorType), sensorZone.OrgSensorID, isReal);
            string strEquipZoneID = equipZone == null ? null : sensorZone.EquipZoneID.ToString();

            SensorZoneHistory.DetectionType detectionStatus = isReal ? SensorZoneHistory.DetectionType.Real : SensorZoneHistory.DetectionType.Test;
            SensorReactionHistory.ReactionTypes reactionType = SensorReactionHistory.ReactionTypes.END_STATUS;
            if (header == Header.SENSOR_MALFUNCTION)
                reactionType = SensorReactionHistory.ReactionTypes.MALFUNCTION;
            else if (header == Header.SENSOR_USER_RESET)
                reactionType = SensorReactionHistory.ReactionTypes.USER_RESET;

            if (((Process.AlarmManager)m_mainManager.AlarmManager).RemoveAlarm(alarm, timeStamp, (int)reactionType, strMessage, strEquipZoneID, sensorZone.ID.ToString(), null, null, null, (int)detectionStatus, m_mainManager.SDMSDataManager))
            {
                alarm.Message = strMessage;
                group.CurrentAlarm = null;
                return ErrorMessageType.SUCCESS;
            }

            WriteLog("RemoveAlarm 실패 : " + sensorZone.ID.ToString());
            return ErrorMessageType.DB_EXCEPTION;
        }

        private string GetClearMessage(Facility.FacilityType sensorType, int? nOrgSensorID, bool isReal)
        {
            string strEventName = EventTypeName + " 신호";
            string strMessage = "상황해제";

            string strPosition = null;

            if (isReal)
            {
                string strTag = GetTrainingModeString();

                if (strPosition == null)
                    strMessage = strTag + strEventName + "가 복구되었습니다";
                else
                    strMessage = string.Format("{0}[{1}]에서 탐지된 {2}가 복구되었습니다", strTag, strPosition, strEventName);
            }
            else
            {
                if (strPosition == null)
                    strMessage = string.Format("[테스트]{0}가 복구되었습니다", strEventName);
                else
                    strMessage = string.Format("[테스트][{0}]에서 탐지된 {1}가 복구되었습니다", strPosition, strEventName);
            }

            return strMessage;
        }

        private int AddAlarm(SensorZoneGroup group, int nSensorTagID, SensorZone sensorZone, bool isReal, int? nAlarmLevel, DateTime dtEvent, int? cardReaderID, out AlarmData alarm)
        {
            alarm = null;

            // 알람발생 신호에 대해서만 센서 비활성화를 검사한다.
            // 이미 알람이 발생한 센서의 경우 센서가 비활성화 상태이더라도 알람을 해제할 수 있어야 한다.
            if (m_mainManager.SensorManager.IsActiveSensor(nSensorTagID) == false)
            {
                WriteLog("AddAlarm 무시(비활성화된 센서) : " + sensorZone.ID.ToString());
                return ErrorMessageType.SUCCESS;
            }

            AlarmData currentAlarm = group.CurrentAlarm;
            int nSensorDataCount = group.GetSensors().Length;

            if (currentAlarm == null && nSensorDataCount > 0)
            {
                //  논리적인 오류
                group.ClearSensorDatas(m_mainManager.SDMSDataManager);
            }
            else if (currentAlarm != null && nSensorDataCount > 0)
            {
                // 이미 알람이 발생중이다.
                // Sensor 데이터만 기록하고 종료한다.
                return ChangeAlarm(m_mainManager, currentAlarm, group, sensorZone, nAlarmLevel);
            }
            else
            {
                int nAlarmDepth = m_agent.GetAlarmDepth(m_mainManager.AlarmManager, group.GetSensors(), sensorZone, nAlarmLevel);

                group.SetSensorData(sensorZone, 1, true, m_mainManager.SDMSDataManager);

                SensorZoneHistory.DetectionType detectionStatus = isReal ? SensorZoneHistory.DetectionType.Real : SensorZoneHistory.DetectionType.Test;

                DateTime timeStamp = DateTime.Now;
                int nZoneID = -1;
                GetCardReaderID(cardReaderID, out nZoneID);

                /*if (group.EquipmentZone != null)
                {
                    if (group.EquipmentZone.LinkedZoneIDs.Count == 1)
                        nZoneID = group.EquipmentZone.LinkedZoneIDs[0];
                    else if (group.EquipmentZone.LinkedZoneIDs.Count > 1)
                    {
                        if (sensorZone.OrgSensorID == null)
                            nZoneID = -1;
                        else
                        {
                            nZoneID = -1;
                        }
                    }
                }*/

                int nSiteID = (group.EquipmentZone != null ? group.EquipmentZone.SiteID : m_mainManager.SDMSDataManager.SiteID);

                alarm = ((Process.AlarmManager)m_mainManager.AlarmManager).AddAlarm(sensorZone.ID, 1, nZoneID, (int)Facility.FacilityType.Event_StealCard, (int)detectionStatus, timeStamp, m_mainManager.SDMSDataManager, FacilityManager.DetectTypes.Detect, nSiteID);

                if (alarm != null)
                {
                    // 동기화 문제로 인하여 같은 SensorZoneGroup에 중복된 알람이 발생하지 않았는지 한번더 검사한다.
                    int errorMessage;
                    if (CheckAlarmDuplication(alarm, group, sensorZone, m_mainManager, (Process.AlarmManager)m_mainManager.AlarmManager, out errorMessage))
                        return errorMessage;

                    alarm.AlarmDepth = nAlarmDepth;
                    //alarm.AlarmDepth = 1;

                    // 알람 단계 전송시
                    if (nAlarmLevel.HasValue)
                        alarm.AlarmDepth = nAlarmLevel.Value;

                    group.CurrentAlarm = alarm;

                    string strMessage = GetDetectMessage(sensorZone.OrgSensorID, dtEvent, isReal);
                    string strEquipZoneID = group.EquipmentZone == null ? null : group.EquipmentZone.ID.ToString();
                    SensorReactionHistory.ReactionTypes reactionType = SensorReactionHistory.ReactionTypes.BEGIN_STATUS;

                    string strParam3 = ((int)Facility.FacilityType.Event_StealCard).ToString();
                    string strParam5 = alarm.AlarmDepth.ToString();

                    // param4는 TargetSensorID
                    string strParam4 = cardReaderID == null ? null : ((int)cardReaderID).ToString();

                    if (((Process.AlarmManager)m_mainManager.AlarmManager).AddReactionHistory(alarm, (int)reactionType, timeStamp, strMessage, strEquipZoneID, sensorZone.ID.ToString(), strParam3, strParam4, strParam5, m_mainManager.SDMSDataManager))
                    {
                        // 실패해도 무시한다.
                        string strErrorMessage;
                        AddSensorZoneHistoryInfo(sensorZone, alarm.SensorZoneHistoryID, alarm.TimeStamp, out strErrorMessage);

                        alarm.Message = strMessage;
                        alarm.IsReal = isReal;
                        alarm.Status = (int)reactionType;
                        return ErrorMessageType.SUCCESS;
                    }
                    else
                    {
                        group.RemoveSensorData(sensorZone, m_mainManager.SDMSDataManager);
                        ((Process.AlarmManager)m_mainManager.AlarmManager).RemoveAlarm(alarm);
                        WriteLog("AddReactionHistory 실패 : " + alarm.SensorZoneHistoryID.ToString());
                        alarm = null;
                    }
                }
                else
                {
                    group.RemoveSensorData(sensorZone, m_mainManager.SDMSDataManager);
                    WriteLog("AddAlarm 실패 : " + sensorZone.ID.ToString());
                }
            }

            return ErrorMessageType.DB_EXCEPTION;
        }

        private int? GetCardReaderID(int? cardReaderID, out int zoneID)
        {
            zoneID = -1;

            string strErrorMessage;

            if (cardReaderID == null)
                return null;

            CardReader cardReader = m_mainManager.HynixDataManager.GetSelectManager().SelectHynixCardReader((int)cardReaderID, out strErrorMessage);

            if (cardReader != null)
            {
                zoneID = cardReader.ZoneID;
                return cardReader.CardReaderID;
            }

            return null;
        }

        private bool AddSensorZoneHistoryInfo(SensorZone sensorZone, int sensorZoneHistoryID, DateTime dtEvent, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (sensorZone.OrgSensorID == null)
                return true;

            bool isNullable;
            int cardID = (int)sensorZone.OrgSensorID;

            string strCondition = string.Format("{0} in (Select {1} from {2} where {3} = {4})",
                Worker.GetFieldName(Worker.Fields.WorkerID, out isNullable),
                Card.GetFieldName(Card.Fields.WorkerID, out isNullable),
                Card.TableName,
                Card.GetFieldName(Card.Fields.CardID, out isNullable),
                cardID);

            List<Worker> workers = m_mainManager.HynixDataManager.GetSelectManager().SelectHynixWorkers(null, strCondition, out strErrorMessage);

            if (workers == null || workers.Count == 0)
                return false;

            Worker worker = workers[0];

            strCondition = string.Format("{0} = {1} and {2} = (Select max({2}) from {3} where {0} = {1})",
                Hynix.Model.History.CardTag.GetFieldName(Hynix.Model.History.CardTag.Fields.CardID, out isNullable),
                cardID,
                Hynix.Model.History.CardTag.GetFieldName(Hynix.Model.History.CardTag.Fields.Time, out isNullable),
                Hynix.Model.History.CardTag.TableName);

            List<Hynix.Model.History.CardTag> tagHistories = m_mainManager.HynixDataManager.GetSelectManager().SelectHynixCardTagHistorys(null, strCondition, out strErrorMessage);

            if (tagHistories == null)
                return false;

            int tagHistoryCount = tagHistories.Count;

            if (tagHistoryCount == 0)
                return false;

            var tagHistory = tagHistories[tagHistoryCount - 1];

            strCondition = string.Format("{0} = {1}", CardReader.GetFieldName(CardReader.Fields.CardReaderID, out isNullable), tagHistory.CardReaderID);
            List<CardReader> cardReaders = m_mainManager.HynixDataManager.GetSelectManager().SelectHynixCardReaders(null, strCondition, out strErrorMessage);

            if (cardReaders == null || cardReaders.Count == 0)
                return false;

            Hynix.Model.History.SensorZoneInfo sensorZoneInfo = new Hynix.Model.History.SensorZoneInfo();

            sensorZoneInfo.SensorZoneHistoryID = sensorZoneHistoryID;
            sensorZoneInfo.OrderIndex = 1;
            sensorZoneInfo.WorkerID = worker.WorkerID;
            sensorZoneInfo.ItemID = null;
            sensorZoneInfo.Param = string.Format("{0}, {1}", CheatedTaggingSensor.GetTimeString(dtEvent), cardReaders[0].UniqueKey);

            if (m_mainManager.HynixDataManager.GetCreateManager().CreateHynixSensorZoneHistoryInfo(sensorZoneInfo, out strErrorMessage) == null)
                return false;

            return true;
        }

        private string GetDetectMessage(int? nOrgSensorID, DateTime dtEvent, bool isReal)
        {
            string strEventName = "사원증도용 이벤트가 발견되었습니다.";
            return strEventName;
        }

        private string GetTrainingModeString()
        {
            return m_agentFactory.SMSManager.GetTrainingModeString();
        }
    }
}
