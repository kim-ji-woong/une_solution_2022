using System;
using System.Collections;
using System.Collections.Generic;
using dnsDBUtil;
using BusanTP.IDAL;
using BusanTP.Model;

namespace BusanTP.DAL
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

		public bool UpdateBusanExternalMaterial(Material obj, out string strErrorMessage)
		{
			Dictionary<Material.Fields, object> dicSets = new Dictionary<Material.Fields, object>();
			dicSets[Material.Fields.MaterialID] = obj.MaterialID;
			dicSets[Material.Fields.UniqueID] = obj.UniqueID;
			dicSets[Material.Fields.Min1] = obj.Min1;
			dicSets[Material.Fields.Max1] = obj.Max1;
			dicSets[Material.Fields.Min2] = obj.Min2;
			dicSets[Material.Fields.Max2] = obj.Max2;
			dicSets[Material.Fields.Direction] = obj.Direction;
			dicSets[Material.Fields.Info] = obj.Info;

			Dictionary<Material.Fields, object> dicConditions = new Dictionary<Material.Fields, object>();

			return UpdateBusanExternalMaterial(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateBusanExternalMaterial(Dictionary<Material.Fields, object> dicSets, Dictionary<Material.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<Material.Fields>(ref strSets, dicSets, Material.GetFieldName, Material.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<Material.Fields>(ref strCondition, dicConditions, Material.GetFieldName, Material.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(Material.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateBusanExternalSensor(Sensor obj, out string strErrorMessage)
		{
			Dictionary<Sensor.Fields, object> dicSets = new Dictionary<Sensor.Fields, object>();
			dicSets[Sensor.Fields.ID] = obj.ID;
			dicSets[Sensor.Fields.Name] = obj.Name;
			dicSets[Sensor.Fields.PositionName] = obj.PositionName;
			dicSets[Sensor.Fields.NodeID] = obj.NodeID;
			dicSets[Sensor.Fields.SensorType] = obj.SensorType;
			dicSets[Sensor.Fields.Latitude] = obj.Latitude;
			dicSets[Sensor.Fields.Longitude] = obj.Longitude;
			dicSets[Sensor.Fields.X] = obj.X;
			dicSets[Sensor.Fields.Y] = obj.Y;

			Dictionary<Sensor.Fields, object> dicConditions = new Dictionary<Sensor.Fields, object>();

			return UpdateBusanExternalSensor(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateBusanExternalSensor(Dictionary<Sensor.Fields, object> dicSets, Dictionary<Sensor.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<Sensor.Fields>(ref strSets, dicSets, Sensor.GetFieldName, Sensor.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<Sensor.Fields>(ref strCondition, dicConditions, Sensor.GetFieldName, Sensor.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(Sensor.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateBusanExternalSensorType(SensorType obj, out string strErrorMessage)
		{
			Dictionary<SensorType.Fields, object> dicSets = new Dictionary<SensorType.Fields, object>();
			dicSets[SensorType.Fields.ID] = obj.ID;
			dicSets[SensorType.Fields.Name] = obj.Name;
			dicSets[SensorType.Fields.EngName] = obj.EngName;

			Dictionary<SensorType.Fields, object> dicConditions = new Dictionary<SensorType.Fields, object>();

			return UpdateBusanExternalSensorType(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateBusanExternalSensorType(Dictionary<SensorType.Fields, object> dicSets, Dictionary<SensorType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<SensorType.Fields>(ref strSets, dicSets, SensorType.GetFieldName, SensorType.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<SensorType.Fields>(ref strCondition, dicConditions, SensorType.GetFieldName, SensorType.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(SensorType.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateBusanKWeatherNodeInfo(KWeatherNodeInfo obj, out string strErrorMessage)
		{
			Dictionary<KWeatherNodeInfo.Fields, object> dicSets = new Dictionary<KWeatherNodeInfo.Fields, object>();
			dicSets[KWeatherNodeInfo.Fields.ID] = obj.ID;
			dicSets[KWeatherNodeInfo.Fields.ZoneID] = obj.ZoneID;
			dicSets[KWeatherNodeInfo.Fields.UniqueKey] = obj.UniqueKey;
			dicSets[KWeatherNodeInfo.Fields.Name] = obj.Name;
			dicSets[KWeatherNodeInfo.Fields.ManagementNo] = obj.ManagementNo;
			dicSets[KWeatherNodeInfo.Fields.PositionName] = obj.PositionName;
			dicSets[KWeatherNodeInfo.Fields.SerialNo] = obj.SerialNo;
			dicSets[KWeatherNodeInfo.Fields.Latitude] = obj.Latitude;
			dicSets[KWeatherNodeInfo.Fields.Longitude] = obj.Longitude;

			Dictionary<KWeatherNodeInfo.Fields, object> dicConditions = new Dictionary<KWeatherNodeInfo.Fields, object>();

			return UpdateBusanKWeatherNodeInfo(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateBusanKWeatherNodeInfo(Dictionary<KWeatherNodeInfo.Fields, object> dicSets, Dictionary<KWeatherNodeInfo.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<KWeatherNodeInfo.Fields>(ref strSets, dicSets, KWeatherNodeInfo.GetFieldName, KWeatherNodeInfo.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<KWeatherNodeInfo.Fields>(ref strCondition, dicConditions, KWeatherNodeInfo.GetFieldName, KWeatherNodeInfo.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(KWeatherNodeInfo.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateBusanSdmsOption(SdmsOption obj, out string strErrorMessage)
		{
			Dictionary<SdmsOption.Fields, object> dicSets = new Dictionary<SdmsOption.Fields, object>();
			dicSets[SdmsOption.Fields.ID] = obj.ID;
			dicSets[SdmsOption.Fields.PropertyName] = obj.PropertyName;
			dicSets[SdmsOption.Fields.PropertyValue] = obj.PropertyValue;
			dicSets[SdmsOption.Fields.SiteID] = obj.SiteID;
			dicSets[SdmsOption.Fields.Description] = obj.Description;

			Dictionary<SdmsOption.Fields, object> dicConditions = new Dictionary<SdmsOption.Fields, object>();

			return UpdateBusanSdmsOption(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateBusanSdmsOption(Dictionary<SdmsOption.Fields, object> dicSets, Dictionary<SdmsOption.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<SdmsOption.Fields>(ref strSets, dicSets, SdmsOption.GetFieldName, SdmsOption.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<SdmsOption.Fields>(ref strCondition, dicConditions, SdmsOption.GetFieldName, SdmsOption.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(SdmsOption.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateBusanSensorDataHistory(SensorDataHistory obj, out string strErrorMessage)
		{
			Dictionary<SensorDataHistory.Fields, object> dicSets = new Dictionary<SensorDataHistory.Fields, object>();
			dicSets[SensorDataHistory.Fields.SensorID] = obj.SensorID;
			dicSets[SensorDataHistory.Fields.Value] = obj.Value;
			dicSets[SensorDataHistory.Fields.OriginTimeStamp] = obj.OriginTimeStamp;
			dicSets[SensorDataHistory.Fields.TimeStamp] = obj.TimeStamp;

			Dictionary<SensorDataHistory.Fields, object> dicConditions = new Dictionary<SensorDataHistory.Fields, object>();

			return UpdateBusanSensorDataHistory(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateBusanSensorDataHistory(Dictionary<SensorDataHistory.Fields, object> dicSets, Dictionary<SensorDataHistory.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<SensorDataHistory.Fields>(ref strSets, dicSets, SensorDataHistory.GetFieldName, SensorDataHistory.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<SensorDataHistory.Fields>(ref strCondition, dicConditions, SensorDataHistory.GetFieldName, SensorDataHistory.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(SensorDataHistory.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}
		
		public bool UpdateBusanUserMemo(UserMemo obj, out string strErrorMessage)
		{
			Dictionary<UserMemo.Fields, object> dicSets = new Dictionary<UserMemo.Fields, object>();
			dicSets[UserMemo.Fields.ID] = obj.ID;
			dicSets[UserMemo.Fields.UserID] = obj.UserID;
			dicSets[UserMemo.Fields.Memo] = obj.Memo;

			Dictionary<UserMemo.Fields, object> dicConditions = new Dictionary<UserMemo.Fields, object>();

			return UpdateBusanUserMemo(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateBusanUserMemo(Dictionary<UserMemo.Fields, object> dicSets, Dictionary<UserMemo.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";
			
			if (SetData<UserMemo.Fields>(ref strSets, dicSets, UserMemo.GetFieldName, UserMemo.TableName, ref strErrorMessage) == false)
				return false;

			if (SetCondition<UserMemo.Fields>(ref strCondition, dicConditions, UserMemo.GetFieldName, UserMemo.TableName, ref strErrorMessage) == false)
				return false;
			
			return UpdateFromCondition(UserMemo.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


	}
}
