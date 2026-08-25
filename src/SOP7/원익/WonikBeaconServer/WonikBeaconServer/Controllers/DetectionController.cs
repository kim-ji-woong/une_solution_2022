using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WonikBeaconServer.Model;

namespace WonikBeaconServer.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class DetectionController : ControllerBase
    {
        private ProcessManager m_processManager = null;
        public DetectionController(global::WonikBeaconServer.ProcessManager processManager)
        {
            m_processManager = processManager;
        }

        /// <summary>
        /// 오늘 하루 차량 과속감지 데이터
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// </remarks>
        [HttpPost]
        [Route("/Detection/RequestTodaySpeedDetections")]
        [ProducesResponseType(typeof(ResponseVehicleSpeedDetections), 200)]
        public IActionResult RequestTodaySpeedDetections()
        {
            MessageResult response = m_processManager.GetTodaySpeedDetections();
            return Ok(response);
        }

        /// <summary>
        /// 차량과속 감지 이력 조회
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// </remarks>
        [HttpPost]
        [Route("/Detection/RequestSpeedDetectionHistorys")]
        [ProducesResponseType(typeof(ResponseVehicleSpeedDetections), 200)]
        public IActionResult RequestSpeedDetectionHistorys([FromBody] RequestSpeedDetectionHistorys req)
        {
            if (req == null)
                return BadRequest();

            ResponseVehicleSpeedDetections response = m_processManager.GetSpeedDetectionHistorys(req);
            return Ok(response);
        }

        /// <summary>
        /// 과속 기준 속도 불러오기
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>
        /// "SpeedLimit": 25      // 이 값을 초과하면 과속 (25 이면 26km/h 부터)
        /// </remarks>
        [HttpPost]
        [Route("/Detection/RequestSpeedLimit")]
        [ProducesResponseType(typeof(ResponseSpeedLimit), 200)]
        public IActionResult RequestSpeedLimit()
        {
            ResponseSpeedLimit response = m_processManager.GetSpeedLimit();
            return Ok(response);
        }

        /// <summary>
        /// 차량과속 센서 리스트 불러오기
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// </remarks>
        [HttpPost]
        [Route("/Detection/RequestSpeedDetectionSensors")]
        [ProducesResponseType(typeof(ResponseSpeedDetectionSensors), 200)]
        public IActionResult RequestSpeedDetectionSensors()
        {
            ResponseSpeedDetectionSensors response = m_processManager.GetSpeedDetectionSensors();
            return Ok(response);
        }
    }
}
