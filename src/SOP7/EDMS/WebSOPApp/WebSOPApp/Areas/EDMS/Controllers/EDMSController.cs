using Microsoft.AspNetCore.Mvc;

namespace WebSOPApp.Areas.EDMS.Controllers
{
    using global::EDMS.IDAL;
    using global::EDMS.BLL;
    using global::EDMS.BLL.Request;
    using global::EDMS.BLL.Response;

    [Area("EDMS")]
    public class EDMSController : Controller
    {
        private ProcessManager m_processManager = null;

        public EDMSController(IDataManager dataManager)
        {
            m_processManager = new ProcessManager(dataManager);
        }

        [HttpPost]
        public IActionResult RequestData([FromBody] RequestData data)
        {
            if (data == null)
                return BadRequest();

            if (data.RequestFacilities != null)
                return RequestFacilities();

            return null;
        }

        private IActionResult RequestFacilities()
        {
            ResponseFacilities response = m_processManager.LoadManager.GetFacilities();
            return Ok(response);
        }
    }
}
