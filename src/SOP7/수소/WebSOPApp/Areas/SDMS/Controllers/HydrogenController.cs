using Hydrogen.BLL.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Timers;

namespace WebSOPApp.Areas.SDMS.Controllers
{
    [Area("SDMS")]
    public class HydrogenController : Controller
    {
        private global::Hydrogen.BLL.ProcessManager m_processManager = null;

        private static Timer m_timer = null;
        private static bool m_bTimerRunning = false;     // 조회중인가 ?

        public HydrogenController(global::SDMS.IDAL.IDataManager sdmsDataManager, global::SOPManager.IDAL.IDataManager sopDataManager, global::Common.IDAL.IDataManager commonDataManager, global::Hydrogen.IDAL.IDataManager hyDataManager)
        {
            m_processManager = new global::Hydrogen.BLL.ProcessManager(sdmsDataManager, sopDataManager, commonDataManager, hyDataManager);

            InitTimer();
        }

        private void InitTimer()
        {
            if (m_timer == null)
            {
                m_timer = new Timer();
                m_timer.Interval = 1000 * 60;
                m_timer.Elapsed += new ElapsedEventHandler(timerLoadInfo_Elapsed);

                m_timer.Start();
            }
        }

        private void timerLoadInfo_Elapsed(object sender, ElapsedEventArgs e)
        {
            if (m_bTimerRunning)
                return;

            m_bTimerRunning = true;

            m_processManager.SensorManager.LoadSensorList(out string strErrorMessage);

            m_bTimerRunning = false;
            return;
        }

        [HttpPost]
        public IActionResult RequestSensorList()
        {
            ResponseSensorList res = m_processManager.SensorManager.GetSensorList();
            return Ok(res);
        }

        [HttpPost]
        public IActionResult RequestSensorCount()
        {
            ResponseSensorCount res = m_processManager.SensorManager.GetSensorCount();
            return Ok(res);
        }

        [HttpPost]
        public IActionResult RequestHydrogenEquipZoneSensorList([FromBody] ReqHydrogenEquipZoneSensorList req)
        {
            ResponseHydrogenEquipZoneSensorList res = m_processManager.SensorManager.GetHydrogenEquipZoneSensorList(req.SensorType, req.SensorID);
            return Ok(res);
        }

        [HttpPost]
        public IActionResult RequestRiskAssessInfo([FromBody] ReqRiskAssessInfo req)
        {
            ResponseRiskAssessInfo res = m_processManager.LoadManager.GetRiskAssessInfo(req);
            return Ok(res);
        }
    }
}
