using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Concurrent;
using dnsSopID;
using dnsData.Sensor;
using SDMS.Model.Sensor;
using SDMS.Model.History;
using SDMS.Model.Spatial;
using SDMS.Model.CCTV;
using dnsData.Alarm;
using AgentFactory.BLL;
using System.Threading.Tasks;

namespace SafetyServer.BLL.Server
{
    using Data.Response;
    using Data.Models;

    public class EtcSensor : BaseServer
    {
        private MainManager m_mainManager = null;
        private bool m_initialized = false;

        private Dictionary<Facility.FacilityType, SDMS.Model.Sensor.Option.Etc> m_sensorTypeOptions = new Dictionary<Facility.FacilityType, SDMS.Model.Sensor.Option.Etc>();
        // 알람단계별 옵션데이터
        // Dicionary.Key ; AlarmDepth
        private Dictionary<SDMS.Model.Sensor.Option.Etc, Dictionary<int, SDMS.Model.Sensor.Option.EtcData>> m_optionSensorData = new Dictionary<SDMS.Model.Sensor.Option.Etc, Dictionary<int, SDMS.Model.Sensor.Option.EtcData>>();

        private static ConcurrentQueue<SensorDatas> m_queueSensorDatas = new ConcurrentQueue<SensorDatas>();
        private static ConcurrentQueue<ArrayList> m_queueManualReports = new ConcurrentQueue<ArrayList>();
        private static ConcurrentQueue<ArrayList> m_queueClearManualReports = new ConcurrentQueue<ArrayList>();

        private static bool m_runSensorDatas = false;
        private static bool m_runManualReports = false;
        private static bool m_runClearManualReports = false;

        public EtcSensor(MainManager mainManager, Factory factory)
            : base(factory)
        {
            m_mainManager = mainManager;
            m_agent = factory.MakeAgent(Factory.AgentType.Etc);
        }

        protected override void OnLoadEvent()
        {
            //ReadPrevAlarmSOP();
            m_initialized = true;
        }

        // 이전에 발생했던 알람에 대한 SOP 실행여부를 확인한다.
        /*private void ReadPrevAlarmSOP()
        {
            ICollection<AlarmData> alarms = ((Process.AlarmManager)m_mainManager.AlarmManager).CurrentAlarms;
            string strSensorZoneHistoryIDs = "";

            foreach (AlarmData alarm in alarms)
            {
                if (Facility.IsETCSensorType(alarm.SensorType))
                {
                    if (strSensorZoneHistoryIDs.Length == 0)
                        strSensorZoneHistoryIDs = alarm.SensorZoneHistoryID.ToString();
                    else
                        strSensorZoneHistoryIDs += ", " + alarm.SensorZoneHistoryID.ToString();
                }
            }

            bool isNullable;
            string strCondition = "";
            if (strSensorZoneHistoryIDs.Length > 0)
                strCondition = string.Format("{0} in ({1})", ActionStepHistory.GetFieldName(ActionStepHistory.Fields.SensorZoneHistoryID, out isNullable), strSensorZoneHistoryIDs);

            string strErrorMessage;
            List<ActionStepHistory> actionStepHistories = m_mainManager.CommonDataManager.GetSelectManager().SelectActionStepHistories(strCondition, out strErrorMessage);

            if (actionStepHistories == null)
            {
                System.Diagnostics.Trace.WriteLine(strErrorMessage);
                return;
            }

            foreach (ActionStepHistory history in actionStepHistories)
            {
                if (history.SensorZoneHistoryID == null)
                    continue;

                AlarmData alarm = ((Process.AlarmManager)m_mainManager.AlarmManager).GetAlarm((int)history.SensorZoneHistoryID);

                if (alarm != null)
                {
                    alarm.SOPProcess = AlarmData.SOPProcessType.Run;
                }
            }
        }*/

        protected override Result OnReceiveEvent(int header, string strClientInfo, ArrayList arrDatas)
        {
            // 초기화되기 전에는 통신 데이터를 처리하지 않는다.
            if (m_initialized == false)
                return new Result(true);

            if (header == Header.SENSOR_DATA)
                return ProcessSensorData(header, arrDatas, true);
            else if (header == Header.SENSOR_DATA_TEST)
                return ProcessSensorData(header, arrDatas, false);
            else if (header == Header.SENSOR_MALFUNCTION || header == Header.SENSOR_USER_RESET)
                return ProcessSensorData(header, arrDatas, false);
            else if (header == Header.MANUAL_REPORT)
                return ProcessManualReport(arrDatas);
            else if (header == Header.CLEAR_MANUAL_REPORT)
                return ProcessClearManualReport(arrDatas);

            return new MessageResult(false, ErrorMessageType.ToMessage(ErrorMessageType.UNKNOWN_COMMAND));
        }

        private MessageResult ProcessSensorData(int header, ArrayList arrDatas, bool isReal, bool clearAlarm = false)
        {
            // 동기화 문제를 피하기 위하여 직접 처리하지 않고 Queue에 쌓는다.
            m_queueSensorDatas.Enqueue(new SensorDatas(header, arrDatas, isReal, clearAlarm));

            Task task = ProcessSensorDatas();
            return new MessageResult(true, "");
            /*if (arrDatas.Count >= 4 && arrDatas[0] is int && arrDatas[1] is int && arrDatas[2] is int && arrDatas[3] is int)
            {
                int nSensorType = (int)arrDatas[0];
                int nSensorTagID = (int)arrDatas[1];
                int nSensorZoneID = (int)arrDatas[2];
                int nSensorData = (int)arrDatas[3];

                int nAlarmLevel = -1;

                if (arrDatas.Count > 4 && arrDatas[4] is int)
                    nAlarmLevel = (int)arrDatas[4];

                Facility.FacilityType sensorType = Facility.ToFacilityType(nSensorType);
                SensorZoneGroup group = m_mainManager.SensorManager.GetSensorZoneGroup(nSensorZoneID);

                if (group == null)
                    return GetErrorMessageResult(ErrorMessageType.UNKNOWN_SENSOR_ID);

                SensorZone sensorZone = m_mainManager.SensorManager.GetSensorZone(nSensorZoneID);

                if (sensorZone == null)
                    return GetErrorMessageResult(ErrorMessageType.UNKNOWN_SENSOR_ID);

                if (nSensorData > 0)
                {
                    // 알람 신호 받지 않음
                    bool useReceive = true;//m_mainManager.SensorManager.GetUseReceive(nSensorType);
                    if (!useReceive)
                        return new MessageResult(true, "");

                    // 알람 발생
                    AlarmData alarm;
                    int nResult = AddAlarm(group, nSensorTagID, sensorZone, isReal, nAlarmLevel, out alarm);

                    if (alarm != null)
                    {
                        m_mainManager.ProcessManager.NewAlarm(alarm, group.GetAlarmSensorZoneIDs());
                    }

                    if (nResult == ErrorMessageType.SUCCESS)
                        return new MessageResult(true, "");

                    return new MessageResult(false, ErrorMessageType.ToMessage(nResult));
                }
                else
                {
                    // 알람 해제
                    AlarmData alarm = group.CurrentAlarm;
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
                        alarm.Status = SensorReactionHistory.ReactionTypes.END_STATUS;
                        m_agentFactory.ProcessManager.ClearAlarm(alarm);
                    }
                    else if (alarm != null && group.CurrentAlarm != null)
                    {
                        int nAlarmDepth = m_agent.GetAlarmDepth(m_mainManager.AlarmManager, group.GetSensors(), null);
                        alarm.AlarmDepth = nAlarmDepth;
                        ChangeAlarm(group.CurrentAlarm, alarmPrev, group, sensorZone, 0);
                    }

                    if (nResult == ErrorMessageType.SUCCESS)
                        return new MessageResult(true, "");

                    return new MessageResult(false, ErrorMessageType.ToMessage(nResult));
                }
            }
            else if (arrDatas.Count >= 8 &&
                arrDatas[0] is int &&
                arrDatas[1] is int &&
                arrDatas[2] is int &&
                arrDatas[3] is string &&
                arrDatas[4] is string &&
                arrDatas[5] is DateTime &&
                arrDatas[6] is int &&
                (arrDatas[7] == null || arrDatas[7] is string))
            {
                int nSensorType = (int)arrDatas[0];
                int nSensorTagID = (int)arrDatas[1];
                int nSensorZoneID = (int)arrDatas[2];
                string strMemberID = (string)arrDatas[3];
                string strCameraID = (string)arrDatas[4];
                DateTime timeStamp = (DateTime)arrDatas[5];
                int nAlarmLevel = (int)arrDatas[6];
                string strMessage = (string)arrDatas[7];

                // 외부에서 받은 신호인가?
                bool signalFromSystem = false;

                if (arrDatas.Count >= 9 && arrDatas[8] is bool)
                {
                    signalFromSystem = (bool)arrDatas[8];
                }

                string strErrorMessage;

                Facility.FacilityType sensorType = Facility.ToFacilityType(nSensorType);
                SensorZoneGroup group = m_mainManager.SensorManager.GetSensorZoneGroup(nSensorZoneID);

                if (group == null)
                    return GetErrorMessageResult(ErrorMessageType.UNKNOWN_SENSOR_ID);

                if (nAlarmLevel < 0 && strCameraID.Length == 0)
                {
                    GetAlarmTagFromReactionHistory(group.CurrentAlarm, out strErrorMessage);

                    if (group.CurrentAlarm.Tag != null)
                        strCameraID = group.CurrentAlarm.Tag.ToString();
                }

                if (UpdateSensorData(nSensorZoneID, strCameraID, strMessage, out strErrorMessage) == false)
                    return new MessageResult(false, strErrorMessage);

                

                SensorZone sensorZone = m_mainManager.SensorManager.GetSensorZone(nSensorZoneID);

                if (sensorZone == null)
                    return GetErrorMessageResult(ErrorMessageType.UNKNOWN_SENSOR_ID);

                if (nAlarmLevel > 0)
                {
                    // 알람 발생
                    AlarmData alarm;
                    int nResult = AddAlarm(group, nSensorTagID, sensorZone, isReal, nAlarmLevel, strMessage, out alarm);

                    if (alarm != null)
                    {
                        if (strMessage != null && strMessage.Length > 0)
                            alarm.Message = strMessage;

                        alarm.Tag = strCameraID;
                        SetAlarmTagToReactionHistory(alarm, out strErrorMessage);

                        m_mainManager.ProcessManager.NewAlarm(alarm, group.GetAlarmSensorZoneIDs());
                    }

                    if (nResult == ErrorMessageType.SUCCESS)
                        return new MessageResult(true, "");

                    return new MessageResult(false, ErrorMessageType.ToMessage(nResult));
                }
                else
                {
                    // 알람 해제
                    AlarmData alarm = group.CurrentAlarm;

                    if (alarm == null)
                    {
                        return new MessageResult(false, "Alarm is alreay clear");
                    }

                    alarm.Tag = signalFromSystem;
                    AlarmData alarmPrev = alarm != null ? alarm.Clone() : null;

                    int nResult = RemoveAlarm(group, sensorZone, isReal, header);

                    if (alarm != null && group.CurrentAlarm == null)
                    {
                        alarm.Status = SensorReactionHistory.ReactionTypes.END_STATUS;
                        m_agentFactory.ProcessManager.ClearAlarm(alarm);
                    }
                    else if (alarm != null && group.CurrentAlarm != null)
                    {
                        int nAlarmDepth = m_agent.GetAlarmDepth(m_mainManager.AlarmManager, group.GetSensors(), null);
                        alarm.AlarmDepth = nAlarmDepth;

                        ChangeAlarm(group.CurrentAlarm, alarmPrev, group, sensorZone, 0);
                    }

                    if (nResult == ErrorMessageType.SUCCESS)
                        return new MessageResult(true, "");

                    return new MessageResult(false, ErrorMessageType.ToMessage(nResult));
                }
            }

            return new MessageResult(false, ErrorMessageType.ToMessage(ErrorMessageType.INVALID_MESSAGE));*/
        }

        private async Task ProcessSensorDatas()
        {
            if (m_runSensorDatas)
                return;

            m_runSensorDatas = true;

            // 이 함수를 비동기로 만든다.
            await Task.Yield();

            SensorDatas sensorData;

            while (m_queueSensorDatas.TryDequeue(out sensorData))
            {
                ArrayList arrDatas = sensorData.ArrDatas;
                bool isReal = sensorData.IsReal;
                bool clearAlarm = sensorData.ClearAlarm;
                int header = sensorData.Header;

                if (arrDatas.Count >= 4 && arrDatas[0] is int && arrDatas[1] is int && arrDatas[2] is int && arrDatas[3] is int)
                {
                    int nSensorType = (int)arrDatas[0];
                    int nSensorTagID = (int)arrDatas[1];
                    int nSensorZoneID = (int)arrDatas[2];
                    int nSensorData = (int)arrDatas[3];

                    int nAlarmLevel = -1;

                    if (arrDatas.Count > 4 && arrDatas[4] is int)
                        nAlarmLevel = (int)arrDatas[4];

                    Facility.FacilityType sensorType = Facility.ToFacilityType(nSensorType);
                    SensorZoneGroup group = m_mainManager.SensorManager.GetSensorZoneGroup(nSensorZoneID);

                    if (group == null)
                    {
                        MessageResult result = GetErrorMessageResult(ErrorMessageType.UNKNOWN_SENSOR_ID);
                        System.Diagnostics.Trace.WriteLine("ProcessSensorDatas Error1 : " + result.Message);
                        continue;
                        //return GetErrorMessageResult(ErrorMessageType.UNKNOWN_SENSOR_ID);
                    }

                    SensorZone sensorZone = m_mainManager.SensorManager.GetSensorZone(nSensorZoneID);

                    if (sensorZone == null)
                    {
                        MessageResult result = GetErrorMessageResult(ErrorMessageType.UNKNOWN_SENSOR_ID);
                        System.Diagnostics.Trace.WriteLine("ProcessSensorDatas Error2 : " + result.Message);
                        continue;
                        //return GetErrorMessageResult(ErrorMessageType.UNKNOWN_SENSOR_ID);
                    }

                    if (nSensorData > 0)
                    {
                        // 알람 신호 받지 않음
                        bool useReceive = true;//m_mainManager.SensorManager.GetUseReceive(nSensorType);
                        if (!useReceive)
                        {
                            continue;
                            //return new MessageResult(true, "");
                        }

                        // 알람 발생
                        AlarmData alarm;
                        int nResult = AddAlarm(group, nSensorTagID, sensorZone, isReal, nAlarmLevel, out alarm);

                        if (alarm != null)
                        {
                            m_mainManager.ProcessManager.NewAlarm(alarm, group.GetAlarmSensorZoneIDs());
                        }

                        if (nResult == ErrorMessageType.SUCCESS)
                        {
                            continue;
                            //return new MessageResult(true, "");
                        }

                        MessageResult _result = new MessageResult(false, ErrorMessageType.ToMessage(nResult));
                        System.Diagnostics.Trace.WriteLine("ProcessSensorDatas Error3 : " + _result.Message);
                        continue;
                        //return new MessageResult(false, ErrorMessageType.ToMessage(nResult));
                    }
                    else
                    {
                        // 알람 해제
                        AlarmData alarm = group.CurrentAlarm;
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
                            ChangeAlarm(group.CurrentAlarm, alarmPrev, group, sensorZone, 0);
                        }

                        if (nResult == ErrorMessageType.SUCCESS)
                        {
                            continue;
                            //return new MessageResult(true, "");
                        }

                        MessageResult _result = new MessageResult(false, ErrorMessageType.ToMessage(nResult));
                        System.Diagnostics.Trace.WriteLine("ProcessSensorDatas Error4 : " + _result.Message);
                        continue;
                        //return new MessageResult(false, ErrorMessageType.ToMessage(nResult));
                    }
                }
                else if (arrDatas.Count >= 8 &&
                    arrDatas[0] is int &&
                    arrDatas[1] is int &&
                    arrDatas[2] is int &&
                    arrDatas[3] is string &&
                    arrDatas[4] is string &&
                    arrDatas[5] is DateTime &&
                    arrDatas[6] is int &&
                    (arrDatas[7] == null || arrDatas[7] is string))
                {
                    int nSensorType = (int)arrDatas[0];
                    int nSensorTagID = (int)arrDatas[1];
                    int nSensorZoneID = (int)arrDatas[2];
                    string strMemberID = (string)arrDatas[3];
                    string strCameraID = (string)arrDatas[4];
                    DateTime timeStamp = (DateTime)arrDatas[5];
                    int nAlarmLevel = (int)arrDatas[6];
                    string strMessage = (string)arrDatas[7];

                    // 외부에서 받은 신호인가?
                    bool signalFromSystem = false;

                    if (arrDatas.Count >= 9 && arrDatas[8] is bool)
                    {
                        signalFromSystem = (bool)arrDatas[8];
                    }

                    string strErrorMessage;

                    Facility.FacilityType sensorType = Facility.ToFacilityType(nSensorType);
                    SensorZoneGroup group = m_mainManager.SensorManager.GetSensorZoneGroup(nSensorZoneID);

                    if (group == null)
                    {
                        MessageResult result = GetErrorMessageResult(ErrorMessageType.UNKNOWN_SENSOR_ID);
                        WriteLog(result.Message);
                        System.Diagnostics.Trace.WriteLine("ProcessSensorDatas Error5 : " + result.Message);
                        continue;
                        //return GetErrorMessageResult(ErrorMessageType.UNKNOWN_SENSOR_ID);
                    }

                    if (nAlarmLevel < 0 && strCameraID.Length == 0)
                    {
                        GetAlarmTagFromReactionHistory(group.CurrentAlarm, out strErrorMessage);

                        if (group.CurrentAlarm.Tag != null)
                            strCameraID = group.CurrentAlarm.Tag.ToString();
                    }

                    if (UpdateSensorData(nSensorZoneID, strCameraID, strMessage, out strErrorMessage) == false)
                    {
                        WriteLog(strErrorMessage);
                        System.Diagnostics.Trace.WriteLine("ProcessSensorDatas Error6 : " + strErrorMessage);
                        continue;
                        //return new MessageResult(false, strErrorMessage);
                    }

                    SensorZone sensorZone = m_mainManager.SensorManager.GetSensorZone(nSensorZoneID);

                    if (sensorZone == null)
                    {
                        MessageResult result = GetErrorMessageResult(ErrorMessageType.UNKNOWN_SENSOR_ID);
                        WriteLog(result.Message);
                        System.Diagnostics.Trace.WriteLine("ProcessSensorDatas Error7 : " + result.Message);
                        continue;
                        //return GetErrorMessageResult(ErrorMessageType.UNKNOWN_SENSOR_ID);
                    }

                    if (nAlarmLevel > 0)
                    {
                        // 알람 발생
                        AlarmData alarm;
                        int nResult = AddAlarm(group, nSensorTagID, sensorZone, isReal, nAlarmLevel, strMessage, out alarm);

                        if (alarm != null)
                        {
                            if (strMessage != null && strMessage.Length > 0)
                                alarm.Message = strMessage;

                            alarm.Tag = strCameraID;
                            SetAlarmTagToReactionHistory(alarm, out strErrorMessage);

                            m_mainManager.ProcessManager.NewAlarm(alarm, group.GetAlarmSensorZoneIDs());
                        }

                        if (nResult == ErrorMessageType.SUCCESS)
                        {
                            continue;
                            //return new MessageResult(true, "");
                        }

                        strErrorMessage = ErrorMessageType.ToMessage(nResult);
                        WriteLog(strErrorMessage);
                        System.Diagnostics.Trace.WriteLine("ProcessSensorDatas Error8 : " + strErrorMessage);
                        continue;
                        //return new MessageResult(false, ErrorMessageType.ToMessage(nResult));
                    }
                    else
                    {
                        // 알람 해제
                        AlarmData alarm = group.CurrentAlarm;

                        if (alarm == null)
                        {
                            strErrorMessage = "ProcessSensorDatas Error9 : Alarm is alreay clear";
                            WriteLog(strErrorMessage);
                            System.Diagnostics.Trace.WriteLine(strErrorMessage);
                            continue;
                            //return new MessageResult(false, "Alarm is alreay clear");
                        }

                        alarm.Tag = signalFromSystem;
                        AlarmData alarmPrev = alarm != null ? alarm.Clone() : null;

                        int nResult = RemoveAlarm(group, sensorZone, isReal, header);

                        if (alarm != null && group.CurrentAlarm == null)
                        {
                            alarm.Status = (int)SensorReactionHistory.ReactionTypes.END_STATUS;
                            m_agentFactory.ProcessManager.ClearAlarm(alarm);
                        }
                        else if (alarm != null && group.CurrentAlarm != null)
                        {
                            int nAlarmDepth = m_agent.GetAlarmDepth(m_mainManager.AlarmManager, group.GetSensors(), null);
                            alarm.AlarmDepth = nAlarmDepth;

                            ChangeAlarm(group.CurrentAlarm, alarmPrev, group, sensorZone, 0);
                        }

                        if (nResult == ErrorMessageType.SUCCESS)
                        {
                            continue;
                            //return new MessageResult(true, "");
                        }

                        string _strErrorMessage1 = ErrorMessageType.ToMessage(nResult);
                        WriteLog(_strErrorMessage1);
                        System.Diagnostics.Trace.WriteLine("ProcessSensorDatas Error10 : " + _strErrorMessage1);
                        continue;
                        //return new MessageResult(false, ErrorMessageType.ToMessage(nResult));
                    }
                }

                string _strErrorMessage = ErrorMessageType.ToMessage(ErrorMessageType.INVALID_MESSAGE);
                WriteLog(_strErrorMessage);
                System.Diagnostics.Trace.WriteLine("ProcessSensorDatas Error11 : " + _strErrorMessage);
                //return new MessageResult(false, ErrorMessageType.ToMessage(ErrorMessageType.INVALID_MESSAGE));
            }

            m_runSensorDatas = false;
        }

        private bool GetAlarmTagFromReactionHistory(AlarmData alarm, out string strErrorMessage)
        {
            strErrorMessage = null;

            Dictionary<SensorReactionHistory.Fields, object> dicConditions = new Dictionary<SensorReactionHistory.Fields, object>();

            dicConditions[SensorReactionHistory.Fields.SensorZoneHistoryID] = alarm.SensorZoneHistoryID;
            dicConditions[SensorReactionHistory.Fields.ReactionType] = (int)SensorReactionHistory.ReactionTypes.BEGIN_STATUS;

            List<SensorReactionHistory> histories = m_mainManager.SDMSDataManager.GetSelectManager().SelectSensorReactionHistories(dicConditions, null, out strErrorMessage);

            if (histories == null)
                return false;

            if (histories.Count > 0)
            {
                alarm.Tag = histories[0].Param4;
            }

            return true;
        }

        private bool SetAlarmTagToReactionHistory(AlarmData alarm, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (alarm.Tag == null)
                return true;

            Dictionary<SensorReactionHistory.Fields, object> dicConditions = new Dictionary<SensorReactionHistory.Fields, object>();
            Dictionary<SensorReactionHistory.Fields, object> dicSets = new Dictionary<SensorReactionHistory.Fields, object>();

            dicConditions[SensorReactionHistory.Fields.ID] = alarm.SensorReactionHistoryID;
            dicSets[SensorReactionHistory.Fields.Param4] = alarm.Tag.ToString();

            return m_mainManager.SDMSDataManager.GetUpdateManager().UpdateSensorReactionHistory(dicSets, dicConditions, null, out strErrorMessage);
        }

        private bool UpdateSensorData(int nSensorZoneID, string strCameraID, string strMessage, out string strErrorMessage)
        {
            SensorZone sensorZone = m_mainManager.SDMSDataManager.GetSelectManager().SelectSensorZone(nSensorZoneID, out strErrorMessage);

            if (sensorZone == null)
            {
                if (strErrorMessage == null)
                    strErrorMessage = string.Format("{0}에 해당하는 SensorZone Data를 찾을수 없습니다.", nSensorZoneID);

                return false;
            }

            if (sensorZone.OrgSensorID == null)
            {
                strErrorMessage = "SensorZone에 OrgSensor 정보가 기입되어 있지 않습니다.";
                return false;
            }

            Dictionary<CCTV.Fields, object> dicConditions = new Dictionary<CCTV.Fields, object>();
            dicConditions[CCTV.Fields.UniqueKey] = strCameraID;

            List<CCTV> cctvs = m_mainManager.SDMSDataManager.GetSelectManager().SelectCCTVs(dicConditions, null, out strErrorMessage);

            if (cctvs == null)
                return false;

            /*if (cctvs.Count == 0)
            {
                strErrorMessage = string.Format("{0}에 해당하는 CCTV를 찾을수 없습니다.", strCameraID);
                return false;
            }

            CCTV cctv = cctvs[0];*/
            CCTV cctv = cctvs.Count > 0 ? cctvs[0] : null;

            ETC etcSensor = m_mainManager.SDMSDataManager.GetSelectManager().SelectETCSensor((int)sensorZone.OrgSensorID, out strErrorMessage);

            if (etcSensor == null)
            {
                if (strErrorMessage == null)
                    strErrorMessage = string.Format("{0}에 해당하는 EtcSensor를 찾을수 없습니다.", sensorZone.OrgSensorID);

                return false;
            }

            etcSensor.DepartmentPhoneNumber = strMessage;

            if (cctv != null)
            {
                etcSensor.Status = cctv.ID;
                return m_mainManager.SDMSDataManager.GetUpdateManager().UpdateCCTV(cctv, out strErrorMessage);
            }

            return true;
        }

        protected override void ChangeAlarm(AlarmData alarmCurrent, AlarmData alarmPrev, SensorZoneGroup group, SensorZone sensorZone, int sensorData)
        {
            m_mainManager.ProcessManager.UpdateAlarm(alarmCurrent, group.GetAlarmSensorZoneIDs());

            if (alarmCurrent.AlarmDepth != alarmPrev.AlarmDepth)
            {
                m_mainManager.ProcessManager.ChangeAlarm(alarmCurrent, alarmPrev);
                string strLocationName = group.EquipmentZone != null ? group.EquipmentZone.DisplayText : "";

                alarmCurrent.TimeStamp = DateTime.Now;
                alarmCurrent.Status = (int)SensorReactionHistory.ReactionTypes.CHANGE_ALARM_DEPTH;
                alarmCurrent.Message = GetChangeAlarmDepthString(Facility.ToFacilityType(sensorZone.SensorType), alarmCurrent.AlarmDepth, alarmPrev.AlarmDepth, alarmCurrent.IsReal, group.EquipmentZone);

                string strParam3 = ((int)sensorZone.SensorType).ToString();
                string strParam4 = sensorData.ToString(); // 0: 알람해제로 인한 단계 변경, 1: 알람발생으로 인한 단계 변경
                string strParam5 = alarmCurrent.AlarmDepth.ToString();
                ((Process.AlarmManager)m_mainManager.AlarmManager).AddReactionHistory(alarmCurrent, (int)alarmCurrent.Status, alarmCurrent.TimeStamp, alarmCurrent.Message, sensorZone.EquipZoneID.ToString(), sensorZone.ID.ToString(), strParam3, strParam4, strParam5, m_mainManager.SDMSDataManager);
            }
        }

        private Result ProcessManualReport(ArrayList arrDatas)
        {
            // 동기화 문제를 피하기 위하여 직접 처리하지 않고 Queue에 쌓는다.
            m_queueManualReports.Enqueue(arrDatas);

            Task task = ProcessManualReports();
            return new Result(true);
            /*if (arrDatas.Count >= 7 && arrDatas[0] is int && arrDatas[1] is int && arrDatas[2] is int && arrDatas[3] is DateTime
                                    && arrDatas[4] is int && arrDatas[5] is string && arrDatas[6] is string)
            {
                int nSensorType = (int)arrDatas[0];
                int nSensorZoneID = (int)arrDatas[1];
                int nZoneID = (int)arrDatas[2];
                DateTime dtDateTime = (DateTime)arrDatas[3];
                int nAlarmDepth = (int)arrDatas[4];
                string strReportPerson = (string)arrDatas[5];
                string strMemo = (string)arrDatas[6];

                if (nSensorZoneID < Header.ManualReportDefaultID)
                    return new MessageResult(false, ErrorMessageType.ToMessage(ErrorMessageType.UNKNOWN_SENSOR_ID));

                SensorZoneGroup group = m_mainManager.SensorManager.GetSensorZoneGroup(nSensorZoneID);
                if (group == null)
                    return GetErrorMessageResult(ErrorMessageType.UNKNOWN_SENSOR_ID);

                SensorZone sensorZone = m_mainManager.SensorManager.GetSensorZone(nSensorZoneID);
                if (sensorZone == null)
                    return GetErrorMessageResult(ErrorMessageType.UNKNOWN_SENSOR_ID);

                AlarmData alarm = ((Process.AlarmManager)m_mainManager.AlarmManager).GetManualAlarm(nZoneID, Facility.FacilityType.FIRE_SENSOR, m_mainManager.SDMSDataManager);
                if (alarm != null)
                    return new MessageResult(false, ErrorMessageType.ToMessage(ErrorMessageType.ALREADY_PROCESSED));

                alarm = ((Process.AlarmManager)m_mainManager.AlarmManager).AddAlarm(nSensorZoneID, 1, nZoneID, nSensorType, (int)SensorZoneHistory.DetectionType.Real, dtDateTime, m_mainManager.SDMSDataManager, FacilityManager.DetectTypes.Detect);
                if (alarm == null)
                    return new MessageResult(false, ErrorMessageType.ToMessage(ErrorMessageType.DB_EXCEPTION));

                alarm.AlarmDepth = nAlarmDepth;
                alarm.IsManual = true;
                alarm.IsReal = true;
                SensorReactionHistory.ReactionTypes reactionType = SensorReactionHistory.ReactionTypes.BEGIN_STATUS;

                string strMessage = GetFireManualReportString(nZoneID);
                string strParam1 = nZoneID.ToString();
                string strParam2 = nSensorZoneID.ToString();
                string strParam3 = strReportPerson;
                string strParam4 = strMemo;
                string strParam5 = alarm.AlarmDepth.ToString();

                if (((Process.AlarmManager)m_mainManager.AlarmManager).AddReactionHistory(alarm, (int)reactionType, dtDateTime, strMessage, strParam1, strParam2, strParam3, strParam4, strParam5, m_mainManager.SDMSDataManager))
                {
                    alarm.Message = strMessage;
                    alarm.IsReal = true;
                    alarm.Status = reactionType;

                    group.SetSensorData(sensorZone, 1, true, m_mainManager.SDMSDataManager);

                    m_mainManager.ProcessManager.NewAlarm(alarm, group.GetAlarmSensorZoneIDs());

                    return new Result(true);
                }
            }

            return new MessageResult(false, ErrorMessageType.ToMessage(ErrorMessageType.INVALID_MESSAGE));*/
        }

        private async Task ProcessManualReports()
        {
            if (m_runManualReports)
                return;

            m_runManualReports = true;

            // 이 함수를 비동기로 만든다.
            await Task.Yield();

            ArrayList arrDatas;

            while (m_queueManualReports.TryDequeue(out arrDatas))
            {
                if (arrDatas.Count >= 7 && arrDatas[0] is int && arrDatas[1] is int && arrDatas[2] is int && arrDatas[3] is DateTime
                                    && arrDatas[4] is int && arrDatas[5] is string && arrDatas[6] is string)
                {
                    int nSensorType = (int)arrDatas[0];
                    int nSensorZoneID = (int)arrDatas[1];
                    int nZoneID = (int)arrDatas[2];
                    DateTime dtDateTime = (DateTime)arrDatas[3];
                    int nAlarmDepth = (int)arrDatas[4];
                    string strReportPerson = (string)arrDatas[5];
                    string strMemo = (string)arrDatas[6];

                    if (nSensorZoneID < Header.ManualReportDefaultID)
                    {
                        string strErrorMessage = ErrorMessageType.ToMessage(ErrorMessageType.UNKNOWN_SENSOR_ID);
                        WriteLog(strErrorMessage);
                        System.Diagnostics.Trace.WriteLine("ProcessManualReports Error1 : " + strErrorMessage);
                        continue;
                        //return new MessageResult(false, ErrorMessageType.ToMessage(ErrorMessageType.UNKNOWN_SENSOR_ID));
                    }

                    SensorZoneGroup group = m_mainManager.SensorManager.GetSensorZoneGroup(nSensorZoneID);
                    if (group == null)
                    {
                        MessageResult result = GetErrorMessageResult(ErrorMessageType.UNKNOWN_SENSOR_ID);
                        WriteLog(result.Message);
                        System.Diagnostics.Trace.WriteLine("ProcessManualReports Error2 : " + result.Message);
                        continue;
                        //return GetErrorMessageResult(ErrorMessageType.UNKNOWN_SENSOR_ID);
                    }

                    SensorZone sensorZone = m_mainManager.SensorManager.GetSensorZone(nSensorZoneID);
                    if (sensorZone == null)
                    {
                        MessageResult result = GetErrorMessageResult(ErrorMessageType.UNKNOWN_SENSOR_ID);
                        WriteLog(result.Message);
                        System.Diagnostics.Trace.WriteLine("ProcessManualReports Error3 : " + result.Message);
                        continue;
                        //return GetErrorMessageResult(ErrorMessageType.UNKNOWN_SENSOR_ID);
                    }

                    AlarmData alarm = ((Process.AlarmManager)m_mainManager.AlarmManager).GetManualAlarm(nZoneID, Facility.FacilityType.FIRE_SENSOR, m_mainManager.SDMSDataManager);
                    if (alarm != null)
                    {
                        string strErrorMessage = ErrorMessageType.ToMessage(ErrorMessageType.ALREADY_PROCESSED);
                        WriteLog(strErrorMessage);
                        System.Diagnostics.Trace.WriteLine("ProcessManualReports Error4 : " + strErrorMessage);
                        continue;
                        //return new MessageResult(false, ErrorMessageType.ToMessage(ErrorMessageType.ALREADY_PROCESSED));
                    }

                    alarm = ((Process.AlarmManager)m_mainManager.AlarmManager).AddAlarm(nSensorZoneID, 1, nZoneID, nSensorType, (int)SensorZoneHistory.DetectionType.Real, dtDateTime, m_mainManager.SDMSDataManager, FacilityManager.DetectTypes.Detect);
                    if (alarm == null)
                    {
                        string strErrorMessage = ErrorMessageType.ToMessage(ErrorMessageType.ALREADY_PROCESSED);
                        WriteLog(strErrorMessage);
                        System.Diagnostics.Trace.WriteLine("ProcessManualReports Error5 : " + strErrorMessage);
                        continue;
                        //return new MessageResult(false, ErrorMessageType.ToMessage(ErrorMessageType.DB_EXCEPTION));
                    }

                    alarm.AlarmDepth = nAlarmDepth;
                    alarm.IsManual = true;
                    alarm.IsReal = true;
                    SensorReactionHistory.ReactionTypes reactionType = SensorReactionHistory.ReactionTypes.BEGIN_STATUS;

                    string strMessage = GetFireManualReportString(nZoneID);
                    string strParam1 = nZoneID.ToString();
                    string strParam2 = nSensorZoneID.ToString();
                    string strParam3 = strReportPerson;
                    string strParam4 = strMemo;
                    string strParam5 = alarm.AlarmDepth.ToString();

                    if (((Process.AlarmManager)m_mainManager.AlarmManager).AddReactionHistory(alarm, (int)reactionType, dtDateTime, strMessage, strParam1, strParam2, strParam3, strParam4, strParam5, m_mainManager.SDMSDataManager))
                    {
                        alarm.Message = strMessage;
                        alarm.IsReal = true;
                        alarm.Status = (int)reactionType;

                        group.SetSensorData(sensorZone, 1, true, m_mainManager.SDMSDataManager);

                        m_mainManager.ProcessManager.NewAlarm(alarm, group.GetAlarmSensorZoneIDs());

                        continue;
                        //return new Result(true);
                    }
                }

                string _strErrorMessage = ErrorMessageType.ToMessage(ErrorMessageType.INVALID_MESSAGE);
                WriteLog(_strErrorMessage);
                System.Diagnostics.Trace.WriteLine("ProcessManualReports Error6 : " + _strErrorMessage);
                //return new MessageResult(false, ErrorMessageType.ToMessage(ErrorMessageType.INVALID_MESSAGE));
            }

            m_runManualReports = false;
        }

        private Result ProcessClearManualReport(ArrayList arrDatas)
        {
            // 동기화 문제를 피하기 위하여 직접 처리하지 않고 Queue에 쌓는다.
            m_queueClearManualReports.Enqueue(arrDatas);

            Task task = ProcessClearManualReports();
            return new Result(true);
            /*if (arrDatas.Count >= 4 && arrDatas[0] is int && arrDatas[1] is int && arrDatas[2] is int && arrDatas[3] is int)
            {
                int nSensorType = (int)arrDatas[0];
                int nSensorZoneID = (int)arrDatas[1];
                int nSensorZoneHistoryID = (int)arrDatas[2];
                int nUserID = (int)arrDatas[3];

                AlarmData alarm = ((Process.AlarmManager)m_mainManager.AlarmManager).GetAlarm(nSensorZoneHistoryID);

                SensorZoneGroup group = m_mainManager.SensorManager.GetSensorZoneGroup(nSensorZoneID);

                if (group == null)
                    return GetErrorMessageResult(ErrorMessageType.UNKNOWN_SENSOR_ID);

                SensorZone sensorZone = m_mainManager.SensorManager.GetSensorZone(nSensorZoneID);

                if (sensorZone == null)
                    return GetErrorMessageResult(ErrorMessageType.UNKNOWN_SENSOR_ID);

                if (alarm.IsManual)
                {
                    AlarmData alarmPrev = alarm != null ? alarm.Clone() : null;

                    int nResult = ErrorMessageType.SUCCESS;

                    if (group.RemoveSensorData(sensorZone, m_mainManager.SDMSDataManager) == false)
                    {
                        WriteLog("RemoveSensorData 실패 : " + sensorZone.ID.ToString());
                        return new MessageResult(false, ErrorMessageType.ToMessage(ErrorMessageType.DB_EXCEPTION));
                    }

                    EquipmentZone equipZone = m_mainManager.SensorManager.GetEquipmentZone(sensorZone.EquipZoneID);
                    string strMessage = GetClearManualFireMessage(alarm);
                    string strEquipZoneID = equipZone == null ? null : sensorZone.EquipZoneID.ToString();

                    SensorZoneHistory.DetectionType detectionStatus = SensorZoneHistory.DetectionType.Real;
                    SensorReactionHistory.ReactionTypes reactionType = SensorReactionHistory.ReactionTypes.END_STATUS;

                    if (((Process.AlarmManager)m_mainManager.AlarmManager).RemoveAlarm(alarm, DateTime.Now, (int)reactionType, strMessage, strEquipZoneID, sensorZone.ID.ToString(), null, null, null, (int)detectionStatus, m_mainManager.SDMSDataManager))
                    {
                        alarm.Message = strMessage;
                        group.CurrentAlarm = null;
                        nResult = ErrorMessageType.SUCCESS;
                    }

                    if (alarm != null && group.CurrentAlarm == null)
                    {
                        alarm.Status = SensorReactionHistory.ReactionTypes.END_STATUS;
                        m_agentFactory.ProcessManager.ClearAlarm(alarm);
                    }

                    if (nResult == ErrorMessageType.SUCCESS)
                        return new Result(true);

                    return new MessageResult(false, ErrorMessageType.ToMessage(nResult));
                }
            }

            return new MessageResult(false, ErrorMessageType.ToMessage(ErrorMessageType.INVALID_MESSAGE));*/
        }

        private async Task ProcessClearManualReports()
        {
            if (m_runClearManualReports)
                return;

            m_runClearManualReports = true;

            // 이 함수를 비동기로 만든다.
            await Task.Yield();

            ArrayList arrDatas;

            while (m_queueClearManualReports.TryDequeue(out arrDatas))
            {
                if (arrDatas.Count >= 4 && arrDatas[0] is int && arrDatas[1] is int && arrDatas[2] is int && arrDatas[3] is int)
                {
                    int nSensorType = (int)arrDatas[0];
                    int nSensorZoneID = (int)arrDatas[1];
                    int nSensorZoneHistoryID = (int)arrDatas[2];
                    int nUserID = (int)arrDatas[3];

                    AlarmData alarm = ((Process.AlarmManager)m_mainManager.AlarmManager).GetAlarm(nSensorZoneHistoryID);

                    SensorZoneGroup group = m_mainManager.SensorManager.GetSensorZoneGroup(nSensorZoneID);

                    if (group == null)
                    {
                        MessageResult result = GetErrorMessageResult(ErrorMessageType.UNKNOWN_SENSOR_ID);
                        WriteLog(result.Message);
                        System.Diagnostics.Trace.WriteLine("ProcessClearManualReports Error1 : " + result.Message);
                        continue;
                        //return GetErrorMessageResult(ErrorMessageType.UNKNOWN_SENSOR_ID);
                    }

                    SensorZone sensorZone = m_mainManager.SensorManager.GetSensorZone(nSensorZoneID);

                    if (sensorZone == null)
                    {
                        MessageResult result = GetErrorMessageResult(ErrorMessageType.UNKNOWN_SENSOR_ID);
                        WriteLog(result.Message);
                        System.Diagnostics.Trace.WriteLine("ProcessClearManualReports Error2 : " + result.Message);
                        continue;
                        //return GetErrorMessageResult(ErrorMessageType.UNKNOWN_SENSOR_ID);
                    }

                    if (alarm.IsManual)
                    {
                        AlarmData alarmPrev = alarm != null ? alarm.Clone() : null;

                        int nResult = ErrorMessageType.SUCCESS;

                        if (group.RemoveSensorData(sensorZone, m_mainManager.SDMSDataManager) == false)
                        {
                            WriteLog("RemoveSensorData 실패 : " + sensorZone.ID.ToString());
                            System.Diagnostics.Trace.WriteLine("RemoveSensorData 실패 : " + sensorZone.ID.ToString());
                            continue;
                            //return new MessageResult(false, ErrorMessageType.ToMessage(ErrorMessageType.DB_EXCEPTION));
                        }

                        EquipmentZone equipZone = m_mainManager.SensorManager.GetEquipmentZone(sensorZone.EquipZoneID);
                        string strMessage = GetClearManualFireMessage(alarm);
                        string strEquipZoneID = equipZone == null ? null : sensorZone.EquipZoneID.ToString();

                        SensorZoneHistory.DetectionType detectionStatus = SensorZoneHistory.DetectionType.Real;
                        SensorReactionHistory.ReactionTypes reactionType = SensorReactionHistory.ReactionTypes.END_STATUS;

                        if (((Process.AlarmManager)m_mainManager.AlarmManager).RemoveAlarm(alarm, DateTime.Now, (int)reactionType, strMessage, strEquipZoneID, sensorZone.ID.ToString(), null, null, null, (int)detectionStatus, m_mainManager.SDMSDataManager))
                        {
                            alarm.Message = strMessage;
                            group.CurrentAlarm = null;
                            nResult = ErrorMessageType.SUCCESS;
                        }

                        if (alarm != null && group.CurrentAlarm == null)
                        {
                            alarm.Status = (int)SensorReactionHistory.ReactionTypes.END_STATUS;
                            m_agentFactory.ProcessManager.ClearAlarm(alarm);
                        }

                        if (nResult == ErrorMessageType.SUCCESS)
                        {
                            continue;
                            //return new Result(true);
                        }

                        string strErrorMessage = ErrorMessageType.ToMessage(nResult);
                        WriteLog(strErrorMessage);
                        System.Diagnostics.Trace.WriteLine("ProcessClearManualReports Error3 : " + ErrorMessageType.ToMessage(nResult));
                        continue;
                        //return new MessageResult(false, ErrorMessageType.ToMessage(nResult));
                    }
                }

                string _strErrorMessage = ErrorMessageType.ToMessage(ErrorMessageType.INVALID_MESSAGE);
                WriteLog(_strErrorMessage);
                System.Diagnostics.Trace.WriteLine("ProcessClearManualReports Error4 : " + _strErrorMessage);
                //return new MessageResult(false, ErrorMessageType.ToMessage(ErrorMessageType.INVALID_MESSAGE));
            }

            m_runClearManualReports = false;
        }

        private int AddAlarm(SensorZoneGroup group, int nSensorTagID, SensorZone sensorZone, bool isReal, int nAlarmLevel, string strMessage, out AlarmData alarm)
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

                int data;
                bool isAlarmStatus;
                AlarmData alarmPrev = currentAlarm.Clone();

                int nAlarmDepth = m_agent.GetAlarmDepth(m_mainManager.AlarmManager, group.GetSensors(), sensorZone);
                currentAlarm.AlarmDepth = nAlarmDepth;

                if ((group.GetSensorData(sensorZone, out data, out isAlarmStatus) == false) || data == 0 || isAlarmStatus == false)
                {
                    group.SetSensorData(sensorZone, 1, true, m_mainManager.SDMSDataManager);
                    ((Process.AlarmManager)m_mainManager.AlarmManager).AddAlarmSensor(group.GetSensors(), currentAlarm.SensorZoneHistoryID, m_mainManager.SDMSDataManager);

                    ChangeAlarm(currentAlarm, alarmPrev, group, sensorZone, 1);
                }

                return ErrorMessageType.SUCCESS;
            }
            else
            {
                int nAlarmDepth = m_agent.GetAlarmDepth(m_mainManager.AlarmManager, group.GetSensors(), sensorZone);

                // 기본 알람 단계가 주의 이상
                if (nAlarmDepth == 1)
                    nAlarmDepth = 2;

                group.SetSensorData(sensorZone, 1, true, m_mainManager.SDMSDataManager);

                SensorZoneHistory.DetectionType detectionStatus = isReal ? SensorZoneHistory.DetectionType.Real : SensorZoneHistory.DetectionType.Test;

                DateTime timeStamp = DateTime.Now;
                int nZoneID = group.EquipmentZone == null || group.EquipmentZone.LinkedZoneIDs.Count == 0 ? -1 : group.EquipmentZone.LinkedZoneIDs[0];
                alarm = ((Process.AlarmManager)m_mainManager.AlarmManager).AddAlarm(sensorZone.ID, 1, nZoneID, sensorZone.SensorType, (int)detectionStatus, timeStamp, m_mainManager.SDMSDataManager, FacilityManager.DetectTypes.Detect);

                if (alarm != null)
                {
                    alarm.AlarmDepth = nAlarmDepth;
                    //alarm.AlarmDepth = 1;

                    // 알람 단계 전송시
                    if (nAlarmLevel != -1)
                        alarm.AlarmDepth = nAlarmLevel;

                    group.CurrentAlarm = alarm;

                    //string strMessage = GetDetectEtcMessage(Facility.ToFacilityType(sensorZone.SensorType), group.EquipmentZone, isReal);
                    string strEquipZoneID = group.EquipmentZone == null ? null : group.EquipmentZone.ID.ToString();
                    SensorReactionHistory.ReactionTypes reactionType = SensorReactionHistory.ReactionTypes.BEGIN_STATUS;

                    string strParam3 = sensorZone.SensorType.ToString();
                    string strParam5 = alarm.AlarmDepth.ToString();

                    if (((Process.AlarmManager)m_mainManager.AlarmManager).AddReactionHistory(alarm, (int)reactionType, timeStamp, strMessage, strEquipZoneID, sensorZone.ID.ToString(), strParam3, null, strParam5, m_mainManager.SDMSDataManager))
                    {
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

        private int AddAlarm(SensorZoneGroup group, int nSensorTagID, SensorZone sensorZone, bool isReal, int nAlarmLevel, out AlarmData alarm)
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
                return ChangeAlarm(m_mainManager, currentAlarm, group, sensorZone);
                /*int data;
                bool isAlarmStatus;
                AlarmData alarmPrev = currentAlarm.Clone();

                int nAlarmDepth = m_agent.GetAlarmDepth(m_mainManager.AlarmManager, group.GetSensors(), sensorZone);
                currentAlarm.AlarmDepth = nAlarmDepth;

                if ((group.GetSensorData(sensorZone, out data, out isAlarmStatus) == false) || data == 0 || isAlarmStatus == false)
                {
                    group.SetSensorData(sensorZone, 1, true, m_mainManager.SDMSDataManager);
                    ((Process.AlarmManager)m_mainManager.AlarmManager).AddAlarmSensor(group.GetSensors(), currentAlarm.SensorZoneHistoryID, m_mainManager.SDMSDataManager);

                    ChangeAlarm(currentAlarm, alarmPrev, group, sensorZone, 1);
                }

                return ErrorMessageType.SUCCESS;*/
            }
            else
            {
                int nAlarmDepth = m_agent.GetAlarmDepth(m_mainManager.AlarmManager, group.GetSensors(), sensorZone);

                // 기본 알람 단계가 주의 이상
                if (nAlarmDepth == 1)
                    nAlarmDepth = 2;

                group.SetSensorData(sensorZone, 1, true, m_mainManager.SDMSDataManager);

                SensorZoneHistory.DetectionType detectionStatus = isReal ? SensorZoneHistory.DetectionType.Real : SensorZoneHistory.DetectionType.Test;

                DateTime timeStamp = DateTime.Now;
                int nZoneID = -1;

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
                            string strErrorMessage = null;
                            ETC etc = m_mainManager.SDMSDataManager.GetSelectManager().SelectETCSensor((int)sensorZone.OrgSensorID, out strErrorMessage);
                            if (etc == null)
                                nZoneID = -1;
                            else
                                nZoneID = etc.ZoneID;
                        }
                    }
                }

                alarm = ((Process.AlarmManager)m_mainManager.AlarmManager).AddAlarm(sensorZone.ID, 1, nZoneID, sensorZone.SensorType, (int)detectionStatus, timeStamp, m_mainManager.SDMSDataManager, FacilityManager.DetectTypes.Detect);

                if (alarm != null)
                {
                    // 동기화 문제로 인하여 같은 SensorZoneGroup에 중복된 알람이 발생하지 않았는지 한번더 검사한다.
                    int errorMessage;
                    if (CheckAlarmDuplication(alarm, group, sensorZone, m_mainManager, (Process.AlarmManager)m_mainManager.AlarmManager, out errorMessage))
                        return errorMessage;

                    alarm.AlarmDepth = nAlarmDepth;
                    //alarm.AlarmDepth = 1;

                    // 알람 단계 전송시
                    if (nAlarmLevel != -1)
                        alarm.AlarmDepth = nAlarmLevel;

                    group.CurrentAlarm = alarm;

                    //string strMessage = GetDetectEtcMessage(Facility.ToFacilityType(sensorZone.SensorType), group.EquipmentZone, isReal);
                    string strMessage = GetDetectEtcMessage((int)sensorZone.OrgSensorID, group.EquipmentZone, isReal);
                    string strEquipZoneID = group.EquipmentZone == null ? null : group.EquipmentZone.ID.ToString();
                    SensorReactionHistory.ReactionTypes reactionType = SensorReactionHistory.ReactionTypes.BEGIN_STATUS;

                    string strParam3 = sensorZone.SensorType.ToString();
                    string strParam5 = alarm.AlarmDepth.ToString();

                    if (((Process.AlarmManager)m_mainManager.AlarmManager).AddReactionHistory(alarm, (int)reactionType, timeStamp, strMessage, strEquipZoneID, sensorZone.ID.ToString(), strParam3, null, strParam5, m_mainManager.SDMSDataManager))
                    {
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
            string strMessage = GetClearEtcMessage(Facility.ToFacilityType(sensorZone.SensorType), equipZone, isReal);
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

        private string GetDetectEtcMessage(int nOrgSensorID, EquipmentZone equipZone, bool isReal)
        {
            //string strEventName = Facility.GetFacilityTypeString(sensorType) + " 신호";
            string strEventName = Facility.GetFacilityTypeString(Facility.FacilityType.ETC) + " 신호";

            string strErrorMessage = null;
            ETC etc = m_mainManager.SDMSDataManager.GetSelectManager().SelectETCSensor(nOrgSensorID, out strErrorMessage);
            if (etc != null && etc.MaterialType != null)
            {
                Material material = m_mainManager.SensorManager.GetMaterial((int)etc.MaterialType);

                if (material != null)
                    strEventName = material.MaterialName + " 신호";
            }

            if (isReal)
            {
                string strTag = GetTrainingModeString();

                if (equipZone == null)
                    return strTag + strEventName + "가 탐지되었습니다";
                else
                    return string.Format("{0}[{1}]에서 {2}가 탐지되었습니다", strTag, equipZone.DisplayText, strEventName);
            }

            if (equipZone == null)
                return string.Format("[테스트]{0}가 탐지되었습니다", strEventName);

            return string.Format("[테스트][{0}]에서 {1}가 탐지되었습니다", equipZone.DisplayText, strEventName);
        }

        private string GetClearEtcMessage(Facility.FacilityType sensorType, EquipmentZone equipZone, bool isReal)
        {
            string strEventName = Facility.GetFacilityTypeString(sensorType) + " 신호";
            string strMessage = "상황해제";

            if (isReal)
            {
                string strTag = GetTrainingModeString();

                if (equipZone == null)
                    strMessage = strTag + strEventName + "가 복구되었습니다";
                else
                    strMessage = string.Format("{0}[{1}]에서 탐지된 {2}가 복구되었습니다", strTag, equipZone.DisplayText, strEventName);
            }
            else
            {
                if (equipZone == null)
                    strMessage = string.Format("[테스트]{0}가 복구되었습니다", strEventName);
                else
                    strMessage = string.Format("[테스트][{0}]에서 탐지된 {1}가 복구되었습니다", equipZone.DisplayText, strEventName);
            }

            return strMessage;
        }

        private string GetChangeAlarmDepthString(Facility.FacilityType sensorType, int nAlarmDepth, int nPrevAlarmDepth, bool isReal, EquipmentZone equipZone)
        {
            string strMessage = "";
            string strTag = isReal ? "" : "[테스트]";
            string strEventName = Facility.GetFacilityTypeString(sensorType) + " 신호";

            if (equipZone != null)
            {
                strMessage = string.Format("{0}[{1}]에서 탐지된 {2}의 알람 단계가 {3}단계에서 {4}단계로 변경되었습니다", strTag, equipZone.DisplayText, strEventName, nPrevAlarmDepth, nAlarmDepth);
            }
            else
            {
                strMessage = strTag + string.Format("탐지된 {0}의 알람 단계가 {1}단계에서 {2}단계로 변경되었습니다.", strEventName, nPrevAlarmDepth, nAlarmDepth);
            }
            return strMessage;
        }

        private string GetFireManualReportString(int nZoneID)
        {
            string strMessage = "";

            if (nZoneID < 0)
            {
                strMessage = "기타 상황이 신고되었습니다";
            }
            else
            {
                Zone zone = m_mainManager.SensorManager.GetZone(nZoneID);

                if (zone != null)
                {
                    string szLocationName = zone.DisplayText;
                    strMessage = string.Format("[{0}]에서 기타 상황이 신고되었습니다", szLocationName);
                }
            }

            return strMessage;
        }

        private string GetClearManualFireMessage(AlarmData alarm)
        {
            string strMessage = "신고된 기타 상황이 종료되었습니다";
            int nZoneID;

            if (int.TryParse(alarm.ReactionHistoryParam1, out nZoneID))
            {
                Zone zone = m_mainManager.SensorManager.GetZone(nZoneID);

                if (zone != null)
                {
                    strMessage = string.Format("[{0}]에서 신고된 기타 상황이 종료되었습니다", zone.DisplayText);
                }
            }

            return strMessage;
        }

        private string GetTrainingModeString()
        {
            return m_agentFactory.SMSManager.GetTrainingModeString();
        }

        private class SensorDatas
        {
            private int m_header = 0;
            private ArrayList m_arrDatas = null;
            private bool m_isReal = false;
            private bool m_clearAlarm = false;

            public int Header
            {
                get { return m_header; }
                set { m_header = value; }
            }

            public ArrayList ArrDatas
            {
                get { return m_arrDatas; }
                set { m_arrDatas = value; }
            }

            public bool IsReal
            {
                get { return m_isReal; }
                set { m_isReal = value; }
            }

            public bool ClearAlarm
            {
                get { return m_clearAlarm; }
                set { m_clearAlarm = value; }
            }

            public SensorDatas()
            {
            }

            public SensorDatas(int header, ArrayList arrDatas, bool isReal, bool clearAlarm)
            {
                m_header = header;
                m_arrDatas = arrDatas;
                m_isReal = isReal;
                m_clearAlarm = clearAlarm;
            }
        }
    }
}
