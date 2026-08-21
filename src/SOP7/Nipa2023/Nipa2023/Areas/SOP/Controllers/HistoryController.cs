using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using Nipa.BLL;
using Nipa.BLL.Models.Request;
using Nipa.BLL.Models.Response;
using Nipa.BLL.Models.Response.SOP;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Nipa2023.Areas.SOP.Controllers
{
    [EnableCors("UnEPolicy")]
    [Area("SOP")]
    public class HistoryController : Controller
    {
        private ProcessManager m_processManager = null;

        public HistoryController(IDataManager dataManager)
        {
            m_processManager = new ProcessManager(dataManager);
            m_processManager.SOPWebServerURL = Startup.ConfigManager.Site.SOPWebServerURL;
        }

        /// <summary>
        /// SOP 유형 목록 조회
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "campusID": 1                       // 몇 공장동의 데이터를 요청하는가?
        /// }
        /// </remarks>
        [HttpPost]
        [Route("/SOP/History/RequestSopDisasterCategoryList")]
        [ProducesResponseType(typeof(ResponseSopDisasterCategoryList), 200)]
        public IActionResult RequestSopDisasterCategoryList([FromBody] RequestSopDisasterCategoryList data)
        {
            if (data == null)
                return BadRequest();

            ResponseSopDisasterCategoryList response = m_processManager.HistoryManager.GetDisasterCategoryList(data);
            return Ok(response);
        }

        /// <summary>
        /// SOP 상세유형 목록 조회
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "campusID": 1                       // 몇 공장동의 데이터를 요청하는가?
        /// }
        /// </remarks>
        [HttpPost]
        [Route("/SOP/History/RequestSopSubDisasterCategoryList")]
        [ProducesResponseType(typeof(ResponseSopSubDisasterCategoryList), 200)]
        public IActionResult RequestSopSubDisasterCategoryList([FromBody] RequestSopSubDisasterCategoryList data)
        {
            if (data == null)
                return BadRequest();

            ResponseSopSubDisasterCategoryList response = m_processManager.HistoryManager.GetSubDisasterCategoryList(data);
            return Ok(response);
        }

        /// <summary>
        /// SOP 단계 목록 조회
        /// </summary>
        [HttpPost]
        [Route("/SOP/History/RequestStandardActionStepNameList")]
        [ProducesResponseType(typeof(ResponseSopStandardActionStepNameList), 200)]
        public IActionResult RequestStandardActionStepNameList()
        {
            ResponseSopStandardActionStepNameList response = m_processManager.HistoryManager.GetStandardActionStepNameList();
            return Ok(response);
        }

        /// <summary>
        /// SOP 실행이력 조회
        /// </summary>
        [HttpPost]
        [Route("/SOP/History/RequestSopHistories")]
        [ProducesResponseType(typeof(ResponseSOPHistories), 200)]
        public IActionResult RequestSopHistories([FromBody] RequestSOPHistories data)
        {
            ResponseSOPHistories response = m_processManager.HistoryManager.GetSopHistories(data);
            return Ok(response);
        }

        /// <summary>
        /// SOP 상세 실행이력 조회
        /// </summary>
        [HttpPost]
        [Route("/SOP/History/RequestSopComponentHistories")]
        [ProducesResponseType(typeof(ResponseSOPComponentHistories), 200)]
        public IActionResult RequestSopComponentHistories([FromBody] RequestSOPComponentHistories data)
        {
            ResponseSOPComponentHistories response = m_processManager.HistoryManager.GetSOPComponentHistories(data);
            return Ok(response);
        }
    }
}
