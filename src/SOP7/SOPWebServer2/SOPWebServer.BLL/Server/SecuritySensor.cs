using System;
using System.Collections;
using System.Collections.Generic;
using dnsSopID;
using dnsData.Sensor;
using SDMS.Model.Sensor;
using SDMS.Model.History;
using SDMS.Model.Spatial;
using dnsData.Alarm;
using AgentFactory.BLL;

namespace SOPWebServer.BLL.Server
{
    using Response;
    using Models;
    using SDMS.Model.CCTV;

    public class SecuritySensor : BaseServer
    {
        private MainManager m_mainManager = null;

        public SecuritySensor(MainManager mainManager, Factory factory)
            : base(factory)
        {
            m_mainManager = mainManager;
            m_agent = factory.MakeAgent(Factory.AgentType.Security);
        }

        protected override void OnLoadEvent()
        {
        }

        protected override Result OnReceiveEvent(int header, string strClientInfo, ArrayList arrDatas)
        {
            if (header == Header.SENSOR_DATA)
                return ProcessSensorData(arrDatas, true);
            else if (header == Header.SENSOR_DATA_TEST)
                return ProcessSensorData(arrDatas, false);
            else if (header == Header.SENSOR_MALFUNCTION || header == Header.SENSOR_USER_RESET)
                return _ProcessMalfunction(header, arrDatas);

            return new MessageResult(false, ErrorMessageType.ToMessage(ErrorMessageType.UNKNOWN_COMMAND));
        }

        private Result ProcessSensorData(ArrayList arrDatas, bool isReal)
        {
            if (arrDatas.Count >= 4 && arrDatas[0] is int && arrDatas[1] is int && arrDatas[2] is int && arrDatas[3] is int)
            {
                int nSensorType = (int)arrDatas[0];
                int nSensorTagID = (int)arrDatas[1];
                int nSensorZoneID = (int)arrDatas[2];
                int nSensorData = (int)arrDatas[3];
                // 클라이언트가 알람단계를 함께 보내온 경우에만 값이 들어온다.
                // 보내오지 않았으면 null이 되고, 이후 센서별 Agent의 기본값이 적용된다.
                int? nClientAlarmLevel = (arrDatas.Count >= 5 && arrDatas[4] is int) ? (int?)(int)arrDatas[4] : null;

                WriteLog("SecuritySensor ProcessSensorData 수신 (SensorType: " + nSensorType.ToString() + ", SensorTagID: " + nSensorTagID.ToString() + ", SensorZoneID: " + nSensorZoneID.ToString() +
                    ", SensorData: " + nSensorData.ToString() + ")");

                Facility.FacilityType sensorType = Facility.ToFacilityType(nSensorType);
                SensorZoneGroup group = m_mainManager.SensorManager.GetSensorZoneGroup(nSensorZoneID);

                if (group == null)
                {
                    WriteLog("ProcessSensorData 폐기(SensorZoneGroup 없음) : SensorZoneID " + nSensorZoneID.ToString() + ", SensorTagID " + nSensorTagID.ToString());
                    return GetErrorMessageResult(ErrorMessageType.UNKNOWN_SENSOR_ID);
                }

                SensorZone sensorZone = m_mainManager.SensorManager.GetSensorZone(nSensorZoneID);

                if (sensorZone == null)
                {
                    WriteLog("ProcessSensorData 폐기(SensorZone 없음) : SensorZoneID " + nSensorZoneID.ToString() + ", SensorTagID " + nSensorTagID.ToString());
                    return GetErrorMessageResult(ErrorMessageType.UNKNOWN_SENSOR_ID);
                }

                SVMSDevice svmsDevice = null;

                if (sensorType == Facility.FacilityType.SVMS_Device_Event)
                {
                    svmsDevice = ReadDeviceEventData(nSensorZoneID);
                }

                int isAlarmStatus = IsAlarm(sensorType, nSensorData, svmsDevice);

                if (isAlarmStatus < 0)
                    return GetErrorMessageResult(ErrorMessageType.UNKNOWN_SENSOR_ID);

                if (isAlarmStatus > 0)
                //if (nSensorData > 0)
                {
                    // 알람 신호 받지 않음
                    int nSiteID = (group.EquipmentZone != null ? group.EquipmentZone.SiteID : m_mainManager.SDMSDataManager.SiteID);
                    bool useReceive = m_mainManager.SensorManager.GetUseReceive(nSensorType, nSiteID);
                    if (!useReceive)
                    {
                        WriteLog("ProcessSensorData 폐기(수신 옵션 꺼짐) : SensorZoneID " + nSensorZoneID.ToString() + ", SensorTagID " + nSensorTagID.ToString() + ", SiteID " + nSiteID.ToString());
                        return new Result(true);
                    }

                    WriteLog("SecuritySensor ProcessSensorData 알람 발생 (SensorType: " + nSensorType.ToString() + ", SensorTagID: " + nSensorTagID.ToString() + ", SensorZoneID: " + nSensorZoneID.ToString() +
                            ", SensorData: " + nSensorData.ToString() + ")");

                    // 알람 발생
                    // 알람단계는 AddAlarm 안에서 확정된다. (클라이언트 지정값 우선, 없으면 Agent 기본값)
                    // 여기서 다시 덮어쓰면 반응이력에 기록된 단계와 어긋나므로 건드리지 않는다.
                    AlarmData alarm;
                    int nResult = AddAlarm(group, nSensorTagID, sensorZone, isReal, sensorType, nSensorData, svmsDevice, nClientAlarmLevel, out alarm);

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
                    WriteLog("SecuritySensor ProcessSensorData 알람 해제 (SensorType: " + nSensorType.ToString() + ", SensorTagID: " + nSensorTagID.ToString() + ", SensorZoneID: " + nSensorZoneID.ToString() +
                            ", SensorData: " + nSensorData.ToString() + ")");

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

                        int nResult = RemoveAlarm(group, sensorZone, svmsDevice, isReal);

                        if (alarm != null && group.CurrentAlarm == null)
                        {
                            alarm.SensorType = sensorType;
                            alarm.Status = (int)SensorReactionHistory.ReactionTypes.END_STATUS;
                            m_agentFactory.ProcessManager.ClearAlarm(alarm);
                        }
                        else if (alarm != null && group.CurrentAlarm != null)
                        {
                            alarm.SensorType = sensorType;
                            // 클라이언트 지정값이 있으면 그 값을, 없으면 Agent 기본값을 사용한다.
                            alarm.AlarmDepth = m_agent.GetAlarmDepth(m_mainManager.AlarmManager, group.GetSensors(), null, nClientAlarmLevel);
                            ChangeAlarm(m_mainManager, group.CurrentAlarm, alarmPrev, group, sensorZone, -1);
                        }

                        if (nResult != ErrorMessageType.SUCCESS)
                            return new MessageResult(false, ErrorMessageType.ToMessage(nResult));

                        /*if (nResult == ErrorMessageType.SUCCESS)
                            return new Result(true);

                        return new MessageResult(false, ErrorMessageType.ToMessage(nResult));*/
                    }

                    return new Result(true);
                }
            }

            return new MessageResult(false, ErrorMessageType.ToMessage(ErrorMessageType.INVALID_MESSAGE));
        }

        private SVMSDevice ReadDeviceEventData(int nSensorZoneID)
        {
            Dictionary<SensorZone.Fields, object> dicCondition1 = new Dictionary<SensorZone.Fields, object>();
            dicCondition1[SensorZone.Fields.ID] = nSensorZoneID;

            string strErrorMessage;
            ArrayList arrResult = m_mainManager.SDMSDataManager.GetSelectManager().JoinSensorZoneETCSensor(dicCondition1, null, null, out strErrorMessage);

            if (arrResult == null)
                return null;

            if (arrResult.Count > 0 && arrResult[0] is SensorZone && arrResult[1] is ETC)
            {
                ETC etc = (ETC)arrResult[1];

                if (etc.CurrentData == null)
                    return null;

                int nIndex = etc.CurrentData.IndexOf(',');

                if (nIndex < 0)
                    return null;

                string strAlarmCode = etc.CurrentData.Substring(0, nIndex).Trim();
                string strDeviceCode = etc.CurrentData.Substring(nIndex + 1).Trim();

                int nAlarmCode, nDeviceCode;

                if (int.TryParse(strAlarmCode, out nAlarmCode) && int.TryParse(strDeviceCode, out nDeviceCode))
                {
                    SVMSDevice device = new SVMSDevice();
                    device.AlarmCode = nAlarmCode;
                    device.DeviceCode = nDeviceCode;
                    return device;
                }
            }

            return null;
        }

        private int IsAlarm(Facility.FacilityType sensorType, int nSensorData, SVMSDevice device)
        {
            if (sensorType == Facility.FacilityType.SVMS_Device_Event)
            {
                if (device != null)
                {
                    if (SVMSDeviceEvent.GetDeviceName(device.DeviceCode) != null && SVMSDeviceEvent.GetEventData(device.AlarmCode) != null)
                        return nSensorData > 0 ? 1 : 0;
                }
            }
            else
            {
                return nSensorData > 0 ? 1 : 0;
            }

            return -1;
        }

        protected override void ChangeAlarm(MainManager mainManager, AlarmData alarmCurrent, AlarmData alarmPrev, SensorZoneGroup group, SensorZone sensorZone, int sensorData)
        {
            mainManager.ProcessManager.UpdateAlarm(alarmCurrent, group.GetAlarmSensorZoneIDs(), group);

            if (alarmCurrent.AlarmDepth != alarmPrev.AlarmDepth)
            {
                mainManager.ProcessManager.ChangeAlarm(alarmCurrent, alarmPrev);
                string strLocationName = group.EquipmentZone != null ? group.EquipmentZone.DisplayText : "";

                alarmCurrent.TimeStamp = DateTime.Now;
                alarmCurrent.Status = (int)SensorReactionHistory.ReactionTypes.CHANGE_ALARM_DEPTH;
                alarmCurrent.Message = GetChangeAlarmDepthString(Facility.ToFacilityType(sensorZone.SensorType), alarmCurrent.AlarmDepth, alarmPrev.AlarmDepth, alarmCurrent.IsReal, group.EquipmentZone);

                string strParam3 = ((int)sensorZone.SensorType).ToString();
                string strParam5 = alarmCurrent.AlarmDepth.ToString();
                ((Process.AlarmManager)mainManager.AlarmManager).AddReactionHistory(alarmCurrent, (int)alarmCurrent.Status, alarmCurrent.TimeStamp, alarmCurrent.Message, sensorZone.EquipZoneID.ToString(), sensorZone.ID.ToString(), strParam3, null, strParam5, mainManager.SDMSDataManager);
            }
        }

        private Result _ProcessMalfunction(int header, ArrayList arrDatas)
        {
            if (arrDatas.Count >= 4 && arrDatas[0] is int && arrDatas[1] is int && arrDatas[2] is int && arrDatas[3] is int)
            {
                //int nSensorZoneHistoryID = (int)arrDatas[0];
                //int nSensorZoneID = (int)arrDatas[1];
                //int nSOPGenUserID = (int)arrDatas[2];
                //string strDescription = (string)arrDatas[3];
                int nSensorType = (int)arrDatas[0];
                int nSensorTagID = (int)arrDatas[1];
                int nSensorZoneID = (int)arrDatas[2];
                int nSensorData = (int)arrDatas[3];

                return ProcessMalfunction(header, nSensorZoneID);
            }

            return new MessageResult(false, ErrorMessageType.ToMessage(ErrorMessageType.INVALID_MESSAGE));
        }

        public Result ProcessMalfunction(int header, int nSensorZoneID)
        {
            SensorZone sensorZone = m_mainManager.SensorManager.GetSensorZone(nSensorZoneID);
            SensorZoneGroup group = m_mainManager.SensorManager.GetSensorZoneGroup(nSensorZoneID);

            if (sensorZone == null || group == null)
                return new MessageResult(false, ErrorMessageType.ToMessage(ErrorMessageType.UNKNOWN_SENSOR_ID));

            // sensorZone과 연관된 모든 알람을 해제해야 한다.
            // 사용자 복구이므로 하나의 센서만 끄는게 아니라 같은 EquipZone 내의 모든 센서를 끈다.
            // 알람 해제
            AlarmData alarm = group.CurrentAlarm;
            int nResult = ErrorMessageType.SUCCESS;

            foreach (KeyValuePair<SensorZone, int> pair in group.GetSensors())
            {
                int result = RemoveAlarm_Malfunction(group, sensorZone, header);

                if (result != ErrorMessageType.SUCCESS)
                    nResult = result;
            }

            if (alarm != null && group.CurrentAlarm == null)
            {
                if (header == Header.SENSOR_MALFUNCTION)
                    alarm.Status = (int)SensorReactionHistory.ReactionTypes.MALFUNCTION;
                else if (header == Header.SENSOR_USER_RESET)
                    alarm.Status = (int)SensorReactionHistory.ReactionTypes.USER_RESET;

                m_agentFactory.ProcessManager.ClearAlarm(alarm);
            }

            if (nResult == ErrorMessageType.SUCCESS)
                return new Result(true);

            return new MessageResult(false, ErrorMessageType.ToMessage(nResult));
        }

        // 오작동 처리
        private int RemoveAlarm_Malfunction(SensorZoneGroup group, SensorZone sensorZone, int header)
        {
            DateTime timeStamp = DateTime.Now;

            // 오작동 처리는 SDMS에서 사용자에 의하여 보내기 때문에 특정 센서 뿐만 아니라
            // SensorZoneGroup내에 있는 모든 센서 데이터를 초기화 시킨다.
            if (group.RemoveAllSensorData(m_mainManager.SDMSDataManager) == false)
            {
                WriteLog("RemoveAllSensorData 실패 : " + sensorZone.ID.ToString());
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
            string strMessage = header == Header.SENSOR_MALFUNCTION ? GetMalfunctionMessage(equipZone, Facility.ToFacilityType(sensorZone.SensorType), alarm.IsReal) : GetUserResetMessage(equipZone, Facility.ToFacilityType(sensorZone.SensorType), alarm.IsReal);
            string strEquipZoneID = equipZone == null ? null : equipZone.ID.ToString();

            SensorZoneHistory.DetectionType detectionStatus = alarm.IsReal ? SensorZoneHistory.DetectionType.Real : SensorZoneHistory.DetectionType.Test;
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

        private int AddAlarm(SensorZoneGroup group, int nSensorTagID, SensorZone sensorZone, bool isReal, Facility.FacilityType sensorType, int nSensorData, SVMSDevice svmsDevice, int? nClientAlarmLevel, out AlarmData alarm)
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

            if (currentAlarm != null && nSensorDataCount > 0)
            {
                // 이미 알람이 발생중이다.
                // Sensor 데이터만 기록하고 종료한다.
                WriteLog("AddAlarm 무시(이미 알람 발생중, 신규 이력 미생성) : SensorZone " + sensorZone.ID.ToString() + ", 기존 SensorZoneHistoryID " + currentAlarm.SensorZoneHistoryID.ToString());
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

                    ChangeAlarm(currentAlarm, alarmPrev, group, sensorZone);
                }

                return ErrorMessageType.SUCCESS;*/
            }

            if (currentAlarm == null && nSensorDataCount > 0)
            {
                //  논리적인 오류 : 알람은 종료되었는데 센서 데이터가 남아있다.
                //  잔여 데이터만 정리하고, 이번에 들어온 신호는 아래에서 신규 알람으로 계속 처리한다.
                WriteLog("AddAlarm 논리오류 감지 - 잔여 센서데이터 " + nSensorDataCount.ToString() + "건 정리 후 알람 생성 진행 : SensorZone " + sensorZone.ID.ToString());
                group.ClearSensorDatas(m_mainManager.SDMSDataManager);
            }

            {
                // 클라이언트가 알람단계를 보내왔으면 그 값이 최우선이고,
                // 보내오지 않았으면 센서별 Agent의 기본값을 따른다. (Site 30 방범 : 2단계)
                int nAlarmDepth = m_agent.GetAlarmDepth(m_mainManager.AlarmManager, group.GetSensors(), sensorZone, nClientAlarmLevel);

                // 알람 생성은 SensorZone 상태갱신 → 이력 INSERT → 반응이력 INSERT 세 단계로 이뤄진다.
                // 중간에 실패하면 앞 단계가 남아 "이력은 있는데 알람이 없는" 불일치가 생기므로 하나의 트랜잭션으로 묶는다.
                // 공용 DataManager에 BeginBatch를 걸면 동시에 처리중인 다른 신호까지 묶이므로 Clone()으로 전용 연결을 쓴다.
                SDMS.IDAL.IDataManager txDataManager = m_mainManager.SDMSDataManager.Clone();
                bool bInTransaction = txDataManager.BeginBatch();

                if (bInTransaction == false)
                {
                    WriteLog("AddAlarm 트랜잭션 시작 실패 - 단일 연결로 진행 : SensorZone " + sensorZone.ID.ToString());
                    txDataManager = m_mainManager.SDMSDataManager;
                }

                group.SetSensorData(sensorZone, 1, true, txDataManager);

                SensorZoneHistory.DetectionType detectionStatus = isReal ? SensorZoneHistory.DetectionType.Real : SensorZoneHistory.DetectionType.Test;

                DateTime timeStamp = DateTime.Now;
                int nZoneID = -1;

                if (group.EquipmentZone != null && group.EquipmentZone.LinkedZoneIDs != null)
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
                            CCTV cctv = txDataManager.GetSelectManager().SelectCCTV((int)sensorZone.OrgSensorID, out strErrorMessage);
                            if (cctv == null || cctv.ZoneID == null)
                                nZoneID = -1;
                            else
                                nZoneID = (int)cctv.ZoneID;
                        }
                    }
                }

                int nSiteID = (group.EquipmentZone != null ? group.EquipmentZone.SiteID : m_mainManager.SDMSDataManager.SiteID);

                alarm = ((Process.AlarmManager)m_mainManager.AlarmManager).AddAlarm(sensorZone.ID, 1, nZoneID, sensorZone.SensorType, (int)detectionStatus, timeStamp, txDataManager, FacilityManager.DetectTypes.Detect, nSiteID);

                if (alarm != null)
                {
                    // 동기화 문제로 인하여 같은 SensorZoneGroup에 중복된 알람이 발생하지 않았는지 한번더 검사한다.
                    int errorMessage;
                    if (CheckAlarmDuplication(alarm, group, sensorZone, m_mainManager, (Process.AlarmManager)m_mainManager.AlarmManager, out errorMessage))
                    {
                        // 방금 만든 이력을 되돌리고 기존 알람에 병합한다.
                        if (bInTransaction)
                            txDataManager.BatchRollback();

                        WriteLog("AddAlarm 중복 알람으로 기존 알람에 병합(신규 이력 미생성) : SensorZone " + sensorZone.ID.ToString());
                        return errorMessage;
                    }

                    alarm.AlarmDepth = nAlarmDepth;
                    //alarm.AlarmDepth = 1;
                    group.CurrentAlarm = alarm;

                    string strMessage = svmsDevice != null ? SVMSDeviceEvent.GetAlarmMessage(group.EquipmentZone, svmsDevice.AlarmCode, svmsDevice.DeviceCode, isReal) : GetDetectSecurityMessage(group.EquipmentZone, Facility.ToFacilityType(sensorZone.SensorType), isReal);
                    string strEquipZoneID = group.EquipmentZone == null ? null : group.EquipmentZone.ID.ToString();
                    SensorReactionHistory.ReactionTypes reactionType = SensorReactionHistory.ReactionTypes.BEGIN_STATUS;

                    string strParam3 = ((int)sensorZone.SensorType).ToString();
                    string strParam5 = alarm.AlarmDepth.ToString();

                    if (((Process.AlarmManager)m_mainManager.AlarmManager).AddReactionHistory(alarm, (int)reactionType, timeStamp, strMessage, strEquipZoneID, sensorZone.ID.ToString(), strParam3, null, strParam5, txDataManager))
                    {
                        // 여기까지 성공해야 커밋한다. 실패하면 SensorZone 상태갱신·이력·반응이력이 모두 취소된다.
                        if (bInTransaction && txDataManager.BatchCommit() == false)
                        {
                            txDataManager.BatchRollback();
                            ((Process.AlarmManager)m_mainManager.AlarmManager).RemoveCurrentAlarm(alarm.SensorZoneHistoryID);
                            WriteLog("AddAlarm 커밋 실패 - 알람 생성 취소 : SensorZone " + sensorZone.ID.ToString());
                            alarm = null;
                            group.CurrentAlarm = null;
                            return ErrorMessageType.DB_EXCEPTION;
                        }

                        alarm.Message = strMessage;
                        alarm.IsReal = isReal;
                        alarm.Status = (int)reactionType;
                        return ErrorMessageType.SUCCESS;
                    }
                    else
                    {
                        if (bInTransaction)
                            txDataManager.BatchRollback();
                        else
                        {
                            group.RemoveSensorData(sensorZone, m_mainManager.SDMSDataManager);
                            ((Process.AlarmManager)m_mainManager.AlarmManager).RemoveAlarm(alarm);
                        }

                        WriteLog("AddReactionHistory 실패 : " + alarm.SensorZoneHistoryID.ToString());
                        alarm = null;
                        group.CurrentAlarm = null;
                    }
                }
                else
                {
                    if (bInTransaction)
                        txDataManager.BatchRollback();
                    else
                        group.RemoveSensorData(sensorZone, m_mainManager.SDMSDataManager);

                    WriteLog("AddAlarm 실패 : " + sensorZone.ID.ToString());
                }
            }

            return ErrorMessageType.DB_EXCEPTION;
        }

        public int RemoveAlarm(SensorZoneGroup group, SensorZone sensorZone, SVMSDevice svmsDevice, bool isReal)
        {
            DateTime timeStamp = DateTime.Now;

            // 알람 해제는 SensorZone 상태정리 → 반응이력 INSERT 두 단계로 이뤄진다.
            // 중간에 실패하면 "센서는 정상인데 알람은 열려있는" 불일치가 남으므로 하나의 트랜잭션으로 묶는다.
            // ProcessAllClear도 이 메서드를 호출하므로 알람 1건 단위로 원자성이 보장된다.
            SDMS.IDAL.IDataManager txDataManager = m_mainManager.SDMSDataManager.Clone();
            bool bInTransaction = txDataManager.BeginBatch();

            if (bInTransaction == false)
            {
                WriteLog("RemoveAlarm 트랜잭션 시작 실패 - 단일 연결로 진행 : SensorZone " + sensorZone.ID.ToString());
                txDataManager = m_mainManager.SDMSDataManager;
            }

            if (group.RemoveSensorData(sensorZone, txDataManager) == false)
            {
                if (bInTransaction)
                    txDataManager.BatchRollback();

                WriteLog("RemoveSensorData 실패 : " + sensorZone.ID.ToString());
                return ErrorMessageType.DB_EXCEPTION;
            }

            // sensorZone의 신호는 복구되었지만 같은 영역에 다른 신호가 아직 남아있는 상황
            if (group.GetSensors().Length > 0 && group.CurrentAlarm != null)
            {
                // SensorZone 상태정리까지는 반영한다.
                if (bInTransaction)
                    txDataManager.BatchCommit();

                return ErrorMessageType.SUCCESS;
            }

            AlarmData alarm = group.CurrentAlarm;

            if (alarm == null)
            {
                // SensorZone 상태정리까지는 반영한다.
                if (bInTransaction)
                    txDataManager.BatchCommit();

                return ErrorMessageType.SUCCESS;
            }

            EquipmentZone equipZone = m_mainManager.SensorManager.GetEquipmentZone(sensorZone.EquipZoneID);
            string strMessage = GetClearSecurityMessage(equipZone, Facility.ToFacilityType(sensorZone.SensorType), svmsDevice, isReal);
            string strEquipZoneID = equipZone == null ? null : sensorZone.EquipZoneID.ToString();

            SensorZoneHistory.DetectionType detectionStatus = isReal ? SensorZoneHistory.DetectionType.Real : SensorZoneHistory.DetectionType.Test;

            if (((Process.AlarmManager)m_mainManager.AlarmManager).RemoveAlarm(alarm, timeStamp, (int)SensorReactionHistory.ReactionTypes.END_STATUS, strMessage, strEquipZoneID, sensorZone.ID.ToString(), null, null, null, (int)detectionStatus, txDataManager))
            {
                // 여기까지 성공해야 커밋한다. 실패하면 SensorZone 상태정리와 반응이력이 모두 취소된다.
                if (bInTransaction && txDataManager.BatchCommit() == false)
                {
                    txDataManager.BatchRollback();
                    WriteLog("RemoveAlarm 커밋 실패 - 알람 해제 취소 : SensorZone " + sensorZone.ID.ToString());
                    return ErrorMessageType.DB_EXCEPTION;
                }

                alarm.Message = strMessage;
                group.CurrentAlarm = null;
                return ErrorMessageType.SUCCESS;
            }

            if (bInTransaction)
                txDataManager.BatchRollback();

            WriteLog("RemoveAlarm 실패 : " + sensorZone.ID.ToString());
            return ErrorMessageType.DB_EXCEPTION;
        }

        public string GetEventTypeString(Facility.FacilityType sensorType, out string strSensorBrandType)
        {
            string resultMsg = "";
            strSensorBrandType = "";

            switch (sensorType)
            {
                case Facility.FacilityType.SecomFire:
                    strSensorBrandType = "SECOM";
                    resultMsg = "화재";
                    break;
                case Facility.FacilityType.Intrusion_S1:
                    strSensorBrandType = "지능형영상";
                    resultMsg = "침입";
                    break;
                case Facility.FacilityType.Loiter_S1:
                    strSensorBrandType = "지능형영상";
                    resultMsg = "배회";
                    break;
                case Facility.FacilityType.Collapse_S1:
                    strSensorBrandType = "지능형영상";
                    resultMsg = "쓰러짐";
                    break;
                case Facility.FacilityType.Theft_S1:
                    strSensorBrandType = "지능형영상";
                    resultMsg = "도난";
                    break;
                case Facility.FacilityType.Neglect_S1:
                    strSensorBrandType = "지능형영상";
                    resultMsg = "방치";
                    break;
                case Facility.FacilityType.VirtualFence_S1:
                    strSensorBrandType = "지능형영상";
                    resultMsg = "(가상펜스)침입";
                    break;
                case Facility.FacilityType.Fire_S1:
                    strSensorBrandType = "지능형영상";
                    resultMsg = "화재";
                    break;
                case Facility.FacilityType.EmergencyBell_S1:
                    strSensorBrandType = "지능형영상";
                    resultMsg = "비상벨";
                    break;
                case Facility.FacilityType.GeneralIntrusionT1_S1:
                    strSensorBrandType = "S1Access";
                    resultMsg = "침입";
                    break;
                case Facility.FacilityType.GeneralIntrusionT2_S1:
                    strSensorBrandType = "S1Access";
                    resultMsg = "침입";
                    break;
                case Facility.FacilityType.InternalIntrusionT3_S1:
                    strSensorBrandType = "S1Access";
                    resultMsg = "침입";
                    break;
                case Facility.FacilityType.VaultIntrusionT4_S1:
                    strSensorBrandType = "S1Access";
                    resultMsg = "침입";
                    break;
                case Facility.FacilityType.FireF1_S1:
                    strSensorBrandType = "S1Access";
                    resultMsg = "ACCESS화재";
                    break;
                case Facility.FacilityType.CustomerEmergencyC1_S1:
                    strSensorBrandType = "S1Access";
                    resultMsg = "여자화장실 비상벨";
                    break;
                case Facility.FacilityType.CustomerEmergencyC2_S1:
                    strSensorBrandType = "S1Access";
                    resultMsg = "여자화장실 비상벨";
                    break;
                case Facility.FacilityType.RescueQQ_S1:
                    strSensorBrandType = "S1Access";
                    resultMsg = "구급";
                    break;
                case Facility.FacilityType.GasG1_S1:
                    strSensorBrandType = "S1Access";
                    resultMsg = "가스누출";
                    break;
                case Facility.FacilityType.BlackoutAbnormalityU1_S1:
                    strSensorBrandType = "S1Access";
                    resultMsg = "정전";
                    break;
                case Facility.FacilityType.LeakAbnormalityU4_S1:
                    strSensorBrandType = "S1Access";
                    resultMsg = "누수";
                    break;
                case Facility.FacilityType.SynthesisAlertAbnormalityU8_S1:
                    strSensorBrandType = "S1Access";
                    resultMsg = "종합경보반 이상";
                    break;
                case Facility.FacilityType.ExternalAlarmBell:
                    strSensorBrandType = "S1Access";
                    resultMsg = "외부비상벨 호출";
                    break;
                case Facility.FacilityType.SecomExternalAlarmBell:
                    strSensorBrandType = "SECOM";
                    resultMsg = "외부비상벨 호출";
                    break;
                case Facility.FacilityType.SecomWomenAlarmBell:
                    strSensorBrandType = "SECOM";
                    resultMsg = "여자화장실 비상벨";
                    break;
                default:
                    resultMsg = ReadFacilityTypeName(sensorType);
                    break;
            }
            return resultMsg;
        }

        private string ReadFacilityTypeName(Facility.FacilityType sensorType)
        {
            string strErrorMessage;
            FacilityType facilityType = m_mainManager.SDMSDataManager.GetSelectManager().SelectFacilityType((int)sensorType, out strErrorMessage);

            if (facilityType != null)
                return facilityType.TypeName;

            return "";
        }

        private string GetSecurityReportString(EquipmentZone equipZone, Facility.FacilityType sensorType)
        {
            string strSensorBrand = "", strMessage = "";
            string strEventType = GetEventTypeString(sensorType, out strSensorBrand);

            if (equipZone == null)
            {
                if (strSensorBrand.Length > 0)
                    strMessage = string.Format("[{0}] {1} 상황이 신고되었습니다", strSensorBrand, strEventType);
                else
                    strMessage = string.Format("{0} 상황이 신고되었습니다", strEventType);
            }
            else
            {
                if (strSensorBrand.Length > 0)
                    strMessage = string.Format("[{0}][{1}]에서 {2} 상황이 신고되었습니다", strSensorBrand, equipZone.DisplayText, strEventType);
                else
                    strMessage = string.Format("[{0}]에서 {1} 상황이 신고되었습니다", equipZone.DisplayText, strEventType);
            }

            return strMessage;
        }

        private string GetDetectSecurityMessage(EquipmentZone equipZone, Facility.FacilityType sensorType, bool isReal)
        {
            string strSensorBrand = "", strMessage = "";
            string strEventType = GetEventTypeString(sensorType, out strSensorBrand);

            if (isReal)
            {
                string strTag = GetTrainingModeString();

                if (equipZone == null)
                {
                    if (strSensorBrand.Length > 0)
                        strMessage = string.Format("{0}[{1}] {2} 신호가 탐지되었습니다", strTag, strSensorBrand, strEventType);
                    else
                        strMessage = string.Format("{0} {1} 신호가 탐지되었습니다", strTag, strEventType);
                }
                else
                {
                    if (strSensorBrand.Length > 0)
                        strMessage = string.Format("{0}[{1}][{2}]에서 {3} 신호가 탐지되었습니다", strTag, strSensorBrand, equipZone.DisplayText, strEventType);
                    else
                        strMessage = string.Format("{0}[{1}]에서 {2} 신호가 탐지되었습니다", strTag, equipZone.DisplayText, strEventType);
                }
            }
            else
            {
                if (equipZone == null)
                {
                    if (strSensorBrand.Length > 0)
                        strMessage = string.Format("[테스트][{0}] {1} 탐지되었습니다", strSensorBrand, strEventType);
                    else
                        strMessage = string.Format("[테스트] {0} 탐지되었습니다", strEventType);
                }
                else
                {
                    if (strSensorBrand.Length > 0)
                        strMessage = string.Format("[테스트][{0}][{1}]에서 {2} 탐지되었습니다", strSensorBrand, equipZone.DisplayText, strEventType);
                    else
                        strMessage = string.Format("[테스트][{0}]에서 {1} 탐지되었습니다", equipZone.DisplayText, strEventType);
                }
            }

            return strMessage;
        }

        private string GetTrainingModeString()
        {
            string strTag = m_agentFactory.SMSManager.GetTrainingModeString();
            return strTag;
        }

        private string GetClearSecurityMessage(EquipmentZone equipZone, Facility.FacilityType sensorType, SVMSDevice svmsDevice, bool isReal)
        {
            string strMessage = "상황해제";
            string strSensorBrand;
            string strEventType = GetEventTypeString(sensorType, out strSensorBrand);

            if (isReal)
            {
                string strTag = GetTrainingModeString();

                if (equipZone == null)
                {
                    if (strSensorBrand.Length > 0)
                        strMessage = string.Format("{0}[{1}] {2} 신호가 현장 복구되었습니다", strTag, strSensorBrand, strEventType);
                    else
                        strMessage = string.Format("{0} {1} 신호가 현장 복구되었습니다", strTag, strEventType);
                }
                else
                {
                    if (strSensorBrand.Length > 0)
                        strMessage = string.Format("{0}[{1}][{2}]에서 탐지된 {3} 신호가 현장 복구되었습니다", strTag, strSensorBrand, equipZone.DisplayText, strEventType);
                    else
                        strMessage = string.Format("{0}[{1}]에서 탐지된 {2} 신호가 현장 복구되었습니다", strTag, equipZone.DisplayText, strEventType);
                }
            }
            else
            {
                if (equipZone == null)
                {
                    if (strSensorBrand.Length > 0)
                        strMessage = string.Format("[테스트][{0}] {1} 신호가 현장 복구되었습니다", strSensorBrand, strEventType);
                    else
                        strMessage = string.Format("[테스트] {0} 신호가 현장 복구되었습니다", strEventType);
                }
                else
                {
                    if (strSensorBrand.Length > 0)
                        strMessage = string.Format("[테스트][{0}][{1}]에서 탐지된 {2} 신호가 현장 복구되었습니다", strSensorBrand, equipZone.DisplayText, strEventType);
                    else
                        strMessage = string.Format("[테스트][{0}]에서 탐지된 {1} 신호가 현장 복구되었습니다", equipZone.DisplayText, strEventType);
                }
            }

            return strMessage;
        }

        private string GetMalfunctionMessage(EquipmentZone equipZone, Facility.FacilityType sensorType, bool isReal)
        {
            string strMessage = "오작동";
            string strSensorBrand;
            string strEventType = GetEventTypeString(sensorType, out strSensorBrand);

            if (isReal)
            {
                string strTag = GetTrainingModeString();

                if (equipZone == null)
                {
                    if (strSensorBrand.Length > 0)
                        strMessage = string.Format("{0}[{1}] {2} 신호가 오작동으로 신고되었습니다", strTag, strSensorBrand, strEventType);
                    else
                        strMessage = string.Format("{0} {1} 신호가 오작동으로 신고되었습니다", strTag, strEventType);
                }
                else
                {
                    if (strSensorBrand.Length > 0)
                        strMessage = string.Format("{0}[{1}][{2}]에서 탐지된 {3} 신호가 오작동으로 신고되었습니다", strTag, strSensorBrand, equipZone.DisplayText, strEventType);
                    else
                        strMessage = string.Format("{0}[{1}]에서 탐지된 {2} 신호가 오작동으로 신고되었습니다", strTag, equipZone.DisplayText, strEventType);
                }
            }
            else
            {
                if (equipZone == null)
                {
                    if (strSensorBrand.Length > 0)
                        strMessage = string.Format("[테스트][{0}] {1} 신호가 오작동으로 신고되었습니다", strSensorBrand, strEventType);
                    else
                        strMessage = string.Format("[테스트] {0} 신호가 오작동으로 신고되었습니다", strEventType);
                }
                else
                {
                    if (strSensorBrand.Length > 0)
                        strMessage = string.Format("[테스트][{0}][{1}]에서 탐지된 {2} 신호가 오작동으로 신고되었습니다", strSensorBrand, equipZone.DisplayText, strEventType);
                    else
                        strMessage = string.Format("[테스트][{0}]에서 탐지된 {1} 신호가 오작동으로 신고되었습니다", equipZone.DisplayText, strEventType);
                }
            }

            return strMessage;
        }

        private string GetUserResetMessage(EquipmentZone equipZone, Facility.FacilityType sensorType, bool isReal)
        {
            string strMessage = "";
            string strSensorBrand;
            string strEventType = GetEventTypeString(sensorType, out strSensorBrand);

            if (isReal)
            {
                string strTag = GetTrainingModeString();

                if (equipZone == null)
                {
                    if (strSensorBrand.Length > 0)
                        strMessage = string.Format("{0}[{1}] {2} 신호가 복구되었습니다", strTag, strSensorBrand, strEventType);
                    else
                        strMessage = string.Format("{0} {1} 신호가 복구되었습니다", strTag, strEventType);
                }
                else
                {
                    if (strSensorBrand.Length > 0)
                        strMessage = string.Format("{0}[{1}][{2}]에서 탐지된 {3} 신호가 복구되었습니다", strTag, strSensorBrand, equipZone.DisplayText, strEventType);
                    else
                        strMessage = string.Format("{0}[{1}]에서 탐지된 {2} 신호가 복구되었습니다", strTag, equipZone.DisplayText, strEventType);
                }
            }
            else
            {
                if (equipZone == null)
                {
                    if (strSensorBrand.Length > 0)
                        strMessage = string.Format("[테스트][{0}] {1} 신호가 복구되었습니다", strSensorBrand, strEventType);
                    else
                        strMessage = string.Format("[테스트] {0} 신호가 복구되었습니다", strEventType);
                }
                else
                {
                    if (strSensorBrand.Length > 0)
                        strMessage = string.Format("[테스트][{0}][{1}]에서 탐지된 {2} 신호가 복구되었습니다", strSensorBrand, equipZone.DisplayText, strEventType);
                    else
                        strMessage = string.Format("[테스트][{0}]에서 탐지된 {1} 신호가 복구되었습니다", equipZone.DisplayText, strEventType);
                }
            }

            return strMessage;
        }

        private string GetChangeAlarmDepthString(Facility.FacilityType sensorType, int nAlarmDepth, int nPrevAlarmDepth, bool isReal, EquipmentZone equipZone)
        {
            string strMessage = "";
            string strTag = isReal ? "" : "[테스트]";

            string strSensorBrand;
            string strEventType = GetEventTypeString(sensorType, out strSensorBrand);

            if (equipZone != null)
            {
                if (strSensorBrand.Length > 0)
                    strMessage = string.Format("{0}[{1}][{2}]에서 탐지된 {3} 신호의 알람 단계가 {4}단계에서 {5}단계로 변경되었습니다", strTag, strSensorBrand, equipZone.DisplayText, strEventType, nPrevAlarmDepth, nAlarmDepth);
                else
                    strMessage = string.Format("{0}[{1}]에서 탐지된 {2} 신호의 알람 단계가 {3}단계에서 {4}단계로 변경되었습니다", strTag, equipZone.DisplayText, strEventType, nPrevAlarmDepth, nAlarmDepth);
            }
            else
            {
                if (strSensorBrand.Length > 0)
                    strMessage = string.Format("{0}[{1}] {2} 신호의 알람 단계가 {3}단계에서 {4}단계로 변경되었습니다", strTag, strSensorBrand, strEventType, nPrevAlarmDepth, nAlarmDepth);
                else
                    strMessage = string.Format("{0} {1} 신호의 알람 단계가 {2}단계에서 {3}단계로 변경되었습니다", strTag, strEventType, nPrevAlarmDepth, nAlarmDepth);
            }
            return strMessage;
        }
    }
}
