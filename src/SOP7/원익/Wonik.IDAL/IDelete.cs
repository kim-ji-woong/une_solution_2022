using System;
using System.Collections.Generic;
using System.Text;

namespace Wonik.IDAL
{
    using Wonik.Model;

    public interface IDelete
    {        
        bool DeleteVehicleSpeedDetection(int id, out string strErrorMessage);
        bool DeleteVehicleSpeedDetection(Dictionary<VehicleSpeedDetection.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

    }
}
