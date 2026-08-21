using Airbase20.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace Airbase20.IDAL
{
	public interface IDelete
	{
		bool DeleteRelay(int id, out string strErrorMessage);
		bool DeleteRelay(Dictionary<Relay.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteRelayHistory(int id, out string strErrorMessage);
		bool DeleteRelayHistory(Dictionary<RelayHistory.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteSwitch(int id, out string strErrorMessage);
		bool DeleteSwitch(Dictionary<Switch.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteSwitchDetail(int id, out string strErrorMessage);
		bool DeleteSwitchDetail(Dictionary<SwitchDetail.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeletePeckPower(int id, out string strErrorMessage);
		bool DeletePeckPower(Dictionary<PeckPower.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

	}
}
