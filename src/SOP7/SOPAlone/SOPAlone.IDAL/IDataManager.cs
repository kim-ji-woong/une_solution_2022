using System;
using System.Collections.Generic;
using System.Text;

namespace SOPAlone.IDAL
{
    public interface IDataManager
    {
        ISelect GetSelectManager();
        ICreate GetCreateManager();
        IUpdate GetUpdateManager();
        bool BeginBatch();
        bool BatchCommit();
        bool BatchRollback();
        IDataManager Clone();
    }
}
