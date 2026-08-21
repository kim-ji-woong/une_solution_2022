using System.Collections.Generic;
using dnsDBUtil;
using Safety.IDAL;
using Safety.Model.Sop.Team;

namespace Safety.DAL
{
	public class DeleteManager : QueryManager, IDelete
	{
		private DataManager m_dataManager = null;

		public DeleteManager(DataManager dataManager)
		{
			m_dataManager = dataManager;
			m_dbManager = m_dataManager.GetDBManager() as DirectDBManager;
			//m_dbManager = m_dataManager.GetDBManager() as WebDBManager;
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

		public bool DeleteSopTeamRegularMemberInfo(Dictionary<RegularMemberInfo.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<RegularMemberInfo.Fields>(ref strCondition, dicConditions, RegularMemberInfo.GetFieldName, RegularMemberInfo.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(RegularMemberInfo.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


	}
}
