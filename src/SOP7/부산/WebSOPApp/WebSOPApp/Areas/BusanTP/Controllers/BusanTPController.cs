using BusanTP.BLL.Models.Request;
using BusanTP.BLL.Models.Response;
using Microsoft.AspNetCore.Mvc;
using SOPManager.BLL.Models.Response;
using SOPSimulator.BLL;
using MessageResult = BusanTP.BLL.Models.Response.MessageResult;
using RequestData = BusanTP.BLL.Models.Request.RequestData;
using ResponseAccountUsers = BusanTP.BLL.Models.Response.ResponseAccountUsers;

namespace WebSOPApp.Areas.BusanTP.Controllers
{
    [Area("BusanTP")]
    public class BusanTPController : Controller
    {
        /*
         * TODO: Add code here
         * 외부 스키마 호출 및 데이터 처리
         */
        
        private global::BusanTP.BLL.ProcessManager m_processManager = null;
        private global::SOPSimulator.BLL.ProcessManager m_sopProcessManager = null;
        
        private SMSManager m_smsManager = null;
        
        public BusanTPController(global::SOPManager.IDAL.IDataManager sopDataManager, global::SOPSimulator.IDAL.IDataManager sopSimulatorDataManager, global::SDMS.IDAL.IDataManager sdmsDataManager, global::Common.IDAL.IDataManager commonDataManager, global::BusanTP.IDAL.IDataManager sensorServerDataManager, global::TeamEditor.IDAL.IDataManager teamDataManager)
        {
            m_processManager = new global::BusanTP.BLL.ProcessManager(sdmsDataManager, commonDataManager, sensorServerDataManager, teamDataManager, sopDataManager);
            m_sopProcessManager = new global::SOPSimulator.BLL.ProcessManager(commonDataManager, sopDataManager, teamDataManager, sopSimulatorDataManager, sdmsDataManager);

            m_smsManager = m_sopProcessManager.GetSMSManager();
        }

        [HttpPost]
        public IActionResult RequestData([FromBody] RequestData data)
        {
            if (data == null)
                return BadRequest();

            if (data.RequestAllSensors != null)
                return RequestAllSensors();
            else if (data.RequestExternalSensors != null)
                return RequestExternalSensors();
            else if (data.RequestExternalSensorTypes != null)
                return RequestExternalSensorTypes();
            else if (data.RequestExternalMaterials != null)
                return RequestExternalMaterials();
            else if (data.RequestAlarmMemo != null)
                return RequestAlarmMemo();
            else if (data.RequestBusanSdmsOptions != null)
                return RequestBusanSdmsOptions();
            else if (data.RequestResetPopup != null)
                return RequestResetPopup(data);
            else if (data.RequestUpdateUseReceives != null)
                return RequestUpdateUseReceives(data);
            else if (data.RequestExternalSensorGIS != null)
                return RequestExternalSensorGIS();
            else if (data.RequestExternalPOIInfo != null)
                return RequestExternalPOIInfo();
            else if (data.RequestViewport != null)
                return RequestViewport();
            else if (data.RequestSaveViewport != null)
                return RequestSaveViewport(data);
            else if (data.RequestUserMemos != null)
                return RequestUserMemos();
            else if (data.RequestSaveUser != null)
                return RequestSaveUser(data.RequestSaveUser);
            else if (data.RequestRemoveUser != null)
                return RemoveUser(data.RequestRemoveUser);
            else if (data.RequestAddUser != null)
                return RequestAddUser(data.RequestAddUser);
            else if (data.RequestSendPassword != null)
                return RequestSendPassword(data.RequestSendPassword);
            else if (data.RequestSensorDataHistories != null)
                return RequestSensorDataHistories(data.RequestSensorDataHistories);
            else if (data.RequestWeatherHistory != null)
                return RequestWeatherHistory(data.RequestWeatherHistory);
            else if (data.RequestAccountUsers != null)
                return RequestAccountUsers();
            else if (data.RequestTestOptions != null)
                return RequestTestOptions();
            else
                return BadRequest();
        }
        
        private IActionResult RequestTestOptions()
        {
            ResponseTestMode response = m_processManager.GetLoadManager().ReadTestOptions();
            return Ok(response);
        }
        
        private IActionResult RequestAllSensors()
        {
            ResponseAllSensors response = m_processManager.SensorManager.ReadAllSensors();
            return Ok(response);
        }
        
        private IActionResult RequestExternalSensors()
        {
            ResponseExternalSensors response = m_processManager.SensorManager.ReadExternalSensors();
            return Ok(response);
        }
        
        private IActionResult RequestExternalSensorTypes()
        {
            ResponseExternalSensorTypes response = m_processManager.SensorManager.ReadExternalSensorTypes();
            return Ok(response);
        }

        private IActionResult RequestExternalMaterials()
        {
            ResponseExternalMaterials response = m_processManager.SensorManager.ReadExternalMaterials();
            return Ok(response);
        }
        
        private IActionResult RequestAlarmMemo()
        {
            ResponseAlarmMemo response = m_processManager.SensorManager.ReadAlarmMemo();
            return Ok(response);
        }

        private IActionResult RequestBusanSdmsOptions() {
            ResponseBusanSdmsOption response = m_processManager.SensorManager.ReadBusanSdmsOptions();
            return Ok(response);
        }
        
        private IActionResult RequestResetPopup(RequestData data)
        {
            MessageResult result = m_processManager.GetOptionManager().ResetPopup(data.RequestResetPopup);
            return Ok(result);
        }
        
        private IActionResult RequestUpdateUseReceives(RequestData data)
        {
            MessageResult result = m_processManager.GetOptionManager().UpdateUseReceives(data.RequestUpdateUseReceives);
            return Ok(result);
        }
        
        private IActionResult RequestExternalSensorGIS()
        {
            ResponseExternalSensorGIS response = m_processManager.GetLoadManager().ReadExternalSensorGIS();
            return Ok(response);
        }
        
        private IActionResult RequestExternalPOIInfo()
        {
            ResponseExternalPOIInfo response = m_processManager.GetLoadManager().ReadExternalPOIInfo();
            return Ok(response);
        }
        
        private IActionResult RequestViewport()
        {
            ResponseViewport response = m_processManager.GetOptionManager().ReadViewport();
            return Ok(response);
        }

        private IActionResult RequestSaveViewport(RequestData data)
        {
            MessageResult response = m_processManager.GetOptionManager().SaveViewport(data.RequestSaveViewport);
            return Ok(response);
        }

        private IActionResult RequestUserMemos()
        {
            MessageResult response = m_processManager.GetLoadManager().ReadBusanUserMemo();
            return Ok(response);
        }

        private IActionResult RequestSaveUser(RequestSaveUser data)
        {
            MessageResult response = m_processManager.GetSaveManager().RequestSaveUser(data);
            return Ok(response);
        }
        
        private IActionResult RemoveUser(RequestRemoveUser data)
        {
            MessageResult response = m_processManager.GetSaveManager().RequestRemoveUser(data);
            return Ok(response);
        }
        
        private IActionResult RequestAddUser(RequestAddUser data)
        {
            MessageResult response = m_processManager.GetSaveManager().RequestAddUser(data);
            return Ok(response);
        }

        private IActionResult RequestSendPassword(RequestSendPassword data)
        {
            MessageResult response = m_processManager.GetSaveManager().SendNewPassword(data, m_smsManager);
            return Ok(response);
        }

        private IActionResult RequestSensorDataHistories(RequestSensorDataHistories data)
        {
            MessageResult response = m_processManager.GetSensorManager().ReadSensorDataHistories(data);
            return Ok(response);
        }

        private IActionResult RequestWeatherHistory(RequestWeatherHistory data)
        {
            MessageResult response = m_processManager.GetSensorManager().GetWeatherHistory(data);
            return Ok(response);
        }
        
        private IActionResult RequestAccountUsers()
        {
            ResponseAccountUsers response = m_processManager.GetLoadManager().GetAccountUsers();
            return Ok(response);
        }
        
        private IActionResult RequestWeatherSensorDataHistory()
        {
            ResponseWeatherSensorDataHistory response = m_processManager.GetLoadManager().ReadWeatherSensorDataHistory();
            return Ok(response);
        }
    }
}