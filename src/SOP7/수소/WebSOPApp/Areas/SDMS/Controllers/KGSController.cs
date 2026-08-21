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
    public class KGSController : ControllerBase
    {
        [HttpPost]
        [Route("/KGS/RequestDamageScope")]
        [ProducesResponseType(typeof(ResponseDamageScope), 200)]
        public IActionResult RequestDamageScope([FromBody] ReqDamageScope req)
        {
            ResponseDamageScope res = Hydrogen.BLL.LoadManager.GetDamageScope(req);

            return Ok(res);
        }

        [HttpPost]
        [Route("/KGS/RequestRisk")]
        [ProducesResponseType(typeof(ResponseRisk), 200)]
        public IActionResult RequestRisk([FromBody] ReqRisk req)
        {
            ResponseRisk res = Hydrogen.BLL.LoadManager.GetRiskData(req);

            return Ok(res);
        }
    }
}
