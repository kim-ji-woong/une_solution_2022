using System.Collections.Generic;
using SDMS.Model.Sensor;

namespace Industrial.BLL.Model.Sensors
{
    // 대기센서
    public class Atmosphere : MultiSensor
    {
        public static ICollection<Atmosphere> SelectAtmosphers(List<ETC> sensors, Dictionary<int, Material> dicMaterials)
        {
            return SelectSensorTypes<Atmosphere>(sensors, dicMaterials, IsAtmosphereSensor);
            /*Material material = null;
            Atmosphere atmosphere = null;

            // Key : 고유키
            Dictionary<string, Atmosphere> dicAtmosphers = new Dictionary<string, Atmosphere>();

            foreach (ETC sensor in sensors)
            {
                if (sensor.MaterialType != null && dicMaterials.TryGetValue((int)sensor.MaterialType, out material))
                {
                    if (IsAtmosphereSensor(material))
                    {
                        string strUniqueKey = GetUniqueKey(sensor);

                        if (dicAtmosphers.TryGetValue(strUniqueKey, out atmosphere) == false)
                        {
                            atmosphere = new Atmosphere();
                            dicAtmosphers[strUniqueKey] = atmosphere;
                            atmosphere.FirstID = sensor.ID;
                        }
                        else
                        {
                            if (atmosphere.FirstID > sensor.ID)
                                atmosphere.FirstID = sensor.ID;
                        }

                        atmosphere.SetData(sensor, material);
                    }
                }
            }

            return dicAtmosphers.Values;*/
        }

        private static bool IsAtmosphereSensor(string strUniqueKey)
        {
            int nIndex = strUniqueKey.IndexOf('_');

            if (nIndex > 0)
            {
                string strSensorType = strUniqueKey.Substring(0, nIndex);
                return strSensorType == "Atmosphere";
            }

            return false;
        }
    }
}
