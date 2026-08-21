using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace AWS_API.Controllers
{
    [Area("KETI")]
    public class KETIController : ControllerBase
    {        

        /// <summary>
        /// 이상 탐지 데이터
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>   
        ///{
        ///    "component_id" : "PressInSensorCompressorHrs01", 
        ///    "asset_type" : "Compressor", 
        ///    "location_type" : "TTS/D1", 
        ///    "sensor_type" : "pressure", 
        ///    "unit_type" : "hPa", 
        ///    "id_ext" : "PT10260", 
        ///    "measure_id" : "PressInSensorCompressorHrs01_01_value", 
        ///    "data_anomalies" : {
        ///        "status" : "이상 데이터 감지", 
        ///        "length" : 10, 
        ///        "base_read_data_time" : "2025-07-15 00:09:28", 
        ///        "reconstruction_error_threshold" : 0.25, 
        ///        "data_list" : [
        ///            {
        ///                "read_data_time" : "2025-07-15 00:00:27",
        ///                "timestamp" : "2025-07-15 00:00:22",
        ///                "point_value_original" : 31.337,
        ///                "point_value_reconstruct" : 31.302,
        ///                "error_abs_value" : 0.035,
        ///                "is_anomaly" : false
        ///            }
        ///        ]
        ///    }, 
        ///    "data_diagnosis" : {
        ///    "status" : "이상 패턴 감지", 
        ///        "length" : 10, 
        ///        "base_read_data_time" : "2025-07-15 00:09:28", 
        ///        "pattern_type" : "급격한 증가 경향"
        ///    }
        ///}
        /// </remarks>
        [HttpPost]
        [Route("/KETI/AnomalyDetection")]
        [ProducesResponseType(typeof(MessageResult), 200)]
        public IActionResult DetectionData([FromBody] ReqAnomalyDetection req)
        {
            MessageResult res = new MessageResult();

            try
            {              
                Logger.Instance.Write("DetectionData 수신 id_ext: " + req.id_ext);

            
                if (req.component_id == null) { throw new ApplicationException("component_id 값이 존재하지 않습니다."); }
                else if (req.asset_type == null) { throw new ApplicationException("asset_type 값이 존재하지 않습니다."); }
                else if (req.location_type == null) { throw new ApplicationException("location_type 값이 존재하지 않습니다."); }
                else if (req.sensor_type == null) { throw new ApplicationException("sensor_type 값이 존재하지 않습니다."); }
                else if (req.unit_type == null) { throw new ApplicationException("unit_type 값이 존재하지 않습니다."); }
                else if (req.id_ext == null) { throw new ApplicationException("id_ext 값이 존재하지 않습니다."); }
                else if (req.measure_id == null) { throw new ApplicationException("measure_id 값이 존재하지 않습니다."); }
                //else if (req.data_anomalies.status == null) { throw new ApplicationException("data_anomalies status 값이 존재하지 않습니다."); }
                else if (req.data_anomalies.length <= 0) { throw new ApplicationException("data_anomalies length 값이 올바르지 않습니다."); }
                else if (req.data_anomalies.reconstruction_error_threshold <= 0) { throw new ApplicationException("data_anomalies reconstruction_error_threshold 값이 올바르지 않습니다."); }
                else if (req.data_anomalies.data_list == null || req.data_anomalies.data_list.Count != 10) { throw new ApplicationException("data_anomalies data_list 값이 올바르지 않습니다."); }
                //else if (req.data_diagnosis.status == null) { throw new ApplicationException("data_diagnosis status 값이 존재하지 않습니다."); } 
                else if (req.data_diagnosis.length <= 0) { throw new ApplicationException("data_diagnosis length 값이 올바르지 않습니다."); }
                //else if (req.data_diagnosis.pattern_type == null) { throw new ApplicationException("data_diagnosis pattern_type 값이 존재하지 않습니다."); }

                // BAM WSOP 서버에 데이터 전송
                string strBAMServerURL = Startup.ConfigManager.LinkURL.BAM_UNEApiServerURL;
                
                strBAMServerURL += "/KETI/ReceiveAnomalyDetection";

                string strJson = JsonSerializer.Serialize<ReqAnomalyDetection>(req);

                WebServiceManager.SendQuery_Async(null, strJson, strBAMServerURL, WebServiceManager.POST);


                string strUNEServerURL = Startup.ConfigManager.LinkURL.UNE_UNEApiServerURL;
                if (strUNEServerURL?.Length > 0)
                {
                    strUNEServerURL += "/KETI/ReceiveAnomalyDetection";

                    WebServiceManager.SendQuery_Async(null, strJson, strUNEServerURL, WebServiceManager.POST);
                }

                res.Success = true;
                res.Message = "정상적으로 데이터 수신되었습니다.";

            }
            catch (Exception e)
            {
                string strJson = JsonSerializer.Serialize<ReqAnomalyDetection>(req);

                Logger.Instance.Write($"DetectionData Exception: {e.Message}, JsonData: {strJson}");

                res.Success = false;
                res.Message = e.Message;
            }

            return Ok(res);
        }
    }
}
