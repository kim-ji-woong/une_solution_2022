using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace UnEService_Core2.Controllers
{
    using Service;
    using Models;

    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        private SearchService searchService = null;

        public SearchController()
        {
            if (searchService == null)
            {
                searchService = SearchService.Instance;
            }
        }

        [HttpPost]
        [ActionName("")]
        public string[] Search([FromBody] SearchServiceModel searchInfo)
        {
            List<string> files = new List<string>();
            List<string> folders = new List<string>();
            bool res = searchService.Search(searchInfo.URL, out files, out folders);

            string[] filesListToStrArr = files.ToArray();
            string[] foldersListToStrArr = folders.ToArray();

            // Window 시스템에서 파일 및 폴더에 사용할 수 없는 문자로 구분자 설정
            string filesStrArrToStr = string.Join("|", filesListToStrArr);
            string foldersStrArrToStr = string.Join("|", foldersListToStrArr);

            return new string[] { res.ToString(), filesStrArrToStr, foldersStrArrToStr };
        }
    }
}
