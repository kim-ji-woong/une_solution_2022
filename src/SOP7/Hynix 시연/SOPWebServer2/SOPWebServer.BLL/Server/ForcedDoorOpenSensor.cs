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
using dnsAlarmScript.V1;
using dnsAlarmScript.V2;
using System.Linq;

namespace SOPWebServer.BLL.Server
{
    class ForcedDoorOpenSensor : BaseServer
    {
        private const string EventTypeName = "강제 문열림";
        private const string EventType = "ForedDoorOpen";

        private MainManager m_mainManager = null;

        public ForcedDoorOpenSensor(MainManager mainManager, Factory factory)
            : base(factory)
        {
            m_mainManager = mainManager;
            m_agent = factory.MakeAgent(Factory.AgentType.ForcedDoorOpen);
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
                return ProcessSensorData(header, arrDatas, false, true);

            return new MessageResult(false, ErrorMessageType.ToMessage(ErrorMessageType.UNKNOWN_COMMAND));
        }

        private Result ProcessSensorData(int header, ArrayList arrDatas, bool isReal, bool clearAlarm = false)
        {
            if (arrDatas.Count >= 4 && arrDatas[0] is int && arrDatas[1] is int && arrDatas[2] is int && arrDatas[3] is int)
            {
                int nSensorType = (int)arrDatas[0];
                int nSensorTagID = (int)arrDatas[1];
                int nSensorZoneID = (int)arrDatas[2];
                int nSensorData = (int)arrDatas[3];

                int? nAlarmLevel = null;

                if (arrDatas.Count > 4 && arrDatas[4] is int)
                    nAlarmLevel = (int)arrDatas[4];

                WriteLog(EventTypeName + " ProcessSensorData 수신 (SensorType: " + nSensorType.ToString() + ", SensorTagID: " + nSensorTagID.ToString() + ", SensorZoneID: " + nSensorZoneID.ToString() +
                    ", SensorData: " + nSensorData.ToString() + ")");

                if (nSensorData > 0 || clearAlarm == false)
                {
                    if (CheckAlarmTime(m_mainManager.CommonDataManager, EventType) == false)
                        return new Result(true);
                }

                Facility.FacilityType sensorType = Facility.ToFacilityType(nSensorType);
                SensorZoneGroup group = SensorZoneGroup.GetSensorZoneGroup(m_mainManager.SDMSDataManager, m_mainManager.SensorManager, nSensorZoneID, (int)Facility.FacilityType.Event_ForcedDoorOpen);
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
                    int nResult = AddAlarm(group, nSensorTagID, sensorZone, isReal, nAlarmLevel, out alarm);

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

            string strPosition = GetPosition(nOrgSensorID);

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

        private int AddAlarm(SensorZoneGroup group, int nSensorTagID, SensorZone sensorZone, bool isReal, int? nAlarmLevel, out AlarmData alarm)
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
                int? cardReaderID = GetCardReaderID(sensorZone, out nZoneID);

                if (group.EquipmentZone != null)
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
                }

                int nSiteID = (group.EquipmentZone != null ? group.EquipmentZone.SiteID : m_mainManager.SDMSDataManager.SiteID);

                alarm = ((Process.AlarmManager)m_mainManager.AlarmManager).AddAlarm(sensorZone.ID, 1, nZoneID, (int)Facility.FacilityType.Event_ForcedDoorOpen, (int)detectionStatus, timeStamp, m_mainManager.SDMSDataManager, FacilityManager.DetectTypes.Detect, nSiteID);

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

                    string strMessage = GetDetectMessage(sensorZone.OrgSensorID, isReal);
                    string strEquipZoneID = group.EquipmentZone == null ? null : group.EquipmentZone.ID.ToString();
                    SensorReactionHistory.ReactionTypes reactionType = SensorReactionHistory.ReactionTypes.BEGIN_STATUS;

                    string strParam3 = ((int)Facility.FacilityType.Event_ForcedDoorOpen).ToString();
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

        private int? GetCardReaderID(SensorZone sensorZone, out int zoneID)
        {
            zoneID = -1;

            string strErrorMessage;
            int? cardReaderID = (int)sensorZone.OrgSensorID;

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

            AlarmScript script = ReadAlarmScript(m_mainManager.HynixDataManager, (int)Facility.FacilityType.Event_ForcedDoorOpen, out strErrorMessage);

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
            Dictionary<string, List<Hynix.Model.History.CardTag>> dicVariableCardTagHistories = new Dictionary<string, List<Hynix.Model.History.CardTag>>();

            foreach (ScriptInfo info in infos)
            {
                if (ReadContext(context, info, dicVariableCardTagHistories, sensorZone, dtEvent, out strErrorMessage) == false)
                    return false;
            }

            strChangedScript = ExpressionEvaluator.RemoveWhileExpression(strChangedScript);

            List<string> contributingVariables = null;

            if (ExpressionEvaluator.EvaluateTrace(strChangedScript, context, out contributingVariables, out strErrorMessage) == false)
            {
                // 조건을 만족하지 않는다.
                return true;
            }

            List<Hynix.Model.History.CardTag> tagHistories = GetCardTagHistories(dicVariableCardTagHistories, contributingVariables);

            bool isNullable;
            int cardReaderID = (int)sensorZone.OrgSensorID;
            
            CardReader reader = m_mainManager.HynixDataManager.GetSelectManager().SelectHynixCardReader(cardReaderID, out strErrorMessage);
            string strCardReaderPosition = reader == null ? "" : reader.UniqueKey;

            int orderIndex = 1;

            // Key : Card ID
            // Value : Worker ID
            Dictionary<int, int> dicCardIDs = new Dictionary<int, int>();
            List<Hynix.Model.History.SensorZoneInfo> sensorZoneInfos = new List<Hynix.Model.History.SensorZoneInfo>();

            foreach (var tagHistory in tagHistories)
            {
                Hynix.Model.History.SensorZoneInfo sensorZoneInfo = new Hynix.Model.History.SensorZoneInfo();

                string strType = tagHistory.Type == (int)Hynix.Model.History.CardTag.TaggingTypes.Incoming ? "IN" : "OUT";

                sensorZoneInfo.SensorZoneHistoryID = sensorZoneHistoryID;
                sensorZoneInfo.OrderIndex = orderIndex++;
                sensorZoneInfo.WorkerID = tagHistory.CardID;
                sensorZoneInfo.ItemID = null;
                sensorZoneInfo.Param = CheatedTaggingSensor.GetTimeString(tagHistory.Time) + ", " + strType + ", " + strCardReaderPosition;

                dicCardIDs[tagHistory.CardID] = tagHistory.CardID;
                sensorZoneInfos.Add(sensorZoneInfo);
            }

            if (dicCardIDs.Count > 0)
            {
                string strCardIDs = string.Join(",", dicCardIDs.Keys);
                string strCondition = string.Format("{0} in ({1})", Card.GetFieldName(Card.Fields.CardID, out isNullable), strCardIDs);
                List<Card> cards = m_mainManager.HynixDataManager.GetSelectManager().SelectHynixCards(null, strCondition, out strErrorMessage);

                if (cards == null)
                    return false;

                foreach (Card card in cards)
                {
                    dicCardIDs[card.CardID] = card.WorkerID;
                }

                foreach (var sensorZoneInfo in sensorZoneInfos)
                {
                    int workerID;

                    if (dicCardIDs.TryGetValue((int)sensorZoneInfo.WorkerID, out workerID))
                        sensorZoneInfo.WorkerID = workerID;

                    if (m_mainManager.HynixDataManager.GetCreateManager().CreateHynixSensorZoneHistoryInfo(sensorZoneInfo, out strErrorMessage) == null)
                        return false;
                }
            }

            return true;
        }

        public static List<Hynix.Model.History.CardTag> GetCardTagHistories(Dictionary<string, List<Hynix.Model.History.CardTag>> dicVariableCardTagHistories, List<string> contributingVariables)
        {
            Dictionary<int, Hynix.Model.History.CardTag> dicCardTagHistories = new Dictionary<int, Hynix.Model.History.CardTag>();
            List<Hynix.Model.History.CardTag> cardTagHistories;

            foreach (string strVariable in contributingVariables)
            {
                if (dicVariableCardTagHistories.TryGetValue(strVariable, out cardTagHistories))
                {
                    foreach (var cardTagHistory in cardTagHistories)
                    {
                        dicCardTagHistories[cardTagHistory.CardTagHistoryID] = cardTagHistory;
                    }
                }
            }

            cardTagHistories = new List<Hynix.Model.History.CardTag>();
            cardTagHistories.AddRange(dicCardTagHistories.Values);
            return cardTagHistories.OrderByDescending(x => cardTagHistories.Count(s => s.CardID == x.CardID)).ToList();
        }

        private bool ReadContext(Dictionary<string, object>  context, ScriptInfo info, Dictionary<string, List<Hynix.Model.History.CardTag>> dicVariableCardTagHistories, SensorZone sensorZone, DateTime dtEvent, out string strErrorMessage)
        {
            int cardReaderID = (int)sensorZone.OrgSensorID;
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
                    List<Hynix.Model.History.CardTag> tagHistories = ReadCardTaggingCount(cardReaderID, dtTarget, info.ElapsedTimeOperation, isApprove, out strErrorMessage);

                    if (tagHistories == null)
                        return false;

                    int cardID;
                    int maxCount = GetMaxTagHistoryCount(tagHistories, out cardID);

                    context["#" + variable] = maxCount;
                    dicVariableCardTagHistories["#" + variable] = tagHistories;
                }
                else if (variable.StartsWith("smarttagtaggingcount"))
                {
                    List<Hynix.Model.History.SmartTag> tagHistories = ReadSmartTagTaggingCount(m_mainManager.HynixDataManager, dtTarget, info.ElapsedTimeOperation, out strErrorMessage);

                    if (tagHistories == null)
                        return false;

                    int smartTagID;
                    int maxCount = GetMaxTagHistoryCount(tagHistories, out smartTagID);

                    context["#" + variable] = maxCount;
                }
            }

            strErrorMessage = null;
            return true;
        }

        private List<Hynix.Model.History.CardTag> ReadCardTaggingCount(int cardReaderID, DateTime? dtTarget, string op, bool isApprove, out string strErrorMessage)
        {
            bool isNullable;
            string strCondition = null;
            int approve = isApprove ? 1 : 0;

            op = GetOppositeOperator(op);

            if (dtTarget != null && op != null && op.Length > 0)
            {
                strCondition = string.Format("{0} = {1} and {2} {3} '{4}' and {5} = {6}",
                    Hynix.Model.History.CardTag.GetFieldName(Hynix.Model.History.CardTag.Fields.CardReaderID, out isNullable),
                    cardReaderID,
                    Hynix.Model.History.CardTag.GetFieldName(Hynix.Model.History.CardTag.Fields.Time, out isNullable),
                    op,
                    CheatedTaggingSensor.GetTimeString((DateTime)dtTarget),
                    Hynix.Model.History.CardTag.GetFieldName(Hynix.Model.History.CardTag.Fields.IsApprove, out isNullable),
                    approve);
            }
            else
            {
                strCondition = string.Format("{0} = {1} and {2} = {3}",
                    Hynix.Model.History.CardTag.GetFieldName(Hynix.Model.History.CardTag.Fields.CardReaderID, out isNullable),
                    cardReaderID,
                    Hynix.Model.History.CardTag.GetFieldName(Hynix.Model.History.CardTag.Fields.IsApprove, out isNullable),
                    approve);
            }
            
            List<Hynix.Model.History.CardTag> tagHistories = m_mainManager.HynixDataManager.GetSelectManager().SelectHynixCardTagHistorys(null, strCondition, out strErrorMessage);

            if (tagHistories == null)
                return null;

            return tagHistories;
        }

        public static int GetMaxTagHistoryCount(List<Hynix.Model.History.CardTag> tagHistories, out int cardID)
        {
            cardID = -1;

            int taggingCount;
            int maxCount = 0;

            // Key : Card ID
            // Value : HistoryCount
            Dictionary<int, int> dicCardTaggingCount = new Dictionary<int, int>();

            foreach (var tagHistory in tagHistories)
            {
                if (dicCardTaggingCount.TryGetValue(tagHistory.CardID, out taggingCount) == false)
                    dicCardTaggingCount[tagHistory.CardID] = 1;
                else
                    dicCardTaggingCount[tagHistory.CardID] = taggingCount + 1;

                if (maxCount <= 0 || maxCount < dicCardTaggingCount[tagHistory.CardID])
                {
                    maxCount = dicCardTaggingCount[tagHistory.CardID];
                    cardID = tagHistory.CardID;
                }
            }

            return maxCount;
        }

        public static int GetMaxTagHistoryCount(List<Hynix.Model.History.SmartTag> tagHistories, out int smartTagID)
        {
            smartTagID = -1;

            int taggingCount;
            int maxCount = 0;

            // Key : Card ID
            // Value : HistoryCount
            Dictionary<int, int> dicCardTaggingCount = new Dictionary<int, int>();

            foreach (var tagHistory in tagHistories)
            {
                if (dicCardTaggingCount.TryGetValue(tagHistory.SmartTagID, out taggingCount) == false)
                    dicCardTaggingCount[tagHistory.SmartTagID] = 1;
                else
                    dicCardTaggingCount[tagHistory.SmartTagID] = taggingCount + 1;

                if (maxCount <= 0 || maxCount < dicCardTaggingCount[tagHistory.SmartTagID])
                {
                    maxCount = dicCardTaggingCount[tagHistory.SmartTagID];
                    smartTagID = tagHistory.SmartTagID;
                }
            }

            return maxCount;
        }

        public static string GetOppositeOperator(string op)
        {
            if (op != null)
            {
                if (op == "=")
                    return "<>";
                else if (op == "<>")
                    return "=";
                else if (op == ">")
                    return "<=";
                else if (op == ">=")
                    return "<";
                else if (op == "<")
                    return ">=";
                else if (op == "<=")
                    return ">";
            }

            return null;
        }

        public static List<Hynix.Model.History.SmartTag> ReadSmartTagTaggingCount(Hynix.IDAL.IDataManager dataManager, DateTime? dtTarget, string op, out string strErrorMessage)
        {
            bool isNullable;
            string strCondition = null;

            if (dtTarget != null && op != null && op.Length > 0)
            {
                strCondition = string.Format("{0} {1} '{2}'",
                    Hynix.Model.History.SmartTag.GetFieldName(Hynix.Model.History.SmartTag.Fields.Time, out isNullable),
                    op,
                    CheatedTaggingSensor.GetTimeString((DateTime)dtTarget));
            }

            List<Hynix.Model.History.SmartTag> tagHistories = dataManager.GetSelectManager().SelectHynixSmartTagHistorys(null, strCondition, out strErrorMessage);

            if (tagHistories == null)
                return null;

            return tagHistories;
        }

        //private bool AddSensorZoneHistoryInfo(SensorZone sensorZone, int sensorZoneHistoryID, DateTime dtEvent, out string strErrorMessage)
        //{
        //    strErrorMessage = null;

        //    if (sensorZone.OrgSensorID == null)
        //        return true;

        //    int cardReaderID = (int)sensorZone.OrgSensorID;
        //    DateTime dtTarget = dtEvent.AddMinutes(-10);
        //    bool isNullable;

        //    string strCondition = string.Format("{0} = {1} and {2} >= '{3}' and {4} = 0",
        //        Hynix.Model.History.CardTag.GetFieldName(Hynix.Model.History.CardTag.Fields.CardReaderID, out isNullable),
        //        cardReaderID,
        //        Hynix.Model.History.CardTag.GetFieldName(Hynix.Model.History.CardTag.Fields.Time, out isNullable),
        //        CheatedTaggingSensor.GetTimeString(dtTarget),
        //        Hynix.Model.History.CardTag.GetFieldName(Hynix.Model.History.CardTag.Fields.IsApprove, out isNullable));

        //    List<Hynix.Model.History.CardTag> tagHistories = m_mainManager.HynixDataManager.GetSelectManager().SelectHynixCardTagHistorys(null, strCondition, out strErrorMessage);

        //    if (tagHistories == null)
        //        return false;

        //    CardReader reader = m_mainManager.HynixDataManager.GetSelectManager().SelectHynixCardReader(cardReaderID, out strErrorMessage);
        //    string strCardReaderPosition = reader == null ? "" : reader.UniqueKey;

        //    int orderIndex = 1;

        //    // Key : Card ID
        //    // Value : Worker ID
        //    Dictionary<int, int> dicCardIDs = new Dictionary<int, int>();
        //    List<Hynix.Model.History.SensorZoneInfo> sensorZoneInfos = new List<Hynix.Model.History.SensorZoneInfo>();

        //    foreach (var tagHistory in tagHistories)
        //    {
        //        Hynix.Model.History.SensorZoneInfo sensorZoneInfo = new Hynix.Model.History.SensorZoneInfo();

        //        string strType = tagHistory.Type == (int)Hynix.Model.History.CardTag.TaggingTypes.Incoming ? "IN" : "OUT";

        //        sensorZoneInfo.SensorZoneHistoryID = sensorZoneHistoryID;
        //        sensorZoneInfo.OrderIndex = orderIndex++;
        //        sensorZoneInfo.WorkerID = tagHistory.CardID;
        //        sensorZoneInfo.ItemID = null;
        //        sensorZoneInfo.Param = CheatedTaggingSensor.GetTimeString(tagHistory.Time) + ", " + strType + ", " + strCardReaderPosition;

        //        dicCardIDs[tagHistory.CardID] = tagHistory.CardID;
        //        sensorZoneInfos.Add(sensorZoneInfo);
        //    }

        //    if (dicCardIDs.Count > 0)
        //    {
        //        string strCardIDs = string.Join(",", dicCardIDs.Keys);
        //        strCondition = string.Format("{0} in ({1})", Card.GetFieldName(Card.Fields.CardID, out isNullable), strCardIDs);
        //        List<Card> cards = m_mainManager.HynixDataManager.GetSelectManager().SelectHynixCards(null, strCondition, out strErrorMessage);

        //        if (cards == null)
        //            return false;

        //        foreach (Card card in cards)
        //        {
        //            dicCardIDs[card.CardID] = card.WorkerID;
        //        }

        //        foreach (var sensorZoneInfo in sensorZoneInfos)
        //        {
        //            int workerID;

        //            if (dicCardIDs.TryGetValue((int)sensorZoneInfo.WorkerID, out workerID))
        //                sensorZoneInfo.WorkerID = workerID;

        //            if (m_mainManager.HynixDataManager.GetCreateManager().CreateHynixSensorZoneHistoryInfo(sensorZoneInfo, out strErrorMessage) == null)
        //                return false;
        //        }
        //    }

        //    return true;
        //}

        private string GetDetectMessage(int? nOrgSensorID, bool isReal)
        {
            string strEventName = EventTypeName + " 신호";

            string strPosition = GetPosition(nOrgSensorID);

            if (isReal)
            {
                string strTag = GetTrainingModeString();

                if (strPosition == null)
                    return strTag + strEventName + "가 탐지되었습니다";
                else
                    return string.Format("{0}[{1}]에서 {2}가 탐지되었습니다", strTag, strPosition, strEventName);
            }

            if (strPosition == null)
                return string.Format("[테스트]{0}가 탐지되었습니다", strEventName);

            return string.Format("[테스트][{0}]에서 {1}가 탐지되었습니다", strPosition, strEventName);
        }

        private string GetPosition(int? nOrgSensorID)
        {
            if (nOrgSensorID.HasValue)
            {
                string strErrorMessage;
                CardReader cardReader = m_mainManager.HynixDataManager.GetSelectManager().SelectHynixCardReader(nOrgSensorID.Value, out strErrorMessage);

                if (cardReader != null)
                {
                    if (cardReader.UniqueKey != null && cardReader.UniqueKey.Length == 0)
                        return null;

                    return cardReader.UniqueKey;
                }
            }

            return null;
        }

        private string GetTrainingModeString()
        {
            return m_agentFactory.SMSManager.GetTrainingModeString();
        }
    }
}
