using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Nipa.BLL;
using Nipa.BLL.Models.Request;
using Nipa.BLL.Models.Response;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Nipa2023.Areas.SDMS.Controllers
{
    [EnableCors("UnEPolicy")]
    [Area("SDMS")]
    public class WeatherController : Controller
    {
        private ProcessManager m_processManager = null;

        public WeatherController(IDataManager dataManager)
        {
            m_processManager = new ProcessManager(dataManager);
        }

        /// <summary>
        /// 현재날씨 얻어오기
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "siteIDs": [1, 2]      // 날씨정보를 요청하는 지역들의 ID(WeatherSite Table의 ID)
        /// }
        /// </remarks>
        [HttpPost]
        [Route("/SDMS/Weather/RequestCurrentData")]
        [ProducesResponseType(typeof(ResponseCurrentWeatherDatas), 200)]
        public IActionResult RequestCurrentData([FromBody] RequestCurrentWeatherDatas data)
        {
            if (data == null)
                return BadRequest();

            ResponseCurrentWeatherDatas response = m_processManager.WeatherManager.GetCurrentDatas(data);
            return Ok(response);
        }

        /// <summary>
        /// 주간날씨 정보 얻어오기
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("/SDMS/Weather/RequestWeeklyInfo")]
        [ProducesResponseType(typeof(ResponseWeeklyInfo), 200)]
        public IActionResult RequestWeeklyInfo()
        {
            ResponseWeeklyInfo result = m_processManager.WeatherManager.GetWeeklyInfo();
            return Ok(result);
        }
    }
}
