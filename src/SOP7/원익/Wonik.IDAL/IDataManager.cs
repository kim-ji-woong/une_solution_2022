using System;
using System.Collections.Generic;
using System.Text;

namespace Wonik.IDAL
{
    public interface IDataManager
    {
        ICreate GetCreateManager();
        ISelect GetSelectManager();
        IDelete GetDeleteManager();
        IUpdate GetUpdateManager();
        int SiteID
        {
            get;
        }

        bool BeginBatch();
        bool BatchCommit();
        bool BatchRollback();
        IDataManager Clone();
        IDataManager Clone(string strDbHost, string strDbName, string strDbID, string strDbPw, int siteID);
    }
}
