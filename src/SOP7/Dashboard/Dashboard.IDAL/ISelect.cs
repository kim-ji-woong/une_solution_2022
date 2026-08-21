using Dashboard.Model;
using System;
using System.Collections;
using System.Collections.Generic;

namespace Dashboard.IDAL
{
    public interface ISelect
    {
        ArrayList GetResultData(string strSQL, out string strErrorMessage);
        CurrentWorkPermit SelectCurrentWorkPermit(string strPlantPrcsID, out string strErrorMessage);
        List<CurrentWorkPermit> SelectCurrentWorkPermits(Dictionary<CurrentWorkPermit.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
        List<CurrentWorkPermit> SelectCurrentWorkPermits(Dictionary<CurrentWorkPermit.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

        WorkPermit SelectWorkPermit(int id, out string strErrorMessage);
        List<WorkPermit> SelectWorkPermits(Dictionary<WorkPermit.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
        List<WorkPermit> SelectWorkPermits(Dictionary<WorkPermit.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

    }
}
