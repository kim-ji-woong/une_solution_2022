using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using Nipa.BLL;
using Nipa.BLL.Models.Request;
using Nipa.BLL.Models.Response;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Nipa2023.Areas.Settings.Controllers
{
    [EnableCors("UnEPolicy")]
    [Area("Settings")]
    public class SettingsController : Controller
    {
        private ProcessManager m_processManager = null;

        public SettingsController(IDataManager dataManager)
        {
            m_processManager = new ProcessManager(dataManager);
            m_processManager.SOPWebServerURL = Startup.ConfigManager.Site.SOPWebServerURL;
        }

        /// <summary>
        /// 로그인 한 사용자의 팝업창 위치 및 크기 옵션을 모두 초기화한다.
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "userID": 1                       // 누구의 데이터를 초기화할 것인가?
        /// }
        /// </remarks>
        [HttpPost]
        [Route("/Settings/Settings/RequestResetPopup")]
        [ProducesResponseType(typeof(MessageResult), 200)]
        public IActionResult RequestResetPopup([FromBody] RequestResetPopup data)
        {
            if (data == null)
                return BadRequest();

            MessageResult response = m_processManager.SettingsManager.ResetPopup(data);
            return Ok(response);
        }

        /// <summary>
        /// 전체 환경설정 옵션들을 얻어온다.
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "userID": 1,                      // 로그인한 사용자의 ID
        ///     "campusID": 1                     // 공장동 ID
        /// }
        /// </remarks>
        [HttpPost]
        [Route("/Settings/Settings/RequestOptions")]
        [ProducesResponseType(typeof(ResponseOptions), 200)]
        public IActionResult RequestOptions([FromBody] RequestOptions data)
        {
            if (data == null)
                return BadRequest();

            ResponseOptions response = m_processManager.SettingsManager.GetSettings(data);
            return Ok(response);
        }

        /// <summary>
        /// 환경설정 옵션을 갱신한다.
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "userID": 1,                        // 로그인한 사용자의 ID
        ///     "campusID": 1,                      // 공장동 ID
        ///     "option3DNormal":
        ///     {
        ///         "autoRotationIdleMinutes": 10,  // 자동회전 대기시간(분)
        ///         "useAutoRotation": true,        // 자동회전을 사용할 것인가?
        ///     },
        ///     "option3DSensor":
        ///     {
        ///         "receiveGasAlarm": true,           // 가스알람을 수신할 것인가?
        ///         "receiveAtmosphereAlarm": true,    // 대기오염 알람을 수신할 것인가?
        ///         "receiveEmergencyBellAlarm": true, // 비상벨 알람을 수신할 것인가?
        ///         "receiveThermalCameraAlarm": true, // 열화상 카메라 알람을 수신할 것인가?
        ///         "receiveWorkerAlarm": true,        // 작업자알람을 수신할 것인가?
        ///         "receiveFireAlarm": true,          // 화재알람을 수신할 것인가?
        ///         "receiveFacilityError": true,      // 불량감지를 수신할 것인가?
        ///         "moveDisplayAlarm": 3,             // 알람 발생시 화면이동 옵션(0: 이동안함, 2: 첫번째  알람 화면으로 이동, 3: 마지막 알람 화면으로 이동)
        ///     },
        ///     "optionSopNormal":
        ///     {
        ///         "useAutoMoveSOPScreen": true,   // 실행중인 컴포넌트로 자동 화면이동
        ///         "useSms": true,                 // 문자 사용여부
        ///         "workingBeginHour": 9,          // 평일주간 시간대 : 시작시간
        ///         "workingBeginMinute": 0,        // 평일주간 시간대 : 시작분
        ///         "workingEndHour": 18,           // 평일주간 시간대 : 종료시간
        ///         "workingEndMinute": 0,          // 평일주간 시간대 : 종료분
        ///         "useSopAutoClose": false,       // SOP 자동종료 사용여부
        ///         "autoCloseTime": 10,            // SOP 자동종료 대기시간
        ///         "autoCloseTimeUnit": 0,         // SOP 자동종료 대기시간(단위) : 0(초), 1(분), 2(시)
        ///         "useSopResultSummary": 0,       // SOP 결과 요약창 사용여부
        ///     }
        /// }
        /// </remarks>
        [HttpPost]
        [Route("/Settings/Settings/UpdateOptions")]
        [ProducesResponseType(typeof(MessageResult), 200)]
        public IActionResult UpdateOptions([FromBody] UpdateOptions data)
        {
            if (data == null)
                return BadRequest();

            MessageResult response = m_processManager.SettingsManager.UpdateSettings(data);
            return Ok(response);
        }

        /// <summary>
        /// 센서타입 및 공간정보와 연결된 전체 SOP 목록을 얻어온다.
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "campusID": 1                      // 공장동 ID
        /// }
        /// </remarks>
        [HttpPost]
        [Route("/Settings/Settings/RequestLinkedSOPList")]
        [ProducesResponseType(typeof(ResponseLinkedSOPList), 200)]
        public IActionResult RequestLinkedSOPList([FromBody] RequestLinkedSOPList data)
        {
            if (data == null)
                return BadRequest();

            ResponseLinkedSOPList response = m_processManager.SettingsManager.GetLinkedSOPList(data);
            return Ok(response);
        }

        /// <summary>
        /// 전체 SOP 목록을 얻어온다.
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "campusID": 1                      // 공장동 ID
        /// }
        /// </remarks>
        [HttpPost]
        [Route("/Settings/Settings/RequestSOPList")]
        [ProducesResponseType(typeof(ResponseSOPList), 200)]
        public IActionResult RequestSOPList([FromBody] RequestSOPList data)
        {
            if (data == null)
                return BadRequest();

            ResponseSOPList response = m_processManager.SettingsManager.GetSOPList(data);
            return Ok(response);
        }

        /// <summary>
        /// SOP 연결정보를 포함한 환경설정 옵션을 갱신한다.
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "updateOptions"
        ///     {
        ///          "userID": 1,                        // 로그인한 사용자의 ID
        ///          "campusID": 1,                      // 공장동 ID
        ///          "option3DNormal":
        ///          {
        ///              "autoRotationIdleMinutes": 10,  // 자동회전 대기시간(분)
        ///              "useAutoRotation": true,        // 자동회전을 사용할 것인가?
        ///          },
        ///          "option3DSensor":
        ///          {
        ///              "receiveGasAlarm": true,           // 가스알람을 수신할 것인가?
        ///              "receiveAtmosphereAlarm": true,    // 대기오염 알람을 수신할 것인가?
        ///              "receiveEmergencyBellAlarm": true, // 비상벨 알람을 수신할 것인가?
        ///              "receiveThermalCameraAlarm": true, // 열화상 카메라 알람을 수신할 것인가?
        ///              "receiveWorkerAlarm": true,        // 작업자알람을 수신할 것인가?
        ///              "receiveFireAlarm": true,          // 화재알람을 수신할 것인가?
        ///              "receiveFacilityError": true,      // 불량감지를 수신할 것인가?
        ///              "moveDisplayAlarm": 3,             // 알람 발생시 화면이동 옵션(0: 이동안함, 2: 첫번째  알람 화면으로 이동, 3: 마지막 알람 화면으로 이동)
        ///          },
        ///          "optionSopNormal":
        ///          {
        ///              "useAutoMoveSOPScreen": true,   // 실행중인 컴포넌트로 자동 화면이동
        ///              "useSms": true,                 // 문자 사용여부
        ///              "workingBeginHour": 9,          // 평일주간 시간대 : 시작시간
        ///              "workingBeginMinute": 0,        // 평일주간 시간대 : 시작분
        ///              "workingEndHour": 18,           // 평일주간 시간대 : 종료시간
        ///              "workingEndMinute": 0,          // 평일주간 시간대 : 종료분
        ///              "useSopAutoClose": false,       // SOP 자동종료 사용여부
        ///              "autoCloseTime": 10,            // SOP 자동종료 대기시간
        ///              "autoCloseTimeUnit": 0,         // SOP 자동종료 대기시간(단위) : 0(초), 1(분), 2(시)
        ///              "useSopResultSummary": 0,       // SOP 결과 요약창 사용여부
        ///          }
        ///     },
        ///     "updateLinkedSOPList":
        ///     [
        ///         "campusID": 1,                      // 공장동 ID
        ///         "facilityTypeID": 0,                // 센서타입
        ///         "disasterCategoryID": 1,            // SOP 재난분야
        ///         "subDisasterCategoryID": 1,         // SOP 재난종류
        ///         "disasterName": "화재_일반",        // SOP 이름
        ///         "linkedBuildingID": null,           // 건물 ID(linkedBuildingID와 linkedZoneID 모두 null이면 센서타입에 대하여 오직 하나의 SOP만 사용된다.)
        ///         "linkedZoneID": null                // Zone ID(linkedBuildingID와 linkedZoneID 모두 null이면 센서타입에 대하여 오직 하나의 SOP만 사용된다.)
        ///     ]
        /// }
        /// </remarks>
        [HttpPost]
        [Route("/Settings/Settings/UpdateSettings")]
        [ProducesResponseType(typeof(MessageResult), 200)]
        public IActionResult UpdateSettings([FromBody] UpdateSettings data)
        {
            if (data == null)
                return BadRequest();

            MessageResult response = m_processManager.SettingsManager.UpdateSettings(data);
            return Ok(response);
        }

        /// <summary>
        /// 알람수신과 관련된 옵션들을 얻어온다.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("/Settings/Settings/RequestAlarmOptions")]
        [ProducesResponseType(typeof(ResponseAlarmOptions), 200)]
        public IActionResult RequestAlarmOptions()
        {
            ResponseAlarmOptions result = m_processManager.SettingsManager.GetAlarmOptions();
            return Ok(result);
        }

        /// <summary>
        /// SOP 옵션 단일 저장
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <remarks>        
        /// </remarks>
        [HttpPost]
        [Route("/Settings/Settings/SaveSOPSetting")]
        [ProducesResponseType(typeof(MessageResult), 200)]
        public IActionResult SaveSOPSetting([FromBody] RequestSaveSetting data)
        {
            if (data == null)
                return BadRequest();

            MessageResult response = m_processManager.SettingsManager.SaveSOPSetting(data);
            return Ok(response);
        }
    }
}
