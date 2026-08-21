using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WishServer.Model;

namespace WishServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WishDataController : ControllerBase
    {
        private ProcessManager m_processManager = null;
        public WishDataController(global::WishServer.ProcessManager processManager)
        {
            m_processManager = processManager;
        }

        /// <summary>
        /// 오늘 작업현황 리스트 불러오기
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// </remarks>
        [HttpPost]
        [Route("/WishData/RequestTodayWorkList")]
        [ProducesResponseType(typeof(ResponseTodayWorkList), 200)]
        public IActionResult RequestTodayWorkList()
        {
            ResponseTodayWorkList response = m_processManager.GetTodayWorkList();
            return Ok(response);
        }
    }
}
