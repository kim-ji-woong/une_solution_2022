using System;

namespace SOP.IBLL
{
    public interface IProcessManager
    {
        ISopManager SopManager
        {
            get;
        }
    }
}
