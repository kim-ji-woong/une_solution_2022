using EDMS.Model;

namespace EDMS.IDAL
{
	public interface ICreate
	{
		Facility CreateEdmsFacility(Facility obj, out string strErrorMessage);
		FacilityCameraData CreateEdmsFacilityCameraData(FacilityCameraData obj, out string strErrorMessage);
	}
}
