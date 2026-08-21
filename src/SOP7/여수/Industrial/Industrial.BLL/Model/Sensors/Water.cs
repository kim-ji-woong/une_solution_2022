using System.Collections.Generic;
using SDMS.Model.Sensor;

namespace Industrial.BLL.Model.Sensors
{
    // 수질센서
    public class Water : MultiSensor
    {
        public static ICollection<Water> SelectWaters(List<ETC> sensors, Dictionary<int, Material> dicMaterials)
        {
            return SelectSensorTypes<Water>(sensors, dicMaterials, IsWaterSensor);
        }

        private static bool IsWaterSensor(string strUniqueKey)
        {
            int nIndex = strUniqueKey.IndexOf('_');

            if (nIndex > 0)
            {
                string strSensorType = strUniqueKey.Substring(0, nIndex);
                return strSensorType == "Water";
            }

            return false;
        }
    }
}
