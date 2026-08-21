using System;
using System.Collections;
using System.Collections.Generic;
using dnsDBUtil;
using EDMS.IDAL;
using EDMS.Model;

namespace EDMS.DAL
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

		public Facility CreateEdmsFacility(Facility obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<Facility.Fields, object> dicFieldDatas = new Dictionary<Facility.Fields, object>();
			dicFieldDatas[Facility.Fields.ModelName] = obj.ModelName;
			dicFieldDatas[Facility.Fields.IsPoi] = obj.IsPoi;
			dicFieldDatas[Facility.Fields.LinkedPipe] = obj.LinkedPipe;
			dicFieldDatas[Facility.Fields.RunPipeBall] = obj.RunPipeBall;
			dicFieldDatas[Facility.Fields.ShowPopup] = obj.ShowPopup;
			dicFieldDatas[Facility.Fields.SensorName] = obj.SensorName;
			dicFieldDatas[Facility.Fields.ShowTreeView] = obj.ShowTreeView;
			dicFieldDatas[Facility.Fields.ZoneID] = obj.ZoneID;
			dicFieldDatas[Facility.Fields.MaterialTypeID] = obj.MaterialTypeID;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ID) FROM {0} C), 0) + 1, {2})",
				Facility.TableName,
				GetFieldNames<Facility.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", Facility.GetFieldName(Facility.Fields.ID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<Facility> datas = m_dataManager.GetSelectManager().SelectEdmsFacilities(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameEdmsFacility(obj, datas[0]))
					return datas[0];

				return GetEdmsFacility(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameEdmsFacility(Facility oldObject, Facility newObject)
		{
			if (oldObject.ModelName == newObject.ModelName &&
				oldObject.IsPoi == newObject.IsPoi &&
				oldObject.LinkedPipe == newObject.LinkedPipe &&
				oldObject.RunPipeBall == newObject.RunPipeBall &&
				oldObject.ShowPopup == newObject.ShowPopup &&
				oldObject.SensorName == newObject.SensorName &&
				oldObject.ShowTreeView == newObject.ShowTreeView &&
				oldObject.ZoneID == newObject.ZoneID &&
				oldObject.MaterialTypeID == newObject.MaterialTypeID)
				return true;

			return false;
		}

		private Facility GetEdmsFacility(Facility obj, int id, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", Facility.GetFieldName(Facility.Fields.ID, out isNullable), id);

			List<Facility> datas = m_dataManager.GetSelectManager().SelectEdmsFacilities(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (Facility data in datas)
			{
				if (IsSameEdmsFacility(data, obj))
					return data;

				if (data.ID < id)
					id = data.ID;
			}

			if (nCount < nLimit)
				return GetEdmsFacility(obj, id, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(Facility.TableName);
			return null;
		}

		public FacilityCameraData CreateEdmsFacilityCameraData(FacilityCameraData obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<FacilityCameraData.Fields, object> dicFieldDatas = new Dictionary<FacilityCameraData.Fields, object>();
			dicFieldDatas[FacilityCameraData.Fields.FacilityID] = obj.FacilityID;
			dicFieldDatas[FacilityCameraData.Fields.CameraPositionX] = obj.CameraPositionX;
			dicFieldDatas[FacilityCameraData.Fields.CameraPositionY] = obj.CameraPositionY;
			dicFieldDatas[FacilityCameraData.Fields.CameraPositionZ] = obj.CameraPositionZ;
			dicFieldDatas[FacilityCameraData.Fields.CameraQuaternionX] = obj.CameraQuaternionX;
			dicFieldDatas[FacilityCameraData.Fields.CameraQuaternionY] = obj.CameraQuaternionY;
			dicFieldDatas[FacilityCameraData.Fields.CameraQuaternionZ] = obj.CameraQuaternionZ;
			dicFieldDatas[FacilityCameraData.Fields.CameraQuaternionW] = obj.CameraQuaternionW;
			dicFieldDatas[FacilityCameraData.Fields.CameraRotationX] = obj.CameraRotationX;
			dicFieldDatas[FacilityCameraData.Fields.CameraRotationY] = obj.CameraRotationY;
			dicFieldDatas[FacilityCameraData.Fields.CameraRotationZ] = obj.CameraRotationZ;
			dicFieldDatas[FacilityCameraData.Fields.CameraFov] = obj.CameraFov;
			dicFieldDatas[FacilityCameraData.Fields.CameraNear] = obj.CameraNear;
			dicFieldDatas[FacilityCameraData.Fields.CameraFar] = obj.CameraFar;
			dicFieldDatas[FacilityCameraData.Fields.OrbitTargetX] = obj.OrbitTargetX;
			dicFieldDatas[FacilityCameraData.Fields.OrbitTargetY] = obj.OrbitTargetY;
			dicFieldDatas[FacilityCameraData.Fields.OrbitTargetZ] = obj.OrbitTargetZ;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ID) FROM {0} C), 0) + 1, {2})",
				FacilityCameraData.TableName,
				GetFieldNames<FacilityCameraData.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", FacilityCameraData.GetFieldName(FacilityCameraData.Fields.ID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<FacilityCameraData> datas = m_dataManager.GetSelectManager().SelectEdmsFacilityCameraDatas(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameEdmsFacilityCameraData(obj, datas[0]))
					return datas[0];

				return GetEdmsFacilityCameraData(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameEdmsFacilityCameraData(FacilityCameraData oldObject, FacilityCameraData newObject)
		{
			if (oldObject.FacilityID == newObject.FacilityID &&
				oldObject.CameraPositionX == newObject.CameraPositionX &&
				oldObject.CameraPositionY == newObject.CameraPositionY &&
				oldObject.CameraPositionZ == newObject.CameraPositionZ &&
				oldObject.CameraQuaternionX == newObject.CameraQuaternionX &&
				oldObject.CameraQuaternionY == newObject.CameraQuaternionY &&
				oldObject.CameraQuaternionZ == newObject.CameraQuaternionZ &&
				oldObject.CameraQuaternionW == newObject.CameraQuaternionW &&
				oldObject.CameraRotationX == newObject.CameraRotationX &&
				oldObject.CameraRotationY == newObject.CameraRotationY &&
				oldObject.CameraRotationZ == newObject.CameraRotationZ &&
				oldObject.CameraFov == newObject.CameraFov &&
				oldObject.CameraNear == newObject.CameraNear &&
				oldObject.CameraFar == newObject.CameraFar &&
				oldObject.OrbitTargetX == newObject.OrbitTargetX &&
				oldObject.OrbitTargetY == newObject.OrbitTargetY &&
				oldObject.OrbitTargetZ == newObject.OrbitTargetZ)
				return true;

			return false;
		}

		private FacilityCameraData GetEdmsFacilityCameraData(FacilityCameraData obj, int id, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", FacilityCameraData.GetFieldName(FacilityCameraData.Fields.ID, out isNullable), id);

			List<FacilityCameraData> datas = m_dataManager.GetSelectManager().SelectEdmsFacilityCameraDatas(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (FacilityCameraData data in datas)
			{
				if (IsSameEdmsFacilityCameraData(data, obj))
					return data;

				if (data.ID < id)
					id = data.ID;
			}

			if (nCount < nLimit)
				return GetEdmsFacilityCameraData(obj, id, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(FacilityCameraData.TableName);
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
