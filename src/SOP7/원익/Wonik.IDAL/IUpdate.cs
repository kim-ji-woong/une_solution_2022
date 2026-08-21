using System;
using System.Collections.Generic;
using System.Text;

namespace Wonik.IDAL
{
    using Wonik.Model;

    public interface IUpdate
    {
        bool UpdateVehicleSpeedDetection(VehicleSpeedDetection obj, out string strErrorMessage);
        bool UpdateVehicleSpeedDetection(Dictionary<VehicleSpeedDetection.Fields, object> dicSets, Dictionary<VehicleSpeedDetection.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);        
    }
}
