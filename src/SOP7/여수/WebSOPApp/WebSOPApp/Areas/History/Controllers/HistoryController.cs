using History.BLL.Models.Request;
using History.BLL.Models.Response;
using Industrial.BLL.Model.Response;
using Microsoft.AspNetCore.Mvc;
using SDMS.Model.History;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebSOPApp.Areas.History.Controllers
{
    [Area("History")]
    public class HistoryController : Controller
    {
        private global::History.BLL.ProcessManager m_processManager = null;
        public HistoryController(global::SOPManager.IDAL.IDataManager sopDataManager, global::Common.IDAL.IDataManager commonDataManager, global::TeamEditor.IDAL.IDataManager teamDataManager, global::SDMS.IDAL.IDataManager sdmsDataManager)
        {
            m_processManager = new global::History.BLL.ProcessManager(commonDataManager, sopDataManager, teamDataManager, sdmsDataManager);
        }

        [HttpPost]
        public IActionResult RequestData([FromBody] RequestData data)
        {
            if (data == null)
                return BadRequest();

            if (data.RequestUserHistories != null)
                return RequestUserHistories(data.RequestUserHistories);
            else if (data.RequestGetMinMaxIndex != null)
                return RequestGetMinMaxIndex(data.RequestGetMinMaxIndex);
            else if (data.RequestSensorDetectHistories != null)
                return RequestSensorDetectHistories(data.RequestSensorDetectHistories);
            else if (data.RequestSensorDetectAnalysis != null)
                return RequestSensorDetectAnalysis(data.RequestSensorDetectAnalysis);
            else if (data.RequestSOPHistories != null)
                return RequestSOPHistories(data.RequestSOPHistories);
            else if (data.RequestSOPHistories2 != null)
                return RequestSOPHistories2(data.RequestSOPHistories2);
            else if (data.RequestSOPComponentHistories != null)
                return RequestSOPComponentHistories(data.RequestSOPComponentHistories);
            else if (data.RequestDisasterCategories != null)
                return RequestDisasterCategories();
            else if (data.RequestUpdateAlarmMemo != null)
                return RequestUpdateAlarmMemo(data.RequestUpdateAlarmMemo);


            return null;
        }

        private IActionResult RequestUserHistories(RequestUserHistories data)
        {
            DateTime beginTime = Convert.ToDateTime(data.BeginTime);
            DateTime endTime = Convert.ToDateTime(data.EndTime);

            ResponseUserHistories result = m_processManager.GetLoadManager().DisplayUserHistory(beginTime, endTime, m_processManager.SdmsDataManager.SiteID);
            return Ok(result);
        }
        
        private IActionResult RequestSensorDetectHistories(RequestSensorDetectHistories data)
        {
            string strErrorMessage;
            DateTime beginTime = Convert.ToDateTime(data.BeginTime);
            DateTime endTime = Convert.ToDateTime(data.EndTime);

            ResponseSensorDetectHistories sensorDetectHistories = m_processManager.GetLoadManager().DisplaySensorDetectHistories(
                beginTime, endTime, data.FacilityType, data.BuildingGroupID, data.BuildingID, data.ZoneID, data.LastSensorZoneHistoryID, data.RowCount, data.IsDesc, m_processManager.SdmsDataManager.SiteID, false);

            List<SensorZoneHistory> sensorZoneHistories = m_processManager.SdmsDataManager.GetSelectManager().SelectSensorZoneHistories(null, null, out strErrorMessage);

            ResponseIndustrialSensorDetectHistories result = new ResponseIndustrialSensorDetectHistories();

            result.SensorDetectHistoryDatas = sensorDetectHistories.SensorDetectHistoryDatas;
            result.LastSensorReactionHistoryID = sensorDetectHistories.LastSensorReactionHistoryID;
            result.SensorZoneHistories = sensorZoneHistories;

            return Ok(result);
        }

        private IActionResult RequestGetMinMaxIndex(RequestGetMinMaxIndex data)
        {
            DateTime beginTime = Convert.ToDateTime(data.BeginTime);
            DateTime endTime = Convert.ToDateTime(data.EndTime);

            ResponseMinMaxIndex result = m_processManager.GetLoadManager().GetMinMaxIndex(
                beginTime, endTime, data.FacilityType, data.BuildingGroupID, data.BuildingID, data.ZoneID, false);

            return Ok(result);
        }

        private IActionResult RequestSensorDetectAnalysis(RequestSensorDetectAnalysis data)
        {
            DateTime beginTime = Convert.ToDateTime(data.BeginTime);
            DateTime endTime = Convert.ToDateTime(data.EndTime);

            ResponseSensorDetectAnalysis result = m_processManager.GetLoadManager().DisplaySensorDetectAnalysis(beginTime, endTime, data.FacilityType, data.BuildingGroupID, data.BuildingID, data.ZoneID, m_processManager.SdmsDataManager.SiteID, false);
            return Ok(result);
        }

        private IActionResult RequestSOPHistories(RequestSOPHistories data)
        {
            DateTime beginTime = Convert.ToDateTime(data.BeginTime);
            DateTime endTime = Convert.ToDateTime(data.EndTime);

            ResponseSOPHistories result = m_processManager.GetLoadManager().DisplaySOPHistories(beginTime, endTime, m_processManager.SdmsDataManager.SiteID);
            return Ok(result);
        }

        private IActionResult RequestSOPHistories2(RequestSOPHistories2 data)
        {
            int sensorZoneHistoryID = data.SensorZoneHistoryID;

            ResponseSOPHistories result = m_processManager.GetLoadManager().DisplaySOPHistories2(sensorZoneHistoryID);
            return Ok(result);
        }

        private IActionResult RequestSOPComponentHistories(RequestSOPComponentHistories data)
        {
            ResponseSOPComponentHistories result = m_processManager.GetLoadManager().DisplaySOPComponentHistories(data.ActionStepHistoryID);
            return Ok(result);
        }

        private IActionResult RequestDisasterCategories()
        {
            ResponseDisasterCategories result = m_processManager.GetLoadManager().LoadDisasterCategories(m_processManager.SdmsDataManager.SiteID);
            return Ok(result);
        }

        private IActionResult RequestUpdateAlarmMemo(RequestUpdateAlarmMemo req)
        {
            bool result = m_processManager.GetSaveManager().UpdateAlarmMemo(req);
            return Ok(result);
        }
    }
}
