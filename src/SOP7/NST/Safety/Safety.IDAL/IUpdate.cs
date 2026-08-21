using System.Collections.Generic;
using Safety.Model.Sop.Team;

namespace Safety.IDAL
{
	public interface IUpdate
	{
		bool UpdateSopTeamRegularMemberInfo(Dictionary<RegularMemberInfo.Fields, object> dicSets, Dictionary<RegularMemberInfo.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

	}
}
