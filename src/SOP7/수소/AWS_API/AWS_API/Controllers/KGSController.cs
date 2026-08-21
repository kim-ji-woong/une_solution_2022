using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AWS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KGSController : ControllerBase
    {
        private const string MODULE2_FIRE = "/module2_fire";
        private const string MODULE2_EXPLOSION = "/module2_explosion";

        private const string LANG_TYPE_EN = "en";
        private const string LANG_TYPE_KO = "ko";

        private const string VERSION_EN = "_en";

        private const string MODULE3_FIRE = "/module3_fire";
        private const string MODULE3_EXPLOSION = "/module3_explosion";

        private const string MODULE1 = "/module1";

        private const string TYPE_FIRE = "fire";


        [HttpPost]
        [Route("/KGS/RequestDamageScope")]
        [ProducesResponseType(typeof(ResponseKGSData), 200)]
        public IActionResult RequestDamageScope([FromBody] ReqDamageScope req)
        {
            string strResult = null;
            ResponseKGSData res = new ResponseKGSData();

            Logger.Instance.Write("RequestDamageScope 요청 수신");

            try
            {
                string strServerURL = Startup.ConfigManager.LinkURL.KGSServerURL;

                if (req.mode == TYPE_FIRE)
                {   // 화재
                    strServerURL += MODULE2_FIRE;
                }
                else
                {   // explosion >> 폭팔
                    strServerURL += MODULE2_EXPLOSION;
                }

                // 노드 파라미터
                strServerURL += "?node=" + req.node;
                // risk 레벨 파라미터
                if (req.risk_level.HasValue)
                    strServerURL += "&risk_level=" + req.risk_level.Value;

                strResult = WebServiceManager.SendQuery(null, null, strServerURL, out string strErrorMessage);
                if (strResult == null)
                {
                    throw new ApplicationException(strErrorMessage);
                }
                else if (strErrorMessage == WebServiceManager.SUCESS && strResult != null)
                {
                    res.kgs_data = strResult;
                }

                res.Success = true;
            }
            catch (Exception e)
            {
                Logger.Instance.Write($"RequestKGSData Exception: {e.Message}");

                res.Success = false;
                res.Message = $"RequestDamageScope Exception: {e.Message}";
            }

            return Ok(res);
        }


        [HttpPost]
        [Route("/KGS/RequestRiskData")]
        [ProducesResponseType(typeof(ResponseKGSData), 200)]
        public IActionResult RequestRiskData([FromBody] ReqRiskData req)
        {
            string strResult = null;
            ResponseKGSData res = new ResponseKGSData();

            Logger.Instance.Write("RequestRiskData 요청 수신");

            try
            {
                string strServerURL = Startup.ConfigManager.LinkURL.KGSServerURL;                

                if (req.mode == TYPE_FIRE)
                {   // 화재
                    strServerURL += MODULE3_FIRE;
                }
                else
                {   // explosion >> 폭팔
                    strServerURL += MODULE3_EXPLOSION;
                }

                if (req.language != LANG_TYPE_KO)
                {
                    strServerURL += VERSION_EN;
                }

                // 파라미터
                strServerURL += "?param=" + req.param;
                // deviation 파라미터
                strServerURL += "&deviation=" + req.deviation;
                // 노드 파라미터
                strServerURL += "&node=" + req.node;
                // risk 레벨 파라미터
                if (req.risk_level.HasValue)
                    strServerURL += "&risk_value=" + req.risk_level.Value;

                strResult = WebServiceManager.SendQuery(null, null, strServerURL, out string strErrorMessage);
                if (strResult == null)
                {
                    throw new ApplicationException(strErrorMessage);
                }
                else if (strErrorMessage == WebServiceManager.SUCESS && strResult != null)
                {
                    res.kgs_data = strResult;
                }

                res.Success = true;
            }
            catch (Exception e)
            {
                Logger.Instance.Write($"RequestKGSData Exception: {e.Message}");

                res.Success = false;
                res.Message = $"RequestRiskData Exception: {e.Message}";
            }

            return Ok(res);
        }

        [HttpPost]
        [Route("/KGS/RequestAlarm")]
        [ProducesResponseType(typeof(ResponseKGSData), 200)]
        public IActionResult RequestAlarm()
        {
            string strResult = null;
            ResponseKGSData res = new ResponseKGSData();

            Logger.Instance.Write("RequestAlarm 요청 수신");

            try
            {
                // 현재 DB를 조회하여 언어를 파악 후 언어별 조회
                string strServerURL = Startup.ConfigManager.LinkURL.KGSServerURL + MODULE1;
                strResult = WebServiceManager.SendQuery(null, null, strServerURL, out string strErrorMessage);
                if (strResult == null)
                {
                    throw new ApplicationException(strErrorMessage);
                }
                else if (strErrorMessage == WebServiceManager.SUCESS && strResult != null)
                {
                    res.kgs_data = strResult;
                }

                strServerURL += VERSION_EN;
                strResult = WebServiceManager.SendQuery(null, null, strServerURL, out strErrorMessage);
                if (strResult == null)
                {
                    throw new ApplicationException(strErrorMessage);
                }
                else if (strErrorMessage == WebServiceManager.SUCESS && strResult != null)
                {
                    res.kgs_data_en = strResult;
                }

                res.Success = true;
            }
            catch (Exception e)
            {
                Logger.Instance.Write($"RequestAlarm Exception: {e.Message}");

                res.Success = false;
                res.Message = $"RequestAlarm Exception: {e.Message}";
            }

            return Ok(res);
        }
    }
}
