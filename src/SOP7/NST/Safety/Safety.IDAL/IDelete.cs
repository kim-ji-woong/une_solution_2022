using System.Collections.Generic;
using Safety.Model.Sop.Team;

namespace Safety.IDAL
{
	public interface IDelete
	{
		bool DeleteSopTeamRegularMemberInfo(Dictionary<RegularMemberInfo.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

	}
}
