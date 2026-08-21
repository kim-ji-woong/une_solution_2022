using System.Collections.Generic;
using SDMS.Model.Sensor;

namespace BusanTP.BLL.Models.Sensor
{
    public class Weather : MultiSensor
    {
        public static ICollection<Weather> SelectWeathers(List<ETC> sensors, Dictionary<int, Material> dicMaterials)
        {            
            return SelectSensorTypes<Weather>(sensors, dicMaterials, IsWeatherSensor);
        }
        
        private static bool IsWeatherSensor(string strUniqueKey)
        {
            int nIndex = strUniqueKey.IndexOf('_');
            
            if (nIndex > 0)
            {
                // 날씨센서 판별 로직
                string strSensorType = strUniqueKey.Substring(0, nIndex);
                return strSensorType == "Weather";
            }
            
            return false;
        }
    }
}