using Microsoft.AspNetCore.Mvc;
using Industrial.BLL.Model.Request;
using Industrial.BLL.Model.Response;

namespace WebSOPApp.Areas.Industrial.Controllers
{
    [Area("Industrial")]
    public class IndustrialController : Controller
    {
        private global::Industrial.BLL.ProcessManager m_processManager = null;
        private global::SOPSimulator.BLL.ProcessManager m_sopProcessManager = null;

        public IndustrialController(global::SOPManager.IDAL.IDataManager sopDataManager, global::SOPSimulator.IDAL.IDataManager sopSimulatorDataManager, global::SDMS.IDAL.IDataManager sdmsDataManager, global::Common.IDAL.IDataManager commonDataManager, global::SensorServer.IDAL.IDataManager sensorServerDataManager, global::TeamEditor.IDAL.IDataManager teamDataManager)
        {
            m_processManager = new global::Industrial.BLL.ProcessManager(sdmsDataManager, commonDataManager, sensorServerDataManager, teamDataManager);
            m_sopProcessManager = new global::SOPSimulator.BLL.ProcessManager(commonDataManager, sopDataManager, teamDataManager, sopSimulatorDataManager, sdmsDataManager);
        }

        [HttpPost]
        public IActionResult RequestData([FromBody] RequestData data)
        {
            if (data == null)
                return BadRequest();

            if (data.RequestAllSensors != null)
                return RequestAllSensors();
            else if (data.RequestSaveViewport != null)
                return RequestSaveViewport(data.RequestSaveViewport);
            else if (data.RequestViewport != null)
                return RequestViewport();
            else if (data.RequestMaterialAlarmDatas != null)
                return RequestMaterialAlarmDatas();
            else if (data.RequestSensorDataHistory != null)
                return RequestSensorDataHistory();
            else if (data.RequestSensorDatas != null)
                return RequestSensorDatas();
            else if (data.RequestPublicData != null)
                return RequestPublicData();
            else if (data.RequestSensorLink != null)
                return ReqeustSensorLink();
            else if (data.RequestYeosuSettings != null)
                return RequestYeosuSettings();
            else if (data.RequestYeosuSaveSettings != null)
                return RequestYeosuSaveSettings(data.RequestYeosuSaveSettings);
            else if (data.RequestDownloadSensor != null)
                return RequestDownloadSensor();
            else if (data.RequestTestSMS != null)
                return RequestTestSMS(data.RequestTestSMS);
            else if (data.UpdateSensorCoordinates != null)
                return RequestUpdateSensorCoordinates(data.UpdateSensorCoordinates);
            else if (data.RequestSensorDataHistoryByConditions != null)
                return RequestSensorDataHistoryByConditions(data.RequestSensorDataHistoryByConditions);
            
            return null;
        }
        
        private IActionResult RequestSensorDataHistoryByConditions(RequestSensorDataHistoryByConditions datas)
        {
            ResponseSensorDataHistory response = m_processManager.SensorManager.ReadSensorDataHistoryByConditions(datas);
            return Ok(response);
        }

        private IActionResult RequestUpdateSensorCoordinates(UpdateSensorCoordinates datas)
        {
            MessageResult result = new MessageResult();

            if (datas.Coordinates == null)
            {
                result.Success = false;
                result.Message = "Coordinates is Null";

                return Ok(result);
            }

            result = m_processManager.SensorManager.UpdateSensorCoordinates(datas);
            return Ok(result);
        }

        private IActionResult RequestTestSMS(RequestSendSMS data)
        {
            string message = data.Message;

            bool result = m_processManager.SensorManager.SendSMS(message, m_sopProcessManager);

            return Ok(result);
        }

        private IActionResult RequestDownloadSensor()
        {
            string strFilePath = "설비 정보.xls";

            ResponseExcelInfo response = m_processManager.SensorManager.DownloadSensor();

            if (response.Success == false || response.Bytes == null)
                return Ok(response);

            byte[] bytes = response.Bytes;

            return File(bytes, "application/vnd.ms-excel", strFilePath);
        }

        private IActionResult RequestMaterialAlarmDatas()
        {
            ResponseMaterialAlarmDatas response = m_processManager.SensorManager.ReadMaterialLinks();
            return Ok(response);
        }

        private IActionResult RequestViewport()
        {
            ResponseViewport response = m_processManager.OptionManager.GetViewport();
            return Ok(response);
        }

        private IActionResult RequestSaveViewport(RequestSaveViewport data)
        {
            MessageResult response = m_processManager.OptionManager.SaveViewport(data);
            return Ok(response);
        }

        private IActionResult RequestAllSensors()
        {
            ResponseAllSensors response = m_processManager.SensorManager.ReadAllSensors();
            return Ok(response);
        }

        private IActionResult RequestSensorDataHistory()
        {
            ResponseSensorDataHistory response = m_processManager.SensorManager.ReadSensorDataHistories();
            return Ok(response);
        }

        private IActionResult RequestPublicData()
        {
            ResponsePublicData response = m_processManager.SensorManager.ResponsePublicDatas();
            return Ok(response);
        }

        private IActionResult RequestSensorDatas()
        {
            ResponseSensorDatas response = m_processManager.SensorManager.ReadSensorDatas();
            return Ok(response);
        }

        private IActionResult ReqeustSensorLink()
        {
            ResponseSensorLink response = m_processManager.SensorManager.ReadSensorLink();
            return Ok(response);
        }

        private IActionResult RequestYeosuSettings()
        {
            ResponseYeosuSettings response = m_processManager.SensorManager.ReadYeosuSettings();
            return Ok(response);
        }

        private IActionResult RequestYeosuSaveSettings(RequestYeosuSaveSettings data)
        {
            MessageResult response = m_processManager.SensorManager.SaveYeosuSettings(data);
            return Ok(response);
        }
    }
}
