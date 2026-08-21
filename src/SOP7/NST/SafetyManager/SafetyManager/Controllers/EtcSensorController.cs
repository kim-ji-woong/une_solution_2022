using Microsoft.AspNetCore.Mvc;
using dnsSopID;
using System.Collections;
using SafetyServer.BLL;
using SafetyServer.BLL.Data.Response;
using dnsData.Sensor;
using System.Text.Json;

namespace SafetyManager.Controllers
{
    using Model.Request;
    

    [Route("api/[controller]")]
    [ApiController]
    public class EtcSensorController : ControllerBase
    {
        private MainManager m_mainManager = null;

        public EtcSensorController(SDMS.IDAL.IDataManager sdmsDataManager, Common.IDAL.IDataManager commonDataManager, TeamEditor.IDAL.IDataManager teamDataManager)
        {
            m_mainManager = new MainManager(sdmsDataManager, commonDataManager, teamDataManager);
        }

        [HttpPost]
        public IActionResult Post(SensorParameter param)
        {
            Logger.Instance.Write("Call EtcSensorController.Post");

            string strJson = param == null ? "NULL" : JsonSerializer.Serialize<SensorParameter>(param);
            Logger.Instance.Write(strJson);

            Parser parser = new Parser();
            ArrayList arrDatas = parser.ToArrayList(param.Values);

            Result result = m_mainManager.SensorManager.OnReceive(Facility.FacilityType.ETC, param.Header, param.ClientInfo, arrDatas);
            return Ok(result);
        }
    }
}
