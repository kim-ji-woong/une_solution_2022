using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SOPManager.BLL.Models.Request;
using SOPManager.BLL.Models.Response;
using TeamEditor.BLL.Models.Response;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSOPApp.Areas.Settings.Controllers
{
    [Area("Settings")]
    public class SettingsController : Controller
    {
        private global::SOPManager.BLL.ProcessManager m_processManager = null;
        private global::Common.BLL.ProcessManager m_commonProcessManager = null;
        private global::TeamEditor.BLL.ProcessManager m_teamEditorManager = null;

        public SettingsController(global::SOPManager.IDAL.IDataManager sopDataManager, global::Common.IDAL.IDataManager commonDataManager, global::TeamEditor.IDAL.IDataManager teamDataManager)
        {
            m_processManager = new global::SOPManager.BLL.ProcessManager(commonDataManager, sopDataManager, teamDataManager, null);
            m_commonProcessManager = new global::Common.BLL.ProcessManager(commonDataManager, sopDataManager, teamDataManager, null);
            m_teamEditorManager = new global::TeamEditor.BLL.ProcessManager(commonDataManager, teamDataManager, sopDataManager, null);
        }

        [HttpPost]
        public IActionResult UploadRegularTeam(List<IFormFile> files)
        {
            long size = files.Sum(f => f.Length);

            var filePath = Path.GetTempFileName();
            string strFileName = "";
            string strFilePath = "";

            foreach (var formFile in files)
            {
                if (formFile.Length > 0)
                {
                    strFileName = files[0].FileName;

                    using (var stream = new FileStream(strFileName, FileMode.Create))
                    {
                        formFile.CopyTo(stream);
                        strFilePath = stream.Name;
                    }
                }
            }

            // process uploaded files
            // Don't rely on or trust the FileName property without validation.

            global::TeamEditor.BLL.Models.Response.ResponseExcelInfo result = m_teamEditorManager.GetExcelManager().UploadRegularTeam(strFilePath);
            System.IO.File.Delete(strFilePath);

            return Ok(result);
        }


        [HttpPost]
        public IActionResult RequestData([FromBody] Common.BLL.Models.Request.RequestData data)
        {
            if (data == null)
                return BadRequest();

            if (data.RequestSettings != null)
                return RequestSettings(data.RequestSettings);
            else if (data.RequestSdmsCommonSettings != null)
                return RequestSdmsCommonSettings();
            else if (data.RequestSopCommonSettings != null)
                return RequestSopCommonSettings();
            else if (data.RequestSopCommonSetting != null)
                return RequestSopCommonSetting(data.RequestSopCommonSetting);
            else if (data.RequestSaveSettings != null)
                return RequestSaveSettings(data.RequestSaveSettings);
            else if (data.RequestUpdateSettings != null)
                return RequestUpdateSettings(data.RequestUpdateSettings);
            else if (data.RequestResetPopup != null)
                return RequestResetPopup(data.RequestResetPopup);
            else if (data.RequestDownloadRegularTeam != null)
                return RequestDownloadRegularTeam();
            else if (data.RequestSetAccoutPopup != null)
                return RequestSetAccoutPopup(data.RequestSetAccoutPopup);
            else if (data.RequestResetAccoutPopup != null)
                return RequestResetAccoutPopup(data.RequestResetAccoutPopup);
            else if (data.RequestAccountSettings != null)
                return RequestAccountSettings(data.RequestAccountSettings);
            else if (data.RequestOnOffBroadcast != null)
                return RequestOnOffBroadcast(data.RequestOnOffBroadcast);

            return null;
        }

        private IActionResult RequestSettings(Common.BLL.Models.Request.RequestSettings data)
        {
            Common.BLL.Models.Response.ResponseSettings result = m_commonProcessManager.GetOptionManager().GetSettings(data);
            return Ok(result);
        }

        private IActionResult RequestSdmsCommonSettings()
        {
            Common.BLL.Models.Response.ResponseCommonSettings result = m_commonProcessManager.GetOptionManager().GetSdmsCommonSettings();
            return Ok(result);
        }
        private IActionResult RequestSopCommonSettings()
        {
            Common.BLL.Models.Response.ResponseCommonSettings result = m_commonProcessManager.GetOptionManager().GetSopCommonSettings();
            return Ok(result);
        }

        private IActionResult RequestSopCommonSetting(Common.BLL.Models.Request.RequestSopCommonSetting data)
        {
            Common.BLL.Models.Response.ResponseCommonSetting result = m_commonProcessManager.GetOptionManager().GetSopCommonSetting(data);
            return Ok(result);
        }

        private IActionResult RequestAccountSettings(Common.BLL.Models.Request.RequestAccountSettings data)
        {
            Common.BLL.Models.Response.ResponseAccountSettings result = m_commonProcessManager.GetOptionManager().GetAccountSettings(data);
            return Ok(result);
        }

        private IActionResult RequestSaveSettings(Common.BLL.Models.Request.RequestSaveSettings data)
        {
            Common.BLL.Models.Response.MessageResult result = m_commonProcessManager.GetOptionManager().SaveSettings(data);
            return Ok(result);
        }

        private IActionResult RequestUpdateSettings(Common.BLL.Models.Request.RequestUpdateSettings data)
        {
            Common.BLL.Models.Response.MessageResult result = m_commonProcessManager.GetOptionManager().UpdateSettings(data);
            return Ok(result);
        }

        private IActionResult RequestResetPopup(Common.BLL.Models.Request.RequestResetPopup data)
        {
            Common.BLL.Models.Response.MessageResult result = m_commonProcessManager.GetOptionManager().ResetPopup(data);
            return Ok(result);
        }

        private IActionResult RequestDownloadRegularTeam()
        {
            string strFilePath = "조직 정보.xls";

            global::TeamEditor.BLL.Models.Response.ResponseExcelInfo result = m_teamEditorManager.GetExcelManager().DownloadRegularTeam();
            if (result.Success == false || result.Bytes == null)
                return Ok(result);

            byte[] bytes = result.Bytes;
            return File(bytes, "application/vnd.ms-excel", strFilePath);
        }

        private IActionResult RequestSetAccoutPopup(Common.BLL.Models.Request.RequestSetAccoutPopup data)
        {
            Common.BLL.Models.Response.MessageResult result = m_commonProcessManager.GetOptionManager().SetAccoutPopup(data);
            return Ok(result);
        }

        private IActionResult RequestResetAccoutPopup(Common.BLL.Models.Request.RequestResetAccoutPopup data)
        {
            Common.BLL.Models.Response.ResponseAccountPopup result = m_commonProcessManager.GetOptionManager().ResetAccoutPopup(data);
            return Ok(result);
        }

        private IActionResult RequestOnOffBroadcast(Common.BLL.Models.Request.RequestOnOffBroadcast data)
        {
            Common.BLL.Models.Response.MessageResult result = m_commonProcessManager.GetOptionManager().OnOffBroadcast(data);
            return Ok(result);
        }

        [HttpPost]
        public IActionResult SaveSOPSetting([FromBody] Common.BLL.Models.Request.RequestSaveSetting data)
        {
            Common.BLL.Models.Response.MessageResult result = m_commonProcessManager.GetSaveManager().SaveSOPSetting(data);
            return Ok(result);
        }
    }
}
