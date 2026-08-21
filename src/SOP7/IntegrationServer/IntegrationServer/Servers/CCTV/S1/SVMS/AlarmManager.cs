using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsDapperDBUtil.Manager;
using IntegrationServer;
using IntegrationServer.Datas;
using IntegrationServer.ViewModels.Option;
using IntegrationServer.ViewModels.Sdms;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using static dnsSopID.ID;

namespace IntegrationServer.Servers.CCTV.S1.SVMS
{
    public class AlarmManager
    {
        private SvmsManager m_parentManager = null;

        // SVMS 알람발생시 몇초후에 자동종료되는가?
        private int? m_nSvmsEventAutoCloseSeconds = null;
        private DataManager m_dataManager = null;
        private string m_strAlarmURL = "";
        
        public AlarmManager(SvmsManager svmsManager, DataManager dataManager)
        {
            m_parentManager = svmsManager;
            m_dataManager = dataManager;
            m_strAlarmURL = ConfigurationManager.AppSettings.Get("Alarm_Security_URL");

            OptionSDMS option = GetOption("SVMSEventAutoCloseSeconds");
            if (option != null)
            {
                int seconds;

                if (int.TryParse(option.PropertyValue.Trim(), out seconds))
                {
                    if (seconds > 0)
                        m_nSvmsEventAutoCloseSeconds = seconds;
                }
            }
        }

        public OptionSDMS GetOption(string strPropertyName)
        {
            string strError;
            OptionSDMS option = m_dataManager.GetSelect().SelectFirst<OptionSDMS>($"{OptionSDMS.Fields.PropertyName}='{strPropertyName}'", out strError);
            if (option == null)
            {
                if (strError?.Length > 0)
                    m_parentManager.Logger.Write(LogTypes.Error, ServerTypes.None, -1, "GetOption : " + strError);
                return null;
            }

            return option;
        }

        public void CheckAutoClose()
        {
            if (m_dataManager != null && m_nSvmsEventAutoCloseSeconds != null)
            {
                string strConditions = string.Format("{0} >= {1} and {0} <= {2}",
                    CurrentAlarm.Fields.SensorType,
                    (int)dnsData.Sensor.Facility.FacilityType.Intrusion_S1,
                    (int)dnsData.Sensor.Facility.FacilityType.Fire_S1);

                List<CurrentAlarm> alarms = GetCurrentAlarms(strConditions);
                if (alarms == null)
                    return;
                                
                DateTime? dtNow = GetDBTime();
                if (dtNow != null)
                {
                    foreach (CurrentAlarm alarm in alarms)
                    {
                        TimeSpan span = ((DateTime)dtNow) - alarm.TimeStamp;

                        if (span.TotalSeconds >= m_nSvmsEventAutoCloseSeconds)
                        {
                            SendCloseEvent(alarm);
                        }
                    }
                }
            }
        }

        public List<CurrentAlarm> GetCurrentAlarms(string strConditions)
        {
            string strError;
            IEnumerable<CurrentAlarm> currentAlarms = m_dataManager.GetSelect().Select<CurrentAlarm>(strConditions, out strError);
            if (currentAlarms == null)
            {
                m_parentManager.Logger.Write(LogTypes.Error, ServerTypes.None, -1, "GetCurrentAlarms : " + strError);
                return null;
            }

            return currentAlarms.ToList();
        }

        public DateTime? GetDBTime()
        {
            if (m_dataManager.GetDBManager().DatabaseType == WebDBManager.DBType.sqlserver)
            {
                string strError;
                dynamic dy = m_dataManager.GetSelect().SelectFirst("Select convert(varchar(19), GetDate(), 120) dt", out strError);
                if (dy == null)
                    return DateTime.Now;

                DateTime dt = Convert.ToDateTime(dy.dt);
                return dt;
            }
            else if (m_dataManager.GetDBManager().DatabaseType == WebDBManager.DBType.mysql)
            {
                string strError;
                dynamic dy = m_dataManager.GetSelect().SelectFirst("Select SELECT current_date() dt, current_time() time", out strError);
                if (dy == null)
                    return DateTime.Now;

                string strDate = dy.dt + " " + dy.time;
                DateTime dt = Convert.ToDateTime(strDate);
                return dt;
            }
            else
                return DateTime.Now;
        }

        private void SendCloseEvent(CurrentAlarm alarm)
        {
            string strErrorMessage;
            dynamic dy = m_dataManager.GetSelect().Select($"select AllSensorZoneIDs from SdmsHistorySensorZone where ID={alarm.SensorZoneHistoryID}", out strErrorMessage);
            if (dy == null || dy.AllSensorZoneIDs == null)
                return;

            string strSQL = $@"
                select sz.ID SensorZoneID, sz.SensorType, sti.ID SensorTagInfoID 
                  from SdmsSensorZone sz
                 inner join SdmsSensorTagInfo sti on sz.ID=sti.SensorZoneID
                 where sz.ID in ({dy.AllSensorZoneIDs})";

            string strError;
            dynamic arrDatas = m_dataManager.GetSelect().SelectFirst(strSQL, out strError);
            if (arrDatas == null)
                return;

            m_parentManager.SendSensorData(arrDatas.SensorType, arrDatas.SensorTagInfoID, arrDatas.SensorZoneID, false);
        }
    }
}
