using System.Collections;
using System.Collections.Generic;
using SDMS.Model.Sensor;

namespace SDMS.IBLL
{
    public interface ISensorManager
    {
        IEnumerable<Fire> GetFireSensors(int? rowCount, out string strErrorMessage);
        ArrayList GetZoneFireSensors(int? rowCount, out string strErrorMessage);
        bool GetLinkedSOPFromFireSensor(int fireSensorID, out string strDisasterCategoryName, out string strSubDisasterCategory, out string strDisasterName, out string strErrorMessage);
    }
}
