using System.Collections.Generic;
using Safety.Model.Sop.Team;

namespace Safety.IDAL
{
	public interface ISelect
	{
		List<RegularMemberInfo> SelectSopTeamRegularMemberInfos(Dictionary<RegularMemberInfo.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<RegularMemberInfo> SelectSopTeamRegularMemberInfos(Dictionary<RegularMemberInfo.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

	}
}
