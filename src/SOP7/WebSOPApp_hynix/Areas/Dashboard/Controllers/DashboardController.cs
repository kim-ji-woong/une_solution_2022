using Dashboard.BLL.Models.Request;
using Dashboard.BLL.Models.Response;
using Microsoft.AspNetCore.Mvc;
using SDMS.BLL.Models.Response;
using SDMS.BLL.Models.Response.Assessment;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebSOPApp.Areas.Dashboard.Controllers
{
    [Area("Dashboard")]
    public class DashboardController : Controller
    {
        //private global::SOPManager.BLL.ProcessManager m_processManager = null;
        private global::SDMS.BLL.ProcessManager m_sdmsProcessManager = null;
        private global::Dashboard.BLL.ProcessManager m_dashboardProcessManager = null;

        public DashboardController(global::SOPManager.IDAL.IDataManager sopDataManager, global::Common.IDAL.IDataManager commonDataManager, global::TeamEditor.IDAL.IDataManager teamDataManager, global::SDMS.IDAL.IDataManager sdmsDataManager, global::Dashboard.IDAL.IDataManager dashboardDataManager)
        {
            //m_processManager = new global::SOPManager.BLL.ProcessManager(commonDataManager, sopDataManager, teamDataManager, sdmsDataManager);
            m_sdmsProcessManager = new global::SDMS.BLL.ProcessManager(commonDataManager, sdmsDataManager, sopDataManager, teamDataManager);
            m_dashboardProcessManager = new global::Dashboard.BLL.ProcessManager(dashboardDataManager);
        }

        [HttpPost]
        public IActionResult RequestData([FromBody] RequestData data)
        {
            if (data == null)
                return BadRequest();

            if (data.RequestUseSensor != null)
                return RequestUseSensor();
            else if (data.RequestTodayStatus != null)
                return RequestTodayStatus();
            else if (data.RequestWeeklyStatus != null)
                return RequestWeeklyStatus();
            else if (data.RequestMonthStatus != null)
                return RequestMonthStatus();
            else if (data.RequestCurrentWorkPermit != null)
                return RequestCurrentWorkPermit();
            else if (data.RequestWorkPermit != null)
                return RequestWorkPermit();

            return null;
        }

        private IActionResult RequestUseSensor()
        {
            ResponseUseSensor result = m_sdmsProcessManager.GetLoadManager().GetUseSensor();
            return Ok(result);
        }

        private IActionResult RequestTodayStatus()
        {
            ResponseTodayStatus result = m_sdmsProcessManager.GetLoadManager().GetTodayStatus();
            return Ok(result);
        }

        private IActionResult RequestWeeklyStatus()
        {
            ResponseWeeklyStatus result = m_sdmsProcessManager.GetLoadManager().GetWeeklyStatus();
            return Ok(result);
        }

        private IActionResult RequestMonthStatus()
        {
            ResponseWeeklyStatus result = m_sdmsProcessManager.GetLoadManager().GetMonthStatus();
            return Ok(result);
        }

        private IActionResult RequestCurrentWorkPermit()
        {
            ResponseCurrentWorkPermit result = m_dashboardProcessManager.GetLoadManager().GetCurrentWorkPermits();
            return Ok(result);
        }

        private IActionResult RequestWorkPermit()
        {
            ResponseWorkPermit result = m_dashboardProcessManager.GetLoadManager().GetWorkPermits();
            return Ok(result);
        }

        [HttpPost]
        public IActionResult LoadSiteScores()
        {
            //ResLoadSiteScores res = m_dashboardProcessManager.GetLoadManager().LoadSiteScores();
            ResLoadSiteScoreDatas res = m_sdmsProcessManager.GetAssessmentManager().LoadSiteScores();
            return Ok(res);
        }
    }
}
