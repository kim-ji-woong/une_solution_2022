using SDMS.Model.Sensor;
using System;
using System.Collections.Generic;
using System.Text;

namespace Industrial.BLL.Model.Sensors
{
    public class Stink : MultiSensor
    {
        public static ICollection<Stink> SelectStinks(List<ETC> sensors, Dictionary<int, Material> dicMaterials)
        {
            return SelectSensorTypes<Stink>(sensors, dicMaterials, IsStinkSensor);
        }

        private static bool IsStinkSensor(string strUniqueKey)
        {
            int nIndex = strUniqueKey.IndexOf('_');

            if (nIndex > 0) 
            {
                string strSensorType = strUniqueKey.Substring(0, nIndex);
                return strSensorType == "OU";
            }

            return false;
        }
    }
}
