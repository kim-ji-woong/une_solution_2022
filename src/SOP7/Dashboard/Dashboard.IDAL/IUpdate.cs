using Dashboard.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace Dashboard.IDAL
{
    public interface IUpdate
    {
        bool UpdateCurrentWorkPermit(CurrentWorkPermit currentWorkPermit, out string strErrorMessage);
        bool UpdateCurrentWorkPermit(Dictionary<CurrentWorkPermit.Fields, object> dicSets, Dictionary<CurrentWorkPermit.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

        bool UpdateWorkPermit(WorkPermit obj, out string strErrorMessage);
        bool UpdateWorkPermit(Dictionary<WorkPermit.Fields, object> dicSets, Dictionary<WorkPermit.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
    }
}
