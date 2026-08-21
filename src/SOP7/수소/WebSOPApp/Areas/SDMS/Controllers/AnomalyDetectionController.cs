using Hydrogen.BLL.Models;
using Hydrogen.BLL.Models.Data;
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
    public class AnomalyDetectionController : ControllerBase
    {
        private global::Hydrogen.BLL.ProcessManager m_processManager = null;

        public AnomalyDetectionController(global::SDMS.IDAL.IDataManager sdmsDataManager, global::SOPManager.IDAL.IDataManager sopDataManager, global::Common.IDAL.IDataManager commonDataManager, global::Hydrogen.IDAL.IDataManager hyDataManager)
        {
            m_processManager = new global::Hydrogen.BLL.ProcessManager(sdmsDataManager, sopDataManager, commonDataManager, hyDataManager);
        }

        /// <summary>
        /// 센서 이상탐지 오늘 이력  
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// "SensorID": 0       // Sensor ID
        /// </remarks>
        [HttpPost]
        [Route("/AnomalyDetection/RequestTodaySensorAnomalyDetections")]
        [ProducesResponseType(typeof(ResponseAnomalyDetections), 200)]
        public IActionResult RequestTodaySensorAnomalyDetections([FromBody] ReqTodaySensorAnomalyDetections req)
        {
            ResponseAnomalyDetections res = m_processManager.LinkManager.GetTodaySensorAnomalyDetections(req.SensorID);
            return Ok(res);
        }



        /// <summary>
        /// 이상탐지 데이터 수신
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>        
        /// </remarks>
        [HttpPost]
        [Route("/AnomalyDetection/ReceiveAnomalyDetection")]
        [ProducesResponseType(typeof(MessageResult), 200)]
        public IActionResult ReceiveAnomalyDetection([FromBody] ReqAnomalyDetection req)
        {
            MessageResult res = m_processManager.LinkManager.ReceiveAnomalyDetection(req);
            return Ok(res);
        }
    }
}
