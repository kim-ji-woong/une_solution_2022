using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hynix.BLL;
using Hynix.BLL.Request;
using Hynix.BLL.Response;

namespace WebSOPApp.Areas.SDMS.Controllers
{
    [EnableCors("UnEPolicy")]
    [Route("SDMS/[controller]/[action]")]
    [ApiController]
    public class HynixController : Controller
    {
        private ProcessManager m_processManager = null;

        public HynixController(global::Common.IDAL.IDataManager commonDataManager, global::Hynix.IDAL.IDataManager dataManager, global::SDMS.IDAL.IDataManager sdmsDataManager, global::SOPManager.IDAL.IDataManager sopDataManager, global::TeamEditor.IDAL.IDataManager teamDataManager)
        {
            m_processManager = new ProcessManager(commonDataManager, dataManager, sdmsDataManager, sopDataManager, teamDataManager);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequesAbnormalHistory([FromBody] RequestAbnormalHistory data)
        {
            ResponseAbnormalHistory response = m_processManager.GetAbnormalHistory(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequesWorkerInfo([FromBody] RequestWorkerInfo data)
        {
            ResponseWorkerInfo response = m_processManager.RequestWorkerInfo(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequesItemInfo([FromBody] RequestItemInfo data)
        {
            ResponseItemInfo response = m_processManager.RequestItemInfo(data);
            return Ok(response);
        }
    }
}
