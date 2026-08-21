using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;

namespace YH_SensorServer.Controllers
{
    using Model;
    using Process;

    [Route("api/[controller]")]
    [ApiController]
    public class SensorValueController : ControllerBase
    {
        public SensorValueController()
        {
        }

        [HttpPost]
        public IActionResult Post(SensorValue data)
        {
            MessageResult result = ProcessManager.SetSensorValue(Startup.DBConfig, data);
            return Ok(result);
        }
    }
}
