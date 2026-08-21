using System;
using System.Collections;
using System.Collections.Generic;
using dnsDBUtil;
using EDMS.IDAL;
using EDMS.Model;

namespace EDMS.DAL
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

		public Facility SelectEdmsFacility(int id, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where ID = {2} ", 
				GetFieldNames<Facility.Fields>(out nFieldCount), Facility.TableName
				, id);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				Facility model = ReadEdmsFacility(arrResult, 0, out strErrorMessage);

				if (model == null)
					return null;

				return model;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public List<Facility> SelectEdmsFacilities(Dictionary<Facility.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectEdmsFacilities(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<Facility> SelectEdmsFacilities(Dictionary<Facility.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<Facility.Fields>(out nFieldCount), Facility.TableName);

			string strCondition = "";

			if (SetCondition<Facility.Fields>(ref strCondition, dicConditions, Facility.GetFieldName, Facility.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<Facility> datas = new List<Facility>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				Facility model = ReadEdmsFacility(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private Facility ReadEdmsFacility(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			Facility model = new Facility();
			bool isNullable;

			foreach (Facility.Fields field in Facility.Fields.GetValues(typeof(Facility.Fields)))
			{
				string strFieldName = Facility.GetFieldName(field, out isNullable);

				if (field == Facility.Fields.ID)
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
				else if (field == Facility.Fields.ModelName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.ModelName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.ModelName = data;
					}
				}
				else if (field == Facility.Fields.IsPoi)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.IsPoi = data.Data == 1;
					}
				}
				else if (field == Facility.Fields.LinkedPipe)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.LinkedPipe = null;
					else
					{
						model.LinkedPipe = data.Data == 1;
					}
				}
				else if (field == Facility.Fields.RunPipeBall)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.RunPipeBall = null;
					else
					{
						model.RunPipeBall = data.Data == 1;
					}
				}
				else if (field == Facility.Fields.ShowPopup)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.ShowPopup = data.Data == 1;
					}
				}
				else if (field == Facility.Fields.SensorName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.SensorName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.SensorName = data;
					}
				}
				else if (field == Facility.Fields.ShowTreeView)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.ShowTreeView = data.Data == 1;
					}
				}
				else if (field == Facility.Fields.ZoneID)
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
				else if (field == Facility.Fields.MaterialTypeID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.MaterialTypeID = data.Data;
					}
				}

				index++;
			}

			return model;
		}


		public FacilityCameraData SelectEdmsFacilityCameraData(int id, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where ID = {2} ", 
				GetFieldNames<FacilityCameraData.Fields>(out nFieldCount), FacilityCameraData.TableName
				, id);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				FacilityCameraData model = ReadEdmsFacilityCameraData(arrResult, 0, out strErrorMessage);

				if (model == null)
					return null;

				return model;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public List<FacilityCameraData> SelectEdmsFacilityCameraDatas(Dictionary<FacilityCameraData.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectEdmsFacilityCameraDatas(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<FacilityCameraData> SelectEdmsFacilityCameraDatas(Dictionary<FacilityCameraData.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<FacilityCameraData.Fields>(out nFieldCount), FacilityCameraData.TableName);

			string strCondition = "";

			if (SetCondition<FacilityCameraData.Fields>(ref strCondition, dicConditions, FacilityCameraData.GetFieldName, FacilityCameraData.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<FacilityCameraData> datas = new List<FacilityCameraData>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				FacilityCameraData model = ReadEdmsFacilityCameraData(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private FacilityCameraData ReadEdmsFacilityCameraData(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			FacilityCameraData model = new FacilityCameraData();
			bool isNullable;

			foreach (FacilityCameraData.Fields field in FacilityCameraData.Fields.GetValues(typeof(FacilityCameraData.Fields)))
			{
				string strFieldName = FacilityCameraData.GetFieldName(field, out isNullable);

				if (field == FacilityCameraData.Fields.ID)
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
				else if (field == FacilityCameraData.Fields.FacilityID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.FacilityID = data.Data;
					}
				}
				else if (field == FacilityCameraData.Fields.CameraPositionX)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.CameraPositionX = data.Data;
					}
				}
				else if (field == FacilityCameraData.Fields.CameraPositionY)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.CameraPositionY = data.Data;
					}
				}
				else if (field == FacilityCameraData.Fields.CameraPositionZ)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.CameraPositionZ = data.Data;
					}
				}
				else if (field == FacilityCameraData.Fields.CameraQuaternionX)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.CameraQuaternionX = data.Data;
					}
				}
				else if (field == FacilityCameraData.Fields.CameraQuaternionY)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.CameraQuaternionY = data.Data;
					}
				}
				else if (field == FacilityCameraData.Fields.CameraQuaternionZ)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.CameraQuaternionZ = data.Data;
					}
				}
				else if (field == FacilityCameraData.Fields.CameraQuaternionW)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.CameraQuaternionW = data.Data;
					}
				}
				else if (field == FacilityCameraData.Fields.CameraRotationX)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.CameraRotationX = data.Data;
					}
				}
				else if (field == FacilityCameraData.Fields.CameraRotationY)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.CameraRotationY = data.Data;
					}
				}
				else if (field == FacilityCameraData.Fields.CameraRotationZ)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.CameraRotationZ = data.Data;
					}
				}
				else if (field == FacilityCameraData.Fields.CameraFov)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.CameraFov = data.Data;
					}
				}
				else if (field == FacilityCameraData.Fields.CameraNear)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.CameraNear = data.Data;
					}
				}
				else if (field == FacilityCameraData.Fields.CameraFar)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.CameraFar = data.Data;
					}
				}
				else if (field == FacilityCameraData.Fields.OrbitTargetX)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.OrbitTargetX = data.Data;
					}
				}
				else if (field == FacilityCameraData.Fields.OrbitTargetY)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.OrbitTargetY = data.Data;
					}
				}
				else if (field == FacilityCameraData.Fields.OrbitTargetZ)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.OrbitTargetZ = data.Data;
					}
				}

				index++;
			}

			return model;
		}


	}
}
