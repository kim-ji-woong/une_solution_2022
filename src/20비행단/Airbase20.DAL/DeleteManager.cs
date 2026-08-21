using Airbase20.IDAL;
using Airbase20.Model;
using dnsDBUtil;
using System;
using System.Collections.Generic;
using System.Text;

namespace Airbase20.DAL
{
	public class DeleteManager : QueryManager, IDelete
	{
		private DataManager m_dataManager = null;

		public DeleteManager(DataManager dataManager)
		{
			m_dataManager = dataManager;
			m_dbManager = m_dataManager.GetDBManager() as DirectDBManager;
		}

		private bool DeleteFromID(string strTableName, int nID, out string strErrorMessage)
		{
			string strSQL = string.Format("Delete from {0} where ID = {1}", strTableName, nID);

			if (m_dbManager.GetResultData(strSQL) == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return false;
			}

			strErrorMessage = null;
			return true;
		}

		private bool DeleteFromCondition(string strTableName, string strCondition, string strAdditionalConditions, out string strErrorMessage)
		{
			if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
			{
				if (strCondition.Length > 0)
					strCondition += " And " + strAdditionalConditions;
				else
					strCondition = strAdditionalConditions;
			}

			string strSQL = string.Format("Delete from {0}", strTableName);

			if (strCondition.Length > 0)
				strSQL += " Where " + strCondition;

			if (m_dbManager.GetResultData(strSQL) == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return false;
			}

			strErrorMessage = null;
			return true;
		}

		public bool DeleteRelay(int id, out string strErrorMessage)
		{
			return DeleteFromID(Relay.TableName, id, out strErrorMessage);
		}

		public bool DeleteRelay(Dictionary<Relay.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<Relay.Fields>(ref strCondition, dicConditions, Relay.GetFieldName, Relay.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(Relay.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteRelayHistory(int id, out string strErrorMessage)
		{
			return DeleteFromID(RelayHistory.TableName, id, out strErrorMessage);
		}

		public bool DeleteRelayHistory(Dictionary<RelayHistory.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<RelayHistory.Fields>(ref strCondition, dicConditions, RelayHistory.GetFieldName, RelayHistory.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(RelayHistory.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteSwitch(int id, out string strErrorMessage)
		{
			return DeleteFromID(Switch.TableName, id, out strErrorMessage);
		}

		public bool DeleteSwitch(Dictionary<Switch.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<Switch.Fields>(ref strCondition, dicConditions, Switch.GetFieldName, Switch.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(Switch.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteSwitchDetail(int id, out string strErrorMessage)
		{
			return DeleteFromID(SwitchDetail.TableName, id, out strErrorMessage);
		}

		public bool DeleteSwitchDetail(Dictionary<SwitchDetail.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<SwitchDetail.Fields>(ref strCondition, dicConditions, SwitchDetail.GetFieldName, SwitchDetail.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(SwitchDetail.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool DeletePeckPower(int id, out string strErrorMessage)
		{
			return DeleteFromID(PeckPower.TableName, id, out strErrorMessage);
		}

		public bool DeletePeckPower(Dictionary<PeckPower.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<PeckPower.Fields>(ref strCondition, dicConditions, PeckPower.GetFieldName, PeckPower.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(PeckPower.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


	}
}
