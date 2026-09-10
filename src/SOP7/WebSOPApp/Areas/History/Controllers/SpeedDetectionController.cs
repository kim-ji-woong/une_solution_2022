using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using WebSOPApp.Areas.History.Controllers.Request;
using WebSOPApp.Areas.History.Controllers.Response;

namespace WebSOPApp.Areas.History.Controllers
{
    // 차량 과속 이력 조회 (원익 전용)
    //  - 과속 감지 데이터(SdmsVehicleSpeedDetection)는 WonikBeaconServer 가 속도감지 장비(DFS)에서 받아 DB 에 기록한다.
    //    이미 DB 에 쌓인 이력을 읽는 데는 수집 서버를 거칠 이유가 없으므로, 다른 이력 메뉴처럼 WebSOPApp 이 같은 DB 를 직접 조회한다.
    //    (예전에는 브라우저가 BeaconServer(http://10.6.13.71:2420)를 직접 호출해, 그 서버에 닿지 못하면 이력도 볼 수 없었다)
    //  - 응답 형태는 BeaconServer 의 /Detection/RequestSpeedDetectionHistorys, /Detection/RequestSpeedDetectionSensors 와 같다.
    //  - 제한속도(SpeedDetection:SpeedLimit)는 수집 서버의 기록 기준이 원본이라 여기서 다루지 않는다. (프론트가 BeaconServer 에서 받는다)
    [Area("History")]
    public class SpeedDetectionController : Controller
    {
        private const string DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";

        private global::SDMS.IDAL.IDataManager m_sdmsDataManager = null;
        private global::Wonik.IDAL.IDataManager m_wonikDataManager = null;

        public SpeedDetectionController(global::SDMS.IDAL.IDataManager sdmsDataManager, global::Wonik.IDAL.IDataManager wonikDataManager)
        {
            m_sdmsDataManager = sdmsDataManager;
            m_wonikDataManager = wonikDataManager;
        }

        // 속도감지 센서 목록 (화면의 '위치' 선택용)
        [HttpPost]
        public IActionResult RequestSpeedDetectionSensors()
        {
            ResponseSpeedDetectionSensors response = new ResponseSpeedDetectionSensors();

            try
            {
                Dictionary<global::SDMS.Model.Sensor.SensorZone.Fields, object> dicConditions = new Dictionary<global::SDMS.Model.Sensor.SensorZone.Fields, object>();
                dicConditions[global::SDMS.Model.Sensor.SensorZone.Fields.SensorType] = (int)global::dnsData.Sensor.Facility.FacilityType.SpeedDetection;

                string strErrorMessage;
                ArrayList arrDatas = m_sdmsDataManager.GetSelectManager().JoinSensorZoneETCSensor(dicConditions, null, string.Empty, out strErrorMessage);
                if (arrDatas == null)
                    throw new ApplicationException(strErrorMessage);

                List<global::SDMS.Model.Sensor.ETC> sensors = new List<global::SDMS.Model.Sensor.ETC>();

                // 결과는 [SensorZone, ETC, SensorZone, ETC, ...] 순서로 온다.
                for (int i = 0; i < arrDatas.Count - 1; i += 2)
                {
                    if (arrDatas[i] is global::SDMS.Model.Sensor.SensorZone && arrDatas[i + 1] is global::SDMS.Model.Sensor.ETC)
                        sensors.Add((global::SDMS.Model.Sensor.ETC)arrDatas[i + 1]);
                }

                response.Sensors = sensors;
                response.Success = true;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "속도감지 센서 목록 조회 실패 : " + ex.Message;
            }

            return Ok(response);
        }

        // 과속 감지 이력 (조회 기간 + 선택 센서)
        [HttpPost]
        public IActionResult RequestSpeedDetectionHistories([FromBody] RequestSpeedDetectionHistories data)
        {
            if (data == null)
                return BadRequest();

            ResponseSpeedDetectionHistories response = new ResponseSpeedDetectionHistories();

            DateTime dtBegin, dtEnd;
            if (!TryParseDate(data.BeginDate, out dtBegin) || !TryParseDate(data.EndDate, out dtEnd))
            {
                response.Success = false;
                response.Message = "조회 기간 형식이 올바르지 않습니다. (" + DATE_FORMAT + ")";
                return Ok(response);
            }

            try
            {
                // 날짜는 DateTime 으로 변환한 뒤 고정 형식으로 다시 써서 조건에 넣는다.
                // (요청 문자열을 SQL 조건에 그대로 붙이지 않는다)
                string strTable = global::Wonik.Model.VehicleSpeedDetection.TableName;
                string strTimeField = global::Wonik.Model.VehicleSpeedDetection.Fields.DetectionTime.ToString();
                string strSensorField = global::Wonik.Model.VehicleSpeedDetection.Fields.SensorID.ToString();

                string strConditions = string.Format("{0}.{1} >= '{2}' and {0}.{1} <= '{3}'",
                    strTable, strTimeField,
                    dtBegin.ToString(DATE_FORMAT, CultureInfo.InvariantCulture),
                    dtEnd.ToString(DATE_FORMAT, CultureInfo.InvariantCulture));

                if (data.SensorID != null && data.SensorID > 0)
                    strConditions += string.Format(CultureInfo.InvariantCulture, " and {0}.{1} = {2}", strTable, strSensorField, (int)data.SensorID);

                string strErrorMessage;
                ArrayList arrResult = m_wonikDataManager.GetSelectManager().JoinVehicleSpeedDetectionSensorETC(strConditions, out strErrorMessage);
                if (arrResult == null)
                    throw new ApplicationException(strErrorMessage);

                List<SpeedDetectionData> datas = new List<SpeedDetectionData>();

                // 결과는 [VehicleSpeedDetection, SensorETC, VehicleSpeedDetection, SensorETC, ...] 순서로 온다.
                for (int i = 0; i < arrResult.Count - 1; i += 2)
                {
                    global::Wonik.Model.VehicleSpeedDetection detection = arrResult[i] as global::Wonik.Model.VehicleSpeedDetection;
                    global::Wonik.Model.SensorETC sensor = arrResult[i + 1] as global::Wonik.Model.SensorETC;

                    if (detection == null || sensor == null)
                        continue;

                    datas.Add(new SpeedDetectionData(detection, sensor.Name));
                }

                response.SpeedDetectionDatas = datas;
                response.Success = true;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "과속 이력 조회 실패 : " + ex.Message;
            }

            return Ok(response);
        }

        private static bool TryParseDate(string strDate, out DateTime dt)
        {
            if (DateTime.TryParseExact(strDate, DATE_FORMAT, CultureInfo.InvariantCulture, DateTimeStyles.None, out dt))
                return true;

            return DateTime.TryParse(strDate, CultureInfo.InvariantCulture, DateTimeStyles.None, out dt);
        }
    }
}
