using System;
using System.Collections;
using System.Collections.Generic;
using dnsDBUtil;
using BusanTP.IDAL;
using BusanTP.Model;

namespace BusanTP.DAL
{
	public class SelectManager : QueryManager, ISelect
	{
		private DataManager m_dataManager = null;

		public SelectManager(DataManager dataManager)
		{
			m_dataManager = dataManager;
			m_dbManager = m_dataManager.GetDBManager() as DirectDBManager;
		}

		private void SetQuery(ref string strSQL, string strCondition, string strAdditionalConditions)
		{
			string strOrderBy = "";

			if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
			{
				if (strCondition.Length > 0)
				{
					if (strAdditionalConditions.Trim().ToLower().StartsWith("order by"))
						strOrderBy = strAdditionalConditions;
					else
						strCondition += " and " + strAdditionalConditions;
				}
				else
					strCondition = strAdditionalConditions;
			}
		}

		private string GetDateTimeString(DateTime time)
		{
			return string.Format("{0}-{1:00}-{2:00} {3:00}:{4:00}:{5:00}", time.Year, time.Month, time.Day, time.Hour, time.Minute, time.Second);
		}

		public List<Material> SelectBusanExternalMaterials(Dictionary<Material.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectBusanExternalMaterials(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<Material> SelectBusanExternalMaterials(Dictionary<Material.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<Material.Fields>(out nFieldCount), Material.TableName);

			string strCondition = "";

			if (SetCondition<Material.Fields>(ref strCondition, dicConditions, Material.GetFieldName, Material.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<Material> datas = new List<Material>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				Material model = ReadBusanExternalMaterial(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private Material ReadBusanExternalMaterial(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			Material model = new Material();
			bool isNullable;

			foreach (Material.Fields field in Material.Fields.GetValues(typeof(Material.Fields)))
			{
				string strFieldName = Material.GetFieldName(field, out isNullable);

				if (field == Material.Fields.MaterialID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.MaterialID = data.Data;
					}
				}
				else if (field == Material.Fields.UniqueID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.UniqueID = data.Data;
					}
				}
				else if (field == Material.Fields.Min1)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
						model.Min1 = null;
					else
					{
						model.Min1 = data.Data;
					}
				}
				else if (field == Material.Fields.Max1)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
						model.Max1 = null;
					else
					{
						model.Max1 = data.Data;
					}
				}
				else if (field == Material.Fields.Min2)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
						model.Min2 = null;
					else
					{
						model.Min2 = data.Data;
					}
				}
				else if (field == Material.Fields.Max2)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
						model.Max2 = null;
					else
					{
						model.Max2 = data.Data;
					}
				}
				else if (field == Material.Fields.Direction)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Direction = null;
					else
					{
						model.Direction = data.Data;
					}
				}
				else if (field == Material.Fields.Info)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Info = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Info = data;
					}
				}

				index++;
			}

			return model;
		}


		public List<Sensor> SelectBusanExternalSensors(Dictionary<Sensor.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectBusanExternalSensors(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<Sensor> SelectBusanExternalSensors(Dictionary<Sensor.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<Sensor.Fields>(out nFieldCount), Sensor.TableName);

			string strCondition = "";

			if (SetCondition<Sensor.Fields>(ref strCondition, dicConditions, Sensor.GetFieldName, Sensor.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<Sensor> datas = new List<Sensor>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				Sensor model = ReadBusanExternalSensor(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private Sensor ReadBusanExternalSensor(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			Sensor model = new Sensor();
			bool isNullable;

			foreach (Sensor.Fields field in Sensor.Fields.GetValues(typeof(Sensor.Fields)))
			{
				string strFieldName = Sensor.GetFieldName(field, out isNullable);

				if (field == Sensor.Fields.ID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.ID = data.Data;
					}
				}
				else if (field == Sensor.Fields.Name)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Name = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Name = data;
					}
				}
				else if (field == Sensor.Fields.PositionName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.PositionName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.PositionName = data;
					}
				}
				else if (field == Sensor.Fields.NodeID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.NodeID = null;
					else
					{
						model.NodeID = data.Data;
					}
				}
				else if (field == Sensor.Fields.SensorType)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.SensorType = null;
					else
					{
						model.SensorType = data.Data;
					}
				}
				else if (field == Sensor.Fields.Latitude)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
						model.Latitude = null;
					else
					{
						model.Latitude = data.Data;
					}
				}
				else if (field == Sensor.Fields.Longitude)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
						model.Longitude = null;
					else
					{
						model.Longitude = data.Data;
					}
				}
				else if (field == Sensor.Fields.X)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.X = null;
					else
					{
						model.X = data.Data;
					}
				}
				else if (field == Sensor.Fields.Y)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Y = null;
					else
					{
						model.Y = data.Data;
					}
				}
				else if (field == Sensor.Fields.ZoneID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());
					if (data == null)
						model.ZoneID = null;
					else
					{
						model.ZoneID = data.Data;
					}
				}

				index++;
			}

			return model;
		}


		public List<SensorType> SelectBusanExternalSensorTypes(Dictionary<SensorType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectBusanExternalSensorTypes(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<SensorType> SelectBusanExternalSensorTypes(Dictionary<SensorType.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<SensorType.Fields>(out nFieldCount), SensorType.TableName);

			string strCondition = "";

			if (SetCondition<SensorType.Fields>(ref strCondition, dicConditions, SensorType.GetFieldName, SensorType.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<SensorType> datas = new List<SensorType>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				SensorType model = ReadBusanExternalSensorType(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private SensorType ReadBusanExternalSensorType(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			SensorType model = new SensorType();
			bool isNullable;

			foreach (SensorType.Fields field in SensorType.Fields.GetValues(typeof(SensorType.Fields)))
			{
				string strFieldName = SensorType.GetFieldName(field, out isNullable);

				if (field == SensorType.Fields.ID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.ID = data.Data;
					}
				}
				else if (field == SensorType.Fields.Name)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Name = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Name = data;
					}
				}
				else if (field == SensorType.Fields.EngName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.EngName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.EngName = data;
					}
				}

				index++;
			}

			return model;
		}


		public List<KWeatherNodeInfo> SelectBusanKWeatherNodeInfos(Dictionary<KWeatherNodeInfo.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectBusanKWeatherNodeInfos(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<KWeatherNodeInfo> SelectBusanKWeatherNodeInfos(Dictionary<KWeatherNodeInfo.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<KWeatherNodeInfo.Fields>(out nFieldCount), KWeatherNodeInfo.TableName);

			string strCondition = "";

			if (SetCondition<KWeatherNodeInfo.Fields>(ref strCondition, dicConditions, KWeatherNodeInfo.GetFieldName, KWeatherNodeInfo.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<KWeatherNodeInfo> datas = new List<KWeatherNodeInfo>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				KWeatherNodeInfo model = ReadBusanKWeatherNodeInfo(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private KWeatherNodeInfo ReadBusanKWeatherNodeInfo(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			KWeatherNodeInfo model = new KWeatherNodeInfo();
			bool isNullable;

			foreach (KWeatherNodeInfo.Fields field in KWeatherNodeInfo.Fields.GetValues(typeof(KWeatherNodeInfo.Fields)))
			{
				string strFieldName = KWeatherNodeInfo.GetFieldName(field, out isNullable);

				if (field == KWeatherNodeInfo.Fields.ID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.ID = data.Data;
					}
				}
				else if (field == KWeatherNodeInfo.Fields.ZoneID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.ZoneID = data.Data;
					}
				}
				else if (field == KWeatherNodeInfo.Fields.UniqueKey)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.UniqueKey = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.UniqueKey = data;
					}
				}
				else if (field == KWeatherNodeInfo.Fields.Name)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Name = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Name = data;
					}
				}
				else if (field == KWeatherNodeInfo.Fields.ManagementNo)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.ManagementNo = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.ManagementNo = data;
					}
				}
				else if (field == KWeatherNodeInfo.Fields.PositionName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.PositionName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.PositionName = data;
					}
				}
				else if (field == KWeatherNodeInfo.Fields.SerialNo)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.SerialNo = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.SerialNo = data;
					}
				}
				else if (field == KWeatherNodeInfo.Fields.Latitude)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
						model.Latitude = null;
					else
					{
						model.Latitude = data.Data;
					}
				}
				else if (field == KWeatherNodeInfo.Fields.Longitude)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
						model.Longitude = null;
					else
					{
						model.Longitude = data.Data;
					}
				}

				index++;
			}

			return model;
		}


		public List<SdmsOption> SelectBusanSdmsOptions(Dictionary<SdmsOption.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectBusanSdmsOptions(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<SdmsOption> SelectBusanSdmsOptions(Dictionary<SdmsOption.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<SdmsOption.Fields>(out nFieldCount), SdmsOption.TableName);

			string strCondition = "";

			if (SetCondition<SdmsOption.Fields>(ref strCondition, dicConditions, SdmsOption.GetFieldName, SdmsOption.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<SdmsOption> datas = new List<SdmsOption>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				SdmsOption model = ReadBusanSdmsOption(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private SdmsOption ReadBusanSdmsOption(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			SdmsOption model = new SdmsOption();
			bool isNullable;

			foreach (SdmsOption.Fields field in SdmsOption.Fields.GetValues(typeof(SdmsOption.Fields)))
			{
				string strFieldName = SdmsOption.GetFieldName(field, out isNullable);

				if (field == SdmsOption.Fields.ID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.ID = data.Data;
					}
				}
				else if (field == SdmsOption.Fields.PropertyName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.PropertyName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.PropertyName = data;
					}
				}
				else if (field == SdmsOption.Fields.PropertyValue)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.PropertyValue = data.Data == 1;
					}
				}
				else if (field == SdmsOption.Fields.SiteID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.SiteID = data.Data;
					}
				}
				else if (field == SdmsOption.Fields.Description)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Description = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Description = data;
					}
				}

				index++;
			}

			return model;
		}


		public List<SensorDataHistory> SelectBusanSensorDataHistorys(Dictionary<SensorDataHistory.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectBusanSensorDataHistorys(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<SensorDataHistory> SelectBusanSensorDataHistorys(Dictionary<SensorDataHistory.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<SensorDataHistory.Fields>(out nFieldCount), SensorDataHistory.TableName);

			string strCondition = "";

			if (SetCondition<SensorDataHistory.Fields>(ref strCondition, dicConditions, SensorDataHistory.GetFieldName, SensorDataHistory.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<SensorDataHistory> datas = new List<SensorDataHistory>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				SensorDataHistory model = ReadBusanSensorDataHistory(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private SensorDataHistory ReadBusanSensorDataHistory(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			SensorDataHistory model = new SensorDataHistory();
			bool isNullable;

			foreach (SensorDataHistory.Fields field in SensorDataHistory.Fields.GetValues(typeof(SensorDataHistory.Fields)))
			{
				string strFieldName = SensorDataHistory.GetFieldName(field, out isNullable);

				if (field == SensorDataHistory.Fields.SensorID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.SensorID = null;
					else
					{
						model.SensorID = data.Data;
					}
				}
				else if (field == SensorDataHistory.Fields.Value)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
						model.Value = null;
					else
					{
						model.Value = data.Data;
					}
				}
				else if (field == SensorDataHistory.Fields.OriginTimeStamp)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.OriginTimeStamp = null;
					else
					{
						model.OriginTimeStamp = data.Data;
					}
				}
				else if (field == SensorDataHistory.Fields.TimeStamp)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index].ToString());

					if (data == null)
						model.TimeStamp = null;
					else
					{
						model.TimeStamp = data.Data;
					}
				}

				index++;
			}

			return model;
		}
		
		public List<SensorGIS> SelectBusanExternalSensorGISs(Dictionary<SensorGIS.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectBusanExternalSensorGISs(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}
		
		public List<SensorGIS> SelectBusanExternalSensorGISs(Dictionary<SensorGIS.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<SensorGIS.Fields>(out nFieldCount), SensorGIS.TableName);

			string strCondition = "";

			if (SetCondition<SensorGIS.Fields>(ref strCondition, dicConditions, SensorGIS.GetFieldName, SensorGIS.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<SensorGIS> datas = new List<SensorGIS>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				SensorGIS model = ReadBusanExternalSensorGIS(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private SensorGIS ReadBusanExternalSensorGIS(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			SensorGIS model = new SensorGIS();
			bool isNullable;

			foreach (SensorGIS.Fields field in SensorGIS.Fields.GetValues(typeof(SensorGIS.Fields)))
			{
				string strFieldName = SensorGIS.GetFieldName(field, out isNullable);

				if (field == SensorGIS.Fields.ID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.ID = data.Data;
					}
				}
				else if (field == SensorGIS.Fields.PositionX)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.PositionX = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.PositionX = data;
					}
				}
				else if (field == SensorGIS.Fields.PositionY)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.PositionY = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.PositionY = data;
					}
				}
				else if (field == SensorGIS.Fields.PositionZ)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.PositionZ = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.PositionZ = data;
					}
				}
				else if (field == SensorGIS.Fields.RotationX)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.RotationX = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.RotationX = data;
					}
				}
				else if (field == SensorGIS.Fields.RotationY)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.RotationY = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.RotationY = data;
					}
				}
				else if (field == SensorGIS.Fields.RotationZ)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.RotationZ = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.RotationZ = data;
					}
				}
				else if (field == SensorGIS.Fields.Zoom)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Zoom = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Zoom = data;
					}
				}
				else if (field == SensorGIS.Fields.ZoneIDs)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.ZoneIDs = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.ZoneIDs = data;
					}
				}
				else if (field == SensorGIS.Fields.PositionName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.PositionName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.PositionName = data;
					}
				}

				index++;
			}

			return model;
		}

		public List<POIInfo> SelectBusanExternalPOIInfos(Dictionary<POIInfo.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectBusanExternalPOIInfos(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}
		
		public List<POIInfo> SelectBusanExternalPOIInfos(Dictionary<POIInfo.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<POIInfo.Fields>(out nFieldCount), POIInfo.TableName);

			string strCondition = "";

			if (SetCondition<POIInfo.Fields>(ref strCondition, dicConditions, POIInfo.GetFieldName, POIInfo.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<POIInfo> datas = new List<POIInfo>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				POIInfo model = ReadBusanExternalPOIInfo(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private POIInfo ReadBusanExternalPOIInfo(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			POIInfo model = new POIInfo();
			bool isNullable;

			foreach (POIInfo.Fields field in POIInfo.Fields.GetValues(typeof(POIInfo.Fields)))
			{
				string strFieldName = POIInfo.GetFieldName(field, out isNullable);

				if (field == POIInfo.Fields.ID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.ID = data.Data;
					}
				}
				else if (field == POIInfo.Fields.POIType)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString()); 

					if (data == null)
					{
						if (isNullable)
							model.POIType = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.POIType = data.Data;
					}
				}
				else if (field == POIInfo.Fields.POIName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.POIName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.POIName = data;
					}
				}
				else if (field == POIInfo.Fields.Latitude)
				{ 
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
					{
						if (isNullable)
							model.Latitude = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Latitude = data.Data;
					}
				}
				else if (field == POIInfo.Fields.Longitude)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
					{
						if (isNullable)
							model.Longitude = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Longitude = data.Data;
					}
				}
				else if (field == POIInfo.Fields.X)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
					{
						if (isNullable)
							model.X = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.X = data.Data;
					}
				}
				else if (field == POIInfo.Fields.Y)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
					{
						if (isNullable)
							model.Y = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Y = data.Data;
					}
				}
				else if (field == POIInfo.Fields.Z)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
					{
						if (isNullable)
							model.Z = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Z = data.Data;
					}
				}
				else if (field == POIInfo.Fields.SpaceID)
				{
					VariousData<int> data = WebDBManager.GetIntField((arrResult[index].ToString()));

					if (data == null)
					{
						if (isNullable)
							model.SpaceID = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.SpaceID = data.Data;
					}
				}

				index++;
			}

			return model;
		}
		
	}
}
