using System.Collections.Generic;
using EDMS.Model;

namespace EDMS.IDAL
{
	public interface ISelect
	{
		Facility SelectEdmsFacility(int id, out string strErrorMessage);
		List<Facility> SelectEdmsFacilities(Dictionary<Facility.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<Facility> SelectEdmsFacilities(Dictionary<Facility.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		FacilityCameraData SelectEdmsFacilityCameraData(int id, out string strErrorMessage);
		List<FacilityCameraData> SelectEdmsFacilityCameraDatas(Dictionary<FacilityCameraData.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<FacilityCameraData> SelectEdmsFacilityCameraDatas(Dictionary<FacilityCameraData.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

	}
}
