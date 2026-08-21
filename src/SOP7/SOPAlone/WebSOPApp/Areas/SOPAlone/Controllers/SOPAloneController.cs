using Microsoft.AspNetCore.Mvc;
using SOPAlone.BLL.Models.Request.Sensor;
using SOPAlone.BLL.Models.Response;
using SOPAlone.BLL.Models.Response.Sensor;
using SOPAlone.BLL.Models.Response.Spatial;
using System;

namespace WebSOPApp.Areas.SOPAlone.Controllers
{
    [Area("SOPAlone")]
    public class SOPAloneController : Controller
    {
        private global::SOPAlone.BLL.ProcessManager m_processManager = null;
        //private global::SOPManager.BLL.ProcessManager m_processManager = null;
        public SOPAloneController(global::SOPAlone.IDAL.IDataManager dataManager, global::Common.IDAL.IDataManager commonDataManager, global::SOPManager.IDAL.IDataManager sopDataManager, global::TeamEditor.IDAL.IDataManager teamDataManager, global::SOPSimulator.IDAL.IDataManager sopSimulatorDataManager)
        {
            m_processManager = new global::SOPAlone.BLL.ProcessManager(dataManager, commonDataManager, sopDataManager, teamDataManager, sopSimulatorDataManager);
        }

        [HttpPost]
        public IActionResult LoadSpatial()
        {
            ResponseSpatial res = m_processManager.SpatailManager.LoadSpatail();
            return Ok(res);
        }

        [HttpPost]
        public IActionResult LoadFacilityTypes()
        {
            ResponseLoadFacilityTypes res = m_processManager.SensorManager.LoadFacilityTypes();
            return Ok(res);
        }

        [HttpPost]
        public IActionResult RunSOP([FromBody] RequestRunSOP req)
        {
            /*
            {
                "FacilityType":0,
                "BuildingGroupID":1,
                "AlarmDepth":null,
                "OccurLocation": "테스트"
            }
            */

            using (System.IO.StreamWriter sw = new System.IO.StreamWriter(System.Environment.CurrentDirectory + @"\runSOP.log", true))
            {
                System.Guid guid = System.Guid.NewGuid();
                sw.WriteLine("1- " + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss.fff") + "[" + guid.ToString() + "] facilityType:" + req.FacilityType + ", buildingGroupID:" + req.BuildingGroupID);
                
                try
                {
                    if (req == null)
                    {
                        sw.WriteLine("[ERROR req is null]" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss.fff") + "[" + guid.ToString() + "] facilityType:" + req.FacilityType + ", buildingGroupID:" + req.BuildingGroupID);
                        return BadRequest();
                    }

                    if (req.ExitPreviousSop != null && (bool)req.ExitPreviousSop)
                    {
                        MessageResult res2 = m_processManager.SensorManager.CloseAllSOP();
                        if (!res2.Success)
                            sw.WriteLine("[ERROR ExitPreviousSop]" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss.fff") + "[" + guid.ToString() + "] msg:" + res2.Message);
                    }
                    ResponseRunSOP res = m_processManager.SensorManager.RunSOP(req);
                    sw.WriteLine("2- " + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss.fff") + "[" + guid.ToString() + "] facilityType:" + req.FacilityType + ", buildingGroupID:" + req.BuildingGroupID);
                    return Ok(res);
                }
                catch (System.Exception ex)
                {
                    sw.WriteLine("[ERROR ex Exception]" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss.fff") + "[" + guid.ToString() + "] facilityType:" + req.FacilityType + ", buildingGroupID:" + req.BuildingGroupID);
                    return StatusCode(Microsoft.AspNetCore.Http.StatusCodes.Status500InternalServerError, ex.Message);                    
                }                
            }
        }

        [HttpPost]
        public IActionResult CloseSOP([FromBody] RequestCloseSOP req)
        {
            /*
            {
                "ID":0 // ActionStepHistoryID
            }
            */
            try
            {
                if (req == null)
                    return BadRequest();

                MessageResult res = m_processManager.SensorManager.CloseSOP(req);
                return Ok(res);
            }
            catch (System.Exception ex)
            {
                return StatusCode(Microsoft.AspNetCore.Http.StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost]
        public IActionResult CloseAllSOP()
        {
            try
            {
                MessageResult res = m_processManager.SensorManager.CloseAllSOP();
                return Ok(res);
            }
            catch (System.Exception ex)
            {
                return StatusCode(Microsoft.AspNetCore.Http.StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}
