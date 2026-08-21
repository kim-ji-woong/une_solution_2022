using Microsoft.AspNetCore.Mvc;
using SDMS.IBLL;
using SDMS.Model.Sensor;
using System.Collections;
using System.Collections.Generic;
using Response;

namespace SDMS.Controller
{
    using Model.Sensor;
    using Model.Spatial;
    using Models.Request;
    using Models.Response;

    public class SDMSController : ControllerBase
    {
        private IProcessManager m_processManager = null;

        public SDMSController(IProcessManager processManager)
        {
            m_processManager = processManager;
        }

        [HttpPost]
        public IActionResult FireSensors([FromBody] RequestData request)
        {
            string strErrorMessage;
            IEnumerable<Fire> sensors = m_processManager.SensorManager.GetFireSensors(request.RowCount, out strErrorMessage);

            return Ok(ResponseManager.MakeResultList(sensors, strErrorMessage));
        }

        [HttpPost]
        public IActionResult ZoneFireSensors([FromBody] RequestData request)
        {
            string strErrorMessage;
            ArrayList arrDatas = m_processManager.SensorManager.GetZoneFireSensors(request.RowCount, out strErrorMessage);

            if (arrDatas == null)
                return Ok(ResponseManager.MakeResultList<ZoneSensor>(null, strErrorMessage));

            List<ZoneSensor> zoneSensors = new List<ZoneSensor>();
            int nDataCount = arrDatas.Count;

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (arrDatas[i] is Zone && arrDatas[i + 1] is Fire)
                {
                    Zone zone = (Zone)arrDatas[i];
                    Fire fire = (Fire)arrDatas[i + 1];

                    ZoneSensor zoneSensor = new ZoneSensor();

                    zoneSensor.ZoneID = zone.ID;
                    zoneSensor.ZoneName = zone.ZoneName;
                    zoneSensor.SensorID = fire.ID;
                    zoneSensor.SensorName = fire.Name;

                    zoneSensors.Add(zoneSensor);
                }
            }

            return Ok(ResponseManager.MakeResultList(zoneSensors, strErrorMessage));
        }

        [HttpPost]
        public IActionResult LinkedSop([FromBody] RequestLinkedSop request)
        {
            string strErrorMessage;
            string strDisasterCategoryName, strSubDisasterCategoryName, strDisasterName;
            
            if (m_processManager.SensorManager.GetLinkedSOPFromFireSensor(request.FireSensorID, out strDisasterCategoryName, out strSubDisasterCategoryName, out strDisasterName, out strErrorMessage))
            {
                LinkedSop linkedSop = new LinkedSop();

                linkedSop.DisasterCategoryName = strDisasterCategoryName;
                linkedSop.SubDisasterCategoryName = strSubDisasterCategoryName;
                linkedSop.DisasterName = strDisasterName;

                return Ok(ResponseManager.MakeResult<LinkedSop>(linkedSop, ""));
            }

            return Ok(ResponseManager.MakeResultList<LinkedSop>(null, strErrorMessage));
        }
    }
}
