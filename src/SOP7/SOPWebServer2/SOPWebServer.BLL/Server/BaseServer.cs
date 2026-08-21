using System;
using System.Collections;
using AgentFactory.BLL;
using dnsSopID;
using dnsData.Alarm;
using SDMS.Model.Sensor;
using SDMS.Model.History;

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
            // 예외가 발생하면 컨트롤러까지 그대로 전파되어 로그에 아무 흔적도 남지 않는다.
            // 신호가 처리되지 못한 사유를 반드시 남기기 위해 여기서 감싼다.
            try
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
            catch (Exception ex)
            {
                string strDatas = "";

                if (arrDatas != null)
                {
                    foreach (object data in arrDatas)
                        strDatas += (strDatas.Length == 0 ? "" : ", ") + (data == null ? "null" : data.ToString());
                }

                WriteLog("OnReceive 예외 발생 - 신호 처리 실패 : " + this.GetType().Name + ", header " + header.ToString()
                         + ", datas [" + strDatas + "]" + System.Environment.NewLine + ex.ToString());

                return GetErrorMessageResult(ErrorMessageType.INVALID_MESSAGE);
            }
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
    }

    
}
