using System.Collections.Generic;
using SDMS.Model.Sensor;

namespace BusanTP.BLL.Models.Sensor
{
    public class Atmosphere : MultiSensor
    {
        public static ICollection<Atmosphere> SelectAtmospheres(List<ETC> sensors, Dictionary<int, Material> dicMaterials)
        {
            return SelectSensorTypes<Atmosphere>(sensors, dicMaterials, IsAtmosphereSensor);
        }

        private static bool IsAtmosphereSensor(string strUniqueKey)
        {
            int nIndex = strUniqueKey.IndexOf('_');

            if (nIndex > 0)
            {
                // 대기센서 판별 로직
                string strSensorType = strUniqueKey.Substring(0, nIndex);
                return strSensorType == "Atmosphere";
            }

            return false;
        }
    }
}