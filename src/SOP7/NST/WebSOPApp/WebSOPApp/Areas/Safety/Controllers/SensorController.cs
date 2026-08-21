using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using SafetyServer.BLL.Data.Request;
using SafetyServer.BLL.Data.Response;
using SDMS.Model.Sensor;

namespace WebSOPApp.Areas.Safety.Controllers
{
    [Area("Safety")]
    public class SensorController : Controller
    {
        private class PSMSensor : PSM
        {
            private string m_strUOM = "";

            public string UOM
            {
                get { return m_strUOM;}
                set { m_strUOM = value; }
            }

            public PSMSensor()
            {
            }

            public PSMSensor(PSM psm)
            {
                this.ID = psm.ID;
                this.Name = psm.Name;
                this.PositionName = psm.PositionName;
                this.X = psm.X;
                this.Y = psm.Y;
                this.Z = psm.Z;
                this.ZoneID = psm.ZoneID;
                this.CurrentData = psm.CurrentData;
                /*this.LimitLevel1 = psm.LimitLevel1;
                this.LimitLevel2 = psm.LimitLevel2;
                this.LimitLevel3 = psm.LimitLevel3;*/
                this.EquipZoneID = psm.EquipZoneID;
                /*this.UseLimitLevel1 = psm.UseLimitLevel1;
                this.UseLimitLevel2 = psm.UseLimitLevel2;
                this.UseLimitLevel3 = psm.UseLimitLevel3;*/
                this.Department = psm.Department;
                this.DepartmentPhoneNumber = psm.DepartmentPhoneNumber;
                this.Enabled = psm.Enabled;
                this.Status = psm.Status;
                this.UniqueKey = psm.UniqueKey;
                this.MaterialType = psm.MaterialType;
            }
        }

        private class ResponseSensorPSM : MessageResult
        {
            private List<PSMSensor> m_psms = new List<PSMSensor>();

            public List<PSMSensor> Sensors
            {
                get { return m_psms; }
                set { m_psms = value; }
            }

            public ResponseSensorPSM()
                : base()
            {
            }

            public ResponseSensorPSM(bool success, string message)
                : base(success, message)
            {
            }
        }

        private global::SDMS.IDAL.IDataManager m_dataManager = null;

        public SensorController(global::SDMS.IDAL.IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        [HttpPost]
        public IActionResult RequestData([FromBody] RequestData data)
        {
            if (data == null)
                return BadRequest();

            if (data.RequestSensorPSM != null)
                return RequestSensorPSM();

            return NotFound();
        }

        private IActionResult RequestSensorPSM()
        {
            bool isNullable;
            string strCondition = string.Format("{0} in (", PSM.GetFieldName(PSM.Fields.UniqueKey, out isNullable));

            for (int i=1;i<=10;i++)
            {
                if (i == 1)
                    strCondition += string.Format("'G{0:00}'", i);
                else
                    strCondition += string.Format(", 'G{0:00}'", i);
            }

            strCondition += ")";

            string strErrorMessage;
            List<PSM> sensors = m_dataManager.GetSelectManager().SelectPSMSensors(null, strCondition, out strErrorMessage);

            if (strErrorMessage == null)
                strErrorMessage = "";

            ResponseSensorPSM response = new ResponseSensorPSM(sensors != null, strErrorMessage);

            if (sensors != null)
            {
                string strIDs = "";
                Dictionary<int, List<PSMSensor>> dicIDs = new Dictionary<int, List<PSMSensor>>();
                List<PSMSensor> _sensors = new List<PSMSensor>();

                List<PSMSensor> psmSensors = null;

                foreach (PSM sensor in sensors)
                {
                    PSMSensor _sensor = new PSMSensor(sensor);
                    _sensors.Add(_sensor);

                    if (sensor.MaterialType != null && dicIDs.TryGetValue((int)sensor.MaterialType, out psmSensors) == false)
                    {
                        psmSensors = new List<PSMSensor>();
                        dicIDs[(int)sensor.MaterialType] = psmSensors;

                        if (strIDs.Length == 0)
                            strIDs = ((int)sensor.MaterialType).ToString();
                        else
                            strIDs += "," + ((int)sensor.MaterialType).ToString();
                    }

                    psmSensors.Add(_sensor);
                }

                if (strIDs.Length > 0)
                {
                    strCondition = string.Format("{0} in ({1})", Material.GetFieldName(Material.Fields.ID, out isNullable), strIDs);
                    List<Material> materials = m_dataManager.GetSelectManager().SelectMaterials(null, strCondition, out strErrorMessage);

                    if (materials == null)
                        return Ok(new ResponseSensorPSM(false, strErrorMessage));

                    foreach (Material material in materials)
                    {
                        if (dicIDs.TryGetValue(material.ID, out psmSensors))
                        {
                            foreach (PSMSensor sensor in psmSensors)
                            {
                                sensor.UOM = material.UOM;
                            }
                        }
                    }
                }

                _sensors.Sort(ComparePSMSensor);
                response.Sensors.AddRange(_sensors);
            }

            return Ok(response);
        }

        private static int ComparePSMSensor(PSMSensor sensor1, PSMSensor sensor2)
        {
            if (sensor1.UniqueKey == null)
                return -1;
            else if (sensor2.UniqueKey == null)
                return 1;

            return sensor1.UniqueKey.CompareTo(sensor2.UniqueKey);
        }
    }
}
