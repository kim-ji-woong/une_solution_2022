using System.Collections.Generic;
using EDMS.Model;

namespace EDMS.IDAL
{
	public interface IDelete
	{
		bool DeleteEdmsFacility(int id, out string strErrorMessage);
		bool DeleteEdmsFacility(Dictionary<Facility.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteEdmsFacilityCameraData(int id, out string strErrorMessage);
		bool DeleteEdmsFacilityCameraData(Dictionary<FacilityCameraData.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
	}
}
