using System;
using System.Collections.Generic;
using System.Text;

namespace Airbase20.IDAL
{
    public interface IDataManager
    {
        ICreate GetCreateManager();
        ISelect GetSelectManager();
        IDelete GetDeleteManager();
        IUpdate GetUpdateManager();
        bool BeginTransaction();
        bool Commit();
        bool Rollback();
    }
}
