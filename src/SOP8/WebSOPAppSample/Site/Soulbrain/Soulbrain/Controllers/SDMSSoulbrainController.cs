using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using SDMS.IBLL;
using SDMSSoulbrain.BLL;
using SDMS.Model.Sensor;
using Response;
using SDMS.Controller.Models.Request;
using SDMS.Controller.Models.Response;

namespace Soulbrain.Controllers
{
    public class SDMSSoulbrainController : Controller
    {
        private ProcessManager m_processManager = null;

        public SDMSSoulbrainController(IProcessManager processManager)
        {
            m_processManager = (ProcessManager)processManager;
        }

        [HttpPost]
        public IActionResult PSMSensors([FromBody] RequestData request)
        {
            string strErrorMessage;
            IEnumerable<PSM> sensors = m_processManager.SensorManager2.GetPSMSensors(request.RowCount, out strErrorMessage);

            return Ok(ResponseManager.MakeResultList(sensors, strErrorMessage));
        }

        [HttpPost]
        public IActionResult PsmLinkedSop([FromBody] Soulbrain.Models.Request.RequestLinkedSop request)
        {
            string strErrorMessage;
            string strDisasterCategoryName, strSubDisasterCategoryName, strDisasterName;

            if (m_processManager.SensorManager2.GetLinkedSOPFromPsmSensor(request.PsmSensorID, out strDisasterCategoryName, out strSubDisasterCategoryName, out strDisasterName, out strErrorMessage))
            {
                LinkedSop linkedSop = new LinkedSop();

                linkedSop.DisasterCategoryName = strDisasterCategoryName;
                linkedSop.SubDisasterCategoryName = strSubDisasterCategoryName;
                linkedSop.DisasterName = strDisasterName;

                return Ok(ResponseManager.MakeResult<LinkedSop>(linkedSop, ""));
            }

            return Ok(ResponseManager.MakeResultList<LinkedSop>(null, strErrorMessage));
        }
    }
}
