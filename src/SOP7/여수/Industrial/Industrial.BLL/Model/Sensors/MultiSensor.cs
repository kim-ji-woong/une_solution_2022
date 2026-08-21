using System.Collections.Generic;
using SDMS.Model.Sensor;

namespace Industrial.BLL.Model.Sensors
{
    // 복합센서
    public class MultiSensor
    {
        protected delegate bool IsSensorType(string strUniqueKey);

        private string m_strPosition = "";
        private string m_strAddress = "";
        private string m_strUniqueKey = "";
        private int m_nZoneID = -1;

        private List<Sensor> m_sensors = new List<Sensor>();

        public string Position
        {
            get { return m_strPosition; }
            set { m_strPosition = value; }
        }

        public string Address
        {
            get { return m_strAddress; }
            set { m_strAddress = value; }
        }

        public string UniqueKey
        {
            get { return m_strUniqueKey; }
            set { m_strUniqueKey = value; }
        }

        public int ZoneID
        {
            get { return m_nZoneID; }
            set { m_nZoneID = value; }
        }

        public List<Sensor> Sensors
        {
            get { return m_sensors; }
            set { m_sensors = value; }
        }

        protected static string GetUniqueKey(ETC sensor)
        {
            int nIndex = sensor.UniqueKey.LastIndexOf('_');

            if (nIndex < 0)
                return sensor.UniqueKey;

            return sensor.UniqueKey.Substring(0, nIndex);
        }

        protected void SetData(ETC sensor, Material material)
        {
            m_strPosition = sensor.Name;
            m_strAddress = sensor.PositionName;
            m_nZoneID = sensor.ZoneID;

            Sensor _sensor = new Sensor();
            _sensor.ID = sensor.ID;
            _sensor.Enabled = sensor.Enabled != null && (bool)sensor.Enabled;
            _sensor.SensorType = material.ID;
            _sensor.SensorTypeName = GetSensorTypeName(material);
            _sensor.UoM = material.UOM;
            _sensor.Value = sensor.CurrentData;
            _sensor.Status = sensor.Status;

            m_sensors.Add(_sensor);
        }

        private string GetSensorTypeName(Material material)
        {
            if (material.Description == null || material.Description.Length == 0)
                return material.MaterialName;

            if (material.Description == material.MaterialName)
                return material.MaterialName;

            return material.Description + "(" + material.MaterialName + ")";
        }

        protected static ICollection<SensorType> SelectSensorTypes<SensorType>(List<ETC> sensors, Dictionary<int, Material> dicMaterials, IsSensorType isSensorType) where SensorType : MultiSensor, new()
        {
            Material material = null;
            SensorType multiSensor = null;

            // Key : 고유키
            Dictionary<string, SensorType> dicMultiSensors = new Dictionary<string, SensorType>();
            List<ETC> remains = new List<ETC>();

            foreach (ETC sensor in sensors)
            {
                if (sensor.MaterialType != null && dicMaterials.TryGetValue((int)sensor.MaterialType, out material))
                {
                    string strUniqueKey = GetUniqueKey(sensor);

                    if (isSensorType(strUniqueKey))
                    {
                        if (dicMultiSensors.TryGetValue(strUniqueKey, out multiSensor) == false)
                        {
                            multiSensor = new SensorType();
                            dicMultiSensors[strUniqueKey] = multiSensor;
                        }

                        multiSensor.SetData(sensor, material);
                    }
                    else
                        remains.Add(sensor);
                }
            }

            sensors.Clear();
            sensors.AddRange(remains);

            return dicMultiSensors.Values;
        }

    }
}
