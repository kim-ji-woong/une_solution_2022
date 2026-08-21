using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace YH_SensorServer.Controllers
{
    using Model;
    using Process;

    [Route("api/[controller]")]
    [ApiController]
    public class SensorConfigController : ControllerBase
    {
        public SensorConfigController()
        {
        }

        [HttpPost]
        public IActionResult Post(SensorConfig data)
        {
            MessageResult result = ProcessManager.SetSensorConfig(Startup.DBConfig, data);
            return Ok(result);
        }
    }
}
