using System.Web.Http;

namespace YH_SensorServer_Framework.Controllers
{
    using Process;
    using Models;

    public class RequestSensorController : ApiController
    {
        // POST api/values
        public IHttpActionResult Post([FromBody] RequestSensor data)
        {
            ResponseSensor result = ProcessManager.RequestSensorValues(WebApiApplication.DBConfig, data);
            return Ok(result);
        }
    }
}
