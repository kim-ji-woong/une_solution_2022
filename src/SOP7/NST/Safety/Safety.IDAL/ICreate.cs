using Safety.Model.Sop.Team;

namespace Safety.IDAL
{
	public interface ICreate
	{
		RegularMemberInfo CreateSopTeamRegularMemberInfo(RegularMemberInfo obj, out string strErrorMessage);
	}
}
