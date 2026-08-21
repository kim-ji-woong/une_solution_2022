using Microsoft.AspNetCore.Mvc;
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
    public class HistoryController : Controller
    {
        private ProcessManager m_processManager = null;

        public HistoryController(IDataManager dataManager)
        {
            m_processManager = new ProcessManager(dataManager);
            m_processManager.SOPWebServerURL = Startup.ConfigManager.Site.SOPWebServerURL;
        }

        /// <summary>
        /// 센서 탐지이력 조회
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "beginTime": "2023-10-16 00:00:00", // 이력조회 시작시간
        ///     "endTime": "2023-10-16 18:00:00",   // 이력조회 종료시간
        ///     "facilityType": -1,                 // 조회할 센서타입(dnsData.Sensor.Facility.FacilityType). 이 값이 0보다 작으면 전체 센서타입을 조회한다.
        ///     "buildingGroupID": -1,              // 조회할 대상 건물그룹의 ID(0보다 작으면 전체 건물그룹)
        ///     "buildingID": -1,                   // 조회할 대상 건물의 ID(0보다 작으면 전체 건물)
        ///     "zoneID": -1,                       // 조회할 대상 Zone의 ID(0보다 작으면 전체 Zone)
        ///     "lastSensorZoneHistoryID": 1,       // 마지막에 조회한 SensorZoneHistoryID(이 값 이후로 검색한다. 검색 효율을 높이기 위해서다.)
        ///     "rowCount": 1,                      // 한페이지에 표시될 행의 갯수
        ///     "isDesc": true,
        ///     "campusID": 1                       // 몇 공장동의 데이터를 요청하는가?
        /// }
        /// </remarks>
        [HttpPost]
        [Route("/SDMS/History/RequestSensorDetectHistories")]
        [ProducesResponseType(typeof(ResponseSensorDetectHistories), 200)]
        public IActionResult RequestSensorDetectHistories([FromBody] RequestSensorDetectHistories data)
        {
            if (data == null)
                return BadRequest();

            ResponseSensorDetectHistories response = m_processManager.HistoryManager.DisplaySensorDetectHistories(data);
            return Ok(response);
        }

        /// <summary>
        /// 센서 탐지이력의 메모(조치사항) 업데이트
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "sensorZoneHistoryID": 1,           // 알람 고유키
        ///     "memo": "업데이트 할 내용"
        /// }
        /// </remarks>
        [HttpPost]
        [Route("/SDMS/History/UpdateSensorDetectHistoryMemo")]
        [ProducesResponseType(typeof(MessageResult), 200)]
        public IActionResult UpdateSensorDetectHistoryMemo([FromBody] UpdateSensorDetectHistoryMemo data)
        {
            if (data == null)
                return BadRequest();

            MessageResult response = m_processManager.HistoryManager.UpdateSensorDetectHistoryMemo(data);
            return Ok(response);
        }

        /// <summary>
        /// 센서 탐지분석 조회
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "beginTime": "2023-10-16 00:00:00", // 이력조회 시작시간
        ///     "endTime": "2023-10-16 18:00:00",   // 이력조회 종료시간
        ///     "facilityType": -1,                 // 조회할 센서타입(dnsData.Sensor.Facility.FacilityType). 이 값이 0보다 작으면 전체 센서타입을 조회한다.
        ///     "buildingGroupID": -1,              // 조회할 대상 건물그룹의 ID(0보다 작으면 전체 건물그룹)
        ///     "buildingID": -1,                   // 조회할 대상 건물의 ID(0보다 작으면 전체 건물)
        ///     "zoneID": -1,                       // 조회할 대상 Zone의 ID(0보다 작으면 전체 Zone)
        ///     "campusID": 1                       // 몇 공장동의 데이터를 요청하는가?
        /// }
        /// </remarks>
        [HttpPost]
        [Route("/SDMS/History/RequestSensorDetectAnalysis")]
        [ProducesResponseType(typeof(ResponseSensorDetectAnalysis), 200)]
        public IActionResult RequestSensorDetectAnalysis([FromBody] RequestSensorDetectAnalysis data)
        {
            if (data == null)
                return BadRequest();

            ResponseSensorDetectAnalysis response = m_processManager.HistoryManager.DisplaySensorDetectAnalysis(data);
            return Ok(response);
        }
    }
}
