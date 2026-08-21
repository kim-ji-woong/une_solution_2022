using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using SOPManager.BLL.Models.Request;
using SOPManager.BLL.Models.Response;
using System.Text;
using System.IO;

namespace Nipa2023.Areas.SOP.Controllers
{
    [EnableCors("UnEPolicy")]
    [Area("SOP")]
    public class SOPController : Controller
    {
        private global::SOPManager.BLL.ProcessManager m_processManager = null;
        public SOPController(global::SOPManager.IDAL.IDataManager sopDataManager, global::Common.IDAL.IDataManager commonDataManager, global::TeamEditor.IDAL.IDataManager teamDataManager, global::SDMS.IDAL.IDataManager sdmsDataManager)
        {
            m_processManager = new global::SOPManager.BLL.ProcessManager(commonDataManager, sopDataManager, teamDataManager, sdmsDataManager);
        }

        [HttpPost]
        public IActionResult OpenXML()
        {
            if (Request.Form.Files.Count > 0)
            {
                byte[] bytes = null;

                using (var fileStream = Request.Form.Files[0].OpenReadStream())
                {
                    using (var stream = new MemoryStream())
                    {
                        fileStream.CopyTo(stream);
                        bytes = stream.ToArray();
                    }
                }

                string strXML = Encoding.UTF8.GetString(bytes, 0, bytes.Length);

                ResponseOpen result = m_processManager.GetLoadManager().OpenXML(strXML);
                return Ok(result);
            }

            return BadRequest();
        }

        [HttpPost]
        public IActionResult RequestData([FromBody] RequestData data)
        {
            if (data == null)
                return BadRequest();

            if (data.RequestDisasterCategories != null)
                return RequestDisasterCategories(data.RequestDisasterCategories);
            else if (data.RequestDefault != null)
                return RequestDefault(data.RequestDefault);
            else if (data.RequestDisasterVersions != null)
                return RequestDisasterVersions(data.RequestDisasterVersions);
            else if (data.RequestSave != null)
                return RequestSave(data.RequestSave);
            else if (data.RequestOpen != null)
                return RequestOpen(data.RequestOpen);
            else if (data.RequestDelete != null)
                return RequestDelete(data.RequestDelete);
            else if (data.RequestExternalProgram != null)
                return RequestExternalProgram(data.RequestExternalProgram);
            else if (data.RequestOption != null)
                return RequestGetOption(data.RequestOption);
            else if (data.RequestSaveOption != null)
                return RequestSaveOption(data.RequestSaveOption);
            else if (data.RequestParseSpecialMessage != null)
                return RequestParseSpecialMessage(data.RequestParseSpecialMessage);
            else if (data.RequestSpecialMessageList != null && (bool)data.RequestSpecialMessageList)
                return RequestSpecialMessageList();
            else if (data.RequestLinkedSOPs != null)
                return RequestLinkedSOPs();
            else if (data.RequestLinkedSopDatas != null)
                return RequestLoadLinkedSopDatas(data.RequestLinkedSopDatas);
            else if (data.RequestSaveLinkedSOPs != null)
                return SaveLinkedSops(data.RequestSaveLinkedSOPs);
            else if (data.RequestLoadLinkedSopVersions != null)
                return RequestLoadLinkedSopVersions(data.RequestLoadLinkedSopVersions);
            else if (data.CheckSectionData != null)
                return CheckSectionData(data.CheckSectionData);

            return null;
        }

        [HttpPost]
        public IActionResult CheckSectionData(CheckSectionData data)
        {
            MessageResult result = m_processManager.GetSaveManager().CheckSectionData(data);
            return Ok(result);
        }

        [HttpPost]
        public IActionResult LoadActionStepNames()
        {
            ResponseActionStepNames res = new ResponseActionStepNames();
            res.ActionStepNames = m_processManager.GetLoadManager().InitActionStepNames();
            res.Success = true;

            return Ok(res);
        }

        private IActionResult RequestDisasterCategories(RequestDisasterCategories data)
        {
            ResponseDisasterCategories result = m_processManager.GetLoadManager().DisasterCategories(data.IsNormal, data.SiteID);
            return Ok(result);
        }

        private IActionResult RequestDefault(RequestDefault data)
        {
            if (data.RequestStepMember)
            {
                ResponseStepMemberData result = m_processManager.GetLoadManager().GetDefaultStepMemberData(data.SiteID);
                return Ok(result);
            }
            else if (data.RequestActionSteps)
            {
                ResponseActionStepDatas result = m_processManager.GetLoadManager().GetDefaultActionStepDatas();
                return Ok(result);
            }

            return BadRequest();
        }

        private IActionResult RequestDisasterVersions(RequestDisasterVersions data)
        {
            ResponseDisasterVersions result = m_processManager.GetLoadManager().GetDisasterVersions(data.DisasterID, data.IsNormal);
            return Ok(result);
        }

        private IActionResult RequestSave(RequestSave data)
        {
            if (data.Target == (int)global::SOPManager.BLL.Models.Request.RequestData.ContentsType.DB)
            {
                ResponseSave result = m_processManager.GetSaveManager().SaveDB(data.UserID, data.SOPData);
                return Ok(result);
            }
            else if (data.Target == (int)global::SOPManager.BLL.Models.Request.RequestData.ContentsType.XML)
            {
                ResponseSave result = m_processManager.GetSaveManager().SaveXML(data.SOPData);

                if (result.Success == false)
                    return Ok(result);

                return File(MakeBytes(result.XMLData), "text/xml", result.XMLFileName);
            }

            return BadRequest();
        }

        private static byte[] MakeBytes(string data)
        {
            UTF8Encoding enc = new UTF8Encoding();
            return enc.GetBytes(data);
        }

        private IActionResult RequestOpen(RequestOpen data)
        {
            if (data.Target == (int)global::SOPManager.BLL.Models.Request.RequestData.ContentsType.DB)
            {
                ResponseOpen result = m_processManager.GetLoadManager().OpenDB(data.VersionID);
                return Ok(result);
            }
            else if (data.Target == (int)global::SOPManager.BLL.Models.Request.RequestData.ContentsType.XML)
            {
                //ResponseOpen result = m_processManager.GetLoadManager().OpenXML(data.VersionID);
                //return Ok(result);
            }

            return BadRequest();
        }

        private IActionResult RequestDelete(RequestDelete data)
        {
            string strErrorMessage;
            bool success = m_processManager.GetDeleteManager().DeleteSOPVersions(data.VersionIDs, out strErrorMessage);
            return Ok(new MessageResult(success, strErrorMessage));
        }

        private IActionResult RequestExternalProgram(RequestExternalProgram data)
        {
            ResponseExternalProgram result = m_processManager.GetLoadManager().GetExternalPrograms(data.ProgramID);
            return Ok(result);
        }

        private IActionResult RequestGetOption(RequestOption data)
        {
            ResponseOption result = m_processManager.GetLoadManager().GetOption(data);
            return Ok(result);
        }

        private IActionResult RequestSaveOption(RequestSaveOption data)
        {
            ResponseOption result = m_processManager.GetSaveManager().SaveAccountOption(data.SaveOption);
            return Ok(result);
        }

        private IActionResult RequestParseSpecialMessage(RequestParseSpecialMessage data)
        {
            ResponseParseSpecialMessage result = m_processManager.GetLoadManager().ParseSpecialMessage(data);
            return Ok(result);
        }

        private IActionResult RequestSpecialMessageList()
        {
            ResponseSpecialMessageList result = m_processManager.GetLoadManager().GetSpecialMessageList();
            return Ok(result);
        }

        private IActionResult RequestLinkedSOPs()
        {
            ResponseLinkedSOPs result = m_processManager.GetLoadManager().GetLinkedSOPs();
            return Ok(result);
        }

        private IActionResult RequestLoadLinkedSopDatas(RequestLinkedSopDatas data)
        {
            ResponseLoadLinkedSopDatas result = m_processManager.GetLoadManager().LoadLinkedSopDatas(data.SiteID);
            return Ok(result);
        }

        public IActionResult SaveLinkedSops(RequestSaveLinkedSOPs req)
        {
            MessageResult res = m_processManager.GetSaveManager().SaveLinkedSOPs(req);
            return Ok(res);
        }

        private IActionResult RequestLoadLinkedSopVersions(RequestLoadLinkedSopVersions data)
        {
            ResponseLoadLinkedSopVersions result = m_processManager.GetLoadManager().LoadLinkedSopVersions(data.SiteID, data.VersionIDs);
            return Ok(result);
        }
    }
}
