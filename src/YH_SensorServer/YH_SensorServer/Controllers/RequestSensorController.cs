using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace YH_SensorServer.Controllers
{
    using Model;
    using Process;

    [Route("api/[controller]")]
    [ApiController]
    public class RequestSensorController : ControllerBase
    {
        public RequestSensorController()
        {
        }

        [HttpPost]
        public IActionResult Post(RequestSensor data)
        {
            ResponseSensor result = ProcessManager.RequestSensorValues(Startup.DBConfig, data);
            return Ok(result);
        }
    }
}
