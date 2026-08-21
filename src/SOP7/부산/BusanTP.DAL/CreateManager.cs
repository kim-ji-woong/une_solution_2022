using System;
using System.Collections;
using System.Collections.Generic;
using dnsDBUtil;
using BusanTP.IDAL;
using BusanTP.Model;

namespace BusanTP.DAL
{
	public class CreateManager : QueryManager, ICreate
	{
		private DataManager m_dataManager = null;
		private const int FindCountLimit = 100;

		public CreateManager(DataManager dataManager)
		{
			m_dataManager = dataManager;
			m_dbManager = m_dataManager.GetDBManager() as DirectDBManager;
		}

		private string GetInsertErrorMessage(string tableName)
		{
			return string.Format("{0} 테이블의 데이터 삽입에 실패하였습니다.", tableName);
		}

		private bool EqualsValue(object oldObj, object newObj)
		{
			if (oldObj == null && newObj == null)
				return true;

			if (oldObj is DateTime)
			{
				DateTime dt1, dt2;
				if (DateTime.TryParse(oldObj.ToString(), out dt1) && DateTime.TryParse(newObj.ToString(), out dt2))
				{
					if (Convert.ToDateTime(oldObj).ToString("yyyyMMddHHmmss") == Convert.ToDateTime(newObj).ToString("yyyyMMddHHmmss"))
						return true;
				}
				else
				{
					if (oldObj.ToString().Trim() == newObj.ToString().Trim())
						return true;
				}
			}

			return false;
		}

		public Material CreateBusanExternalMaterial(Material obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<Material.Fields, object> dicFieldDatas = new Dictionary<Material.Fields, object>();
			dicFieldDatas[Material.Fields.MaterialID] = obj.MaterialID;
			dicFieldDatas[Material.Fields.UniqueID] = obj.UniqueID;
			dicFieldDatas[Material.Fields.Min1] = obj.Min1;
			dicFieldDatas[Material.Fields.Max1] = obj.Max1;
			dicFieldDatas[Material.Fields.Min2] = obj.Min2;
			dicFieldDatas[Material.Fields.Max2] = obj.Max2;
			dicFieldDatas[Material.Fields.Direction] = obj.Direction;
			dicFieldDatas[Material.Fields.Info] = obj.Info;

			string strSQL = string.Format("Insert into {0} ({1}) values({2})",
				Material.TableName,
				GetFieldNames<Material.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				Material data = new Material();
				data.MaterialID = obj.MaterialID;
				data.UniqueID = obj.UniqueID;
				data.Min1 = obj.Min1;
				data.Max1 = obj.Max1;
				data.Min2 = obj.Min2;
				data.Max2 = obj.Max2;
				data.Direction = obj.Direction;
				data.Info = obj.Info;

				return data;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public Sensor CreateBusanExternalSensor(Sensor obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<Sensor.Fields, object> dicFieldDatas = new Dictionary<Sensor.Fields, object>();
			dicFieldDatas[Sensor.Fields.ID] = obj.ID;
			dicFieldDatas[Sensor.Fields.Name] = obj.Name;
			dicFieldDatas[Sensor.Fields.PositionName] = obj.PositionName;
			dicFieldDatas[Sensor.Fields.NodeID] = obj.NodeID;
			dicFieldDatas[Sensor.Fields.SensorType] = obj.SensorType;
			dicFieldDatas[Sensor.Fields.Latitude] = obj.Latitude;
			dicFieldDatas[Sensor.Fields.Longitude] = obj.Longitude;
			dicFieldDatas[Sensor.Fields.X] = obj.X;
			dicFieldDatas[Sensor.Fields.Y] = obj.Y;

			string strSQL = string.Format("Insert into {0} ({1}) values({2})",
				Sensor.TableName,
				GetFieldNames<Sensor.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				Sensor data = new Sensor();
				data.ID = obj.ID;
				data.Name = obj.Name;
				data.PositionName = obj.PositionName;
				data.NodeID = obj.NodeID;
				data.SensorType = obj.SensorType;
				data.Latitude = obj.Latitude;
				data.Longitude = obj.Longitude;
				data.X = obj.X;
				data.Y = obj.Y;

				return data;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public SensorType CreateBusanExternalSensorType(SensorType obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<SensorType.Fields, object> dicFieldDatas = new Dictionary<SensorType.Fields, object>();
			dicFieldDatas[SensorType.Fields.ID] = obj.ID;
			dicFieldDatas[SensorType.Fields.Name] = obj.Name;
			dicFieldDatas[SensorType.Fields.EngName] = obj.EngName;

			string strSQL = string.Format("Insert into {0} ({1}) values({2})",
				SensorType.TableName,
				GetFieldNames<SensorType.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				SensorType data = new SensorType();
				data.ID = obj.ID;
				data.Name = obj.Name;
				data.EngName = obj.EngName;

				return data;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public KWeatherNodeInfo CreateBusanKWeatherNodeInfo(KWeatherNodeInfo obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<KWeatherNodeInfo.Fields, object> dicFieldDatas = new Dictionary<KWeatherNodeInfo.Fields, object>();
			dicFieldDatas[KWeatherNodeInfo.Fields.ID] = obj.ID;
			dicFieldDatas[KWeatherNodeInfo.Fields.ZoneID] = obj.ZoneID;
			dicFieldDatas[KWeatherNodeInfo.Fields.UniqueKey] = obj.UniqueKey;
			dicFieldDatas[KWeatherNodeInfo.Fields.Name] = obj.Name;
			dicFieldDatas[KWeatherNodeInfo.Fields.ManagementNo] = obj.ManagementNo;
			dicFieldDatas[KWeatherNodeInfo.Fields.PositionName] = obj.PositionName;
			dicFieldDatas[KWeatherNodeInfo.Fields.SerialNo] = obj.SerialNo;
			dicFieldDatas[KWeatherNodeInfo.Fields.Latitude] = obj.Latitude;
			dicFieldDatas[KWeatherNodeInfo.Fields.Longitude] = obj.Longitude;

			string strSQL = string.Format("Insert into {0} ({1}) values({2})",
				KWeatherNodeInfo.TableName,
				GetFieldNames<KWeatherNodeInfo.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				KWeatherNodeInfo data = new KWeatherNodeInfo();
				data.ID = obj.ID;
				data.ZoneID = obj.ZoneID;
				data.UniqueKey = obj.UniqueKey;
				data.Name = obj.Name;
				data.ManagementNo = obj.ManagementNo;
				data.PositionName = obj.PositionName;
				data.SerialNo = obj.SerialNo;
				data.Latitude = obj.Latitude;
				data.Longitude = obj.Longitude;

				return data;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public SdmsOption CreateBusanSdmsOption(SdmsOption obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<SdmsOption.Fields, object> dicFieldDatas = new Dictionary<SdmsOption.Fields, object>();
			dicFieldDatas[SdmsOption.Fields.ID] = obj.ID;
			dicFieldDatas[SdmsOption.Fields.PropertyName] = obj.PropertyName;
			dicFieldDatas[SdmsOption.Fields.PropertyValue] = obj.PropertyValue;
			dicFieldDatas[SdmsOption.Fields.SiteID] = obj.SiteID;
			dicFieldDatas[SdmsOption.Fields.Description] = obj.Description;

			string strSQL = string.Format("Insert into {0} ({1}) values({2})",
				SdmsOption.TableName,
				GetFieldNames<SdmsOption.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				SdmsOption data = new SdmsOption();
				data.ID = obj.ID;
				data.PropertyName = obj.PropertyName;
				data.PropertyValue = obj.PropertyValue;
				data.SiteID = obj.SiteID;
				data.Description = obj.Description;

				return data;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public SensorDataHistory CreateBusanSensorDataHistory(SensorDataHistory obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<SensorDataHistory.Fields, object> dicFieldDatas = new Dictionary<SensorDataHistory.Fields, object>();
			dicFieldDatas[SensorDataHistory.Fields.SensorID] = obj.SensorID;
			dicFieldDatas[SensorDataHistory.Fields.Value] = obj.Value;
			dicFieldDatas[SensorDataHistory.Fields.OriginTimeStamp] = obj.OriginTimeStamp;
			dicFieldDatas[SensorDataHistory.Fields.TimeStamp] = obj.TimeStamp;

			string strSQL = string.Format("Insert into {0} ({1}) values({2})",
				SensorDataHistory.TableName,
				GetFieldNames<SensorDataHistory.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				SensorDataHistory data = new SensorDataHistory();
				data.SensorID = obj.SensorID;
				data.Value = obj.Value;
				data.OriginTimeStamp = obj.OriginTimeStamp;
				data.TimeStamp = obj.TimeStamp;

				return data;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}
		
		public UserMemo CreateBusanUserMemo(UserMemo obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<UserMemo.Fields, object> dicFieldDatas = new Dictionary<UserMemo.Fields, object>();
			dicFieldDatas[UserMemo.Fields.UserID] = obj.UserID;
			dicFieldDatas[UserMemo.Fields.Memo] = obj.Memo;

			string strSQL = string.Format("Insert into {0} ({1}) values(IsNull((SELECT MAX(ID) FROM {0} C), 0) + 1, {2})",
				UserMemo.TableName,
				GetFieldNames<UserMemo.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				UserMemo data = new UserMemo();
				data.UserID = obj.UserID;
				data.Memo = obj.Memo;

				return data;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}
		

		private bool IsSameTime(DateTime? time1, DateTime? time2)
		{
			if (time1 == null && time2 == null)
				return true;
			else if (time1 == null || time2 == null)
				return false;

			return IsSameTime2((DateTime)time1, (DateTime)time2);
		}

		private bool IsSameTime2(DateTime time1, DateTime time2)
		{
			if (time1.Year == time2.Year &&
				time1.Month == time2.Month &&
				time1.Day == time2.Day &&
				time1.Hour == time2.Hour &&
				time1.Minute == time2.Minute &&
				time1.Second == time2.Second)
				return true;

			return false;
		}

	}
}
