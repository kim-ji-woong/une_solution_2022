using SDMS.Model.Sensor;
using System;
using System.Collections.Generic;
using System.Text;

namespace Industrial.BLL.Model.Sensors
{
    public class VOC : MultiSensor
    {
        public static ICollection<VOC> SelectVOCs(List<ETC> sensors, Dictionary<int, Material> dicMaterials)
        {
            return SelectSensorTypes<VOC>(sensors, dicMaterials, IsVOCSensor);
        }

        private static bool IsVOCSensor(string strUniqueKey)
        {
            int nIndex = strUniqueKey.IndexOf('_');

            if (nIndex > 0) 
            {
                string strSensorType = strUniqueKey.Substring(0, nIndex);
                return strSensorType == "VOC";
            }

            return false;
        }
    }
}
