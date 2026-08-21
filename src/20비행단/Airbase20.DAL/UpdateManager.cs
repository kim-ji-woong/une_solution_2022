using Airbase20.IDAL;
using Airbase20.Model;
using dnsDBUtil;
using System;
using System.Collections.Generic;
using System.Text;

namespace Airbase20.DAL
{
	public class UpdateManager : QueryManager, IUpdate
	{
		private DataManager m_dataManager = null;

		public UpdateManager(DataManager dataManager)
		{
			m_dataManager = dataManager;
			m_dbManager = m_dataManager.GetDBManager() as DirectDBManager;
		}

		public bool UpdateFromCondition(string strTableName, string strSets, string strCondition, string strAdditionalConditions, out string strErrorMessage)
		{
			if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
			{
				if (strCondition.Length > 0)
					strCondition += " and " + strAdditionalConditions;
				else
					strCondition = strAdditionalConditions;
			}

			string strSQL = string.Format("Update {0} set {1} where {2}", strTableName, strSets, strCondition);

			if (m_dbManager.GetResultData(strSQL) == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return false;
			}

			strErrorMessage = null;
			return true;
		}

		public bool UpdateRelay(Relay obj, out string strErrorMessage)
		{
			Dictionary<Relay.Fields, object> dicSets = new Dictionary<Relay.Fields, object>();
			dicSets[Relay.Fields.Name] = obj.Name;
			dicSets[Relay.Fields.Type] = obj.Type;
			dicSets[Relay.Fields.IP] = obj.IP;
			dicSets[Relay.Fields.SubIP] = obj.SubIP;
			dicSets[Relay.Fields.Port] = obj.Port;
			dicSets[Relay.Fields.ElectCurrent_A] = obj.ElectCurrent_A;
			dicSets[Relay.Fields.ElectCurrent_B] = obj.ElectCurrent_B;
			dicSets[Relay.Fields.ElectCurrent_C] = obj.ElectCurrent_C;
			dicSets[Relay.Fields.Volt_A] = obj.Volt_A;
			dicSets[Relay.Fields.Volt_B] = obj.Volt_B;
			dicSets[Relay.Fields.Volt_C] = obj.Volt_C;
			dicSets[Relay.Fields.Factor] = obj.Factor;
			dicSets[Relay.Fields.ActivePower] = obj.ActivePower;
			dicSets[Relay.Fields.ReactivePower] = obj.ReactivePower;
			dicSets[Relay.Fields.Frequency] = obj.Frequency;
			dicSets[Relay.Fields.ActivePowerTotal] = obj.ActivePowerTotal;
			dicSets[Relay.Fields.ReactivePowerTotal] = obj.ReactivePowerTotal;
			dicSets[Relay.Fields.Memo] = obj.Memo;
			dicSets[Relay.Fields.SlaveID] = obj.SlaveID;

			Dictionary<Relay.Fields, object> dicConditions = new Dictionary<Relay.Fields, object>();
			dicConditions[Relay.Fields.ID] = obj.ID;

			return UpdateRelay(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateRelay(Dictionary<Relay.Fields, object> dicSets, Dictionary<Relay.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<Relay.Fields>(ref strSets, dicSets, Relay.GetFieldName, Relay.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<Relay.Fields>(ref strCondition, dicConditions, Relay.GetFieldName, Relay.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(Relay.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateRelayHistory(RelayHistory obj, out string strErrorMessage)
		{
			Dictionary<RelayHistory.Fields, object> dicSets = new Dictionary<RelayHistory.Fields, object>();
			dicSets[RelayHistory.Fields.RelayID] = obj.RelayID;
			dicSets[RelayHistory.Fields.Date] = obj.Date;
			dicSets[RelayHistory.Fields.ActivePowerTotal] = obj.ActivePowerTotal;
			dicSets[RelayHistory.Fields.ReactivePowerTotal] = obj.ReactivePowerTotal;

			Dictionary<RelayHistory.Fields, object> dicConditions = new Dictionary<RelayHistory.Fields, object>();
			dicConditions[RelayHistory.Fields.ID] = obj.ID;

			return UpdateRelayHistory(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateRelayHistory(Dictionary<RelayHistory.Fields, object> dicSets, Dictionary<RelayHistory.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<RelayHistory.Fields>(ref strSets, dicSets, RelayHistory.GetFieldName, RelayHistory.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<RelayHistory.Fields>(ref strCondition, dicConditions, RelayHistory.GetFieldName, RelayHistory.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(RelayHistory.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateSwitch(Switch obj, out string strErrorMessage)
		{
			Dictionary<Switch.Fields, object> dicSets = new Dictionary<Switch.Fields, object>();
			dicSets[Switch.Fields.Name] = obj.Name;
			dicSets[Switch.Fields.Type] = obj.Type;
			dicSets[Switch.Fields.IP] = obj.IP;
			dicSets[Switch.Fields.SubIP] = obj.SubIP;
			dicSets[Switch.Fields.Port] = obj.Port;
			dicSets[Switch.Fields.Memo] = obj.Memo;
			dicSets[Switch.Fields.SlaveID] = obj.SlaveID;

			Dictionary<Switch.Fields, object> dicConditions = new Dictionary<Switch.Fields, object>();
			dicConditions[Switch.Fields.ID] = obj.ID;

			return UpdateSwitch(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateSwitch(Dictionary<Switch.Fields, object> dicSets, Dictionary<Switch.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<Switch.Fields>(ref strSets, dicSets, Switch.GetFieldName, Switch.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<Switch.Fields>(ref strCondition, dicConditions, Switch.GetFieldName, Switch.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(Switch.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateSwitchDetail(SwitchDetail obj, out string strErrorMessage)
		{
			Dictionary<SwitchDetail.Fields, object> dicSets = new Dictionary<SwitchDetail.Fields, object>();
			dicSets[SwitchDetail.Fields.SwitchID] = obj.SwitchID;
			dicSets[SwitchDetail.Fields.Circuit] = obj.Circuit;
			dicSets[SwitchDetail.Fields.OpenClose] = obj.OpenClose;
			dicSets[SwitchDetail.Fields.FI_Auto_A] = obj.FI_Auto_A;
			dicSets[SwitchDetail.Fields.FI_Auto_B] = obj.FI_Auto_B;
			dicSets[SwitchDetail.Fields.FI_Auto_C] = obj.FI_Auto_C;
			dicSets[SwitchDetail.Fields.FI_Auto_N] = obj.FI_Auto_N;
			dicSets[SwitchDetail.Fields.FI_Manual_A] = obj.FI_Manual_A;
			dicSets[SwitchDetail.Fields.FI_Manual_B] = obj.FI_Manual_B;
			dicSets[SwitchDetail.Fields.FI_Manual_C] = obj.FI_Manual_C;
			dicSets[SwitchDetail.Fields.FI_Manual_N] = obj.FI_Manual_N;
			dicSets[SwitchDetail.Fields.Break_A] = obj.Break_A;
			dicSets[SwitchDetail.Fields.Break_B] = obj.Break_B;
			dicSets[SwitchDetail.Fields.Break_C] = obj.Break_C;
			dicSets[SwitchDetail.Fields.Phase_A] = obj.Phase_A;
			dicSets[SwitchDetail.Fields.Phase_B] = obj.Phase_B;
			dicSets[SwitchDetail.Fields.Phase_C] = obj.Phase_C;
			dicSets[SwitchDetail.Fields.Phase_N] = obj.Phase_N;
			dicSets[SwitchDetail.Fields.MaxLoad_A] = obj.MaxLoad_A;
			dicSets[SwitchDetail.Fields.MaxLoad_B] = obj.MaxLoad_B;
			dicSets[SwitchDetail.Fields.MaxLoad_C] = obj.MaxLoad_C;
			dicSets[SwitchDetail.Fields.MaxLoad_N] = obj.MaxLoad_N;
			dicSets[SwitchDetail.Fields.AverageLoad_A] = obj.AverageLoad_A;
			dicSets[SwitchDetail.Fields.AverageLoad_B] = obj.AverageLoad_B;
			dicSets[SwitchDetail.Fields.AverageLoad_C] = obj.AverageLoad_C;
			dicSets[SwitchDetail.Fields.AverageLoad_N] = obj.AverageLoad_N;
			dicSets[SwitchDetail.Fields.FailCurrent_A] = obj.FailCurrent_A;
			dicSets[SwitchDetail.Fields.FailCurrent_B] = obj.FailCurrent_B;
			dicSets[SwitchDetail.Fields.FailCurrent_C] = obj.FailCurrent_C;
			dicSets[SwitchDetail.Fields.FailCurrent_N] = obj.FailCurrent_N;
			dicSets[SwitchDetail.Fields.AppartPower_A] = obj.AppartPower_A;
			dicSets[SwitchDetail.Fields.AppartPower_B] = obj.AppartPower_B;
			dicSets[SwitchDetail.Fields.AppartPower_C] = obj.AppartPower_C;
			dicSets[SwitchDetail.Fields.ElectCurrent_A] = obj.ElectCurrent_A;
			dicSets[SwitchDetail.Fields.ElectCurrent_B] = obj.ElectCurrent_B;
			dicSets[SwitchDetail.Fields.ElectCurrent_C] = obj.ElectCurrent_C;
			dicSets[SwitchDetail.Fields.ElectCurrent_N] = obj.ElectCurrent_N;
			dicSets[SwitchDetail.Fields.Volt_A] = obj.Volt_A;
			dicSets[SwitchDetail.Fields.Volt_B] = obj.Volt_B;
			dicSets[SwitchDetail.Fields.Volt_C] = obj.Volt_C;
			dicSets[SwitchDetail.Fields.TideFlow_Fwd] = obj.TideFlow_Fwd;
			dicSets[SwitchDetail.Fields.TideFlow_Rev] = obj.TideFlow_Rev;
			dicSets[SwitchDetail.Fields.FailFlow_Fwd] = obj.FailFlow_Fwd;
			dicSets[SwitchDetail.Fields.FailFlow_Rev] = obj.FailFlow_Rev;
			dicSets[SwitchDetail.Fields.Memo] = obj.Memo;

			Dictionary<SwitchDetail.Fields, object> dicConditions = new Dictionary<SwitchDetail.Fields, object>();
			dicConditions[SwitchDetail.Fields.ID] = obj.ID;

			return UpdateSwitchDetail(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateSwitchDetail(Dictionary<SwitchDetail.Fields, object> dicSets, Dictionary<SwitchDetail.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<SwitchDetail.Fields>(ref strSets, dicSets, SwitchDetail.GetFieldName, SwitchDetail.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<SwitchDetail.Fields>(ref strCondition, dicConditions, SwitchDetail.GetFieldName, SwitchDetail.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(SwitchDetail.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool UpdatePeckPower(PeckPower obj, out string strErrorMessage)
		{
			Dictionary<PeckPower.Fields, object> dicSets = new Dictionary<PeckPower.Fields, object>();
			dicSets[PeckPower.Fields.Name] = obj.Name;
			dicSets[PeckPower.Fields.PeckValue] = obj.PeckValue;

			Dictionary<PeckPower.Fields, object> dicConditions = new Dictionary<PeckPower.Fields, object>();
			dicConditions[PeckPower.Fields.ID] = obj.ID;

			return UpdatePeckPower(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdatePeckPower(Dictionary<PeckPower.Fields, object> dicSets, Dictionary<PeckPower.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<PeckPower.Fields>(ref strSets, dicSets, PeckPower.GetFieldName, PeckPower.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<PeckPower.Fields>(ref strCondition, dicConditions, PeckPower.GetFieldName, PeckPower.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(PeckPower.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


	}
}
