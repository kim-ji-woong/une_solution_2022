using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace AlarmWebService.Controllers
{
    using Models;
    using Models.Response;

    [ApiController]
    [Route("api/[controller]")]
    public class AlarmInfoController : ControllerBase
    {
        private IDataManager m_dataManager = null;

        public AlarmInfoController(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        [HttpPost]
        public IActionResult RequestAlarmInfo()
        {
            bool uplockOption = GetParkingUplockOption();

            if (uplockOption == false)
            {
                // 주차관제 Uplock을 사용하지 않는 옵션이면 굳이 알람정보를 읽어올 필요가 없다.
                return Ok(new ResponseAlarm(true, "", ""));
            }

            string strErrorMessage;
            IEnumerable<CurrentAlarm> alarms = m_dataManager.GetSelect().Select<CurrentAlarm>(null, out strErrorMessage);

            if (alarms == null)
                return Ok(new ResponseAlarm(false, strErrorMessage));

            Dictionary<string, string> dicAlarmTypes = new Dictionary<string, string>();

            foreach (CurrentAlarm alarm in alarms)
            {
                if (alarm.SensorType == (int)dnsData.Sensor.Facility.FacilityType.FIRE_SENSOR)
                    dicAlarmTypes["화재"] = "화재";
                else if (alarm.SensorType == (int)dnsData.Sensor.Facility.FacilityType.SUBMERGENCY)
                    dicAlarmTypes["침수"] = "침수";
                else if (alarm.SensorType == (int)dnsData.Sensor.Facility.FacilityType.Earthquake)
                {
                    int intensity = GetIntensity(alarm.SensorZoneHistoryID);

                    if (intensity >= 6)
                        dicAlarmTypes["지진"] = "지진";
                }
                else if (alarm.SensorType == (int)dnsData.Sensor.Facility.FacilityType.TERROR)
                {
                    if (alarm.AlarmDepth >= 3)
                        dicAlarmTypes["테러"] = "테러";
                }
                /*if (alarm.SensorType == (int)CurrentAlarm.AlarmTypes.Fire)
                    AddAlarmType(ref strAlarmTypes, "화재");
                else if (alarm.AlarmType == (int)CurrentAlarm.AlarmTypes.Flooding)
                    AddAlarmType(ref strAlarmTypes, "침수");
                else if (alarm.AlarmType == (int)CurrentAlarm.AlarmTypes.Earthquake)
                {
                    if (alarm.AlarmValue != null && (double)alarm.AlarmValue >= 6)
                        AddAlarmType(ref strAlarmTypes, "지진");
                }
                else if (alarm.AlarmType == (int)CurrentAlarm.AlarmTypes.Terror)
                {
                    if (alarm.Description != null && (alarm.Description == "경계" || alarm.Description == "심각"))
                        AddAlarmType(ref strAlarmTypes, "테러");
                }*/
            }

            string strAlarmTypes = "";

            foreach (KeyValuePair<string, string> pair in dicAlarmTypes)
            {
                AddAlarmType(ref strAlarmTypes, pair.Key);
            }

            return Ok(new ResponseAlarm(true, "", strAlarmTypes));
        }

        private bool GetParkingUplockOption()
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = 'UseParkingUplock'", OptionSDMS.Fields.PropertyName);
            IEnumerable<OptionSDMS> options = m_dataManager.GetSelect().Select<OptionSDMS>(strCondition, out strErrorMessage);

            if (options == null)
                return true;

            foreach (var option in options)
            {
                if (option.PropertyValue != null)
                {
                    string strValue = option.PropertyValue.ToLower().Trim();

                    if (strValue == "1" || strValue == "true")
                        return true;
                    else if (strValue == "0" || strValue == "false")
                        return false;
                }

                break;
            }

            return true;
        }

        private int GetIntensity(int nSensorZoneHistoryID)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1} and {2} = 0", SensorReactionHistory.Fields.SensorZoneHistoryID, nSensorZoneHistoryID, SensorReactionHistory.Fields.ReactionType);
            SensorReactionHistory sensorReactionHistory = m_dataManager.GetSelect().SelectFirst<SensorReactionHistory>(strCondition, out strErrorMessage);

            if (sensorReactionHistory == null)
                return -1;

            if (sensorReactionHistory.Message == null)
                return -1;

            string strTarget = "진도";
            int index = sensorReactionHistory.Message.IndexOf(strTarget);

            if (index >= 0)
            {
                string strMessage = sensorReactionHistory.Message.Substring(index + strTarget.Length).Trim();

                int intensity = 0;

                for (int i=0;i<strMessage.Length;i++)
                {
                    char ch = strMessage[i];

                    if (ch >= '0' && ch <= '9')
                        intensity = intensity * 10 + (int)(ch - '0');
                    else
                        break;
                }

                return intensity;
            }

            return -1;
        }

        private void AddAlarmType(ref string strAlarmType, string strType)
        {
            if (strAlarmType.Length == 0)
                strAlarmType = strType;
            else
                strAlarmType += "," + strType;
        }
    }
}
