using AgentFactory.BLL;
using dnsSopID;
using SDMS.Model.History;
using SDMS.Model.Sensor;
using SDMS.Model.Spatial;
using SOPWebServer.BLL.Models;
using SOPWebServer.BLL.Response;
using System;
using System.Collections;
using System.Collections.Generic;
using Hynix.Model;
using Hynix.Model.History;
using dnsAlarmScript.V1;
using dnsAlarmScript.V2;

namespace SOPWebServer.BLL.Server
{
    class CheatedTaggingSensor : BaseServer
    {
        private const string EventTypeName = "대리태깅";
        private const string EventType = "CheatedTagging";

        // 대리태깅 : 1분에 4회 이상 태깅
        private const int CheatedTagging_Seconds = 60;
        private const int CheatedTagging_Count = 4;

        private MainManager m_mainManager = null;

        public CheatedTaggingSensor(MainManager mainManager, Factory factory)
            : base(factory)
        {
            m_mainManager = mainManager;
            m_agent = factory.MakeAgent(Factory.AgentType.CheatedTagging);
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
                return ProcessSensorData(header, arrDatas, false, null, null, true);

            return new MessageResult(false, ErrorMessageType.ToMessage(ErrorMessageType.UNKNOWN_COMMAND));
        }

        private Result ProcessSensorData(int header, ArrayList arrDatas, bool isReal, List<CardTag> cardTagHistories = null, int? cardReaderID = null, bool clearAlarm = false)
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

                WriteLog(EventTypeName + " ProcessSensorData 수신 (SensorType: " + nSensorType.ToString() + ", SensorTagID: " + nSensorTagID.ToString() + ", SensorZoneID: " + nSensorZoneID.ToString() +
                    ", SensorData: " + nSensorData.ToString() + ")");

                Facility.FacilityType sensorType = Facility.ToFacilityType(nSensorType);
                SensorZoneGroup group = SensorZoneGroup.GetSensorZoneGroup(m_mainManager.SDMSDataManager, m_mainManager.SensorManager, nSensorZoneID, (int)Facility.FacilityType.Event_CheatedTagging);
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

                    if (cardReaderID != null && group.CurrentAlarm?.ReactionHistoryParam4 != null)
                    {
                        int targetSensorID;

                        if (int.TryParse(group.CurrentAlarm.ReactionHistoryParam4.Trim(), out targetSensorID))
                        {
                            if (targetSensorID == (int)cardReaderID)
                            {
                                // 이미 같은 알람이 발생한 상태다.
                                return new Result(true);
                            }
                        }
                    }

                    // 알람 발생
                    AlarmData alarm;
                    int nResult = AddAlarm(group, nSensorTagID, sensorZone, isReal, nAlarmLevel, dtEvent, cardTagHistories, cardReaderID, out alarm);

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

        private int AddAlarm(SensorZoneGroup group, int nSensorTagID, SensorZone sensorZone, bool isReal, int? nAlarmLevel, DateTime dtEvent, List<CardTag> cardTagHistories, int? cardReaderID, out AlarmData alarm)
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

                alarm = ((Process.AlarmManager)m_mainManager.AlarmManager).AddAlarm(sensorZone.ID, 1, nZoneID, (int)Facility.FacilityType.Event_CheatedTagging, (int)detectionStatus, timeStamp, m_mainManager.SDMSDataManager, FacilityManager.DetectTypes.Detect, nSiteID);

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

                    string strMessage = GetDetectMessage(sensorZone.OrgSensorID, dtEvent, isReal, cardTagHistories);
                    string strEquipZoneID = group.EquipmentZone == null ? null : group.EquipmentZone.ID.ToString();
                    SensorReactionHistory.ReactionTypes reactionType = SensorReactionHistory.ReactionTypes.BEGIN_STATUS;

                    string strParam3 = ((int)Facility.FacilityType.Event_CheatedTagging).ToString();
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

            AlarmScript script = ReadAlarmScript(m_mainManager.HynixDataManager, (int)Facility.FacilityType.Event_CheatedTagging, out strErrorMessage);

            if (script == null)
                return true;

            string strChangedScript;
            List<string> variables = Validator.CheckValidation(script.Script, out strChangedScript, out strErrorMessage);

            // Script에 오류가 발견되어도 알람과정에 영향을 미치면 안된다.
            if (variables == null)
                return true;

            List<ScriptInfo> infos = Validator.GetScriptInfos(strChangedScript);
            Dictionary<string, object> context = new Dictionary<string, object>();

            // Key : Variable(with index)
            // Value : 해당 Variable로 인한 CardTagHistories
            Dictionary<string, List<CardTag>> dicVariableCardTagHistories = new Dictionary<string, List<CardTag>>();

            foreach (ScriptInfo info in infos)
            {
                if (ReadContext(m_mainManager.HynixDataManager, context, info, dicVariableCardTagHistories, (int)sensorZone.OrgSensorID, dtEvent, out strErrorMessage) == false)
                    return false;
            }

            strChangedScript = ExpressionEvaluator.RemoveWhileExpression(strChangedScript);

            List<string> contributingVariables = null;

            if (ExpressionEvaluator.EvaluateTrace(strChangedScript, context, out contributingVariables, out strErrorMessage) == false)
            {
                // 조건을 만족하지 않는다.
                return true;
            }

            List<CardTag> tagHistories = ForcedDoorOpenSensor.GetCardTagHistories(dicVariableCardTagHistories, contributingVariables);

            int cardID = (int)sensorZone.OrgSensorID;
            DateTime dtTarget = dtEvent.AddSeconds(-CheatedTagging_Seconds);
            bool isNullable;

            /*string strCondition = string.Format("{0} >= '{1}' and {2} = 1 and {3} = {4}",
                CardTag.GetFieldName(CardTag.Fields.Time, out isNullable),
                CheatedTaggingSensor.GetTimeString(dtTarget),
                CardTag.GetFieldName(CardTag.Fields.IsApprove, out isNullable),
                CardTag.GetFieldName(CardTag.Fields.CardID, out isNullable),
                cardID);

            List<CardTag> tagHistories = m_mainManager.HynixDataManager.GetSelectManager().SelectHynixCardTagHistorys(null, strCondition, out strErrorMessage);

            if (tagHistories == null)
                return false;*/

            int taggingCount = 0;

            foreach (var tagHistory in tagHistories)
            {
                taggingCount++;
            }

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

            SensorZoneInfo sensorZoneInfo = new SensorZoneInfo();

            sensorZoneInfo.SensorZoneHistoryID = sensorZoneHistoryID;
            sensorZoneInfo.OrderIndex = 1;
            sensorZoneInfo.WorkerID = worker.WorkerID;
            sensorZoneInfo.ItemID = null;
            sensorZoneInfo.Param = taggingCount.ToString();

            if (m_mainManager.HynixDataManager.GetCreateManager().CreateHynixSensorZoneHistoryInfo(sensorZoneInfo, out strErrorMessage) == null)
                return false;

            return true;
        }

        private static bool ReadContext(Hynix.IDAL.IDataManager dataManager, Dictionary<string, object> context, ScriptInfo info, Dictionary<string, List<CardTag>> dicVariableCardTagHistories, int cardID, DateTime dtEvent, out string strErrorMessage)
        {
            DateTime? dtTarget = null;

            if (info.ElapsedTimeOperation != null && info.ElapsedTimeTargetSeconds != null)
            {
                dtTarget = dtEvent.AddSeconds(-(int)info.ElapsedTimeTargetSeconds);
            }

            foreach (var variable in info.Variables)
            {
                if (variable.StartsWith("cardtaggingcount") || variable.StartsWith("carddeniedcount"))
                {
                    bool isApprove = variable.StartsWith("cardtaggingcount");
                    List<CardTag> tagHistories = ReadCardTaggingCount(dataManager, cardID, dtTarget, info.ElapsedTimeOperation, isApprove, out strErrorMessage);

                    if (tagHistories == null)
                        return false;

                    int _cardID;
                    int maxCount = ForcedDoorOpenSensor.GetMaxTagHistoryCount(tagHistories, out _cardID);

                    context["#" + variable] = maxCount;
                    dicVariableCardTagHistories["#" + variable] = tagHistories;
                }
                else if (variable.StartsWith("smarttagtaggingcount"))
                {
                    List<Hynix.Model.History.SmartTag> tagHistories = ForcedDoorOpenSensor.ReadSmartTagTaggingCount(dataManager, dtTarget, info.ElapsedTimeOperation, out strErrorMessage);

                    if (tagHistories == null)
                        return false;

                    int smartTagID;
                    int maxCount = ForcedDoorOpenSensor.GetMaxTagHistoryCount(tagHistories, out smartTagID);

                    context["#" + variable] = maxCount;
                }
            }

            strErrorMessage = null;
            return true;
        }

        private static List<CardTag> ReadCardTaggingCount(Hynix.IDAL.IDataManager dataManager, int cardID, DateTime? dtTarget, string op, bool isApprove, out string strErrorMessage)
        {
            bool isNullable;
            string strCondition = null;
            int approve = isApprove ? 1 : 0;

            op = ForcedDoorOpenSensor.GetOppositeOperator(op);

            if (dtTarget != null && op != null && op.Length > 0)
            {
                strCondition = string.Format("{0} {1} '{2}' and {3} = {4} and {5} = {6}",
                    CardTag.GetFieldName(CardTag.Fields.Time, out isNullable),
                    op,
                    CheatedTaggingSensor.GetTimeString((DateTime)dtTarget),
                    CardTag.GetFieldName(CardTag.Fields.IsApprove, out isNullable),
                    approve,
                    CardTag.GetFieldName(CardTag.Fields.CardID, out isNullable),
                    cardID);
            }
            else
            {
                strCondition = string.Format("{0} = {1} and {2} = {3}",
                    CardTag.GetFieldName(CardTag.Fields.IsApprove, out isNullable),
                    approve,
                    CardTag.GetFieldName(CardTag.Fields.CardID, out isNullable),
                    cardID);
            }

            List<CardTag> tagHistories = dataManager.GetSelectManager().SelectHynixCardTagHistorys(null, strCondition, out strErrorMessage);
            return tagHistories;
        }

        //private bool AddSensorZoneHistoryInfo(SensorZone sensorZone, int sensorZoneHistoryID, DateTime dtEvent, out string strErrorMessage)
        //{
        //    strErrorMessage = null;

        //    if (sensorZone.OrgSensorID == null)
        //        return true;

        //    int cardID = (int)sensorZone.OrgSensorID;
        //    DateTime dtTarget = dtEvent.AddSeconds(-CheatedTagging_Seconds);
        //    bool isNullable;

        //    string strCondition = string.Format("{0} >= '{1}' and {2} = 1 and {3} = {4}",
        //        CardTag.GetFieldName(CardTag.Fields.Time, out isNullable),
        //        CheatedTaggingSensor.GetTimeString(dtTarget),
        //        CardTag.GetFieldName(CardTag.Fields.IsApprove, out isNullable),
        //        CardTag.GetFieldName(CardTag.Fields.CardID, out isNullable),
        //        cardID);

        //    List<CardTag> tagHistories = m_mainManager.HynixDataManager.GetSelectManager().SelectHynixCardTagHistorys(null, strCondition, out strErrorMessage);

        //    if (tagHistories == null)
        //        return false;

        //    int taggingCount = 0;

        //    foreach (var tagHistory in tagHistories)
        //    {
        //        taggingCount++;
        //    }

        //    strCondition = string.Format("{0} in (Select {1} from {2} where {3} = {4})",
        //        Worker.GetFieldName(Worker.Fields.WorkerID, out isNullable),
        //        Card.GetFieldName(Card.Fields.WorkerID, out isNullable),
        //        Card.TableName,
        //        Card.GetFieldName(Card.Fields.CardID, out isNullable),
        //        cardID);

        //    List<Worker> workers = m_mainManager.HynixDataManager.GetSelectManager().SelectHynixWorkers(null, strCondition, out strErrorMessage);

        //    if (workers == null || workers.Count == 0)
        //        return false;

        //    Worker worker = workers[0];

        //    SensorZoneInfo sensorZoneInfo = new SensorZoneInfo();

        //    sensorZoneInfo.SensorZoneHistoryID = sensorZoneHistoryID;
        //    sensorZoneInfo.OrderIndex = 1;
        //    sensorZoneInfo.WorkerID = worker.WorkerID;
        //    sensorZoneInfo.ItemID = null;
        //    sensorZoneInfo.Param = taggingCount.ToString();

        //    if (m_mainManager.HynixDataManager.GetCreateManager().CreateHynixSensorZoneHistoryInfo(sensorZoneInfo, out strErrorMessage) == null)
        //        return false;

        //    return true;
        //}

        private string GetDetectMessage(int? nOrgSensorID, DateTime dtEvent, bool isReal, List<CardTag> cardTagHistories)
        {
            string strEventName = EventTypeName + " 신호";

            string strWorkerEvent = GetWorkerEvent(nOrgSensorID, dtEvent, cardTagHistories);

            if (strWorkerEvent != null)
            {
                if (isReal)
                    return strWorkerEvent;
                else
                    return "[테스트]" + strWorkerEvent;
            }

            string strTag = GetTrainingModeString();

            if (isReal)
            {
                return strTag + strEventName + " 신호가 탐지되었습니다.";
            }

            return "[테스트]" + strTag + strEventName + " 신호가 탐지되었습니다.";
        }

        private string GetWorkerEvent(int? nOrgSensorID, DateTime dtEvent, List<CardTag> cardTagHistories)
        {
            if (nOrgSensorID.HasValue)
            {
                string strErrorMessage;
                Worker worker = m_mainManager.HynixDataManager.GetSelectManager().SelectHynixWorker(nOrgSensorID.Value, out strErrorMessage);

                if (worker != null)
                {
                    Dictionary<Card.Fields, object> dicConditions = new Dictionary<Card.Fields, object>();
                    dicConditions[Card.Fields.WorkerID] = worker.WorkerID;

                    List<Card> cards = m_mainManager.HynixDataManager.GetSelectManager().SelectHynixCards(dicConditions, null, out strErrorMessage);

                    if (cards == null || cards.Count == 0)
                        return null;

                    Card card = cards[0];

                    Dictionary<CardTag.Fields, object> conditions = new Dictionary<CardTag.Fields, object>();
                    conditions[CardTag.Fields.CardID] = card.CardID;

                    if (cardTagHistories == null)
                    {
                        bool isNullable;
                        DateTime dtTarget = dtEvent.AddSeconds(-CheatedTagging_Seconds);
                        string strCondition = string.Format("{0} >= '{1}'", CardTag.GetFieldName(CardTag.Fields.Time, out isNullable), GetTimeString(dtTarget));

                        cardTagHistories = m_mainManager.HynixDataManager.GetSelectManager().SelectHynixCardTagHistorys(conditions, strCondition, out strErrorMessage);
                    }

                    if (cardTagHistories == null)
                        return null;

                    int tagCount = GetTaggingCount(cardTagHistories);

                    string strWorkerInfo = string.Format("{0}의 {1}(이)가 카드를 1분 동안 총 {2}회 이상 태깅하였습니다.", worker.OfficeName, worker.Name, tagCount);
                    return strWorkerInfo;
                }
            }

            return null;
        }

        private static int GetTaggingCount(List<CardTag> cardTagHistories)
        {
            int tagCount = 0;

            foreach (CardTag history in cardTagHistories)
            {
                if (history.Type == (int)CardTag.TaggingTypes.Incoming)
                {
                    // 입실
                    tagCount++;
                }
                else if (history.Type == (int)CardTag.TaggingTypes.OutGoing)
                {
                    // 퇴실
                    if (tagCount > 0)
                        tagCount--;
                }
            }

            return tagCount;
        }

        public static string GetTimeString(DateTime time)
        {
            return string.Format("{0}-{1:00}-{2:00} {3:00}:{4:00}:{5:00}", time.Year, time.Month, time.Day, time.Hour, time.Minute, time.Second);
        }

        private string GetTrainingModeString()
        {
            return m_agentFactory.SMSManager.GetTrainingModeString();
        }

        public static bool CheckEvent(MainManager mainManager, CardTag tagHistory, SensorZone sensorZone, out string strErrorMessage)
        {
            if (CheckAlarmTime(mainManager.CommonDataManager, EventType) == false)
            {
                strErrorMessage = null;
                return true;
            }

            AlarmScript script = ReadAlarmScript(mainManager.HynixDataManager, (int)Facility.FacilityType.Event_CheatedTagging, out strErrorMessage);

            if (script == null)
                return false;

            string strChangedScript;
            List<string> variables = Validator.CheckValidation(script.Script, out strChangedScript, out strErrorMessage);

            // Script에 오류가 발견되어도 알람과정에 영향을 미치면 안된다.
            if (variables == null)
                return true;

            List<ScriptInfo> infos = Validator.GetScriptInfos(strChangedScript);
            Dictionary<string, object> context = new Dictionary<string, object>();

            // Key : Variable(with index)
            // Value : 해당 Variable로 인한 CardTagHistories
            Dictionary<string, List<CardTag>> dicVariableCardTagHistories = new Dictionary<string, List<CardTag>>();

            foreach (ScriptInfo info in infos)
            {
                if (ReadContext(mainManager.HynixDataManager, context, info, dicVariableCardTagHistories, (int)sensorZone.OrgSensorID, tagHistory.Time, out strErrorMessage) == false)
                    return false;
            }

            strChangedScript = ExpressionEvaluator.RemoveWhileExpression(strChangedScript);

            List<string> contributingVariables = null;

            if (ExpressionEvaluator.EvaluateTrace(strChangedScript, context, out contributingVariables, out strErrorMessage) == false)
            {
                // 조건을 만족하지 않는다.
                return false;
            }

            List<CardTag> cardTagHistories = ForcedDoorOpenSensor.GetCardTagHistories(dicVariableCardTagHistories, contributingVariables);
            /*bool isNullable;
            DateTime dtTarget = tagHistory.Time.AddSeconds(-CheatedTagging_Seconds);
            string strCondition = string.Format("{0} >= '{1}' and {2} = 1", 
                CardTag.GetFieldName(CardTag.Fields.Time, out isNullable), GetTimeString(dtTarget),
                CardTag.GetFieldName(CardTag.Fields.IsApprove, out isNullable));

            List<CardTag> cardTagHistories = mainManager.HynixDataManager.GetSelectManager().SelectHynixCardTagHistorys(null, strCondition, out strErrorMessage);

            if (cardTagHistories == null)
                return false;*/

            ProcessAlarm(mainManager, sensorZone.ID, tagHistory.Time, cardTagHistories, tagHistory.CardReaderID);
            return true;
        }

        private static void ProcessAlarm(MainManager mainManager, int sensorZoneID, DateTime timeStamp, List<CardTag> cardTagHistories, int cardReaderID)
        {
            string strErrorMessage;
            int? sensorTagInfoID = WorkerManager.GetSensorTagID(mainManager, sensorZoneID, out strErrorMessage);

            if (sensorTagInfoID == null)
                return;

            ArrayList arrDatas = new ArrayList();

            arrDatas.Add((int)Facility.FacilityType.Event_CheatedTagging);
            arrDatas.Add((int)sensorTagInfoID);
            arrDatas.Add(sensorZoneID);
            arrDatas.Add(1);

            // Alarm Level
            arrDatas.Add(2);

            if (timeStamp != null)
                arrDatas.Add((DateTime)timeStamp);

            CheatedTaggingSensor server = new CheatedTaggingSensor(mainManager, mainManager.SensorManager.Factory);
            server.ProcessSensorData(Header.SENSOR_DATA, arrDatas, true, cardTagHistories, cardReaderID);
        }
    }
}
