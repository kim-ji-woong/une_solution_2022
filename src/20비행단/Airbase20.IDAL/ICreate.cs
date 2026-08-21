using Airbase20.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace Airbase20.IDAL
{
	public interface ICreate
	{
		Relay CreateRelay(Relay obj, out string strErrorMessage);
		RelayHistory CreateRelayHistory(RelayHistory obj, out string strErrorMessage);
		Switch CreateSwitch(Switch obj, out string strErrorMessage);
		SwitchDetail CreateSwitchDetail(SwitchDetail obj, out string strErrorMessage);
		PeckPower CreatePeckPower(PeckPower obj, out string strErrorMessage);
	}
}
