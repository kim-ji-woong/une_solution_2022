using System.Collections.Generic;
using dnsDBUtil;
using BusanTP.IDAL;
using BusanTP.Model;
using SOPManager.Model.Sop.Account;

namespace BusanTP.DAL
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

		public bool DeleteBusanExternalMaterial(Dictionary<Material.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<Material.Fields>(ref strCondition, dicConditions, Material.GetFieldName, Material.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(Material.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteBusanExternalSensor(Dictionary<Sensor.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<Sensor.Fields>(ref strCondition, dicConditions, Sensor.GetFieldName, Sensor.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(Sensor.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteBusanExternalSensorType(Dictionary<SensorType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<SensorType.Fields>(ref strCondition, dicConditions, SensorType.GetFieldName, SensorType.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(SensorType.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteBusanKWeatherNodeInfo(Dictionary<KWeatherNodeInfo.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<KWeatherNodeInfo.Fields>(ref strCondition, dicConditions, KWeatherNodeInfo.GetFieldName, KWeatherNodeInfo.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(KWeatherNodeInfo.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteBusanSdmsOption(Dictionary<SdmsOption.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<SdmsOption.Fields>(ref strCondition, dicConditions, SdmsOption.GetFieldName, SdmsOption.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(SdmsOption.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteBusanSensorDataHistory(Dictionary<SensorDataHistory.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<SensorDataHistory.Fields>(ref strCondition, dicConditions, SensorDataHistory.GetFieldName, SensorDataHistory.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(SensorDataHistory.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool DeleteBusanUserMemo(Dictionary<UserMemo.Fields, object> dicCondition, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			
			if (SetCondition<UserMemo.Fields>(ref strCondition, dicCondition, UserMemo.GetFieldName, UserMemo.TableName, ref strErrorMessage) == false)
				return false;
			
			return DeleteFromCondition(UserMemo.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}
		
		public bool DeleteUser(int userID, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			
			string strSopHistoryComponentQuery = string.Format("Update SopHistoryComponent set AccessedUserID = NULL Where AccessedUserID = {0}", userID);
			if (m_dbManager.GetResultData(strSopHistoryComponentQuery) == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return false;
			}
			
			string strSopAccountSessionQuery = string.Format("Delete from SopAccountSession Where AccountUserID = {0}", userID);
			if (m_dbManager.GetResultData(strSopAccountSessionQuery) == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return false;
			}
			
			string strSopHistoryActionStepQuery = string.Format("Update SopHistoryActionStep set LastAccessedUserID = NULL Where LastAccessedUserID = {0}", userID);
			if (m_dbManager.GetResultData(strSopHistoryActionStepQuery) == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return false;
			}
			
			Dictionary<User.Fields, object> dicConditions = new Dictionary<User.Fields, object>();
			dicConditions.Add(User.Fields.ID, userID);
			
			if (SetCondition<User.Fields>(ref strCondition, dicConditions, User.GetFieldName, User.TableName, ref strErrorMessage) == false)
				return false;
			
			return DeleteFromCondition(User.TableName, strCondition, strAdditionalConditions, out strErrorMessage);

		}

	}
}
