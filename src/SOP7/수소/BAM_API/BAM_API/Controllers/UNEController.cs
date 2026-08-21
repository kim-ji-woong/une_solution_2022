using BAM_API.Data;
using BAM_API.Process;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BAM_API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UNEController : ControllerBase
    {
        [HttpPost]
        [Route("/UNE/RequestAPIData")]
        [ProducesResponseType(typeof(ResponseAPIData), 200)]
        public IActionResult RequestAPIData()
        {
            ResponseAPIData res = new ResponseAPIData();

            Logger.Instance.Write("RequestAPIData 수신");

            try
            {
                string strServerURL = Startup.ConfigManager.LinkURL.BAMServerURL;
                strServerURL += "/api_corea/sensor/read02.php";

                string strResult = WebServiceManager.SendQuery(null, null, strServerURL, out string strErrorMessage);
                if (strResult == null)
                {
                    throw new ApplicationException(strErrorMessage);
                }

                res.BamData = strResult;
                res.Success = true;
            }
            catch (Exception e)
            { 
                res.Success = false;
                res.Message = e.Message;

                Logger.Instance.Write($"RequestAPIData 예외 ({e.Message})");
            }

            return Ok(res);
        }
    }
}
