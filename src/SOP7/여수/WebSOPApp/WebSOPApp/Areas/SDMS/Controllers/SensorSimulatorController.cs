using Microsoft.AspNetCore.Mvc;
using dnsCommunicateSopServer;
using System.Collections;
using dnsDBUtil;
using SDMS.IDAL;
using SDMS.Model.Sensor;

namespace WebSOPApp.Areas.SDMS.Controllers
{
    using Request;
    using Response;
    using SensorServer.Model.Yeosu.Option;
    using System.Collections.Generic;

    [Area("SDMS")]
    public class SensorSimulatorController : Controller
    {
        private IDataManager m_dataManager = null;

        private SensorServer.IDAL.IDataManager m_sensorDataManager = null;

        public SensorSimulatorController(IDataManager dataManager, SensorServer.IDAL.IDataManager serverDataManager)
        {
            m_dataManager = dataManager;
            m_sensorDataManager = serverDataManager;
        }

        [HttpPost]
        public IActionResult RequestData([FromBody] RequestData data)
        {
            if (data == null)
                return BadRequest();

            if (data.RequestSendSensorAlarm != null)
                return RequestSendSensorAlarm(data.RequestSendSensorAlarm);
            else if (data.RequestClearSensorAlarm != null)
                return RequestClearSensorAlarm(data.RequestClearSensorAlarm);
            else if (data.RequestAlarmList != null)
                return RequestAlarmList();

            return null;
        }

        private IActionResult RequestAlarmList()
        {
            return Ok(ResponseAlarmList.GetAlarmList(m_dataManager));
        }

        private IActionResult RequestSendSensorAlarm(RequestSendSensorAlarm data)
        {
            SopQueryManager mgr = new SopQueryManager();
            string strUrl = Startup.ConfigManager.Site.SOPWebServerURL;
            string strErrorMessage;

            if (strUrl.EndsWith("/") == false)
                strUrl += "/";

            if (data.SensorType == (int)dnsData.Sensor.Facility.FacilityType.FIRE_SENSOR)
                strUrl += "api/FireSensor";
            else
                strUrl += "api/EtcSensor";

            ArrayList arrData = new ArrayList();

            arrData.Add(data.SensorType);
            arrData.Add(data.SensorTagInfoID);
            arrData.Add(data.SensorZoneID);
            arrData.Add(true);

            ETC sensor = m_dataManager.GetSelectManager().SelectETCSensor(data.SensorZoneID, out strErrorMessage);

            if (strErrorMessage != null)
            {
                Logger.Instance.Write("SelectETCSensor() : " + strErrorMessage);
            }

            string sensorKey = sensor.UniqueKey.Split("_")[0];

            List<OptionSDMS> availableOptions = m_sensorDataManager.GetSelectManager().SelectAllYeosuOptionSDMS(null, null, out strErrorMessage);
            
            if (strErrorMessage != null)
            {
                Logger.Instance.Write("SelectAllYeosuOptionSDMS() : " + strErrorMessage);
            }

            Dictionary<string, bool> isAvailableSensor = new Dictionary<string, bool>();

            bool isAvailable;

            foreach (OptionSDMS option in availableOptions)
            {
                string strUseReceive = "UseReceive";

                string sensorCategory = option.PropertyName.Replace(strUseReceive, "");

                if (bool.TryParse(option.PropertyValue, out isAvailable))
                {
                    isAvailableSensor[sensorCategory] = isAvailable;
                }
            }

            if (data.AlarmLevel != null)
                arrData.Add((int)data.AlarmLevel);
            else if (data.SensorType == (int)dnsData.Sensor.Facility.FacilityType.ETC)
            {
                // 기타 센서의 경우 2단계 알람으로 설정
                arrData.Add(2);
            }

            if (data.SensorValue != null)
            {
                if (data.SensorType == (int)dnsData.Sensor.Facility.FacilityType.ETC)
                {
                    // 센서값 설정
                    if (SetEtcSensorValue(data.SensorZoneID, (float)data.SensorValue, out strErrorMessage) == false)
                    {
                        if (strErrorMessage != null)
                        {
                            Logger.Instance.Write("SensorSimulatorController.RequestSendSensorAlarm() : " + strErrorMessage);
                        }
                        return Ok(new MessageResult(false, strErrorMessage));
                    }
                }
            }

            MessageResult result = new MessageResult();

            if (isAvailableSensor[sensorKey])
            {
                if (mgr.SendAlarmQuery_TEST(arrData, "POST", strUrl))
                    result.Success = true;
                else
                {
                    result.Success = false;
                    result.Message = "센서신호 전달에 실패하였습니다.";
                }
            } else
            {
                result.Success = true;
                result.Message = "센서알람 사용해제 상태입니다.";
            }

            return Ok(result);
        }

        private bool SetEtcSensorValue(int nSensorZoneID, float? fValue, out string strErrorMessage)
        {
            SensorZone sensorZone = m_dataManager.GetSelectManager().SelectSensorZone(nSensorZoneID, out strErrorMessage);

            if (sensorZone == null)
            {
                if (strErrorMessage != null)
                    return false;
                else
                {
                    strErrorMessage = "Database로부터 센서정보를 조회할 수 없습니다.";
                    return false;
                }
            }

            if (sensorZone.OrgSensorID == null)
            {
                strErrorMessage = "Database에서 센서ID를 조회할 수 없습니다.";
                return false;
            }

            ETC sensor = m_dataManager.GetSelectManager().SelectETCSensor((int)sensorZone.OrgSensorID, out strErrorMessage);

            if (sensor == null)
            {
                if (strErrorMessage != null)
                    return false;
                else
                {
                    strErrorMessage = "Database로부터 ETC 센서정보를 조회할 수 없습니다.";
                    return false;
                }
            }

            if (fValue == null)
                sensor.CurrentData = null;
            else
                sensor.CurrentData = string.Format("{0:F2}", (float)fValue);

            return m_dataManager.GetUpdateManager().UpdateETCSensor(sensor, out strErrorMessage);
        }

        private IActionResult RequestClearSensorAlarm(RequestClearSensorAlarm data)
        {
            foreach (int nSensorZoneID in data.SensorZoneIDs)
            {
                SopQueryManager mgr = new SopQueryManager();
                string strUrl = Startup.ConfigManager.Site.SOPWebServerURL;

                if (strUrl.EndsWith("/") == false)
                    strUrl += "/";

                if (data.SensorType == (int)dnsData.Sensor.Facility.FacilityType.FIRE_SENSOR)
                    strUrl += "api/FireSensor";
                else
                    strUrl += "api/EtcSensor";

                string strErrorMessage;

                if (data.SensorType == (int)dnsData.Sensor.Facility.FacilityType.ETC)
                {
                    // 알람해제시 Sensor값을 null로 만든다.
                    if (SetEtcSensorValue(nSensorZoneID, null, out strErrorMessage) == false)
                    {
                        return Ok(new MessageResult(false, strErrorMessage));
                    }
                }

                ArrayList arrData = new ArrayList();

                arrData.Add(data.SensorType);
                arrData.Add(data.SensorTagInfoID);
                arrData.Add(nSensorZoneID);
                arrData.Add(false);

                if (mgr.SendAlarmQuery_TEST(arrData, "POST", strUrl) == false)
                {
                    return Ok(new MessageResult(false, "센서신호 전달에 실패하였습니다."));
                }
            }

            return Ok(new MessageResult(true, ""));
        }
    }
}
