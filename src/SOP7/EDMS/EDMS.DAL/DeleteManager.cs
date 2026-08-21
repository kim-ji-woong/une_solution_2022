using System;
using System.Collections;
using System.Collections.Generic;
using dnsDBUtil;
using EDMS.IDAL;
using EDMS.Model;

namespace EDMS.DAL
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

		public bool DeleteEdmsFacility(int id, out string strErrorMessage)
		{
			return DeleteFromID(Facility.TableName, id, out strErrorMessage);
		}

		public bool DeleteEdmsFacility(Dictionary<Facility.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<Facility.Fields>(ref strCondition, dicConditions, Facility.GetFieldName, Facility.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(Facility.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteEdmsFacilityCameraData(int id, out string strErrorMessage)
		{
			return DeleteFromID(FacilityCameraData.TableName, id, out strErrorMessage);
		}

		public bool DeleteEdmsFacilityCameraData(Dictionary<FacilityCameraData.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<FacilityCameraData.Fields>(ref strCondition, dicConditions, FacilityCameraData.GetFieldName, FacilityCameraData.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(FacilityCameraData.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


	}
}
