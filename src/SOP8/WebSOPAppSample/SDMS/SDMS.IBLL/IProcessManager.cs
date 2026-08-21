using System.Collections.Generic;

namespace SDMS.IBLL
{
    public interface IProcessManager
    {
        ISensorManager SensorManager
        {
            get;
        }
    }
}
