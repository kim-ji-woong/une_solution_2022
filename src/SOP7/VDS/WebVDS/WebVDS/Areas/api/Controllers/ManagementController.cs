using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using VDS.BLL;
using VDS.BLL.Models.Request;
using VDS.BLL.Models.Response;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Authorization;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WebVDS.Areas.api.Controllers
{
    [Authorize]
    [Area("api")]
    public class ManagementController : ControllerBase
    {
        private ProcessManager m_processManager = null;

        public ManagementController(VDS.IDAL.IDataManager dataManager)
        {
            m_processManager = new ProcessManager(dataManager);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestData([FromBody] RequestData data)
        {
            if (data != null)
            {
                if (data.RequestSiteNDataCenters != null)
                    return RequestSiteNDataCenters(data.RequestSiteNDataCenters);
                else if (data.RequestAddDataCenter != null)
                    return RequestAddDataCenter(data.RequestAddDataCenter);
                else if (data.RequestGetDataCenters != null)
                    return RequestDataCenters(data.RequestGetDataCenters);
                else if (data.RequestSiteNNation != null)
                    return RequestSiteNNation(data.RequestSiteNNation);
                else if (data.RequestUpdateDataCenter != null)
                    return RequestUpdateDataCenter(data.RequestUpdateDataCenter);
                else if (data.RequestUpdateDataCenters != null)
                    return RequestUpdateDataCenters(data.RequestUpdateDataCenters);
                else if (data.RequestGetDataCenter != null)
                    return RequestGetDataCenter(data.RequestGetDataCenter);
                /*else if (data.RequestDeleteDataCenters != null)
                    return RequestDeleteDataCenters(data.RequestDeleteDataCenters);*/
                else if (data.EditTypeData != null)
                    return RequestEditTypeData(data.EditTypeData);
                else if (data.RequestSite != null)
                    return RequestSite((int)data.RequestSite);
                else if (data.RequestSiteCompanies != null)
                    return RequestSiteCompanies(data.RequestSiteCompanies);
            }

            return BadRequest();
        }

        private IActionResult RequestSiteCompanies(RequestSiteCompanies data)
        {
            int? userID = AccountController.GetLoginUserID(HttpContext);

            if (userID == null)
                return Ok(new ResponseSiteCompanies(false, "로그인된 사용자가 아닙니다."));

            ResponseSiteCompanies response = m_processManager.LoadManager.GetSiteCompanies(data, (int)userID);
            return Ok(response);
        }

        private IActionResult RequestSite(int siteID)
        {
            int? userID = AccountController.GetLoginUserID(HttpContext);

            if (userID == null)
                return Ok(new ResponseSite(false, "로그인된 사용자가 아닙니다."));

            ResponseSite response = m_processManager.LoadManager.GetSite(siteID, (int)userID);
            return Ok(response);
        }

        private IActionResult RequestEditTypeData(EditTypeData data)
        {
            ResponseRackNItemTypes response = m_processManager.SaveManager.UpdateTypeDatas(data);
            return Ok(response);
        }

        /*private IActionResult RequestDeleteDataCenters(RequestDeleteDataCenters data)
        {
            MessageResult response = m_processManager.SaveManager.DeleteDataCenters(data.DataCenterIDs);
            return Ok(response);
        }*/

        private IActionResult RequestGetDataCenter(RequestGetDataCenter data)
        {
            int? userID = AccountController.GetLoginUserID(HttpContext);

            if (userID == null)
                return Ok(new ResponseDataCenter(false, "로그인된 사용자가 아닙니다."));

            ResponseDataCenter response = m_processManager.LoadManager.GetDataCenter(data, (int)userID);
            return Ok(response);
        }

        private IActionResult RequestSiteNNation(RequestSiteNNation data)
        {
            int? userID = AccountController.GetLoginUserID(HttpContext);

            if (userID == null)
                return Ok(new ResponseSiteNNation(false, "로그인된 사용자가 아닙니다."));

            ResponseSiteNNation response = m_processManager.LoadManager.GetSiteNNation(data, (int)userID);
            return Ok(response);
        }

        private IActionResult RequestUpdateDataCenters(RequestUpdateDataCenters data)
        {
            int? userID = AccountController.GetLoginUserID(HttpContext);

            if (userID == null)
                return Ok(new ResponseSiteNNation(false, "로그인된 사용자가 아닙니다."));

            MessageResult response = m_processManager.SaveManager.UpdateDataCenters(data, (int)userID);
            return Ok(response);
        }

        private IActionResult RequestUpdateDataCenter(RequestUpdateDataCenter data)
        {
            int? userID = AccountController.GetLoginUserID(HttpContext);

            if (userID == null)
                return Ok(new ResponseSiteNNation(false, "로그인된 사용자가 아닙니다."));

            MessageResult response = m_processManager.SaveManager.UpdateDataCenter(data, (int)userID);
            return Ok(response);
        }

        private IActionResult RequestDataCenters(RequestGetDataCenters data)
        {
            int? userID = AccountController.GetLoginUserID(HttpContext);

            if (userID == null)
                return Ok(new ResponseDataCenterList(false, "로그인된 사용자가 아닙니다."));

            if ((int)userID != data.UserID)
                return Ok(new ResponseDataCenterList(false, "허가되지 않은 정보에 접근중입니다."));

            ResponseDataCenterList response = m_processManager.LoadManager.GetDataCenterList(data);
            return Ok(response);
        }

        private IActionResult RequestAddDataCenter(RequestAddDataCenter data)
        {
            int? userID = AccountController.GetLoginUserID(HttpContext);

            if (userID == null)
                return Ok(new ResponseDataCenter(false, "로그인된 사용자가 아닙니다."));

            if (data.UserID > 0 && (int)userID != data.UserID)
                return Ok(new ResponseDataCenter(false, "허가되지 않은 정보에 접근중입니다."));

            ResponseDataCenter response = m_processManager.SaveManager.AddDataCenter(data, (int)userID);
            return Ok(response);
        }

        private IActionResult RequestSiteNDataCenters(RequestSiteNDataCenters data)
        {
            int? userID = AccountController.GetLoginUserID(HttpContext);

            if (userID == null)
                return Ok(new ResponseSiteNDataCenters(false, "로그인된 사용자가 아닙니다."));

            if ((int)userID != data.UserID)
                return Ok(new ResponseSiteNDataCenters(false, "허가되지 않은 정보에 접근중입니다."));

            ResponseSiteNDataCenters response = m_processManager.LoadManager.GetSiteDatas(data);
            return Ok(response);
        }
    }
}
