using History.BLL.Models.Request;
using History.BLL.Models.Response;
using Microsoft.AspNetCore.Mvc;
using System;
using History.IBLL.Models.Response;
using Hynix.BLL.Request;
using Hynix.BLL.Response;

namespace WebSOPApp.Areas.History.Controllers
{
    [Area("History")]
    public class HistoryController : Controller
    {
        private global::History.BLL.ProcessManager m_processManager = null;
        private global::Hynix.BLL.ProcessManager m_hyProcessManager = null;
        public HistoryController(global::SOPManager.IDAL.IDataManager sopDataManager, global::Common.IDAL.IDataManager commonDataManager, global::TeamEditor.IDAL.IDataManager teamDataManager, global::SDMS.IDAL.IDataManager sdmsDataManager, global::Hynix.IDAL.IDataManager hyDataManager)
        {
            m_processManager = new global::History.BLL.ProcessManager(commonDataManager, sopDataManager, teamDataManager, sdmsDataManager);
            m_hyProcessManager = new global::Hynix.BLL.ProcessManager(commonDataManager, hyDataManager, sdmsDataManager, sopDataManager, teamDataManager);
        }

        [HttpPost]
        public IActionResult RequestSensorDetectHistoryQuery([FromBody] RequestSensorDetectHistoryQuery data)
        {
            ResponseSensorDetectHistories result = m_hyProcessManager.DisplaySensorDetectHistoryQuery(data.Condition, data.LastSensorZoneHistoryID, data.RowCount, data.SiteID);

            return Ok(result);
        }

        [HttpPost]
        public IActionResult RequestSensorDetectAnalysisQuery([FromBody] RequestSensorDetectAnalysisQuery data)
        {
            ResponseSensorDetectAnalysis result = m_hyProcessManager.DisplaySensorDetectAnalysisQuery(data.Condition, data.SiteID);
            return Ok(result);
        }

        [HttpPost]
        public IActionResult RequestSensorDetectCondition([FromBody] RequestSensorDetectHistories data)
        {
            DateTime beginTime = Convert.ToDateTime(data.BeginTime);
            DateTime endTime = Convert.ToDateTime(data.EndTime);

            ResponseSensorDetectCondition result = m_hyProcessManager.GetSensorDetectCondition(beginTime, endTime, data.FacilityType, data.BuildingGroupID, data.BuildingID, data.ZoneID);
            return Ok(result);
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
            else if (data.RequestSOPComponentHistories != null)
                return RequestSOPComponentHistories(data.RequestSOPComponentHistories);
            else if (data.RequestDisasterCategories != null)
                return RequestDisasterCategories(data.RequestDisasterCategories);
            else if (data.RequestUpdateAlarmMemo != null)
                return RequestUpdateAlarmMemo(data.RequestUpdateAlarmMemo);
            else if (data.RequestAssessmentHistories != null)
                return RequestAssessmentHistories(data.RequestAssessmentHistories);
            else if (data.RequestAssessmentDetail != null)
                return RequestAssessmentDetail(data.RequestAssessmentDetail);
            else if (data.RequestLoadAssessmentClass != null)
                return RequestLoadAssessmentClass(data.RequestLoadAssessmentClass);            

            return null;
        }

        private IActionResult RequestUserHistories(RequestUserHistories data)
        {
            DateTime beginTime = Convert.ToDateTime(data.BeginTime);
            DateTime endTime = Convert.ToDateTime(data.EndTime);

            ResponseUserHistories result = m_processManager.GetLoadManager().DisplayUserHistory(beginTime, endTime, data.SiteID);
            return Ok(result);
        }
        
        private IActionResult RequestSensorDetectHistories(RequestSensorDetectHistories data)
        {
            DateTime beginTime = Convert.ToDateTime(data.BeginTime);
            DateTime endTime = Convert.ToDateTime(data.EndTime);

            //ResponseSensorDetectHistories result = m_processManager.GetLoadManager().DisplaySensorDetectHistories(
            ResponseSensorDetectHistories result = m_hyProcessManager.DisplaySensorDetectHistories(
                beginTime, endTime, data.FacilityType, data.BuildingGroupID, data.BuildingID, data.ZoneID, data.LastSensorZoneHistoryID, data.RowCount, data.IsDesc, data.SiteID, data.JustOneType);

            return Ok(result);
        }

        private IActionResult RequestGetMinMaxIndex(RequestGetMinMaxIndex data)
        {
            DateTime beginTime = Convert.ToDateTime(data.BeginTime);
            DateTime endTime = Convert.ToDateTime(data.EndTime);

            ResponseMinMaxIndex result = m_processManager.GetLoadManager().GetMinMaxIndex(
                beginTime, endTime, data.FacilityType, data.BuildingGroupID, data.BuildingID, data.ZoneID, data.JustOneType);

            return Ok(result);
        }

        private IActionResult RequestSensorDetectAnalysis(RequestSensorDetectAnalysis data)
        {
            DateTime beginTime = Convert.ToDateTime(data.BeginTime);
            DateTime endTime = Convert.ToDateTime(data.EndTime);

            //ResponseSensorDetectAnalysis result = m_processManager.GetLoadManager().DisplaySensorDetectAnalysis(beginTime, endTime, data.FacilityType, data.BuildingGroupID, data.BuildingID, data.ZoneID, data.SiteID, data.JustOneType);
            ResponseSensorDetectAnalysis result = m_hyProcessManager.DisplaySensorDetectAnalysis(beginTime, endTime, data.FacilityType, data.BuildingGroupID, data.BuildingID, data.ZoneID, data.SiteID, data.JustOneType);
            return Ok(result);
        }

        private IActionResult RequestSOPHistories(RequestSOPHistories data)
        {
            DateTime beginTime = Convert.ToDateTime(data.BeginTime);
            DateTime endTime = Convert.ToDateTime(data.EndTime);

            ResponseSOPHistories result = m_processManager.GetLoadManager().DisplaySOPHistories(beginTime, endTime, data.SiteID);
            return Ok(result);
        }

        private IActionResult RequestSOPComponentHistories(RequestSOPComponentHistories data)
        {
            ResponseSOPComponentHistories result = m_processManager.GetLoadManager().DisplaySOPComponentHistories(data.ActionStepHistoryID);
            return Ok(result);
        }

        private IActionResult RequestDisasterCategories(RequestDisasterCategories data)
        {
            ResponseDisasterCategories result = m_processManager.GetLoadManager().LoadDisasterCategories(data.SiteID);
            return Ok(result);
        }

        private IActionResult RequestUpdateAlarmMemo(RequestUpdateAlarmMemo req)
        {
            bool result = m_processManager.GetSaveManager().UpdateAlarmMemo(req);
            return Ok(result);
        }

        private IActionResult RequestAssessmentHistories(RequestAssessmentHistories req)
        {
            DateTime beginTime = Convert.ToDateTime(req.BeginTime);
            DateTime endTime = Convert.ToDateTime(req.EndTime);

            ResponseAssessmentHistories result = m_processManager.GetLoadManager().DisplayAssessmentHistories(
                beginTime, endTime, req.BuildingGroupID, req.BuildingID, req.ZoneID, req.Score, req.Evaluator, req.SiteID, req.EquipZoneID);
            return Ok(result);
        }

        private IActionResult RequestAssessmentDetail(RequestAssessmentDetail req)
        {
            ResponseAssessmentDetails result = m_processManager.GetLoadManager().DisplayAssessmentDetails(req.AssessmentID, req.SiteID);
            return Ok(result);
        }

        [HttpPost]
        public IActionResult RequestLoadAssessmentClass([FromBody] RequestLoadAssessmentClass req)
        {
            if (req == null)
                return BadRequest();

            ResAssessmentClass res = m_processManager.GetLoadManager().LoadAssessmentClass(req);
            return Ok(res);
        }
    }
}
