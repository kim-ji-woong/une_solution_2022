using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SOPManager.BLL.Models.Request;
using SOPManager.BLL.Models.Response;
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
        private global::SDMS.BLL.ProcessManager m_sdmsProcessManager = null;
        private global::Common.BLL.ProcessManager m_commonProcessManager = null;

        public SettingsController(global::SOPManager.IDAL.IDataManager sopDataManager, global::Common.IDAL.IDataManager commonDataManager, global::TeamEditor.IDAL.IDataManager teamDataManager, global::SDMS.IDAL.IDataManager sdmsDataManager)
        {
            //m_processManager = new global::SOPManager.BLL.ProcessManager(commonDataManager, sopDataManager, teamDataManager, sdmsDataManager);
            //m_sdmsProcessManager = new global::SDMS.BLL.ProcessManager(commonDataManager, sdmsDataManager, sopDataManager, teamDataManager);
            m_commonProcessManager = new global::Common.BLL.ProcessManager(commonDataManager, sopDataManager, teamDataManager, sdmsDataManager);
        }

        [HttpPost]
        public IActionResult RequestData([FromBody] Common.BLL.Models.Request.RequestData data)
        {
            if (data == null)
                return BadRequest();

            if (data.RequestSopCommonSettings != null)
                return RequestSopCommonSettings();
            
            return null;
        }

        private IActionResult RequestSopCommonSettings()
        {
            Common.BLL.Models.Response.ResponseCommonSettings result = m_commonProcessManager.GetOptionManager().GetSopCommonSettings();
            return Ok(result);
        }
    }
}
