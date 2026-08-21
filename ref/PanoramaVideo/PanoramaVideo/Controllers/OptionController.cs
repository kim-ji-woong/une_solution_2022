using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PanoramaVideo.Controllers
{
    public class OptionController : Controller
    {
        public IActionResult RequestData()
        {
            ResponseData response = new ResponseData();
            response.ImageType = Startup.ImageType;
            response.Folders.AddRange(Startup.Folders);

            return Ok(response);
        }
    }

    public class ResponseData
    {
        private string m_strImageType = "";
        private List<string> m_folders = new List<string>();

        public string ImageType
        {
            get { return m_strImageType; }
            set { m_strImageType = value; }
        }

        public List<string> Folders
        {
            get { return m_folders; }
            set { m_folders = value; }
        }
    }
}
