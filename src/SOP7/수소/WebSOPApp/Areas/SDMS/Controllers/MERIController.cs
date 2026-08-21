using Hydrogen.BLL.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebSOPApp.Areas.SDMS.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class MERIController : ControllerBase
    {
        [HttpPost]
        [Route("/MERI/RequestSimulationData")]
        [ProducesResponseType(typeof(ResponseSimulationData), 200)]
        public IActionResult RequestSimulationData([FromBody] ReqSimulationData req)
        {
            ResponseSimulationData res = Hydrogen.BLL.LoadManager.GetSimulationData(req);

            return Ok(res);
        }
    }
}
