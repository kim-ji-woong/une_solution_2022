using System.Web.Http;

namespace YH_SensorServer_Framework.Controllers
{
    using Process;
    using Models;

    public class SensorConfigController : ApiController
    {
        // POST api/values
        public IHttpActionResult Post([FromBody] SensorConfig data)
        {
            MessageResult result = ProcessManager.SetSensorConfig(WebApiApplication.DBConfig, data);
            return Ok(result);
        }
    }
}
