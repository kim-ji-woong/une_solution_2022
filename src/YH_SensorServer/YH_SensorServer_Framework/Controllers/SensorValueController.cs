using System.Web.Http;

namespace YH_SensorServer_Framework.Controllers
{
    using Process;
    using Models;

    public class SensorValueController : ApiController
    {
        // POST api/values
        public IHttpActionResult Post([FromBody] SensorValue data)
        {
            MessageResult result = ProcessManager.SetSensorValue(WebApiApplication.DBConfig, data);
            return Ok(result);
        }
    }
}
