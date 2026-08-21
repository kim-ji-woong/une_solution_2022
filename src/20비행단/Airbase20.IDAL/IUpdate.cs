using Airbase20.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace Airbase20.IDAL
{
	public interface IUpdate
	{
		bool UpdateRelay(Relay obj, out string strErrorMessage);
		bool UpdateRelay(Dictionary<Relay.Fields, object> dicSets, Dictionary<Relay.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateRelayHistory(RelayHistory obj, out string strErrorMessage);
		bool UpdateRelayHistory(Dictionary<RelayHistory.Fields, object> dicSets, Dictionary<RelayHistory.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateSwitch(Switch obj, out string strErrorMessage);
		bool UpdateSwitch(Dictionary<Switch.Fields, object> dicSets, Dictionary<Switch.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateSwitchDetail(SwitchDetail obj, out string strErrorMessage);
		bool UpdateSwitchDetail(Dictionary<SwitchDetail.Fields, object> dicSets, Dictionary<SwitchDetail.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdatePeckPower(PeckPower obj, out string strErrorMessage);
		bool UpdatePeckPower(Dictionary<PeckPower.Fields, object> dicSets, Dictionary<PeckPower.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

	}
}
