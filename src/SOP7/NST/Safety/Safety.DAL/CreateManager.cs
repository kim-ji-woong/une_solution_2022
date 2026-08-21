using System;
using System.Collections;
using System.Collections.Generic;
using dnsDBUtil;
using Safety.IDAL;
using Safety.Model.Sop.Team;

namespace Safety.DAL
{
	public class CreateManager : QueryManager, ICreate
	{
		private DataManager m_dataManager = null;
		private const int FindCountLimit = 100;

		public CreateManager(DataManager dataManager)
		{
			m_dataManager = dataManager;
			m_dbManager = m_dataManager.GetDBManager() as DirectDBManager;
			//m_dbManager = m_dataManager.GetDBManager() as WebDBManager;
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

		public RegularMemberInfo CreateSopTeamRegularMemberInfo(RegularMemberInfo obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<RegularMemberInfo.Fields, object> dicFieldDatas = new Dictionary<RegularMemberInfo.Fields, object>();
			dicFieldDatas[RegularMemberInfo.Fields.MemberID] = obj.MemberID;
			dicFieldDatas[RegularMemberInfo.Fields.LoginStatus] = obj.LoginStatus;
			dicFieldDatas[RegularMemberInfo.Fields.ZoneID] = obj.ZoneID;
			dicFieldDatas[RegularMemberInfo.Fields.X] = obj.X;
			dicFieldDatas[RegularMemberInfo.Fields.Y] = obj.Y;
			dicFieldDatas[RegularMemberInfo.Fields.Helmet] = obj.Helmet;
			dicFieldDatas[RegularMemberInfo.Fields.Belt] = obj.Belt;
			dicFieldDatas[RegularMemberInfo.Fields.Shoes] = obj.Shoes;

			string strSQL = string.Format("Insert into {0} ({1}) values({2})",
				RegularMemberInfo.TableName,
				GetFieldNames<RegularMemberInfo.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				RegularMemberInfo data = new RegularMemberInfo();
				data.MemberID = obj.MemberID;
				data.LoginStatus = obj.LoginStatus;
				data.ZoneID = obj.ZoneID;
				data.X = obj.X;
				data.Y = obj.Y;
				data.Helmet = obj.Helmet;
				data.Belt = obj.Belt;
				data.Shoes = obj.Shoes;

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
