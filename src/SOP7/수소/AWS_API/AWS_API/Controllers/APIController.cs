using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AWS_API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class APIController : ControllerBase
    {

        public APIController()
        {
            
        }

        [HttpPost]
        [Route("/UNE/RequestAPIData")]
        [ProducesResponseType(typeof(string), 200)]
        public IActionResult RequestAPIData()
        {
            string strResult = null;

            Logger.Instance.Write("RequestAPIData 수신");

            try
            {
                string strServerURL = Startup.ConfigManager.LinkURL.BAM_UNEApiServerURL;
                strServerURL += "/UNE/RequestAPIData";

                strResult = WebServiceManager.SendQuery(null, null, strServerURL, out string strErrorMessage, WebServiceManager.POST);
                if (strResult == null)
                {
                    throw new ApplicationException(strErrorMessage);
                }

            }
            catch (Exception e)
            {
                Logger.Instance.Write($"RequestAPIData Exception: {e.Message}");

                strResult = "{\"success\": false, \"message\": \"RequestAPIData 예외 (" + e.Message + ")\"}";
            }

            return Ok(strResult);
        }
    }
}
