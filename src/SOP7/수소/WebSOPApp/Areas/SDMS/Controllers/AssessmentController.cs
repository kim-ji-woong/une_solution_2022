using Microsoft.AspNetCore.Mvc;
using SDMS.BLL.Models.Request.Assessment;
using SDMS.BLL.Models.Response;
using SDMS.BLL.Models.Response.Assessment;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace WebSOPApp.Areas.SDMS.Controllers
{
    [Area("SDMS")]
    public class AssessmentController : Controller
    {
        private global::SDMS.BLL.ProcessManager m_processManager = null;

        public AssessmentController(global::SDMS.IDAL.IDataManager sdmsDataManager, global::Common.IDAL.IDataManager commonDataManager, global::SOPManager.IDAL.IDataManager sopDataManager, global::TeamEditor.IDAL.IDataManager teamDataManager)
        {
            m_processManager = new global::SDMS.BLL.ProcessManager(commonDataManager, sdmsDataManager, sopDataManager, teamDataManager);
            m_processManager.SOPWebServerURL = Startup.ConfigManager.Site.SOPWebServerURL;
        }

        [HttpPost]
        public IActionResult LoadQList()
        {
            ResAssessmentQList res = m_processManager.GetAssessmentManager().LoadQList();
            return Ok(res);
        }

        [HttpPost]
        public IActionResult LoadQItems([FromBody] ReqLoadQItemList req)
        {
            if (req == null)
                return BadRequest();

            ResAssessmentQItemList res = m_processManager.GetAssessmentManager().LoadQItemList(req);
            return Ok(res);
        }

        [HttpPost]
        public IActionResult DeleteQ([FromBody] ReqDeleteQ req)
        {
            if (req == null)
                return BadRequest();

            MessageResult res = m_processManager.GetAssessmentManager().DeleteQ(req);
            return Ok(res);
        }

        [HttpPost]
        public IActionResult SaveQ([FromBody] ReqSaveQ req)
        {
            if (req == null)
                return BadRequest();

            MessageSaveResult res = m_processManager.GetAssessmentManager().SaveQ(req);
            return Ok(res);
        }

        [HttpPost]
        public IActionResult SendEmail([FromBody] ReqSendAssessment req)
        {
            if (req == null)
                return BadRequest();

            MessageResult res = m_processManager.GetAssessmentManager().SendAssessment(req, string.Concat(Request.Scheme, "://", Request.Host.Value));
            return Ok(res);
        }

        [HttpPost]
        public IActionResult LoadAssessment([FromBody] ReqLoadAssessment req)
        {
            if (req == null)
                return BadRequest();

            ResLoadAssessment res = m_processManager.GetAssessmentManager().LoadAssessment(req);
            return Ok(res);
        }

        [HttpPost]
        public IActionResult SaveAssessment([FromBody] ReqSaveAssessment req)
        {
            if (req == null)
                return BadRequest();

            MessageResult res = m_processManager.GetAssessmentManager().SaveAssessment(req);
            return Ok(res);
        }

        [HttpPost]
        public IActionResult LoadScoreByZone([FromBody] ReqLoadScoreByZone req)
        {
            if (req == null)
                return BadRequest();

            ResLoadScoreByZone res = m_processManager.GetAssessmentManager().LoadScoreByZone(req);
            return Ok(res);
        }

        [HttpPost]
        public IActionResult CheckQTitle([FromBody] ReqCheckQTitle req)
        {
            if (req == null)
                return BadRequest();

            ResCheckQTitle res = m_processManager.GetAssessmentManager().CheckQTitle(req);
            return Ok(res);
        }

        [HttpPost]
        public IActionResult LoadAssessmentClass([FromBody] ReqLoadAssessmentClass req)
        {
            if (req == null)
                return BadRequest();

            ResAssessmentClass res = m_processManager.GetAssessmentManager().LoadAssessmentClass(req);
            return Ok(res);
        }

        [HttpPost]
        public IActionResult SaveAssessmentClass([FromBody] ReqSaveAssessmentClass req)
        {
            if (req == null)
                return BadRequest();

            MessageResult res = m_processManager.GetAssessmentManager().SaveAssessmentClass(req);
            return Ok(res);
        }

        [HttpPost]
        public IActionResult LoadEquipZoneQItems([FromBody] ReqLoadEqZoneQItemList req)
        {
            if (req == null)
                return BadRequest();

            ResAssessmentEqZoneQItem res = m_processManager.GetAssessmentManager().LoadEqZoneQItemList(req);
            return Ok(res);
        }

        [HttpPost]
        public IActionResult SaveQlist([FromBody] ReqSaveQList req)
        {
            if (req == null)
                return BadRequest();

            MessageResult res = m_processManager.GetAssessmentManager().SaveQlist(req);
            return Ok(res);
        }

        [HttpPost]
        public IActionResult LoadAutoAssessment([FromBody] ReqLoadAutoAssessment req)
        {
            if (req == null)
                return BadRequest();

            ResAutoAssessment res = m_processManager.GetAssessmentManager().LoadAutoAssessment(req);
            return Ok(res);
        }

        [HttpPost]
        public IActionResult SetAutoAssessment([FromBody] ReqSetAutoAssessment req)
        {
            if (req == null)
                return BadRequest();

            MessageResult res = m_processManager.GetAssessmentManager().SetAutoAssessment(req);
            return Ok(res);
        }

        [HttpPost]
        public IActionResult SetQList([FromBody] ReqSetQList req)
        {
            if (req == null)
                return BadRequest();

            MessageResult res = m_processManager.GetAssessmentManager().SetQList(req);
            return Ok(res);
        }

        [HttpPost]
        public IActionResult LoadZoneAssessmentHistories([FromBody] ReqLoadZoneAssessmentHistories req)
        {
            if (req == null)
                return BadRequest();

            DateTime beginTime = Convert.ToDateTime(req.BeginTime);
            DateTime endTime = Convert.ToDateTime(req.EndTime);

            ResZoneAssessmentHistories res = m_processManager.GetAssessmentManager().LoadZoneAssessmentHistories(beginTime, endTime, req.ZoneID, req.SiteID, req.EquipZoneID);
            return Ok(res);
        }
    }
}
