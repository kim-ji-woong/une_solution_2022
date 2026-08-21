using BAM_API.Data;
using BAM_API.Process;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BAM_API.Controllers
{
    [Area("KETI")]
    public class KETIController : Controller
    {
        private KETIManager m_ketiManager = null;

        public KETIController(global::dnsDapperDBUtil.DataAccessLayer.IDAL.IDataManager dataManager)
        {
            m_ketiManager = new KETIManager(dataManager);
        }

        /// <summary>
        /// 이상탐지 데이터 수신
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>        
        /// </remarks>
        [HttpPost]
        [Route("/KETI/ReceiveAnomalyDetection")]
        [ProducesResponseType(typeof(MessageResult), 200)]
        public IActionResult ReceiveAnomalyDetection([FromBody] ReqAnomalyDetection req)
        {
            MessageResult res = m_ketiManager.ReceiveAnomalyDetection(req);
            return Ok(res);
        }
    }
}
