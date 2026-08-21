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
using System.Text;

namespace SOPWebServer.BLL.Server
{
    class BeaconSensor : BaseServer
    {
        enum BeaconLevel_UpDown  { UP = 0, DOWN = 1 }

        private MainManager m_mainManager = null;

        public BeaconSensor(MainManager mainManager, Factory factory)
           : base(factory)
        {
            m_mainManager = mainManager;
            m_agent = factory.MakeAgent(Factory.AgentType.Beacon);
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
                int nAlarmLevel = 1;

                if (arrDatas.Count >= 5 && arrDatas[4] is int)
                    nAlarmLevel = (int)arrDatas[4];

                WriteLog("BeaconSensor ProcessSensorData 수신 (SensorType: " + nSensorType.ToString() + ", SensorTagID: " + nSensorTagID.ToString() + ", SensorZoneID: " + nSensorZoneID.ToString() +
                    ", SensorData: " + nSensorData.ToString() + ")");

                string strName = "-";
                string strMemberID = "-";
                string strTeamName = "-";
                string strPhoneNumer = "-";
                string strFloor = "-";
                int nEquipZoneID = -1;
                string strStayTime = "00:00:00";
                int? nComNum = null;

                if (arrDatas.Count >= 13 && arrDatas[5] is string && arrDatas[6] is string && arrDatas[7] is string && arrDatas[8] is string && arrDatas[9] is string && arrDatas[10] is int && arrDatas[11] is string && arrDatas[12] is int)
                {
                    strName = (string)arrDatas[5];
                    strMemberID = (string)arrDatas[6];
                    strTeamName = (string)arrDatas[7];
                    strPhoneNumer = (string)arrDatas[8];
                    strFloor = (string)arrDatas[9];
                    nEquipZoneID = (int)arrDatas[10];
                    strStayTime = (string)arrDatas[11];
                    nComNum = (int)arrDatas[12];
                }

                PersonData personData = new PersonData(strName, strMemberID, strTeamName, strPhoneNumer, strFloor, nEquipZoneID, strStayTime, nComNum);

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
                    int nResult = AddAlarm(group, nSensorTagID, sensorZone, isReal, nAlarmLevel, personData, out alarm);

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
                            ChangeAlarm(m_mainManager, alarm, alarmPrev, group, sensorZone, personData);
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
                group.CurrentAlarm = null;
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


        private int AddAlarm(SensorZoneGroup group, int nSensorTagID, SensorZone sensorZone, bool isReal, int nAlarmLevel, PersonData personData, out AlarmData alarm)
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
                // 알람 단계가 변화가 있는지 체크 후 있다면 
                return ChangeAlarm(m_mainManager, currentAlarm, group, sensorZone, nAlarmLevel, personData);
            }
            else
            {
                int nAlarmDepth = m_agent.GetAlarmDepth(m_mainManager.AlarmManager, group.GetSensors(), sensorZone, nAlarmLevel);

                group.SetSensorData(sensorZone, 1, true, m_mainManager.SDMSDataManager);

                SensorZoneHistory.DetectionType detectionStatus = isReal ? SensorZoneHistory.DetectionType.Real : SensorZoneHistory.DetectionType.Test;

                DateTime timeStamp = DateTime.Now;
                int nZoneID = -1;

                if (group.EquipmentZone != null)
                {
                    if (group.EquipmentZone.LinkedZoneIDs.Count >= 1)
                        nZoneID = group.EquipmentZone.LinkedZoneIDs[0];
                    //else if (group.EquipmentZone.LinkedZoneIDs.Count > 1)
                    //{
                    //    if (sensorZone.OrgSensorID == null)
                    //        nZoneID = -1;
                    //    else
                    //    {
                    //        //string strErrorMessage = null;
                    //        //// 정전센서 또한 ETC 테이블을 같이 쓴다.
                    //        //ETC etc = m_mainManager.SDMSDataManager.GetSelectManager().SelectETCSensor((int)sensorZone.OrgSensorID, out strErrorMessage);
                    //        //if (etc == null)
                    //        //    nZoneID = -1;
                    //        //else
                    //        //    nZoneID = etc.ZoneID;
                    //        nZoneID = -1;
                    //    }
                    //}
                }

                int nSiteID = (group.EquipmentZone != null ? group.EquipmentZone.SiteID : m_mainManager.SDMSDataManager.SiteID);

                alarm = ((Process.AlarmManager)m_mainManager.AlarmManager).AddAlarm(sensorZone.ID, 1, nZoneID, sensorZone.SensorType, (int)detectionStatus, timeStamp, m_mainManager.SDMSDataManager, FacilityManager.DetectTypes.Detect, nSiteID);

                if (alarm != null)
                {
                    // 동기화 문제로 인하여 같은 SensorZoneGroup에 중복된 알람이 발생하지 않았는지 한번더 검사한다.
                    int errorMessage;
                    if (CheckAlarmDuplication(alarm, group, sensorZone, m_mainManager, (Process.AlarmManager)m_mainManager.AlarmManager, out errorMessage))
                        return errorMessage;

                    alarm.AlarmDepth = nAlarmDepth;
                    //alarm.AlarmDepth = 1;

                    // 알람 단계 전송시
                    alarm.AlarmDepth = nAlarmLevel;

                    group.CurrentAlarm = alarm;

                    string strMessage = GetDetectMessage(sensorZone.OrgSensorID, sensorZone.SensorType, group.EquipmentZone, isReal);
                    string strEquipZoneID = group.EquipmentZone == null ? null : group.EquipmentZone.ID.ToString();
                    SensorReactionHistory.ReactionTypes reactionType = SensorReactionHistory.ReactionTypes.BEGIN_STATUS;

                    string strParam3 = sensorZone.SensorType.ToString();
                    string strParam5 = alarm.AlarmDepth.ToString();

                    // Param4 인원 정보
                    string strParam4 = MakeParamPersonString(alarm, personData, BeaconLevel_UpDown.UP);

                    if (((Process.AlarmManager)m_mainManager.AlarmManager).AddReactionHistory(alarm, (int)reactionType, timeStamp, strMessage, strEquipZoneID, sensorZone.ID.ToString(), strParam3, strParam4, strParam5, m_mainManager.SDMSDataManager))
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
   
        private int ChangeAlarm(MainManager mainManager, AlarmData currentAlarm, SensorZoneGroup group, SensorZone sensorZone, int nAlarmLevel, PersonData personData)
        {
            AlarmData alarmPrev = currentAlarm.Clone();

            currentAlarm.AlarmDepth = nAlarmLevel;

            ChangeAlarm(mainManager, currentAlarm, alarmPrev, group, sensorZone, personData);

            return ErrorMessageType.SUCCESS;
        }



        private void ChangeAlarm(MainManager mainManager, AlarmData alarmCurrent, AlarmData alarmPrev, SensorZoneGroup group, SensorZone sensorZone, PersonData personData)
        {
            //mainManager.ProcessManager.UpdateAlarm(alarmCurrent, group.GetAlarmSensorZoneIDs());

            if (alarmCurrent.AlarmDepth != alarmPrev.AlarmDepth)
            {
                mainManager.ProcessManager.ChangeAlarm(alarmCurrent, alarmPrev);
                string strLocationName = group.EquipmentZone != null ? group.EquipmentZone.DisplayText : "";

                alarmCurrent.TimeStamp = DateTime.Now;
                alarmCurrent.Status = (int)SensorReactionHistory.ReactionTypes.CHANGE_ALARM_DEPTH;
                alarmCurrent.Message = GetChangeAlarmDepthString(sensorZone.OrgSensorID, sensorZone.SensorType, alarmCurrent.AlarmDepth, alarmPrev.AlarmDepth, alarmCurrent.IsReal, group.EquipmentZone);

                string strParam3 = ((int)sensorZone.SensorType).ToString();


                // Param4 인원 정보
                BeaconLevel_UpDown upDown = BeaconLevel_UpDown.UP;
                if (alarmCurrent.AlarmDepth < alarmPrev.AlarmDepth)
                    upDown = BeaconLevel_UpDown.DOWN;

                string strParam4 = MakeParamPersonString(alarmCurrent, personData, upDown);


                string strParam5 = alarmCurrent.AlarmDepth.ToString();
                ((Process.AlarmManager)mainManager.AlarmManager).AddReactionHistory(alarmCurrent, (int)alarmCurrent.Status, alarmCurrent.TimeStamp, alarmCurrent.Message, sensorZone.EquipZoneID.ToString(), sensorZone.ID.ToString(), strParam3, strParam4, strParam5, mainManager.SDMSDataManager);
            }
        }

        private string MakeParamPersonString(AlarmData alarmCurrent, PersonData personData, BeaconLevel_UpDown upDown)
        {
            string strParam = "";

            string strParam4 = alarmCurrent.ReactionHistoryParam4;

            // 사번을 키 값으로
            Dictionary<string, PersonData> dicPersonData = new Dictionary<string, PersonData>();

            if (strParam4?.Length > 0)
            {
                string[] arrSplit = strParam4.Split(new string[] { "|||" }, StringSplitOptions.None);

                for (int i = 0; i < arrSplit.Length; i++)
                {
                    string person = arrSplit[i];

                    string[] arrPerson = person.Split(',');
                    if (arrPerson?.Length == 8)
                    {
                        string strName = arrPerson[0];
                        string strMemberID = arrPerson[1];
                        string strTeamName = arrPerson[2];
                        string strPhoneNumer = arrPerson[3];
                        string strFloor = arrPerson[4];
                        string strEquipZoneID = arrPerson[5];
                        string strStayTime = arrPerson[6];
                        string strComNum = arrPerson[7];

                        int nComNum = 1;
                        int.TryParse(strComNum, out nComNum);
                        int nEquipZoneID = -1;
                        int.TryParse(strEquipZoneID, out nEquipZoneID);

                        PersonData data = new PersonData();
                        data.Name = strName.Length > 0 ? strName : "-";
                        data.MemberID = strMemberID.Length > 0 ? strMemberID : "-";
                        data.TeamName = strTeamName.Length > 0 ? strTeamName : "-";
                        data.PhoneNumer = strPhoneNumer.Length > 0 ? strPhoneNumer : "-";
                        data.Floor = strFloor.Length > 0 ? strFloor : "-";
                        data.EquipZoneID = nEquipZoneID;
                        data.StayTime = strStayTime.Length > 0 ? strStayTime : "-";
                        data.ComNum = nComNum;

                        dicPersonData[data.MemberID] = data;
                    }
                }
            }
            
            if (upDown == BeaconLevel_UpDown.UP)
                dicPersonData[personData.MemberID] = personData;
            else
            {
                if (dicPersonData.ContainsKey(personData.MemberID))
                    dicPersonData.Remove(personData.MemberID);
            }

            foreach (KeyValuePair<string, PersonData> pair in dicPersonData)
            {
                PersonData person = pair.Value;

                if (strParam == null || strParam.Length == 0)
                {
                    strParam = string.Format("{0},{1},{2},{3},{4},{5},{6},{7}", person.Name, person.MemberID, person.TeamName, person.PhoneNumer, 
                    person.Floor, person.EquipZoneID, person.StayTime, (person.ComNum == 1 ? "임직원" : "방문객"));
                }
                else if (strParam.Length > 0)
                {
                    strParam += string.Format("|||{0},{1},{2},{3},{4},{5},{6},{7}", person.Name, person.MemberID, person.TeamName, person.PhoneNumer,
                    person.Floor, person.EquipZoneID, person.StayTime, (person.ComNum == 1 ? "임직원" : "방문객"));
                }
            }

            return strParam;
        }

        private string GetChangeAlarmDepthString(int? nOrgSensorID, int nSensorType, int nAlarmDepth, int nPrevAlarmDepth, bool isReal, EquipmentZone equipZone)
        {
            string strMessage = "";
            string strTag = isReal ? "" : "[테스트]";
            string strEventName = Facility.GetFacilityTypeString((Facility.FacilityType)nSensorType) + " 신호";

            string strErrorMessage = null;
            //if (nOrgSensorID.HasValue)
            //{
            //    ETC etc = m_mainManager.SDMSDataManager.GetSelectManager().SelectETCSensor(nOrgSensorID, out strErrorMessage);
            //    if (etc != null && etc.MaterialType != null)
            //    {
            //        Material material = m_mainManager.SensorManager.GetMaterial((int)etc.MaterialType);

            //        if (material != null)
            //            strEventName = material.MaterialName + " 신호";
            //    }
            //}

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

        private string GetDetectMessage(int? nOrgSensorID, int nSensorType, EquipmentZone equipZone, bool isReal)
        {
            string strEventName = Facility.GetFacilityTypeString((Facility.FacilityType)nSensorType) + " 신호";

            string strErrorMessage = null;

            // 비콘센서 또한 ETC 테이블을 같이 쓴다.
            //if (nOrgSensorID.HasValue)
            //{
            //    ETC etc = m_mainManager.SDMSDataManager.GetSelectManager().SelectETCSensor(nOrgSensorID.Value, out strErrorMessage);
            //    if (etc != null && etc.MaterialType != null)
            //    {
            //        Material material = m_mainManager.SensorManager.GetMaterial((int)etc.MaterialType);

            //        if (material != null)
            //            strEventName = material.MaterialName + " 신호";
            //    }
            //}

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

                AlarmData alarm = ((Process.AlarmManager)m_mainManager.AlarmManager).GetManualAlarm(nZoneID, Facility.FacilityType.BLACKOUT, m_mainManager.SDMSDataManager);
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

                    m_mainManager.ProcessManager.NewAlarm(alarm, group.GetAlarmSensorZoneIDs());

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
                strMessage = "정전 상황이 신고되었습니다";
            }
            else
            {
                Zone zone = m_mainManager.SensorManager.GetZone(nZoneID);

                if (zone != null)
                {
                    string szLocationName = zone.DisplayText;
                    strMessage = string.Format("[{0}]에서 정전 상황이 신고되었습니다", szLocationName);
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
                        group.CurrentAlarm = null;
                        nResult = ErrorMessageType.SUCCESS;
                    }

                    if (alarm != null && group.CurrentAlarm == null)
                    {
                        alarm.Status = (int)SensorReactionHistory.ReactionTypes.END_STATUS;
                        m_agentFactory.ProcessManager.ClearAlarm(alarm);
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
            string strMessage = "신고된 정전 상황이 종료되었습니다";
            int nZoneID;

            if (int.TryParse(alarm.ReactionHistoryParam1, out nZoneID))
            {
                Zone zone = m_mainManager.SensorManager.GetZone(nZoneID);

                if (zone != null)
                {
                    strMessage = string.Format("[{0}]에서 신고된 정전 상황이 종료되었습니다", zone.DisplayText);
                }
            }

            return strMessage;
        }

    }

    public class PersonData
    {
        public PersonData()
        {

        }
        public PersonData(string strName, string strMemberID, string strTeamName, string strPhoneNumer, string strFloor, int nEquipZoneID, string strStayTime, int? nComNum)
        {
            this.Name = strName;
            this.MemberID = strMemberID;
            this.TeamName = strTeamName;
            this.PhoneNumer = strPhoneNumer;
            this.Floor = strFloor;
            this.EquipZoneID = nEquipZoneID;
            this.StayTime = strStayTime;
            this.ComNum = nComNum;
        }

        public string Name { get; set; }
        public string MemberID { get; set; }
        public string TeamName { get; set; }
        public string PhoneNumer { get; set; }
        public string Floor { get; set; }
        public int EquipZoneID { get; set; }
        public string StayTime { get; set; }
        public int? ComNum { get; set; }
    }
}
