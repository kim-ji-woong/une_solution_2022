using System.Collections.Generic;
using EDMS.Model;

namespace EDMS.IDAL
{
	public interface IUpdate
	{
		bool UpdateEdmsFacility(Facility obj, out string strErrorMessage);
		bool UpdateEdmsFacility(Dictionary<Facility.Fields, object> dicSets, Dictionary<Facility.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateEdmsFacilityCameraData(FacilityCameraData obj, out string strErrorMessage);
		bool UpdateEdmsFacilityCameraData(Dictionary<FacilityCameraData.Fields, object> dicSets, Dictionary<FacilityCameraData.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

	}
}
