using AgentFactory.BLL;
using dnsData.Alarm;
using dnsData.Sensor;
using dnsSopID;
using SDMS.Model.History;
using SDMS.Model.Sensor;
using SDMS.Model.Spatial;
using SOPWebServer.BLL.Models;
using SOPWebServer.BLL.Response;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;

namespace SOPWebServer.BLL.Server
{
    public class EnvironmentSensor : BaseServer
    {
        private MainManager m_mainManager = null;

        // 긴급 맵핑 테이블에 등록된 센서존의 강제 알람 단계(심각)
        private const int EMERGENCY_ALARM_DEPTH = 4;

        public EnvironmentSensor(MainManager mainManager, Factory factory)
            : base(factory)
        {
            m_mainManager = mainManager;
            m_agent = factory.MakeAgent(Factory.AgentType.Environment);
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
            else if (header == Header.MANUAL_REPORT)
                return ProcessManualReport(arrDatas);
            else if (header == Header.CLEAR_MANUAL_REPORT)
                return ProcessClearManualReport(arrDatas);

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

                WriteLog("EnvironmentSensor ProcessSensorData 수신 (SensorType: " + nSensorType.ToString() + ", SensorTagID: " + nSensorTagID.ToString() + ", SensorZoneID: " + nSensorZoneID.ToString() +
                    ", SensorData: " + nSensorData.ToString() + ")");

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
                    int nSiteID = (group.EquipmentZone != null ? group.EquipmentZone.SiteID : m_mainManager.SDMSDataManager.SiteID);
                    bool useReceive = m_mainManager.SensorManager.GetUseReceive(nSensorType, nSiteID);
                    if (!useReceive)
                        return new Result(true);

                    // 알람 발생
                    AlarmData alarm;
                    int nResult = AddAlarm(group, nSensorTagID, sensorZone, isReal, nAlarmLevel, out alarm);

                    if (alarm != null)
                    {
                        // SensorZone 단위 독립 알람: 그룹 전체가 아니라 이번에 발생한 존만 전달한다.
                        m_mainManager.ProcessManager.NewAlarm(alarm, new List<int> { sensorZone.ID });
                    }

                    if (nResult == ErrorMessageType.SUCCESS)
                        return new Result(true);

                    return new MessageResult(false, ErrorMessageType.ToMessage(nResult));
                }
                else
                {
                    // 알람 해제: SensorZone 단위로 관리되므로 해당 존의 알람만 종료한다.
                    // (구: group.CurrentAlarm 단일 슬롯 기준 해제 -> 신: SensorZoneID 기준 해제)
                    if (clearAlarm)
                        return ClearGroupAlarms(group, isReal, header);          // SENSOR_MALFUNCTION/SENSOR_USER_RESET: 그룹 내 모든 존 알람 일괄 종료
                    else
                        return ClearZoneAlarm(group, sensorZone, isReal, header); // 일반 해제 신호: 이 존의 알람만 종료
                }
            }

            return new MessageResult(false, ErrorMessageType.ToMessage(ErrorMessageType.INVALID_MESSAGE));
        }

        /// <summary>
        /// SensorZone 단위로 알람을 발생시킨다.
        /// 같은 SensorZoneGroup(EquipZone+SensorType) 안이라도 서로 다른 SensorZone은 각각 독립된 알람으로
        /// 생성하며, 이미 이 존에 활성 알람이 있으면 신규 생성 없이 단계(depth)만 갱신한다(멱등).
        /// </summary>
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

            // 1. 판정 기준은 그룹 전체가 아니라 "이 SensorZone"이다.
            //    같은 그룹의 다른 존에 알람이 있어도 이 존이 비어있으면 신규 알람을 생성한다.
            AlarmData zoneAlarm = FindActiveZoneAlarm(sensorZone.ID);

            if (zoneAlarm != null)
            {
                // 2. 같은 존의 재신호: 신규 생성 없이 단계만 갱신하는 멱등 처리.
                return RefreshZoneAlarmDepth(zoneAlarm, sensorZone, nAlarmLevel);
            }

            // 3. 이 존에 활성 알람이 없으므로 신규 알람을 생성한다.
            int nAlarmDepth = m_agent.GetAlarmDepth(m_mainManager.AlarmManager, group.GetSensors(), sensorZone, nAlarmLevel);

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
                        // 환경설비 센서 또한 ETC 테이블을 같이 쓴다.
                        ETC etc = txDataManager.GetSelectManager().SelectETCSensor((int)sensorZone.OrgSensorID, out strErrorMessage);
                        if (etc == null)
                            nZoneID = -1;
                        else
                            nZoneID = etc.ZoneID;
                    }
                }
            }

            int nSiteID = (group.EquipmentZone != null ? group.EquipmentZone.SiteID : m_mainManager.SDMSDataManager.SiteID);

            alarm = ((Process.AlarmManager)m_mainManager.AlarmManager).AddAlarm(sensorZone.ID, 1, nZoneID, sensorZone.SensorType, (int)detectionStatus, timeStamp, txDataManager, FacilityManager.DetectTypes.Detect, nSiteID);

            if (alarm != null)
            {
                // 4. 동기화 문제로 인하여 같은 SensorZone에 중복된 알람이 발생하지 않았는지 한번더 검사한다.
                //    (그룹 단위가 아닌 존 단위 중복검사: 형제 존의 알람은 건드리지 않는다)
                if (CheckZoneAlarmDuplication(alarm, sensorZone))
                {
                    // 방금 만든 이력을 되돌린다.
                    if (bInTransaction)
                        txDataManager.BatchRollback();

                    alarm = null;   // 다른 스레드가 먼저 만든 알람을 유지하고 방금 만든 것은 롤백 -> NewAlarm 중복 호출 방지
                    return ErrorMessageType.SUCCESS;
                }

                alarm.AlarmDepth = nAlarmDepth;
                //alarm.AlarmDepth = 1;

                // 알람 단계 전송시
                if (nAlarmLevel.HasValue)
                    alarm.AlarmDepth = nAlarmLevel.Value;

                group.CurrentAlarm = alarm;

                string strMessage = GetDetectMessage((int)sensorZone.OrgSensorID, group.EquipmentZone, isReal);
                string strEquipZoneID = group.EquipmentZone == null ? null : group.EquipmentZone.ID.ToString();
                SensorReactionHistory.ReactionTypes reactionType = SensorReactionHistory.ReactionTypes.BEGIN_STATUS;

                string strParam3 = sensorZone.SensorType.ToString();
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

            return ErrorMessageType.DB_EXCEPTION;
        }

        /// <summary>
        /// nSensorZoneID가 SensorZone 단위 알람 조회/관리 대상인지 확인한다.
        /// 0 이하(미설정) 또는 Header.ManualReportDefaultID 이상(수동신고)인 경우는 제외한다.
        /// </summary>
        private bool IsSensorZoneAlarmTarget(int nSensorZoneID)
        {
            return nSensorZoneID > 0 && nSensorZoneID < Header.ManualReportDefaultID;
        }

        /// <summary>
        /// 지정한 SensorZoneID의 활성 알람 1개를 찾는다.
        /// 인메모리(AlarmManager.CurrentAlarms)를 우선 조회하고, 없으면(재기동 직후 등) DB에서 폴백 조회한다.
        /// </summary>
        private AlarmData FindActiveZoneAlarm(int nSensorZoneID)
        {
            if (IsSensorZoneAlarmTarget(nSensorZoneID) == false)
                return null;

            foreach (AlarmData alarm in m_mainManager.AlarmManager.CurrentAlarms)
            {
                if (alarm.SensorZoneID == nSensorZoneID)
                    return alarm;  // 인메모리에 있으면 우선 사용
            }

            // 재기동 직후 등 인메모리에 없을 경우 DB에서 폴백 조회한다.
            return ((Process.AlarmManager)m_mainManager.AlarmManager).FindAlarm(nSensorZoneID, Facility.FacilityType.Environment, m_mainManager.SDMSDataManager);
        }

        /// <summary>
        /// 지정한 SensorZoneID의 활성 알람을 모두 찾는다. 정상 상황에서는 최대 1개이나,
        /// 동시성/레거시 사유로 같은 존에 알람이 2개 이상 생긴 경우를 방어적으로 함께 종료하기 위함이다.
        /// </summary>
        private List<AlarmData> FindActiveZoneAlarms(int nSensorZoneID)
        {
            List<AlarmData> alarms = new List<AlarmData>();

            if (IsSensorZoneAlarmTarget(nSensorZoneID) == false)
                return alarms;

            foreach (AlarmData alarm in m_mainManager.AlarmManager.CurrentAlarms)
            {
                if (alarm.SensorZoneID == nSensorZoneID)
                    alarms.Add(alarm);
            }

            if (alarms.Count == 0)
            {
                // 인메모리에 없으면 DB 폴백 1건을 확인한다.
                AlarmData alarm = FindActiveZoneAlarm(nSensorZoneID);

                if (alarm != null)
                    alarms.Add(alarm);
            }

            return alarms;
        }

        /// <summary>
        /// group.CurrentAlarm 단일 슬롯에 "그룹에 활성 알람이 있으면 그 중 하나, 없으면 null" 불변식을 유지한다.
        /// SensorZone 단위로 알람이 나뉜 뒤에도, 그룹 슬롯을 참조하는 외부 코드(재기동 로드, 상황전파 등)의
        /// null/not-null 계약이 깨지지 않도록 하기 위함이다.
        /// </summary>
        private void RefreshGroupCurrentAlarmPointer(SensorZoneGroup group)
        {
            foreach (AlarmData alarm in m_mainManager.AlarmManager.CurrentAlarms)
            {
                if (IsSensorZoneAlarmTarget(alarm.SensorZoneID) == false)
                    continue;  // 수동신고 등 SensorZone 알람이 아닌 경우 제외

                if (m_mainManager.SensorManager.GetSensorZoneGroup(alarm.SensorZoneID) == group)
                {
                    group.CurrentAlarm = alarm;  // 그룹에 남아있는 활성 알람 중 하나를 대표로 지정
                    return;
                }
            }

            group.CurrentAlarm = null;  // 그룹에 활성 알람이 하나도 없음
        }

        /// <summary>
        /// 방금 생성한 alarm과 같은 SensorZoneID를 가진 다른 활성 알람이 이미 존재하는지 확인한다.
        /// 동시성 등으로 같은 존에 알람이 이중 생성된 경우, 방금 만든 alarm을 롤백하고 기존 알람을 유지한다.
        /// (그룹 전체가 아닌 같은 SensorZone 범위에서만 중복을 판정하므로 형제 존의 알람은 건드리지 않는다)
        /// </summary>
        private bool CheckZoneAlarmDuplication(AlarmData alarm, SensorZone sensorZone)
        {
            foreach (AlarmData other in m_mainManager.AlarmManager.CurrentAlarms)
            {
                if (other == alarm)
                    continue;  // 자기 자신은 제외

                if (other.SensorZoneID == sensorZone.ID)
                {
                    // 이미 같은 SensorZone에 알람이 있으므로 방금 만든 것을 롤백한다.
                    Process.AlarmManager alarmManager = (Process.AlarmManager)m_mainManager.AlarmManager;
                    alarmManager.RemoveCurrentAlarm(alarm.SensorZoneHistoryID);
                    alarmManager.RemoveSensorZoneHistory(alarm.SensorZoneHistoryID);
                    alarmManager.RemoveAlarm(alarm);
                    return true;
                }
            }

            return false;
        }

        /// <summary>
        /// 이미 활성 알람이 있는 SensorZone이 재신호했을 때, 신규 알람을 만들지 않고 단계(depth)만 갱신한다.
        /// 단계가 상향(escalation)된 경우에만 이력/전파를 반영하며, 하향/동일 신호는 무시한다
        /// (SOP 자동승격이 유실되지 않도록 하기 위함. AlarmDepth>=3에서 SOP가 자동 실행된다).
        /// </summary>
        private int RefreshZoneAlarmDepth(AlarmData zoneAlarm, SensorZone sensorZone, int? nAlarmLevel)
        {
            int newDepth = m_agent.GetAlarmDepth(m_mainManager.AlarmManager, new KeyValuePair<SensorZone, int>[] { new KeyValuePair<SensorZone, int>(sensorZone, 1) }, sensorZone, nAlarmLevel);

            if (newDepth > zoneAlarm.AlarmDepth)  // 단계가 상향된 경우에만 이력/전파를 반영한다.
            {
                AlarmData alarmPrev = zoneAlarm.Clone();
                zoneAlarm.AlarmDepth = newDepth;
                zoneAlarm.Status = (int)SensorReactionHistory.ReactionTypes.CHANGE_ALARM_DEPTH;

                string strParam3 = sensorZone.SensorType.ToString();
                string strParam5 = newDepth.ToString();

                ((Process.AlarmManager)m_mainManager.AlarmManager).AddReactionHistory(zoneAlarm, (int)SensorReactionHistory.ReactionTypes.CHANGE_ALARM_DEPTH, DateTime.Now, zoneAlarm.Message, null, sensorZone.ID.ToString(), strParam3, null, strParam5, m_mainManager.SDMSDataManager);

                m_agentFactory.ProcessManager.ChangeAlarm(zoneAlarm, alarmPrev);
            }

            return ErrorMessageType.SUCCESS;  // 신규 생성 없음(멱등) -> out alarm은 null로 유지되어 호출부의 NewAlarm이 실행되지 않는다.
        }

        /// <summary>
        /// 해제 신호로 들어온 SensorZone의 활성 알람만 종료한다(같은 그룹의 다른 존 알람은 유지).
        /// </summary>
        private Result ClearZoneAlarm(SensorZoneGroup group, SensorZone sensorZone, bool isReal, int header)
        {
            List<AlarmData> zoneAlarms = FindActiveZoneAlarms(sensorZone.ID);

            if (zoneAlarms.Count == 0)
            {
                // 이미 해제된 상태(멱등). 센서 데이터 잔재만 정리한다.
                group.RemoveSensorData(sensorZone, m_mainManager.SDMSDataManager);
                RefreshGroupCurrentAlarmPointer(group);
                return new Result(true);
            }

            int nResult = ErrorMessageType.SUCCESS;
            bool removedSensorData = false;

            foreach (AlarmData alarm in zoneAlarms)
            {
                int result = RemoveAlarm(group, sensorZone, alarm, isReal, header, ref removedSensorData);

                if (result != ErrorMessageType.SUCCESS)
                    nResult = result;  // 실패해도 나머지(중복) 알람 종료는 계속 시도한다.
                else
                {
                    alarm.Status = (int)SensorReactionHistory.ReactionTypes.END_STATUS;
                    m_agentFactory.ProcessManager.ClearAlarm(alarm);  // SensorZoneHistoryID 기준 정밀 삭제(형제 존 무간섭)
                }
            }

            RefreshGroupCurrentAlarmPointer(group);

            if (nResult != ErrorMessageType.SUCCESS)
                return new MessageResult(false, ErrorMessageType.ToMessage(nResult));

            return new Result(true);
        }

        /// <summary>
        /// SENSOR_MALFUNCTION/SENSOR_USER_RESET 수신 시, 그룹 내 신호 중인 모든 SensorZone의 알람을 각각 종료한다.
        /// 정리 대상 존은 신호 딕셔너리(group.GetSensors()) 하나에만 의존하지 않고,
        /// AlarmManager.CurrentAlarms(신뢰 가능한 원천)에서 이 그룹에 속한 알람도 함께 모은다.
        /// (신호 딕셔너리는 SetSensorData의 DB 갱신이 실패하면 채워지지 않을 수 있어 단독 신뢰 불가)
        /// </summary>
        private Result ClearGroupAlarms(SensorZoneGroup group, bool isReal, int header)
        {
            SensorReactionHistory.ReactionTypes reactionType = SensorReactionHistory.ReactionTypes.END_STATUS;

            if (header == Header.SENSOR_MALFUNCTION)
                reactionType = SensorReactionHistory.ReactionTypes.MALFUNCTION;  // 센서 고장으로 인한 종료
            else if (header == Header.SENSOR_USER_RESET)
                reactionType = SensorReactionHistory.ReactionTypes.USER_RESET;   // 사용자 강제 리셋으로 인한 종료

            // 1. 정리 대상 SensorZoneID 집합을 두 원천의 합집합으로 구성한다.
            HashSet<int> zoneIDs = new HashSet<int>();

            foreach (KeyValuePair<SensorZone, int> pair in group.GetSensors())
                zoneIDs.Add(pair.Key.ID);  // 신호 딕셔너리: 알람 없이 신호만 남은 잔재도 함께 정리하기 위함

            foreach (AlarmData alarm in m_mainManager.AlarmManager.CurrentAlarms)
            {
                if (IsSensorZoneAlarmTarget(alarm.SensorZoneID) && m_mainManager.SensorManager.GetSensorZoneGroup(alarm.SensorZoneID) == group)
                    zoneIDs.Add(alarm.SensorZoneID);  // AlarmManager 기준: 딕셔너리 갱신 실패와 무관하게 실제 살아있는 알람을 놓치지 않는다
            }

            int nResult = ErrorMessageType.SUCCESS;

            // 2. 각 존에 대해 활성 알람을 종료하고, 알람 없이 신호 데이터만 남은 존은 데이터를 정리한다.
            foreach (int nSensorZoneID in zoneIDs)
            {
                SensorZone sensorZone = m_mainManager.SensorManager.GetSensorZone(nSensorZoneID);

                if (sensorZone == null)
                    continue;  // 존 정보를 확인할 수 없으면 건너뛴다.

                bool removedSensorData = false;

                foreach (AlarmData alarm in FindActiveZoneAlarms(nSensorZoneID))
                {
                    int result = RemoveAlarm(group, sensorZone, alarm, isReal, header, ref removedSensorData);

                    if (result != ErrorMessageType.SUCCESS)
                        nResult = result;
                    else
                    {
                        alarm.Status = (int)reactionType;
                        m_agentFactory.ProcessManager.ClearAlarm(alarm);
                    }
                }

                if (removedSensorData == false)
                    group.RemoveSensorData(sensorZone, m_mainManager.SDMSDataManager);  // 알람 없이 신호 데이터만 남아있던 존 정리
            }

            RefreshGroupCurrentAlarmPointer(group);

            if (nResult != ErrorMessageType.SUCCESS)
                return new MessageResult(false, ErrorMessageType.ToMessage(nResult));

            return new Result(true);
        }

        private string GetDetectMessage(int nOrgSensorID, EquipmentZone equipZone, bool isReal)
        {
            //string strEventName = Facility.GetFacilityTypeString(sensorType) + " 신호";
            string strEventName = Facility.GetFacilityTypeString(Facility.FacilityType.Environment) + " 신호";

            string strErrorMessage = null;
            // 환경설비 센서 또한 ETC 테이블을 같이 쓴다.
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

        /// <summary>
        /// 지정한 alarm(해당 SensorZone의 활성 알람)을 종료한다.
        /// 종료 대상은 인자로 받은 alarm이며, group.CurrentAlarm 슬롯은 더 이상 판정에 사용하지 않는다
        /// (호출부에서 RefreshGroupCurrentAlarmPointer로 슬롯을 일괄 재계산한다).
        /// </summary>
        private int RemoveAlarm(SensorZoneGroup group, SensorZone sensorZone, AlarmData alarm, bool isReal, int header, ref bool removedSensorData)
        {
            DateTime timeStamp = DateTime.Now;

            if (removedSensorData == false)
            {
                if (group.RemoveSensorData(sensorZone, m_mainManager.SDMSDataManager) == false)
                {
                    WriteLog("RemoveSensorData 실패 : " + sensorZone.ID.ToString());
                    return ErrorMessageType.DB_EXCEPTION;
                }

                removedSensorData = true;  // 같은 존에 중복 알람이 있는 경우, 센서 데이터 제거는 최초 1회만 수행한다.
            }

            if (alarm == null)
            {
                return ErrorMessageType.SUCCESS;
            }

            EquipmentZone equipZone = m_mainManager.SensorManager.GetEquipmentZone(sensorZone.EquipZoneID);
            string strMessage = GetClearMessage(Facility.ToFacilityType(sensorZone.SensorType), equipZone, isReal);
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
                // group.CurrentAlarm 슬롯 정리는 호출부(ClearZoneAlarm/ClearGroupAlarms)의
                // RefreshGroupCurrentAlarmPointer가 일괄 재계산한다.
                return ErrorMessageType.SUCCESS;
            }

            WriteLog("RemoveAlarm 실패 : " + sensorZone.ID.ToString());
            return ErrorMessageType.DB_EXCEPTION;
        }

        private string GetClearMessage(Facility.FacilityType sensorType, EquipmentZone equipZone, bool isReal)
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

        private string GetTrainingModeString()
        {
            return m_agentFactory.SMSManager.GetTrainingModeString();
        }

        private Result ProcessManualReport(ArrayList arrDatas)
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
                    return new MessageResult(false, ErrorMessageType.ToMessage(ErrorMessageType.UNKNOWN_SENSOR_ID));

                SensorZoneGroup group = m_mainManager.SensorManager.GetSensorZoneGroup(nSensorZoneID);
                if (group == null)
                    return GetErrorMessageResult(ErrorMessageType.UNKNOWN_SENSOR_ID);

                SensorZone sensorZone = m_mainManager.SensorManager.GetSensorZone(nSensorZoneID);
                if (sensorZone == null)
                    return GetErrorMessageResult(ErrorMessageType.UNKNOWN_SENSOR_ID);

                AlarmData alarm = ((Process.AlarmManager)m_mainManager.AlarmManager).GetManualAlarm(nZoneID, Facility.FacilityType.Environment, m_mainManager.SDMSDataManager);
                if (alarm != null)
                    return new MessageResult(false, ErrorMessageType.ToMessage(ErrorMessageType.ALREADY_PROCESSED));

                int nSiteID = (group.EquipmentZone != null ? group.EquipmentZone.SiteID : m_mainManager.SDMSDataManager.SiteID);

                alarm = ((Process.AlarmManager)m_mainManager.AlarmManager).AddAlarm(nSensorZoneID, 1, nZoneID, nSensorType, (int)SensorZoneHistory.DetectionType.Real, dtDateTime, m_mainManager.SDMSDataManager, FacilityManager.DetectTypes.Detect, nSiteID);
                if (alarm == null)
                    return new MessageResult(false, ErrorMessageType.ToMessage(ErrorMessageType.DB_EXCEPTION));

                alarm.AlarmDepth = nAlarmDepth;
                alarm.IsManual = true;
                alarm.IsReal = true;
                SensorReactionHistory.ReactionTypes reactionType = SensorReactionHistory.ReactionTypes.BEGIN_STATUS;

                string strMessage = GetManualReportString(nZoneID);
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

                    // SensorZone 단위 독립 알람: 그룹 전체가 아니라 이 수동신고 존만 전달한다.
                    m_mainManager.ProcessManager.NewAlarm(alarm, new List<int> { sensorZone.ID });

                    return new Result(true);
                }
            }

            return new MessageResult(false, ErrorMessageType.ToMessage(ErrorMessageType.INVALID_MESSAGE));
        }

        private string GetManualReportString(int nZoneID)
        {
            string strMessage = "";

            if (nZoneID < 0)
            {
                strMessage = "환경설비 상황이 신고되었습니다";
            }
            else
            {
                Zone zone = m_mainManager.SensorManager.GetZone(nZoneID);

                if (zone != null)
                {
                    string szLocationName = zone.DisplayText;
                    strMessage = string.Format("[{0}]에서 환경설비 상황이 신고되었습니다", szLocationName);
                }
            }

            return strMessage;
        }

        private Result ProcessClearManualReport(ArrayList arrDatas)
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
                    string strMessage = GetClearManualMessage(alarm);
                    string strEquipZoneID = equipZone == null ? null : sensorZone.EquipZoneID.ToString();

                    SensorZoneHistory.DetectionType detectionStatus = SensorZoneHistory.DetectionType.Real;
                    SensorReactionHistory.ReactionTypes reactionType = SensorReactionHistory.ReactionTypes.END_STATUS;

                    if (((Process.AlarmManager)m_mainManager.AlarmManager).RemoveAlarm(alarm, DateTime.Now, (int)reactionType, strMessage, strEquipZoneID, sensorZone.ID.ToString(), null, null, null, (int)detectionStatus, m_mainManager.SDMSDataManager))
                    {
                        alarm.Message = strMessage;

                        // SensorZone 단위 독립 알람: 이 수동신고 알람은 항상 종료되었으므로 슬롯 상태와 무관하게 ClearAlarm을 호출한다.
                        alarm.Status = (int)SensorReactionHistory.ReactionTypes.END_STATUS;
                        m_agentFactory.ProcessManager.ClearAlarm(alarm);

                        // 수동신고 존이 실제 센서존과 같은 EquipZone 그룹을 공유할 경우를 대비해,
                        // 슬롯은 무조건 null이 아니라 "남은 활성 알람이 있으면 그 중 하나, 없으면 null"로 재계산한다.
                        RefreshGroupCurrentAlarmPointer(group);

                        nResult = ErrorMessageType.SUCCESS;
                    }

                    if (nResult == ErrorMessageType.SUCCESS)
                        return new Result(true);

                    return new MessageResult(false, ErrorMessageType.ToMessage(nResult));
                }
            }

            return new MessageResult(false, ErrorMessageType.ToMessage(ErrorMessageType.INVALID_MESSAGE));
        }

        private string GetClearManualMessage(AlarmData alarm)
        {
            string strMessage = "신고된 환경설비 상황이 종료되었습니다";
            int nZoneID;

            if (int.TryParse(alarm.ReactionHistoryParam1, out nZoneID))
            {
                Zone zone = m_mainManager.SensorManager.GetZone(nZoneID);

                if (zone != null)
                {
                    strMessage = string.Format("[{0}]에서 신고된 환경설비 상황이 종료되었습니다", zone.DisplayText);
                }
            }

            return strMessage;
        }
    }
}
