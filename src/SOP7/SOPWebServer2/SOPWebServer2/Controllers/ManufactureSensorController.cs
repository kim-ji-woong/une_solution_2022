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
    public class ManufactureSensorController : Controller
    {
        private SOPWebServer.BLL.MainManager m_mainManager = null;

        public ManufactureSensorController(SDMS.IDAL.IDataManager sdmsDataManager, Common.IDAL.IDataManager commonDataManager, TeamEditor.IDAL.IDataManager teamDataManager)
        {
            m_mainManager = SOPWebServer.BLL.MainManager.GetMainManager(sdmsDataManager, commonDataManager, teamDataManager);
        }

        [HttpPost]
        public IActionResult Post(SensorParameter param)
        {
            Parser parser = new Parser();
            ArrayList arrDatas = parser.ToArrayList(param.Values);

            Result result = m_mainManager.SensorManager.OnReceive(Facility.FacilityType.Manufacture, param.Header, param.ClientInfo, arrDatas);
            return Ok(result);
        }
    }
}
