using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using GGH.BLL.Models.Request;
using GGH.BLL.Models.Response;
using GGH.Model;
using SDMS.BLL.Models.Alarm;

namespace WebSOPApp.Areas.SDMS.Controllers
{
    [Area("SDMS")]
    public class GGHController : Controller
    {
        private global::GGH.BLL.ProcessManager m_processManager = null;
        private global::SDMS.BLL.ProcessManager m_sdmsProcessManager = null;
        private global::History.BLL.ProcessManager m_historyProcessManager = null;
        private global::GGH.IDAL.IDataManager m_dataManager = null;

        public GGHController(global::GGH.IDAL.IDataManager dataManager, global::SDMS.IDAL.IDataManager sdmsDataManager, global::Common.IDAL.IDataManager commonDataManager, global::SOPManager.IDAL.IDataManager sopDataManager, global::TeamEditor.IDAL.IDataManager teamDataManager)
        {
            m_processManager = new global::GGH.BLL.ProcessManager(dataManager, sdmsDataManager, commonDataManager, sopDataManager, teamDataManager);
            m_sdmsProcessManager = new global::SDMS.BLL.ProcessManager(commonDataManager, sdmsDataManager, sopDataManager, teamDataManager);
            m_historyProcessManager = new global::History.BLL.ProcessManager(commonDataManager, sopDataManager, teamDataManager, sdmsDataManager);
            m_dataManager = dataManager;
        }

        [HttpGet]
        public int WebSocketPort(long num)
        {
            int? port = Startup.ConfigManager.Site.WebSocketPort;

            if (port == null)
                return -1;

            return (int)port;
        }

        [HttpPost]
        public IActionResult RequestData([FromBody] RequestData data)
        {
            if (data == null)
                return BadRequest();

            if (data.RequestNvrList != null)
                return RequestNvrList();
            else if (data.RequestUpdateNvrList != null)
                return UpdateNvrList(data.RequestUpdateNvrList);
            else if (data.RequestEvacuations != null)
                return RequestEvacuations();
            else if (data.RequestAlarmNEvacuations != null)
                return RequestAlarmNEvacuations();
            else if (data.RequestCCTVList != null)
                return RequestCCTVList(data.RequestCCTVList);
            else if (data.UpdateCCTVList != null)
                return UpdateCCTVList(data.UpdateCCTVList);
            else if (data.RequestParkingGateList != null)
                return RequestParkingGateList(data.RequestParkingGateList);
            else if (data.RequestDoorStatus != null)
                return RequestDoorStatus(data.RequestDoorStatus);
            else if (data.RequestExitList != null)
                return RequestExitList(data.RequestExitList);
            else if (data.RequestAllDoors != null)
                return RequestAllDoors(data.RequestAllDoors);
            else if (data.RequestUPSStatus != null)
                return RequestUPSStatus(data.RequestUPSStatus);
            else if (data.UpdateSensorEnabled != null)
                return UpdateSensorEnabled(data.UpdateSensorEnabled);
            else if (data.RequestUpdatePOIPositions != null)
                return RequestUpdatePOIPositions(data.RequestUpdatePOIPositions);
            else if (data.RequestUpdatePOIPosition != null)
                return RequestUpdatePOIPosition(data.RequestUpdatePOIPosition);
            else if (data.RequestCCTVList2 != null)
                return RequestCCTVList2(data.RequestCCTVList2);
            else if (data.RequestEarthquakeHistory != null)
                return RequestEarthquakeHistory(data.RequestEarthquakeHistory);
            else if (data.RequestLastEarthquake != null)
                return RequestLastEarthquake();
            else if (data.RequestFirstAidEquipmentList != null)
                return RequestFirstAidEquipmentList(data.RequestFirstAidEquipmentList);
            else if (data.RequestNewFirstAidEquipment != null)
                return RequestNewFirstAidEquipment(data.RequestNewFirstAidEquipment);
            else if (data.RequestDeleteSensors != null)
                return RequestDeleteSensors(data.RequestDeleteSensors);
            else if (data.RequestAlarmReport != null)
                return RequestAlarmReport(data.RequestAlarmReport);
            else if (data.RequestSopReport != null)
                return RequestSopReport(data.RequestSopReport);
            else if (data.RequestSaveSettings != null)
                return RequestSaveSettings(data.RequestSaveSettings);
            else if (data.RequestUseParkingUplock != null)
                return RequestUseParkingUplock();
            else if (data.UpdateParkingUplock != null)
                return UpdateParkingUplock(data.UpdateParkingUplock);

            return null;
        }

        private IActionResult UpdateParkingUplock(UpdateParkingUplock data)
        {
            MessageResult response = m_processManager.ParkingManager.UpdateParkingUplock(data);
            return Ok(response);
        }

        private IActionResult RequestUseParkingUplock()
        {
            ResponseParkingUplock response = m_processManager.ParkingManager.GetParkingUplockOption();
            return Ok(response);
        }

        private IActionResult RequestSaveSettings(Common.BLL.Models.Request.RequestSaveSettings data)
        {
            var response = m_processManager.OptionManager.SaveSettings(data);
            return Ok(response);
        }

       private IActionResult RequestSopReport(RequestSopReport data)
       {
            ResponseWordInfo response = m_processManager.ReportManager.GetSopReport(data, m_historyProcessManager);

            if (response.Success == false || response.Bytes == null)
                return Ok(response);

            return File(response.Bytes, "application/vnd.openxmlformats-officedocument.wordprocessingml.document", response.FileName);
        }

        private IActionResult RequestAlarmReport(RequestAlarmReport data)
        {
            ResponseWordInfo response = m_processManager.ReportManager.GetAlarmReport(data, m_historyProcessManager);

            if (response.Success == false || response.Bytes == null)
                return Ok(response);

            return File(response.Bytes, "application/vnd.openxmlformats-officedocument.wordprocessingml.document", response.FileName);
        }

        private IActionResult RequestDeleteSensors(RequestDeleteSensors data)
        {
            MessageResult response = m_processManager.EquipmentManager.DeleteSensors(data.Sensors);
            return Ok(response);
        }

        private IActionResult RequestNewFirstAidEquipment(RequestNewFirstAidEquipment data)
        {
            ResponseFirstAidEquipment response = m_processManager.EquipmentManager.GetNewEquipment(data.SensorType);
            return Ok(response);
        }

        private IActionResult RequestFirstAidEquipmentList(RequestFirstAidEquipmentList data)
        {
            ResponseEquipmentList response = m_processManager.EquipmentManager.GetFirstAidEquipmentList(data.SiteID);
            return Ok(response);
        }

        private IActionResult RequestLastEarthquake()
        {
            ResponseLastEarthquake response = m_processManager.EarthquakeManager.GetLastEarthquake();
            return Ok(response);
        }

        private IActionResult RequestEarthquakeHistory(RequestEarthquakeHistory data)
        {
            ResponseEarthquakeHistory response = m_processManager.EarthquakeManager.GetEarthquakeHistory(data.QuaterNo);
            return Ok(response);
        }

        private IActionResult RequestCCTVList2(RequestCCTVList2 data)
        {
            ResponseCCTVList2 response = m_processManager.CCTVManager.GetCCTVList(data.CctvIDs);
            return Ok(response);
        }

        private IActionResult RequestUpdatePOIPosition(RequestUpdatePOIPosition data)
        {
            global::SDMS.BLL.Models.Request.RequestUpdatePOIPosition request = new global::SDMS.BLL.Models.Request.RequestUpdatePOIPosition();

            request.Position = data.Position;
            request.SensorID = data.SensorID;
            request.SensorType = data.SensorType;
            request.Text = data.Text;
            request.UserID = data.UserID;
            request.ZoneID = data.ZoneID;

            global::SDMS.BLL.Models.Response.MessageResult result = m_sdmsProcessManager.GetSaveManager().UpdatePOIPosition(request, new UpdateDataManagerEx(m_dataManager));
            return Ok(result);
        }

        private IActionResult RequestUpdatePOIPositions(RequestUpdatePOIPositions data)
        {
            // 구급장비는 GGH에서 수행
            ResponseUpdatePOIPositions response = m_processManager.SensorManager.UpdateFirstAidEquipments(data);

            if (response.Success == false)
                return Ok(response);

            global::SDMS.BLL.Models.Request.RequestUpdatePOIPositions request = new global::SDMS.BLL.Models.Request.RequestUpdatePOIPositions();

            foreach (var req in data.Datas)
            {
                global::SDMS.BLL.Models.Request.RequestUpdatePOIPosition _req = new global::SDMS.BLL.Models.Request.RequestUpdatePOIPosition();

                _req.Position = req.Position;
                _req.SensorID = req.SensorID;
                _req.SensorType = req.SensorType;
                _req.Text = req.Text;
                _req.UserID = req.UserID;
                _req.ZoneID = req.ZoneID;

                request.Datas.Add(_req);
            }

            // 나머지는 SDMS에서 수행
            request.UpdateDataManager = new UpdateDataManagerEx(m_dataManager);

            global::SDMS.BLL.Models.Response.MessageResult result = m_sdmsProcessManager.GetSaveManager().UpdatePOIPositions(request);

            if (result.Success == false)
                return Ok(result);

            return Ok(response);
        }

        private IActionResult UpdateSensorEnabled(UpdateSensorEnabled data)
        {
            MessageResult response = m_processManager.SensorManager.UpdateSensorEnabled(data);
            return Ok(response);
        }

        private IActionResult RequestUPSStatus(RequestUPSStatus data)
        {
            ResponseUpsStatus response = m_processManager.ElectricPowerManager.GetUpsStatus(data.SiteID);
            return Ok(response);
        }

        private IActionResult RequestAllDoors(RequestAllDoors data)
        {
            ResponseAllDoors response = m_processManager.DoorManager.GetAllDoors(data.SiteID);
            return Ok(response);
        }

        private IActionResult RequestExitList(RequestExitList data)
        {
            ResponseExitList response = m_processManager.DoorManager.GetExitList(data.SiteID);
            return Ok(response);
        }

        private IActionResult RequestDoorStatus(RequestDoorStatus data)
        {
            ResponseDoorStatus response = m_processManager.DoorManager.GetClosedDoors(data.SiteID);
            return Ok(response);
        }

        private IActionResult RequestParkingGateList(RequestParkingGateList data)
        {
            ResponseParkingGateList response = m_processManager.ParkingManager.GetParkingGateList(data.SiteID);
            return Ok(response);
        }

        private IActionResult UpdateCCTVList(UpdateCCTVList data)
        {
            MessageResult response = m_processManager.CCTVManager.UpdateCCTVList(data);
            return Ok(response);
        }

        private IActionResult RequestCCTVList(RequestCCTVList data)
        {
            ResponseCCTVList response = m_processManager.CCTVManager.GetCCTVList(data.SiteID);
            return Ok(response);
        }

        private IActionResult RequestAlarmNEvacuations()
        {
            ResponseEvacuations _response = m_processManager.EvacuationManager.GetEvacuations();

            if (_response.Success == false)
                return Ok(new ResponseAlarmNEvacuations(false, _response.Message));

            ResponseAlarmNEvacuations response = new ResponseAlarmNEvacuations(true, "");

            response.Evacuations.AddRange(_response.Evacuations);
            response.AlarmDatas = m_sdmsProcessManager.GetLoadManager().AlarmDatas;
            response.AllAlarmDatas = m_sdmsProcessManager.GetLoadManager().AllAlarmDatas;

            if (response.AlarmDatas == null || response.AllAlarmDatas == null)
                return Ok(new ResponseAlarmNEvacuations(false, "알람정보를 읽어올 수 없습니다."));

            return Ok(response);
        }

        private IActionResult RequestEvacuations()
        {
            ResponseEvacuations response = m_processManager.EvacuationManager.GetEvacuations();
            return Ok(response);
        }

        private IActionResult UpdateNvrList(RequestUpdateNvrList data)
        {
            MessageResult response = m_processManager.CCTVManager.UpdateNvrList(data);
            return Ok(response);
        }

        private IActionResult RequestNvrList()
        {
            ResponseNvrList response = m_processManager.CCTVManager.GetNvrList();
            return Ok(response);
        }
    }

    public class ResponseAlarmNEvacuations : MessageResult
    {
        private List<Evacuation> m_evacuations = new List<Evacuation>();
        private List<AlarmData> m_alarmDatas = new List<AlarmData>();
        private List<AlarmData> m_allAlarmDatas = new List<AlarmData>();

        public List<Evacuation> Evacuations
        {
            get { return m_evacuations; }
        }

        public List<AlarmData> AlarmDatas
        {
            get { return m_alarmDatas; }
            set { m_alarmDatas = value; }
        }

        public List<AlarmData> AllAlarmDatas
        {
            get { return m_allAlarmDatas; }
            set { m_allAlarmDatas = value; }
        }

        public ResponseAlarmNEvacuations()
            : base()
        {
        }

        public ResponseAlarmNEvacuations(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class UpdateDataManagerEx : global::SDMS.BLL.Models.Data.IUpdateDataManager
    {
        private global::GGH.IDAL.IDataManager m_dataManager = null;

        public object DataManager
        {
            get { return m_dataManager; }
            set { m_dataManager = (global::GGH.IDAL.IDataManager)value; }
        }

        public UpdateDataManagerEx(global::GGH.IDAL.IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public bool MakeUpdateData(object dataManager, string strTableName, string strFields, string strValues, string strCondition, out string strErrorMessage)
        {
            return GGH.BLL.UpdateDataManager.MakeUpdateData((global::GGH.IDAL.IDataManager)dataManager, strTableName, strFields, strValues, strCondition, out strErrorMessage);
        }
    }
}
