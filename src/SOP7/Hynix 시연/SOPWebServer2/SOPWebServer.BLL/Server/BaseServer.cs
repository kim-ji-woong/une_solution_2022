using System;
using System.Collections;
using AgentFactory.BLL;
using dnsSopID;
using SDMS.Model.Sensor;
using Hynix.Model;
using System.Collections.Generic;

namespace SOPWebServer.BLL.Server
{
    using Response;
    using Models;

    public abstract class BaseServer
    {
        protected BaseAgent m_agent = null;
        protected Factory m_agentFactory = null;

        public BaseServer()
        {
        }

        public BaseServer(Factory factory)
        {
            m_agentFactory = factory;
        }

        public void SetAgentFactory(Factory agentFactory)
        {
            m_agentFactory = agentFactory;
        }

        public void OnLoad(SDMS.IDAL.IDataManager dataManager)
        {
            BaseAgent.MethodProcessType processType = m_agent.CheckMethod(BaseAgent.MethodType.OnLoad, null);

            if (processType == BaseAgent.MethodProcessType.Default)
                OnLoadEvent();
            else if (processType == BaseAgent.MethodProcessType.FactoryOnly)
                m_agent.RunMethod(BaseAgent.MethodType.OnLoad, dataManager);
            else if (processType == BaseAgent.MethodProcessType.PostProcess)
            {
                OnLoadEvent();
                m_agent.RunMethod(BaseAgent.MethodType.OnLoad, dataManager);
            }
            else if (processType == BaseAgent.MethodProcessType.PreProcess)
            {
                m_agent.RunMethod(BaseAgent.MethodType.OnLoad, dataManager);
                OnLoadEvent();
            }
        }

        public Result OnReceive(int header, string strClientInfo, ArrayList arrDatas)
        {
            BaseAgent.MethodProcessType processType = m_agent.CheckMethod(BaseAgent.MethodType.OnReceive, header);

            if (processType == BaseAgent.MethodProcessType.Default)
                return OnReceiveEvent(header, strClientInfo, arrDatas);
            else if (processType == BaseAgent.MethodProcessType.FactoryOnly)
            {
                object result = m_agent.RunMethod(BaseAgent.MethodType.OnReceive, header, strClientInfo, arrDatas);

                if (result != null && result is int)
                {
                    int nResult = (int)result;

                    if (nResult == ErrorMessageType.SUCCESS)
                        return new Result(true);
                    else
                        return GetErrorMessageResult(nResult);
                }
                else
                    return GetErrorMessageResult(ErrorMessageType.UNKNOWN_COMMAND);
            }
            else if (processType == BaseAgent.MethodProcessType.PostProcess)
            {
                Result _result = OnReceiveEvent(header, strClientInfo, arrDatas);
                object result = m_agent.RunMethod(BaseAgent.MethodType.OnReceive, header, strClientInfo, arrDatas);

                if (result != null && result is int)
                {
                    int nResult = (int)result;

                    if (nResult == ErrorMessageType.SUCCESS)
                        return new Result(true);
                    else
                        return GetErrorMessageResult(nResult);
                }
                else
                    return _result;
            }
            else if (processType == BaseAgent.MethodProcessType.PreProcess)
            {
                m_agent.RunMethod(BaseAgent.MethodType.OnReceive, header, strClientInfo, arrDatas);
                return OnReceiveEvent(header, strClientInfo, arrDatas);
            }

            return GetErrorMessageResult(ErrorMessageType.UNKNOWN_HEADER);
        }

        protected void WriteLog(string strLog)
        {
            Logger.Instance.Write(strLog);
        }

        protected MessageResult GetErrorMessageResult(int error)
        {
            return new MessageResult(false, ErrorMessageType.ToMessage(error));
        }

        protected abstract void OnLoadEvent();
        protected abstract Result OnReceiveEvent(int header, string strClientInfo, ArrayList arrDatas);

        protected virtual int ChangeAlarm(MainManager mainManager, AlarmData currentAlarm, SensorZoneGroup group, SensorZone sensorZone, int? nAlarmLevel = null)
        {
            int data;
            bool isAlarmStatus;
            AlarmData alarmPrev = currentAlarm.Clone();

            int nAlarmDepth = m_agent.GetAlarmDepth(mainManager.AlarmManager, group.GetSensors(), sensorZone, nAlarmLevel);
            currentAlarm.AlarmDepth = nAlarmDepth;

            if ((group.GetSensorData(sensorZone, out data, out isAlarmStatus) == false) || data == 0 || isAlarmStatus == false || alarmPrev.AlarmDepth != currentAlarm.AlarmDepth)
            {
                group.SetSensorData(sensorZone, 1, true, mainManager.SDMSDataManager);
                ((Process.AlarmManager)mainManager.AlarmManager).AddAlarmSensor(group.GetSensors(), currentAlarm.SensorZoneHistoryID, mainManager.SDMSDataManager);

                ChangeAlarm(mainManager, currentAlarm, alarmPrev, group, sensorZone, 1);
            }

            return ErrorMessageType.SUCCESS;
        }

        protected virtual void ChangeAlarm(MainManager mainManager, AlarmData alarmCurrent, AlarmData alarmPrev, SensorZoneGroup group, SensorZone sensorZone, int sensorData)
        {
        }


        protected bool CheckAlarmDuplication(AlarmData alarm, SensorZoneGroup group, SensorZone sensorZone, MainManager mainManager, Process.AlarmManager alarmManager, out int errorMessage)
        {
            if (alarmManager.CheckAlarmDuplication(alarm, group, mainManager.SensorManager))
            {
                // 이미 같은 SensorZoneGroup에 알람이 있기 때문에 해당 알람과 정보를 합친다.
                alarmManager.RemoveCurrentAlarm(alarm.SensorZoneHistoryID);
                alarmManager.RemoveSensorZoneHistory(alarm.SensorZoneHistoryID);
                group.RemoveSensorData(sensorZone, mainManager.SDMSDataManager);

                AlarmData currentAlarm = group.CurrentAlarm;

                if (currentAlarm != null)
                    errorMessage = ChangeAlarm(mainManager, currentAlarm, group, sensorZone);
                else
                    errorMessage = ErrorMessageType.SUCCESS;

                return true;
            }

            errorMessage = ErrorMessageType.SUCCESS;
            return false;
        }

        protected virtual string ConvertJsonLanguage(string strKo, string strEn)
        {
            return "";
        }

        protected static AlarmScript ReadAlarmScript(Hynix.IDAL.IDataManager dataManager, int sensorType, out string strErrorMessage)
        {
            AlarmScript script = dataManager.GetSelectManager().SelectHynixAlarmScript(sensorType, out strErrorMessage);

            if (script == null)
            {
                if (strErrorMessage != null && strErrorMessage.Length > 0)
                    return null;

                script = new AlarmScript();
                script.Script = "";
                return script;
            }

            return script;
        }

        protected static bool CheckAlarmTime(Common.IDAL.IDataManager dataManager, string strEventType)
        {
            bool isNullable;
            string strCondition = string.Format("{0} = 'time{1}'", Common.Model.Option.Options.GetFieldName(Common.Model.Option.Options.Fields.PropertyName, out isNullable), strEventType);

            string strErrorMessage;
            List<Common.Model.Option.Options> options = dataManager.GetSelectManager().SelectOptions(Common.Model.Option.Options.OptionTarget.SDMS, strCondition, null, out strErrorMessage);

            if (options == null)
                return false;

            if (options.Count > 0)
            {
                var option = options[0];
                return CheckTime(DateTime.Now, option.PropertyValue);
            }

            return true;
        }

        private static bool CheckTime(DateTime time, string strSchedule)
        {
            // 스케쥴을 못찾으면 무시한다.
            if (strSchedule == null)
                return true;

            int timeValue = time.Hour * 10000 + time.Minute * 100 + time.Second;

            bool isChecked = false;
            int hour1, min1, sec1, hour2, min2, sec2;
            string[] tokens = strSchedule.Split(';');

            foreach (string strToken in tokens)
            {
                string[] times = strToken.Split('-');

                if (times.Length >= 2)
                {
                    if (GetTime(times[0].Trim(), out hour1, out min1, out sec1) && GetTime(times[1].Trim(), out hour2, out min2, out sec2))
                    {
                        isChecked = true;

                        int beginTime = hour1 * 10000 + min1 * 100 + sec1;
                        int endTime = hour2 * 10000 + min2 * 100 + sec2;

                        if (timeValue >= beginTime && timeValue <= endTime)
                            return true;
                    }
                }
            }

            if (isChecked)
                return false;

            // 검증할 스케쥴 데이터가 없으면 무시한다.
            return true;
        }

        private static bool GetTime(string strTime, out int hour, out int min, out int sec)
        {
            string[] tokens = strTime.Split(':');

            if (tokens.Length >= 3)
            {
                if (int.TryParse(tokens[0].Trim(), out hour) && int.TryParse(tokens[1].Trim(), out min) && int.TryParse(tokens[2].Trim(), out sec))
                    return true;
            }

            hour = min = sec = 0;
            return false;
        }
    }    
}
