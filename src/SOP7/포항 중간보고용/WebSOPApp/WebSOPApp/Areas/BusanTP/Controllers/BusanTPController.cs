using BusanTP.BLL.Models.Response;
using Microsoft.AspNetCore.Mvc;
using RequestData = BusanTP.BLL.Models.Request.RequestData;

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
        
        public BusanTPController(global::SOPManager.IDAL.IDataManager sopDataManager, global::SOPSimulator.IDAL.IDataManager sopSimulatorDataManager, global::SDMS.IDAL.IDataManager sdmsDataManager, global::Common.IDAL.IDataManager commonDataManager, global::BusanTP.IDAL.IDataManager sensorServerDataManager, global::TeamEditor.IDAL.IDataManager teamDataManager)
        {
            m_processManager = new global::BusanTP.BLL.ProcessManager(sdmsDataManager, commonDataManager, sensorServerDataManager, teamDataManager, sopDataManager);
            m_sopProcessManager = new global::SOPSimulator.BLL.ProcessManager(commonDataManager, sopDataManager, teamDataManager, sopSimulatorDataManager, sdmsDataManager);
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
            else
                return BadRequest();

            return null;
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
    }
}