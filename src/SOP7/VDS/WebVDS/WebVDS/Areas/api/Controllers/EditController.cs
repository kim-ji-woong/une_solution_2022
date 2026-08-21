using Microsoft.AspNetCore.Mvc;
using VDS.BLL;
using VDS.BLL.Models.Request;
using VDS.BLL.Models.Response;
using Microsoft.AspNetCore.Cors;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using System.Linq;
using System.IO;
using Microsoft.AspNetCore.Authorization;

namespace WebVDS.Areas.api.Controllers
{
    [Authorize]
    [Area("api")]
    public class EditController : ControllerBase
    {
        private ProcessManager m_processManager = null;

        public EditController(VDS.IDAL.IDataManager dataManager)
        {
            m_processManager = new ProcessManager(dataManager);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult UploadITProperty(List<IFormFile> files)
        {
            long size = files.Sum(f => f.Length);

            var filePath = Path.GetTempFileName();
            string strFileName = "";
            string strFilePath = "";
            int nFileCount = 0;
            int nDataCenterID = -1;

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
                else if (nFileCount == 2)
                {
                    int.TryParse(formFile.FileName, out nDataCenterID);
                }
            }

            int? userID = AccountController.GetLoginUserID(HttpContext);

            if (userID == null)
                return Ok(new ResponseDataCenterList(false, "로그인된 사용자가 아닙니다."));

            MessageResult response = m_processManager.ExcelManager.UploadITProperty(strFilePath, nDataCenterID, (int)userID);
            System.IO.File.Delete(strFilePath);

            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestData([FromBody] RequestData data)
        {
            if (data == null)
                return BadRequest();

            if (data.RequestRackNItemTypes != null)
                return RequestRackNItemTypes();
            else if (data.RequestUpdateEditData != null)
                return RequestUpdateEditData(data.RequestUpdateEditData);
            else if (data.RequestNewItem != null)
                return RequestNewItem(data.RequestNewItem);
            else if (data.RequestNewRack != null)
                return RequestNewRack(data.RequestNewRack);
            else if (data.RequestNewRacks != null)
                return RequestNewRacks(data.RequestNewRacks);
            else if (data.RequestNewRackGroup != null)
                return RequestNewRackGroup(data.RequestNewRackGroup);
            else if (data.RequestNewFacility != null)
                return RequestNewFacility(data.RequestNewFacility);
            else if (data.RequestNewSensor != null)
                return RequestNewSensor(data.RequestNewSensor);
            else if (data.RequestDownloadITProperty != null)
                return RequestDownloadITProperty(data.RequestDownloadITProperty);
            else if (data.RequestDownloadRack != null)
                return RequestDownloadRack(data.RequestDownloadRack);
            else if (data.RequestItemDetails != null)
                return RequestItemDetails(data.RequestItemDetails);
            else if (data.RequestSensorTypes != null)
                return RequestSensorTypes();
            else if (data.CheckValidItemName != null)
                return CheckValidItemName(data.CheckValidItemName);

            return BadRequest();
        }

        private IActionResult CheckValidItemName(CheckValidItemName data)
        {
            int? userID = AccountController.GetLoginUserID(HttpContext);

            if (userID == null)
                return Ok(new MessageResult(false, "로그인된 사용자가 아닙니다."));

            MessageResult response = m_processManager.LoadManager.CheckValidItemName(data, (int)userID);
            return Ok(response);
        }

        private IActionResult RequestNewSensor(RequestNewSensor data)
        {
            ResponseNewSensor response = m_processManager.LoadManager.CreateNewSensor(data);
            return Ok(response);
        }

        private IActionResult RequestNewFacility(RequestNewFacility data)
        {
            ResponseNewFacility response = m_processManager.LoadManager.CreateNewFacility(data);
            return Ok(response);
        }

        private IActionResult RequestDownloadRack(RequestDownloadRack data)
        {
            int? userID = AccountController.GetLoginUserID(HttpContext);

            if (userID == null)
                return Ok(new ResponseExcelInfo(false, "로그인된 사용자가 아닙니다."));

            string strFilePath = "Rack 실장도.xls";

            ResponseExcelInfo result = m_processManager.ExcelManager.DownloadRacks(data.DataCenterID, (int)userID);

            if (result.Success == false || result.Bytes == null)
                return Ok(result);

            byte[] bytes = result.Bytes;
            return File(bytes, "application/vnd.ms-excel", strFilePath);
        }

        private IActionResult RequestDownloadITProperty(RequestDownloadITProperty data)
        {
            int? userID = AccountController.GetLoginUserID(HttpContext);

            if (userID == null)
                return Ok(new ResponseExcelInfo(false, "로그인된 사용자가 아닙니다."));

            string strFilePath = "IT자산정보.xls";

            ResponseExcelInfo result = m_processManager.ExcelManager.DownloadITProperty(data.DataCenterID, (int)userID);

            if (result.Success == false || result.Bytes == null)
                return Ok(result);

            byte[] bytes = result.Bytes;
            return File(bytes, "application/vnd.ms-excel", strFilePath);
        }

        private IActionResult RequestNewRackGroup(RequestNewRackGroup data)
        {
            ResponseNewRackGroup response = m_processManager.LoadManager.CreateNewRackGroup(data);
            return Ok(response);
        }

        private IActionResult RequestNewRacks(RequestNewRacks data)
        {
            ResponseNewRacks response = m_processManager.LoadManager.CreateNewRacks(data);
            return Ok(response);
        }

        private IActionResult RequestNewRack(RequestNewRack data)
        {
            ResponseNewRack response = m_processManager.LoadManager.CreateNewRack(data);
            return Ok(response);
        }

        private IActionResult RequestNewItem(RequestNewItem data)
        {
            ResponseNewItem response = m_processManager.LoadManager.CreateNewItem(data);
            return Ok(response);
        }

        private IActionResult RequestUpdateEditData(UpdateEditData data)
        {
            int? userID = AccountController.GetLoginUserID(HttpContext);

            if (userID == null)
                return Ok(new ResponseRackNItems(false, "로그인된 사용자가 아닙니다."));

            MessageResult response = m_processManager.SaveManager.UpdateEditData(data, (int)userID);

            if (response.Success == false)
                return Ok(response);

            ResponseRackNItems response2 = m_processManager.LoadManager.GetRackNItems(data.DataCenterID, (int)userID);
            return Ok(response2);
        }

        private IActionResult RequestRackNItemTypes()
        {
            ResponseRackNItemTypes response = m_processManager.LoadManager.GetRackNItemTypes();
            return Ok(response);
        }

        private IActionResult RequestItemDetails(RequestItemDetails data)
        {
            int? userID = AccountController.GetLoginUserID(HttpContext);

            if (userID == null)
                return Ok(new ResponseDataCenterList(false, "로그인된 사용자가 아닙니다."));

            ResponseItemDetails response = m_processManager.LoadManager.GetItemDetails(data.DataCenterID, data.ItemType, (int)userID);
            return Ok(response);
        }

        private IActionResult RequestSensorTypes()
        {
            ResponseSensorTypes response = m_processManager.LoadManager.GetSensorTypes();
            return Ok(response);
        }
    }
}
