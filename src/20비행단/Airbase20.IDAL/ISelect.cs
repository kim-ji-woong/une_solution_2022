using Airbase20.Model;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;

namespace Airbase20.IDAL
{
	public interface ISelect
	{
		Relay SelectRelay(int id, out string strErrorMessage);
		List<Relay> SelectRelays(Dictionary<Relay.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<Relay> SelectRelays(Dictionary<Relay.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		RelayHistory SelectRelayHistory(int id, out string strErrorMessage);
		List<RelayHistory> SelectRelayHistorys(Dictionary<RelayHistory.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<RelayHistory> SelectRelayHistorys(Dictionary<RelayHistory.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		Switch SelectSwitch(int id, out string strErrorMessage);
		List<Switch> SelectSwitchs(Dictionary<Switch.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<Switch> SelectSwitchs(Dictionary<Switch.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		SwitchDetail SelectSwitchDetail(int id, out string strErrorMessage);
		List<SwitchDetail> SelectSwitchDetails(Dictionary<SwitchDetail.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<SwitchDetail> SelectSwitchDetails(Dictionary<SwitchDetail.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		PeckPower SelectPeckPower(int id, out string strErrorMessage);
		List<PeckPower> SelectPeckPowers(Dictionary<PeckPower.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<PeckPower> SelectPeckPowers(Dictionary<PeckPower.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		ArrayList JoinSwitchSwitchDetail(string strAdditionalConditions, out string strErrorMessage);
		ArrayList JoinSwitchSwitchDetail(string strAdditionalConditions, int? topNCount, out string strErrorMessage);
	}
}
