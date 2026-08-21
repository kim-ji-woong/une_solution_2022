using System;
using System.Text;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Concurrent;
using dnsDBUtil;
using VDS.IDAL;
using VDS.Model;
using VDS.Model.Account;
using VDS.Model.Team;
using VDS.Model.ItemData;
using VDS.Model.Sensor;
using VDS.Model.Work;

namespace VDS.DAL
{
	public class SelectManager : QueryManager, ISelect
	{
		private DataManager m_dataManager = null;

		// 한번의 Select 쿼리를 실행할때마다 Table 정보를 읽기 위하여 Column List와 Column Type에 대한 쿼리를 각각 한번씩 수행한다.
		// 즉, 메인 쿼리 + 2번의 쿼리를 더하게 되는 것인데 매번 같은 테이블에 대하여 이러한 부가정보를 얻기 위하여 2번씩 쿼리를 더하는 것은 성능에 심각한 문제를 만들수 있다.
		// 테이블마다 첫번째 쿼리를 실행할 때에만 부가정보 쿼리를 실행하도록 하고, 그 정보는 아래의 Dictionary에 저장하도록 한다.
		private static ConcurrentDictionary<string, Dictionary<string, string>> m_dicTableInfos = new ConcurrentDictionary<string, Dictionary<string, string>>();

		public SelectManager(DataManager dataManager)
		{
			m_dataManager = dataManager;
			m_dbManager = m_dataManager.GetDBManager() as DirectDBManager;
		}

		private string GetDateTimeString(DateTime time)
		{
			return string.Format("{0}-{1:00}-{2:00} {3:00}:{4:00}:{5:00}", time.Year, time.Month, time.Day, time.Hour, time.Minute, time.Second);
		}

		public Level SelectAccountLevel(int id, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where ID = {2} ",
				GetFieldNames<Level.Fields>(out nFieldCount), Level.TableName
				, id);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				Level model = ReadAccountLevel(arrResult, 0, out strErrorMessage);

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

		public List<Level> SelectAccountLevels(Dictionary<Level.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectAccountLevels(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<Level> SelectAccountLevels(Dictionary<Level.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<Level.Fields>(out nFieldCount), Level.TableName);

			string strCondition = "";

			if (SetCondition<Level.Fields>(ref strCondition, dicConditions, Level.GetFieldName, Level.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<Level> datas = new List<Level>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				Level model = ReadAccountLevel(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private Level ReadAccountLevel(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			Level model = new Level();
			bool isNullable;

			foreach (Level.Fields field in Level.Fields.GetValues(typeof(Level.Fields)))
			{
				string strFieldName = Level.GetFieldName(field, out isNullable);

				if (field == Level.Fields.ID)
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
				else if (field == Level.Fields.LevelName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.LevelName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.LevelName = data;
					}
				}
				else if (field == Level.Fields.LevelEngName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.LevelEngName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.LevelEngName = data;
					}
				}

				index++;
			}

			return model;
		}


		public Option SelectAccountOption(int id, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where ID = {2} ", 
				GetFieldNames<Option.Fields>(out nFieldCount), Option.TableName
				, id);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				Option model = ReadOption(arrResult, 0, out strErrorMessage);

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

		public List<Option> SelectAccountOptions(Dictionary<Option.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectAccountOptions(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<Option> SelectAccountOptions(Dictionary<Option.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<Option.Fields>(out nFieldCount), Option.TableName);

			string strCondition = "";

			if (SetCondition<Option.Fields>(ref strCondition, dicConditions, Option.GetFieldName, Option.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<Option> datas = new List<Option>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				Option model = ReadOption(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private Option ReadOption(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			Option model = new Option();
			bool isNullable;

			foreach (Option.Fields field in Option.Fields.GetValues(typeof(Option.Fields)))
			{
				string strFieldName = Option.GetFieldName(field, out isNullable);

				if (field == Option.Fields.ID)
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
				else if (field == Option.Fields.UserID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.UserID = data.Data;
					}
				}
				else if (field == Option.Fields.Category)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Category = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Category = data;
					}
				}
				else if (field == Option.Fields.SubCategory)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.SubCategory = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.SubCategory = data;
					}
				}
				else if (field == Option.Fields.PropertyValue1)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.PropertyValue1 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.PropertyValue1 = data;
					}
				}
				else if (field == Option.Fields.PropertyValue2)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.PropertyValue2 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.PropertyValue2 = data;
					}
				}
				else if (field == Option.Fields.PropertyValue3)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.PropertyValue3 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.PropertyValue3 = data;
					}
				}
				else if (field == Option.Fields.PropertyValue4)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.PropertyValue4 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.PropertyValue4 = data;
					}
				}

				index++;
			}

			return model;
		}


		public Session SelectAccountSession(int id, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where ID = {2} ", 
				GetFieldNames<Session.Fields>(out nFieldCount), Session.TableName
				, id);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				Session model = ReadSession(arrResult, 0, out strErrorMessage);

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

		public List<Session> SelectAccountSessions(Dictionary<Session.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectAccountSessions(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<Session> SelectAccountSessions(Dictionary<Session.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<Session.Fields>(out nFieldCount), Session.TableName);

			string strCondition = "";

			if (SetCondition<Session.Fields>(ref strCondition, dicConditions, Session.GetFieldName, Session.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<Session> datas = new List<Session>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				Session model = ReadSession(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private Session ReadSession(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			Session model = new Session();
			bool isNullable;

			foreach (Session.Fields field in Session.Fields.GetValues(typeof(Session.Fields)))
			{
				string strFieldName = Session.GetFieldName(field, out isNullable);

				if (field == Session.Fields.ID)
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
				else if (field == Session.Fields.AccountUserID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.AccountUserID = data.Data;
					}
				}
				else if (field == Session.Fields.SessionKey)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.SessionKey = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.SessionKey = data;
					}
				}
				else if (field == Session.Fields.CreateDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.CreateDate = data.Data;
					}
				}
				else if (field == Session.Fields.UpdateDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.UpdateDate = data.Data;
					}
				}
				else if (field == Session.Fields.IsAutoLogin)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.IsAutoLogin = data.Data == 1;
					}
				}

				index++;
			}

			return model;
		}


		public User SelectAccountUser(int id, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where ID = {2} ", 
				GetFieldNames<User.Fields>(out nFieldCount), User.TableName
				, id);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				User model = ReadUser(arrResult, 0, out strErrorMessage);

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

		public List<User> SelectAccountUsers(Dictionary<User.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectAccountUsers(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<User> SelectAccountUsers(Dictionary<User.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<User.Fields>(out nFieldCount), User.TableName);

			string strCondition = "";

			if (SetCondition<User.Fields>(ref strCondition, dicConditions, User.GetFieldName, User.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<User> datas = new List<User>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				User model = ReadUser(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private User ReadUser(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			User model = new User();
			bool isNullable;

			foreach (User.Fields field in User.Fields.GetValues(typeof(User.Fields)))
			{
				string strFieldName = User.GetFieldName(field, out isNullable);

				if (field == User.Fields.ID)
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
				else if (field == User.Fields.UserLevel)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.UserLevel = data.Data;
					}
				}
				else if (field == User.Fields.Password)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Password = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Password = data;
					}
				}
				else if (field == User.Fields.UserID)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.UserID = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.UserID = data;
					}
				}
				else if (field == User.Fields.NickName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.NickName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.NickName = data;
					}
				}
				else if (field == User.Fields.PasswordCode)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.PasswordCode = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.PasswordCode = data;
					}
				}
				else if (field == User.Fields.Salt)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Salt = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Salt = data;
					}
				}

				index++;
			}

			return model;
		}

		public UserData SelectAccountUserData(int userID, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where UserID = {2} ",
				GetFieldNames<UserData.Fields>(out nFieldCount), UserData.TableName
				, userID);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				UserData model = ReadAccountUserData(arrResult, 0, out strErrorMessage);

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

		public List<UserData> SelectAccountUserDatas(Dictionary<UserData.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectAccountUserDatas(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<UserData> SelectAccountUserDatas(Dictionary<UserData.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<UserData.Fields>(out nFieldCount), UserData.TableName);

			string strCondition = "";

			if (SetCondition<UserData.Fields>(ref strCondition, dicConditions, UserData.GetFieldName, UserData.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<UserData> datas = new List<UserData>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				UserData model = ReadAccountUserData(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private UserData ReadAccountUserData(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			UserData model = new UserData();
			bool isNullable;

			foreach (UserData.Fields field in UserData.Fields.GetValues(typeof(UserData.Fields)))
			{
				string strFieldName = UserData.GetFieldName(field, out isNullable);

				if (field == UserData.Fields.UserID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.UserID = data.Data;
					}
				}
				else if (field == UserData.Fields.CompanyName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.CompanyName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.CompanyName = data;
					}
				}
				else if (field == UserData.Fields.RegDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.RegDate = data.Data;
					}
				}
				else if (field == UserData.Fields.Activate)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.Activate = data.Data == 1;
					}
				}
				else if (field == UserData.Fields.Memo)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Memo = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Memo = data;
					}
				}
				else if (field == UserData.Fields.SiteID)
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

				index++;
			}

			return model;
		}


		public UserDataCenterLink SelectAccountUserDataCenterLink(int userID, int dataCenterID, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where UserID = {2} and DataCenterID = {3} ",
				GetFieldNames<UserDataCenterLink.Fields>(out nFieldCount), UserDataCenterLink.TableName
				, userID
				, dataCenterID);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				UserDataCenterLink model = ReadAccountUserDataCenterLink(arrResult, 0, out strErrorMessage);

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

		public List<UserDataCenterLink> SelectAccountUserDataCenterLinks(Dictionary<UserDataCenterLink.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectAccountUserDataCenterLinks(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<UserDataCenterLink> SelectAccountUserDataCenterLinks(Dictionary<UserDataCenterLink.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<UserDataCenterLink.Fields>(out nFieldCount), UserDataCenterLink.TableName);

			string strCondition = "";

			if (SetCondition<UserDataCenterLink.Fields>(ref strCondition, dicConditions, UserDataCenterLink.GetFieldName, UserDataCenterLink.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<UserDataCenterLink> datas = new List<UserDataCenterLink>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				UserDataCenterLink model = ReadAccountUserDataCenterLink(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private UserDataCenterLink ReadAccountUserDataCenterLink(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			UserDataCenterLink model = new UserDataCenterLink();
			bool isNullable;

			foreach (UserDataCenterLink.Fields field in UserDataCenterLink.Fields.GetValues(typeof(UserDataCenterLink.Fields)))
			{
				string strFieldName = UserDataCenterLink.GetFieldName(field, out isNullable);

				if (field == UserDataCenterLink.Fields.UserID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.UserID = data.Data;
					}
				}
				else if (field == UserDataCenterLink.Fields.DataCenterID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.DataCenterID = data.Data;
					}
				}

				index++;
			}

			return model;
		}

		public Company SelectCompany(int id, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where ID = {2} ",
				GetFieldNames<Company.Fields>(out nFieldCount), Company.TableName
				, id);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				Company model = ReadCompany(arrResult, 0, out strErrorMessage);

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

		public List<Company> SelectCompanies(Dictionary<Company.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectCompanies(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<Company> SelectCompanies(Dictionary<Company.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<Company.Fields>(out nFieldCount), Company.TableName);

			string strCondition = "";

			if (SetCondition<Company.Fields>(ref strCondition, dicConditions, Company.GetFieldName, Company.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<Company> datas = new List<Company>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				Company model = ReadCompany(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private Company ReadCompany(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			Company model = new Company();
			bool isNullable;

			foreach (Company.Fields field in Company.Fields.GetValues(typeof(Company.Fields)))
			{
				string strFieldName = Company.GetFieldName(field, out isNullable);

				if (field == Company.Fields.ID)
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
				else if (field == Company.Fields.Name)
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
				else if (field == Company.Fields.EngName)
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


		public Model.DataCenter.DataCenter SelectDataCenter(int id, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where ID = {2} ",
				GetFieldNames<Model.DataCenter.DataCenter.Fields>(out nFieldCount), Model.DataCenter.DataCenter.TableName
				, id);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				Model.DataCenter.DataCenter model = ReadDataCenter(arrResult, 0, out strErrorMessage);

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

		public List<Model.DataCenter.DataCenter> SelectDataCenters(Dictionary<Model.DataCenter.DataCenter.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectDataCenters(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<Model.DataCenter.DataCenter> SelectDataCenters(Dictionary<Model.DataCenter.DataCenter.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<Model.DataCenter.DataCenter.Fields>(out nFieldCount), Model.DataCenter.DataCenter.TableName);

			string strCondition = "";

			if (SetCondition<Model.DataCenter.DataCenter.Fields>(ref strCondition, dicConditions, Model.DataCenter.DataCenter.GetFieldName, Model.DataCenter.DataCenter.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<Model.DataCenter.DataCenter> datas = new List<Model.DataCenter.DataCenter>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				Model.DataCenter.DataCenter model = ReadDataCenter(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private Model.DataCenter.DataCenter ReadDataCenter(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			Model.DataCenter.DataCenter model = new Model.DataCenter.DataCenter();
			bool isNullable;

			foreach (Model.DataCenter.DataCenter.Fields field in Model.DataCenter.DataCenter.Fields.GetValues(typeof(Model.DataCenter.DataCenter.Fields)))
			{
				string strFieldName = Model.DataCenter.DataCenter.GetFieldName(field, out isNullable);

				if (field == Model.DataCenter.DataCenter.Fields.ID)
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
				else if (field == Model.DataCenter.DataCenter.Fields.Name)
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
				else if (field == Model.DataCenter.DataCenter.Fields.EngName)
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
				else if (field == Model.DataCenter.DataCenter.Fields.SiteID)
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
				else if (field == Model.DataCenter.DataCenter.Fields.NationID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.NationID = data.Data;
					}
				}
				else if (field == Model.DataCenter.DataCenter.Fields.Address)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Address = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Address = data;
					}
				}
				else if (field == Model.DataCenter.DataCenter.Fields.RegDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.RegDate = data.Data;
					}
				}
				else if (field == Model.DataCenter.DataCenter.Fields.Width)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.Width = data.Data;
					}
				}
				else if (field == Model.DataCenter.DataCenter.Fields.Length)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.Length = data.Data;
					}
				}
				else if (field == Model.DataCenter.DataCenter.Fields.Height)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.Height = data.Data;
					}
				}
				else if (field == Model.DataCenter.DataCenter.Fields.TileWidth)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.TileWidth = data.Data;
					}
				}
				else if (field == Model.DataCenter.DataCenter.Fields.TileLength)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.TileLength = data.Data;
					}
				}
				else if (field == Model.DataCenter.DataCenter.Fields.TileElevation)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.TileElevation = data.Data;
					}
				}
				else if (field == Model.DataCenter.DataCenter.Fields.UnitOfLength)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.UnitOfLength = data.Data;
					}
				}
				else if (field == Model.DataCenter.DataCenter.Fields.Type)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Type = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Type = data;
					}
				}
				else if (field == Model.DataCenter.DataCenter.Fields.Latitude)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.Latitude = data.Data;
					}
				}
				else if (field == Model.DataCenter.DataCenter.Fields.Longitude)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.Longitude = data.Data;
					}
				}
				else if (field == Model.DataCenter.DataCenter.Fields.CreationType)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.CreationType = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.CreationType = data;
					}
				}
				else if (field == Model.DataCenter.DataCenter.Fields.Memo)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Memo = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Memo = data;
					}
				}
				else if (field == Model.DataCenter.DataCenter.Fields.BeginGridX)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.BeginGridX = data.Data;
					}
				}
				else if (field == Model.DataCenter.DataCenter.Fields.BeginGridY)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.BeginGridY = data.Data;
					}
				}
				else if (field == Model.DataCenter.DataCenter.Fields.UTC)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.UTC = data.Data;
					}
				}

				index++;
			}

			return model;
		}

		public Model.DataCenter.Viewport SelectDataCenterViewport(int dataCenterID, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where DataCenterID = {2} ",
				GetFieldNames<Model.DataCenter.Viewport.Fields>(out nFieldCount), Model.DataCenter.Viewport.TableName
				, dataCenterID);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				Model.DataCenter.Viewport model = ReadDataCenterViewport(arrResult, 0, out strErrorMessage);

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

		public List<Model.DataCenter.Viewport> SelectDataCenterViewports(Dictionary<Model.DataCenter.Viewport.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectDataCenterViewports(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<Model.DataCenter.Viewport> SelectDataCenterViewports(Dictionary<Model.DataCenter.Viewport.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<Model.DataCenter.Viewport.Fields>(out nFieldCount), Model.DataCenter.Viewport.TableName);

			string strCondition = "";

			if (SetCondition<Model.DataCenter.Viewport.Fields>(ref strCondition, dicConditions, Model.DataCenter.Viewport.GetFieldName, Model.DataCenter.Viewport.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<Model.DataCenter.Viewport> datas = new List<Model.DataCenter.Viewport>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				Model.DataCenter.Viewport model = ReadDataCenterViewport(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private Model.DataCenter.Viewport ReadDataCenterViewport(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			Model.DataCenter.Viewport model = new Model.DataCenter.Viewport();
			bool isNullable;

			foreach (Model.DataCenter.Viewport.Fields field in Model.DataCenter.Viewport.Fields.GetValues(typeof(Model.DataCenter.Viewport.Fields)))
			{
				string strFieldName = Model.DataCenter.Viewport.GetFieldName(field, out isNullable);

				if (field == Model.DataCenter.Viewport.Fields.DataCenterID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.DataCenterID = data.Data;
					}
				}
				else if (field == Model.DataCenter.Viewport.Fields.PositionX)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.PositionX = data.Data;
					}
				}
				else if (field == Model.DataCenter.Viewport.Fields.PositionY)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.PositionY = data.Data;
					}
				}
				else if (field == Model.DataCenter.Viewport.Fields.PositionZ)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.PositionZ = data.Data;
					}
				}
				else if (field == Model.DataCenter.Viewport.Fields.RotationX)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.RotationX = data.Data;
					}
				}
				else if (field == Model.DataCenter.Viewport.Fields.RotationY)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.RotationY = data.Data;
					}
				}
				else if (field == Model.DataCenter.Viewport.Fields.RotationZ)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.RotationZ = data.Data;
					}
				}

				index++;
			}

			return model;
		}

		public Model.DataCenter.Data SelectDataCenterData(int centerID, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where CenterID = {2} ",
				GetFieldNames<Model.DataCenter.Data.Fields>(out nFieldCount), Model.DataCenter.Data.TableName
				, centerID);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				Model.DataCenter.Data model = ReadDataCenterData(arrResult, 0, out strErrorMessage);

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

		public List<Model.DataCenter.Data> SelectDataCenterDatas(Dictionary<Model.DataCenter.Data.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectDataCenterDatas(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<Model.DataCenter.Data> SelectDataCenterDatas(Dictionary<Model.DataCenter.Data.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<Model.DataCenter.Data.Fields>(out nFieldCount), Model.DataCenter.Data.TableName);

			string strCondition = "";

			if (SetCondition<Model.DataCenter.Data.Fields>(ref strCondition, dicConditions, Model.DataCenter.Data.GetFieldName, Model.DataCenter.Data.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<Model.DataCenter.Data> datas = new List<Model.DataCenter.Data>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				Model.DataCenter.Data model = ReadDataCenterData(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private Model.DataCenter.Data ReadDataCenterData(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			Model.DataCenter.Data model = new Model.DataCenter.Data();
			bool isNullable;

			foreach (Model.DataCenter.Data.Fields field in Model.DataCenter.Data.Fields.GetValues(typeof(Model.DataCenter.Data.Fields)))
			{
				string strFieldName = Model.DataCenter.Data.GetFieldName(field, out isNullable);

				if (field == Model.DataCenter.Data.Fields.CenterID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.CenterID = data.Data;
					}
				}
				else if (field == Model.DataCenter.Data.Fields.IsClone)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.IsClone = data.Data == 1;
					}
				}
				else if (field == Model.DataCenter.Data.Fields.ParentID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.ParentID = null;
					else
					{
						model.ParentID = data.Data;
					}
				}
				else if (field == Model.DataCenter.Data.Fields.ManagerTeam)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.ManagerTeam = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.ManagerTeam = data;
					}
				}
				else if (field == Model.DataCenter.Data.Fields.Manager)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Manager = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Manager = data;
					}
				}
				else if (field == Model.DataCenter.Data.Fields.Company)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Company = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Company = data;
					}
				}

				index++;
			}

			return model;
		}

		public Model.DataCenter.Option SelectDataCenterOption(string propertyName, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where PropertyName = '{2}' ",
				GetFieldNames<Model.DataCenter.Option.Fields>(out nFieldCount), Model.DataCenter.Option.TableName
				, propertyName);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				Model.DataCenter.Option model = ReadDataCenterOption(arrResult, 0, out strErrorMessage);

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

		public List<Model.DataCenter.Option> SelectDataCenterOptions(Dictionary<Model.DataCenter.Option.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectDataCenterOptions(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<Model.DataCenter.Option> SelectDataCenterOptions(Dictionary<Model.DataCenter.Option.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<Model.DataCenter.Option.Fields>(out nFieldCount), Model.DataCenter.Option.TableName);

			string strCondition = "";

			if (SetCondition<Model.DataCenter.Option.Fields>(ref strCondition, dicConditions, Model.DataCenter.Option.GetFieldName, Model.DataCenter.Option.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<Model.DataCenter.Option> datas = new List<Model.DataCenter.Option>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				Model.DataCenter.Option model = ReadDataCenterOption(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private Model.DataCenter.Option ReadDataCenterOption(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			Model.DataCenter.Option model = new Model.DataCenter.Option();
			bool isNullable;

			foreach (Model.DataCenter.Option.Fields field in Model.DataCenter.Option.Fields.GetValues(typeof(Model.DataCenter.Option.Fields)))
			{
				string strFieldName = Model.DataCenter.Option.GetFieldName(field, out isNullable);

				if (field == Model.DataCenter.Option.Fields.PropertyName)
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
				else if (field == Model.DataCenter.Option.Fields.PropertyValue)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.PropertyValue = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.PropertyValue = data;
					}
				}
				else if (field == Model.DataCenter.Option.Fields.Description)
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

		public EquipmentCategory SelectEquipmentCategory(int id, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where ID = {2} ",
				GetFieldNames<EquipmentCategory.Fields>(out nFieldCount), EquipmentCategory.TableName
				, id);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				EquipmentCategory model = ReadEquipmentCategory(arrResult, 0, out strErrorMessage);

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

		public List<EquipmentCategory> SelectEquipmentCategories(Dictionary<EquipmentCategory.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectEquipmentCategories(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<EquipmentCategory> SelectEquipmentCategories(Dictionary<EquipmentCategory.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<EquipmentCategory.Fields>(out nFieldCount), EquipmentCategory.TableName);

			string strCondition = "";

			if (SetCondition<EquipmentCategory.Fields>(ref strCondition, dicConditions, EquipmentCategory.GetFieldName, EquipmentCategory.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<EquipmentCategory> datas = new List<EquipmentCategory>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				EquipmentCategory model = ReadEquipmentCategory(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private EquipmentCategory ReadEquipmentCategory(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			EquipmentCategory model = new EquipmentCategory();
			bool isNullable;

			foreach (EquipmentCategory.Fields field in EquipmentCategory.Fields.GetValues(typeof(EquipmentCategory.Fields)))
			{
				string strFieldName = EquipmentCategory.GetFieldName(field, out isNullable);

				if (field == EquipmentCategory.Fields.ID)
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
				else if (field == EquipmentCategory.Fields.Name)
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
				else if (field == EquipmentCategory.Fields.EngName)
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


		public EquipmentType SelectEquipmentType(int id, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where ID = {2} ",
				GetFieldNames<EquipmentType.Fields>(out nFieldCount), EquipmentType.TableName
				, id);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				EquipmentType model = ReadEquipmentType(arrResult, 0, out strErrorMessage);

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

		public List<EquipmentType> SelectEquipmentTypes(Dictionary<EquipmentType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectEquipmentTypes(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<EquipmentType> SelectEquipmentTypes(Dictionary<EquipmentType.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<EquipmentType.Fields>(out nFieldCount), EquipmentType.TableName);

			string strCondition = "";

			if (SetCondition<EquipmentType.Fields>(ref strCondition, dicConditions, EquipmentType.GetFieldName, EquipmentType.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<EquipmentType> datas = new List<EquipmentType>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				EquipmentType model = ReadEquipmentType(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private EquipmentType ReadEquipmentType(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			EquipmentType model = new EquipmentType();
			bool isNullable;

			foreach (EquipmentType.Fields field in EquipmentType.Fields.GetValues(typeof(EquipmentType.Fields)))
			{
				string strFieldName = EquipmentType.GetFieldName(field, out isNullable);

				if (field == EquipmentType.Fields.ID)
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
				else if (field == EquipmentType.Fields.Name)
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
				else if (field == EquipmentType.Fields.EngName)
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
				else if (field == EquipmentType.Fields.CategoryID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.CategoryID = data.Data;
					}
				}

				index++;
			}

			return model;
		}


		public Item SelectItem(int id, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where ID = {2} ",
				GetFieldNames<Item.Fields>(out nFieldCount), Item.TableName
				, id);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				Item model = ReadItem(arrResult, 0, out strErrorMessage);

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

		public List<Item> SelectItems(Dictionary<Item.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectItems(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<Item> SelectItems(Dictionary<Item.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<Item.Fields>(out nFieldCount), Item.TableName);

			string strCondition = "";

			if (SetCondition<Item.Fields>(ref strCondition, dicConditions, Item.GetFieldName, Item.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<Item> datas = new List<Item>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				Item model = ReadItem(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private Item ReadItem(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			Item model = new Item();
			bool isNullable;

			foreach (Item.Fields field in Item.Fields.GetValues(typeof(Item.Fields)))
			{
				string strFieldName = Item.GetFieldName(field, out isNullable);

				if (field == Item.Fields.ID)
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
				else if (field == Item.Fields.Name)
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
				else if (field == Item.Fields.CenterID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.CenterID = data.Data;
					}
				}
				else if (field == Item.Fields.ItemTypeID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.ItemTypeID = data.Data;
					}
				}
				else if (field == Item.Fields.Cpu)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Cpu = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Cpu = data;
					}
				}
				else if (field == Item.Fields.Ram)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Ram = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Ram = data;
					}
				}
				else if (field == Item.Fields.DiskInfo)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.DiskInfo = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.DiskInfo = data;
					}
				}
				else if (field == Item.Fields.DiskVolume)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.DiskVolume = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.DiskVolume = data;
					}
				}
				else if (field == Item.Fields.RegDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.RegDate = null;
					else
					{
						model.RegDate = data.Data;
					}
				}
				else if (field == Item.Fields.ChangeDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.ChangeDate = null;
					else
					{
						model.ChangeDate = data.Data;
					}
				}
				else if (field == Item.Fields.Usage)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Usage = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Usage = data;
					}
				}
				else if (field == Item.Fields.PositionInShelf)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.PositionInShelf = null;
					else
					{
						model.PositionInShelf = data.Data;
					}
				}
				else if (field == Item.Fields.Status)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Status = null;
					else
					{
						model.Status = data.Data;
					}
				}

				index++;
			}

			return model;
		}

		public Item_RU SelectItem_RU(int itemID, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where ItemID = {2} ",
				GetFieldNames<Item_RU.Fields>(out nFieldCount), Item_RU.TableName
				, itemID);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				Item_RU model = ReadItem_RU(arrResult, 0, out strErrorMessage);

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

		public List<Item_RU> SelectItem_RUs(Dictionary<Item_RU.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectItem_RUs(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<Item_RU> SelectItem_RUs(Dictionary<Item_RU.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<Item_RU.Fields>(out nFieldCount), Item_RU.TableName);

			string strCondition = "";

			if (SetCondition<Item_RU.Fields>(ref strCondition, dicConditions, Item_RU.GetFieldName, Item_RU.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<Item_RU> datas = new List<Item_RU>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				Item_RU model = ReadItem_RU(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private Item_RU ReadItem_RU(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			Item_RU model = new Item_RU();
			bool isNullable;

			foreach (Item_RU.Fields field in Item_RU.Fields.GetValues(typeof(Item_RU.Fields)))
			{
				string strFieldName = Item_RU.GetFieldName(field, out isNullable);

				if (field == Item_RU.Fields.ItemID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.ItemID = data.Data;
					}
				}
				else if (field == Item_RU.Fields.RackID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.RackID = data.Data;
					}
				}
				else if (field == Item_RU.Fields.UPos)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.UPos = data.Data;
					}
				}

				index++;
			}

			return model;
		}

		public LinkedItem SelectLinkedItem(int itemID, int linkedItemID, int centerID, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where ItemID = {2} and LinkedItemID = {3} and CenterID = {4} ",
				GetFieldNames<LinkedItem.Fields>(out nFieldCount), LinkedItem.TableName
				, itemID
				, linkedItemID
				, centerID);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				LinkedItem model = ReadLinkedItem(arrResult, 0, out strErrorMessage);

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

		public List<LinkedItem> SelectLinkedItems(Dictionary<LinkedItem.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectLinkedItems(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<LinkedItem> SelectLinkedItems(Dictionary<LinkedItem.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<LinkedItem.Fields>(out nFieldCount), LinkedItem.TableName);

			string strCondition = "";

			if (SetCondition<LinkedItem.Fields>(ref strCondition, dicConditions, LinkedItem.GetFieldName, LinkedItem.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<LinkedItem> datas = new List<LinkedItem>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				LinkedItem model = ReadLinkedItem(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private LinkedItem ReadLinkedItem(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			LinkedItem model = new LinkedItem();
			bool isNullable;

			foreach (LinkedItem.Fields field in LinkedItem.Fields.GetValues(typeof(LinkedItem.Fields)))
			{
				string strFieldName = LinkedItem.GetFieldName(field, out isNullable);

				if (field == LinkedItem.Fields.ItemID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.ItemID = data.Data;
					}
				}
				else if (field == LinkedItem.Fields.LinkedItemID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.LinkedItemID = data.Data;
					}
				}
				else if (field == LinkedItem.Fields.CenterID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.CenterID = data.Data;
					}
				}

				index++;
			}

			return model;
		}

		public ItemType SelectItemType(int id, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where ID = {2} ",
				GetFieldNames<ItemType.Fields>(out nFieldCount), ItemType.TableName
				, id);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				ItemType model = ReadItemType(arrResult, 0, out strErrorMessage);

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

		public List<ItemType> SelectItemTypes(Dictionary<ItemType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectItemTypes(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<ItemType> SelectItemTypes(Dictionary<ItemType.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<ItemType.Fields>(out nFieldCount), ItemType.TableName);

			string strCondition = "";

			if (SetCondition<ItemType.Fields>(ref strCondition, dicConditions, ItemType.GetFieldName, ItemType.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<ItemType> datas = new List<ItemType>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				ItemType model = ReadItemType(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private ItemType ReadItemType(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			ItemType model = new ItemType();
			bool isNullable;

			foreach (ItemType.Fields field in ItemType.Fields.GetValues(typeof(ItemType.Fields)))
			{
				string strFieldName = ItemType.GetFieldName(field, out isNullable);

				if (field == ItemType.Fields.ID)
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
				else if (field == ItemType.Fields.EquipmentType)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.EquipmentType = data.Data;
					}
				}
				else if (field == ItemType.Fields.CompanyID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.CompanyID = data.Data;
					}
				}
				else if (field == ItemType.Fields.ModelName)
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
				else if (field == ItemType.Fields.Type)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Type = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Type = data;
					}
				}
				else if (field == ItemType.Fields.Height)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
						model.Height = null;
					else
					{
						model.Height = data.Data;
					}
				}
				else if (field == ItemType.Fields.Width)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
						model.Width = null;
					else
					{
						model.Width = data.Data;
					}
				}
				else if (field == ItemType.Fields.Depth)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
						model.Depth = null;
					else
					{
						model.Depth = data.Data;
					}
				}
				else if (field == ItemType.Fields.Unit)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Unit = null;
					else
					{
						model.Unit = data.Data;
					}
				}
				else if (field == ItemType.Fields.Shelf)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Shelf = null;
					else
					{
						model.Shelf = data.Data == 1;
					}
				}
				else if (field == ItemType.Fields.ImageUrl)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.ImageUrl = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.ImageUrl = data;
					}
				}
				else if (field == ItemType.Fields.BackImageUrl)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.BackImageUrl = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.BackImageUrl = data;
					}
				}
				else if (field == ItemType.Fields.GlbUrl)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.GlbUrl = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.GlbUrl = data;
					}
				}
				else if (field == ItemType.Fields.FbxUrl)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.FbxUrl = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.FbxUrl = data;
					}
				}
				else if (field == ItemType.Fields.ClassName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.ClassName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.ClassName = data;
					}
				}
				else if (field == ItemType.Fields.Memo)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Memo = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Memo = data;
					}
				}
				else if (field == ItemType.Fields.RegDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.RegDate = data.Data;
					}
				}
				else if (field == ItemType.Fields.ChangeDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.ChangeDate = null;
					else
					{
						model.ChangeDate = data.Data;
					}
				}

				index++;
			}

			return model;
		}

		public Backup SelectBackup(string basic_Name, int dataCenterID, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where Basic_Name = '{2}' and DataCenterID = {3} ",
				GetFieldNames<Backup.Fields>(out nFieldCount), Backup.TableName
				, basic_Name
				, dataCenterID);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				Backup model = ReadBackup(arrResult, 0, out strErrorMessage);

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

		public List<Backup> SelectBackups(Dictionary<Backup.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectBackups(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<Backup> SelectBackups(Dictionary<Backup.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<Backup.Fields>(out nFieldCount), Backup.TableName);

			string strCondition = "";

			if (SetCondition<Backup.Fields>(ref strCondition, dicConditions, Backup.GetFieldName, Backup.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<Backup> datas = new List<Backup>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				Backup model = ReadBackup(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private Backup ReadBackup(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			Backup model = new Backup();
			bool isNullable;

			foreach (Backup.Fields field in Backup.Fields.GetValues(typeof(Backup.Fields)))
			{
				string strFieldName = Backup.GetFieldName(field, out isNullable);

				if (field == Backup.Fields.BackupID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.BackupID = null;
					else
					{
						model.BackupID = data.Data;
					}
				}
				else if (field == Backup.Fields.Basic_Name)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_Name = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_Name = data;
					}
				}
				else if (field == Backup.Fields.Basic_Status)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_Status = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_Status = data;
					}
				}
				else if (field == Backup.Fields.Basic_RegDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Basic_RegDate = null;
					else
					{
						model.Basic_RegDate = data.Data;
					}
				}
				else if (field == Backup.Fields.Basic_Usage)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_Usage = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_Usage = data;
					}
				}
				else if (field == Backup.Fields.Basic_ReceiveDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Basic_ReceiveDate = null;
					else
					{
						model.Basic_ReceiveDate = data.Data;
					}
				}
				else if (field == Backup.Fields.Basic_ItemLevel)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_ItemLevel = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_ItemLevel = data;
					}
				}
				else if (field == Backup.Fields.Basic_OwnerCompanyName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_OwnerCompanyName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_OwnerCompanyName = data;
					}
				}
				else if (field == Backup.Fields.Basic_OwnDepartment)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_OwnDepartment = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_OwnDepartment = data;
					}
				}
				else if (field == Backup.Fields.Basic_OperationDepartment)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_OperationDepartment = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_OperationDepartment = data;
					}
				}
				else if (field == Backup.Fields.Basic_OverUsedYear)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Basic_OverUsedYear = null;
					else
					{
						model.Basic_OverUsedYear = data.Data == 1;
					}
				}
				else if (field == Backup.Fields.Basic_Memo)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_Memo = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_Memo = data;
					}
				}
				else if (field == Backup.Fields.Manage_SuperviseManager)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Manage_SuperviseManager = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Manage_SuperviseManager = data;
					}
				}
				else if (field == Backup.Fields.Manage_OperationManager)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Manage_OperationManager = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Manage_OperationManager = data;
					}
				}
				else if (field == Backup.Fields.Position_InstallRegion)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Position_InstallRegion = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Position_InstallRegion = data;
					}
				}
				else if (field == Backup.Fields.Position_RackDetailPosition)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Position_RackDetailPosition = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Position_RackDetailPosition = data;
					}
				}
				else if (field == Backup.Fields.Maintenance_ProvideCompanyName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Maintenance_ProvideCompanyName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Maintenance_ProvideCompanyName = data;
					}
				}
				else if (field == Backup.Fields.Maintenance_WarrantyMonth)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Maintenance_WarrantyMonth = null;
					else
					{
						model.Maintenance_WarrantyMonth = data.Data;
					}
				}
				else if (field == Backup.Fields.Maintenance_WarrantyExpiredDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Maintenance_WarrantyExpiredDate = null;
					else
					{
						model.Maintenance_WarrantyExpiredDate = data.Data;
					}
				}
				else if (field == Backup.Fields.Maintenance_MaintenanceCompanyName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Maintenance_MaintenanceCompanyName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Maintenance_MaintenanceCompanyName = data;
					}
				}
				else if (field == Backup.Fields.Maintenance_EOSDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Maintenance_EOSDate = null;
					else
					{
						model.Maintenance_EOSDate = data.Data;
					}
				}
				else if (field == Backup.Fields.Maintenance_MaintenanceContract)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Maintenance_MaintenanceContract = null;
					else
					{
						model.Maintenance_MaintenanceContract = data.Data == 1;
					}
				}
				else if (field == Backup.Fields.Maintenance_MaintenanceBeginDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Maintenance_MaintenanceBeginDate = null;
					else
					{
						model.Maintenance_MaintenanceBeginDate = data.Data;
					}
				}
				else if (field == Backup.Fields.Maintenance_MaintenanceEndDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Maintenance_MaintenanceEndDate = null;
					else
					{
						model.Maintenance_MaintenanceEndDate = data.Data;
					}
				}
				else if (field == Backup.Fields.HW_ModelName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_ModelName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_ModelName = data;
					}
				}
				else if (field == Backup.Fields.HW_Company)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_Company = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_Company = data;
					}
				}
				else if (field == Backup.Fields.HW_SerialNumber)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_SerialNumber = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_SerialNumber = data;
					}
				}
				else if (field == Backup.Fields.HW_DiskType)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_DiskType = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_DiskType = data;
					}
				}
				else if (field == Backup.Fields.HW_FirmwareVersion)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_FirmwareVersion = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_FirmwareVersion = data;
					}
				}
				else if (field == Backup.Fields.HW_Topology)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_Topology = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_Topology = data;
					}
				}
				else if (field == Backup.Fields.HW_IP)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_IP = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_IP = data;
					}
				}
				else if (field == Backup.Fields.HW_RegDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.HW_RegDate = null;
					else
					{
						model.HW_RegDate = data.Data;
					}
				}
				else if (field == Backup.Fields.HW_DiskDriveType)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_DiskDriveType = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_DiskDriveType = data;
					}
				}
				else if (field == Backup.Fields.HW_DiskTypeVolumeGB)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.HW_DiskTypeVolumeGB = null;
					else
					{
						model.HW_DiskTypeVolumeGB = data.Data;
					}
				}
				else if (field == Backup.Fields.HW_DiskCount)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.HW_DiskCount = null;
					else
					{
						model.HW_DiskCount = data.Data;
					}
				}
				else if (field == Backup.Fields.HW_PhysicalVolumeGB)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.HW_PhysicalVolumeGB = null;
					else
					{
						model.HW_PhysicalVolumeGB = data.Data;
					}
				}
				else if (field == Backup.Fields.HW_UsableVolumeGB)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.HW_UsableVolumeGB = data.Data;
					}
				}
				else if (field == Backup.Fields.HW_RaidType)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_RaidType = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_RaidType = data;
					}
				}
				else if (field == Backup.Fields.HW_BuyDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_BuyDate = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_BuyDate = data.Data;
					}
				}
				else if (field == Backup.Fields.HW_TotalSlotCount)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.HW_TotalSlotCount = null;
					else
					{
						model.HW_TotalSlotCount = data.Data;
					}
				}
				else if (field == Backup.Fields.HW_TapeMediaType)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_TapeMediaType = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_TapeMediaType = data;
					}
				}
				else if (field == Backup.Fields.HW_TapeMediaCount)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.HW_TapeMediaCount = null;
					else
					{
						model.HW_TapeMediaCount = data.Data;
					}
				}
				else if (field == Backup.Fields.Connect_NWEquip_1)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_NWEquip_1 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_NWEquip_1 = data;
					}
				}
				else if (field == Backup.Fields.Connect_NWEquip_2)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_NWEquip_2 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_NWEquip_2 = data;
					}
				}
				else if (field == Backup.Fields.Connect_NWEquip_3)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_NWEquip_3 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_NWEquip_3 = data;
					}
				}
				else if (field == Backup.Fields.Connect_NWEquip_4)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_NWEquip_4 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_NWEquip_4 = data;
					}
				}
				else if (field == Backup.Fields.Connect_SanSwitch_1)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_SanSwitch_1 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_SanSwitch_1 = data;
					}
				}
				else if (field == Backup.Fields.Connect_SanSwitch_2)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_SanSwitch_2 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_SanSwitch_2 = data;
					}
				}
				else if (field == Backup.Fields.Connect_SanSwitch_3)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_SanSwitch_3 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_SanSwitch_3 = data;
					}
				}
				else if (field == Backup.Fields.Connect_SanSwitch_4)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_SanSwitch_4 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_SanSwitch_4 = data;
					}
				}
				else if (field == Backup.Fields.DataCenterID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.DataCenterID = data.Data;
					}
				}

				index++;
			}

			return model;
		}


		public Box SelectBox(string basic_Name, int dataCenterID, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where Basic_Name = '{2}' and DataCenterID = {3} ",
				GetFieldNames<Box.Fields>(out nFieldCount), Box.TableName
				, basic_Name
				, dataCenterID);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				Box model = ReadBox(arrResult, 0, out strErrorMessage);

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

		public List<Box> SelectBoxes(Dictionary<Box.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectBoxes(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<Box> SelectBoxes(Dictionary<Box.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<Box.Fields>(out nFieldCount), Box.TableName);

			string strCondition = "";

			if (SetCondition<Box.Fields>(ref strCondition, dicConditions, Box.GetFieldName, Box.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<Box> datas = new List<Box>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				Box model = ReadBox(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private Box ReadBox(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			Box model = new Box();
			bool isNullable;

			foreach (Box.Fields field in Box.Fields.GetValues(typeof(Box.Fields)))
			{
				string strFieldName = Box.GetFieldName(field, out isNullable);

				if (field == Box.Fields.BoxID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.BoxID = null;
					else
					{
						model.BoxID = data.Data;
					}
				}
				else if (field == Box.Fields.Basic_Name)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_Name = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_Name = data;
					}
				}
				else if (field == Box.Fields.Basic_Company)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_Company = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_Company = data;
					}
				}
				else if (field == Box.Fields.Basic_ModelName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_ModelName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_ModelName = data;
					}
				}
				else if (field == Box.Fields.Basic_Status)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_Status = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_Status = data;
					}
				}
				else if (field == Box.Fields.Basic_Usage)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_Usage = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_Usage = data;
					}
				}
				else if (field == Box.Fields.Basic_RegDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Basic_RegDate = null;
					else
					{
						model.Basic_RegDate = data.Data;
					}
				}
				else if (field == Box.Fields.Basic_ItemLevel)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_ItemLevel = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_ItemLevel = data;
					}
				}
				else if (field == Box.Fields.Basic_EquipType)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_EquipType = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_EquipType = data;
					}
				}
				else if (field == Box.Fields.Basic_SerialNumber)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_SerialNumber = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_SerialNumber = data;
					}
				}
				else if (field == Box.Fields.Basic_PropertyType)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_PropertyType = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_PropertyType = data;
					}
				}
				else if (field == Box.Fields.Basic_ReceiveDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Basic_ReceiveDate = null;
					else
					{
						model.Basic_ReceiveDate = data.Data;
					}
				}
				else if (field == Box.Fields.Basic_OwnDepartment)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_OwnDepartment = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_OwnDepartment = data;
					}
				}
				else if (field == Box.Fields.Basic_PartitionAble)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Basic_PartitionAble = null;
					else
					{
						model.Basic_PartitionAble = data.Data == 1;
					}
				}
				else if (field == Box.Fields.Basic_PartitionName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_PartitionName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_PartitionName = data;
					}
				}
				else if (field == Box.Fields.Basic_ReceiveYears)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Basic_ReceiveYears = null;
					else
					{
						model.Basic_ReceiveYears = data.Data;
					}
				}
				else if (field == Box.Fields.Basic_OperationDepartment)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_OperationDepartment = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_OperationDepartment = data;
					}
				}
				else if (field == Box.Fields.Basic_DiscardDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Basic_DiscardDate = null;
					else
					{
						model.Basic_DiscardDate = data.Data;
					}
				}
				else if (field == Box.Fields.Basic_OverUsedYear)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Basic_OverUsedYear = null;
					else
					{
						model.Basic_OverUsedYear = data.Data == 1;
					}
				}
				else if (field == Box.Fields.Manage_SuperviseManager)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Manage_SuperviseManager = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Manage_SuperviseManager = data;
					}
				}
				else if (field == Box.Fields.Manage_OperationManager)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Manage_OperationManager = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Manage_OperationManager = data;
					}
				}
				else if (field == Box.Fields.Position_InstallRegion)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Position_InstallRegion = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Position_InstallRegion = data;
					}
				}
				else if (field == Box.Fields.Position_RackDetailPosition)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Position_RackDetailPosition = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Position_RackDetailPosition = data;
					}
				}
				else if (field == Box.Fields.Maintenance_WarrantyMonth)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Maintenance_WarrantyMonth = null;
					else
					{
						model.Maintenance_WarrantyMonth = data.Data;
					}
				}
				else if (field == Box.Fields.Maintenance_WarrantyExpiredDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Maintenance_WarrantyExpiredDate = null;
					else
					{
						model.Maintenance_WarrantyExpiredDate = data.Data;
					}
				}
				else if (field == Box.Fields.Maintenance_EOLDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Maintenance_EOLDate = null;
					else
					{
						model.Maintenance_EOLDate = data.Data;
					}
				}
				else if (field == Box.Fields.Maintenance_EOSLDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Maintenance_EOSLDate = null;
					else
					{
						model.Maintenance_EOSLDate = data.Data;
					}
				}
				else if (field == Box.Fields.Maintenance_EOSL)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Maintenance_EOSL = null;
					else
					{
						model.Maintenance_EOSL = data.Data == 1;
					}
				}
				else if (field == Box.Fields.Maintenance_MaintenanceContract)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Maintenance_MaintenanceContract = null;
					else
					{
						model.Maintenance_MaintenanceContract = data.Data == 1;
					}
				}
				else if (field == Box.Fields.Maintenance_MaintenanceCompanyName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Maintenance_MaintenanceCompanyName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Maintenance_MaintenanceCompanyName = data;
					}
				}
				else if (field == Box.Fields.Maintenance_MaintenanceBeginDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Maintenance_MaintenanceBeginDate = null;
					else
					{
						model.Maintenance_MaintenanceBeginDate = data.Data;
					}
				}
				else if (field == Box.Fields.Maintenance_MaintenanceEndDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Maintenance_MaintenanceEndDate = null;
					else
					{
						model.Maintenance_MaintenanceEndDate = data.Data;
					}
				}
				else if (field == Box.Fields.Maintenance_ProvideCompanyName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Maintenance_ProvideCompanyName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Maintenance_ProvideCompanyName = data;
					}
				}
				else if (field == Box.Fields.HW_BoxPartitionType)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_BoxPartitionType = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_BoxPartitionType = data;
					}
				}
				else if (field == Box.Fields.HW_PowerDual)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.HW_PowerDual = null;
					else
					{
						model.HW_PowerDual = data.Data == 1;
					}
				}
				else if (field == Box.Fields.HW_ConsoleUse)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.HW_ConsoleUse = null;
					else
					{
						model.HW_ConsoleUse = data.Data == 1;
					}
				}
				else if (field == Box.Fields.CPU_ModelName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.CPU_ModelName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.CPU_ModelName = data;
					}
				}
				else if (field == Box.Fields.CPU_ClockSpeed)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.CPU_ClockSpeed = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.CPU_ClockSpeed = data;
					}
				}
				else if (field == Box.Fields.CPU_SocketCount)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.CPU_SocketCount = null;
					else
					{
						model.CPU_SocketCount = data.Data;
					}
				}
				else if (field == Box.Fields.CPU_CoreCountPerCPU)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.CPU_CoreCountPerCPU = null;
					else
					{
						model.CPU_CoreCountPerCPU = data.Data;
					}
				}
				else if (field == Box.Fields.CPU_TotalSlotCount)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.CPU_TotalSlotCount = null;
					else
					{
						model.CPU_TotalSlotCount = data.Data;
					}
				}
				else if (field == Box.Fields.CPU_UseSlotCount)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.CPU_UseSlotCount = null;
					else
					{
						model.CPU_UseSlotCount = data.Data;
					}
				}
				else if (field == Box.Fields.CPU_HTUse)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.CPU_HTUse = null;
					else
					{
						model.CPU_HTUse = data.Data == 1;
					}
				}
				else if (field == Box.Fields.CPU_TotalCoreCount)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.CPU_TotalCoreCount = data.Data;
					}
				}
				else if (field == Box.Fields.Mem_TotalSlotCount)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Mem_TotalSlotCount = null;
					else
					{
						model.Mem_TotalSlotCount = data.Data;
					}
				}
				else if (field == Box.Fields.Mem_EA_1GB)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Mem_EA_1GB = null;
					else
					{
						model.Mem_EA_1GB = data.Data;
					}
				}
				else if (field == Box.Fields.Mem_EA_2GB)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Mem_EA_2GB = null;
					else
					{
						model.Mem_EA_2GB = data.Data;
					}
				}
				else if (field == Box.Fields.Mem_EA_4GB)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Mem_EA_4GB = null;
					else
					{
						model.Mem_EA_4GB = data.Data;
					}
				}
				else if (field == Box.Fields.Mem_EA_8GB)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Mem_EA_8GB = null;
					else
					{
						model.Mem_EA_8GB = data.Data;
					}
				}
				else if (field == Box.Fields.Mem_EA_16GB)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Mem_EA_16GB = null;
					else
					{
						model.Mem_EA_16GB = data.Data;
					}
				}
				else if (field == Box.Fields.Mem_EA_32GB)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Mem_EA_32GB = null;
					else
					{
						model.Mem_EA_32GB = data.Data;
					}
				}
				else if (field == Box.Fields.Mem_EA_64GB)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Mem_EA_64GB = null;
					else
					{
						model.Mem_EA_64GB = data.Data;
					}
				}
				else if (field == Box.Fields.Mem_EA_128GB)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Mem_EA_128GB = null;
					else
					{
						model.Mem_EA_128GB = data.Data;
					}
				}
				else if (field == Box.Fields.Mem_EA_256GB)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Mem_EA_256GB = null;
					else
					{
						model.Mem_EA_256GB = data.Data;
					}
				}
				else if (field == Box.Fields.Mem_UseSlotCount)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Mem_UseSlotCount = null;
					else
					{
						model.Mem_UseSlotCount = data.Data;
					}
				}
				else if (field == Box.Fields.Mem_MemoryCount)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Mem_MemoryCount = null;
					else
					{
						model.Mem_MemoryCount = data.Data;
					}
				}
				else if (field == Box.Fields.Mem_TotalMemoryVolume)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.Mem_TotalMemoryVolume = data.Data;
					}
				}
				else if (field == Box.Fields.Internal_InternalDiskVolumeGB)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Internal_InternalDiskVolumeGB = null;
					else
					{
						model.Internal_InternalDiskVolumeGB = data.Data;
					}
				}
				else if (field == Box.Fields.Internal_InternalDiskCount)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Internal_InternalDiskCount = null;
					else
					{
						model.Internal_InternalDiskCount = data.Data;
					}
				}
				else if (field == Box.Fields.Internal_InternalDiskUsableVolumeGB)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Internal_InternalDiskUsableVolumeGB = null;
					else
					{
						model.Internal_InternalDiskUsableVolumeGB = data.Data;
					}
				}
				else if (field == Box.Fields.Internal_InternalDiskTotalSlotCount)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Internal_InternalDiskTotalSlotCount = null;
					else
					{
						model.Internal_InternalDiskTotalSlotCount = data.Data;
					}
				}
				else if (field == Box.Fields.Internal_InternalDiskUseSlot)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Internal_InternalDiskUseSlot = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Internal_InternalDiskUseSlot = data;
					}
				}
				else if (field == Box.Fields.Internal_InternalDiskRaidType)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Internal_InternalDiskRaidType = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Internal_InternalDiskRaidType = data;
					}
				}
				else if (field == Box.Fields.Internal_InternalDiskSizeGB)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Internal_InternalDiskSizeGB = null;
					else
					{
						model.Internal_InternalDiskSizeGB = data.Data;
					}
				}
				else if (field == Box.Fields.External_ExternalDiskCompanyName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.External_ExternalDiskCompanyName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.External_ExternalDiskCompanyName = data;
					}
				}
				else if (field == Box.Fields.External_ExternalDiskModel)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.External_ExternalDiskModel = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.External_ExternalDiskModel = data;
					}
				}
				else if (field == Box.Fields.External_ExternalDiskRaidType)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.External_ExternalDiskRaidType = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.External_ExternalDiskRaidType = data;
					}
				}
				else if (field == Box.Fields.External_ExternalDiskSizeGB)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.External_ExternalDiskSizeGB = null;
					else
					{
						model.External_ExternalDiskSizeGB = data.Data;
					}
				}
				else if (field == Box.Fields.External_ExternalDiskMultiPathSolution)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.External_ExternalDiskMultiPathSolution = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.External_ExternalDiskMultiPathSolution = data;
					}
				}
				else if (field == Box.Fields.PS_PowerSupplyCount)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.PS_PowerSupplyCount = null;
					else
					{
						model.PS_PowerSupplyCount = data.Data;
					}
				}
				else if (field == Box.Fields.PS_PowerSupplyVolumeW)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.PS_PowerSupplyVolumeW = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.PS_PowerSupplyVolumeW = data;
					}
				}
				else if (field == Box.Fields.PS_PowerSupplyPduDual)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.PS_PowerSupplyPduDual = null;
					else
					{
						model.PS_PowerSupplyPduDual = data.Data == 1;
					}
				}
				else if (field == Box.Fields.PS_PowerSupplyRackPowerDual)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.PS_PowerSupplyRackPowerDual = null;
					else
					{
						model.PS_PowerSupplyRackPowerDual = data.Data == 1;
					}
				}
				else if (field == Box.Fields.Fan_FanCount)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Fan_FanCount = null;
					else
					{
						model.Fan_FanCount = data.Data;
					}
				}
				else if (field == Box.Fields.Fan_FanDual)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Fan_FanDual = null;
					else
					{
						model.Fan_FanDual = data.Data == 1;
					}
				}
				else if (field == Box.Fields.Nic_NicSpeed)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Nic_NicSpeed = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Nic_NicSpeed = data;
					}
				}
				else if (field == Box.Fields.Nic_NicType)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Nic_NicType = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Nic_NicType = data;
					}
				}
				else if (field == Box.Fields.Nic_NicPort)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Nic_NicPort = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Nic_NicPort = data;
					}
				}
				else if (field == Box.Fields.Nic_NicCount)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Nic_NicCount = null;
					else
					{
						model.Nic_NicCount = data.Data;
					}
				}
				else if (field == Box.Fields.Nic_NicUsePortCount)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Nic_NicUsePortCount = null;
					else
					{
						model.Nic_NicUsePortCount = data.Data;
					}
				}
				else if (field == Box.Fields.Nic_OnboardNicPortCount)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Nic_OnboardNicPortCount = null;
					else
					{
						model.Nic_OnboardNicPortCount = data.Data;
					}
				}
				else if (field == Box.Fields.Nic_OnboardNicUsePortCount)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Nic_OnboardNicUsePortCount = null;
					else
					{
						model.Nic_OnboardNicUsePortCount = data.Data;
					}
				}
				else if (field == Box.Fields.Nic_HBASpeed)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Nic_HBASpeed = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Nic_HBASpeed = data;
					}
				}
				else if (field == Box.Fields.Nic_HBAType)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Nic_HBAType = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Nic_HBAType = data;
					}
				}
				else if (field == Box.Fields.Nic_HBAPort)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Nic_HBAPort = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Nic_HBAPort = data;
					}
				}
				else if (field == Box.Fields.Nic_HBACount)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Nic_HBACount = null;
					else
					{
						model.Nic_HBACount = data.Data;
					}
				}
				else if (field == Box.Fields.Nic_UsingHBAPortCount)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Nic_UsingHBAPortCount = null;
					else
					{
						model.Nic_UsingHBAPortCount = data.Data;
					}
				}
				else if (field == Box.Fields.NW_ManageIPAddr)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.NW_ManageIPAddr = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.NW_ManageIPAddr = data;
					}
				}
				else if (field == Box.Fields.NW_IPAddr2)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.NW_IPAddr2 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.NW_IPAddr2 = data;
					}
				}
				else if (field == Box.Fields.NW_IPAddr3)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.NW_IPAddr3 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.NW_IPAddr3 = data;
					}
				}
				else if (field == Box.Fields.NW_IPAddr4)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.NW_IPAddr4 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.NW_IPAddr4 = data;
					}
				}
				else if (field == Box.Fields.Connect_SanSwitch1)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_SanSwitch1 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_SanSwitch1 = data;
					}
				}
				else if (field == Box.Fields.Connect_SanSwitch2)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_SanSwitch2 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_SanSwitch2 = data;
					}
				}
				else if (field == Box.Fields.Connect_SanSwitch3)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_SanSwitch3 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_SanSwitch3 = data;
					}
				}
				else if (field == Box.Fields.Connect_NWEquip1)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_NWEquip1 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_NWEquip1 = data;
					}
				}
				else if (field == Box.Fields.Connect_NWEquip2)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_NWEquip2 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_NWEquip2 = data;
					}
				}
				else if (field == Box.Fields.Connect_NWEquip3)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_NWEquip3 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_NWEquip3 = data;
					}
				}
				else if (field == Box.Fields.Connect_NWEquip4)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_NWEquip4 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_NWEquip4 = data;
					}
				}
				else if (field == Box.Fields.Connect_NWEquip5)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_NWEquip5 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_NWEquip5 = data;
					}
				}
				else if (field == Box.Fields.Connect_NWEquip6)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_NWEquip6 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_NWEquip6 = data;
					}
				}
				else if (field == Box.Fields.Connect_NWEquip7)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_NWEquip7 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_NWEquip7 = data;
					}
				}
				else if (field == Box.Fields.Connect_NWEquip8)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_NWEquip8 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_NWEquip8 = data;
					}
				}
				else if (field == Box.Fields.Connect_Storage1)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_Storage1 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_Storage1 = data;
					}
				}
				else if (field == Box.Fields.Connect_Storage2)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_Storage2 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_Storage2 = data;
					}
				}
				else if (field == Box.Fields.Connect_Backup1)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_Backup1 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_Backup1 = data;
					}
				}
				else if (field == Box.Fields.Connect_Backup2)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_Backup2 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_Backup2 = data;
					}
				}
				else if (field == Box.Fields.Connect_Backup3)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_Backup3 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_Backup3 = data;
					}
				}
				else if (field == Box.Fields.Connect_Backup4)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_Backup4 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_Backup4 = data;
					}
				}
				else if (field == Box.Fields.DataCenterID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.DataCenterID = data.Data;
					}
				}

				index++;
			}

			return model;
		}


		public Etc SelectEtc(string basic_Name, int dataCenterID, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where Basic_Name = '{2}' and DataCenterID = {3} ",
				GetFieldNames<Etc.Fields>(out nFieldCount), Etc.TableName
				, basic_Name
				, dataCenterID);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				Etc model = ReadEtc(arrResult, 0, out strErrorMessage);

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

		public List<Etc> SelectEtcs(Dictionary<Etc.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectEtcs(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<Etc> SelectEtcs(Dictionary<Etc.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<Etc.Fields>(out nFieldCount), Etc.TableName);

			string strCondition = "";

			if (SetCondition<Etc.Fields>(ref strCondition, dicConditions, Etc.GetFieldName, Etc.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<Etc> datas = new List<Etc>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				Etc model = ReadEtc(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private Etc ReadEtc(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			Etc model = new Etc();
			bool isNullable;

			foreach (Etc.Fields field in Etc.Fields.GetValues(typeof(Etc.Fields)))
			{
				string strFieldName = Etc.GetFieldName(field, out isNullable);

				if (field == Etc.Fields.EtcID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.EtcID = null;
					else
					{
						model.EtcID = data.Data;
					}
				}
				else if (field == Etc.Fields.Basic_Name)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_Name = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_Name = data;
					}
				}
				else if (field == Etc.Fields.Basic_Status)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_Status = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_Status = data;
					}
				}
				else if (field == Etc.Fields.Basic_RegDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Basic_RegDate = null;
					else
					{
						model.Basic_RegDate = data.Data;
					}
				}
				else if (field == Etc.Fields.Basic_Usage)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_Usage = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_Usage = data;
					}
				}
				else if (field == Etc.Fields.Basic_EquipDetailClass)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_EquipDetailClass = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_EquipDetailClass = data;
					}
				}
				else if (field == Etc.Fields.Basic_LifeYear)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Basic_LifeYear = null;
					else
					{
						model.Basic_LifeYear = data.Data;
					}
				}
				else if (field == Etc.Fields.Basic_OverUsedYear)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Basic_OverUsedYear = null;
					else
					{
						model.Basic_OverUsedYear = data.Data == 1;
					}
				}
				else if (field == Etc.Fields.Basic_ReceiveDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Basic_ReceiveDate = null;
					else
					{
						model.Basic_ReceiveDate = data.Data;
					}
				}
				else if (field == Etc.Fields.Basic_ItemLevel)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_ItemLevel = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_ItemLevel = data;
					}
				}
				else if (field == Etc.Fields.Basic_OwnerCompanyName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_OwnerCompanyName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_OwnerCompanyName = data;
					}
				}
				else if (field == Etc.Fields.Basic_OwnDepartment)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_OwnDepartment = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_OwnDepartment = data;
					}
				}
				else if (field == Etc.Fields.Basic_OperationDepartment)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_OperationDepartment = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_OperationDepartment = data;
					}
				}
				else if (field == Etc.Fields.Basic_SiteManager)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_SiteManager = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_SiteManager = data;
					}
				}
				else if (field == Etc.Fields.Basic_DiscardDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Basic_DiscardDate = null;
					else
					{
						model.Basic_DiscardDate = data.Data;
					}
				}
				else if (field == Etc.Fields.Basic_Memo)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_Memo = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_Memo = data;
					}
				}
				else if (field == Etc.Fields.Manage_SuperviseManager)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Manage_SuperviseManager = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Manage_SuperviseManager = data;
					}
				}
				else if (field == Etc.Fields.Manage_OperationManager)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Manage_OperationManager = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Manage_OperationManager = data;
					}
				}
				else if (field == Etc.Fields.Position_InstallRegion)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Position_InstallRegion = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Position_InstallRegion = data;
					}
				}
				else if (field == Etc.Fields.Position_RackDetailPosition)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Position_RackDetailPosition = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Position_RackDetailPosition = data;
					}
				}
				else if (field == Etc.Fields.Maintenance_ProvideCompanyName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Maintenance_ProvideCompanyName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Maintenance_ProvideCompanyName = data;
					}
				}
				else if (field == Etc.Fields.Maintenance_WarrantyMonth)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Maintenance_WarrantyMonth = null;
					else
					{
						model.Maintenance_WarrantyMonth = data.Data;
					}
				}
				else if (field == Etc.Fields.Maintenance_WarrantyExpiredDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Maintenance_WarrantyExpiredDate = null;
					else
					{
						model.Maintenance_WarrantyExpiredDate = data.Data;
					}
				}
				else if (field == Etc.Fields.Maintenance_FinancialDepartment)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Maintenance_FinancialDepartment = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Maintenance_FinancialDepartment = data;
					}
				}
				else if (field == Etc.Fields.Maintenance_MaintenanceCompanyName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Maintenance_MaintenanceCompanyName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Maintenance_MaintenanceCompanyName = data;
					}
				}
				else if (field == Etc.Fields.Maintenance_EOSDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Maintenance_EOSDate = null;
					else
					{
						model.Maintenance_EOSDate = data.Data;
					}
				}
				else if (field == Etc.Fields.Maintenance_MaintenanceContract)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Maintenance_MaintenanceContract = null;
					else
					{
						model.Maintenance_MaintenanceContract = data.Data == 1;
					}
				}
				else if (field == Etc.Fields.Maintenance_MaintenanceBeginDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Maintenance_MaintenanceBeginDate = null;
					else
					{
						model.Maintenance_MaintenanceBeginDate = data.Data;
					}
				}
				else if (field == Etc.Fields.Maintenance_MaintenanceEndDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Maintenance_MaintenanceEndDate = null;
					else
					{
						model.Maintenance_MaintenanceEndDate = data.Data;
					}
				}
				else if (field == Etc.Fields.HW_ModelName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_ModelName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_ModelName = data;
					}
				}
				else if (field == Etc.Fields.HW_Company)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_Company = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_Company = data;
					}
				}
				else if (field == Etc.Fields.HW_SerialNumber)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_SerialNumber = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_SerialNumber = data;
					}
				}
				else if (field == Etc.Fields.HW_FirmwareVersion)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_FirmwareVersion = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_FirmwareVersion = data;
					}
				}
				else if (field == Etc.Fields.HW_MultiLicense)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_MultiLicense = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_MultiLicense = data;
					}
				}
				else if (field == Etc.Fields.HW_MicCount)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.HW_MicCount = null;
					else
					{
						model.HW_MicCount = data.Data;
					}
				}
				else if (field == Etc.Fields.HW_PAD)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.HW_PAD = null;
					else
					{
						model.HW_PAD = data.Data == 1;
					}
				}
				else if (field == Etc.Fields.HW_Rack)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.HW_Rack = null;
					else
					{
						model.HW_Rack = data.Data == 1;
					}
				}
				else if (field == Etc.Fields.HW_MonitorModelName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_MonitorModelName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_MonitorModelName = data;
					}
				}
				else if (field == Etc.Fields.HW_MonitorType)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_MonitorType = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_MonitorType = data;
					}
				}
				else if (field == Etc.Fields.HW_MonitorScreenSizeInch)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.HW_MonitorScreenSizeInch = null;
					else
					{
						model.HW_MonitorScreenSizeInch = data.Data;
					}
				}
				else if (field == Etc.Fields.HW_ScreenIP)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_ScreenIP = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_ScreenIP = data;
					}
				}
				else if (field == Etc.Fields.HW_HostName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_HostName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_HostName = data;
					}
				}
				else if (field == Etc.Fields.HW_QoS)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.HW_QoS = null;
					else
					{
						model.HW_QoS = data.Data == 1;
					}
				}
				else if (field == Etc.Fields.HW_QosVolume)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_QosVolume = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_QosVolume = data;
					}
				}
				else if (field == Etc.Fields.HW_PrivateLine)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.HW_PrivateLine = null;
					else
					{
						model.HW_PrivateLine = data.Data == 1;
					}
				}
				else if (field == Etc.Fields.HW_PrivateCompanyBW)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_PrivateCompanyBW = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_PrivateCompanyBW = data;
					}
				}
				else if (field == Etc.Fields.HW_Special)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_Special = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_Special = data;
					}
				}
				else if (field == Etc.Fields.Connect_NWEquip_1)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_NWEquip_1 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_NWEquip_1 = data;
					}
				}
				else if (field == Etc.Fields.Connect_NWEquip_2)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_NWEquip_2 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_NWEquip_2 = data;
					}
				}
				else if (field == Etc.Fields.DataCenterID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.DataCenterID = data.Data;
					}
				}

				index++;
			}

			return model;
		}


		public Network SelectNetwork(string basic_Name, int dataCenterID, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where Basic_Name = '{2}' and DataCenterID = {3} ",
				GetFieldNames<Network.Fields>(out nFieldCount), Network.TableName
				, basic_Name
				, dataCenterID);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				Network model = ReadNetwork(arrResult, 0, out strErrorMessage);

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

		public List<Network> SelectNetworks(Dictionary<Network.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectNetworks(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<Network> SelectNetworks(Dictionary<Network.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<Network.Fields>(out nFieldCount), Network.TableName);

			string strCondition = "";

			if (SetCondition<Network.Fields>(ref strCondition, dicConditions, Network.GetFieldName, Network.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<Network> datas = new List<Network>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				Network model = ReadNetwork(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private Network ReadNetwork(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			Network model = new Network();
			bool isNullable;

			foreach (Network.Fields field in Network.Fields.GetValues(typeof(Network.Fields)))
			{
				string strFieldName = Network.GetFieldName(field, out isNullable);

				if (field == Network.Fields.NetworkID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.NetworkID = null;
					else
					{
						model.NetworkID = data.Data;
					}
				}
				else if (field == Network.Fields.Basic_Name)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_Name = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_Name = data;
					}
				}
				else if (field == Network.Fields.Basic_Status)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_Status = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_Status = data;
					}
				}
				else if (field == Network.Fields.Basic_RegDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Basic_RegDate = null;
					else
					{
						model.Basic_RegDate = data.Data;
					}
				}
				else if (field == Network.Fields.Basic_Usage)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_Usage = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_Usage = data;
					}
				}
				else if (field == Network.Fields.Basic_EquipDetailClass)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_EquipDetailClass = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_EquipDetailClass = data;
					}
				}
				else if (field == Network.Fields.Basic_ItemLevel)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_ItemLevel = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_ItemLevel = data;
					}
				}
				else if (field == Network.Fields.Basic_ReceiveDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Basic_ReceiveDate = null;
					else
					{
						model.Basic_ReceiveDate = data.Data;
					}
				}
				else if (field == Network.Fields.Basic_OwnerCompanyName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_OwnerCompanyName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_OwnerCompanyName = data;
					}
				}
				else if (field == Network.Fields.Basic_OwnDepartment)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_OwnDepartment = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_OwnDepartment = data;
					}
				}
				else if (field == Network.Fields.Basic_OperationDepartment)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_OperationDepartment = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_OperationDepartment = data;
					}
				}
				else if (field == Network.Fields.Basic_OverUsedYear)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Basic_OverUsedYear = null;
					else
					{
						model.Basic_OverUsedYear = data.Data == 1;
					}
				}
				else if (field == Network.Fields.Basic_Stock)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Basic_Stock = null;
					else
					{
						model.Basic_Stock = data.Data == 1;
					}
				}
				else if (field == Network.Fields.Basic_Type1)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_Type1 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_Type1 = data;
					}
				}
				else if (field == Network.Fields.Basic_Type2)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_Type2 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_Type2 = data;
					}
				}
				else if (field == Network.Fields.Basic_Memo)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_Memo = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_Memo = data;
					}
				}
				else if (field == Network.Fields.Manage_SuperviseManager)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Manage_SuperviseManager = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Manage_SuperviseManager = data;
					}
				}
				else if (field == Network.Fields.Manage_OperationManager)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Manage_OperationManager = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Manage_OperationManager = data;
					}
				}
				else if (field == Network.Fields.Position_InstallRegion)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Position_InstallRegion = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Position_InstallRegion = data;
					}
				}
				else if (field == Network.Fields.Position_RackDetailPosition)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Position_RackDetailPosition = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Position_RackDetailPosition = data;
					}
				}
				else if (field == Network.Fields.Maintenance_ProvideCompanyName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Maintenance_ProvideCompanyName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Maintenance_ProvideCompanyName = data;
					}
				}
				else if (field == Network.Fields.Maintenance_WarrantyMonth)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Maintenance_WarrantyMonth = null;
					else
					{
						model.Maintenance_WarrantyMonth = data.Data;
					}
				}
				else if (field == Network.Fields.Maintenance_WarrantyExpiredDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Maintenance_WarrantyExpiredDate = null;
					else
					{
						model.Maintenance_WarrantyExpiredDate = data.Data;
					}
				}
				else if (field == Network.Fields.Maintenance_MaintenanceCompanyName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Maintenance_MaintenanceCompanyName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Maintenance_MaintenanceCompanyName = data;
					}
				}
				else if (field == Network.Fields.Maintenance_EOSDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Maintenance_EOSDate = null;
					else
					{
						model.Maintenance_EOSDate = data.Data;
					}
				}
				else if (field == Network.Fields.Maintenance_EOLDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Maintenance_EOLDate = null;
					else
					{
						model.Maintenance_EOLDate = data.Data;
					}
				}
				else if (field == Network.Fields.Maintenance_MaintenanceContract)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Maintenance_MaintenanceContract = null;
					else
					{
						model.Maintenance_MaintenanceContract = data.Data == 1;
					}
				}
				else if (field == Network.Fields.Maintenance_MaintenanceBeginDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Maintenance_MaintenanceBeginDate = null;
					else
					{
						model.Maintenance_MaintenanceBeginDate = data.Data;
					}
				}
				else if (field == Network.Fields.Maintenance_MaintenanceEndDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Maintenance_MaintenanceEndDate = null;
					else
					{
						model.Maintenance_MaintenanceEndDate = data.Data;
					}
				}
				else if (field == Network.Fields.HW_ModelName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_ModelName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_ModelName = data;
					}
				}
				else if (field == Network.Fields.HW_Company)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_Company = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_Company = data;
					}
				}
				else if (field == Network.Fields.HW_SerialNumber)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_SerialNumber = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_SerialNumber = data;
					}
				}
				else if (field == Network.Fields.HW_OSVersion)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_OSVersion = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_OSVersion = data;
					}
				}
				else if (field == Network.Fields.HW_IP_01)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_IP_01 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_IP_01 = data;
					}
				}
				else if (field == Network.Fields.HW_IP_02)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_IP_02 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_IP_02 = data;
					}
				}
				else if (field == Network.Fields.HW_IP_03)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_IP_03 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_IP_03 = data;
					}
				}
				else if (field == Network.Fields.HW_IP_04)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_IP_04 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_IP_04 = data;
					}
				}
				else if (field == Network.Fields.HW_IP_05)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_IP_05 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_IP_05 = data;
					}
				}
				else if (field == Network.Fields.HW_IP_06)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_IP_06 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_IP_06 = data;
					}
				}
				else if (field == Network.Fields.HW_IP_07)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_IP_07 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_IP_07 = data;
					}
				}
				else if (field == Network.Fields.HW_IP_08)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_IP_08 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_IP_08 = data;
					}
				}
				else if (field == Network.Fields.HW_Rack)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_Rack = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_Rack = data;
					}
				}
				else if (field == Network.Fields.HW_PowerDual)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.HW_PowerDual = null;
					else
					{
						model.HW_PowerDual = data.Data == 1;
					}
				}
				else if (field == Network.Fields.HW_Zone)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_Zone = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_Zone = data;
					}
				}
				else if (field == Network.Fields.HW_DetailUsage)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_DetailUsage = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_DetailUsage = data;
					}
				}
				else if (field == Network.Fields.HW_NMS)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.HW_NMS = null;
					else
					{
						model.HW_NMS = data.Data == 1;
					}
				}
				else if (field == Network.Fields.HW_NWLineName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_NWLineName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_NWLineName = data;
					}
				}
				else if (field == Network.Fields.Connect_NWEquip_1)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_NWEquip_1 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_NWEquip_1 = data;
					}
				}
				else if (field == Network.Fields.Connect_NWEquip_2)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_NWEquip_2 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_NWEquip_2 = data;
					}
				}
				else if (field == Network.Fields.Connect_NWEquip_3)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_NWEquip_3 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_NWEquip_3 = data;
					}
				}
				else if (field == Network.Fields.Connect_NWEquip_4)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_NWEquip_4 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_NWEquip_4 = data;
					}
				}
				else if (field == Network.Fields.DataCenterID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.DataCenterID = data.Data;
					}
				}

				index++;
			}

			return model;
		}


		public SanSwitch SelectSanSwitch(string basic_Name, int dataCenterID, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where Basic_Name = '{2}' and DataCenterID = {3} ",
				GetFieldNames<SanSwitch.Fields>(out nFieldCount), SanSwitch.TableName
				, basic_Name
				, dataCenterID);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				SanSwitch model = ReadSanSwitch(arrResult, 0, out strErrorMessage);

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

		public List<SanSwitch> SelectSanSwitches(Dictionary<SanSwitch.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectSanSwitches(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<SanSwitch> SelectSanSwitches(Dictionary<SanSwitch.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<SanSwitch.Fields>(out nFieldCount), SanSwitch.TableName);

			string strCondition = "";

			if (SetCondition<SanSwitch.Fields>(ref strCondition, dicConditions, SanSwitch.GetFieldName, SanSwitch.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<SanSwitch> datas = new List<SanSwitch>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				SanSwitch model = ReadSanSwitch(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private SanSwitch ReadSanSwitch(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			SanSwitch model = new SanSwitch();
			bool isNullable;

			foreach (SanSwitch.Fields field in SanSwitch.Fields.GetValues(typeof(SanSwitch.Fields)))
			{
				string strFieldName = SanSwitch.GetFieldName(field, out isNullable);

				if (field == SanSwitch.Fields.SwitchID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.SwitchID = null;
					else
					{
						model.SwitchID = data.Data;
					}
				}
				else if (field == SanSwitch.Fields.Basic_Name)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_Name = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_Name = data;
					}
				}
				else if (field == SanSwitch.Fields.Basic_Status)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_Status = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_Status = data;
					}
				}
				else if (field == SanSwitch.Fields.Basic_RegDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Basic_RegDate = null;
					else
					{
						model.Basic_RegDate = data.Data;
					}
				}
				else if (field == SanSwitch.Fields.Basic_Usage)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_Usage = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_Usage = data;
					}
				}
				else if (field == SanSwitch.Fields.Basic_ReceiveDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Basic_ReceiveDate = null;
					else
					{
						model.Basic_ReceiveDate = data.Data;
					}
				}
				else if (field == SanSwitch.Fields.Basic_ItemLevel)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_ItemLevel = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_ItemLevel = data;
					}
				}
				else if (field == SanSwitch.Fields.Basic_OwnerCompanyName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_OwnerCompanyName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_OwnerCompanyName = data;
					}
				}
				else if (field == SanSwitch.Fields.Basic_OwnDepartment)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_OwnDepartment = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_OwnDepartment = data;
					}
				}
				else if (field == SanSwitch.Fields.Basic_OperationDepartment)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_OperationDepartment = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_OperationDepartment = data;
					}
				}
				else if (field == SanSwitch.Fields.Basic_Memo)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_Memo = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_Memo = data;
					}
				}
				else if (field == SanSwitch.Fields.Manage_SuperviseManager)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Manage_SuperviseManager = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Manage_SuperviseManager = data;
					}
				}
				else if (field == SanSwitch.Fields.Manage_OperationManager)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Manage_OperationManager = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Manage_OperationManager = data;
					}
				}
				else if (field == SanSwitch.Fields.Position_InstallRegion)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Position_InstallRegion = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Position_InstallRegion = data;
					}
				}
				else if (field == SanSwitch.Fields.Position_RackDetailPosition)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Position_RackDetailPosition = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Position_RackDetailPosition = data;
					}
				}
				else if (field == SanSwitch.Fields.Maintenance_ProvideCompanyName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Maintenance_ProvideCompanyName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Maintenance_ProvideCompanyName = data;
					}
				}
				else if (field == SanSwitch.Fields.Maintenance_WarrantyMonth)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Maintenance_WarrantyMonth = null;
					else
					{
						model.Maintenance_WarrantyMonth = data.Data;
					}
				}
				else if (field == SanSwitch.Fields.Maintenance_WarrantyExpiredDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Maintenance_WarrantyExpiredDate = null;
					else
					{
						model.Maintenance_WarrantyExpiredDate = data.Data;
					}
				}
				else if (field == SanSwitch.Fields.Maintenance_MaintenanceCompanyName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Maintenance_MaintenanceCompanyName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Maintenance_MaintenanceCompanyName = data;
					}
				}
				else if (field == SanSwitch.Fields.Maintenance_EOSDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Maintenance_EOSDate = null;
					else
					{
						model.Maintenance_EOSDate = data.Data;
					}
				}
				else if (field == SanSwitch.Fields.Maintenance_MaintenanceContract)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Maintenance_MaintenanceContract = null;
					else
					{
						model.Maintenance_MaintenanceContract = data.Data == 1;
					}
				}
				else if (field == SanSwitch.Fields.Maintenance_MaintenanceBeginDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Maintenance_MaintenanceBeginDate = null;
					else
					{
						model.Maintenance_MaintenanceBeginDate = data.Data;
					}
				}
				else if (field == SanSwitch.Fields.Maintenance_MaintenanceEndDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Maintenance_MaintenanceEndDate = null;
					else
					{
						model.Maintenance_MaintenanceEndDate = data.Data;
					}
				}
				else if (field == SanSwitch.Fields.HW_ModelName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_ModelName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_ModelName = data;
					}
				}
				else if (field == SanSwitch.Fields.HW_Company)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_Company = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_Company = data;
					}
				}
				else if (field == SanSwitch.Fields.HW_SerialNumber)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_SerialNumber = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_SerialNumber = data;
					}
				}
				else if (field == SanSwitch.Fields.HW_FirmwareVersion)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_FirmwareVersion = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_FirmwareVersion = data;
					}
				}
				else if (field == SanSwitch.Fields.HW_Dual)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.HW_Dual = null;
					else
					{
						model.HW_Dual = data.Data == 1;
					}
				}
				else if (field == SanSwitch.Fields.HW_DualSanSwitchName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_DualSanSwitchName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_DualSanSwitchName = data;
					}
				}
				else if (field == SanSwitch.Fields.HW_InterfaceType)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_InterfaceType = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_InterfaceType = data;
					}
				}
				else if (field == SanSwitch.Fields.HW_Interface)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_Interface = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_Interface = data;
					}
				}
				else if (field == SanSwitch.Fields.HW_FCPortCount)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.HW_FCPortCount = data.Data;
					}
				}
				else if (field == SanSwitch.Fields.HW_FCPortUseCount)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.HW_FCPortUseCount = data.Data;
					}
				}
				else if (field == SanSwitch.Fields.HW_FCPortFree)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.HW_FCPortFree = null;
					else
					{
						model.HW_FCPortFree = data.Data;
					}
				}
				else if (field == SanSwitch.Fields.HW_GBICPortCount)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.HW_GBICPortCount = null;
					else
					{
						model.HW_GBICPortCount = data.Data;
					}
				}
				else if (field == SanSwitch.Fields.HW_DualBoxSerial)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_DualBoxSerial = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_DualBoxSerial = data;
					}
				}
				else if (field == SanSwitch.Fields.HW_SecurityType)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_SecurityType = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_SecurityType = data;
					}
				}
				else if (field == SanSwitch.Fields.HW_FanCount)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.HW_FanCount = null;
					else
					{
						model.HW_FanCount = data.Data;
					}
				}
				else if (field == SanSwitch.Fields.HW_FanDual)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.HW_FanDual = null;
					else
					{
						model.HW_FanDual = data.Data == 1;
					}
				}
				else if (field == SanSwitch.Fields.HW_PowerSupplyDual)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.HW_PowerSupplyDual = null;
					else
					{
						model.HW_PowerSupplyDual = data.Data == 1;
					}
				}
				else if (field == SanSwitch.Fields.HW_ConnectPDUDual)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.HW_ConnectPDUDual = null;
					else
					{
						model.HW_ConnectPDUDual = data.Data == 1;
					}
				}
				else if (field == SanSwitch.Fields.Dual_RackPowerDualUse)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Dual_RackPowerDualUse = null;
					else
					{
						model.Dual_RackPowerDualUse = data.Data == 1;
					}
				}
				else if (field == SanSwitch.Fields.DataCenterID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.DataCenterID = data.Data;
					}
				}

				index++;
			}

			return model;
		}


		public Security SelectSecurity(string basic_Name, int dataCenterID, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where Basic_Name = '{2}' and DataCenterID = {3} ",
				GetFieldNames<Security.Fields>(out nFieldCount), Security.TableName
				, basic_Name
				, dataCenterID);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				Security model = ReadSecurity(arrResult, 0, out strErrorMessage);

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

		public List<Security> SelectSecurities(Dictionary<Security.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectSecurities(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<Security> SelectSecurities(Dictionary<Security.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<Security.Fields>(out nFieldCount), Security.TableName);

			string strCondition = "";

			if (SetCondition<Security.Fields>(ref strCondition, dicConditions, Security.GetFieldName, Security.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<Security> datas = new List<Security>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				Security model = ReadSecurity(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private Security ReadSecurity(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			Security model = new Security();
			bool isNullable;

			foreach (Security.Fields field in Security.Fields.GetValues(typeof(Security.Fields)))
			{
				string strFieldName = Security.GetFieldName(field, out isNullable);

				if (field == Security.Fields.SecurityID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.SecurityID = null;
					else
					{
						model.SecurityID = data.Data;
					}
				}
				else if (field == Security.Fields.Basic_Name)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_Name = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_Name = data;
					}
				}
				else if (field == Security.Fields.Basic_Status)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_Status = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_Status = data;
					}
				}
				else if (field == Security.Fields.Basic_RegDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Basic_RegDate = null;
					else
					{
						model.Basic_RegDate = data.Data;
					}
				}
				else if (field == Security.Fields.Basic_Usage)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_Usage = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_Usage = data;
					}
				}
				else if (field == Security.Fields.Basic_EquipType)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_EquipType = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_EquipType = data;
					}
				}
				else if (field == Security.Fields.Basic_EquipDetailClass)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_EquipDetailClass = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_EquipDetailClass = data;
					}
				}
				else if (field == Security.Fields.Basic_ReceiveDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Basic_ReceiveDate = null;
					else
					{
						model.Basic_ReceiveDate = data.Data;
					}
				}
				else if (field == Security.Fields.Basic_ItemLevel)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_ItemLevel = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_ItemLevel = data;
					}
				}
				else if (field == Security.Fields.Basic_OwnerCompanyName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_OwnerCompanyName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_OwnerCompanyName = data;
					}
				}
				else if (field == Security.Fields.Basic_OwnDepartment)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_OwnDepartment = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_OwnDepartment = data;
					}
				}
				else if (field == Security.Fields.Basic_OperationDepartment)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_OperationDepartment = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_OperationDepartment = data;
					}
				}
				else if (field == Security.Fields.Basic_Memo)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_Memo = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_Memo = data;
					}
				}
				else if (field == Security.Fields.Manage_SuperviseManager)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Manage_SuperviseManager = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Manage_SuperviseManager = data;
					}
				}
				else if (field == Security.Fields.Manage_OperationManager)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Manage_OperationManager = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Manage_OperationManager = data;
					}
				}
				else if (field == Security.Fields.Position_InstallRegion)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Position_InstallRegion = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Position_InstallRegion = data;
					}
				}
				else if (field == Security.Fields.Position_RackDetailPosition)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Position_RackDetailPosition = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Position_RackDetailPosition = data;
					}
				}
				else if (field == Security.Fields.Maintenance_ProvideCompanyName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Maintenance_ProvideCompanyName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Maintenance_ProvideCompanyName = data;
					}
				}
				else if (field == Security.Fields.Maintenance_WarrantyMonth)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Maintenance_WarrantyMonth = null;
					else
					{
						model.Maintenance_WarrantyMonth = data.Data;
					}
				}
				else if (field == Security.Fields.Maintenance_WarrantyExpiredDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Maintenance_WarrantyExpiredDate = null;
					else
					{
						model.Maintenance_WarrantyExpiredDate = data.Data;
					}
				}
				else if (field == Security.Fields.Maintenance_MaintenanceCompanyName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Maintenance_MaintenanceCompanyName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Maintenance_MaintenanceCompanyName = data;
					}
				}
				else if (field == Security.Fields.Maintenance_EOSDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Maintenance_EOSDate = null;
					else
					{
						model.Maintenance_EOSDate = data.Data;
					}
				}
				else if (field == Security.Fields.Maintenance_MaintenanceContract)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Maintenance_MaintenanceContract = null;
					else
					{
						model.Maintenance_MaintenanceContract = data.Data == 1;
					}
				}
				else if (field == Security.Fields.Maintenance_MaintenanceBeginDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Maintenance_MaintenanceBeginDate = null;
					else
					{
						model.Maintenance_MaintenanceBeginDate = data.Data;
					}
				}
				else if (field == Security.Fields.Maintenance_MaintenanceEndDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Maintenance_MaintenanceEndDate = null;
					else
					{
						model.Maintenance_MaintenanceEndDate = data.Data;
					}
				}
				else if (field == Security.Fields.HW_ModelName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_ModelName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_ModelName = data;
					}
				}
				else if (field == Security.Fields.HW_Company)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_Company = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_Company = data;
					}
				}
				else if (field == Security.Fields.HW_SerialNumber)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_SerialNumber = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_SerialNumber = data;
					}
				}
				else if (field == Security.Fields.HW_FirmwareVersion)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_FirmwareVersion = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_FirmwareVersion = data;
					}
				}
				else if (field == Security.Fields.HW_IP)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_IP = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_IP = data;
					}
				}
				else if (field == Security.Fields.Connect_NWEquip_1)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_NWEquip_1 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_NWEquip_1 = data;
					}
				}
				else if (field == Security.Fields.Connect_NWEquip_2)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_NWEquip_2 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_NWEquip_2 = data;
					}
				}
				else if (field == Security.Fields.DataCenterID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.DataCenterID = data.Data;
					}
				}

				index++;
			}

			return model;
		}


		public Storage SelectStorage(string basic_Name, int dataCenterID, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where Basic_Name = '{2}' and DataCenterID = {3} ",
				GetFieldNames<Storage.Fields>(out nFieldCount), Storage.TableName
				, basic_Name
				, dataCenterID);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				Storage model = ReadStorage(arrResult, 0, out strErrorMessage);

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

		public List<Storage> SelectStorages(Dictionary<Storage.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectStorages(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<Storage> SelectStorages(Dictionary<Storage.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<Storage.Fields>(out nFieldCount), Storage.TableName);

			string strCondition = "";

			if (SetCondition<Storage.Fields>(ref strCondition, dicConditions, Storage.GetFieldName, Storage.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<Storage> datas = new List<Storage>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				Storage model = ReadStorage(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private Storage ReadStorage(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			Storage model = new Storage();
			bool isNullable;

			foreach (Storage.Fields field in Storage.Fields.GetValues(typeof(Storage.Fields)))
			{
				string strFieldName = Storage.GetFieldName(field, out isNullable);

				if (field == Storage.Fields.StorageID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.StorageID = null;
					else
					{
						model.StorageID = data.Data;
					}
				}
				else if (field == Storage.Fields.Basic_Name)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_Name = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_Name = data;
					}
				}
				else if (field == Storage.Fields.Basic_Status)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_Status = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_Status = data;
					}
				}
				else if (field == Storage.Fields.Basic_RegDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Basic_RegDate = null;
					else
					{
						model.Basic_RegDate = data.Data;
					}
				}
				else if (field == Storage.Fields.Basic_Usage)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_Usage = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_Usage = data;
					}
				}
				else if (field == Storage.Fields.Basic_ItemLevel)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_ItemLevel = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_ItemLevel = data;
					}
				}
				else if (field == Storage.Fields.Basic_ReceiveDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Basic_ReceiveDate = null;
					else
					{
						model.Basic_ReceiveDate = data.Data;
					}
				}
				else if (field == Storage.Fields.Basic_ReceiveYears)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Basic_ReceiveYears = null;
					else
					{
						model.Basic_ReceiveYears = data.Data;
					}
				}
				else if (field == Storage.Fields.Basic_OwnerCompanyName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_OwnerCompanyName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_OwnerCompanyName = data;
					}
				}
				else if (field == Storage.Fields.Basic_OwnDepartment)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_OwnDepartment = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_OwnDepartment = data;
					}
				}
				else if (field == Storage.Fields.Basic_OperationDepartment)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_OperationDepartment = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_OperationDepartment = data;
					}
				}
				else if (field == Storage.Fields.Basic_SiteManager)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_SiteManager = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_SiteManager = data;
					}
				}
				else if (field == Storage.Fields.Basic_DiscardDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Basic_DiscardDate = null;
					else
					{
						model.Basic_DiscardDate = data.Data;
					}
				}
				else if (field == Storage.Fields.Basic_OverUsedYear)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Basic_OverUsedYear = null;
					else
					{
						model.Basic_OverUsedYear = data.Data == 1;
					}
				}
				else if (field == Storage.Fields.Basic_Memo)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_Memo = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_Memo = data;
					}
				}
				else if (field == Storage.Fields.Manage_SuperviseManager)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Manage_SuperviseManager = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Manage_SuperviseManager = data;
					}
				}
				else if (field == Storage.Fields.Manage_OperationManager)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Manage_OperationManager = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Manage_OperationManager = data;
					}
				}
				else if (field == Storage.Fields.Position_InstallRegion)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Position_InstallRegion = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Position_InstallRegion = data;
					}
				}
				else if (field == Storage.Fields.Position_RackDetailPosition)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Position_RackDetailPosition = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Position_RackDetailPosition = data;
					}
				}
				else if (field == Storage.Fields.Maintenance_ProvideCompanyName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Maintenance_ProvideCompanyName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Maintenance_ProvideCompanyName = data;
					}
				}
				else if (field == Storage.Fields.Maintenance_WarrantyMonth)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Maintenance_WarrantyMonth = null;
					else
					{
						model.Maintenance_WarrantyMonth = data.Data;
					}
				}
				else if (field == Storage.Fields.Maintenance_WarrantyExpiredDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Maintenance_WarrantyExpiredDate = null;
					else
					{
						model.Maintenance_WarrantyExpiredDate = data.Data;
					}
				}
				else if (field == Storage.Fields.Maintenance_MaintenanceCompanyName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Maintenance_MaintenanceCompanyName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Maintenance_MaintenanceCompanyName = data;
					}
				}
				else if (field == Storage.Fields.Maintenance_EOSDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Maintenance_EOSDate = null;
					else
					{
						model.Maintenance_EOSDate = data.Data;
					}
				}
				else if (field == Storage.Fields.Maintenance_EOLDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Maintenance_EOLDate = null;
					else
					{
						model.Maintenance_EOLDate = data.Data;
					}
				}
				else if (field == Storage.Fields.Maintenance_EOSL)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Maintenance_EOSL = null;
					else
					{
						model.Maintenance_EOSL = data.Data == 1;
					}
				}
				else if (field == Storage.Fields.Maintenance_EOSLDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Maintenance_EOSLDate = null;
					else
					{
						model.Maintenance_EOSLDate = data.Data;
					}
				}
				else if (field == Storage.Fields.Maintenance_MaintenanceContract)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Maintenance_MaintenanceContract = null;
					else
					{
						model.Maintenance_MaintenanceContract = data.Data == 1;
					}
				}
				else if (field == Storage.Fields.Maintenance_MaintenanceBeginDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Maintenance_MaintenanceBeginDate = null;
					else
					{
						model.Maintenance_MaintenanceBeginDate = data.Data;
					}
				}
				else if (field == Storage.Fields.Maintenance_MaintenanceEndDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Maintenance_MaintenanceEndDate = null;
					else
					{
						model.Maintenance_MaintenanceEndDate = data.Data;
					}
				}
				else if (field == Storage.Fields.HW_ModelName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_ModelName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_ModelName = data;
					}
				}
				else if (field == Storage.Fields.HW_Company)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_Company = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_Company = data;
					}
				}
				else if (field == Storage.Fields.HW_CacheMemory)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.HW_CacheMemory = null;
					else
					{
						model.HW_CacheMemory = data.Data;
					}
				}
				else if (field == Storage.Fields.HW_SerialNumber)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_SerialNumber = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_SerialNumber = data;
					}
				}
				else if (field == Storage.Fields.HW_DiskType)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_DiskType = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_DiskType = data;
					}
				}
				else if (field == Storage.Fields.HW_ControllerFirmwareVersion)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_ControllerFirmwareVersion = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_ControllerFirmwareVersion = data;
					}
				}
				else if (field == Storage.Fields.HW_TotalPhysicalVolume)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.HW_TotalPhysicalVolume = null;
					else
					{
						model.HW_TotalPhysicalVolume = data.Data;
					}
				}
				else if (field == Storage.Fields.HW_TotalUsableVolume)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.HW_TotalUsableVolume = data.Data;
					}
				}
				else if (field == Storage.Fields.HW_LogicalVolumeGB)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.HW_LogicalVolumeGB = null;
					else
					{
						model.HW_LogicalVolumeGB = data.Data;
					}
				}
				else if (field == Storage.Fields.HW_FreeVolumeGB)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.HW_FreeVolumeGB = null;
					else
					{
						model.HW_FreeVolumeGB = data.Data;
					}
				}
				else if (field == Storage.Fields.HW_MultiPath)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.HW_MultiPath = null;
					else
					{
						model.HW_MultiPath = data.Data == 1;
					}
				}
				else if (field == Storage.Fields.HW_MultiPathPropertyName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_MultiPathPropertyName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_MultiPathPropertyName = data;
					}
				}
				else if (field == Storage.Fields.HW_AvailableVolume)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.HW_AvailableVolume = null;
					else
					{
						model.HW_AvailableVolume = data.Data;
					}
				}
				else if (field == Storage.Fields.HW_GivenVolumeGB)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.HW_GivenVolumeGB = null;
					else
					{
						model.HW_GivenVolumeGB = data.Data;
					}
				}
				else if (field == Storage.Fields.HW_GivenRate)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
						model.HW_GivenRate = null;
					else
					{
						model.HW_GivenRate = data.Data;
					}
				}
				else if (field == Storage.Fields.Dual_DualUse)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Dual_DualUse = null;
					else
					{
						model.Dual_DualUse = data.Data == 1;
					}
				}
				else if (field == Storage.Fields.Dual_DualType)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Dual_DualType = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Dual_DualType = data;
					}
				}
				else if (field == Storage.Fields.Dual_BoxDualUse)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Dual_BoxDualUse = null;
					else
					{
						model.Dual_BoxDualUse = data.Data == 1;
					}
				}
				else if (field == Storage.Fields.Dual_BoxDualDiskEquipmentName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Dual_BoxDualDiskEquipmentName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Dual_BoxDualDiskEquipmentName = data;
					}
				}
				else if (field == Storage.Fields.Dual_BoxDualSolutionName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Dual_BoxDualSolutionName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Dual_BoxDualSolutionName = data;
					}
				}
				else if (field == Storage.Fields.Dual_ControllerDualUse)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Dual_ControllerDualUse = null;
					else
					{
						model.Dual_ControllerDualUse = data.Data == 1;
					}
				}
				else if (field == Storage.Fields.Dual_PowerDualUse)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Dual_PowerDualUse = null;
					else
					{
						model.Dual_PowerDualUse = data.Data == 1;
					}
				}
				else if (field == Storage.Fields.Dual_PDUDualUse)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Dual_PDUDualUse = null;
					else
					{
						model.Dual_PDUDualUse = data.Data == 1;
					}
				}
				else if (field == Storage.Fields.Dual_RackPowerDualUse)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Dual_RackPowerDualUse = null;
					else
					{
						model.Dual_RackPowerDualUse = data.Data == 1;
					}
				}
				else if (field == Storage.Fields.Dual_InternalCopySWUse)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Dual_InternalCopySWUse = null;
					else
					{
						model.Dual_InternalCopySWUse = data.Data == 1;
					}
				}
				else if (field == Storage.Fields.Dual_StorageCopyUse)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Dual_StorageCopyUse = null;
					else
					{
						model.Dual_StorageCopyUse = data.Data == 1;
					}
				}
				else if (field == Storage.Fields.Dual_StorageCopyType)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Dual_StorageCopyType = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Dual_StorageCopyType = data;
					}
				}
				else if (field == Storage.Fields.Volume_RegDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Volume_RegDate = null;
					else
					{
						model.Volume_RegDate = data.Data;
					}
				}
				else if (field == Storage.Fields.Volume_DiskType)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Volume_DiskType = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Volume_DiskType = data;
					}
				}
				else if (field == Storage.Fields.Volume_EachDiskVolume)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Volume_EachDiskVolume = null;
					else
					{
						model.Volume_EachDiskVolume = data.Data;
					}
				}
				else if (field == Storage.Fields.Volume_DiskCount)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Volume_DiskCount = null;
					else
					{
						model.Volume_DiskCount = data.Data;
					}
				}
				else if (field == Storage.Fields.Volume_PhysicalVolume)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Volume_PhysicalVolume = null;
					else
					{
						model.Volume_PhysicalVolume = data.Data;
					}
				}
				else if (field == Storage.Fields.Volume_UsableVolume)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Volume_UsableVolume = null;
					else
					{
						model.Volume_UsableVolume = data.Data;
					}
				}
				else if (field == Storage.Fields.Volume_RaidSystem)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Volume_RaidSystem = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Volume_RaidSystem = data;
					}
				}
				else if (field == Storage.Fields.Extra_DiskType)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Extra_DiskType = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Extra_DiskType = data;
					}
				}
				else if (field == Storage.Fields.Extra_DiskVolume)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Extra_DiskVolume = null;
					else
					{
						model.Extra_DiskVolume = data.Data;
					}
				}
				else if (field == Storage.Fields.Extra_DiskCount)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Extra_DiskCount = null;
					else
					{
						model.Extra_DiskCount = data.Data;
					}
				}
				else if (field == Storage.Fields.IP_IPType)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.IP_IPType = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.IP_IPType = data;
					}
				}
				else if (field == Storage.Fields.IP_IPAddress)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.IP_IPAddress = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.IP_IPAddress = data;
					}
				}
				else if (field == Storage.Fields.IP_NetworkSpeed)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.IP_NetworkSpeed = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.IP_NetworkSpeed = data;
					}
				}
				else if (field == Storage.Fields.Port_TotalPortCount)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Port_TotalPortCount = null;
					else
					{
						model.Port_TotalPortCount = data.Data;
					}
				}
				else if (field == Storage.Fields.Port_UsePortCount)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Port_UsePortCount = null;
					else
					{
						model.Port_UsePortCount = data.Data;
					}
				}
				else if (field == Storage.Fields.Port_LinkedSanSwitch)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Port_LinkedSanSwitch = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Port_LinkedSanSwitch = data;
					}
				}
				else if (field == Storage.Fields.Port_ReceiveDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Port_ReceiveDate = null;
					else
					{
						model.Port_ReceiveDate = data.Data;
					}
				}
				else if (field == Storage.Fields.Port_Count)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Port_Count = null;
					else
					{
						model.Port_Count = data.Data;
					}
				}
				else if (field == Storage.Fields.Connect_ServerName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_ServerName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_ServerName = data;
					}
				}
				else if (field == Storage.Fields.Connect_Usage)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_Usage = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_Usage = data;
					}
				}
				else if (field == Storage.Fields.Connect_ServiceLevel)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_ServiceLevel = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_ServiceLevel = data;
					}
				}
				else if (field == Storage.Fields.Connect_ModelName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_ModelName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_ModelName = data;
					}
				}
				else if (field == Storage.Fields.Connect_OS)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_OS = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_OS = data;
					}
				}
				else if (field == Storage.Fields.Connect_Cable)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_Cable = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_Cable = data;
					}
				}
				else if (field == Storage.Fields.Connect_GivenVolume)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
						model.Connect_GivenVolume = null;
					else
					{
						model.Connect_GivenVolume = data.Data;
					}
				}
				else if (field == Storage.Fields.Connect_RealUseVolume)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Connect_RealUseVolume = null;
					else
					{
						model.Connect_RealUseVolume = data.Data;
					}
				}
				else if (field == Storage.Fields.Connect_EtcVolume)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Connect_EtcVolume = null;
					else
					{
						model.Connect_EtcVolume = data.Data;
					}
				}
				else if (field == Storage.Fields.Connect_FreeVolume)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Connect_FreeVolume = null;
					else
					{
						model.Connect_FreeVolume = data.Data;
					}
				}
				else if (field == Storage.Fields.Connect_MonthlyIncrease)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Connect_MonthlyIncrease = null;
					else
					{
						model.Connect_MonthlyIncrease = data.Data;
					}
				}
				else if (field == Storage.Fields.Connect_ConnectType)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_ConnectType = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_ConnectType = data;
					}
				}
				else if (field == Storage.Fields.Connect_ChannelPathCount)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Connect_ChannelPathCount = null;
					else
					{
						model.Connect_ChannelPathCount = data.Data;
					}
				}
				else if (field == Storage.Fields.Connect_PathDualSolution)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_PathDualSolution = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_PathDualSolution = data;
					}
				}
				else if (field == Storage.Fields.Connect_NWEquip_1)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_NWEquip_1 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_NWEquip_1 = data;
					}
				}
				else if (field == Storage.Fields.Connect_NWEquip_2)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_NWEquip_2 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_NWEquip_2 = data;
					}
				}
				else if (field == Storage.Fields.Connect_NWEquip_3)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_NWEquip_3 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_NWEquip_3 = data;
					}
				}
				else if (field == Storage.Fields.Connect_NWEquip_4)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_NWEquip_4 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_NWEquip_4 = data;
					}
				}
				else if (field == Storage.Fields.Connect_SanSwitch_1)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_SanSwitch_1 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_SanSwitch_1 = data;
					}
				}
				else if (field == Storage.Fields.Connect_SanSwitch_2)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_SanSwitch_2 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_SanSwitch_2 = data;
					}
				}
				else if (field == Storage.Fields.Connect_SanSwitch_3)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_SanSwitch_3 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_SanSwitch_3 = data;
					}
				}
				else if (field == Storage.Fields.Connect_SanSwitch_4)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_SanSwitch_4 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_SanSwitch_4 = data;
					}
				}
				else if (field == Storage.Fields.Connect_SanSwitch_5)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_SanSwitch_5 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_SanSwitch_5 = data;
					}
				}
				else if (field == Storage.Fields.Connect_SanSwitch_6)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_SanSwitch_6 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_SanSwitch_6 = data;
					}
				}
				else if (field == Storage.Fields.Connect_SanSwitch_7)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_SanSwitch_7 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_SanSwitch_7 = data;
					}
				}
				else if (field == Storage.Fields.Connect_SanSwitch_8)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Connect_SanSwitch_8 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Connect_SanSwitch_8 = data;
					}
				}
				else if (field == Storage.Fields.DataCenterID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.DataCenterID = data.Data;
					}
				}

				index++;
			}

			return model;
		}


		public ItemServer SelectItemServer(string basic_ServerName, int dataCenterID, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where Basic_ServerName = '{2}' and DataCenterID = {3} ",
				GetFieldNames<ItemServer.Fields>(out nFieldCount), ItemServer.TableName
				, basic_ServerName
				, dataCenterID);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				ItemServer model = ReadItemServer(arrResult, 0, out strErrorMessage);

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

		public List<ItemServer> SelectItemServers(Dictionary<ItemServer.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectItemServers(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<ItemServer> SelectItemServers(Dictionary<ItemServer.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<ItemServer.Fields>(out nFieldCount), ItemServer.TableName);

			string strCondition = "";

			if (SetCondition<ItemServer.Fields>(ref strCondition, dicConditions, ItemServer.GetFieldName, ItemServer.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<ItemServer> datas = new List<ItemServer>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				ItemServer model = ReadItemServer(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private ItemServer ReadItemServer(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			ItemServer model = new ItemServer();
			bool isNullable;

			foreach (ItemServer.Fields field in ItemServer.Fields.GetValues(typeof(ItemServer.Fields)))
			{
				string strFieldName = ItemServer.GetFieldName(field, out isNullable);

				if (field == ItemServer.Fields.BoxID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.BoxID = null;
					else
					{
						model.BoxID = data.Data;
					}
				}
				else if (field == ItemServer.Fields.Basic_ServerCategory)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_ServerCategory = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_ServerCategory = data;
					}
				}
				else if (field == ItemServer.Fields.Basic_SystemName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_SystemName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_SystemName = data;
					}
				}
				else if (field == ItemServer.Fields.Basic_ServerName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_ServerName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_ServerName = data;
					}
				}
				else if (field == ItemServer.Fields.Basic_ProductGroup)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_ProductGroup = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_ProductGroup = data;
					}
				}
				else if (field == ItemServer.Fields.Basic_WorkSystemName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_WorkSystemName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_WorkSystemName = data;
					}
				}
				else if (field == ItemServer.Fields.Basic_ServerType)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_ServerType = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_ServerType = data;
					}
				}
				else if (field == ItemServer.Fields.Basic_OperationType)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_OperationType = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_OperationType = data;
					}
				}
				else if (field == ItemServer.Fields.Basic_ServerLevel)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_ServerLevel = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_ServerLevel = data;
					}
				}
				else if (field == ItemServer.Fields.Basic_ServerLevelYear_1)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_ServerLevelYear_1 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_ServerLevelYear_1 = data;
					}
				}
				else if (field == ItemServer.Fields.Basic_ServerLevelYear)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_ServerLevelYear = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_ServerLevelYear = data;
					}
				}
				else if (field == ItemServer.Fields.Basic_ReceiveDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Basic_ReceiveDate = null;
					else
					{
						model.Basic_ReceiveDate = data.Data;
					}
				}
				else if (field == ItemServer.Fields.Basic_RegDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Basic_RegDate = null;
					else
					{
						model.Basic_RegDate = data.Data;
					}
				}
				else if (field == ItemServer.Fields.Basic_Status)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_Status = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_Status = data;
					}
				}
				else if (field == ItemServer.Fields.Basic_Usage)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_Usage = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_Usage = data;
					}
				}
				else if (field == ItemServer.Fields.Basic_VirtualType)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_VirtualType = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_VirtualType = data;
					}
				}
				else if (field == ItemServer.Fields.Basic_DRType)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_DRType = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_DRType = data;
					}
				}
				else if (field == ItemServer.Fields.Basic_PropertyType)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_PropertyType = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_PropertyType = data;
					}
				}
				else if (field == ItemServer.Fields.Basic_OwnDepartment)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_OwnDepartment = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_OwnDepartment = data;
					}
				}
				else if (field == ItemServer.Fields.Basic_OperationDepartment)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_OperationDepartment = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_OperationDepartment = data;
					}
				}
				else if (field == ItemServer.Fields.Basic_GIMS)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Basic_GIMS = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Basic_GIMS = data;
					}
				}
				else if (field == ItemServer.Fields.Manage_SuperviseManager)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Manage_SuperviseManager = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Manage_SuperviseManager = data;
					}
				}
				else if (field == ItemServer.Fields.Manage_OperationManager)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Manage_OperationManager = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Manage_OperationManager = data;
					}
				}
				else if (field == ItemServer.Fields.Manage_ServiceManager)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Manage_ServiceManager = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Manage_ServiceManager = data;
					}
				}
				else if (field == ItemServer.Fields.Position_InstallRegion)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Position_InstallRegion = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Position_InstallRegion = data;
					}
				}
				else if (field == ItemServer.Fields.Position_Region)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Position_Region = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Position_Region = data;
					}
				}
				else if (field == ItemServer.Fields.Position_RackDetailPosition)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Position_RackDetailPosition = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Position_RackDetailPosition = data;
					}
				}
				else if (field == ItemServer.Fields.HW_OSType)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_OSType = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_OSType = data;
					}
				}
				else if (field == ItemServer.Fields.HW_OS)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_OS = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_OS = data;
					}
				}
				else if (field == ItemServer.Fields.HW_OSVersion)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_OSVersion = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_OSVersion = data;
					}
				}
				else if (field == ItemServer.Fields.HW_OSPatchLevel)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_OSPatchLevel = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_OSPatchLevel = data;
					}
				}
				else if (field == ItemServer.Fields.HW_OSInstallDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.HW_OSInstallDate = null;
					else
					{
						model.HW_OSInstallDate = data.Data;
					}
				}
				else if (field == ItemServer.Fields.HW_OSAccountID)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_OSAccountID = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_OSAccountID = data;
					}
				}
				else if (field == ItemServer.Fields.HW_KernelBit)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.HW_KernelBit = null;
					else
					{
						model.HW_KernelBit = data.Data;
					}
				}
				else if (field == ItemServer.Fields.HW_EOS)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.HW_EOS = null;
					else
					{
						model.HW_EOS = data.Data == 1;
					}
				}
				else if (field == ItemServer.Fields.HW_EOSDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.HW_EOSDate = null;
					else
					{
						model.HW_EOSDate = data.Data;
					}
				}
				else if (field == ItemServer.Fields.HW_AccountTPAM)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.HW_AccountTPAM = null;
					else
					{
						model.HW_AccountTPAM = data.Data == 1;
					}
				}
				else if (field == ItemServer.Fields.HW_LogicalCoreCount)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.HW_LogicalCoreCount = null;
					else
					{
						model.HW_LogicalCoreCount = data.Data;
					}
				}
				else if (field == ItemServer.Fields.HW_UsableDiskVolumeGB)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.HW_UsableDiskVolumeGB = null;
					else
					{
						model.HW_UsableDiskVolumeGB = data.Data;
					}
				}
				else if (field == ItemServer.Fields.HW_LogicalMemoryVolumeMB)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.HW_LogicalMemoryVolumeMB = null;
					else
					{
						model.HW_LogicalMemoryVolumeMB = data.Data;
					}
				}
				else if (field == ItemServer.Fields.HW_NetworkSpeed)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.HW_NetworkSpeed = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.HW_NetworkSpeed = data;
					}
				}
				else if (field == ItemServer.Fields.HW_ServerDual)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.HW_ServerDual = null;
					else
					{
						model.HW_ServerDual = data.Data == 1;
					}
				}
				else if (field == ItemServer.Fields.Dual_DualType)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Dual_DualType = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Dual_DualType = data;
					}
				}
				else if (field == ItemServer.Fields.Dual_DualSolutionVM)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Dual_DualSolutionVM = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Dual_DualSolutionVM = data;
					}
				}
				else if (field == ItemServer.Fields.Dual_DualSolutionService)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Dual_DualSolutionService = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Dual_DualSolutionService = data;
					}
				}
				else if (field == ItemServer.Fields.Dual_DualServerVM)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Dual_DualServerVM = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Dual_DualServerVM = data;
					}
				}
				else if (field == ItemServer.Fields.SW_AccountManage)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.SW_AccountManage = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.SW_AccountManage = data;
					}
				}
				else if (field == ItemServer.Fields.SW_ServerAccessInstall)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.SW_ServerAccessInstall = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.SW_ServerAccessInstall = data;
					}
				}
				else if (field == ItemServer.Fields.SW_DCA)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.SW_DCA = null;
					else
					{
						model.SW_DCA = data.Data == 1;
					}
				}
				else if (field == ItemServer.Fields.SW_VaccineInstall)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.SW_VaccineInstall = null;
					else
					{
						model.SW_VaccineInstall = data.Data == 1;
					}
				}
				else if (field == ItemServer.Fields.SW_InstallVaccineName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.SW_InstallVaccineName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.SW_InstallVaccineName = data;
					}
				}
				else if (field == ItemServer.Fields.SW_InstallSWName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.SW_InstallSWName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.SW_InstallSWName = data;
					}
				}
				else if (field == ItemServer.Fields.NW_Zone)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.NW_Zone = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.NW_Zone = data;
					}
				}
				else if (field == ItemServer.Fields.NW_ServiceIPAddr)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.NW_ServiceIPAddr = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.NW_ServiceIPAddr = data;
					}
				}
				else if (field == ItemServer.Fields.NW_ServiceIPDual)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.NW_ServiceIPDual = null;
					else
					{
						model.NW_ServiceIPDual = data.Data == 1;
					}
				}
				else if (field == ItemServer.Fields.NW_HeartBeatIPAddr)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.NW_HeartBeatIPAddr = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.NW_HeartBeatIPAddr = data;
					}
				}
				else if (field == ItemServer.Fields.NW_HeartBeatIPDual)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.NW_HeartBeatIPDual = null;
					else
					{
						model.NW_HeartBeatIPDual = data.Data == 1;
					}
				}
				else if (field == ItemServer.Fields.NW_BackupIPAddr)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.NW_BackupIPAddr = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.NW_BackupIPAddr = data;
					}
				}
				else if (field == ItemServer.Fields.NW_BackIPDual)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.NW_BackIPDual = null;
					else
					{
						model.NW_BackIPDual = data.Data == 1;
					}
				}
				else if (field == ItemServer.Fields.NW_ManageIPAddr)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.NW_ManageIPAddr = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.NW_ManageIPAddr = data;
					}
				}
				else if (field == ItemServer.Fields.NW_ManageIPDual)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.NW_ManageIPDual = null;
					else
					{
						model.NW_ManageIPDual = data.Data == 1;
					}
				}
				else if (field == ItemServer.Fields.NW_Etc1IPAddr)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.NW_Etc1IPAddr = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.NW_Etc1IPAddr = data;
					}
				}
				else if (field == ItemServer.Fields.NW_Etc1IPAddrDual)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.NW_Etc1IPAddrDual = null;
					else
					{
						model.NW_Etc1IPAddrDual = data.Data == 1;
					}
				}
				else if (field == ItemServer.Fields.NW_Etc2IPAddr)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.NW_Etc2IPAddr = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.NW_Etc2IPAddr = data;
					}
				}
				else if (field == ItemServer.Fields.NW_Etc2IPDual)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.NW_Etc2IPDual = null;
					else
					{
						model.NW_Etc2IPDual = data.Data == 1;
					}
				}
				else if (field == ItemServer.Fields.Backup_InternalOSBackup)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Backup_InternalOSBackup = null;
					else
					{
						model.Backup_InternalOSBackup = data.Data == 1;
					}
				}
				else if (field == ItemServer.Fields.Backup_InternalOSBackupSW)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Backup_InternalOSBackupSW = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Backup_InternalOSBackupSW = data;
					}
				}
				else if (field == ItemServer.Fields.Backup_ExternalBackupRun)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Backup_ExternalBackupRun = null;
					else
					{
						model.Backup_ExternalBackupRun = data.Data == 1;
					}
				}
				else if (field == ItemServer.Fields.Backup_ExternalBackupSWType)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Backup_ExternalBackupSWType = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Backup_ExternalBackupSWType = data;
					}
				}
				else if (field == ItemServer.Fields.Backup_ExternalRemote)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Backup_ExternalRemote = null;
					else
					{
						model.Backup_ExternalRemote = data.Data == 1;
					}
				}
				else if (field == ItemServer.Fields.Backup_ExternalRemotePosition)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Backup_ExternalRemotePosition = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Backup_ExternalRemotePosition = data;
					}
				}
				else if (field == ItemServer.Fields.DataCenterID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.DataCenterID = data.Data;
					}
				}
				else if (field == ItemServer.Fields.BoxName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.BoxName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.BoxName = data;
					}
				}

				index++;
			}

			return model;
		}

		public Nation SelectNation(int id, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where ID = {2} ",
				GetFieldNames<Nation.Fields>(out nFieldCount), Nation.TableName
				, id);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				Nation model = ReadNation(arrResult, 0, out strErrorMessage);

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

		public List<Nation> SelectNations(Dictionary<Nation.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectNations(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<Nation> SelectNations(Dictionary<Nation.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<Nation.Fields>(out nFieldCount), Nation.TableName);

			string strCondition = "";

			if (SetCondition<Nation.Fields>(ref strCondition, dicConditions, Nation.GetFieldName, Nation.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<Nation> datas = new List<Nation>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				Nation model = ReadNation(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private Nation ReadNation(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			Nation model = new Nation();
			bool isNullable;

			foreach (Nation.Fields field in Nation.Fields.GetValues(typeof(Nation.Fields)))
			{
				string strFieldName = Nation.GetFieldName(field, out isNullable);

				if (field == Nation.Fields.ID)
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
				else if (field == Nation.Fields.Name)
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
				else if (field == Nation.Fields.EngName)
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
				else if (field == Nation.Fields.Tag1)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Tag1 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Tag1 = data;
					}
				}
				else if (field == Nation.Fields.Tag2)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Tag2 = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Tag2 = data;
					}
				}

				index++;
			}

			return model;
		}


		public Rack SelectRack(int id, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where ID = {2} ",
				GetFieldNames<Rack.Fields>(out nFieldCount), Rack.TableName
				, id);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				Rack model = ReadRack(arrResult, 0, out strErrorMessage);

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

		public List<Rack> SelectRacks(Dictionary<Rack.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectRacks(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<Rack> SelectRacks(Dictionary<Rack.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<Rack.Fields>(out nFieldCount), Rack.TableName);

			string strCondition = "";

			if (SetCondition<Rack.Fields>(ref strCondition, dicConditions, Rack.GetFieldName, Rack.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<Rack> datas = new List<Rack>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				Rack model = ReadRack(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private Rack ReadRack(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			Rack model = new Rack();
			bool isNullable;

			foreach (Rack.Fields field in Rack.Fields.GetValues(typeof(Rack.Fields)))
			{
				string strFieldName = Rack.GetFieldName(field, out isNullable);

				if (field == Rack.Fields.ID)
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
				else if (field == Rack.Fields.Name)
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
				else if (field == Rack.Fields.CenterID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.CenterID = data.Data;
					}
				}
				else if (field == Rack.Fields.RackGroupID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.RackGroupID = null;
					else
					{
						model.RackGroupID = data.Data;
					}
				}
				else if (field == Rack.Fields.RackTypeID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.RackTypeID = data.Data;
					}
				}
				else if (field == Rack.Fields.Rotation)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.Rotation = data.Data;
					}
				}
				else if (field == Rack.Fields.X)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.X = data.Data;
					}
				}
				else if (field == Rack.Fields.Y)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.Y = data.Data;
					}
				}
				else if (field == Rack.Fields.Z)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.Z = data.Data;
					}
				}
				else if (field == Rack.Fields.RegDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.RegDate = data.Data;
					}
				}
				else if (field == Rack.Fields.ChangeDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.ChangeDate = null;
					else
					{
						model.ChangeDate = data.Data;
					}
				}

				index++;
			}

			return model;
		}

		public RackType SelectRackType(int id, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where ID = {2} ",
				GetFieldNames<RackType.Fields>(out nFieldCount), RackType.TableName
				, id);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				RackType model = ReadRackType(arrResult, 0, out strErrorMessage);

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

		public List<RackType> SelectRackTypes(Dictionary<RackType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectRackTypes(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<RackType> SelectRackTypes(Dictionary<RackType.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<RackType.Fields>(out nFieldCount), RackType.TableName);

			string strCondition = "";

			if (SetCondition<RackType.Fields>(ref strCondition, dicConditions, RackType.GetFieldName, RackType.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<RackType> datas = new List<RackType>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				RackType model = ReadRackType(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private RackType ReadRackType(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			RackType model = new RackType();
			bool isNullable;

			foreach (RackType.Fields field in RackType.Fields.GetValues(typeof(RackType.Fields)))
			{
				string strFieldName = RackType.GetFieldName(field, out isNullable);

				if (field == RackType.Fields.ID)
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
				else if (field == RackType.Fields.CompanyID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.CompanyID = data.Data;
					}
				}
				else if (field == RackType.Fields.ModelName)
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
				else if (field == RackType.Fields.Height)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.Height = data.Data;
					}
				}
				else if (field == RackType.Fields.Width)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.Width = data.Data;
					}
				}
				else if (field == RackType.Fields.Depth)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.Depth = data.Data;
					}
				}
				else if (field == RackType.Fields.Unit)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.Unit = data.Data;
					}
				}
				else if (field == RackType.Fields.Type)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Type = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Type = data;
					}
				}
				else if (field == RackType.Fields.ColorName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.ColorName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.ColorName = data;
					}
				}
				else if (field == RackType.Fields.ColorEngName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.ColorEngName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.ColorEngName = data;
					}
				}
				else if (field == RackType.Fields.ImageUrl)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.ImageUrl = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.ImageUrl = data;
					}
				}
				else if (field == RackType.Fields.GlbUrl)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.GlbUrl = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.GlbUrl = data;
					}
				}
				else if (field == RackType.Fields.FbxUrl)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.FbxUrl = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.FbxUrl = data;
					}
				}
				else if (field == RackType.Fields.Memo)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Memo = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Memo = data;
					}
				}
				else if (field == RackType.Fields.RegDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.RegDate = data.Data;
					}
				}
				else if (field == RackType.Fields.ChangeDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.ChangeDate = null;
					else
					{
						model.ChangeDate = data.Data;
					}
				}

				index++;
			}

			return model;
		}

		public RackGroup SelectRackGroup(int id, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where ID = {2} ",
				GetFieldNames<RackGroup.Fields>(out nFieldCount), RackGroup.TableName
				, id);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				RackGroup model = ReadRackGroup(arrResult, 0, out strErrorMessage);

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

		public List<RackGroup> SelectRackGroups(Dictionary<RackGroup.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectRackGroups(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<RackGroup> SelectRackGroups(Dictionary<RackGroup.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<RackGroup.Fields>(out nFieldCount), RackGroup.TableName);

			string strCondition = "";

			if (SetCondition<RackGroup.Fields>(ref strCondition, dicConditions, RackGroup.GetFieldName, RackGroup.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<RackGroup> datas = new List<RackGroup>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				RackGroup model = ReadRackGroup(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private RackGroup ReadRackGroup(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			RackGroup model = new RackGroup();
			bool isNullable;

			foreach (RackGroup.Fields field in RackGroup.Fields.GetValues(typeof(RackGroup.Fields)))
			{
				string strFieldName = RackGroup.GetFieldName(field, out isNullable);

				if (field == RackGroup.Fields.ID)
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
				else if (field == RackGroup.Fields.CenterID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.CenterID = data.Data;
					}
				}
				else if (field == RackGroup.Fields.GroupName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.GroupName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.GroupName = data;
					}
				}

				index++;
			}

			return model;
		}


		public Model.Site.Site SelectSite(int id, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where ID = {2} ",
				GetFieldNames<Model.Site.Site.Fields>(out nFieldCount), Model.Site.Site.TableName
				, id);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				Model.Site.Site model = ReadSite(arrResult, 0, out strErrorMessage);

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

		public List<Model.Site.Site> SelectSites(Dictionary<Model.Site.Site.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectSites(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<Model.Site.Site> SelectSites(Dictionary<Model.Site.Site.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<Model.Site.Site.Fields>(out nFieldCount), Model.Site.Site.TableName);

			string strCondition = "";

			if (SetCondition<Model.Site.Site.Fields>(ref strCondition, dicConditions, Model.Site.Site.GetFieldName, Model.Site.Site.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<Model.Site.Site> datas = new List<Model.Site.Site>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				Model.Site.Site model = ReadSite(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private Model.Site.Site ReadSite(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			Model.Site.Site model = new Model.Site.Site();
			bool isNullable;

			foreach (Model.Site.Site.Fields field in Model.Site.Site.Fields.GetValues(typeof(Model.Site.Site.Fields)))
			{
				string strFieldName = Model.Site.Site.GetFieldName(field, out isNullable);

				if (field == Model.Site.Site.Fields.ID)
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
				else if (field == Model.Site.Site.Fields.Name)
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
				else if (field == Model.Site.Site.Fields.EngName)
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

		public Model.Site.Data SelectSiteData(int siteID, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where SiteID = {2} ",
				GetFieldNames<Model.Site.Data.Fields>(out nFieldCount), Model.Site.Data.TableName
				, siteID);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				Model.Site.Data model = ReadSiteData(arrResult, 0, out strErrorMessage);

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

		public List<Model.Site.Data> SelectSiteDatas(Dictionary<Model.Site.Data.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectSiteDatas(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<Model.Site.Data> SelectSiteDatas(Dictionary<Model.Site.Data.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<Model.Site.Data.Fields>(out nFieldCount), Model.Site.Data.TableName);

			string strCondition = "";

			if (SetCondition<Model.Site.Data.Fields>(ref strCondition, dicConditions, Model.Site.Data.GetFieldName, Model.Site.Data.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<Model.Site.Data> datas = new List<Model.Site.Data>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				Model.Site.Data model = ReadSiteData(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private Model.Site.Data ReadSiteData(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			Model.Site.Data model = new Model.Site.Data();
			bool isNullable;

			foreach (Model.Site.Data.Fields field in Model.Site.Data.Fields.GetValues(typeof(Model.Site.Data.Fields)))
			{
				string strFieldName = Model.Site.Data.GetFieldName(field, out isNullable);

				if (field == Model.Site.Data.Fields.SiteID)
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
				else if (field == Model.Site.Data.Fields.Address)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Address = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Address = data;
					}
				}
				else if (field == Model.Site.Data.Fields.ManagerTeam)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.ManagerTeam = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.ManagerTeam = data;
					}
				}
				else if (field == Model.Site.Data.Fields.Manager)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Manager = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Manager = data;
					}
				}
				else if (field == Model.Site.Data.Fields.ServiceBeginDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.ServiceBeginDate = data.Data;
					}
				}
				else if (field == Model.Site.Data.Fields.ServiceEndDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.ServiceEndDate = data.Data;
					}
				}
				else if (field == Model.Site.Data.Fields.LicenseValidation)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.LicenseValidation = data.Data == 1;
					}
				}

				index++;
			}

			return model;
		}

		public Model.Site.Option SelectSiteOption(string propertyName, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where PropertyName = '{2}' ",
				GetFieldNames<Model.Site.Option.Fields>(out nFieldCount), Model.Site.Option.TableName
				, propertyName);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				Model.Site.Option model = ReadSiteOption(arrResult, 0, out strErrorMessage);

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

		public List<Model.Site.Option> SelectSiteOptions(Dictionary<Model.Site.Option.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectSiteOptions(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<Model.Site.Option> SelectSiteOptions(Dictionary<Model.Site.Option.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<Model.Site.Option.Fields>(out nFieldCount), Model.Site.Option.TableName);

			string strCondition = "";

			if (SetCondition<Model.Site.Option.Fields>(ref strCondition, dicConditions, Model.Site.Option.GetFieldName, Model.Site.Option.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<Model.Site.Option> datas = new List<Model.Site.Option>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				Model.Site.Option model = ReadSiteOption(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private Model.Site.Option ReadSiteOption(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			Model.Site.Option model = new Model.Site.Option();
			bool isNullable;

			foreach (Model.Site.Option.Fields field in Model.Site.Option.Fields.GetValues(typeof(Model.Site.Option.Fields)))
			{
				string strFieldName = Model.Site.Option.GetFieldName(field, out isNullable);

				if (field == Model.Site.Option.Fields.PropertyName)
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
				else if (field == Model.Site.Option.Fields.PropertyValue)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.PropertyValue = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.PropertyValue = data;
					}
				}
				else if (field == Model.Site.Option.Fields.Description)
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

		public Facility SelectFacility(int id, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where ID = {2} ",
				GetFieldNames<Facility.Fields>(out nFieldCount), Facility.TableName
				, id);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				Facility model = ReadFacility(arrResult, 0, out strErrorMessage);

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

		public List<Facility> SelectFacilities(Dictionary<Facility.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectFacilities(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<Facility> SelectFacilities(Dictionary<Facility.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
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
				Facility model = ReadFacility(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private Facility ReadFacility(ArrayList arrResult, int index, out string strErrorMessage)
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
				else if (field == Facility.Fields.FacilityTypeID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.FacilityTypeID = data.Data;
					}
				}
				else if (field == Facility.Fields.DataCenterID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.DataCenterID = data.Data;
					}
				}
				else if (field == Facility.Fields.RegDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.RegDate = null;
					else
					{
						model.RegDate = data.Data;
					}
				}
				else if (field == Facility.Fields.ChangeDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.ChangeDate = null;
					else
					{
						model.ChangeDate = data.Data;
					}
				}
				else if (field == Facility.Fields.X)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.X = data.Data;
					}
				}
				else if (field == Facility.Fields.Y)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.Y = data.Data;
					}
				}
				else if (field == Facility.Fields.Z)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.Z = data.Data;
					}
				}
				else if (field == Facility.Fields.Rotation)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.Rotation = data.Data;
					}
				}

				index++;
			}

			return model;
		}


		public FacilityType SelectFacilityType(int id, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where ID = {2} ",
				GetFieldNames<FacilityType.Fields>(out nFieldCount), FacilityType.TableName
				, id);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				FacilityType model = ReadFacilityType(arrResult, 0, out strErrorMessage);

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

		public List<FacilityType> SelectFacilityTypes(Dictionary<FacilityType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectFacilityTypes(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<FacilityType> SelectFacilityTypes(Dictionary<FacilityType.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<FacilityType.Fields>(out nFieldCount), FacilityType.TableName);

			string strCondition = "";

			if (SetCondition<FacilityType.Fields>(ref strCondition, dicConditions, FacilityType.GetFieldName, FacilityType.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<FacilityType> datas = new List<FacilityType>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				FacilityType model = ReadFacilityType(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private FacilityType ReadFacilityType(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			FacilityType model = new FacilityType();
			bool isNullable;

			foreach (FacilityType.Fields field in FacilityType.Fields.GetValues(typeof(FacilityType.Fields)))
			{
				string strFieldName = FacilityType.GetFieldName(field, out isNullable);

				if (field == FacilityType.Fields.ID)
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
				else if (field == FacilityType.Fields.EquipmentTypeID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.EquipmentTypeID = data.Data;
					}
				}
				else if (field == FacilityType.Fields.ModelName)
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
				else if (field == FacilityType.Fields.CompanyID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.CompanyID = data.Data;
					}
				}
				else if (field == FacilityType.Fields.Width)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Width = null;
					else
					{
						model.Width = data.Data;
					}
				}
				else if (field == FacilityType.Fields.Depth)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Depth = null;
					else
					{
						model.Depth = data.Data;
					}
				}
				else if (field == FacilityType.Fields.Height)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Height = null;
					else
					{
						model.Height = data.Data;
					}
				}
				else if (field == FacilityType.Fields.UnitOfLength)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.UnitOfLength = data.Data;
					}
				}
				else if (field == FacilityType.Fields.Color)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Color = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Color = data;
					}
				}
				else if (field == FacilityType.Fields.ImageUrl)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.ImageUrl = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.ImageUrl = data;
					}
				}
				else if (field == FacilityType.Fields.GlbUrl)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.GlbUrl = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.GlbUrl = data;
					}
				}
				else if (field == FacilityType.Fields.FbxUrl)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.FbxUrl = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.FbxUrl = data;
					}
				}
				else if (field == FacilityType.Fields.ClassName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.ClassName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.ClassName = data;
					}
				}
				else if (field == FacilityType.Fields.Memo)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Memo = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Memo = data;
					}
				}
				else if (field == FacilityType.Fields.RegDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.RegDate = data.Data;
					}
				}
				else if (field == FacilityType.Fields.ChangeDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.ChangeDate = null;
					else
					{
						model.ChangeDate = data.Data;
					}
				}

				index++;
			}

			return model;
		}

		public Sensor SelectSensor(int id, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where ID = {2} ",
				GetFieldNames<Sensor.Fields>(out nFieldCount), Sensor.TableName
				, id);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				Sensor model = ReadSensor(arrResult, 0, out strErrorMessage);

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

		public List<Sensor> SelectSensors(Dictionary<Sensor.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectSensors(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<Sensor> SelectSensors(Dictionary<Sensor.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
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
				Sensor model = ReadSensor(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private Sensor ReadSensor(ArrayList arrResult, int index, out string strErrorMessage)
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
				else if (field == Sensor.Fields.SensorTypeID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.SensorTypeID = data.Data;
					}
				}
				else if (field == Sensor.Fields.CenterID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.CenterID = data.Data;
					}
				}
				else if (field == Sensor.Fields.RegDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.RegDate = data.Data;
					}
				}
				else if (field == Sensor.Fields.ChangeDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.ChangeDate = null;
					else
					{
						model.ChangeDate = data.Data;
					}
				}
				else if (field == Sensor.Fields.X)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.X = data.Data;
					}
				}
				else if (field == Sensor.Fields.Y)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.Y = data.Data;
					}
				}
				else if (field == Sensor.Fields.Z)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.Z = data.Data;
					}
				}
				else if (field == Sensor.Fields.Description)
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


		public History SelectSensorHistory(int centerID, string sensorName, string dateStamp, string timeStamp, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where CenterID = {2} and SensorName = '{3}' and DateStamp = '{4}' and TimeStamp = '{5}' ",
				GetFieldNames<History.Fields>(out nFieldCount), History.TableName
				, centerID
				, sensorName
				, dateStamp
				, timeStamp);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				History model = ReadSensorHistory(arrResult, 0, out strErrorMessage);

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

		public List<History> SelectSensorHistories(Dictionary<History.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectSensorHistories(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<History> SelectSensorHistories(Dictionary<History.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<History.Fields>(out nFieldCount), History.TableName);

			string strCondition = "";

			if (SetCondition<History.Fields>(ref strCondition, dicConditions, History.GetFieldName, History.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<History> datas = new List<History>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				History model = ReadSensorHistory(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private string CastType(string strFieldType, string strCastType)
        {
			if (m_dbManager.DatabaseType == DirectDBManager.DBType.mysql)
            {
				return strFieldType;
            }

			return string.Format("cast({0} as {1})", strFieldType, strCastType);
        }

		public List<History> SelectLastSensorHistories(int centerID, out string strErrorMessage)
        {
			bool isNullable;

			string strCondition1 = string.Format("{0} = {1} and concat({2}, concat({3}, {4}))",
				History.GetFieldName(History.Fields.CenterID, out isNullable),
				centerID,
				History.GetFieldName(History.Fields.SensorName, out isNullable),
				CastType(History.GetFieldName(History.Fields.DateStamp, out isNullable), "varchar(50)"),
				//History.GetFieldName(History.Fields.DateStamp, out isNullable),
				CastType(History.GetFieldName(History.Fields.TimeStamp, out isNullable), "varchar(50)"));
				//History.GetFieldName(History.Fields.TimeStamp, out isNullable));

			string strCondition2 = string.Format("select concat({0}, max(concat({1}, {2}))) from {3} where {4} = {5} group by {0}",
				History.GetFieldName(History.Fields.SensorName, out isNullable),
				CastType(History.GetFieldName(History.Fields.DateStamp, out isNullable), "varchar(50)"),
				//History.GetFieldName(History.Fields.DateStamp, out isNullable),
				CastType(History.GetFieldName(History.Fields.TimeStamp, out isNullable), "varchar(50)"),
				//History.GetFieldName(History.Fields.TimeStamp, out isNullable),
				History.TableName,
				History.GetFieldName(History.Fields.CenterID, out isNullable),
				centerID);

			string strCondition = string.Format("{0} in ({1})", strCondition1, strCondition2);
			return SelectSensorHistories(null, strCondition, out strErrorMessage);
		}

		private History ReadSensorHistory(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			History model = new History();
			bool isNullable;

			foreach (History.Fields field in History.Fields.GetValues(typeof(History.Fields)))
			{
				string strFieldName = History.GetFieldName(field, out isNullable);

				if (field == History.Fields.SiteID)
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
				else if (field == History.Fields.SiteName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.SiteName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.SiteName = data;
					}
				}
				else if (field == History.Fields.CenterID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.CenterID = data.Data;
					}
				}
				else if (field == History.Fields.CenterName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.CenterName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.CenterName = data;
					}
				}
				else if (field == History.Fields.SensorType)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.SensorType = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.SensorType = data;
					}
				}
				else if (field == History.Fields.SensorName)
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
				else if (field == History.Fields.DateStamp)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable == false)
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
						else
							model.DateStamp = null;
					}
					else
					{
						model.DateStamp = data;
					}
				}
				else if (field == History.Fields.TimeStamp)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable == false)
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
						else
							model.TimeStamp = null;
					}
					else
					{
						model.TimeStamp = data;
					}
				}
				else if (field == History.Fields.Status)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Status = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Status = data;
					}
				}
				else if (field == History.Fields.Data)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Data = null;
					else
					{
						model.Data = data.Data;
					}
				}
				else if (field == History.Fields.Unit)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Unit = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Unit = data;
					}
				}
				else if (field == History.Fields.Description)
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


		public SensorType SelectSensorType(int id, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where ID = {2} ",
				GetFieldNames<SensorType.Fields>(out nFieldCount), SensorType.TableName
				, id);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				SensorType model = ReadSensorType(arrResult, 0, out strErrorMessage);

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

		public List<SensorType> SelectSensorTypes(Dictionary<SensorType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectSensorTypes(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<SensorType> SelectSensorTypes(Dictionary<SensorType.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
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
				SensorType model = ReadSensorType(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private SensorType ReadSensorType(ArrayList arrResult, int index, out string strErrorMessage)
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
				else if (field == SensorType.Fields.Code)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Code = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Code = data;
					}
				}
				else if (field == SensorType.Fields.RangeMax)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.RangeMax = null;
					else
					{
						model.RangeMax = data.Data;
					}
				}
				else if (field == SensorType.Fields.RangeMin)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.RangeMin = null;
					else
					{
						model.RangeMin = data.Data;
					}
				}
				else if (field == SensorType.Fields.Unit)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Unit = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Unit = data;
					}
				}
				else if (field == SensorType.Fields.ImageUrl)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.ImageUrl = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.ImageUrl = data;
					}
				}
				else if (field == SensorType.Fields.AbnormalImageUrl)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.AbnormalImageUrl = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.AbnormalImageUrl = data;
					}
				}

				index++;
			}

			return model;
		}

		public ChangeBasic SelectWorkChangeBasic(int id, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where ID = {2} ",
				GetFieldNames<ChangeBasic.Fields>(out nFieldCount), ChangeBasic.TableName
				, id);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				ChangeBasic model = ReadWorkChangeBasic(arrResult, 0, out strErrorMessage);

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

		public List<ChangeBasic> SelectWorkChangeBasics(Dictionary<ChangeBasic.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectWorkChangeBasics(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<ChangeBasic> SelectWorkChangeBasics(Dictionary<ChangeBasic.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<ChangeBasic.Fields>(out nFieldCount), ChangeBasic.TableName);

			string strCondition = "";

			if (SetCondition<ChangeBasic.Fields>(ref strCondition, dicConditions, ChangeBasic.GetFieldName, ChangeBasic.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<ChangeBasic> datas = new List<ChangeBasic>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				ChangeBasic model = ReadWorkChangeBasic(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private ChangeBasic ReadWorkChangeBasic(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			ChangeBasic model = new ChangeBasic();
			bool isNullable;

			foreach (ChangeBasic.Fields field in ChangeBasic.Fields.GetValues(typeof(ChangeBasic.Fields)))
			{
				string strFieldName = ChangeBasic.GetFieldName(field, out isNullable);

				if (field == ChangeBasic.Fields.ID)
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
				else if (field == ChangeBasic.Fields.Status)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Status = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Status = data;
					}
				}
				else if (field == ChangeBasic.Fields.Title)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Title = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Title = data;
					}
				}
				else if (field == ChangeBasic.Fields.ChangeType)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.ChangeType = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.ChangeType = data;
					}
				}
				else if (field == ChangeBasic.Fields.ChangeClass)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.ChangeClass = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.ChangeClass = data;
					}
				}
				else if (field == ChangeBasic.Fields.MainWorker)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.MainWorker = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.MainWorker = data;
					}
				}
				else if (field == ChangeBasic.Fields.ChangeWorkResult)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.ChangeWorkResult = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.ChangeWorkResult = data;
					}
				}
				else if (field == ChangeBasic.Fields.PlanBeginTime)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.PlanBeginTime = data.Data;
					}
				}
				else if (field == ChangeBasic.Fields.PlanEndTime)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.PlanEndTime = data.Data;
					}
				}
				else if (field == ChangeBasic.Fields.WorkBeginTime)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.WorkBeginTime = data.Data;
					}
				}
				else if (field == ChangeBasic.Fields.WorkEndTime)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.WorkEndTime = data.Data;
					}
				}
				else if (field == ChangeBasic.Fields.LinkedChangedWork)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.LinkedChangedWork = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.LinkedChangedWork = data;
					}
				}
				else if (field == ChangeBasic.Fields.Priority)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Priority = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Priority = data;
					}
				}
				else if (field == ChangeBasic.Fields.Register)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Register = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Register = data;
					}
				}
				else if (field == ChangeBasic.Fields.RegTime)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.RegTime = data.Data;
					}
				}
				else if (field == ChangeBasic.Fields.WorkData)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.WorkData = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.WorkData = data;
					}
				}
				else if (field == ChangeBasic.Fields.DataCenterID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.DataCenterID = data.Data;
					}
				}
				else if (field == ChangeBasic.Fields.WorkID)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.WorkID = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.WorkID = data;
					}
				}

				index++;
			}

			return model;
		}

		public ChangeTarget SelectWorkChangeTarget(int id, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where ID = {2} ",
				GetFieldNames<ChangeTarget.Fields>(out nFieldCount), ChangeTarget.TableName
				, id);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				ChangeTarget model = ReadWorkChangeTarget(arrResult, 0, out strErrorMessage);

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

		public List<ChangeTarget> SelectWorkChangeTargets(Dictionary<ChangeTarget.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectWorkChangeTargets(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<ChangeTarget> SelectWorkChangeTargets(Dictionary<ChangeTarget.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<ChangeTarget.Fields>(out nFieldCount), ChangeTarget.TableName);

			string strCondition = "";

			if (SetCondition<ChangeTarget.Fields>(ref strCondition, dicConditions, ChangeTarget.GetFieldName, ChangeTarget.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<ChangeTarget> datas = new List<ChangeTarget>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				ChangeTarget model = ReadWorkChangeTarget(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private ChangeTarget ReadWorkChangeTarget(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			ChangeTarget model = new ChangeTarget();
			bool isNullable;

			foreach (ChangeTarget.Fields field in ChangeTarget.Fields.GetValues(typeof(ChangeTarget.Fields)))
			{
				string strFieldName = ChangeTarget.GetFieldName(field, out isNullable);

				if (field == ChangeTarget.Fields.ID)
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
				else if (field == ChangeTarget.Fields.WorkID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.WorkID = data.Data;
					}
				}
				else if (field == ChangeTarget.Fields.DataCenterID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.DataCenterID = data.Data;
					}
				}
				else if (field == ChangeTarget.Fields.PropertyName)
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
				else if (field == ChangeTarget.Fields.EquipmentTypeID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.EquipmentTypeID = data.Data;
					}
				}
				else if (field == ChangeTarget.Fields.ServicePause)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						model.ServicePause = null;
					}
					else
					{
						model.ServicePause = data.Data == 1;
					}
				}
				else if (field == ChangeTarget.Fields.ServicePausePlanHour)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						model.ServicePausePlanHour = null;
					}
					else
					{
						model.ServicePausePlanHour = data.Data;
					}
				}
				else if (field == ChangeTarget.Fields.Change)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Change = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Change = data;
					}
				}
				else if (field == ChangeTarget.Fields.ChangeData)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.ChangeData = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.ChangeData = data;
					}
				}
				else if (field == ChangeTarget.Fields.ReviewResult)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.ReviewResult = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.ReviewResult = data;
					}
				}
				else if (field == ChangeTarget.Fields.Reviewer)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Reviewer = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Reviewer = data;
					}
				}
				else if (field == ChangeTarget.Fields.ReviewDate)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.ReviewDate = data.Data;
					}
				}
				else if (field == ChangeTarget.Fields.ChangeResult)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.ChangeResult = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.ChangeResult = data;
					}
				}
				else if (field == ChangeTarget.Fields.ChangeDetail)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.ChangeDetail = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.ChangeDetail = data;
					}
				}

				index++;
			}

			return model;
		}


		public FaultBasic SelectWorkFaultBasic(int id, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where ID = {2} ",
				GetFieldNames<FaultBasic.Fields>(out nFieldCount), FaultBasic.TableName
				, id);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				FaultBasic model = ReadWorkFaultBasic(arrResult, 0, out strErrorMessage);

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

		public List<FaultBasic> SelectWorkFaultBasics(Dictionary<FaultBasic.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectWorkFaultBasics(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<FaultBasic> SelectWorkFaultBasics(Dictionary<FaultBasic.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<FaultBasic.Fields>(out nFieldCount), FaultBasic.TableName);

			string strCondition = "";

			if (SetCondition<FaultBasic.Fields>(ref strCondition, dicConditions, FaultBasic.GetFieldName, FaultBasic.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<FaultBasic> datas = new List<FaultBasic>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				FaultBasic model = ReadWorkFaultBasic(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private FaultBasic ReadWorkFaultBasic(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			FaultBasic model = new FaultBasic();
			bool isNullable;

			foreach (FaultBasic.Fields field in FaultBasic.Fields.GetValues(typeof(FaultBasic.Fields)))
			{
				string strFieldName = FaultBasic.GetFieldName(field, out isNullable);

				if (field == FaultBasic.Fields.ID)
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
				else if (field == FaultBasic.Fields.Title)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Title = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Title = data;
					}
				}
				else if (field == FaultBasic.Fields.Status)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Status = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Status = data;
					}
				}
				else if (field == FaultBasic.Fields.Reason)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Reason = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Reason = data;
					}
				}
				else if (field == FaultBasic.Fields.Range)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Range = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Range = data;
					}
				}
				else if (field == FaultBasic.Fields.ReasonType)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.ReasonType = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.ReasonType = data;
					}
				}
				else if (field == FaultBasic.Fields.FaultLevel)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.FaultLevel = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.FaultLevel = data;
					}
				}
				else if (field == FaultBasic.Fields.Region)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Region = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Region = data;
					}
				}
				else if (field == FaultBasic.Fields.Manager)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Manager = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Manager = data;
					}
				}
				else if (field == FaultBasic.Fields.EventTime)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.EventTime = data.Data;
					}
				}
				else if (field == FaultBasic.Fields.FinishTime)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.FinishTime = data.Data;
					}
				}
				else if (field == FaultBasic.Fields.DataCenterID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.DataCenterID = data.Data;
					}
				}
				else if (field == FaultBasic.Fields.FaultID)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.FaultID = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.FaultID = data;
					}
				}

				index++;
			}

			return model;
		}

		public FaultTarget SelectWorkFaultTarget(int id, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where ID = {2} ",
				GetFieldNames<FaultTarget.Fields>(out nFieldCount), FaultTarget.TableName
				, id);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				FaultTarget model = ReadWorkFaultTarget(arrResult, 0, out strErrorMessage);

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

		public List<FaultTarget> SelectWorkFaultTargets(Dictionary<FaultTarget.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectWorkFaultTargets(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<FaultTarget> SelectWorkFaultTargets(Dictionary<FaultTarget.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<FaultTarget.Fields>(out nFieldCount), FaultTarget.TableName);

			string strCondition = "";

			if (SetCondition<FaultTarget.Fields>(ref strCondition, dicConditions, FaultTarget.GetFieldName, FaultTarget.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<FaultTarget> datas = new List<FaultTarget>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				FaultTarget model = ReadWorkFaultTarget(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private FaultTarget ReadWorkFaultTarget(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			FaultTarget model = new FaultTarget();
			bool isNullable;

			foreach (FaultTarget.Fields field in FaultTarget.Fields.GetValues(typeof(FaultTarget.Fields)))
			{
				string strFieldName = FaultTarget.GetFieldName(field, out isNullable);

				if (field == FaultTarget.Fields.ID)
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
				else if (field == FaultTarget.Fields.FaultID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.FaultID = data.Data;
					}
				}
				else if (field == FaultTarget.Fields.SystemName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.SystemName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.SystemName = data;
					}
				}
				else if (field == FaultTarget.Fields.Department)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Department = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Department = data;
					}
				}
				else if (field == FaultTarget.Fields.EquipmentTypeID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.EquipmentTypeID = data.Data;
					}
				}
				else if (field == FaultTarget.Fields.DataCenterID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.DataCenterID = data.Data;
					}
				}

				index++;
			}

			return model;
		}

		public Regular SelectTeamRegular(int id, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where ID = {2} ", 
				GetFieldNames<Regular.Fields>(out nFieldCount), Regular.TableName
				, id);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				Regular model = ReadTeamRegular(arrResult, 0, out strErrorMessage);

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

		public List<Regular> SelectTeamRegulars(Dictionary<Regular.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectTeamRegulars(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<Regular> SelectTeamRegulars(Dictionary<Regular.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<Regular.Fields>(out nFieldCount), Regular.TableName);

			string strCondition = "";

			if (SetCondition<Regular.Fields>(ref strCondition, dicConditions, Regular.GetFieldName, Regular.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<Regular> datas = new List<Regular>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				Regular model = ReadTeamRegular(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private Regular ReadTeamRegular(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			Regular model = new Regular();
			bool isNullable;

			foreach (Regular.Fields field in Regular.Fields.GetValues(typeof(Regular.Fields)))
			{
				string strFieldName = Regular.GetFieldName(field, out isNullable);

				if (field == Regular.Fields.ID)
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
				else if (field == Regular.Fields.TeamName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.TeamName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.TeamName = data;
					}
				}
				else if (field == Regular.Fields.ParentTeamID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.ParentTeamID = null;
					else
					{
						model.ParentTeamID = data.Data;
					}
				}

				index++;
			}

			return model;
		}


		public RegularMember SelectTeamRegularMember(int id, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where ID = {2} ",
				GetFieldNames<RegularMember.Fields>(out nFieldCount), RegularMember.TableName
				, id);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				RegularMember model = ReadTeamRegularMember(arrResult, 0, out strErrorMessage);

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

		public List<RegularMember> SelectTeamRegularMembers(Dictionary<RegularMember.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectTeamRegularMembers(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<RegularMember> SelectTeamRegularMembers(Dictionary<RegularMember.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<RegularMember.Fields>(out nFieldCount), RegularMember.TableName);

			string strCondition = "";

			if (SetCondition<RegularMember.Fields>(ref strCondition, dicConditions, RegularMember.GetFieldName, RegularMember.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<RegularMember> datas = new List<RegularMember>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				RegularMember model = ReadTeamRegularMember(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private RegularMember ReadTeamRegularMember(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			RegularMember model = new RegularMember();
			bool isNullable;

			foreach (RegularMember.Fields field in RegularMember.Fields.GetValues(typeof(RegularMember.Fields)))
			{
				string strFieldName = RegularMember.GetFieldName(field, out isNullable);

				if (field == RegularMember.Fields.ID)
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
				else if (field == RegularMember.Fields.RegularID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.RegularID = data.Data;
					}
				}
				else if (field == RegularMember.Fields.MemberName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.MemberName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.MemberName = data;
					}
				}
				else if (field == RegularMember.Fields.MemberID)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.MemberID = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.MemberID = data;
					}
				}
				else if (field == RegularMember.Fields.OfficePhoneNumber)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.OfficePhoneNumber = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.OfficePhoneNumber = data;
					}
				}
				else if (field == RegularMember.Fields.PhoneNumber)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.PhoneNumber = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.PhoneNumber = data;
					}
				}
				else if (field == RegularMember.Fields.JobLevel)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.JobLevel = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.JobLevel = data;
					}
				}
				else if (field == RegularMember.Fields.JobPosition)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.JobPosition = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.JobPosition = data;
					}
				}
				else if (field == RegularMember.Fields.Email)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Email = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Email = data;
					}
				}
				else if (field == RegularMember.Fields.Status)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Status = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Status = data;
					}
				}

				index++;
			}

			return model;
		}

		public List<string> GetSiteCompanyList(int siteID, out string strErrorMessage)
        {
			bool isNullable;
			string strSQL = string.Format("Select {1}.{0} from {1}, {2} where {1}.{3} = {2}.{4} and {2}.{5} = {6} group by {1}.{0}",
				Model.DataCenter.Data.GetFieldName(Model.DataCenter.Data.Fields.Company, out isNullable),
				Model.DataCenter.Data.TableName,
				Model.DataCenter.DataCenter.TableName,
				Model.DataCenter.Data.GetFieldName(Model.DataCenter.Data.Fields.CenterID, out isNullable),
				Model.DataCenter.DataCenter.GetFieldName(Model.DataCenter.DataCenter.Fields.ID, out isNullable),
				Model.DataCenter.DataCenter.GetFieldName(Model.DataCenter.DataCenter.Fields.SiteID, out isNullable),
				siteID);

			strErrorMessage = null;
			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult == null)
            {
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			List<string> companyList = new List<string>();
			int nResultCount = arrResult.Count;

			for (int i=0;i<nResultCount;i++)
            {
				string strCompany = WebDBManager.GetStringField(arrResult[i]);

				if (strCompany == null || strCompany.Length == 0)
					continue;

				companyList.Add(strCompany);
            }

			return companyList;
		}

		public ArrayList JoinSessionUserLevel(string strAdditionalConditions, out string strErrorMessage)
        {
			return JoinSessionUserLevel(strAdditionalConditions, null, out strErrorMessage);
		}

		public ArrayList JoinSessionUserLevel(string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;

			string strSessionTableName = Session.TableName;
			string strUserTableName = User.TableName;
			string strLevelTableName = Level.TableName;

			int nSessionFieldCount, nUserFieldCount, nLevelFieldCount;

			string strSessionFields = GetFieldNames<Session.Fields>(strSessionTableName, out nSessionFieldCount);
			string strUserFields = GetFieldNames<User.Fields>(strUserTableName, out nUserFieldCount);
			string strLevelFields = GetFieldNames<Level.Fields>(strLevelTableName, out nLevelFieldCount);

			int nFieldsCount = nSessionFieldCount + nUserFieldCount + nLevelFieldCount;

			StringBuilder sb = new StringBuilder();
			sb.AppendFormat("Select {0}, {1}, {2} ", strSessionFields, strUserFields, strLevelFields);
			sb.AppendFormat("  From {0}, {1}, {2} ", strSessionTableName, strUserTableName, strLevelTableName);
			sb.AppendFormat(" Where {0}.{1} = {2}.{3} ", strSessionTableName, Session.Fields.AccountUserID, strUserTableName, User.Fields.ID);
			sb.AppendFormat("   And {0}.{1} = {2}.{3} ", strUserTableName, User.Fields.UserLevel, strLevelTableName, Level.Fields.ID);

			if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
			{
				sb.AppendFormat(" And {0}", strAdditionalConditions);
			}

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(sb.ToString()) : m_dbManager.GetResultData(sb.ToString(), (int)topNCount);
			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			Dictionary<string, string> sessionTableInfo, userTableInfo, levelTableInfo;

			if (m_dicTableInfos.TryGetValue(strSessionTableName, out sessionTableInfo) == false)
			{
				sessionTableInfo = m_dbManager.GetColumnInfoDictionary(strSessionTableName);
				m_dicTableInfos[strSessionTableName] = sessionTableInfo;
			}

			if (m_dicTableInfos.TryGetValue(strUserTableName, out userTableInfo) == false)
			{
				userTableInfo = m_dbManager.GetColumnInfoDictionary(strUserTableName);
				m_dicTableInfos[strUserTableName] = userTableInfo;
			}

			if (m_dicTableInfos.TryGetValue(strLevelTableName, out levelTableInfo) == false)
			{
				levelTableInfo = m_dbManager.GetColumnInfoDictionary(strLevelTableName);
				m_dicTableInfos[strLevelTableName] = levelTableInfo;
			}

			var sessionFields = GetProperties<Session>();
			var userFields = GetProperties<User>();
			var levelFields = GetProperties<Level>();

			Dictionary<string, int> dicSessionFieldIndex, dicUserFieldIndex, dicLevelFieldIndex;
			List<string> sessionFieldNames = GetFieldNameIndex<Session.Fields>(out dicSessionFieldIndex);
			List<string> userFieldNames = GetFieldNameIndex<User.Fields>(out dicUserFieldIndex);
			List<string> levelFieldNames = GetFieldNameIndex<Level.Fields>(out dicLevelFieldIndex);
			string[] notExistMember;

			strErrorMessage = null;
			int nResultCount = arrResult.Count;

			ArrayList arrDatas = new ArrayList();

			for (int i = 0; i < nResultCount - (nFieldsCount - 1); i += nFieldsCount)
			{
				ArrayList arrSessionResult = SortWithProperties(ParseArray(arrResult, i, nSessionFieldCount), ref sessionFields, sessionFieldNames, dicSessionFieldIndex);
				ArrayList arrUserResult = SortWithProperties(ParseArray(arrResult, i + nSessionFieldCount, nUserFieldCount), ref userFields, userFieldNames, dicUserFieldIndex);
				ArrayList arrLevelResult = SortWithProperties(ParseArray(arrResult, i + nSessionFieldCount + nUserFieldCount, nLevelFieldCount), ref levelFields, levelFieldNames, dicLevelFieldIndex);

				if (arrSessionResult == null || arrUserResult == null ||
					arrLevelResult == null)
					return null;

				List<object> sessions = m_dbManager.SetParamsWithColumnInfo(sessionTableInfo, new Session(), sessionFields, arrSessionResult, out notExistMember);
				List<object> users = m_dbManager.SetParamsWithColumnInfo(userTableInfo, new User(), userFields, arrUserResult, out notExistMember);
				List<object> levels = m_dbManager.SetParamsWithColumnInfo(levelTableInfo, new Level(), levelFields, arrLevelResult, out notExistMember);

				if (sessions == null || users == null ||
					levels == null ||
					sessions.Count != 1 || users.Count != 1 ||
					levels.Count != 1)
					return null;

				arrDatas.Add(sessions[0]);
				arrDatas.Add(users[0]);
				arrDatas.Add(levels[0]);
			}

			return arrDatas;
		}



		public ArrayList JoinItemServerBox(string strAdditionalConditions, out string strErrorMessage)
		{
			return JoinItemServerBox(strAdditionalConditions, null, out strErrorMessage);
		}

		public ArrayList JoinItemServerBox(string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;

			string strItemServerTableName = ItemServer.TableName;
			string strBoxTableName = Box.TableName;

			int nItemServerFieldCount, nBoxFieldCount;

			string strItemServerFields = GetFieldNames<ItemServer.Fields>(strItemServerTableName, out nItemServerFieldCount);
			string strBoxFields = GetFieldNames<Box.Fields>(strBoxTableName, out nBoxFieldCount);

			int nFieldsCount = nItemServerFieldCount + nBoxFieldCount;

			StringBuilder sb = new StringBuilder();
			sb.AppendFormat("Select {0}, {1} ", strItemServerFields, strBoxFields);
			sb.AppendFormat("  From {0}, {1} ", strItemServerTableName, strBoxTableName);
			sb.AppendFormat(" Where {0}.{1} = {2}.{3} ", strItemServerTableName, ItemServer.Fields.BoxID, strBoxTableName, Box.Fields.BoxID);

			if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
			{
				sb.AppendFormat(" And {0}", strAdditionalConditions);
			}

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(sb.ToString()) : m_dbManager.GetResultData(sb.ToString(), (int)topNCount);
			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			ArrayList arrDatas = new ArrayList();
			int nResultCount = arrResult.Count;

			for (int i = 0; i < nResultCount - (nFieldsCount - 1); i += nFieldsCount)
			{
				ItemServer itemServer = ReadItemServer(arrResult, i, out strErrorMessage);

				if (itemServer == null)
					return null;
				else
					arrDatas.Add(itemServer);

				Box box = ReadBox(arrResult, i + nItemServerFieldCount, out strErrorMessage);

				if (box == null)
					return null;
				else
					arrDatas.Add(box);
			}

			return arrDatas;
		}

		public ArrayList JoinRackEquipmentTypeItemItemRUItemTypeCompany(string strConditions, out string strErrorMessage)
        {
			string strRackTableName = Rack.TableName;
			string strEquipmentTypeTableName = EquipmentType.TableName;
			string strItemTableName = Item.TableName;
			string strItemTypeTableName = ItemType.TableName;
			string strCompanyTableName = Company.TableName;
			string strItemRUTableName = Item_RU.TableName;

			int nRackFieldCount, nEquipmentTypeFieldCount, nItemFieldCount, nItemTypeFieldCount, nCompanyFieldCount, nItemRUFieldCount;

			string strRackFields = GetFieldNames<Rack.Fields>(strRackTableName, out nRackFieldCount);
			string strEquipmentTypeFields = GetFieldNames<EquipmentType.Fields>(strEquipmentTypeTableName, out nEquipmentTypeFieldCount);
			string strItemFields = GetFieldNames<Item.Fields>(strItemTableName, out nItemFieldCount);
			string strItemTypeFields = GetFieldNames<ItemType.Fields>(strItemTypeTableName, out nItemTypeFieldCount);
			string strCompanyFields = GetFieldNames<Company.Fields>(strCompanyTableName, out nCompanyFieldCount);
			string strItemRUField = GetFieldNames<Item_RU.Fields>(strItemRUTableName, out nItemRUFieldCount);

			bool isNullable;
			int nFieldsCount = nRackFieldCount + nEquipmentTypeFieldCount + nItemFieldCount + nItemTypeFieldCount + nCompanyFieldCount + nItemRUFieldCount;

			string strSQL = string.Format("Select {0}, {1}, {2}, {3}, {4}, {5} from {6}, {7}, {8}, {9}, {10}, {11} where {6}.{12} = {9}.{13} and {8}.{14} = {9}.{15} and {8}.{16} = {10}.{17} and {10}.{18} = {7}.{19} and {10}.{20} = {11}.{21}",
				strRackFields, strEquipmentTypeFields, strItemFields, strItemRUField, strItemTypeFields, strCompanyFields,
				strRackTableName, strEquipmentTypeTableName, strItemTableName, strItemRUTableName, strItemTypeTableName, strCompanyTableName,
				Rack.GetFieldName(Rack.Fields.ID, out isNullable),
				Item_RU.GetFieldName(Item_RU.Fields.RackID, out isNullable),
				Item.GetFieldName(Item.Fields.ID, out isNullable),
				Item_RU.GetFieldName(Item_RU.Fields.ItemID, out isNullable),
				Item.GetFieldName(Item.Fields.ItemTypeID, out isNullable),
				ItemType.GetFieldName(ItemType.Fields.ID, out isNullable),
				ItemType.GetFieldName(ItemType.Fields.EquipmentType, out isNullable),
				EquipmentType.GetFieldName(EquipmentType.Fields.ID, out isNullable),
				ItemType.GetFieldName(ItemType.Fields.CompanyID, out isNullable),
				Company.GetFieldName(Company.Fields.ID, out isNullable));

			if (strConditions != null && strConditions.Length > 0)
			{
				strSQL += " and " + strConditions;
			}

			return JoinRackEquipmentTypeItemItemRUItemTypeCompany(strSQL, nFieldsCount, nRackFieldCount, nEquipmentTypeFieldCount, nItemFieldCount, nItemTypeFieldCount, nItemRUFieldCount, out strErrorMessage);
		}

		public ArrayList JoinRackEquipmentTypeItemItemRUItemTypeCompany(int dataCenterID, string strAdditionalConditions, out string strErrorMessage)
        {
			string strRackTableName = Rack.TableName;
			string strEquipmentTypeTableName = EquipmentType.TableName;
			string strItemTableName = Item.TableName;
			string strItemTypeTableName = ItemType.TableName;
			string strCompanyTableName = Company.TableName;
			string strItemRUTableName = Item_RU.TableName;

			int nRackFieldCount, nEquipmentTypeFieldCount, nItemFieldCount, nItemTypeFieldCount, nCompanyFieldCount, nItemRUFieldCount;

			string strRackFields = GetFieldNames<Rack.Fields>(strRackTableName, out nRackFieldCount);
			string strEquipmentTypeFields = GetFieldNames<EquipmentType.Fields>(strEquipmentTypeTableName, out nEquipmentTypeFieldCount);
			string strItemFields = GetFieldNames<Item.Fields>(strItemTableName, out nItemFieldCount);
			string strItemTypeFields = GetFieldNames<ItemType.Fields>(strItemTypeTableName, out nItemTypeFieldCount);
			string strCompanyFields = GetFieldNames<Company.Fields>(strCompanyTableName, out nCompanyFieldCount);
			string strItemRUField = GetFieldNames<Item_RU.Fields>(strItemRUTableName, out nItemRUFieldCount);

			bool isNullable;
			int nFieldsCount = nRackFieldCount + nEquipmentTypeFieldCount + nItemFieldCount + nItemTypeFieldCount + nCompanyFieldCount + nItemRUFieldCount;

			string strSQL = string.Format("Select {0}, {1}, {2}, {3}, {4}, {5} from {6}, {7}, {8}, {9}, {10}, {11} where {6}.{12} = {9}.{13} and {8}.{14} = {9}.{15} and {8}.{16} = {10}.{17} and {10}.{18} = {7}.{19} and {10}.{20} = {11}.{21} and {6}.{22} = {23}",
				strRackFields, strEquipmentTypeFields, strItemFields, strItemRUField, strItemTypeFields, strCompanyFields,
				strRackTableName, strEquipmentTypeTableName, strItemTableName, strItemRUTableName, strItemTypeTableName, strCompanyTableName,
				Rack.GetFieldName(Rack.Fields.ID, out isNullable),
				Item_RU.GetFieldName(Item_RU.Fields.RackID, out isNullable),
				Item.GetFieldName(Item.Fields.ID, out isNullable),
				Item_RU.GetFieldName(Item_RU.Fields.ItemID, out isNullable),
				Item.GetFieldName(Item.Fields.ItemTypeID, out isNullable),
				ItemType.GetFieldName(ItemType.Fields.ID, out isNullable),
				ItemType.GetFieldName(ItemType.Fields.EquipmentType, out isNullable),
				EquipmentType.GetFieldName(EquipmentType.Fields.ID, out isNullable),
				ItemType.GetFieldName(ItemType.Fields.CompanyID, out isNullable),
				Company.GetFieldName(Company.Fields.ID, out isNullable),
				Rack.GetFieldName(Rack.Fields.CenterID, out isNullable),
				dataCenterID);

			if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
			{
				strSQL += " and " + strAdditionalConditions;
			}

			return JoinRackEquipmentTypeItemItemRUItemTypeCompany(strSQL, nFieldsCount, nRackFieldCount, nEquipmentTypeFieldCount, nItemFieldCount, nItemTypeFieldCount, nItemRUFieldCount, out strErrorMessage);
		}

		private ArrayList JoinRackEquipmentTypeItemItemRUItemTypeCompany(string strSQL, int nFieldsCount, int nRackFieldCount, int nEquipmentTypeFieldCount, int nItemFieldCount, int nItemTypeFieldCount, int nItemRUFieldCount, out string strErrorMessage)
        {
			strErrorMessage = null;

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);
			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			ArrayList arrDatas = new ArrayList();
			int nResultCount = arrResult.Count;

			for (int i = 0; i < nResultCount - (nFieldsCount - 1); i += nFieldsCount)
			{
				Rack rack = ReadRack(arrResult, i, out strErrorMessage);

				if (rack == null)
					return null;
				else
					arrDatas.Add(rack);

				EquipmentType equipmentType = ReadEquipmentType(arrResult, i + nRackFieldCount, out strErrorMessage);

				if (equipmentType == null)
					return null;
				else
					arrDatas.Add(equipmentType);

				Item item = ReadItem(arrResult, i + nRackFieldCount + nEquipmentTypeFieldCount, out strErrorMessage);

				if (item == null)
					return null;
				else
					arrDatas.Add(item);

				Item_RU itemRU = ReadItem_RU(arrResult, i + nRackFieldCount + nEquipmentTypeFieldCount + nItemFieldCount, out strErrorMessage);

				if (itemRU == null)
					return null;
				else
					arrDatas.Add(itemRU);

				ItemType itemType = ReadItemType(arrResult, i + nRackFieldCount + nEquipmentTypeFieldCount + nItemFieldCount + nItemRUFieldCount, out strErrorMessage);

				if (itemType == null)
					return null;
				else
					arrDatas.Add(itemType);

				Company company = ReadCompany(arrResult, i + nRackFieldCount + nEquipmentTypeFieldCount + nItemFieldCount + nItemRUFieldCount + nItemTypeFieldCount, out strErrorMessage);

				if (company == null)
					return null;
				else
					arrDatas.Add(company);
			}

			return arrDatas;
		}

		public ArrayList JoinRackRackType(int dataCenterID, string strAdditionalConditions, out string strErrorMessage)
        {
			string strRackTableName = Rack.TableName;
			string strRackTypeTableName = RackType.TableName;

			int nRackFieldCount, nRackTypeFieldCount;

			string strRackFields = GetFieldNames<Rack.Fields>(strRackTableName, out nRackFieldCount);
			string strRackTypeFields = GetFieldNames<RackType.Fields>(strRackTypeTableName, out nRackTypeFieldCount);

			bool isNullable;
			int nFieldsCount = nRackFieldCount + nRackTypeFieldCount;

			string strSQL = "";

			if (dataCenterID > 0)
			{
				strSQL = string.Format("Select {0}, {1} from {2}, {3} where {2}.{4} = {3}.{5} and {2}.{6} = {7}",
					strRackFields, strRackTypeFields,
					strRackTableName, strRackTypeTableName,
					Rack.GetFieldName(Rack.Fields.RackTypeID, out isNullable),
					RackType.GetFieldName(RackType.Fields.ID, out isNullable),
					Rack.GetFieldName(Rack.Fields.CenterID, out isNullable),
					dataCenterID);
			}
			else
            {
				strSQL = string.Format("Select {0}, {1} from {2}, {3} where {2}.{4} = {3}.{5}",
					strRackFields, strRackTypeFields,
					strRackTableName, strRackTypeTableName,
					Rack.GetFieldName(Rack.Fields.RackTypeID, out isNullable),
					RackType.GetFieldName(RackType.Fields.ID, out isNullable));
			}

			if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
			{
				strSQL += " and " + strAdditionalConditions;
			}

			strErrorMessage = null;

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);
			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			ArrayList arrDatas = new ArrayList();
			int nResultCount = arrResult.Count;

			for (int i = 0; i < nResultCount - (nFieldsCount - 1); i += nFieldsCount)
			{
				Rack rack = ReadRack(arrResult, i, out strErrorMessage);

				if (rack == null)
					return null;
				else
					arrDatas.Add(rack);

				RackType rackType = ReadRackType(arrResult, i + nRackFieldCount, out strErrorMessage);

				if (rackType == null)
					return null;
				else
					arrDatas.Add(rackType);
			}

			return arrDatas;
		}

		public ArrayList JoinRackRackGroupRackType(int dataCenterID, string strAdditionalConditions, out string strErrorMessage)
        {
			string strRackTableName = Rack.TableName;
			string strRackGroupTableName = RackGroup.TableName;
			string strRackTypeTableName = RackType.TableName;

			int nRackFieldCount, nRackGroupFieldCount, nRackTypeFieldCount;

			string strRackFields = GetFieldNames<Rack.Fields>(strRackTableName, out nRackFieldCount);
			string strGroupFields = GetFieldNames<RackGroup.Fields>(strRackGroupTableName, out nRackGroupFieldCount);
			string strRackTypeFields = GetFieldNames<RackType.Fields>(strRackTypeTableName, out nRackTypeFieldCount);

			bool isNullable;
			int nFieldsCount = nRackFieldCount + nRackGroupFieldCount + nRackTypeFieldCount;

			string strSQL = string.Format("Select {0}, {1}, {2} from {3}, {4}, {5} where {3}.{6} = {4}.{7} and {3}.{8} = {5}.{9} and {3}.{10} = {11}",
				strRackFields, strGroupFields, strRackTypeFields,
				strRackTableName, strRackGroupTableName, strRackTypeTableName,
				Rack.GetFieldName(Rack.Fields.RackGroupID, out isNullable),
				RackGroup.GetFieldName(RackGroup.Fields.ID, out isNullable),
				Rack.GetFieldName(Rack.Fields.RackTypeID, out isNullable),
				RackType.GetFieldName(RackType.Fields.ID, out isNullable),
				Rack.GetFieldName(Rack.Fields.CenterID, out isNullable),
				dataCenterID);

			if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
			{
				strSQL += " and " + strAdditionalConditions;
			}

			strErrorMessage = null;

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);
			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			ArrayList arrDatas = new ArrayList();
			int nResultCount = arrResult.Count;

			for (int i = 0; i < nResultCount - (nFieldsCount - 1); i += nFieldsCount)
			{
				Rack rack = ReadRack(arrResult, i, out strErrorMessage);

				if (rack == null)
					return null;
				else
					arrDatas.Add(rack);

				RackGroup rackGroup = ReadRackGroup(arrResult, i + nRackFieldCount, out strErrorMessage);

				if (rackGroup == null)
					return null;
				else
					arrDatas.Add(rackGroup);

				RackType rackType = ReadRackType(arrResult, i + nRackFieldCount + nRackGroupFieldCount, out strErrorMessage);

				if (rackType == null)
					return null;
				else
					arrDatas.Add(rackType);
			}

			return arrDatas;
		}

		public ArrayList JoinItemItemRU(string strCondition, out string strErrorMessage)
		{
			string strItemTableName = Item.TableName;
			string strItemRUTableName = Item_RU.TableName;

			int nItemFieldCount, nItemRUFieldCount;

			string strItemFields = GetFieldNames<Item.Fields>(strItemTableName, out nItemFieldCount);
			string strItemRUFields = GetFieldNames<Item_RU.Fields>(strItemRUTableName, out nItemRUFieldCount);

			bool isNullable;
			int nFieldsCount = nItemFieldCount + nItemRUFieldCount;

			string strSQL = string.Format("Select {0}, {1} from {2}, {3} where {2}.{4} = {3}.{5}",
				strItemFields, strItemRUFields,
				strItemTableName, strItemRUTableName,
				Item.GetFieldName(Item.Fields.ID, out isNullable),
				Item_RU.GetFieldName(Item_RU.Fields.ItemID, out isNullable));

			if (strCondition != null && strCondition.Length > 0)
			{
				strSQL += " and " + strCondition;
			}

			strErrorMessage = null;

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);
			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			ArrayList arrDatas = new ArrayList();
			int nResultCount = arrResult.Count;

			for (int i = 0; i < nResultCount - (nFieldsCount - 1); i += nFieldsCount)
			{
				Item item = ReadItem(arrResult, i, out strErrorMessage);

				if (item == null)
					return null;
				else
					arrDatas.Add(item);

				Item_RU itemRU = ReadItem_RU(arrResult, i + nItemFieldCount, out strErrorMessage);

				if (itemRU == null)
					return null;
				else
					arrDatas.Add(itemRU);
			}

			return arrDatas;
		}

		public ArrayList JoinItemItemRUItemType(int dataCenterID, string strAdditionalConditions, out string strErrorMessage)
        {
			string strItemTableName = Item.TableName;
			string strItemTypeTableName = ItemType.TableName;
			string strItemRUTableName = Item_RU.TableName;

			int nItemFieldCount, nItemTypeFieldCount, nItemRUFieldCount;

			string strItemFields = GetFieldNames<Item.Fields>(strItemTableName, out nItemFieldCount);
			string strItemTypeFields = GetFieldNames<ItemType.Fields>(strItemTypeTableName, out nItemTypeFieldCount);
			string strItemRUFields = GetFieldNames<Item_RU.Fields>(strItemRUTableName, out nItemRUFieldCount);

			bool isNullable;
			int nFieldsCount = nItemFieldCount + nItemTypeFieldCount + nItemRUFieldCount;

			string strSQL = "";
			string strOrderBy = string.Format(" order by {0}, {1} desc", Item_RU.GetFieldName(Item_RU.Fields.RackID, out isNullable), Item_RU.GetFieldName(Item_RU.Fields.UPos, out isNullable));

			if (dataCenterID > 0)
			{
				strSQL = string.Format("Select {0}, {1}, {2} from {3}, {4}, {5} where {3}.{6} = {5}.{7} and {3}.{8} = {9} and {3}.{10} = {4}.{11}",
					strItemFields, strItemRUFields, strItemTypeFields,
					strItemTableName, strItemRUTableName, strItemTypeTableName,
					Item.GetFieldName(Item.Fields.ItemTypeID, out isNullable),
					ItemType.GetFieldName(ItemType.Fields.ID, out isNullable),
					Item.GetFieldName(Item.Fields.CenterID, out isNullable),
					dataCenterID,
					Item.GetFieldName(Item.Fields.ID, out isNullable),
					Item_RU.GetFieldName(Item_RU.Fields.ItemID, out isNullable));
			}
			else
            {
				strSQL = string.Format("Select {0}, {1}, {2} from {3}, {4}, {5} where {3}.{6} = {5}.{7} and {3}.{8} = {4}.{9}",
					strItemFields, strItemRUFields, strItemTypeFields,
					strItemTableName, strItemRUTableName, strItemTypeTableName,
					Item.GetFieldName(Item.Fields.ItemTypeID, out isNullable),
					ItemType.GetFieldName(ItemType.Fields.ID, out isNullable),
					Item.GetFieldName(Item.Fields.ID, out isNullable),
					Item_RU.GetFieldName(Item_RU.Fields.ItemID, out isNullable));
			}

			if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
			{
				strSQL += " and " + strAdditionalConditions + strOrderBy;
			}
			else
				strSQL += strOrderBy;

			strErrorMessage = null;

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);
			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			ArrayList arrDatas = new ArrayList();
			int nResultCount = arrResult.Count;

			for (int i = 0; i < nResultCount - (nFieldsCount - 1); i += nFieldsCount)
			{
				Item item = ReadItem(arrResult, i, out strErrorMessage);

				if (item == null)
					return null;
				else
					arrDatas.Add(item);

				Item_RU itemRU = ReadItem_RU(arrResult, i + nItemFieldCount, out strErrorMessage);

				if (itemRU == null)
					return null;
				else
					arrDatas.Add(itemRU);

				ItemType itemType = ReadItemType(arrResult, i + nItemFieldCount + nItemRUFieldCount, out strErrorMessage);

				if (itemType == null)
					return null;
				else
					arrDatas.Add(itemType);
			}

			return arrDatas;
		}

		public ArrayList JoinItemItemTypeEquipmentTypeCompany(int dataCenterID, string strAdditionalConditions, out string strErrorMessage)
        {
			string strItemTableName = Item.TableName;
			string strItemTypeTableName = ItemType.TableName;
			string strEquipmentTypeTableName = EquipmentType.TableName;
			string strCompanyTableName = Company.TableName;

			int nItemFieldCount, nItemTypeFieldCount, nEquipmentTypeFieldCount, nCompanyFieldCount;

			string strItemFields = GetFieldNames<Item.Fields>(strItemTableName, out nItemFieldCount);
			string strItemTypeFields = GetFieldNames<ItemType.Fields>(strItemTypeTableName, out nItemTypeFieldCount);
			string strEquipmentTypeFields = GetFieldNames<EquipmentType.Fields>(strEquipmentTypeTableName, out nEquipmentTypeFieldCount);
			string strCompanyTypeFields = GetFieldNames<Company.Fields>(strCompanyTableName, out nCompanyFieldCount);

			bool isNullable;
			int nFieldsCount = nItemFieldCount + nItemTypeFieldCount + nEquipmentTypeFieldCount + nCompanyFieldCount;

			string strSQL = string.Format("Select {0}, {1}, {2}, {3} from {4}, {5}, {6}, {7} where {4}.{8} = {9} and {4}.{10} = {5}.{11} and {5}.{12} = {6}.{13} and {5}.{14} = {7}.{15}",
				strItemFields, strItemTypeFields, strEquipmentTypeFields, strCompanyTypeFields,
				strItemTableName, strItemTypeTableName, strEquipmentTypeTableName, strCompanyTableName,
				Item.GetFieldName(Item.Fields.CenterID, out isNullable),
				dataCenterID,
				Item.GetFieldName(Item.Fields.ItemTypeID, out isNullable),
				ItemType.GetFieldName(ItemType.Fields.ID, out isNullable),
				ItemType.GetFieldName(ItemType.Fields.EquipmentType, out isNullable),
				EquipmentType.GetFieldName(EquipmentType.Fields.ID, out isNullable),
				ItemType.GetFieldName(ItemType.Fields.CompanyID, out isNullable),
				Company.GetFieldName(Company.Fields.ID, out isNullable));

			if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
			{
				strSQL += " and " + strAdditionalConditions;
			}

			strErrorMessage = null;

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);
			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			ArrayList arrDatas = new ArrayList();
			int nResultCount = arrResult.Count;

			for (int i = 0; i < nResultCount - (nFieldsCount - 1); i += nFieldsCount)
			{
				Item item = ReadItem(arrResult, i, out strErrorMessage);

				if (item == null)
					return null;
				else
					arrDatas.Add(item);

				ItemType itemType = ReadItemType(arrResult, i + nItemFieldCount, out strErrorMessage);

				if (itemType == null)
					return null;
				else
					arrDatas.Add(itemType);

				EquipmentType equipmentType = ReadEquipmentType(arrResult, i + nItemFieldCount + nItemTypeFieldCount, out strErrorMessage);

				if (equipmentType == null)
					return null;
				else
					arrDatas.Add(equipmentType);

				Company company = ReadCompany(arrResult, i + nItemFieldCount + nItemTypeFieldCount + nEquipmentTypeFieldCount, out strErrorMessage);

				if (company == null)
					return null;
				else
					arrDatas.Add(company);
			}

			return arrDatas;
		}

		public ArrayList JoinUserUserDatas(Dictionary<User.Fields, object> dicCondition1, Dictionary<UserData.Fields, object> dicCondition2, string strAdditionalConditions, out string strErrorMessage)
        {
			strErrorMessage = null;

			string strUserTableName = User.TableName;
			string strUserDataTableName = UserData.TableName;

			int nUserFieldCount, nUserDataFieldCount;

			string strUserFields = GetFieldNames<User.Fields>(strUserTableName, out nUserFieldCount);
			string strUserDataFields = GetFieldNames<UserData.Fields>(strUserDataTableName, out nUserDataFieldCount);

			bool isNullable;
			int nFieldsCount = nUserFieldCount + nUserDataFieldCount;

			string strSQL = string.Format("Select {0}, {1} from {2}, {3} where {2}.{4} = {3}.{5}",
				strUserFields, strUserDataFields,
				strUserTableName, strUserDataTableName,
				User.GetFieldName(User.Fields.ID, out isNullable),
				UserData.GetFieldName(UserData.Fields.UserID, out isNullable));

			string strCondition = "";

			if (dicCondition1 != null)
            {
				if (SetCondition<User.Fields>(ref strCondition, dicCondition1, User.GetFieldName, strUserTableName, ref strErrorMessage) == false)
					return null;
            }

			if (dicCondition2 != null)
            {
				if (SetCondition<UserData.Fields>(ref strCondition, dicCondition2, UserData.GetFieldName, strUserDataTableName, ref strErrorMessage) == false)
					return null;
			}

			if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
			{
				if (strCondition.Length > 0)
					strCondition += " and " + strAdditionalConditions;
				else
					strCondition = strAdditionalConditions;
			}

			if (strCondition.Length > 0)
			{
				if (strCondition.ToLower().Trim().StartsWith("order by"))
					strSQL += " " + strCondition;
				else
					strSQL += " and " + strCondition;
			}

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			ArrayList arrDatas = new ArrayList();
			int nResultCount = arrResult.Count;

			for (int i = 0; i < nResultCount - (nFieldsCount - 1); i += nFieldsCount)
			{
				User user = ReadUser(arrResult, i, out strErrorMessage);

				if (user == null)
					return null;
				else
					arrDatas.Add(user);

				UserData userData = ReadAccountUserData(arrResult, i + nUserFieldCount, out strErrorMessage);

				if (userData == null)
					return null;
				else
					arrDatas.Add(userData);
			}

			return arrDatas;
		}

		public ArrayList JoinDataCenterUserDataCenterLink(Dictionary<Model.DataCenter.DataCenter.Fields, object> dicCondition1, Dictionary<UserDataCenterLink.Fields, object> dicCondition2, string strAdditionalConditions, out string strErrorMessage)
        {
			strErrorMessage = null;

			string strDataCenterTableName = Model.DataCenter.DataCenter.TableName;
			string strUserDataCenterLinkTableName = UserDataCenterLink.TableName;

			int nDataCenterFieldCount, nUserDataCenterLinkFieldCount;

			string strDataCenterFields = GetFieldNames<Model.DataCenter.DataCenter.Fields>(strDataCenterTableName, out nDataCenterFieldCount);
			string strUserDataCenterLinkFields = GetFieldNames<UserDataCenterLink.Fields>(strUserDataCenterLinkTableName, out nUserDataCenterLinkFieldCount);

			bool isNullable;
			int nFieldsCount = nDataCenterFieldCount + nUserDataCenterLinkFieldCount;

			string strSQL = string.Format("Select {0}, {1} from {2}, {3} where {2}.{4} = {3}.{5}",
				strDataCenterFields, strUserDataCenterLinkFields,
				strDataCenterTableName, strUserDataCenterLinkTableName,
				Model.DataCenter.DataCenter.GetFieldName(Model.DataCenter.DataCenter.Fields.ID, out isNullable),
				UserDataCenterLink.GetFieldName(UserDataCenterLink.Fields.DataCenterID, out isNullable));

			string strCondition = "";

			if (dicCondition1 != null)
			{
				if (SetCondition<Model.DataCenter.DataCenter.Fields>(ref strCondition, dicCondition1, Model.DataCenter.DataCenter.GetFieldName, strDataCenterTableName, ref strErrorMessage) == false)
					return null;
			}

			if (dicCondition2 != null)
			{
				if (SetCondition<UserDataCenterLink.Fields>(ref strCondition, dicCondition2, UserDataCenterLink.GetFieldName, strUserDataCenterLinkTableName, ref strErrorMessage) == false)
					return null;
			}

			if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
			{
				if (strCondition.Length > 0)
					strCondition += " and " + strAdditionalConditions;
				else
					strCondition = strAdditionalConditions;
			}

			if (strCondition.Length > 0)
			{
				if (strCondition.ToLower().Trim().StartsWith("order by"))
					strSQL += " " + strCondition;
				else
					strSQL += " and " + strCondition;
			}

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			ArrayList arrDatas = new ArrayList();
			int nResultCount = arrResult.Count;

			for (int i = 0; i < nResultCount - (nFieldsCount - 1); i += nFieldsCount)
			{
				Model.DataCenter.DataCenter dataCenter = ReadDataCenter(arrResult, i, out strErrorMessage);

				if (dataCenter == null)
					return null;
				else
					arrDatas.Add(dataCenter);

				UserDataCenterLink link = ReadAccountUserDataCenterLink(arrResult, i + nDataCenterFieldCount, out strErrorMessage);

				if (link == null)
					return null;
				else
					arrDatas.Add(link);
			}

			return arrDatas;
		}

		public ArrayList JoinUserDataCenterDataCenterData(Dictionary<User.Fields, object> dicCondition1, Dictionary<Model.DataCenter.DataCenter.Fields, object> dicCondition2, Dictionary<Model.DataCenter.Data.Fields, object> dicCondition3, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;

			string strUserTableName = User.TableName;
			string strUserDataCenterLinkTableName = UserDataCenterLink.TableName;
			string strDataCenterTableName = Model.DataCenter.DataCenter.TableName;
			string strDataCenterDataTableName = Model.DataCenter.Data.TableName;

			int nUserFieldCount, nDataCenterFieldCount, nDataCenterDataFieldCount;

			string strUserFields = GetFieldNames<User.Fields>(strUserTableName, out nUserFieldCount);
			string strDataCenterFields = GetFieldNames<Model.DataCenter.DataCenter.Fields>(strDataCenterTableName, out nDataCenterFieldCount);
			string strDataCenterDataFields = GetFieldNames<Model.DataCenter.Data.Fields>(strDataCenterDataTableName, out nDataCenterDataFieldCount);

			bool isNullable;
			int nFieldsCount = nDataCenterFieldCount + nUserFieldCount + nDataCenterDataFieldCount;

			string strSQL = string.Format("Select {0}, {1}, {2} from {3}, {4}, {5}, {6} where {3}.{7} = {4}.{8} and {5}.{9} = {4}.{10} and {5}.{9} = {6}.{11}",
				strUserFields, strDataCenterFields, strDataCenterDataFields,
				strUserTableName, strUserDataCenterLinkTableName, strDataCenterTableName, strDataCenterDataTableName,
				User.GetFieldName(User.Fields.ID, out isNullable),
				UserDataCenterLink.GetFieldName(UserDataCenterLink.Fields.UserID, out isNullable),
				Model.DataCenter.DataCenter.GetFieldName(Model.DataCenter.DataCenter.Fields.ID, out isNullable),
				UserDataCenterLink.GetFieldName(UserDataCenterLink.Fields.DataCenterID, out isNullable),
				Model.DataCenter.Data.GetFieldName(Model.DataCenter.Data.Fields.CenterID, out isNullable));

			string strCondition = "";

			if (dicCondition1 != null)
			{
				if (SetCondition<User.Fields>(ref strCondition, dicCondition1, User.GetFieldName, strUserTableName, ref strErrorMessage) == false)
					return null;
			}

			if (dicCondition2 != null)
			{
				if (SetCondition<Model.DataCenter.DataCenter.Fields>(ref strCondition, dicCondition2, Model.DataCenter.DataCenter.GetFieldName, strDataCenterTableName, ref strErrorMessage) == false)
					return null;
			}

			if (dicCondition3 != null)
			{
				if (SetCondition<Model.DataCenter.Data.Fields>(ref strCondition, dicCondition3, Model.DataCenter.Data.GetFieldName, strDataCenterDataTableName, ref strErrorMessage) == false)
					return null;
			}

			if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
			{
				if (strCondition.Length > 0)
					strCondition += " and " + strAdditionalConditions;
				else
					strCondition = strAdditionalConditions;
			}

			if (strCondition.Length > 0)
			{
				if (strCondition.ToLower().Trim().StartsWith("order by"))
					strSQL += " " + strCondition;
				else
					strSQL += " and " + strCondition;
			}

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			ArrayList arrDatas = new ArrayList();
			int nResultCount = arrResult.Count;

			for (int i = 0; i < nResultCount - (nFieldsCount - 1); i += nFieldsCount)
			{
				User user = ReadUser(arrResult, i, out strErrorMessage);

				if (user == null)
					return null;
				else
					arrDatas.Add(user);

				Model.DataCenter.DataCenter dataCenter = ReadDataCenter(arrResult, i + nUserFieldCount, out strErrorMessage);

				if (dataCenter == null)
					return null;
				else
					arrDatas.Add(dataCenter);

				Model.DataCenter.Data dataCenterData = ReadDataCenterData(arrResult, i + nUserFieldCount + nDataCenterFieldCount, out strErrorMessage);

				if (dataCenterData == null)
					return null;
				else
					arrDatas.Add(dataCenterData);
			}

			return arrDatas;
		}

		public ArrayList JoinDataCenterDataCenterData(Dictionary<Model.DataCenter.DataCenter.Fields, object> dicCondition1, Dictionary<Model.DataCenter.Data.Fields, object> dicCondition2, string strAdditionalConditions, out string strErrorMessage)
        {
			strErrorMessage = null;

			string strDataCenterTableName = Model.DataCenter.DataCenter.TableName;
			string strDataCenterDataTableName = Model.DataCenter.Data.TableName;

			int nDataCenterFieldCount, nDataCenterDataFieldCount;

			string strDataCenterFields = GetFieldNames<Model.DataCenter.DataCenter.Fields>(strDataCenterTableName, out nDataCenterFieldCount);
			string strDataCenterDataFields = GetFieldNames<Model.DataCenter.Data.Fields>(strDataCenterDataTableName, out nDataCenterDataFieldCount);

			bool isNullable;
			int nFieldsCount = nDataCenterFieldCount + nDataCenterDataFieldCount;

			string strSQL = string.Format("Select {0}, {1} from {2}, {3} where {2}.{4} = {3}.{5}",
				strDataCenterFields, strDataCenterDataFields,
				strDataCenterTableName, strDataCenterDataTableName,
				Model.DataCenter.DataCenter.GetFieldName(Model.DataCenter.DataCenter.Fields.ID, out isNullable),
				Model.DataCenter.Data.GetFieldName(Model.DataCenter.Data.Fields.CenterID, out isNullable));

			string strCondition = "";

			if (dicCondition1 != null)
			{
				if (SetCondition<Model.DataCenter.DataCenter.Fields>(ref strCondition, dicCondition1, Model.DataCenter.DataCenter.GetFieldName, strDataCenterTableName, ref strErrorMessage) == false)
					return null;
			}

			if (dicCondition2 != null)
			{
				if (SetCondition<Model.DataCenter.Data.Fields>(ref strCondition, dicCondition2, Model.DataCenter.Data.GetFieldName, strDataCenterDataTableName, ref strErrorMessage) == false)
					return null;
			}

			if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
			{
				if (strCondition.Length > 0)
					strCondition += " and " + strAdditionalConditions;
				else
					strCondition = strAdditionalConditions;
			}

			if (strCondition.Length > 0)
			{
				if (strCondition.ToLower().Trim().StartsWith("order by"))
					strSQL += " " + strCondition;
				else
					strSQL += " and " + strCondition;
			}

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			ArrayList arrDatas = new ArrayList();
			int nResultCount = arrResult.Count;

			for (int i = 0; i < nResultCount - (nFieldsCount - 1); i += nFieldsCount)
			{
				Model.DataCenter.DataCenter dataCenter = ReadDataCenter(arrResult, i, out strErrorMessage);

				if (dataCenter == null)
					return null;
				else
					arrDatas.Add(dataCenter);

				Model.DataCenter.Data dataCenterData = ReadDataCenterData(arrResult, i + nDataCenterFieldCount, out strErrorMessage);

				if (dataCenterData == null)
					return null;
				else
					arrDatas.Add(dataCenterData);
			}

			return arrDatas;
		}

		public ArrayList JoinSiteSiteData(Dictionary<Model.Site.Site.Fields, object> dicCondition1, Dictionary<Model.Site.Data.Fields, object> dicCondition2, string strAdditionalConditions, out string strErrorMessage)
        {
			strErrorMessage = null;

			string strSiteTableName = Model.Site.Site.TableName;
			string strSiteDataTableName = Model.Site.Data.TableName;

			int nSiteFieldCount, nSiteDataFieldCount;

			string strSiteFields = GetFieldNames<Model.Site.Site.Fields>(strSiteTableName, out nSiteFieldCount);
			string strSiteDataFields = GetFieldNames<Model.Site.Data.Fields>(strSiteDataTableName, out nSiteDataFieldCount);

			bool isNullable;
			int nFieldsCount = nSiteFieldCount + nSiteDataFieldCount;

			string strSQL = string.Format("Select {0}, {1} from {2}, {3} where {2}.{4} = {3}.{5}",
				strSiteFields, strSiteDataFields,
				strSiteTableName, strSiteDataTableName,
				Model.Site.Site.GetFieldName(Model.Site.Site.Fields.ID, out isNullable),
				Model.Site.Data.GetFieldName(Model.Site.Data.Fields.SiteID, out isNullable));

			string strCondition = "";

			if (dicCondition1 != null)
			{
				if (SetCondition<Model.Site.Site.Fields>(ref strCondition, dicCondition1, Model.Site.Site.GetFieldName, strSiteTableName, ref strErrorMessage) == false)
					return null;
			}

			if (dicCondition2 != null)
			{
				if (SetCondition<Model.Site.Data.Fields>(ref strCondition, dicCondition2, Model.Site.Data.GetFieldName, strSiteDataTableName, ref strErrorMessage) == false)
					return null;
			}

			if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
			{
				if (strCondition.Length > 0)
					strCondition += " and " + strAdditionalConditions;
				else
					strCondition = strAdditionalConditions;
			}

			if (strCondition.Length > 0)
			{
				if (strCondition.ToLower().Trim().StartsWith("order by"))
					strSQL += " " + strCondition;
				else
					strSQL += " and " + strCondition;
			}

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			ArrayList arrDatas = new ArrayList();
			int nResultCount = arrResult.Count;

			for (int i = 0; i < nResultCount - (nFieldsCount - 1); i += nFieldsCount)
			{
				Model.Site.Site site = ReadSite(arrResult, i, out strErrorMessage);

				if (site == null)
					return null;
				else
					arrDatas.Add(site);

				Model.Site.Data siteData = ReadSiteData(arrResult, i + nSiteFieldCount, out strErrorMessage);

				if (siteData == null)
					return null;
				else
					arrDatas.Add(siteData);
			}

			return arrDatas;
		}
	}
}
