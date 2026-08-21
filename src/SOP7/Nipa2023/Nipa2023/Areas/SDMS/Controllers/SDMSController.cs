using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Nipa.BLL;
using Nipa.BLL.Models.Request;
using Nipa.BLL.Models.Response;
using Nipa.BLL.Models.Response.SDMS;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Nipa2023.Areas.SDMS.Controllers
{
    [EnableCors("UnEPolicy")]
    [Area("SDMS")]
    public class SDMSController : Controller
    {
        private ProcessManager m_processManager = null;

        public SDMSController(IDataManager dataManager)
        {
            m_processManager = new ProcessManager(dataManager);
            m_processManager.SOPWebServerURL = Startup.ConfigManager.Site.SOPWebServerURL;
        }

        /// <summary>
        /// 센서목록 요청
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "requestFireSensors": true,         // 화재센서 목록이 필요한가?
        ///     "requestGasSensors": true,          // 가스센서 목록이 필요한가?
        ///     "requestAtmosphereSensors": false,  // 대기센서 목록이 필요한가?
        ///     "requestEmergencyBells": true,      // 비상벨 목록이 필요한가?
        ///     "requestWorkerTags": true,          // 작업자 Tag 목록이 필요한가?
        ///     "requestThermalCCTVs": false,       // 열화상 CCTV 목록이 필요한가?
        ///     "requestCCTVs": false,              // CCTV 목록이 필요한가?
        ///     "campusID": 1                       // 몇 공장동의 데이터를 요청하는가?
        /// }
        /// </remarks>
        [HttpPost]
        [Route("/SDMS/SDMS/RequestSensorList")]
        [ProducesResponseType(typeof(ResponseSensorList), 200)]
        public IActionResult RequestSensorList([FromBody] RequestSensorList data)
        {
            if (data == null)
                return BadRequest();

            ResponseSensorList response = m_processManager.SensorManager.GetSensorList(data);
            return Ok(response);
        }

        /// <summary>
        /// 대기센서 상세정보 요청.
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "sensorID": 1
        /// }
        /// </remarks>
        [HttpPost]
        [Route("/SDMS/SDMS/RequestAtmosphereSensorInfo")]
        [ProducesResponseType(typeof(ResponsePSMSensorInfo), 200)]
        public IActionResult RequestAtmosphereSensorInfo([FromBody] RequestPSMSensorInfo data)
        {
            if (data == null)
                return BadRequest();

            ResponsePSMSensorInfo response = m_processManager.SensorManager.GetAtmosphereSensorInfo(data);
            return Ok(response);
        }

        /// <summary>
        /// 가스센서 상세정보 요청.
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "sensorID": 1
        /// }
        /// </remarks>
        [HttpPost]
        [Route("/SDMS/SDMS/RequestGasSensorInfo")]
        [ProducesResponseType(typeof(ResponsePSMSensorInfo), 200)]
        public IActionResult RequestGasSensorInfo([FromBody] RequestPSMSensorInfo data)
        {
            if (data == null)
                return BadRequest();

            ResponsePSMSensorInfo response = m_processManager.SensorManager.GetGasSensorInfo(data);
            return Ok(response);
        }

        /// <summary>
        /// 건물목록 요청
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "campusID": 1      // 건물목록을 요청하는 공장동의 ID
        /// }
        /// </remarks>
        [HttpPost]
        [Route("/SDMS/SDMS/RequestBuildingGroupList")]
        [ProducesResponseType(typeof(ResponseBuildingGroupList), 200)]
        public IActionResult RequestBuildingGroupList([FromBody] RequestBuildingGroupList data)
        {
            ResponseBuildingGroupList result = m_processManager.SpatialManager.GetBuildingGroupList(data.CampusID);
            return Ok(result);
        }

        /// <summary>
        /// Zone 목록 요청
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "campusID": 1      // Zone 목록을 요청하는 공장동 ID
        /// }
        /// </remarks>
        [HttpPost]
        [Route("/SDMS/SDMS/RequestZoneList")]
        [ProducesResponseType(typeof(ResponseZoneList), 200)]
        public IActionResult RequestZoneList([FromBody] RequestZoneList data)
        {
            ResponseZoneList result = m_processManager.SpatialManager.GetZoneList(data.CampusID);
            return Ok(result);
        }

        /// <summary>
        /// Zone Data 요청
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "zoneID": 1      // 0보다 작으면 Outdoor를 의미한다.
        /// }
        /// </remarks>
        [HttpPost]
        [Route("/SDMS/SDMS/RequestZoneData")]
        [ProducesResponseType(typeof(ResponseZoneData), 200)]
        public IActionResult RequestZoneData([FromBody] RequestZoneData data)
        {
            ResponseZoneData result = m_processManager.SpatialManager.GetZoneData(data.ZoneID);
            return Ok(result);
        }

        /// <summary>
        /// Viewport 저장
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "zoneID": 1,
        ///     "cameraPositionX": 10.4,
        ///     "cameraPositionY": 20.2,
        ///     "cameraPositionZ": 0,
        ///     "cameraRotationX": 0,
        ///     "cameraRotationY": 10.3,
        ///     "cameraRotationZ": 0
        /// }
        /// </remarks>
        [HttpPost]
        [Route("/SDMS/SDMS/RequestSaveViewport")]
        [ProducesResponseType(typeof(ResponseZoneData), 200)]
        public IActionResult RequestSaveViewport([FromBody] RequestSaveViewport data)
        {
            MessageResult result = m_processManager.SpatialManager.SaveViewport(data);
            return Ok(result);
        }

        /// <summary>
        /// 오늘 발생한 알람정보 얻어오기
        /// </summary>
        [HttpPost]
        [Route("/SDMS/SDMS/RequestTodayAlarmData")]
        [ProducesResponseType(typeof(ResponseAlarmData), 200)]
        public IActionResult RequestTodayAlarmData()
        {
            ResponseAlarmData result = m_processManager.AlarmManager.GetTodayAlarmData();
            return Ok(result);
        }

        /// <summary>
        /// 특정 기간동안 발생한 알람정보 얻어오기
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "beginDate": 20230816,
        ///     "endDate": 20230817
        /// }
        /// </remarks>
        [HttpPost]
        [Route("/SDMS/SDMS/RequestPeriodAlarmData")]
        [ProducesResponseType(typeof(ResponseAlarmData), 200)]
        public IActionResult RequestPeriodAlarmData([FromBody] RequestAlarmPeriod data)
        {
            ResponseAlarmData result = m_processManager.AlarmManager.GetPeriodAlarmData(data);
            return Ok(result);
        }

        /// <summary>
        /// 전체 공장동 리스트 얻어오기
        /// </summary>
        [HttpPost]
        [Route("/SDMS/SDMS/RequestCampusList")]
        [ProducesResponseType(typeof(ResponseCampusList), 200)]
        public IActionResult RequestCampusList()
        {
            ResponseCampusList result = m_processManager.SpatialManager.GetCampusList();
            return Ok(result);
        }

        /// <summary>
        /// 설비정보 요청
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "campusID": 1      // 설비정보를 요청할 공장동 ID
        /// }
        /// </remarks>
        [HttpPost]
        [Route("/SDMS/SDMS/RequestFacilityList")]
        [ProducesResponseType(typeof(ResponseFacilityList), 200)]
        public IActionResult RequestFacilityList([FromBody] RequestFacilityList data)
        {
            ResponseFacilityList result = m_processManager.SpatialManager.GetFacilityList(data);
            return Ok(result);
        }

        /// <summary>
        /// 설비 상세정보 요청
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "facilityID": 1      // 설비 ID
        /// }
        /// </remarks>
        [HttpPost]
        [Route("/SDMS/SDMS/RequestFacilityData")]
        [ProducesResponseType(typeof(ResponseFacilityData), 200)]
        public IActionResult RequestFacilityData([FromBody] RequestFacilityData data)
        {
            ResponseFacilityData result = m_processManager.SpatialManager.GetFacilityData(data);
            return Ok(result);
        }

        /// <summary>
        /// MES 데이터 요청
        /// </summary>
        /// <param name="data"></param>
        /// <returns>
        ///     run : 생산현황 통계
        ///     performances : 생산현황 상세
        ///     ngs : 공정별 불량현황
        ///     ngs.불량수량 : 당월 불량현황
        ///     ngCategories : 항목별 불량현황
        ///     buyDashboards : 구매현황
        ///     sellDashboards : 매출현황
        /// </returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "campusID": 1,      // MES Data 목록을 요청할 공장동 ID
        ///     "type": 0           // 0(생산현황), 1(품질현황), 2(구매현황), 3(매출현황)
        /// }
        /// </remarks>
        [HttpPost]
        [Route("/SDMS/SDMS/RequestMESData")]
        [ProducesResponseType(typeof(ResponseMESData), 200)]
        public IActionResult RequestMESData([FromBody] RequestMESData data)
        {
            ResponseMESData result = m_processManager.EquipmentManager.GetMESData(data);
            return Ok(result);
        }

        /// <summary>
        /// MES 설비 상세 데이터 요청
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "equipmentIDs: [14, 22]"   // 설비 ID 목록
        /// }
        /// </remarks>
        [HttpPost]
        [Route("/SDMS/SDMS/RequestMESEquipmentData")]
        [ProducesResponseType(typeof(ResponseMESEquipmentData), 200)]
        public IActionResult RequestMESEquipmentData([FromBody] RequestMESEquipmentData data)
        {
            ResponseMESEquipmentData result = m_processManager.EquipmentManager.GetMesEquipmentData(data);
            return Ok(result);
        }

        /// <summary>
        /// 사용자에 의한 알람 수동복구
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "sensorZoneID": 0,
        ///     "sensorZoneHistoryID": 1,
        ///     "accessedUserID": 1,         // 알람을 복구하는 사용자의 ID
        ///     "memo": "아무거나",
        ///     "isMalfunction": false       // 알람을 오작동 처리할 것인가?
        /// }
        /// </remarks>
        [HttpPost]
        [Route("/SDMS/SDMS/RequestClearAlarm")]
        [ProducesResponseType(typeof(MessageResult), 200)]
        public IActionResult RequestClearAlarm([FromBody] RequestClearAlarm data)
        {
            MessageResult result = null;
            
            if (data.IsMalfunction == false)
                result = m_processManager.AlarmManager.ClearAlarm(data);
            else
                result = m_processManager.AlarmManager.Malfunction(data);

            return Ok(result);
        }

        /// <summary>
        /// 공장동별 요약정보를 얻어오는 API
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "campusID": 1       // 공장동 ID
        /// }
        /// </remarks>
        [HttpPost]
        [Route("/SDMS/SDMS/RequestCampusData")]
        [ProducesResponseType(typeof(ResponseCampusData), 200)]
        public IActionResult RequestCampusData([FromBody] RequestCampusData data)
        {
            ResponseCampusData result = m_processManager.SpatialManager.GetCampusData(data);
            return Ok(result);
        }

        /// <summary>
        /// AP 요약정보를 얻어오는 API
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "campusID": 1       // 공장동 ID
        /// }
        /// </remarks>
        [HttpPost]
        [Route("/SDMS/SDMS/RequestAPStatistics")]
        [ProducesResponseType(typeof(ResponseAPStatistics), 200)]
        public IActionResult RequestAPStatistics([FromBody] RequestAPStatistics data)
        {
            ResponseAPStatistics result = m_processManager.SensorManager.GetAPStatistics(data.CampusID);
            return Ok(result);
        }

        /// <summary>
        /// 작업자 요약정보를 얻어오는 API
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "campusID": 1       // 공장동 ID
        /// }
        /// </remarks>
        [HttpPost]
        [Route("/SDMS/SDMS/RequestWorkerStatistics")]
        [ProducesResponseType(typeof(ResponseWorkerStatistics), 200)]
        public IActionResult RequestWorkerStatistics([FromBody] RequestWorkerStatistics data)
        {
            ResponseWorkerStatistics result = m_processManager.SensorManager.GetWorkerStatistics(data.CampusID);
            return Ok(result);
        }

        /// <summary>
        /// AP 목록을 얻어오는 API
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "campusID": 1       // 공장동 ID
        /// }
        /// </remarks>
        [HttpPost]
        [Route("/SDMS/SDMS/RequestAPList")]
        [ProducesResponseType(typeof(ResponseAPList), 200)]
        public IActionResult RequestAPList([FromBody] RequestAPList data)
        {
            ResponseAPList result = m_processManager.SensorManager.GetAPList(data.CampusID);
            return Ok(result);
        }

        /// <summary>
        /// 작업자 목록을 얻어오는 API
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "campusID": 1       // 공장동 ID
        /// }
        /// </remarks>
        [HttpPost]
        [Route("/SDMS/SDMS/RequestWorkerList")]
        [ProducesResponseType(typeof(ResponseWorkerList), 200)]
        public IActionResult RequestWorkerList([FromBody] RequestWorkerList data)
        {
            ResponseWorkerList result = m_processManager.SensorManager.GetWorkerList(data.CampusID);
            return Ok(result);
        }

        /// <summary>
        /// CCTV Stream Server URL 얻어오기
        /// </summary>
        [HttpPost]
        [Route("/SDMS/SDMS/RequestStreamServerURL")]
        [ProducesResponseType(typeof(string), 200)]
        public IActionResult RequestStreamServerURL()
        {
            return Ok(Startup.ConfigManager.Site.StreamServerURL);
        }

        /// <summary>
        /// 상황전파
        /// </summary>
        [HttpPost]
        [Route("/SDMS/SDMS/RequestSituationNotice")]
        [ProducesResponseType(typeof(MessageResult), 200)]
        public IActionResult RequestSituationNotice([FromBody] RequestSituationNotice request)
        {
            MessageResult res = m_processManager.AlarmManager.SituationNotice(request);
            return Ok(res);
        }

        /// <summary>
        /// 복합센서의 실제 센서정보 얻어오기
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "targetTypeID": 1,      // 찾고자 하는 센서의 Type ID
        ///     "currentTypeID": 2,     // 현재 센서의 Type ID
        ///     "sensorID": 1,          // 현재 센서의 ID
        ///     "zoneID": 1             // Zone ID
        /// }
        /// </remarks>
        [HttpPost]
        [Route("/SDMS/SDMS/RequestRealSensorData")]
        [ProducesResponseType(typeof(ResponseRealSensorData), 200)]
        public IActionResult RequestRealSensorData([FromBody] RequestRealSensorData data)
        {
            ResponseRealSensorData result = m_processManager.SensorManager.GetRealSensorData(data);
            return Ok(result);
        }
    }
}
