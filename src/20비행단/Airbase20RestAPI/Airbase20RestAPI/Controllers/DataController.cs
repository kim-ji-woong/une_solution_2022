using Airbase20.BLL.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Airbase20RestAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class DataController : ControllerBase
    {

        private global::Airbase20.BLL.ProcessManager m_processManager = null;
        public DataController(global::Airbase20.IDAL.IDataManager dataManager)
        {
            m_processManager = new global::Airbase20.BLL.ProcessManager(dataManager);
        }

        /// <summary>
        /// 계전기 정보 불러오기
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// "ID": 0       // Relay ID
        /// </remarks>
        [HttpPost]
        [Route("/Data/RequestGetRelay")]
        [ProducesResponseType(typeof(ResponseRelay), 200)]
        public IActionResult RequestGetRelay([FromBody] RequestGetRelay req)
        {
            if (req == null)
                return BadRequest();

            ResponseRelay response = m_processManager.GetRelay(req.ID);
            return Ok(response);
        }

        /// <summary>
        /// 계전기 리스트 불러오기
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// </remarks>
        [HttpPost]
        [Route("/Data/RequestGetRelayList")]
        [ProducesResponseType(typeof(ResponseRelayList), 200)]
        public IActionResult RequestGetRelayList([FromBody] RequestGetRelayList req)
        {
            if (req == null)
                return BadRequest();

            ResponseRelayList response = m_processManager.GetRelayList();
            return Ok(response);
        }

        /// <summary>
        /// 개폐기 정보 불러오기
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// "ID": 0       // SwitchDetail ID
        /// </remarks>
        [HttpPost]
        [Route("/Data/RequestGetSwitchDetail")]
        [ProducesResponseType(typeof(ResponseSwitchDetail), 200)]
        public IActionResult RequestGetSwitchDetail([FromBody] RequestGetSwitchDetail req)
        {
            if (req == null)
                return BadRequest();

            ResponseSwitchDetail response = m_processManager.GetSwitchDetail(req.ID);
            return Ok(response);
        }


        /// <summary>
        /// 개폐기 리스트 불러오기
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// </remarks>
        [HttpPost]
        [Route("/Data/RequestGetSwitchDetailList")]
        [ProducesResponseType(typeof(ResponseSwitchDetailList), 200)]
        public IActionResult RequestGetSwitchDetailList([FromBody] RequestGetSwitchDetailList req)
        {
            if (req == null)
                return BadRequest();

            ResponseSwitchDetailList response = m_processManager.GetSwitchDetailList();
            return Ok(response);
        }


        /// <summary>
        /// 피크전력 정보 불러오기
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// "ID": 0       // PeckPower ID
        /// </remarks>
        [HttpPost]
        [Route("/Data/RequestGetPeckPower")]
        [ProducesResponseType(typeof(ResponsePeckPower), 200)]
        public IActionResult RequestGetPeckPower([FromBody] RequestGetPeckPower req)
        {
            if (req == null)
                return BadRequest();

            ResponsePeckPower response = m_processManager.GetPeckPower(req.ID);
            return Ok(response);
        }

        /// <summary>
        /// 피크전력 리스트 불러오기
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// </remarks>
        [HttpPost]
        [Route("/Data/RequestGetPeckPowerList")]
        [ProducesResponseType(typeof(ResponsePeckPowerList), 200)]
        public IActionResult RequestGetPeckPowerList([FromBody] RequestGetPeckPowerList req)
        {
            if (req == null)
                return BadRequest();

            ResponsePeckPowerList response = m_processManager.GetPeckPowerList();
            return Ok(response);
        }

        /// <summary>
        /// 알람 리스트 불러오기
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// </remarks>
        [HttpPost]
        [Route("/Data/RequestGetAlarmList")]
        [ProducesResponseType(typeof(ResponseAlarmList), 200)]
        public IActionResult RequestGetAlarmList([FromBody] RequestGetAlarmList req)
        {
            if (req == null)
                return BadRequest();

            ResponseAlarmList response = m_processManager.GetAlarmList();
            return Ok(response);
        }


        /// <summary>
        /// 전력량 불러오기
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// </remarks>
        [HttpPost]
        [Route("/Data/RequestGetPowerResult")]
        [ProducesResponseType(typeof(ResponsePowerResult), 200)]
        public IActionResult RequestGetPowerResult([FromBody] RequestGetPowerResult req)
        {
            if (req == null)
                return BadRequest();

            ResponsePowerResult response = m_processManager.GetPowerResult(req.ID);
            return Ok(response);
        }
    }
}
