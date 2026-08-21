using dnsData.Sensor;
using dnsSopID;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SOPWebServer.BLL.Response;
using SOPWebServer2.Model.Request;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SOPWebServer2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EnvironmentSensorController : Controller
    {
        private SOPWebServer.BLL.MainManager m_mainManager = null;

        public EnvironmentSensorController(SDMS.IDAL.IDataManager sdmsDataManager, Common.IDAL.IDataManager commonDataManager, TeamEditor.IDAL.IDataManager teamDataManager, Hynix.IDAL.IDataManager hynixDataManager)
        {
            m_mainManager = SOPWebServer.BLL.MainManager.GetMainManager(sdmsDataManager, commonDataManager, teamDataManager, hynixDataManager);
        }

        [HttpPost]
        public IActionResult Post(SensorParameter param)
        {
            Parser parser = new Parser();
            ArrayList arrDatas = parser.ToArrayList(param.Values);

            Result result = m_mainManager.SensorManager.OnReceive((int)Facility.FacilityType.Environment, param.Header, param.ClientInfo, arrDatas);
            return Ok(result);
        }
    }
}
