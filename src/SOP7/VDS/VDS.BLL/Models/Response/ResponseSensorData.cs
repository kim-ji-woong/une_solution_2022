using System.Collections.Generic;
using VDS.Model.Sensor;

namespace VDS.BLL.Models.Response
{
    public class ResponseSensorTypes : MessageResult
    {
        private List<SensorTypeEx> m_sensorTypes = new List<SensorTypeEx>();

        public List<SensorTypeEx> SensorTypes
        {
            get { return m_sensorTypes; }
            set { m_sensorTypes = value; }
        }

        public ResponseSensorTypes()
            : base()
        {
        }

        public ResponseSensorTypes(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class SensorTypeEx : SensorType
    {
        private string m_strCategory = "FMS";

        public string Category
        {
            get { return m_strCategory; }
            set { m_strCategory = value; }
        }

        public SensorTypeEx(SensorType sensorType)
        {
            this.AbnormalImageUrl = sensorType.AbnormalImageUrl;
            this.Code = sensorType.Code;
            this.EngName = sensorType.EngName;
            this.ID = sensorType.ID;
            this.ImageUrl = sensorType.ImageUrl;
            this.Name = sensorType.Name;
            this.RangeMax = sensorType.RangeMax;
            this.RangeMin = sensorType.RangeMin;
            this.Unit = sensorType.Unit;
        }

        public static void SetSensorDefaultStatus(Sensor sensor, Dictionary<int, SensorType> dicSensorTypes)
        {
            SensorType sensorType;

            if (dicSensorTypes.TryGetValue(sensor.SensorTypeID, out sensorType))
            {
                SetSensorDefaultStatus(sensor, sensorType);
            }
        }

        public static void SetSensorDefaultStatus(Sensor sensor, SensorType sensorType)
        {
            /*if (sensorType.Code == "RTU" || sensorType.Code == "UPS" ||
                sensorType.Code == "HVC")
                sensor.Status = "OFF";
            else if (sensorType.Code == "WTL" || sensorType.Code == "FFE" ||
                sensorType.Code == "SMK" || sensorType.Code == "THE" ||
                sensorType.Code == "FRE")
                sensor.Status = "미감지";
            else if (sensorType.Code == "TMP" || sensorType.Code == "HUM")
                sensor.Status = "비정상";
            else
                sensor.Status = "";*/
        }
    }
}
