using System;
using System.Collections;
using System.Collections.Generic;
using dnsDBUtil;
using GGH.IDAL;
using GGH.Model.CCTV;
using GGH.Model;
using GGH.Model.Equipment;

namespace GGH.DAL
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

		public Nvr CreateNvr(Nvr obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<Nvr.Fields, object> dicFieldDatas = new Dictionary<Nvr.Fields, object>();
			dicFieldDatas[Nvr.Fields.Name] = obj.Name;
			dicFieldDatas[Nvr.Fields.Url] = obj.Url;
			dicFieldDatas[Nvr.Fields.Description] = obj.Description;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ID) FROM {0} C), 0) + 1, {2})",
				Nvr.TableName,
				GetFieldNames<Nvr.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", Nvr.GetFieldName(Nvr.Fields.ID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<Nvr> datas = m_dataManager.GetSelectManager().SelectNvrs(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameNvr(obj, datas[0]))
					return datas[0];

				return GetNvr(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameNvr(Nvr oldObject, Nvr newObject)
		{
			if (oldObject.Name == newObject.Name &&
				oldObject.Url == newObject.Url &&
				oldObject.Description == newObject.Description)
				return true;

			return false;
		}

		private Nvr GetNvr(Nvr obj, int id, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", Nvr.GetFieldName(Nvr.Fields.ID, out isNullable), id);

			List<Nvr> datas = m_dataManager.GetSelectManager().SelectNvrs(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (Nvr data in datas)
			{
				if (IsSameNvr(data, obj))
					return data;

				if (data.ID < id)
					id = data.ID;
			}

			if (nCount < nLimit)
				return GetNvr(obj, id, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(Nvr.TableName);
			return null;
		}

		public NvrLink CreateNvrLink(NvrLink obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<NvrLink.Fields, object> dicFieldDatas = new Dictionary<NvrLink.Fields, object>();

			string strSQL = string.Format("Insert into {0} ({1}) values ({2})",
				NvrLink.TableName,
				GetFieldNames<NvrLink.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				NvrLink link = new NvrLink();
				link.CctvID = obj.CctvID;
				link.NvrID = obj.NvrID;
				return link;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public Evacuation CreateEvacuation(Evacuation obj, out string strErrorMessage)
        {
			strErrorMessage = null;
			Dictionary<Evacuation.Fields, object> dicFieldDatas = new Dictionary<Evacuation.Fields, object>();

			string strSQL = string.Format("Insert into {0} ({1}) values ({2})",
				Evacuation.TableName,
				GetFieldNames<Evacuation.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				Evacuation evac = new Evacuation();
				evac.SiteID = obj.SiteID;
				evac.UniqueKey = obj.UniqueKey;
				evac.TimeStamp = obj.TimeStamp;
				evac.IsEvac = obj.IsEvac;
				return evac;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public ParkingGate CreateParkingGate(ParkingGate obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<ParkingGate.Fields, object> dicFieldDatas = new Dictionary<ParkingGate.Fields, object>();
			dicFieldDatas[ParkingGate.Fields.Name] = obj.Name;
			dicFieldDatas[ParkingGate.Fields.GateCode] = obj.GateCode;
			dicFieldDatas[ParkingGate.Fields.InOut] = obj.InOut;
			dicFieldDatas[ParkingGate.Fields.Status] = obj.Status;
			dicFieldDatas[ParkingGate.Fields.SiteID] = obj.SiteID;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ID) FROM {0} C), 0) + 1, {2})",
				ParkingGate.TableName,
				GetFieldNames<ParkingGate.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", ParkingGate.GetFieldName(ParkingGate.Fields.ID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<ParkingGate> datas = m_dataManager.GetSelectManager().SelectParkingGates(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameParkingGate(obj, datas[0]))
					return datas[0];

				return GetParkingGate(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameParkingGate(ParkingGate oldObject, ParkingGate newObject)
		{
			if (oldObject.Name == newObject.Name &&
				oldObject.GateCode == newObject.GateCode &&
				oldObject.InOut == newObject.InOut &&
				oldObject.Status == newObject.Status &&
				oldObject.SiteID == newObject.SiteID)
				return true;

			return false;
		}

		private ParkingGate GetParkingGate(ParkingGate obj, int id, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", ParkingGate.GetFieldName(ParkingGate.Fields.ID, out isNullable), id);

			List<ParkingGate> datas = m_dataManager.GetSelectManager().SelectParkingGates(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (ParkingGate data in datas)
			{
				if (IsSameParkingGate(data, obj))
					return data;

				if (data.ID < id)
					id = data.ID;
			}

			if (nCount < nLimit)
				return GetParkingGate(obj, id, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(ParkingGate.TableName);
			return null;
		}

		public UpdateData CreateUpdateData(UpdateData obj, out string strErrorMessage)
        {
			strErrorMessage = null;
			Dictionary<UpdateData.Fields, object> dicFieldDatas = new Dictionary<UpdateData.Fields, object>();
			dicFieldDatas[UpdateData.Fields.Timestamp] = obj.Timestamp;
			dicFieldDatas[UpdateData.Fields.NameOfTable] = obj.NameOfTable;
			dicFieldDatas[UpdateData.Fields.FieldList] = obj.FieldList;
			dicFieldDatas[UpdateData.Fields.ValueList] = obj.ValueList;
			dicFieldDatas[UpdateData.Fields.PrimaryCondition] = obj.PrimaryCondition;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ID) FROM {0} C), 0) + 1, {2})",
				UpdateData.TableName,
				GetFieldNames<UpdateData.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", UpdateData.GetFieldName(UpdateData.Fields.ID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<UpdateData> datas = m_dataManager.GetSelectManager().SelectUpdateDatas(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameUpdateData(obj, datas[0]))
					return datas[0];

				return GetUpdateData(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameUpdateData(UpdateData oldObject, UpdateData newObject)
		{
			if (IsSameTime2(oldObject.Timestamp, newObject.Timestamp) &&
				oldObject.NameOfTable == newObject.NameOfTable &&
				oldObject.FieldList == newObject.FieldList &&
				oldObject.ValueList == newObject.ValueList &&
				oldObject.PrimaryCondition == newObject.PrimaryCondition)
				return true;

			return false;
		}

		private UpdateData GetUpdateData(UpdateData obj, int id, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", UpdateData.GetFieldName(UpdateData.Fields.ID, out isNullable), id);

			List<UpdateData> datas = m_dataManager.GetSelectManager().SelectUpdateDatas(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (UpdateData data in datas)
			{
				if (IsSameUpdateData(data, obj))
					return data;

				if (data.ID < id)
					id = data.ID;
			}

			if (nCount < nLimit)
				return GetUpdateData(obj, id, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(UpdateData.TableName);
			return null;
		}

		public Model.History.Earthquake CreateHistoryEarthquake(Model.History.Earthquake obj, out string strErrorMessage)
        {
			strErrorMessage = null;
			Dictionary<Model.History.Earthquake.Fields, object> dicFieldDatas = new Dictionary<Model.History.Earthquake.Fields, object>();
			dicFieldDatas[Model.History.Earthquake.Fields.Hpga] = obj.Hpga;
			dicFieldDatas[Model.History.Earthquake.Fields.Tpga] = obj.Tpga;
			dicFieldDatas[Model.History.Earthquake.Fields.Gal] = obj.Gal;
			dicFieldDatas[Model.History.Earthquake.Fields.Intensity] = obj.Intensity;

			string strSQL = string.Format("Insert into {0} ({1}) values ({2}, {3})",
				Model.History.Earthquake.TableName,
				GetFieldNames<Model.History.Earthquake.Fields>(),
				obj.TimeStamp,
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				Model.History.Earthquake earthquake = new Model.History.Earthquake();

				earthquake.Gal = obj.Gal;
				earthquake.Hpga = obj.Hpga;
				earthquake.Intensity = obj.Intensity;
				earthquake.TimeStamp = obj.TimeStamp;
				earthquake.Tpga = obj.Tpga;

				return earthquake;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public FirstAidEquipment CreateFirstAidEquipment(FirstAidEquipment obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<FirstAidEquipment.Fields, object> dicFieldDatas = new Dictionary<FirstAidEquipment.Fields, object>();
			dicFieldDatas[FirstAidEquipment.Fields.EquipmentType] = obj.EquipmentType;
			dicFieldDatas[FirstAidEquipment.Fields.EquipmentName] = obj.EquipmentName;
			dicFieldDatas[FirstAidEquipment.Fields.ZoneID] = obj.ZoneID;
			dicFieldDatas[FirstAidEquipment.Fields.X] = obj.X;
			dicFieldDatas[FirstAidEquipment.Fields.Y] = obj.Y;
			dicFieldDatas[FirstAidEquipment.Fields.Z] = obj.Z;
			dicFieldDatas[FirstAidEquipment.Fields.SiteID] = obj.SiteID;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ID) FROM {0} C), 0) + 1, {2})",
				FirstAidEquipment.TableName,
				GetFieldNames<FirstAidEquipment.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", FirstAidEquipment.GetFieldName(FirstAidEquipment.Fields.ID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<FirstAidEquipment> datas = m_dataManager.GetSelectManager().SelectFirstAidEquipments(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameFirstAidEquipment(obj, datas[0]))
					return datas[0];

				return GetFirstAidEquipment(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameFirstAidEquipment(FirstAidEquipment oldObject, FirstAidEquipment newObject)
		{
			if (oldObject.EquipmentType == newObject.EquipmentType &&
				oldObject.EquipmentName == newObject.EquipmentName &&
				oldObject.ZoneID == newObject.ZoneID &&
				IsSameDouble(oldObject.X, newObject.X) &&
				IsSameDouble(oldObject.Y, newObject.Y) &&
				IsSameDouble(oldObject.Z, newObject.Z) &&
				oldObject.SiteID == newObject.SiteID)
				return true;

			return false;
		}

		private FirstAidEquipment GetFirstAidEquipment(FirstAidEquipment obj, int id, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", FirstAidEquipment.GetFieldName(FirstAidEquipment.Fields.ID, out isNullable), id);

			List<FirstAidEquipment> datas = m_dataManager.GetSelectManager().SelectFirstAidEquipments(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (FirstAidEquipment data in datas)
			{
				if (IsSameFirstAidEquipment(data, obj))
					return data;

				if (data.ID < id)
					id = data.ID;
			}

			if (nCount < nLimit)
				return GetFirstAidEquipment(obj, id, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(FirstAidEquipment.TableName);
			return null;
		}

		public FirstAidEquipmentType CreateFirstAidEquipmentType(FirstAidEquipmentType obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<FirstAidEquipmentType.Fields, object> dicFieldDatas = new Dictionary<FirstAidEquipmentType.Fields, object>();
			dicFieldDatas[FirstAidEquipmentType.Fields.EquipmentType] = obj.EquipmentType;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ID) FROM {0} C), 0) + 1, {2})",
				FirstAidEquipmentType.TableName,
				GetFieldNames<FirstAidEquipmentType.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", FirstAidEquipmentType.GetFieldName(FirstAidEquipmentType.Fields.ID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<FirstAidEquipmentType> datas = m_dataManager.GetSelectManager().SelectFirstAidEquipmentTypes(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameFirstAidEquipmentType(obj, datas[0]))
					return datas[0];

				return GetFirstAidEquipmentType(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameFirstAidEquipmentType(FirstAidEquipmentType oldObject, FirstAidEquipmentType newObject)
		{
			if (oldObject.EquipmentType == newObject.EquipmentType &&
				oldObject.EquipmentTypeEng == newObject.EquipmentTypeEng)
				return true;

			return false;
		}

		private FirstAidEquipmentType GetFirstAidEquipmentType(FirstAidEquipmentType obj, int id, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", FirstAidEquipmentType.GetFieldName(FirstAidEquipmentType.Fields.ID, out isNullable), id);

			List<FirstAidEquipmentType> datas = m_dataManager.GetSelectManager().SelectFirstAidEquipmentTypes(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (FirstAidEquipmentType data in datas)
			{
				if (IsSameFirstAidEquipmentType(data, obj))
					return data;

				if (data.ID < id)
					id = data.ID;
			}

			if (nCount < nLimit)
				return GetFirstAidEquipmentType(obj, id, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(FirstAidEquipmentType.TableName);
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

		private bool IsSameDouble(double? data1, double? data2)
        {
			if (data1 == null && data2 == null)
				return true;
			else if (data1 == null || data2 == null)
				return false;

			return IsSameDouble2((double)data1, (double)data2);
        }

		private bool IsSameDouble2(double data1, double data2)
        {
			return Math.Abs(data1 - data2) < 0.001;
        }
	}
}
