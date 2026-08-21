using System;
using System.Collections;
using System.Collections.Generic;
using dnsDBUtil;
using Safety.IDAL;
using Safety.Model.Sop.Team;

namespace Safety.DAL
{
	public class SelectManager : QueryManager, ISelect
	{
		private DataManager m_dataManager = null;

		public SelectManager(DataManager dataManager)
		{
			m_dataManager = dataManager;
			m_dbManager = m_dataManager.GetDBManager() as DirectDBManager;
			//m_dbManager = m_dataManager.GetDBManager() as WebDBManager;
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

		public List<RegularMemberInfo> SelectSopTeamRegularMemberInfos(Dictionary<RegularMemberInfo.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectSopTeamRegularMemberInfos(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<RegularMemberInfo> SelectSopTeamRegularMemberInfos(Dictionary<RegularMemberInfo.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<RegularMemberInfo.Fields>(out nFieldCount), RegularMemberInfo.TableName);

			string strCondition = "";

			if (SetCondition<RegularMemberInfo.Fields>(ref strCondition, dicConditions, RegularMemberInfo.GetFieldName, RegularMemberInfo.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<RegularMemberInfo> datas = new List<RegularMemberInfo>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				RegularMemberInfo model = ReadSopTeamRegularMemberInfo(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private RegularMemberInfo ReadSopTeamRegularMemberInfo(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			RegularMemberInfo model = new RegularMemberInfo();
			bool isNullable;

			foreach (RegularMemberInfo.Fields field in RegularMemberInfo.Fields.GetValues(typeof(RegularMemberInfo.Fields)))
			{
				string strFieldName = RegularMemberInfo.GetFieldName(field, out isNullable);

				if (field == RegularMemberInfo.Fields.MemberID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.MemberID = data.Data;
					}
				}
				else if (field == RegularMemberInfo.Fields.LoginStatus)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.LoginStatus = data.Data == 1;
					}
				}
				else if (field == RegularMemberInfo.Fields.ZoneID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.ZoneID = null;
					else
					{
						model.ZoneID = data.Data;
					}
				}
				else if (field == RegularMemberInfo.Fields.X)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
						model.X = null;
					else
					{
						model.X = data.Data;
					}
				}
				else if (field == RegularMemberInfo.Fields.Y)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
						model.Y = null;
					else
					{
						model.Y = data.Data;
					}
				}
				else if (field == RegularMemberInfo.Fields.Helmet)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Helmet = null;
					else
					{
						model.Helmet = data.Data == 1;
					}
				}
				else if (field == RegularMemberInfo.Fields.Belt)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Belt = null;
					else
					{
						model.Belt = data.Data == 1;
					}
				}
				else if (field == RegularMemberInfo.Fields.Shoes)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Shoes = null;
					else
					{
						model.Shoes = data.Data == 1;
					}
				}

				index++;
			}

			return model;
		}


	}
}
