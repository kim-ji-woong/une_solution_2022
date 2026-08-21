using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;

namespace Wonik.IDAL
{
    using Wonik.Model;

    public interface ISelect
    {
        ArrayList GetResultData(string strSQL, out string strErrorMessage);
        VehicleSpeedDetection SelectVehicleSpeedDetection(int id, out string strErrorMessage);
        List<VehicleSpeedDetection> SelectVehicleSpeedDetections(Dictionary<VehicleSpeedDetection.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
        List<VehicleSpeedDetection> SelectVehicleSpeedDetections(Dictionary<VehicleSpeedDetection.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

        ArrayList JoinVehicleSpeedDetectionSensorETC(string strAdditionalConditions, out string strErrorMessage);
        ArrayList JoinVehicleSpeedDetectionSensorETC(string strAdditionalConditions, int? topNCount, out string strErrorMessage);
    }
}
