using System.Collections.Generic;
using SDMS.Model.Sensor;

namespace BusanTP.BLL.Models.Sensor
{
    public class Electricity : MultiSensor
    {
        public static ICollection<Electricity> SelectElectricity(List<ETC> sensors, Dictionary<int, Material> dicMaterials)
        {
            return SelectSensorTypes<Electricity>(sensors, dicMaterials, IsElectricitySensor);
        }
        
        private static bool IsElectricitySensor(string strUniqueKey)
        {
            int nIndex = strUniqueKey.IndexOf('_');

            if (nIndex > 0)
            {
                // 전기센서 판별 로직
                string strSensorType = strUniqueKey.Substring(0, nIndex);
                return strSensorType == "Electricity";
            }

            return false;
        }
    }
}