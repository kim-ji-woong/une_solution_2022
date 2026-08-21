using System;
using Microsoft.AspNetCore.Mvc;
using dnsSopID;
using System.Collections;
using SOPWebServer.BLL.Response;
using dnsData.Sensor;

namespace SOPWebServer2.Controllers
{
    using Model.Request;

    [Route("api/[controller]/[action]")]
    [ApiController]
    public class WorkerController : ControllerBase
    {
        private SOPWebServer.BLL.MainManager m_mainManager = null;

        public WorkerController(SDMS.IDAL.IDataManager sdmsDataManager, Common.IDAL.IDataManager commonDataManager, TeamEditor.IDAL.IDataManager teamDataManager, Hynix.IDAL.IDataManager hynixDataManager)
        {
            m_mainManager = SOPWebServer.BLL.MainManager.GetMainManager(sdmsDataManager, commonDataManager, teamDataManager, hynixDataManager);
        }

        [HttpPost]
        public IActionResult SendEvent([FromBody] SensorParameter param)
        {
            Parser parser = new Parser();
            ArrayList arrDatas = parser.ToArrayList(param.Values);

            if (param.Timestamp != null)
                arrDatas.Add((DateTime)param.Timestamp);

            if (arrDatas != null && arrDatas.Count > 0 && arrDatas[0] is int && param.Header != Header.CLEAR_DETECT_ALL)
            {
                int nSensorType = (int)arrDatas[0];
                Result result = m_mainManager.SensorManager.OnReceive(nSensorType, param.Header, param.ClientInfo, arrDatas);
                return Ok(result);
            }
            else if (param.Header == Header.CLEAR_DETECT_ALL) // 신호 모두 복구
            {
                Result result = m_mainManager.SensorManager.OnReceive((int)Facility.FacilityType.FIRE_SENSOR, param.Header, param.ClientInfo, arrDatas);
                return Ok(result);
            }
            else if (param.Header == Header.RELOAD_ALARMS)
            {
                // 알람정보를 초기화하고 DB로부터 다시 읽어온다.
                if (param.ClientInfo != null && param.ClientInfo == "Reload_Alarms")
                {
                    // 불필요한 parameter인데 실수로 호출 되는것을 막기 위함이다.
                    Result result = m_mainManager.ReloadAlarms();
                    return Ok(result);
                }
            }

            return Ok(false);
        }

        [HttpPost]
        public IActionResult SendTagging([FromBody] TaggingParameter param)
        {
            MessageResult result = m_mainManager.WorkerManager.SetTag(param.SensorZoneID, param.CardReaderID, param.SmartTagReaderID, param.Timestamp);
            return Ok(result);
        }

        [HttpPost]
        public IActionResult AddMovingPosition([FromBody] AddMovingPosition param)
        {
            MessageResult result = m_mainManager.WorkerManager.AddMovingPosition(param.SensorZoneHistoryID, param.Timestamp, param.Position);
            return Ok(result);
        }
    }
}
