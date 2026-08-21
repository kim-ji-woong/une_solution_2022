using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VDS.BLL;
using VDS.BLL.Models.Request;
using VDS.BLL.Models.Response;
using Microsoft.AspNetCore.Cors;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

namespace WebVDS.Areas.api.Controllers
{
    [Authorize]
    [Area("api")]
    public class MainController : ControllerBase
    {
        private ProcessManager m_processManager = null;

        public MainController(VDS.IDAL.IDataManager dataManager)
        {
            m_processManager = new ProcessManager(dataManager);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult UploadITPropertyDetail(List<IFormFile> files)
        {
            long size = files.Sum(f => f.Length);

            var filePath = Path.GetTempFileName();
            string strFileName = "";
            string strFilePath = "";
            int nFileCount = 0;
            int nDataCenterID = -1;
            string strItemType = "";

            foreach (var formFile in files)
            {
                nFileCount++;

                if (nFileCount == 1)
                {
                    if (formFile.Length > 0)
                    {
                        strFileName = formFile.FileName;

                        using (var stream = new FileStream(strFileName, FileMode.Create))
                        {
                            formFile.CopyTo(stream);
                            strFilePath = stream.Name;
                        }
                    }
                }
                else if (nFileCount >= 2)
                {
                    if (ParseData(formFile.FileName, out nDataCenterID, out strItemType) == false)
                    {
                        MessageResult result = new MessageResult(false, "잘못된 Parameter입니다.");
                        return Ok(result);
                    }
                }
            }

            int? userID = AccountController.GetLoginUserID(HttpContext);

            if (userID == null)
                return Ok(new MessageResult(false, "로그인된 사용자가 아닙니다."));

            MessageResult response = m_processManager.ExcelManager.UploadITPropertyDetail(strFilePath, nDataCenterID, strItemType, (int)userID);
            System.IO.File.Delete(strFilePath);

            return Ok(response);
        }

        private bool ParseData(string str, out int nDataCenterID, out string strItemType)
        {
            nDataCenterID = 0;
            strItemType = "";

            int index = str.IndexOf(',');

            if (index < 0)
                return false;

            string strCenterID = str.Substring(0, index).Trim();
            strItemType = str.Substring(index + 1).Trim();

            if (int.TryParse(strCenterID, out nDataCenterID))
                return true;

            return false;
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestData([FromBody] RequestData data)
        {
            if (data == null)
                return BadRequest();

            if (data.RequestRackNItems != null)
                return RequestRackNItems(data.RequestRackNItems);
            else if (data.RequestOption != null)
                return RequestOption(data.RequestOption);
            else if (data.RequestSaveOption != null)
                return RequestSaveOption(data.RequestSaveOption);
            else if (data.RequestRackTypeList != null)
                return RequestRackTypeList();
            else if (data.RequestItemTypeList != null)
                return RequestItemTypeList();
            else if (data.RequestFacilityTypeList != null)
                return RequestFacilityTypeList();
            else if (data.RequestSensorTypeList != null)
                return RequestSensorTypeList();
            else if (data.RequestSaveViewport != null)
                return RequestSaveViewport(data.RequestSaveViewport);
            else if (data.RequestViewport != null)
                return RequestViewport(data.RequestViewport);
            else if (data.RequestItemDetails != null)
                return RequestItemDetails(data.RequestItemDetails);
            else if (data.RequesSavetItemDetails != null)
                return RequesSavetItemDetails(data.RequesSavetItemDetails);
            else if (data.RequestEmptyItemDetails != null)
                return RequestEmptyItemDetails();
            else if (data.RequestWorkData != null)
                return RequestWorkData(data.RequestWorkData);
            else if (data.RequestCFDImages != null)
                return RequestCFDImages(data.RequestCFDImages);
            else if (data.RequestCompanyList != null)
                return RequestCompanyList();
            else if (data.RequestItem != null)
                return RequestItem(data.RequestItem);

            return BadRequest();
        }

        private IActionResult RequestItem(RequestItem data)
        {
            int? userID = AccountController.GetLoginUserID(HttpContext);

            if (userID == null)
                return Ok(new ResponseItem(false, "로그인된 사용자가 아닙니다."));

            ResponseItem response = m_processManager.LoadManager.GetItem(data, (int)userID);
            return Ok(response);
        }

        private IActionResult RequestCompanyList()
        {
            ResponseCompanyList response = m_processManager.LoadManager.GetCompanyList();
            return Ok(response);
        }

        private IActionResult RequestCFDImages(RequestCFDImages data)
        {
            int? userID = AccountController.GetLoginUserID(HttpContext);

            if (userID == null)
                return Ok(new ResponseRackNItems(false, "로그인된 사용자가 아닙니다."));

            ResponseCFDImages response = m_processManager.LoadManager.GetCFDImages(data, WebVDS.Startup.ResourceRootPath, (int)userID);
            return Ok(response);
        }

        private IActionResult RequestWorkData(RequestWorkData data)
        {
            int? userID = AccountController.GetLoginUserID(HttpContext);

            if (userID == null)
                return Ok(new ResponseRackNItems(false, "로그인된 사용자가 아닙니다."));

            ResponseWorkData response = m_processManager.LoadManager.GetWorkData(data, (int)userID);
            return Ok(response);
        }

        private IActionResult RequestEmptyItemDetails()
        {
            ResponseEmptyItemDetails response = m_processManager.LoadManager.GetEmptyItemDetails();
            return Ok(response);
        }

        private IActionResult RequestViewport(RequestViewport data)
        {
            int? userID = AccountController.GetLoginUserID(HttpContext);

            if (userID == null)
                return Ok(new ResponseRackNItems(false, "로그인된 사용자가 아닙니다."));

            ResponseViewport response = m_processManager.LoadManager.GetViewport(data.DataCenterID, (int)userID);
            return Ok(response);
        }

        private IActionResult RequestSaveViewport(RequestSaveViewport data)
        {
            int? userID = AccountController.GetLoginUserID(HttpContext);

            if (userID == null)
                return Ok(new ResponseRackNItems(false, "로그인된 사용자가 아닙니다."));

            MessageResult response = m_processManager.SaveManager.SaveViewport(data, (int)userID);
            return Ok(response);
        }

        private IActionResult RequestSensorTypeList()
        {
            ResponseSensorTypeList response = m_processManager.LoadManager.GetSensorTypeList();
            return Ok(response);
        }

        private IActionResult RequestFacilityTypeList()
        {
            ResponseFacilityTypeList response = m_processManager.LoadManager.GetFacilityTypeList();
            return Ok(response);
        }

        private IActionResult RequestItemTypeList()
        {
            ResponseItemTypeList response = m_processManager.LoadManager.GetItemTypeList();
            return Ok(response);
        }

        private IActionResult RequestRackTypeList()
        {
            ResponseRackTypeList response = m_processManager.LoadManager.GetRackTypeList();
            return Ok(response);
        }

        private IActionResult RequestRackNItems(RequestRackNItems data)
        {
            int? userID = AccountController.GetLoginUserID(HttpContext);

            if (userID == null)
                return Ok(new ResponseRackNItems(false, "로그인된 사용자가 아닙니다."));

            ResponseRackNItems response = m_processManager.LoadManager.GetRackNItems(data.DataCenterID, (int)userID);
            return Ok(response);
        }

        private IActionResult RequestOption(RequestOption data)
        {
            int? userID = AccountController.GetLoginUserID(HttpContext);

            if (userID == null)
                return Ok(new ResponseOption(false, "로그인된 사용자가 아닙니다."));

            if (data.UserID != (int)userID)
                return Ok(new ResponseOption(false, "허가되지 않은 정보에 접근하려고 시도하였습니다."));

            ResponseOption result = m_processManager.LoadManager.GetOption(data);
            return Ok(result);
        }

        private IActionResult RequestSaveOption(RequestSaveOption data)
        {
            int? userID = AccountController.GetLoginUserID(HttpContext);

            if (userID == null)
                return Ok(new ResponseOption(false, "로그인된 사용자가 아닙니다."));

            if (data.SaveOption.UserID != (int)userID)
                return Ok(new ResponseOption(false, "허가되지 않은 정보에 접근하려고 시도하였습니다."));

            ResponseOption result = m_processManager.SaveManager.SaveAccountOption(data.SaveOption);
            return Ok(result);
        }

        private IActionResult RequestItemDetails(RequestItemDetails data)
        {
            int? userID = AccountController.GetLoginUserID(HttpContext);

            if (userID == null)
                return Ok(new ResponseItemDetails(false, "로그인된 사용자가 아닙니다."));

            ResponseItemDetails response = m_processManager.LoadManager.GetItemDetails(data.DataCenterID, data.ItemType, (int)userID);
            return Ok(response);
        }

        private IActionResult RequesSavetItemDetails(RequesSavetItemDetails data)
        {
            int? userID = AccountController.GetLoginUserID(HttpContext);

            if (userID == null)
                return Ok(new ResponseItemDetails(false, "로그인된 사용자가 아닙니다."));

            MessageResult response = m_processManager.SaveManager.SavetItemDetails(data, (int)userID);
            return Ok(response);
        }
    }
}
