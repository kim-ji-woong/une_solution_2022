using System.Collections.Generic;
using SDMS.Model.Sensor;

namespace BusanTP.BLL.Models.Sensor
{
    public class KWeather : MultiSensor
    {
        public static ICollection<KWeather> SelectKWeathers(List<ETC> sensors, Dictionary<int, Material> dicMaterials)
        {            
            return SelectSensorTypes<KWeather>(sensors, dicMaterials, IsKWeatherSensor);
        }
        
        private static bool IsKWeatherSensor(string strUniqueKey)
        {
            int nIndex = strUniqueKey.IndexOf('_');
            
            if (nIndex > 0)
            {
                // 케이웨더 판별 로직
                string strSensorType = strUniqueKey.Substring(0, nIndex);
                if (strSensorType.Contains("KWeather"))
                    return true;
            }
            
            return false;
        }
    }
}