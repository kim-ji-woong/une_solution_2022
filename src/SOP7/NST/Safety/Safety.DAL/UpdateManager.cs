using System.Collections.Generic;
using dnsDBUtil;
using Safety.IDAL;
using Safety.Model.Sop.Team;

namespace Safety.DAL
{
	public class UpdateManager : QueryManager, IUpdate
	{
		private DataManager m_dataManager = null;

		public UpdateManager(DataManager dataManager)
		{
			m_dataManager = dataManager;
			m_dbManager = m_dataManager.GetDBManager() as DirectDBManager;
			//m_dbManager = m_dataManager.GetDBManager() as WebDBManager;
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
			System.Diagnostics.Trace.WriteLine("UpdateManager SQL : " + strSQL);

			if (m_dbManager.GetResultData(strSQL) == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return false;
			}

			strErrorMessage = null;
			return true;
		}

		public bool UpdateSopTeamRegularMemberInfo(Dictionary<RegularMemberInfo.Fields, object> dicSets, Dictionary<RegularMemberInfo.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<RegularMemberInfo.Fields>(ref strSets, dicSets, RegularMemberInfo.GetFieldName, RegularMemberInfo.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<RegularMemberInfo.Fields>(ref strCondition, dicConditions, RegularMemberInfo.GetFieldName, RegularMemberInfo.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(RegularMemberInfo.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


	}
}
