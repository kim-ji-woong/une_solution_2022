using System.Collections.Generic;
using dnsDBUtil;
using BusanTP.IDAL;
using BusanTP.Model;

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


	}
}
