using System.Collections.Generic;

namespace Weather.IDAL
{
    using Model;

    public interface IUpdate
    {
        bool UpdateSite(Site site, out string strErrorMessage);
        bool UpdateSite(Dictionary<Site.Fields, object> dicSets, Dictionary<Site.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
        bool UpdateCurrent(Current current, out string strErrorMessage);
        bool UpdateCurrent(Dictionary<Current.Fields, object> dicSets, Dictionary<Current.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
        bool UpdateCurrent2(Current2 obj, out string strErrorMessage);
        bool UpdateCurrent2(Dictionary<Current2.Fields, object> dicSets, Dictionary<Current2.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
        bool UpdateSpecialReport(SpecialReport report, out string strErrorMessage);
        bool UpdateSpecialReport(Dictionary<SpecialReport.Fields, object> dicSets, Dictionary<SpecialReport.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
        bool UpdateWeekly(Weekly weekly, out string strErrorMessage);
        bool UpdateWeekly(Dictionary<Weekly.Fields, object> dicSets, Dictionary<Weekly.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
    }
}
