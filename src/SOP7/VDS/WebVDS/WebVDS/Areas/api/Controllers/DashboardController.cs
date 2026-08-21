using Microsoft.AspNetCore.Mvc;
using VDS.IDAL;
using VDS.BLL;
using VDS.BLL.Models.Request;
using VDS.BLL.Models.Response;
using System;
using System.Collections.Generic;
using System.Web;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Authorization;

namespace WebVDS.Areas.api.Controllers
{
    [Authorize]
    [Area("api")]
    public class DashboardController : ControllerBase
    {
        private ProcessManager m_processManager = null;

        public DashboardController(global::VDS.IDAL.IDataManager dataManager)
        {
            m_processManager = new ProcessManager(dataManager);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestData([FromBody] RequestData data)
        {
            if (data.RequestCountries != null)
                return RequestCountries();
            else if (data.RequestDataCenters != null)
                return RequestDataCenters(data.RequestDataCenters);
            else if (data.RequestSiteWorkData != null)
                return RequestSiteWorkData(data.RequestSiteWorkData);
            else if (data.RequestVdcStatistics != null)
                return RequestVdcStatistics(data.RequestVdcStatistics);

            return BadRequest();
        }

        private IActionResult RequestVdcStatistics(RequestVdcStatistics data)
        {
            ResponseVdcStatistics response = m_processManager.LoadManager.GetVdcStatistics(data);
            return Ok(response);
        }

        private IActionResult RequestSiteWorkData(RequestSiteWorkData data)
        {
            int? userID = AccountController.GetLoginUserID(HttpContext);

            if (userID == null)
                return Ok(new ResponseSiteWorkData(false, "로그인된 사용자가 아닙니다."));

            ResponseSiteWorkData response = m_processManager.LoadManager.GetSiteWorkData(data, (int)userID);
            return Ok(response);
        }

        private IActionResult RequestDataCenters(RequestUserDataCenters data)
        {
            int? userID = AccountController.GetLoginUserID(HttpContext);

            if (userID == null)
                return Ok(new ResponseAccountLevels(false, "로그인된 사용자가 아닙니다."));

            if ((int)userID != data.UserID)
                return Ok(new ResponseAccountLevels(false, "허가되지 않은 정보에 접근중입니다."));

            ResponseDataCenters response = m_processManager.LoadManager.GetDataCenters(data.UserID);
            return Ok(response);
        }

        private IActionResult RequestCountries()
        {
            ResponseCountries response = m_processManager.LoadManager.GetCountries();
            return Ok(response);
        }
    }
}
