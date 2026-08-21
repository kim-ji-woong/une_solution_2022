using System;
using System.Collections.Generic;
using System.Text;

namespace Wonik.IDAL
{
    using Wonik.Model;

    public interface ICreate
    {
        string GetErrorMessage();
        bool RunQuery(string strSQL);
        VehicleSpeedDetection CreateVehicleSpeedDetection(VehicleSpeedDetection obj, out string strErrorMessage);

    }
}
