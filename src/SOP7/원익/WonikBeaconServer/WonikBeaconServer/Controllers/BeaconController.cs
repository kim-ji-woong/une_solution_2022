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
    public class BeaconController : ControllerBase
    {
        private ProcessManager m_processManager = null;
        public BeaconController(global::SDMS.IDAL.IDataManager dataManager, global::WonikBeaconServer.ProcessManager processManager)
        {
            m_processManager = processManager;
        }

        /// <summary>
        /// 구역 입실자 리스트 불러오기
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// "EquipZoneID": 0       // EquipZone ID
        /// </remarks>
        [HttpPost]
        [Route("/Beacon/RequestEquipZoneMembers")]
        [ProducesResponseType(typeof(ResponseEquipZoneMembers), 200)]
        public IActionResult RequestEquipZoneMembers([FromBody] RequestEquipZoneMembers req)
        {
            if (req == null)
                return BadRequest();

            ResponseEquipZoneMembers response = m_processManager.GetEquipZoneMembers(req.EquipZoneID);
            return Ok(response);
        }

        /// <summary>
        /// 잔류자 리스트 불러오기
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// "EquipZoneID": 0       // EquipZone ID (캠퍼스 외곽ID)
        /// </remarks>
        [HttpPost]
        [Route("/Beacon/RequestRemainerMembers")]
        [ProducesResponseType(typeof(ResponseEquipZoneMembers), 200)]
        public IActionResult RequestRemainerMembers([FromBody] RequestEquipZoneMembers req)
        {
            if (req == null)
                return BadRequest();

            ResponseEquipZoneMembers response = m_processManager.GetRemainerMembers(req.EquipZoneID);
            return Ok(response);
        }

        /// <summary>
        /// 잔류자 문자 전송
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// "PhoneNumbers": [string]       // 잔류자 연락처 리스트
        /// </remarks>
        [HttpPost]
        [Route("/Beacon/RequestRemainerSMS")]
        [ProducesResponseType(typeof(MessageResult), 200)]
        public IActionResult RequestRemainerSMS([FromBody] RequestRemainerSMS req)
        {
            if (req == null)
                return BadRequest();

            MessageResult response = m_processManager.SendRemainerSMS(req.PhoneNumbers, req.Message);
            return Ok(response);
        }        
    }
}
