using System;
using System.Collections;
using System.Collections.Generic;
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

		public Level CreateAccountLevel(Level obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<Level.Fields, object> dicFieldDatas = new Dictionary<Level.Fields, object>();
			dicFieldDatas[Level.Fields.LevelName] = obj.LevelName;
			dicFieldDatas[Level.Fields.LevelEngName] = obj.LevelEngName;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ID) FROM {0} C), 0) + 1, {2})",
				Level.TableName,
				GetFieldNames<Level.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", Level.GetFieldName(Level.Fields.ID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<Level> datas = m_dataManager.GetSelectManager().SelectAccountLevels(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameAccountLevel(obj, datas[0]))
					return datas[0];

				return GetAccountLevel(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameAccountLevel(Level oldObject, Level newObject)
		{
			if (oldObject.LevelName == newObject.LevelName &&
				oldObject.LevelEngName == newObject.LevelEngName)
				return true;

			return false;
		}

		private Level GetAccountLevel(Level obj, int id, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", Level.GetFieldName(Level.Fields.ID, out isNullable), id);

			List<Level> datas = m_dataManager.GetSelectManager().SelectAccountLevels(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (Level data in datas)
			{
				if (IsSameAccountLevel(data, obj))
					return data;

				if (data.ID < id)
					id = data.ID;
			}

			if (nCount < nLimit)
				return GetAccountLevel(obj, id, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(Level.TableName);
			return null;
		}

		public Option CreateAccountOption(Option obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<Option.Fields, object> dicFieldDatas = new Dictionary<Option.Fields, object>();
			dicFieldDatas[Option.Fields.UserID] = obj.UserID;
			dicFieldDatas[Option.Fields.Category] = obj.Category;
			dicFieldDatas[Option.Fields.SubCategory] = obj.SubCategory;
			dicFieldDatas[Option.Fields.PropertyValue1] = obj.PropertyValue1;
			dicFieldDatas[Option.Fields.PropertyValue2] = obj.PropertyValue2;
			dicFieldDatas[Option.Fields.PropertyValue3] = obj.PropertyValue3;
			dicFieldDatas[Option.Fields.PropertyValue4] = obj.PropertyValue4;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ID) FROM {0} C), 0) + 1, {2})",
				Option.TableName,
				GetFieldNames<Option.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", Option.GetFieldName(Option.Fields.ID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<Option> datas = m_dataManager.GetSelectManager().SelectAccountOptions(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameOption(obj, datas[0]))
					return datas[0];

				return GetOption(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameOption(Option oldObject, Option newObject)
		{
			if (oldObject.UserID == newObject.UserID &&
				oldObject.Category == newObject.Category &&
				oldObject.SubCategory == newObject.SubCategory &&
				oldObject.PropertyValue1 == newObject.PropertyValue1 &&
				oldObject.PropertyValue2 == newObject.PropertyValue2 &&
				oldObject.PropertyValue3 == newObject.PropertyValue3 &&
				oldObject.PropertyValue4 == newObject.PropertyValue4)
				return true;

			return false;
		}

		private Option GetOption(Option obj, int id, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", Option.GetFieldName(Option.Fields.ID, out isNullable), id);

			List<Option> datas = m_dataManager.GetSelectManager().SelectAccountOptions(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (Option data in datas)
			{
				if (IsSameOption(data, obj))
					return data;

				if (data.ID < id)
					id = data.ID;
			}

			if (nCount < nLimit)
				return GetOption(obj, id, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(Option.TableName);
			return null;
		}

		public Session CreateAccountSession(Session obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<Session.Fields, object> dicFieldDatas = new Dictionary<Session.Fields, object>();
			dicFieldDatas[Session.Fields.AccountUserID] = obj.AccountUserID;
			dicFieldDatas[Session.Fields.SessionKey] = obj.SessionKey;
			dicFieldDatas[Session.Fields.CreateDate] = obj.CreateDate;
			dicFieldDatas[Session.Fields.UpdateDate] = obj.UpdateDate;
			dicFieldDatas[Session.Fields.IsAutoLogin] = obj.IsAutoLogin;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ID) FROM {0} C), 0) + 1, {2})",
				Session.TableName,
				GetFieldNames<Session.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", Session.GetFieldName(Session.Fields.ID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<Session> datas = m_dataManager.GetSelectManager().SelectAccountSessions(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameSession(obj, datas[0]))
					return datas[0];

				return GetSession(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameSession(Session oldObject, Session newObject)
		{
			if (oldObject.AccountUserID == newObject.AccountUserID &&
				oldObject.SessionKey == newObject.SessionKey &&
				IsSameTime2(oldObject.CreateDate, newObject.CreateDate) &&
				IsSameTime2(oldObject.UpdateDate, newObject.UpdateDate) &&
				oldObject.IsAutoLogin == newObject.IsAutoLogin)
				return true;

			return false;
		}

		private Session GetSession(Session obj, int id, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", Session.GetFieldName(Session.Fields.ID, out isNullable), id);

			List<Session> datas = m_dataManager.GetSelectManager().SelectAccountSessions(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (Session data in datas)
			{
				if (IsSameSession(data, obj))
					return data;

				if (data.ID < id)
					id = data.ID;
			}

			if (nCount < nLimit)
				return GetSession(obj, id, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(Session.TableName);
			return null;
		}

		public User CreateAccountUser(User obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<User.Fields, object> dicFieldDatas = new Dictionary<User.Fields, object>();
			dicFieldDatas[User.Fields.UserLevel] = obj.UserLevel;
			dicFieldDatas[User.Fields.Password] = obj.Password;
			dicFieldDatas[User.Fields.UserID] = obj.UserID;
			dicFieldDatas[User.Fields.NickName] = obj.NickName;
			dicFieldDatas[User.Fields.PasswordCode] = obj.PasswordCode;
			dicFieldDatas[User.Fields.Salt] = obj.Salt;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ID) FROM {0} C), 0) + 1, {2})",
				User.TableName,
				GetFieldNames<User.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", User.GetFieldName(User.Fields.ID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<User> datas = m_dataManager.GetSelectManager().SelectAccountUsers(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameUser(obj, datas[0]))
					return datas[0];

				return GetUser(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameUser(User oldObject, User newObject)
		{
			if (oldObject.UserLevel == newObject.UserLevel &&
				oldObject.Password == newObject.Password &&
				oldObject.UserID == newObject.UserID &&
				oldObject.NickName == newObject.NickName &&
				oldObject.PasswordCode == newObject.PasswordCode &&
				oldObject.Salt == newObject.Salt)
				return true;

			return false;
		}

		private User GetUser(User obj, int id, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", User.GetFieldName(User.Fields.ID, out isNullable), id);

			List<User> datas = m_dataManager.GetSelectManager().SelectAccountUsers(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (User data in datas)
			{
				if (IsSameUser(data, obj))
					return data;

				if (data.ID < id)
					id = data.ID;
			}

			if (nCount < nLimit)
				return GetUser(obj, id, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(User.TableName);
			return null;
		}

		public UserData CreateAccountUserData(UserData obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<UserData.Fields, object> dicFieldDatas = new Dictionary<UserData.Fields, object>();
			dicFieldDatas[UserData.Fields.UserID] = obj.UserID;
			dicFieldDatas[UserData.Fields.CompanyName] = obj.CompanyName;
			dicFieldDatas[UserData.Fields.RegDate] = obj.RegDate;
			dicFieldDatas[UserData.Fields.Activate] = obj.Activate;
			dicFieldDatas[UserData.Fields.Memo] = obj.Memo;
			dicFieldDatas[UserData.Fields.SiteID] = obj.SiteID;

			string strSQL = string.Format("Insert into {0} ({1}) values ({2})",
				UserData.TableName,
				GetFieldNames<UserData.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				UserData data = new UserData();
				data.UserID = obj.UserID;
				data.CompanyName = obj.CompanyName;
				data.Activate = obj.Activate;
				data.Memo = obj.Memo;
				data.SiteID = obj.SiteID;

				return data;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public UserDataCenterLink CreateAccountUserDataCenterLink(UserDataCenterLink obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<UserDataCenterLink.Fields, object> dicFieldDatas = new Dictionary<UserDataCenterLink.Fields, object>();
			dicFieldDatas[UserDataCenterLink.Fields.UserID] = obj.UserID;
			dicFieldDatas[UserDataCenterLink.Fields.DataCenterID] = obj.DataCenterID;

			string strSQL = string.Format("Insert into {0} ({1}) values ({2})",
				UserDataCenterLink.TableName,
				GetFieldNames<UserDataCenterLink.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc, {1} desc",
					UserDataCenterLink.GetFieldName(UserDataCenterLink.Fields.UserID, out isNullable),
					UserDataCenterLink.GetFieldName(UserDataCenterLink.Fields.DataCenterID, out isNullable));

				UserDataCenterLink data = new UserDataCenterLink();
				data.UserID = obj.UserID;
				data.DataCenterID = obj.DataCenterID;

				return data;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public Company CreateCompany(Company obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<Company.Fields, object> dicFieldDatas = new Dictionary<Company.Fields, object>();
			dicFieldDatas[Company.Fields.Name] = obj.Name;
			dicFieldDatas[Company.Fields.EngName] = obj.EngName;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ID) FROM {0} C), 0) + 1, {2})",
				Company.TableName,
				GetFieldNames<Company.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", Company.GetFieldName(Company.Fields.ID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<Company> datas = m_dataManager.GetSelectManager().SelectCompanies(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameCompany(obj, datas[0]))
					return datas[0];

				return GetCompany(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameCompany(Company oldObject, Company newObject)
		{
			if (oldObject.Name == newObject.Name &&
				oldObject.EngName == newObject.EngName)
				return true;

			return false;
		}

		private Company GetCompany(Company obj, int id, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", Company.GetFieldName(Company.Fields.ID, out isNullable), id);

			List<Company> datas = m_dataManager.GetSelectManager().SelectCompanies(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (Company data in datas)
			{
				if (IsSameCompany(data, obj))
					return data;

				if (data.ID < id)
					id = data.ID;
			}

			if (nCount < nLimit)
				return GetCompany(obj, id, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(Company.TableName);
			return null;
		}

		public Model.DataCenter.DataCenter CreateDataCenter(Model.DataCenter.DataCenter obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<Model.DataCenter.DataCenter.Fields, object> dicFieldDatas = new Dictionary<Model.DataCenter.DataCenter.Fields, object>();
			dicFieldDatas[Model.DataCenter.DataCenter.Fields.Name] = obj.Name;
			dicFieldDatas[Model.DataCenter.DataCenter.Fields.EngName] = obj.EngName;
			dicFieldDatas[Model.DataCenter.DataCenter.Fields.SiteID] = obj.SiteID;
			dicFieldDatas[Model.DataCenter.DataCenter.Fields.NationID] = obj.NationID;
			dicFieldDatas[Model.DataCenter.DataCenter.Fields.Address] = obj.Address;
			dicFieldDatas[Model.DataCenter.DataCenter.Fields.RegDate] = obj.RegDate;
			dicFieldDatas[Model.DataCenter.DataCenter.Fields.Width] = obj.Width;
			dicFieldDatas[Model.DataCenter.DataCenter.Fields.Length] = obj.Length;
			dicFieldDatas[Model.DataCenter.DataCenter.Fields.Height] = obj.Height;
			dicFieldDatas[Model.DataCenter.DataCenter.Fields.TileWidth] = obj.TileWidth;
			dicFieldDatas[Model.DataCenter.DataCenter.Fields.TileLength] = obj.TileLength;
			dicFieldDatas[Model.DataCenter.DataCenter.Fields.TileElevation] = obj.TileElevation;
			dicFieldDatas[Model.DataCenter.DataCenter.Fields.UnitOfLength] = obj.UnitOfLength;
			dicFieldDatas[Model.DataCenter.DataCenter.Fields.Type] = obj.Type;
			dicFieldDatas[Model.DataCenter.DataCenter.Fields.Latitude] = obj.Latitude;
			dicFieldDatas[Model.DataCenter.DataCenter.Fields.Longitude] = obj.Longitude;
			dicFieldDatas[Model.DataCenter.DataCenter.Fields.CreationType] = obj.CreationType;
			dicFieldDatas[Model.DataCenter.DataCenter.Fields.Memo] = obj.Memo;
			dicFieldDatas[Model.DataCenter.DataCenter.Fields.BeginGridX] = obj.BeginGridX;
			dicFieldDatas[Model.DataCenter.DataCenter.Fields.BeginGridY] = obj.BeginGridY;
			dicFieldDatas[Model.DataCenter.DataCenter.Fields.UTC] = obj.UTC;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ID) FROM {0} C), 0) + 1, {2})",
				Model.DataCenter.DataCenter.TableName,
				GetFieldNames<Model.DataCenter.DataCenter.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", Model.DataCenter.DataCenter.GetFieldName(Model.DataCenter.DataCenter.Fields.ID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<Model.DataCenter.DataCenter> datas = m_dataManager.GetSelectManager().SelectDataCenters(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameDataCenter(obj, datas[0]))
					return datas[0];

				return GetDataCenter(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameDataCenter(Model.DataCenter.DataCenter oldObject, Model.DataCenter.DataCenter newObject)
		{
			if (oldObject.Name == newObject.Name &&
				oldObject.EngName == newObject.EngName &&
				oldObject.SiteID == newObject.SiteID &&
				oldObject.NationID == newObject.NationID &&
				oldObject.Address == newObject.Address &&
				IsSameTime2(oldObject.RegDate, newObject.RegDate) &&
				oldObject.Width == newObject.Width &&
				oldObject.Length == newObject.Length &&
				oldObject.Height == newObject.Height &&
				oldObject.TileWidth == newObject.TileWidth &&
				oldObject.TileLength == newObject.TileLength &&
				oldObject.TileElevation == newObject.TileElevation &&
				oldObject.UnitOfLength == newObject.UnitOfLength &&
				oldObject.Type == newObject.Type &&
				oldObject.Latitude == newObject.Latitude &&
				oldObject.Longitude == newObject.Longitude &&
				oldObject.CreationType == newObject.CreationType &&
				oldObject.Memo == newObject.Memo &&
				oldObject.BeginGridX == newObject.BeginGridX &&
				oldObject.BeginGridY == newObject.BeginGridY &&
				oldObject.UTC == newObject.UTC)
				return true;

			return false;
		}

		private Model.DataCenter.DataCenter GetDataCenter(Model.DataCenter.DataCenter obj, int id, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", Model.DataCenter.DataCenter.GetFieldName(Model.DataCenter.DataCenter.Fields.ID, out isNullable), id);

			List<Model.DataCenter.DataCenter> datas = m_dataManager.GetSelectManager().SelectDataCenters(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (Model.DataCenter.DataCenter data in datas)
			{
				if (IsSameDataCenter(data, obj))
					return data;

				if (data.ID < id)
					id = data.ID;
			}

			if (nCount < nLimit)
				return GetDataCenter(obj, id, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(Model.DataCenter.DataCenter.TableName);
			return null;
		}

		public Model.DataCenter.Viewport CreateDataCenterViewport(Model.DataCenter.Viewport obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<Model.DataCenter.Viewport.Fields, object> dicFieldDatas = new Dictionary<Model.DataCenter.Viewport.Fields, object>();
			dicFieldDatas[Model.DataCenter.Viewport.Fields.DataCenterID] = obj.DataCenterID;
			dicFieldDatas[Model.DataCenter.Viewport.Fields.PositionX] = obj.PositionX;
			dicFieldDatas[Model.DataCenter.Viewport.Fields.PositionY] = obj.PositionY;
			dicFieldDatas[Model.DataCenter.Viewport.Fields.PositionZ] = obj.PositionZ;
			dicFieldDatas[Model.DataCenter.Viewport.Fields.RotationX] = obj.RotationX;
			dicFieldDatas[Model.DataCenter.Viewport.Fields.RotationY] = obj.RotationY;
			dicFieldDatas[Model.DataCenter.Viewport.Fields.RotationZ] = obj.RotationZ;

			string strSQL = string.Format("Insert into {0} ({1}) values ({2})",
				Model.DataCenter.Viewport.TableName,
				GetFieldNames<Model.DataCenter.Viewport.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				Model.DataCenter.Viewport viewport = m_dataManager.GetSelectManager().SelectDataCenterViewport(obj.DataCenterID, out strErrorMessage);
				
				if (viewport == null)
					return null;
				
				return viewport;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public Model.DataCenter.Data CreateDataCenterData(Model.DataCenter.Data obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<Model.DataCenter.Data.Fields, object> dicFieldDatas = new Dictionary<Model.DataCenter.Data.Fields, object>();
			dicFieldDatas[Model.DataCenter.Data.Fields.CenterID] = obj.CenterID;
			dicFieldDatas[Model.DataCenter.Data.Fields.IsClone] = obj.IsClone;
			dicFieldDatas[Model.DataCenter.Data.Fields.ParentID] = obj.ParentID;
			dicFieldDatas[Model.DataCenter.Data.Fields.ManagerTeam] = obj.ManagerTeam;
			dicFieldDatas[Model.DataCenter.Data.Fields.Manager] = obj.Manager;
			dicFieldDatas[Model.DataCenter.Data.Fields.Company] = obj.Company;

			string strSQL = string.Format("Insert into {0} ({1}) values ({2})",
				Model.DataCenter.Data.TableName,
				GetFieldNames<Model.DataCenter.Data.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				Model.DataCenter.Data centerData = new Model.DataCenter.Data();
				centerData.CenterID = obj.CenterID;
				centerData.IsClone = obj.IsClone;
				centerData.ParentID = obj.ParentID;
				centerData.ManagerTeam = obj.ManagerTeam;
				centerData.Manager = obj.Manager;
				centerData.Company = obj.Company;
				return centerData;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public Model.DataCenter.Option CreateDataCenterOption(Model.DataCenter.Option obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<Model.DataCenter.Option.Fields, object> dicFieldDatas = new Dictionary<Model.DataCenter.Option.Fields, object>();
			dicFieldDatas[Model.DataCenter.Option.Fields.PropertyName] = obj.PropertyName;
			dicFieldDatas[Model.DataCenter.Option.Fields.PropertyValue] = obj.PropertyValue;
			dicFieldDatas[Model.DataCenter.Option.Fields.Description] = obj.Description;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(PropertyName) FROM {0} C), 0) + 1, {2})",
				Model.DataCenter.Option.TableName,
				GetFieldNames<Model.DataCenter.Option.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				Model.DataCenter.Option option = new Model.DataCenter.Option();
				option.PropertyName = obj.PropertyName;
				option.PropertyValue = obj.PropertyValue;
				option.Description = obj.Description;
				return option;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public EquipmentCategory CreateEquipmentCategory(EquipmentCategory obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<EquipmentCategory.Fields, object> dicFieldDatas = new Dictionary<EquipmentCategory.Fields, object>();
			dicFieldDatas[EquipmentCategory.Fields.Name] = obj.Name;
			dicFieldDatas[EquipmentCategory.Fields.EngName] = obj.EngName;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ID) FROM {0} C), 0) + 1, {2})",
				EquipmentCategory.TableName,
				GetFieldNames<EquipmentCategory.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", EquipmentCategory.GetFieldName(EquipmentCategory.Fields.ID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<EquipmentCategory> datas = m_dataManager.GetSelectManager().SelectEquipmentCategories(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameEquipmentCategory(obj, datas[0]))
					return datas[0];

				return GetEquipmentCategory(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameEquipmentCategory(EquipmentCategory oldObject, EquipmentCategory newObject)
		{
			if (oldObject.Name == newObject.Name &&
				oldObject.EngName == newObject.EngName)
				return true;

			return false;
		}

		private EquipmentCategory GetEquipmentCategory(EquipmentCategory obj, int id, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", EquipmentCategory.GetFieldName(EquipmentCategory.Fields.ID, out isNullable), id);

			List<EquipmentCategory> datas = m_dataManager.GetSelectManager().SelectEquipmentCategories(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (EquipmentCategory data in datas)
			{
				if (IsSameEquipmentCategory(data, obj))
					return data;

				if (data.ID < id)
					id = data.ID;
			}

			if (nCount < nLimit)
				return GetEquipmentCategory(obj, id, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(EquipmentCategory.TableName);
			return null;
		}

		public EquipmentType CreateEquipmentType(EquipmentType obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<EquipmentType.Fields, object> dicFieldDatas = new Dictionary<EquipmentType.Fields, object>();
			dicFieldDatas[EquipmentType.Fields.Name] = obj.Name;
			dicFieldDatas[EquipmentType.Fields.EngName] = obj.EngName;
			dicFieldDatas[EquipmentType.Fields.CategoryID] = obj.CategoryID;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ID) FROM {0} C), 0) + 1, {2})",
				EquipmentType.TableName,
				GetFieldNames<EquipmentType.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", EquipmentType.GetFieldName(EquipmentType.Fields.ID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<EquipmentType> datas = m_dataManager.GetSelectManager().SelectEquipmentTypes(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameEquipmentType(obj, datas[0]))
					return datas[0];

				return GetEquipmentType(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameEquipmentType(EquipmentType oldObject, EquipmentType newObject)
		{
			if (oldObject.Name == newObject.Name &&
				oldObject.EngName == newObject.EngName &&
				oldObject.CategoryID == newObject.CategoryID)
				return true;

			return false;
		}

		private EquipmentType GetEquipmentType(EquipmentType obj, int id, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", EquipmentType.GetFieldName(EquipmentType.Fields.ID, out isNullable), id);

			List<EquipmentType> datas = m_dataManager.GetSelectManager().SelectEquipmentTypes(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (EquipmentType data in datas)
			{
				if (IsSameEquipmentType(data, obj))
					return data;

				if (data.ID < id)
					id = data.ID;
			}

			if (nCount < nLimit)
				return GetEquipmentType(obj, id, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(EquipmentType.TableName);
			return null;
		}

		public Item CreateItem(Item obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<Item.Fields, object> dicFieldDatas = new Dictionary<Item.Fields, object>();
			dicFieldDatas[Item.Fields.Name] = obj.Name;
			dicFieldDatas[Item.Fields.CenterID] = obj.CenterID;
			dicFieldDatas[Item.Fields.ItemTypeID] = obj.ItemTypeID;
			dicFieldDatas[Item.Fields.Cpu] = obj.Cpu;
			dicFieldDatas[Item.Fields.Ram] = obj.Ram;
			dicFieldDatas[Item.Fields.DiskInfo] = obj.DiskInfo;
			dicFieldDatas[Item.Fields.DiskVolume] = obj.DiskVolume;
			dicFieldDatas[Item.Fields.RegDate] = obj.RegDate;
			dicFieldDatas[Item.Fields.ChangeDate] = obj.ChangeDate;
			dicFieldDatas[Item.Fields.Usage] = obj.Usage;
			dicFieldDatas[Item.Fields.PositionInShelf] = obj.PositionInShelf;
			dicFieldDatas[Item.Fields.Status] = obj.Status;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ID) FROM {0} C), 0) + 1, {2})",
				Item.TableName,
				GetFieldNames<Item.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", Item.GetFieldName(Item.Fields.ID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<Item> datas = m_dataManager.GetSelectManager().SelectItems(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameItem(obj, datas[0]))
					return datas[0];

				return GetItem(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameItem(Item oldObject, Item newObject)
		{
			if (IsSameString(oldObject.Name, newObject.Name) &&
				oldObject.CenterID == newObject.CenterID &&
				oldObject.ItemTypeID == newObject.ItemTypeID &&
				IsSameString(oldObject.Cpu, newObject.Cpu) &&
				IsSameString(oldObject.Ram, newObject.Ram) &&
				IsSameString(oldObject.DiskInfo, newObject.DiskInfo) &&
				IsSameString(oldObject.DiskVolume, newObject.DiskVolume) &&
				IsSameTime(oldObject.RegDate, newObject.RegDate) &&
				IsSameTime(oldObject.ChangeDate, newObject.ChangeDate) &&
				IsSameString(oldObject.Usage, newObject.Usage) &&
				oldObject.PositionInShelf == newObject.PositionInShelf &&
				oldObject.Status == newObject.Status)
				return true;

			return false;
		}

		private Item GetItem(Item obj, int id, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", Item.GetFieldName(Item.Fields.ID, out isNullable), id);

			List<Item> datas = m_dataManager.GetSelectManager().SelectItems(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (Item data in datas)
			{
				if (IsSameItem(data, obj))
					return data;

				if (data.ID < id)
					id = data.ID;
			}

			if (nCount < nLimit)
				return GetItem(obj, id, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(Item.TableName);
			return null;
		}

		public Item_RU CreateItem_RU(Item_RU obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<Item_RU.Fields, object> dicFieldDatas = new Dictionary<Item_RU.Fields, object>();
			dicFieldDatas[Item_RU.Fields.ItemID] = obj.ItemID;
			dicFieldDatas[Item_RU.Fields.RackID] = obj.RackID;
			dicFieldDatas[Item_RU.Fields.UPos] = obj.UPos;

			string strSQL = string.Format("Insert into {0} ({1}) values ({2})",
				Item_RU.TableName,
				GetFieldNames<Item_RU.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", Item_RU.GetFieldName(Item_RU.Fields.ItemID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<Item_RU> datas = m_dataManager.GetSelectManager().SelectItem_RUs(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameItem_RU(obj, datas[0]))
					return datas[0];

				return GetItem_RU(obj, datas[0].ItemID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameItem_RU(Item_RU oldObject, Item_RU newObject)
		{
			if (oldObject.ItemID == newObject.ItemID)
				return true;

			return false;
		}

		private Item_RU GetItem_RU(Item_RU obj, int itemID, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", Item_RU.GetFieldName(Item_RU.Fields.ItemID, out isNullable), itemID);

			List<Item_RU> datas = m_dataManager.GetSelectManager().SelectItem_RUs(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (Item_RU data in datas)
			{
				if (IsSameItem_RU(data, obj))
					return data;

				if (data.ItemID < itemID)
					itemID = data.ItemID;
			}

			if (nCount < nLimit)
				return GetItem_RU(obj, itemID, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(Item_RU.TableName);
			return null;
		}

		public LinkedItem CreateLinkedItem(LinkedItem obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<LinkedItem.Fields, object> dicFieldDatas = new Dictionary<LinkedItem.Fields, object>();

			dicFieldDatas[LinkedItem.Fields.CenterID] = obj.CenterID;
			dicFieldDatas[LinkedItem.Fields.ItemID] = obj.ItemID;
			dicFieldDatas[LinkedItem.Fields.LinkedItemID] = obj.LinkedItemID;

			string strSQL = string.Format("Insert into {0} ({1}) values ({2})",
				LinkedItem.TableName,
				GetFieldNames<LinkedItem.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				Dictionary<LinkedItem.Fields, object> dicConditions = new Dictionary<LinkedItem.Fields, object>();
				dicConditions[LinkedItem.Fields.CenterID] = obj.CenterID;
				dicConditions[LinkedItem.Fields.ItemID] = obj.ItemID;
				dicConditions[LinkedItem.Fields.LinkedItemID] = obj.LinkedItemID;

				bool isNullable;
				string strCondition = string.Format("order by {0} desc, {1} desc, {2} desc",
					LinkedItem.GetFieldName(LinkedItem.Fields.ItemID, out isNullable),
					LinkedItem.GetFieldName(LinkedItem.Fields.LinkedItemID, out isNullable),
					LinkedItem.GetFieldName(LinkedItem.Fields.CenterID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<LinkedItem> datas = m_dataManager.GetSelectManager().SelectLinkedItems(dicConditions, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameLinkedItem(obj, datas[0]))
					return datas[0];

				return GetLinkedItem(obj, datas[0].ItemID, datas[0].LinkedItemID, datas[0].CenterID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameLinkedItem(LinkedItem oldObject, LinkedItem newObject)
		{
			if (oldObject.ItemID == newObject.ItemID &&
				oldObject.LinkedItemID == newObject.LinkedItemID &&
				oldObject.CenterID == newObject.CenterID)
				return true;

			return false;
		}

		private LinkedItem GetLinkedItem(LinkedItem obj, int itemID, int linkedItemID, int centerID, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} = {1} and {2} = {3} and {4} < {5} order by {0} desc, {2} desc, {4} desc",
				LinkedItem.GetFieldName(LinkedItem.Fields.ItemID, out isNullable), itemID,
				LinkedItem.GetFieldName(LinkedItem.Fields.LinkedItemID, out isNullable), linkedItemID,
				LinkedItem.GetFieldName(LinkedItem.Fields.CenterID, out isNullable), centerID);
			List<LinkedItem> datas = m_dataManager.GetSelectManager().SelectLinkedItems(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (LinkedItem data in datas)
			{
				if (IsSameLinkedItem(data, obj))
					return data;
			}

			if (nCount < nLimit)
				return GetLinkedItem(obj, itemID, linkedItemID, centerID, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(LinkedItem.TableName);
			return null;
		}

		public ItemType CreateItemType(ItemType obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<ItemType.Fields, object> dicFieldDatas = new Dictionary<ItemType.Fields, object>();
			dicFieldDatas[ItemType.Fields.EquipmentType] = obj.EquipmentType;
			dicFieldDatas[ItemType.Fields.CompanyID] = obj.CompanyID;
			dicFieldDatas[ItemType.Fields.ModelName] = obj.ModelName;
			dicFieldDatas[ItemType.Fields.Type] = obj.Type;
			dicFieldDatas[ItemType.Fields.Height] = obj.Height;
			dicFieldDatas[ItemType.Fields.Width] = obj.Width;
			dicFieldDatas[ItemType.Fields.Depth] = obj.Depth;
			dicFieldDatas[ItemType.Fields.Unit] = obj.Unit;
			dicFieldDatas[ItemType.Fields.Shelf] = obj.Shelf;
			dicFieldDatas[ItemType.Fields.ImageUrl] = obj.ImageUrl;
			dicFieldDatas[ItemType.Fields.BackImageUrl] = obj.BackImageUrl;
			dicFieldDatas[ItemType.Fields.GlbUrl] = obj.GlbUrl;
			dicFieldDatas[ItemType.Fields.FbxUrl] = obj.FbxUrl;
			dicFieldDatas[ItemType.Fields.ClassName] = obj.ClassName;
			dicFieldDatas[ItemType.Fields.Memo] = obj.Memo;
			dicFieldDatas[ItemType.Fields.RegDate] = obj.RegDate;
			dicFieldDatas[ItemType.Fields.ChangeDate] = obj.ChangeDate;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ID) FROM {0} C), 0) + 1, {2})",
				ItemType.TableName,
				GetFieldNames<ItemType.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", ItemType.GetFieldName(ItemType.Fields.ID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<ItemType> datas = m_dataManager.GetSelectManager().SelectItemTypes(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameItemType(obj, datas[0]))
					return datas[0];

				return GetItemType(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameItemType(ItemType oldObject, ItemType newObject)
		{
			if (oldObject.EquipmentType == newObject.EquipmentType &&
				oldObject.CompanyID == newObject.CompanyID &&
				oldObject.ModelName == newObject.ModelName &&
				oldObject.Type == newObject.Type &&
				oldObject.Height == newObject.Height &&
				oldObject.Width == newObject.Width &&
				oldObject.Depth == newObject.Depth &&
				oldObject.Unit == newObject.Unit &&
				oldObject.Shelf == newObject.Shelf &&
				oldObject.ImageUrl == newObject.ImageUrl &&
				oldObject.BackImageUrl == newObject.BackImageUrl &&
				oldObject.GlbUrl == newObject.GlbUrl &&
				oldObject.FbxUrl == newObject.FbxUrl &&
				oldObject.ClassName == newObject.ClassName &&
				oldObject.Memo == newObject.Memo)
				return true;

			return false;
		}

		private ItemType GetItemType(ItemType obj, int id, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", ItemType.GetFieldName(ItemType.Fields.ID, out isNullable), id);

			List<ItemType> datas = m_dataManager.GetSelectManager().SelectItemTypes(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (ItemType data in datas)
			{
				if (IsSameItemType(data, obj))
					return data;

				if (data.ID < id)
					id = data.ID;
			}

			if (nCount < nLimit)
				return GetItemType(obj, id, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(ItemType.TableName);
			return null;
		}

		public Backup CreateBackup(Backup obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<Backup.Fields, object> dicFieldDatas = new Dictionary<Backup.Fields, object>();
			dicFieldDatas[Backup.Fields.DataCenterID] = obj.DataCenterID;
			dicFieldDatas[Backup.Fields.BackupID] = obj.BackupID;
			dicFieldDatas[Backup.Fields.Basic_Name] = obj.Basic_Name;
			dicFieldDatas[Backup.Fields.Basic_Status] = obj.Basic_Status;
			dicFieldDatas[Backup.Fields.Basic_RegDate] = obj.Basic_RegDate;
			dicFieldDatas[Backup.Fields.Basic_Usage] = obj.Basic_Usage;
			dicFieldDatas[Backup.Fields.Basic_ReceiveDate] = obj.Basic_ReceiveDate;
			dicFieldDatas[Backup.Fields.Basic_ItemLevel] = obj.Basic_ItemLevel;
			dicFieldDatas[Backup.Fields.Basic_OwnerCompanyName] = obj.Basic_OwnerCompanyName;
			dicFieldDatas[Backup.Fields.Basic_OwnDepartment] = obj.Basic_OwnDepartment;
			dicFieldDatas[Backup.Fields.Basic_OperationDepartment] = obj.Basic_OperationDepartment;
			dicFieldDatas[Backup.Fields.Basic_OverUsedYear] = obj.Basic_OverUsedYear;
			dicFieldDatas[Backup.Fields.Basic_Memo] = obj.Basic_Memo;
			dicFieldDatas[Backup.Fields.Manage_SuperviseManager] = obj.Manage_SuperviseManager;
			dicFieldDatas[Backup.Fields.Manage_OperationManager] = obj.Manage_OperationManager;
			dicFieldDatas[Backup.Fields.Position_InstallRegion] = obj.Position_InstallRegion;
			dicFieldDatas[Backup.Fields.Position_RackDetailPosition] = obj.Position_RackDetailPosition;
			dicFieldDatas[Backup.Fields.Maintenance_ProvideCompanyName] = obj.Maintenance_ProvideCompanyName;
			dicFieldDatas[Backup.Fields.Maintenance_WarrantyMonth] = obj.Maintenance_WarrantyMonth;
			dicFieldDatas[Backup.Fields.Maintenance_WarrantyExpiredDate] = obj.Maintenance_WarrantyExpiredDate;
			dicFieldDatas[Backup.Fields.Maintenance_MaintenanceCompanyName] = obj.Maintenance_MaintenanceCompanyName;
			dicFieldDatas[Backup.Fields.Maintenance_EOSDate] = obj.Maintenance_EOSDate;
			dicFieldDatas[Backup.Fields.Maintenance_MaintenanceContract] = obj.Maintenance_MaintenanceContract;
			dicFieldDatas[Backup.Fields.Maintenance_MaintenanceBeginDate] = obj.Maintenance_MaintenanceBeginDate;
			dicFieldDatas[Backup.Fields.Maintenance_MaintenanceEndDate] = obj.Maintenance_MaintenanceEndDate;
			dicFieldDatas[Backup.Fields.HW_ModelName] = obj.HW_ModelName;
			dicFieldDatas[Backup.Fields.HW_Company] = obj.HW_Company;
			dicFieldDatas[Backup.Fields.HW_SerialNumber] = obj.HW_SerialNumber;
			dicFieldDatas[Backup.Fields.HW_DiskType] = obj.HW_DiskType;
			dicFieldDatas[Backup.Fields.HW_FirmwareVersion] = obj.HW_FirmwareVersion;
			dicFieldDatas[Backup.Fields.HW_Topology] = obj.HW_Topology;
			dicFieldDatas[Backup.Fields.HW_IP] = obj.HW_IP;
			dicFieldDatas[Backup.Fields.HW_RegDate] = obj.HW_RegDate;
			dicFieldDatas[Backup.Fields.HW_DiskDriveType] = obj.HW_DiskDriveType;
			dicFieldDatas[Backup.Fields.HW_DiskTypeVolumeGB] = obj.HW_DiskTypeVolumeGB;
			dicFieldDatas[Backup.Fields.HW_DiskCount] = obj.HW_DiskCount;
			dicFieldDatas[Backup.Fields.HW_PhysicalVolumeGB] = obj.HW_PhysicalVolumeGB;
			dicFieldDatas[Backup.Fields.HW_UsableVolumeGB] = obj.HW_UsableVolumeGB;
			dicFieldDatas[Backup.Fields.HW_RaidType] = obj.HW_RaidType;
			dicFieldDatas[Backup.Fields.HW_BuyDate] = obj.HW_BuyDate;
			dicFieldDatas[Backup.Fields.HW_TotalSlotCount] = obj.HW_TotalSlotCount;
			dicFieldDatas[Backup.Fields.HW_TapeMediaType] = obj.HW_TapeMediaType;
			dicFieldDatas[Backup.Fields.HW_TapeMediaCount] = obj.HW_TapeMediaCount;
			dicFieldDatas[Backup.Fields.Connect_NWEquip_1] = obj.Connect_NWEquip_1;
			dicFieldDatas[Backup.Fields.Connect_NWEquip_2] = obj.Connect_NWEquip_2;
			dicFieldDatas[Backup.Fields.Connect_NWEquip_3] = obj.Connect_NWEquip_3;
			dicFieldDatas[Backup.Fields.Connect_NWEquip_4] = obj.Connect_NWEquip_4;
			dicFieldDatas[Backup.Fields.Connect_SanSwitch_1] = obj.Connect_SanSwitch_1;
			dicFieldDatas[Backup.Fields.Connect_SanSwitch_2] = obj.Connect_SanSwitch_2;
			dicFieldDatas[Backup.Fields.Connect_SanSwitch_3] = obj.Connect_SanSwitch_3;
			dicFieldDatas[Backup.Fields.Connect_SanSwitch_4] = obj.Connect_SanSwitch_4;

			string strSQL = string.Format("Insert into {0} ({1}) values ({2})",
				Backup.TableName,
				GetFieldNames<Backup.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				Backup data = new Backup();
				data.DataCenterID = obj.DataCenterID;
				data.BackupID = obj.BackupID;
				data.Basic_Name = obj.Basic_Name;
				data.Basic_Status = obj.Basic_Status;
				data.Basic_RegDate = obj.Basic_RegDate;
				data.Basic_Usage = obj.Basic_Usage;
				data.Basic_ReceiveDate = obj.Basic_ReceiveDate;
				data.Basic_ItemLevel = obj.Basic_ItemLevel;
				data.Basic_OwnerCompanyName = obj.Basic_OwnerCompanyName;
				data.Basic_OwnDepartment = obj.Basic_OwnDepartment;
				data.Basic_OperationDepartment = obj.Basic_OperationDepartment;
				data.Basic_OverUsedYear = obj.Basic_OverUsedYear;
				data.Basic_Memo = obj.Basic_Memo;
				data.Manage_SuperviseManager = obj.Manage_SuperviseManager;
				data.Manage_OperationManager = obj.Manage_OperationManager;
				data.Position_InstallRegion = obj.Position_InstallRegion;
				data.Position_RackDetailPosition = obj.Position_RackDetailPosition;
				data.Maintenance_ProvideCompanyName = obj.Maintenance_ProvideCompanyName;
				data.Maintenance_WarrantyMonth = obj.Maintenance_WarrantyMonth;
				data.Maintenance_WarrantyExpiredDate = obj.Maintenance_WarrantyExpiredDate;
				data.Maintenance_MaintenanceCompanyName = obj.Maintenance_MaintenanceCompanyName;
				data.Maintenance_EOSDate = obj.Maintenance_EOSDate;
				data.Maintenance_MaintenanceContract = obj.Maintenance_MaintenanceContract;
				data.Maintenance_MaintenanceBeginDate = obj.Maintenance_MaintenanceBeginDate;
				data.Maintenance_MaintenanceEndDate = obj.Maintenance_MaintenanceEndDate;
				data.HW_ModelName = obj.HW_ModelName;
				data.HW_Company = obj.HW_Company;
				data.HW_SerialNumber = obj.HW_SerialNumber;
				data.HW_DiskType = obj.HW_DiskType;
				data.HW_FirmwareVersion = obj.HW_FirmwareVersion;
				data.HW_Topology = obj.HW_Topology;
				data.HW_IP = obj.HW_IP;
				data.HW_RegDate = obj.HW_RegDate;
				data.HW_DiskDriveType = obj.HW_DiskDriveType;
				data.HW_DiskTypeVolumeGB = obj.HW_DiskTypeVolumeGB;
				data.HW_DiskCount = obj.HW_DiskCount;
				data.HW_PhysicalVolumeGB = obj.HW_PhysicalVolumeGB;
				data.HW_UsableVolumeGB = obj.HW_UsableVolumeGB;
				data.HW_RaidType = obj.HW_RaidType;
				data.HW_BuyDate = obj.HW_BuyDate;
				data.HW_TotalSlotCount = obj.HW_TotalSlotCount;
				data.HW_TapeMediaType = obj.HW_TapeMediaType;
				data.HW_TapeMediaCount = obj.HW_TapeMediaCount;
				data.Connect_NWEquip_1 = obj.Connect_NWEquip_1;
				data.Connect_NWEquip_2 = obj.Connect_NWEquip_2;
				data.Connect_NWEquip_3 = obj.Connect_NWEquip_3;
				data.Connect_NWEquip_4 = obj.Connect_NWEquip_4;
				data.Connect_SanSwitch_1 = obj.Connect_SanSwitch_1;
				data.Connect_SanSwitch_2 = obj.Connect_SanSwitch_2;
				data.Connect_SanSwitch_3 = obj.Connect_SanSwitch_3;
				data.Connect_SanSwitch_4 = obj.Connect_SanSwitch_4;
				return data;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public Box CreateBox(Box obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<Box.Fields, object> dicFieldDatas = new Dictionary<Box.Fields, object>();
			dicFieldDatas[Box.Fields.DataCenterID] = obj.DataCenterID;
			dicFieldDatas[Box.Fields.BoxID] = obj.BoxID;
			dicFieldDatas[Box.Fields.Basic_Name] = obj.Basic_Name;
			dicFieldDatas[Box.Fields.Basic_Company] = obj.Basic_Company;
			dicFieldDatas[Box.Fields.Basic_ModelName] = obj.Basic_ModelName;
			dicFieldDatas[Box.Fields.Basic_Status] = obj.Basic_Status;
			dicFieldDatas[Box.Fields.Basic_Usage] = obj.Basic_Usage;
			dicFieldDatas[Box.Fields.Basic_RegDate] = obj.Basic_RegDate;
			dicFieldDatas[Box.Fields.Basic_ItemLevel] = obj.Basic_ItemLevel;
			dicFieldDatas[Box.Fields.Basic_EquipType] = obj.Basic_EquipType;
			dicFieldDatas[Box.Fields.Basic_SerialNumber] = obj.Basic_SerialNumber;
			dicFieldDatas[Box.Fields.Basic_PropertyType] = obj.Basic_PropertyType;
			dicFieldDatas[Box.Fields.Basic_ReceiveDate] = obj.Basic_ReceiveDate;
			dicFieldDatas[Box.Fields.Basic_OwnDepartment] = obj.Basic_OwnDepartment;
			dicFieldDatas[Box.Fields.Basic_PartitionAble] = obj.Basic_PartitionAble;
			dicFieldDatas[Box.Fields.Basic_PartitionName] = obj.Basic_PartitionName;
			dicFieldDatas[Box.Fields.Basic_ReceiveYears] = obj.Basic_ReceiveYears;
			dicFieldDatas[Box.Fields.Basic_OperationDepartment] = obj.Basic_OperationDepartment;
			dicFieldDatas[Box.Fields.Basic_DiscardDate] = obj.Basic_DiscardDate;
			dicFieldDatas[Box.Fields.Basic_OverUsedYear] = obj.Basic_OverUsedYear;
			dicFieldDatas[Box.Fields.Manage_SuperviseManager] = obj.Manage_SuperviseManager;
			dicFieldDatas[Box.Fields.Manage_OperationManager] = obj.Manage_OperationManager;
			dicFieldDatas[Box.Fields.Position_InstallRegion] = obj.Position_InstallRegion;
			dicFieldDatas[Box.Fields.Position_RackDetailPosition] = obj.Position_RackDetailPosition;
			dicFieldDatas[Box.Fields.Maintenance_WarrantyMonth] = obj.Maintenance_WarrantyMonth;
			dicFieldDatas[Box.Fields.Maintenance_WarrantyExpiredDate] = obj.Maintenance_WarrantyExpiredDate;
			dicFieldDatas[Box.Fields.Maintenance_EOLDate] = obj.Maintenance_EOLDate;
			dicFieldDatas[Box.Fields.Maintenance_EOSLDate] = obj.Maintenance_EOSLDate;
			dicFieldDatas[Box.Fields.Maintenance_EOSL] = obj.Maintenance_EOSL;
			dicFieldDatas[Box.Fields.Maintenance_MaintenanceContract] = obj.Maintenance_MaintenanceContract;
			dicFieldDatas[Box.Fields.Maintenance_MaintenanceCompanyName] = obj.Maintenance_MaintenanceCompanyName;
			dicFieldDatas[Box.Fields.Maintenance_MaintenanceBeginDate] = obj.Maintenance_MaintenanceBeginDate;
			dicFieldDatas[Box.Fields.Maintenance_MaintenanceEndDate] = obj.Maintenance_MaintenanceEndDate;
			dicFieldDatas[Box.Fields.Maintenance_ProvideCompanyName] = obj.Maintenance_ProvideCompanyName;
			dicFieldDatas[Box.Fields.HW_BoxPartitionType] = obj.HW_BoxPartitionType;
			dicFieldDatas[Box.Fields.HW_PowerDual] = obj.HW_PowerDual;
			dicFieldDatas[Box.Fields.HW_ConsoleUse] = obj.HW_ConsoleUse;
			dicFieldDatas[Box.Fields.CPU_ModelName] = obj.CPU_ModelName;
			dicFieldDatas[Box.Fields.CPU_ClockSpeed] = obj.CPU_ClockSpeed;
			dicFieldDatas[Box.Fields.CPU_SocketCount] = obj.CPU_SocketCount;
			dicFieldDatas[Box.Fields.CPU_CoreCountPerCPU] = obj.CPU_CoreCountPerCPU;
			dicFieldDatas[Box.Fields.CPU_TotalSlotCount] = obj.CPU_TotalSlotCount;
			dicFieldDatas[Box.Fields.CPU_UseSlotCount] = obj.CPU_UseSlotCount;
			dicFieldDatas[Box.Fields.CPU_HTUse] = obj.CPU_HTUse;
			dicFieldDatas[Box.Fields.CPU_TotalCoreCount] = obj.CPU_TotalCoreCount;
			dicFieldDatas[Box.Fields.Mem_TotalSlotCount] = obj.Mem_TotalSlotCount;
			dicFieldDatas[Box.Fields.Mem_EA_1GB] = obj.Mem_EA_1GB;
			dicFieldDatas[Box.Fields.Mem_EA_2GB] = obj.Mem_EA_2GB;
			dicFieldDatas[Box.Fields.Mem_EA_4GB] = obj.Mem_EA_4GB;
			dicFieldDatas[Box.Fields.Mem_EA_8GB] = obj.Mem_EA_8GB;
			dicFieldDatas[Box.Fields.Mem_EA_16GB] = obj.Mem_EA_16GB;
			dicFieldDatas[Box.Fields.Mem_EA_32GB] = obj.Mem_EA_32GB;
			dicFieldDatas[Box.Fields.Mem_EA_64GB] = obj.Mem_EA_64GB;
			dicFieldDatas[Box.Fields.Mem_EA_128GB] = obj.Mem_EA_128GB;
			dicFieldDatas[Box.Fields.Mem_EA_256GB] = obj.Mem_EA_256GB;
			dicFieldDatas[Box.Fields.Mem_UseSlotCount] = obj.Mem_UseSlotCount;
			dicFieldDatas[Box.Fields.Mem_MemoryCount] = obj.Mem_MemoryCount;
			dicFieldDatas[Box.Fields.Mem_TotalMemoryVolume] = obj.Mem_TotalMemoryVolume;
			dicFieldDatas[Box.Fields.Internal_InternalDiskVolumeGB] = obj.Internal_InternalDiskVolumeGB;
			dicFieldDatas[Box.Fields.Internal_InternalDiskCount] = obj.Internal_InternalDiskCount;
			dicFieldDatas[Box.Fields.Internal_InternalDiskUsableVolumeGB] = obj.Internal_InternalDiskUsableVolumeGB;
			dicFieldDatas[Box.Fields.Internal_InternalDiskTotalSlotCount] = obj.Internal_InternalDiskTotalSlotCount;
			dicFieldDatas[Box.Fields.Internal_InternalDiskUseSlot] = obj.Internal_InternalDiskUseSlot;
			dicFieldDatas[Box.Fields.Internal_InternalDiskRaidType] = obj.Internal_InternalDiskRaidType;
			dicFieldDatas[Box.Fields.Internal_InternalDiskSizeGB] = obj.Internal_InternalDiskSizeGB;
			dicFieldDatas[Box.Fields.External_ExternalDiskCompanyName] = obj.External_ExternalDiskCompanyName;
			dicFieldDatas[Box.Fields.External_ExternalDiskModel] = obj.External_ExternalDiskModel;
			dicFieldDatas[Box.Fields.External_ExternalDiskRaidType] = obj.External_ExternalDiskRaidType;
			dicFieldDatas[Box.Fields.External_ExternalDiskSizeGB] = obj.External_ExternalDiskSizeGB;
			dicFieldDatas[Box.Fields.External_ExternalDiskMultiPathSolution] = obj.External_ExternalDiskMultiPathSolution;
			dicFieldDatas[Box.Fields.PS_PowerSupplyCount] = obj.PS_PowerSupplyCount;
			dicFieldDatas[Box.Fields.PS_PowerSupplyVolumeW] = obj.PS_PowerSupplyVolumeW;
			dicFieldDatas[Box.Fields.PS_PowerSupplyPduDual] = obj.PS_PowerSupplyPduDual;
			dicFieldDatas[Box.Fields.PS_PowerSupplyRackPowerDual] = obj.PS_PowerSupplyRackPowerDual;
			dicFieldDatas[Box.Fields.Fan_FanCount] = obj.Fan_FanCount;
			dicFieldDatas[Box.Fields.Fan_FanDual] = obj.Fan_FanDual;
			dicFieldDatas[Box.Fields.Nic_NicSpeed] = obj.Nic_NicSpeed;
			dicFieldDatas[Box.Fields.Nic_NicType] = obj.Nic_NicType;
			dicFieldDatas[Box.Fields.Nic_NicPort] = obj.Nic_NicPort;
			dicFieldDatas[Box.Fields.Nic_NicCount] = obj.Nic_NicCount;
			dicFieldDatas[Box.Fields.Nic_NicUsePortCount] = obj.Nic_NicUsePortCount;
			dicFieldDatas[Box.Fields.Nic_OnboardNicPortCount] = obj.Nic_OnboardNicPortCount;
			dicFieldDatas[Box.Fields.Nic_OnboardNicUsePortCount] = obj.Nic_OnboardNicUsePortCount;
			dicFieldDatas[Box.Fields.Nic_HBASpeed] = obj.Nic_HBASpeed;
			dicFieldDatas[Box.Fields.Nic_HBAType] = obj.Nic_HBAType;
			dicFieldDatas[Box.Fields.Nic_HBAPort] = obj.Nic_HBAPort;
			dicFieldDatas[Box.Fields.Nic_HBACount] = obj.Nic_HBACount;
			dicFieldDatas[Box.Fields.Nic_UsingHBAPortCount] = obj.Nic_UsingHBAPortCount;
			dicFieldDatas[Box.Fields.NW_ManageIPAddr] = obj.NW_ManageIPAddr;
			dicFieldDatas[Box.Fields.NW_IPAddr2] = obj.NW_IPAddr2;
			dicFieldDatas[Box.Fields.NW_IPAddr3] = obj.NW_IPAddr3;
			dicFieldDatas[Box.Fields.NW_IPAddr4] = obj.NW_IPAddr4;
			dicFieldDatas[Box.Fields.Connect_SanSwitch1] = obj.Connect_SanSwitch1;
			dicFieldDatas[Box.Fields.Connect_SanSwitch2] = obj.Connect_SanSwitch2;
			dicFieldDatas[Box.Fields.Connect_SanSwitch3] = obj.Connect_SanSwitch3;
			dicFieldDatas[Box.Fields.Connect_NWEquip1] = obj.Connect_NWEquip1;
			dicFieldDatas[Box.Fields.Connect_NWEquip2] = obj.Connect_NWEquip2;
			dicFieldDatas[Box.Fields.Connect_NWEquip3] = obj.Connect_NWEquip3;
			dicFieldDatas[Box.Fields.Connect_NWEquip4] = obj.Connect_NWEquip4;
			dicFieldDatas[Box.Fields.Connect_NWEquip5] = obj.Connect_NWEquip5;
			dicFieldDatas[Box.Fields.Connect_NWEquip6] = obj.Connect_NWEquip6;
			dicFieldDatas[Box.Fields.Connect_NWEquip7] = obj.Connect_NWEquip7;
			dicFieldDatas[Box.Fields.Connect_NWEquip8] = obj.Connect_NWEquip8;
			dicFieldDatas[Box.Fields.Connect_Storage1] = obj.Connect_Storage1;
			dicFieldDatas[Box.Fields.Connect_Storage2] = obj.Connect_Storage2;
			dicFieldDatas[Box.Fields.Connect_Backup1] = obj.Connect_Backup1;
			dicFieldDatas[Box.Fields.Connect_Backup2] = obj.Connect_Backup2;
			dicFieldDatas[Box.Fields.Connect_Backup3] = obj.Connect_Backup3;
			dicFieldDatas[Box.Fields.Connect_Backup4] = obj.Connect_Backup4;

			string strSQL = string.Format("Insert into {0} ({1}) values ({2})",
				Box.TableName,
				GetFieldNames<Box.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				Box data = new Box();
				data.DataCenterID = obj.DataCenterID;
				data.BoxID = obj.BoxID;
				data.Basic_Name = obj.Basic_Name;
				data.Basic_Company = obj.Basic_Company;
				data.Basic_ModelName = obj.Basic_ModelName;
				data.Basic_Status = obj.Basic_Status;
				data.Basic_Usage = obj.Basic_Usage;
				data.Basic_RegDate = obj.Basic_RegDate;
				data.Basic_ItemLevel = obj.Basic_ItemLevel;
				data.Basic_EquipType = obj.Basic_EquipType;
				data.Basic_SerialNumber = obj.Basic_SerialNumber;
				data.Basic_PropertyType = obj.Basic_PropertyType;
				data.Basic_ReceiveDate = obj.Basic_ReceiveDate;
				data.Basic_OwnDepartment = obj.Basic_OwnDepartment;
				data.Basic_PartitionAble = obj.Basic_PartitionAble;
				data.Basic_PartitionName = obj.Basic_PartitionName;
				data.Basic_ReceiveYears = obj.Basic_ReceiveYears;
				data.Basic_OperationDepartment = obj.Basic_OperationDepartment;
				data.Basic_DiscardDate = obj.Basic_DiscardDate;
				data.Basic_OverUsedYear = obj.Basic_OverUsedYear;
				data.Manage_SuperviseManager = obj.Manage_SuperviseManager;
				data.Manage_OperationManager = obj.Manage_OperationManager;
				data.Position_InstallRegion = obj.Position_InstallRegion;
				data.Position_RackDetailPosition = obj.Position_RackDetailPosition;
				data.Maintenance_WarrantyMonth = obj.Maintenance_WarrantyMonth;
				data.Maintenance_WarrantyExpiredDate = obj.Maintenance_WarrantyExpiredDate;
				data.Maintenance_EOLDate = obj.Maintenance_EOLDate;
				data.Maintenance_EOSLDate = obj.Maintenance_EOSLDate;
				data.Maintenance_EOSL = obj.Maintenance_EOSL;
				data.Maintenance_MaintenanceContract = obj.Maintenance_MaintenanceContract;
				data.Maintenance_MaintenanceCompanyName = obj.Maintenance_MaintenanceCompanyName;
				data.Maintenance_MaintenanceBeginDate = obj.Maintenance_MaintenanceBeginDate;
				data.Maintenance_MaintenanceEndDate = obj.Maintenance_MaintenanceEndDate;
				data.Maintenance_ProvideCompanyName = obj.Maintenance_ProvideCompanyName;
				data.HW_BoxPartitionType = obj.HW_BoxPartitionType;
				data.HW_PowerDual = obj.HW_PowerDual;
				data.HW_ConsoleUse = obj.HW_ConsoleUse;
				data.CPU_ModelName = obj.CPU_ModelName;
				data.CPU_ClockSpeed = obj.CPU_ClockSpeed;
				data.CPU_SocketCount = obj.CPU_SocketCount;
				data.CPU_CoreCountPerCPU = obj.CPU_CoreCountPerCPU;
				data.CPU_TotalSlotCount = obj.CPU_TotalSlotCount;
				data.CPU_UseSlotCount = obj.CPU_UseSlotCount;
				data.CPU_HTUse = obj.CPU_HTUse;
				data.CPU_TotalCoreCount = obj.CPU_TotalCoreCount;
				data.Mem_TotalSlotCount = obj.Mem_TotalSlotCount;
				data.Mem_EA_1GB = obj.Mem_EA_1GB;
				data.Mem_EA_2GB = obj.Mem_EA_2GB;
				data.Mem_EA_4GB = obj.Mem_EA_4GB;
				data.Mem_EA_8GB = obj.Mem_EA_8GB;
				data.Mem_EA_16GB = obj.Mem_EA_16GB;
				data.Mem_EA_32GB = obj.Mem_EA_32GB;
				data.Mem_EA_64GB = obj.Mem_EA_64GB;
				data.Mem_EA_128GB = obj.Mem_EA_128GB;
				data.Mem_EA_256GB = obj.Mem_EA_256GB;
				data.Mem_UseSlotCount = obj.Mem_UseSlotCount;
				data.Mem_MemoryCount = obj.Mem_MemoryCount;
				data.Mem_TotalMemoryVolume = obj.Mem_TotalMemoryVolume;
				data.Internal_InternalDiskVolumeGB = obj.Internal_InternalDiskVolumeGB;
				data.Internal_InternalDiskCount = obj.Internal_InternalDiskCount;
				data.Internal_InternalDiskUsableVolumeGB = obj.Internal_InternalDiskUsableVolumeGB;
				data.Internal_InternalDiskTotalSlotCount = obj.Internal_InternalDiskTotalSlotCount;
				data.Internal_InternalDiskUseSlot = obj.Internal_InternalDiskUseSlot;
				data.Internal_InternalDiskRaidType = obj.Internal_InternalDiskRaidType;
				data.Internal_InternalDiskSizeGB = obj.Internal_InternalDiskSizeGB;
				data.External_ExternalDiskCompanyName = obj.External_ExternalDiskCompanyName;
				data.External_ExternalDiskModel = obj.External_ExternalDiskModel;
				data.External_ExternalDiskRaidType = obj.External_ExternalDiskRaidType;
				data.External_ExternalDiskSizeGB = obj.External_ExternalDiskSizeGB;
				data.External_ExternalDiskMultiPathSolution = obj.External_ExternalDiskMultiPathSolution;
				data.PS_PowerSupplyCount = obj.PS_PowerSupplyCount;
				data.PS_PowerSupplyVolumeW = obj.PS_PowerSupplyVolumeW;
				data.PS_PowerSupplyPduDual = obj.PS_PowerSupplyPduDual;
				data.PS_PowerSupplyRackPowerDual = obj.PS_PowerSupplyRackPowerDual;
				data.Fan_FanCount = obj.Fan_FanCount;
				data.Fan_FanDual = obj.Fan_FanDual;
				data.Nic_NicSpeed = obj.Nic_NicSpeed;
				data.Nic_NicType = obj.Nic_NicType;
				data.Nic_NicPort = obj.Nic_NicPort;
				data.Nic_NicCount = obj.Nic_NicCount;
				data.Nic_NicUsePortCount = obj.Nic_NicUsePortCount;
				data.Nic_OnboardNicPortCount = obj.Nic_OnboardNicPortCount;
				data.Nic_OnboardNicUsePortCount = obj.Nic_OnboardNicUsePortCount;
				data.Nic_HBASpeed = obj.Nic_HBASpeed;
				data.Nic_HBAType = obj.Nic_HBAType;
				data.Nic_HBAPort = obj.Nic_HBAPort;
				data.Nic_HBACount = obj.Nic_HBACount;
				data.Nic_UsingHBAPortCount = obj.Nic_UsingHBAPortCount;
				data.NW_ManageIPAddr = obj.NW_ManageIPAddr;
				data.NW_IPAddr2 = obj.NW_IPAddr2;
				data.NW_IPAddr3 = obj.NW_IPAddr3;
				data.NW_IPAddr4 = obj.NW_IPAddr4;
				data.Connect_SanSwitch1 = obj.Connect_SanSwitch1;
				data.Connect_SanSwitch2 = obj.Connect_SanSwitch2;
				data.Connect_SanSwitch3 = obj.Connect_SanSwitch3;
				data.Connect_NWEquip1 = obj.Connect_NWEquip1;
				data.Connect_NWEquip2 = obj.Connect_NWEquip2;
				data.Connect_NWEquip3 = obj.Connect_NWEquip3;
				data.Connect_NWEquip4 = obj.Connect_NWEquip4;
				data.Connect_NWEquip5 = obj.Connect_NWEquip5;
				data.Connect_NWEquip6 = obj.Connect_NWEquip6;
				data.Connect_NWEquip7 = obj.Connect_NWEquip7;
				data.Connect_NWEquip8 = obj.Connect_NWEquip8;
				data.Connect_Storage1 = obj.Connect_Storage1;
				data.Connect_Storage2 = obj.Connect_Storage2;
				data.Connect_Backup1 = obj.Connect_Backup1;
				data.Connect_Backup2 = obj.Connect_Backup2;
				data.Connect_Backup3 = obj.Connect_Backup3;
				data.Connect_Backup4 = obj.Connect_Backup4;
				return data;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public Etc CreateEtc(Etc obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<Etc.Fields, object> dicFieldDatas = new Dictionary<Etc.Fields, object>();
			dicFieldDatas[Etc.Fields.DataCenterID] = obj.DataCenterID;
			dicFieldDatas[Etc.Fields.EtcID] = obj.EtcID;
			dicFieldDatas[Etc.Fields.Basic_Name] = obj.Basic_Name;
			dicFieldDatas[Etc.Fields.Basic_Status] = obj.Basic_Status;
			dicFieldDatas[Etc.Fields.Basic_RegDate] = obj.Basic_RegDate;
			dicFieldDatas[Etc.Fields.Basic_Usage] = obj.Basic_Usage;
			dicFieldDatas[Etc.Fields.Basic_EquipDetailClass] = obj.Basic_EquipDetailClass;
			dicFieldDatas[Etc.Fields.Basic_LifeYear] = obj.Basic_LifeYear;
			dicFieldDatas[Etc.Fields.Basic_OverUsedYear] = obj.Basic_OverUsedYear;
			dicFieldDatas[Etc.Fields.Basic_ReceiveDate] = obj.Basic_ReceiveDate;
			dicFieldDatas[Etc.Fields.Basic_ItemLevel] = obj.Basic_ItemLevel;
			dicFieldDatas[Etc.Fields.Basic_OwnerCompanyName] = obj.Basic_OwnerCompanyName;
			dicFieldDatas[Etc.Fields.Basic_OwnDepartment] = obj.Basic_OwnDepartment;
			dicFieldDatas[Etc.Fields.Basic_OperationDepartment] = obj.Basic_OperationDepartment;
			dicFieldDatas[Etc.Fields.Basic_SiteManager] = obj.Basic_SiteManager;
			dicFieldDatas[Etc.Fields.Basic_DiscardDate] = obj.Basic_DiscardDate;
			dicFieldDatas[Etc.Fields.Basic_Memo] = obj.Basic_Memo;
			dicFieldDatas[Etc.Fields.Manage_SuperviseManager] = obj.Manage_SuperviseManager;
			dicFieldDatas[Etc.Fields.Manage_OperationManager] = obj.Manage_OperationManager;
			dicFieldDatas[Etc.Fields.Position_InstallRegion] = obj.Position_InstallRegion;
			dicFieldDatas[Etc.Fields.Position_RackDetailPosition] = obj.Position_RackDetailPosition;
			dicFieldDatas[Etc.Fields.Maintenance_ProvideCompanyName] = obj.Maintenance_ProvideCompanyName;
			dicFieldDatas[Etc.Fields.Maintenance_WarrantyMonth] = obj.Maintenance_WarrantyMonth;
			dicFieldDatas[Etc.Fields.Maintenance_WarrantyExpiredDate] = obj.Maintenance_WarrantyExpiredDate;
			dicFieldDatas[Etc.Fields.Maintenance_FinancialDepartment] = obj.Maintenance_FinancialDepartment;
			dicFieldDatas[Etc.Fields.Maintenance_MaintenanceCompanyName] = obj.Maintenance_MaintenanceCompanyName;
			dicFieldDatas[Etc.Fields.Maintenance_EOSDate] = obj.Maintenance_EOSDate;
			dicFieldDatas[Etc.Fields.Maintenance_MaintenanceContract] = obj.Maintenance_MaintenanceContract;
			dicFieldDatas[Etc.Fields.Maintenance_MaintenanceBeginDate] = obj.Maintenance_MaintenanceBeginDate;
			dicFieldDatas[Etc.Fields.Maintenance_MaintenanceEndDate] = obj.Maintenance_MaintenanceEndDate;
			dicFieldDatas[Etc.Fields.HW_ModelName] = obj.HW_ModelName;
			dicFieldDatas[Etc.Fields.HW_Company] = obj.HW_Company;
			dicFieldDatas[Etc.Fields.HW_SerialNumber] = obj.HW_SerialNumber;
			dicFieldDatas[Etc.Fields.HW_FirmwareVersion] = obj.HW_FirmwareVersion;
			dicFieldDatas[Etc.Fields.HW_MultiLicense] = obj.HW_MultiLicense;
			dicFieldDatas[Etc.Fields.HW_MicCount] = obj.HW_MicCount;
			dicFieldDatas[Etc.Fields.HW_PAD] = obj.HW_PAD;
			dicFieldDatas[Etc.Fields.HW_Rack] = obj.HW_Rack;
			dicFieldDatas[Etc.Fields.HW_MonitorModelName] = obj.HW_MonitorModelName;
			dicFieldDatas[Etc.Fields.HW_MonitorType] = obj.HW_MonitorType;
			dicFieldDatas[Etc.Fields.HW_MonitorScreenSizeInch] = obj.HW_MonitorScreenSizeInch;
			dicFieldDatas[Etc.Fields.HW_ScreenIP] = obj.HW_ScreenIP;
			dicFieldDatas[Etc.Fields.HW_HostName] = obj.HW_HostName;
			dicFieldDatas[Etc.Fields.HW_QoS] = obj.HW_QoS;
			dicFieldDatas[Etc.Fields.HW_QosVolume] = obj.HW_QosVolume;
			dicFieldDatas[Etc.Fields.HW_PrivateLine] = obj.HW_PrivateLine;
			dicFieldDatas[Etc.Fields.HW_PrivateCompanyBW] = obj.HW_PrivateCompanyBW;
			dicFieldDatas[Etc.Fields.HW_Special] = obj.HW_Special;
			dicFieldDatas[Etc.Fields.Connect_NWEquip_1] = obj.Connect_NWEquip_1;
			dicFieldDatas[Etc.Fields.Connect_NWEquip_2] = obj.Connect_NWEquip_2;

			string strSQL = string.Format("Insert into {0} ({1}) values ({2})",
				Etc.TableName,
				GetFieldNames<Etc.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				Etc data = new Etc();
				data.DataCenterID = obj.DataCenterID;
				data.EtcID = obj.EtcID;
				data.Basic_Name = obj.Basic_Name;
				data.Basic_Status = obj.Basic_Status;
				data.Basic_RegDate = obj.Basic_RegDate;
				data.Basic_Usage = obj.Basic_Usage;
				data.Basic_EquipDetailClass = obj.Basic_EquipDetailClass;
				data.Basic_LifeYear = obj.Basic_LifeYear;
				data.Basic_OverUsedYear = obj.Basic_OverUsedYear;
				data.Basic_ReceiveDate = obj.Basic_ReceiveDate;
				data.Basic_ItemLevel = obj.Basic_ItemLevel;
				data.Basic_OwnerCompanyName = obj.Basic_OwnerCompanyName;
				data.Basic_OwnDepartment = obj.Basic_OwnDepartment;
				data.Basic_OperationDepartment = obj.Basic_OperationDepartment;
				data.Basic_SiteManager = obj.Basic_SiteManager;
				data.Basic_DiscardDate = obj.Basic_DiscardDate;
				data.Basic_Memo = obj.Basic_Memo;
				data.Manage_SuperviseManager = obj.Manage_SuperviseManager;
				data.Manage_OperationManager = obj.Manage_OperationManager;
				data.Position_InstallRegion = obj.Position_InstallRegion;
				data.Position_RackDetailPosition = obj.Position_RackDetailPosition;
				data.Maintenance_ProvideCompanyName = obj.Maintenance_ProvideCompanyName;
				data.Maintenance_WarrantyMonth = obj.Maintenance_WarrantyMonth;
				data.Maintenance_WarrantyExpiredDate = obj.Maintenance_WarrantyExpiredDate;
				data.Maintenance_FinancialDepartment = obj.Maintenance_FinancialDepartment;
				data.Maintenance_MaintenanceCompanyName = obj.Maintenance_MaintenanceCompanyName;
				data.Maintenance_EOSDate = obj.Maintenance_EOSDate;
				data.Maintenance_MaintenanceContract = obj.Maintenance_MaintenanceContract;
				data.Maintenance_MaintenanceBeginDate = obj.Maintenance_MaintenanceBeginDate;
				data.Maintenance_MaintenanceEndDate = obj.Maintenance_MaintenanceEndDate;
				data.HW_ModelName = obj.HW_ModelName;
				data.HW_Company = obj.HW_Company;
				data.HW_SerialNumber = obj.HW_SerialNumber;
				data.HW_FirmwareVersion = obj.HW_FirmwareVersion;
				data.HW_MultiLicense = obj.HW_MultiLicense;
				data.HW_MicCount = obj.HW_MicCount;
				data.HW_PAD = obj.HW_PAD;
				data.HW_Rack = obj.HW_Rack;
				data.HW_MonitorModelName = obj.HW_MonitorModelName;
				data.HW_MonitorType = obj.HW_MonitorType;
				data.HW_MonitorScreenSizeInch = obj.HW_MonitorScreenSizeInch;
				data.HW_ScreenIP = obj.HW_ScreenIP;
				data.HW_HostName = obj.HW_HostName;
				data.HW_QoS = obj.HW_QoS;
				data.HW_QosVolume = obj.HW_QosVolume;
				data.HW_PrivateLine = obj.HW_PrivateLine;
				data.HW_PrivateCompanyBW = obj.HW_PrivateCompanyBW;
				data.HW_Special = obj.HW_Special;
				data.Connect_NWEquip_1 = obj.Connect_NWEquip_1;
				data.Connect_NWEquip_2 = obj.Connect_NWEquip_2;
				return data;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public Network CreateNetwork(Network obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<Network.Fields, object> dicFieldDatas = new Dictionary<Network.Fields, object>();
			dicFieldDatas[Network.Fields.DataCenterID] = obj.DataCenterID;
			dicFieldDatas[Network.Fields.NetworkID] = obj.NetworkID;
			dicFieldDatas[Network.Fields.Basic_Name] = obj.Basic_Name;
			dicFieldDatas[Network.Fields.Basic_Status] = obj.Basic_Status;
			dicFieldDatas[Network.Fields.Basic_RegDate] = obj.Basic_RegDate;
			dicFieldDatas[Network.Fields.Basic_Usage] = obj.Basic_Usage;
			dicFieldDatas[Network.Fields.Basic_EquipDetailClass] = obj.Basic_EquipDetailClass;
			dicFieldDatas[Network.Fields.Basic_ItemLevel] = obj.Basic_ItemLevel;
			dicFieldDatas[Network.Fields.Basic_ReceiveDate] = obj.Basic_ReceiveDate;
			dicFieldDatas[Network.Fields.Basic_OwnerCompanyName] = obj.Basic_OwnerCompanyName;
			dicFieldDatas[Network.Fields.Basic_OwnDepartment] = obj.Basic_OwnDepartment;
			dicFieldDatas[Network.Fields.Basic_OperationDepartment] = obj.Basic_OperationDepartment;
			dicFieldDatas[Network.Fields.Basic_OverUsedYear] = obj.Basic_OverUsedYear;
			dicFieldDatas[Network.Fields.Basic_Stock] = obj.Basic_Stock;
			dicFieldDatas[Network.Fields.Basic_Type1] = obj.Basic_Type1;
			dicFieldDatas[Network.Fields.Basic_Type2] = obj.Basic_Type2;
			dicFieldDatas[Network.Fields.Basic_Memo] = obj.Basic_Memo;
			dicFieldDatas[Network.Fields.Manage_SuperviseManager] = obj.Manage_SuperviseManager;
			dicFieldDatas[Network.Fields.Manage_OperationManager] = obj.Manage_OperationManager;
			dicFieldDatas[Network.Fields.Position_InstallRegion] = obj.Position_InstallRegion;
			dicFieldDatas[Network.Fields.Position_RackDetailPosition] = obj.Position_RackDetailPosition;
			dicFieldDatas[Network.Fields.Maintenance_ProvideCompanyName] = obj.Maintenance_ProvideCompanyName;
			dicFieldDatas[Network.Fields.Maintenance_WarrantyMonth] = obj.Maintenance_WarrantyMonth;
			dicFieldDatas[Network.Fields.Maintenance_WarrantyExpiredDate] = obj.Maintenance_WarrantyExpiredDate;
			dicFieldDatas[Network.Fields.Maintenance_MaintenanceCompanyName] = obj.Maintenance_MaintenanceCompanyName;
			dicFieldDatas[Network.Fields.Maintenance_EOSDate] = obj.Maintenance_EOSDate;
			dicFieldDatas[Network.Fields.Maintenance_EOLDate] = obj.Maintenance_EOLDate;
			dicFieldDatas[Network.Fields.Maintenance_MaintenanceContract] = obj.Maintenance_MaintenanceContract;
			dicFieldDatas[Network.Fields.Maintenance_MaintenanceBeginDate] = obj.Maintenance_MaintenanceBeginDate;
			dicFieldDatas[Network.Fields.Maintenance_MaintenanceEndDate] = obj.Maintenance_MaintenanceEndDate;
			dicFieldDatas[Network.Fields.HW_ModelName] = obj.HW_ModelName;
			dicFieldDatas[Network.Fields.HW_Company] = obj.HW_Company;
			dicFieldDatas[Network.Fields.HW_SerialNumber] = obj.HW_SerialNumber;
			dicFieldDatas[Network.Fields.HW_OSVersion] = obj.HW_OSVersion;
			dicFieldDatas[Network.Fields.HW_IP_01] = obj.HW_IP_01;
			dicFieldDatas[Network.Fields.HW_IP_02] = obj.HW_IP_02;
			dicFieldDatas[Network.Fields.HW_IP_03] = obj.HW_IP_03;
			dicFieldDatas[Network.Fields.HW_IP_04] = obj.HW_IP_04;
			dicFieldDatas[Network.Fields.HW_IP_05] = obj.HW_IP_05;
			dicFieldDatas[Network.Fields.HW_IP_06] = obj.HW_IP_06;
			dicFieldDatas[Network.Fields.HW_IP_07] = obj.HW_IP_07;
			dicFieldDatas[Network.Fields.HW_IP_08] = obj.HW_IP_08;
			dicFieldDatas[Network.Fields.HW_Rack] = obj.HW_Rack;
			dicFieldDatas[Network.Fields.HW_PowerDual] = obj.HW_PowerDual;
			dicFieldDatas[Network.Fields.HW_Zone] = obj.HW_Zone;
			dicFieldDatas[Network.Fields.HW_DetailUsage] = obj.HW_DetailUsage;
			dicFieldDatas[Network.Fields.HW_NMS] = obj.HW_NMS;
			dicFieldDatas[Network.Fields.HW_NWLineName] = obj.HW_NWLineName;
			dicFieldDatas[Network.Fields.Connect_NWEquip_1] = obj.Connect_NWEquip_1;
			dicFieldDatas[Network.Fields.Connect_NWEquip_2] = obj.Connect_NWEquip_2;
			dicFieldDatas[Network.Fields.Connect_NWEquip_3] = obj.Connect_NWEquip_3;
			dicFieldDatas[Network.Fields.Connect_NWEquip_4] = obj.Connect_NWEquip_4;

			string strSQL = string.Format("Insert into {0} ({1}) values ({2})",
				Network.TableName,
				GetFieldNames<Network.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				Network data = new Network();
				data.DataCenterID = obj.DataCenterID;
				data.NetworkID = obj.NetworkID;
				data.Basic_Name = obj.Basic_Name;
				data.Basic_Status = obj.Basic_Status;
				data.Basic_RegDate = obj.Basic_RegDate;
				data.Basic_Usage = obj.Basic_Usage;
				data.Basic_EquipDetailClass = obj.Basic_EquipDetailClass;
				data.Basic_ItemLevel = obj.Basic_ItemLevel;
				data.Basic_ReceiveDate = obj.Basic_ReceiveDate;
				data.Basic_OwnerCompanyName = obj.Basic_OwnerCompanyName;
				data.Basic_OwnDepartment = obj.Basic_OwnDepartment;
				data.Basic_OperationDepartment = obj.Basic_OperationDepartment;
				data.Basic_OverUsedYear = obj.Basic_OverUsedYear;
				data.Basic_Stock = obj.Basic_Stock;
				data.Basic_Type1 = obj.Basic_Type1;
				data.Basic_Type2 = obj.Basic_Type2;
				data.Basic_Memo = obj.Basic_Memo;
				data.Manage_SuperviseManager = obj.Manage_SuperviseManager;
				data.Manage_OperationManager = obj.Manage_OperationManager;
				data.Position_InstallRegion = obj.Position_InstallRegion;
				data.Position_RackDetailPosition = obj.Position_RackDetailPosition;
				data.Maintenance_ProvideCompanyName = obj.Maintenance_ProvideCompanyName;
				data.Maintenance_WarrantyMonth = obj.Maintenance_WarrantyMonth;
				data.Maintenance_WarrantyExpiredDate = obj.Maintenance_WarrantyExpiredDate;
				data.Maintenance_MaintenanceCompanyName = obj.Maintenance_MaintenanceCompanyName;
				data.Maintenance_EOSDate = obj.Maintenance_EOSDate;
				data.Maintenance_EOLDate = obj.Maintenance_EOLDate;
				data.Maintenance_MaintenanceContract = obj.Maintenance_MaintenanceContract;
				data.Maintenance_MaintenanceBeginDate = obj.Maintenance_MaintenanceBeginDate;
				data.Maintenance_MaintenanceEndDate = obj.Maintenance_MaintenanceEndDate;
				data.HW_ModelName = obj.HW_ModelName;
				data.HW_Company = obj.HW_Company;
				data.HW_SerialNumber = obj.HW_SerialNumber;
				data.HW_OSVersion = obj.HW_OSVersion;
				data.HW_IP_01 = obj.HW_IP_01;
				data.HW_IP_02 = obj.HW_IP_02;
				data.HW_IP_03 = obj.HW_IP_03;
				data.HW_IP_04 = obj.HW_IP_04;
				data.HW_IP_05 = obj.HW_IP_05;
				data.HW_IP_06 = obj.HW_IP_06;
				data.HW_IP_07 = obj.HW_IP_07;
				data.HW_IP_08 = obj.HW_IP_08;
				data.HW_Rack = obj.HW_Rack;
				data.HW_PowerDual = obj.HW_PowerDual;
				data.HW_Zone = obj.HW_Zone;
				data.HW_DetailUsage = obj.HW_DetailUsage;
				data.HW_NMS = obj.HW_NMS;
				data.HW_NWLineName = obj.HW_NWLineName;
				data.Connect_NWEquip_1 = obj.Connect_NWEquip_1;
				data.Connect_NWEquip_2 = obj.Connect_NWEquip_2;
				data.Connect_NWEquip_3 = obj.Connect_NWEquip_3;
				data.Connect_NWEquip_4 = obj.Connect_NWEquip_4;
				return data;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public SanSwitch CreateSanSwitch(SanSwitch obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<SanSwitch.Fields, object> dicFieldDatas = new Dictionary<SanSwitch.Fields, object>();
			dicFieldDatas[SanSwitch.Fields.DataCenterID] = obj.DataCenterID;
			dicFieldDatas[SanSwitch.Fields.SwitchID] = obj.SwitchID;
			dicFieldDatas[SanSwitch.Fields.Basic_Name] = obj.Basic_Name;
			dicFieldDatas[SanSwitch.Fields.Basic_Status] = obj.Basic_Status;
			dicFieldDatas[SanSwitch.Fields.Basic_RegDate] = obj.Basic_RegDate;
			dicFieldDatas[SanSwitch.Fields.Basic_Usage] = obj.Basic_Usage;
			dicFieldDatas[SanSwitch.Fields.Basic_ReceiveDate] = obj.Basic_ReceiveDate;
			dicFieldDatas[SanSwitch.Fields.Basic_ItemLevel] = obj.Basic_ItemLevel;
			dicFieldDatas[SanSwitch.Fields.Basic_OwnerCompanyName] = obj.Basic_OwnerCompanyName;
			dicFieldDatas[SanSwitch.Fields.Basic_OwnDepartment] = obj.Basic_OwnDepartment;
			dicFieldDatas[SanSwitch.Fields.Basic_OperationDepartment] = obj.Basic_OperationDepartment;
			dicFieldDatas[SanSwitch.Fields.Basic_Memo] = obj.Basic_Memo;
			dicFieldDatas[SanSwitch.Fields.Manage_SuperviseManager] = obj.Manage_SuperviseManager;
			dicFieldDatas[SanSwitch.Fields.Manage_OperationManager] = obj.Manage_OperationManager;
			dicFieldDatas[SanSwitch.Fields.Position_InstallRegion] = obj.Position_InstallRegion;
			dicFieldDatas[SanSwitch.Fields.Position_RackDetailPosition] = obj.Position_RackDetailPosition;
			dicFieldDatas[SanSwitch.Fields.Maintenance_ProvideCompanyName] = obj.Maintenance_ProvideCompanyName;
			dicFieldDatas[SanSwitch.Fields.Maintenance_WarrantyMonth] = obj.Maintenance_WarrantyMonth;
			dicFieldDatas[SanSwitch.Fields.Maintenance_WarrantyExpiredDate] = obj.Maintenance_WarrantyExpiredDate;
			dicFieldDatas[SanSwitch.Fields.Maintenance_MaintenanceCompanyName] = obj.Maintenance_MaintenanceCompanyName;
			dicFieldDatas[SanSwitch.Fields.Maintenance_EOSDate] = obj.Maintenance_EOSDate;
			dicFieldDatas[SanSwitch.Fields.Maintenance_MaintenanceContract] = obj.Maintenance_MaintenanceContract;
			dicFieldDatas[SanSwitch.Fields.Maintenance_MaintenanceBeginDate] = obj.Maintenance_MaintenanceBeginDate;
			dicFieldDatas[SanSwitch.Fields.Maintenance_MaintenanceEndDate] = obj.Maintenance_MaintenanceEndDate;
			dicFieldDatas[SanSwitch.Fields.HW_ModelName] = obj.HW_ModelName;
			dicFieldDatas[SanSwitch.Fields.HW_Company] = obj.HW_Company;
			dicFieldDatas[SanSwitch.Fields.HW_SerialNumber] = obj.HW_SerialNumber;
			dicFieldDatas[SanSwitch.Fields.HW_FirmwareVersion] = obj.HW_FirmwareVersion;
			dicFieldDatas[SanSwitch.Fields.HW_Dual] = obj.HW_Dual;
			dicFieldDatas[SanSwitch.Fields.HW_DualSanSwitchName] = obj.HW_DualSanSwitchName;
			dicFieldDatas[SanSwitch.Fields.HW_InterfaceType] = obj.HW_InterfaceType;
			dicFieldDatas[SanSwitch.Fields.HW_Interface] = obj.HW_Interface;
			dicFieldDatas[SanSwitch.Fields.HW_FCPortCount] = obj.HW_FCPortCount;
			dicFieldDatas[SanSwitch.Fields.HW_FCPortUseCount] = obj.HW_FCPortUseCount;
			dicFieldDatas[SanSwitch.Fields.HW_FCPortFree] = obj.HW_FCPortFree;
			dicFieldDatas[SanSwitch.Fields.HW_GBICPortCount] = obj.HW_GBICPortCount;
			dicFieldDatas[SanSwitch.Fields.HW_DualBoxSerial] = obj.HW_DualBoxSerial;
			dicFieldDatas[SanSwitch.Fields.HW_SecurityType] = obj.HW_SecurityType;
			dicFieldDatas[SanSwitch.Fields.HW_FanCount] = obj.HW_FanCount;
			dicFieldDatas[SanSwitch.Fields.HW_FanDual] = obj.HW_FanDual;
			dicFieldDatas[SanSwitch.Fields.HW_PowerSupplyDual] = obj.HW_PowerSupplyDual;
			dicFieldDatas[SanSwitch.Fields.HW_ConnectPDUDual] = obj.HW_ConnectPDUDual;
			dicFieldDatas[SanSwitch.Fields.Dual_RackPowerDualUse] = obj.Dual_RackPowerDualUse;

			string strSQL = string.Format("Insert into {0} ({1}) values ({2})",
				SanSwitch.TableName,
				GetFieldNames<SanSwitch.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				SanSwitch data = new SanSwitch();
				data.DataCenterID = obj.DataCenterID;
				data.SwitchID = obj.SwitchID;
				data.Basic_Name = obj.Basic_Name;
				data.Basic_Status = obj.Basic_Status;
				data.Basic_RegDate = obj.Basic_RegDate;
				data.Basic_Usage = obj.Basic_Usage;
				data.Basic_ReceiveDate = obj.Basic_ReceiveDate;
				data.Basic_ItemLevel = obj.Basic_ItemLevel;
				data.Basic_OwnerCompanyName = obj.Basic_OwnerCompanyName;
				data.Basic_OwnDepartment = obj.Basic_OwnDepartment;
				data.Basic_OperationDepartment = obj.Basic_OperationDepartment;
				data.Basic_Memo = obj.Basic_Memo;
				data.Manage_SuperviseManager = obj.Manage_SuperviseManager;
				data.Manage_OperationManager = obj.Manage_OperationManager;
				data.Position_InstallRegion = obj.Position_InstallRegion;
				data.Position_RackDetailPosition = obj.Position_RackDetailPosition;
				data.Maintenance_ProvideCompanyName = obj.Maintenance_ProvideCompanyName;
				data.Maintenance_WarrantyMonth = obj.Maintenance_WarrantyMonth;
				data.Maintenance_WarrantyExpiredDate = obj.Maintenance_WarrantyExpiredDate;
				data.Maintenance_MaintenanceCompanyName = obj.Maintenance_MaintenanceCompanyName;
				data.Maintenance_EOSDate = obj.Maintenance_EOSDate;
				data.Maintenance_MaintenanceContract = obj.Maintenance_MaintenanceContract;
				data.Maintenance_MaintenanceBeginDate = obj.Maintenance_MaintenanceBeginDate;
				data.Maintenance_MaintenanceEndDate = obj.Maintenance_MaintenanceEndDate;
				data.HW_ModelName = obj.HW_ModelName;
				data.HW_Company = obj.HW_Company;
				data.HW_SerialNumber = obj.HW_SerialNumber;
				data.HW_FirmwareVersion = obj.HW_FirmwareVersion;
				data.HW_Dual = obj.HW_Dual;
				data.HW_DualSanSwitchName = obj.HW_DualSanSwitchName;
				data.HW_InterfaceType = obj.HW_InterfaceType;
				data.HW_Interface = obj.HW_Interface;
				data.HW_FCPortCount = obj.HW_FCPortCount;
				data.HW_FCPortUseCount = obj.HW_FCPortUseCount;
				data.HW_FCPortFree = obj.HW_FCPortFree;
				data.HW_GBICPortCount = obj.HW_GBICPortCount;
				data.HW_DualBoxSerial = obj.HW_DualBoxSerial;
				data.HW_SecurityType = obj.HW_SecurityType;
				data.HW_FanCount = obj.HW_FanCount;
				data.HW_FanDual = obj.HW_FanDual;
				data.HW_PowerSupplyDual = obj.HW_PowerSupplyDual;
				data.HW_ConnectPDUDual = obj.HW_ConnectPDUDual;
				data.Dual_RackPowerDualUse = obj.Dual_RackPowerDualUse;
				return data;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public Security CreateSecurity(Security obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<Security.Fields, object> dicFieldDatas = new Dictionary<Security.Fields, object>();
			dicFieldDatas[Security.Fields.DataCenterID] = obj.DataCenterID;
			dicFieldDatas[Security.Fields.SecurityID] = obj.SecurityID;
			dicFieldDatas[Security.Fields.Basic_Name] = obj.Basic_Name;
			dicFieldDatas[Security.Fields.Basic_Status] = obj.Basic_Status;
			dicFieldDatas[Security.Fields.Basic_RegDate] = obj.Basic_RegDate;
			dicFieldDatas[Security.Fields.Basic_Usage] = obj.Basic_Usage;
			dicFieldDatas[Security.Fields.Basic_EquipType] = obj.Basic_EquipType;
			dicFieldDatas[Security.Fields.Basic_EquipDetailClass] = obj.Basic_EquipDetailClass;
			dicFieldDatas[Security.Fields.Basic_ReceiveDate] = obj.Basic_ReceiveDate;
			dicFieldDatas[Security.Fields.Basic_ItemLevel] = obj.Basic_ItemLevel;
			dicFieldDatas[Security.Fields.Basic_OwnerCompanyName] = obj.Basic_OwnerCompanyName;
			dicFieldDatas[Security.Fields.Basic_OwnDepartment] = obj.Basic_OwnDepartment;
			dicFieldDatas[Security.Fields.Basic_OperationDepartment] = obj.Basic_OperationDepartment;
			dicFieldDatas[Security.Fields.Basic_Memo] = obj.Basic_Memo;
			dicFieldDatas[Security.Fields.Manage_SuperviseManager] = obj.Manage_SuperviseManager;
			dicFieldDatas[Security.Fields.Manage_OperationManager] = obj.Manage_OperationManager;
			dicFieldDatas[Security.Fields.Position_InstallRegion] = obj.Position_InstallRegion;
			dicFieldDatas[Security.Fields.Position_RackDetailPosition] = obj.Position_RackDetailPosition;
			dicFieldDatas[Security.Fields.Maintenance_ProvideCompanyName] = obj.Maintenance_ProvideCompanyName;
			dicFieldDatas[Security.Fields.Maintenance_WarrantyMonth] = obj.Maintenance_WarrantyMonth;
			dicFieldDatas[Security.Fields.Maintenance_WarrantyExpiredDate] = obj.Maintenance_WarrantyExpiredDate;
			dicFieldDatas[Security.Fields.Maintenance_MaintenanceCompanyName] = obj.Maintenance_MaintenanceCompanyName;
			dicFieldDatas[Security.Fields.Maintenance_EOSDate] = obj.Maintenance_EOSDate;
			dicFieldDatas[Security.Fields.Maintenance_MaintenanceContract] = obj.Maintenance_MaintenanceContract;
			dicFieldDatas[Security.Fields.Maintenance_MaintenanceBeginDate] = obj.Maintenance_MaintenanceBeginDate;
			dicFieldDatas[Security.Fields.Maintenance_MaintenanceEndDate] = obj.Maintenance_MaintenanceEndDate;
			dicFieldDatas[Security.Fields.HW_ModelName] = obj.HW_ModelName;
			dicFieldDatas[Security.Fields.HW_Company] = obj.HW_Company;
			dicFieldDatas[Security.Fields.HW_SerialNumber] = obj.HW_SerialNumber;
			dicFieldDatas[Security.Fields.HW_FirmwareVersion] = obj.HW_FirmwareVersion;
			dicFieldDatas[Security.Fields.HW_IP] = obj.HW_IP;
			dicFieldDatas[Security.Fields.Connect_NWEquip_1] = obj.Connect_NWEquip_1;
			dicFieldDatas[Security.Fields.Connect_NWEquip_2] = obj.Connect_NWEquip_2;

			string strSQL = string.Format("Insert into {0} ({1}) values ({2})",
				Security.TableName,
				GetFieldNames<Security.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				Security data = new Security();
				data.DataCenterID = obj.DataCenterID;
				data.SecurityID = obj.SecurityID;
				data.Basic_Name = obj.Basic_Name;
				data.Basic_Status = obj.Basic_Status;
				data.Basic_RegDate = obj.Basic_RegDate;
				data.Basic_Usage = obj.Basic_Usage;
				data.Basic_EquipType = obj.Basic_EquipType;
				data.Basic_EquipDetailClass = obj.Basic_EquipDetailClass;
				data.Basic_ReceiveDate = obj.Basic_ReceiveDate;
				data.Basic_ItemLevel = obj.Basic_ItemLevel;
				data.Basic_OwnerCompanyName = obj.Basic_OwnerCompanyName;
				data.Basic_OwnDepartment = obj.Basic_OwnDepartment;
				data.Basic_OperationDepartment = obj.Basic_OperationDepartment;
				data.Basic_Memo = obj.Basic_Memo;
				data.Manage_SuperviseManager = obj.Manage_SuperviseManager;
				data.Manage_OperationManager = obj.Manage_OperationManager;
				data.Position_InstallRegion = obj.Position_InstallRegion;
				data.Position_RackDetailPosition = obj.Position_RackDetailPosition;
				data.Maintenance_ProvideCompanyName = obj.Maintenance_ProvideCompanyName;
				data.Maintenance_WarrantyMonth = obj.Maintenance_WarrantyMonth;
				data.Maintenance_WarrantyExpiredDate = obj.Maintenance_WarrantyExpiredDate;
				data.Maintenance_MaintenanceCompanyName = obj.Maintenance_MaintenanceCompanyName;
				data.Maintenance_EOSDate = obj.Maintenance_EOSDate;
				data.Maintenance_MaintenanceContract = obj.Maintenance_MaintenanceContract;
				data.Maintenance_MaintenanceBeginDate = obj.Maintenance_MaintenanceBeginDate;
				data.Maintenance_MaintenanceEndDate = obj.Maintenance_MaintenanceEndDate;
				data.HW_ModelName = obj.HW_ModelName;
				data.HW_Company = obj.HW_Company;
				data.HW_SerialNumber = obj.HW_SerialNumber;
				data.HW_FirmwareVersion = obj.HW_FirmwareVersion;
				data.HW_IP = obj.HW_IP;
				data.Connect_NWEquip_1 = obj.Connect_NWEquip_1;
				data.Connect_NWEquip_2 = obj.Connect_NWEquip_2;
				return data;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public Storage CreateStorage(Storage obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<Storage.Fields, object> dicFieldDatas = new Dictionary<Storage.Fields, object>();
			dicFieldDatas[Storage.Fields.DataCenterID] = obj.DataCenterID;
			dicFieldDatas[Storage.Fields.StorageID] = obj.StorageID;
			dicFieldDatas[Storage.Fields.Basic_Name] = obj.Basic_Name;
			dicFieldDatas[Storage.Fields.Basic_Status] = obj.Basic_Status;
			dicFieldDatas[Storage.Fields.Basic_RegDate] = obj.Basic_RegDate;
			dicFieldDatas[Storage.Fields.Basic_Usage] = obj.Basic_Usage;
			dicFieldDatas[Storage.Fields.Basic_ItemLevel] = obj.Basic_ItemLevel;
			dicFieldDatas[Storage.Fields.Basic_ReceiveDate] = obj.Basic_ReceiveDate;
			dicFieldDatas[Storage.Fields.Basic_ReceiveYears] = obj.Basic_ReceiveYears;
			dicFieldDatas[Storage.Fields.Basic_OwnerCompanyName] = obj.Basic_OwnerCompanyName;
			dicFieldDatas[Storage.Fields.Basic_OwnDepartment] = obj.Basic_OwnDepartment;
			dicFieldDatas[Storage.Fields.Basic_OperationDepartment] = obj.Basic_OperationDepartment;
			dicFieldDatas[Storage.Fields.Basic_SiteManager] = obj.Basic_SiteManager;
			dicFieldDatas[Storage.Fields.Basic_DiscardDate] = obj.Basic_DiscardDate;
			dicFieldDatas[Storage.Fields.Basic_OverUsedYear] = obj.Basic_OverUsedYear;
			dicFieldDatas[Storage.Fields.Basic_Memo] = obj.Basic_Memo;
			dicFieldDatas[Storage.Fields.Manage_SuperviseManager] = obj.Manage_SuperviseManager;
			dicFieldDatas[Storage.Fields.Manage_OperationManager] = obj.Manage_OperationManager;
			dicFieldDatas[Storage.Fields.Position_InstallRegion] = obj.Position_InstallRegion;
			dicFieldDatas[Storage.Fields.Position_RackDetailPosition] = obj.Position_RackDetailPosition;
			dicFieldDatas[Storage.Fields.Maintenance_ProvideCompanyName] = obj.Maintenance_ProvideCompanyName;
			dicFieldDatas[Storage.Fields.Maintenance_WarrantyMonth] = obj.Maintenance_WarrantyMonth;
			dicFieldDatas[Storage.Fields.Maintenance_WarrantyExpiredDate] = obj.Maintenance_WarrantyExpiredDate;
			dicFieldDatas[Storage.Fields.Maintenance_MaintenanceCompanyName] = obj.Maintenance_MaintenanceCompanyName;
			dicFieldDatas[Storage.Fields.Maintenance_EOSDate] = obj.Maintenance_EOSDate;
			dicFieldDatas[Storage.Fields.Maintenance_EOLDate] = obj.Maintenance_EOLDate;
			dicFieldDatas[Storage.Fields.Maintenance_EOSL] = obj.Maintenance_EOSL;
			dicFieldDatas[Storage.Fields.Maintenance_EOSLDate] = obj.Maintenance_EOSLDate;
			dicFieldDatas[Storage.Fields.Maintenance_MaintenanceContract] = obj.Maintenance_MaintenanceContract;
			dicFieldDatas[Storage.Fields.Maintenance_MaintenanceBeginDate] = obj.Maintenance_MaintenanceBeginDate;
			dicFieldDatas[Storage.Fields.Maintenance_MaintenanceEndDate] = obj.Maintenance_MaintenanceEndDate;
			dicFieldDatas[Storage.Fields.HW_ModelName] = obj.HW_ModelName;
			dicFieldDatas[Storage.Fields.HW_Company] = obj.HW_Company;
			dicFieldDatas[Storage.Fields.HW_CacheMemory] = obj.HW_CacheMemory;
			dicFieldDatas[Storage.Fields.HW_SerialNumber] = obj.HW_SerialNumber;
			dicFieldDatas[Storage.Fields.HW_DiskType] = obj.HW_DiskType;
			dicFieldDatas[Storage.Fields.HW_ControllerFirmwareVersion] = obj.HW_ControllerFirmwareVersion;
			dicFieldDatas[Storage.Fields.HW_TotalPhysicalVolume] = obj.HW_TotalPhysicalVolume;
			dicFieldDatas[Storage.Fields.HW_TotalUsableVolume] = obj.HW_TotalUsableVolume;
			dicFieldDatas[Storage.Fields.HW_LogicalVolumeGB] = obj.HW_LogicalVolumeGB;
			dicFieldDatas[Storage.Fields.HW_FreeVolumeGB] = obj.HW_FreeVolumeGB;
			dicFieldDatas[Storage.Fields.HW_MultiPath] = obj.HW_MultiPath;
			dicFieldDatas[Storage.Fields.HW_MultiPathPropertyName] = obj.HW_MultiPathPropertyName;
			dicFieldDatas[Storage.Fields.HW_AvailableVolume] = obj.HW_AvailableVolume;
			dicFieldDatas[Storage.Fields.HW_GivenVolumeGB] = obj.HW_GivenVolumeGB;
			dicFieldDatas[Storage.Fields.HW_GivenRate] = obj.HW_GivenRate;
			dicFieldDatas[Storage.Fields.Dual_DualUse] = obj.Dual_DualUse;
			dicFieldDatas[Storage.Fields.Dual_DualType] = obj.Dual_DualType;
			dicFieldDatas[Storage.Fields.Dual_BoxDualUse] = obj.Dual_BoxDualUse;
			dicFieldDatas[Storage.Fields.Dual_BoxDualDiskEquipmentName] = obj.Dual_BoxDualDiskEquipmentName;
			dicFieldDatas[Storage.Fields.Dual_BoxDualSolutionName] = obj.Dual_BoxDualSolutionName;
			dicFieldDatas[Storage.Fields.Dual_ControllerDualUse] = obj.Dual_ControllerDualUse;
			dicFieldDatas[Storage.Fields.Dual_PowerDualUse] = obj.Dual_PowerDualUse;
			dicFieldDatas[Storage.Fields.Dual_PDUDualUse] = obj.Dual_PDUDualUse;
			dicFieldDatas[Storage.Fields.Dual_RackPowerDualUse] = obj.Dual_RackPowerDualUse;
			dicFieldDatas[Storage.Fields.Dual_InternalCopySWUse] = obj.Dual_InternalCopySWUse;
			dicFieldDatas[Storage.Fields.Dual_StorageCopyUse] = obj.Dual_StorageCopyUse;
			dicFieldDatas[Storage.Fields.Dual_StorageCopyType] = obj.Dual_StorageCopyType;
			dicFieldDatas[Storage.Fields.Volume_RegDate] = obj.Volume_RegDate;
			dicFieldDatas[Storage.Fields.Volume_DiskType] = obj.Volume_DiskType;
			dicFieldDatas[Storage.Fields.Volume_EachDiskVolume] = obj.Volume_EachDiskVolume;
			dicFieldDatas[Storage.Fields.Volume_DiskCount] = obj.Volume_DiskCount;
			dicFieldDatas[Storage.Fields.Volume_PhysicalVolume] = obj.Volume_PhysicalVolume;
			dicFieldDatas[Storage.Fields.Volume_UsableVolume] = obj.Volume_UsableVolume;
			dicFieldDatas[Storage.Fields.Volume_RaidSystem] = obj.Volume_RaidSystem;
			dicFieldDatas[Storage.Fields.Extra_DiskType] = obj.Extra_DiskType;
			dicFieldDatas[Storage.Fields.Extra_DiskVolume] = obj.Extra_DiskVolume;
			dicFieldDatas[Storage.Fields.Extra_DiskCount] = obj.Extra_DiskCount;
			dicFieldDatas[Storage.Fields.IP_IPType] = obj.IP_IPType;
			dicFieldDatas[Storage.Fields.IP_IPAddress] = obj.IP_IPAddress;
			dicFieldDatas[Storage.Fields.IP_NetworkSpeed] = obj.IP_NetworkSpeed;
			dicFieldDatas[Storage.Fields.Port_TotalPortCount] = obj.Port_TotalPortCount;
			dicFieldDatas[Storage.Fields.Port_UsePortCount] = obj.Port_UsePortCount;
			dicFieldDatas[Storage.Fields.Port_LinkedSanSwitch] = obj.Port_LinkedSanSwitch;
			dicFieldDatas[Storage.Fields.Port_ReceiveDate] = obj.Port_ReceiveDate;
			dicFieldDatas[Storage.Fields.Port_Count] = obj.Port_Count;
			dicFieldDatas[Storage.Fields.Connect_ServerName] = obj.Connect_ServerName;
			dicFieldDatas[Storage.Fields.Connect_Usage] = obj.Connect_Usage;
			dicFieldDatas[Storage.Fields.Connect_ServiceLevel] = obj.Connect_ServiceLevel;
			dicFieldDatas[Storage.Fields.Connect_ModelName] = obj.Connect_ModelName;
			dicFieldDatas[Storage.Fields.Connect_OS] = obj.Connect_OS;
			dicFieldDatas[Storage.Fields.Connect_Cable] = obj.Connect_Cable;
			dicFieldDatas[Storage.Fields.Connect_GivenVolume] = obj.Connect_GivenVolume;
			dicFieldDatas[Storage.Fields.Connect_RealUseVolume] = obj.Connect_RealUseVolume;
			dicFieldDatas[Storage.Fields.Connect_EtcVolume] = obj.Connect_EtcVolume;
			dicFieldDatas[Storage.Fields.Connect_FreeVolume] = obj.Connect_FreeVolume;
			dicFieldDatas[Storage.Fields.Connect_MonthlyIncrease] = obj.Connect_MonthlyIncrease;
			dicFieldDatas[Storage.Fields.Connect_ConnectType] = obj.Connect_ConnectType;
			dicFieldDatas[Storage.Fields.Connect_ChannelPathCount] = obj.Connect_ChannelPathCount;
			dicFieldDatas[Storage.Fields.Connect_PathDualSolution] = obj.Connect_PathDualSolution;
			dicFieldDatas[Storage.Fields.Connect_NWEquip_1] = obj.Connect_NWEquip_1;
			dicFieldDatas[Storage.Fields.Connect_NWEquip_2] = obj.Connect_NWEquip_2;
			dicFieldDatas[Storage.Fields.Connect_NWEquip_3] = obj.Connect_NWEquip_3;
			dicFieldDatas[Storage.Fields.Connect_NWEquip_4] = obj.Connect_NWEquip_4;
			dicFieldDatas[Storage.Fields.Connect_SanSwitch_1] = obj.Connect_SanSwitch_1;
			dicFieldDatas[Storage.Fields.Connect_SanSwitch_2] = obj.Connect_SanSwitch_2;
			dicFieldDatas[Storage.Fields.Connect_SanSwitch_3] = obj.Connect_SanSwitch_3;
			dicFieldDatas[Storage.Fields.Connect_SanSwitch_4] = obj.Connect_SanSwitch_4;
			dicFieldDatas[Storage.Fields.Connect_SanSwitch_5] = obj.Connect_SanSwitch_5;
			dicFieldDatas[Storage.Fields.Connect_SanSwitch_6] = obj.Connect_SanSwitch_6;
			dicFieldDatas[Storage.Fields.Connect_SanSwitch_7] = obj.Connect_SanSwitch_7;
			dicFieldDatas[Storage.Fields.Connect_SanSwitch_8] = obj.Connect_SanSwitch_8;

			string strSQL = string.Format("Insert into {0} ({1}) values ({2})",
				Storage.TableName,
				GetFieldNames<Storage.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				Storage data = new Storage();
				data.DataCenterID = obj.DataCenterID;
				data.StorageID = obj.StorageID;
				data.Basic_Name = obj.Basic_Name;
				data.Basic_Status = obj.Basic_Status;
				data.Basic_RegDate = obj.Basic_RegDate;
				data.Basic_Usage = obj.Basic_Usage;
				data.Basic_ItemLevel = obj.Basic_ItemLevel;
				data.Basic_ReceiveDate = obj.Basic_ReceiveDate;
				data.Basic_ReceiveYears = obj.Basic_ReceiveYears;
				data.Basic_OwnerCompanyName = obj.Basic_OwnerCompanyName;
				data.Basic_OwnDepartment = obj.Basic_OwnDepartment;
				data.Basic_OperationDepartment = obj.Basic_OperationDepartment;
				data.Basic_SiteManager = obj.Basic_SiteManager;
				data.Basic_DiscardDate = obj.Basic_DiscardDate;
				data.Basic_OverUsedYear = obj.Basic_OverUsedYear;
				data.Basic_Memo = obj.Basic_Memo;
				data.Manage_SuperviseManager = obj.Manage_SuperviseManager;
				data.Manage_OperationManager = obj.Manage_OperationManager;
				data.Position_InstallRegion = obj.Position_InstallRegion;
				data.Position_RackDetailPosition = obj.Position_RackDetailPosition;
				data.Maintenance_ProvideCompanyName = obj.Maintenance_ProvideCompanyName;
				data.Maintenance_WarrantyMonth = obj.Maintenance_WarrantyMonth;
				data.Maintenance_WarrantyExpiredDate = obj.Maintenance_WarrantyExpiredDate;
				data.Maintenance_MaintenanceCompanyName = obj.Maintenance_MaintenanceCompanyName;
				data.Maintenance_EOSDate = obj.Maintenance_EOSDate;
				data.Maintenance_EOLDate = obj.Maintenance_EOLDate;
				data.Maintenance_EOSL = obj.Maintenance_EOSL;
				data.Maintenance_EOSLDate = obj.Maintenance_EOSLDate;
				data.Maintenance_MaintenanceContract = obj.Maintenance_MaintenanceContract;
				data.Maintenance_MaintenanceBeginDate = obj.Maintenance_MaintenanceBeginDate;
				data.Maintenance_MaintenanceEndDate = obj.Maintenance_MaintenanceEndDate;
				data.HW_ModelName = obj.HW_ModelName;
				data.HW_Company = obj.HW_Company;
				data.HW_CacheMemory = obj.HW_CacheMemory;
				data.HW_SerialNumber = obj.HW_SerialNumber;
				data.HW_DiskType = obj.HW_DiskType;
				data.HW_ControllerFirmwareVersion = obj.HW_ControllerFirmwareVersion;
				data.HW_TotalPhysicalVolume = obj.HW_TotalPhysicalVolume;
				data.HW_TotalUsableVolume = obj.HW_TotalUsableVolume;
				data.HW_LogicalVolumeGB = obj.HW_LogicalVolumeGB;
				data.HW_FreeVolumeGB = obj.HW_FreeVolumeGB;
				data.HW_MultiPath = obj.HW_MultiPath;
				data.HW_MultiPathPropertyName = obj.HW_MultiPathPropertyName;
				data.HW_AvailableVolume = obj.HW_AvailableVolume;
				data.HW_GivenVolumeGB = obj.HW_GivenVolumeGB;
				data.HW_GivenRate = obj.HW_GivenRate;
				data.Dual_DualUse = obj.Dual_DualUse;
				data.Dual_DualType = obj.Dual_DualType;
				data.Dual_BoxDualUse = obj.Dual_BoxDualUse;
				data.Dual_BoxDualDiskEquipmentName = obj.Dual_BoxDualDiskEquipmentName;
				data.Dual_BoxDualSolutionName = obj.Dual_BoxDualSolutionName;
				data.Dual_ControllerDualUse = obj.Dual_ControllerDualUse;
				data.Dual_PowerDualUse = obj.Dual_PowerDualUse;
				data.Dual_PDUDualUse = obj.Dual_PDUDualUse;
				data.Dual_RackPowerDualUse = obj.Dual_RackPowerDualUse;
				data.Dual_InternalCopySWUse = obj.Dual_InternalCopySWUse;
				data.Dual_StorageCopyUse = obj.Dual_StorageCopyUse;
				data.Dual_StorageCopyType = obj.Dual_StorageCopyType;
				data.Volume_RegDate = obj.Volume_RegDate;
				data.Volume_DiskType = obj.Volume_DiskType;
				data.Volume_EachDiskVolume = obj.Volume_EachDiskVolume;
				data.Volume_DiskCount = obj.Volume_DiskCount;
				data.Volume_PhysicalVolume = obj.Volume_PhysicalVolume;
				data.Volume_UsableVolume = obj.Volume_UsableVolume;
				data.Volume_RaidSystem = obj.Volume_RaidSystem;
				data.Extra_DiskType = obj.Extra_DiskType;
				data.Extra_DiskVolume = obj.Extra_DiskVolume;
				data.Extra_DiskCount = obj.Extra_DiskCount;
				data.IP_IPType = obj.IP_IPType;
				data.IP_IPAddress = obj.IP_IPAddress;
				data.IP_NetworkSpeed = obj.IP_NetworkSpeed;
				data.Port_TotalPortCount = obj.Port_TotalPortCount;
				data.Port_UsePortCount = obj.Port_UsePortCount;
				data.Port_LinkedSanSwitch = obj.Port_LinkedSanSwitch;
				data.Port_ReceiveDate = obj.Port_ReceiveDate;
				data.Port_Count = obj.Port_Count;
				data.Connect_ServerName = obj.Connect_ServerName;
				data.Connect_Usage = obj.Connect_Usage;
				data.Connect_ServiceLevel = obj.Connect_ServiceLevel;
				data.Connect_ModelName = obj.Connect_ModelName;
				data.Connect_OS = obj.Connect_OS;
				data.Connect_Cable = obj.Connect_Cable;
				data.Connect_GivenVolume = obj.Connect_GivenVolume;
				data.Connect_RealUseVolume = obj.Connect_RealUseVolume;
				data.Connect_EtcVolume = obj.Connect_EtcVolume;
				data.Connect_FreeVolume = obj.Connect_FreeVolume;
				data.Connect_MonthlyIncrease = obj.Connect_MonthlyIncrease;
				data.Connect_ConnectType = obj.Connect_ConnectType;
				data.Connect_ChannelPathCount = obj.Connect_ChannelPathCount;
				data.Connect_PathDualSolution = obj.Connect_PathDualSolution;
				data.Connect_NWEquip_1 = obj.Connect_NWEquip_1;
				data.Connect_NWEquip_2 = obj.Connect_NWEquip_2;
				data.Connect_NWEquip_3 = obj.Connect_NWEquip_3;
				data.Connect_NWEquip_4 = obj.Connect_NWEquip_4;
				data.Connect_SanSwitch_1 = obj.Connect_SanSwitch_1;
				data.Connect_SanSwitch_2 = obj.Connect_SanSwitch_2;
				data.Connect_SanSwitch_3 = obj.Connect_SanSwitch_3;
				data.Connect_SanSwitch_4 = obj.Connect_SanSwitch_4;
				data.Connect_SanSwitch_5 = obj.Connect_SanSwitch_5;
				data.Connect_SanSwitch_6 = obj.Connect_SanSwitch_6;
				data.Connect_SanSwitch_7 = obj.Connect_SanSwitch_7;
				data.Connect_SanSwitch_8 = obj.Connect_SanSwitch_8;
				return data;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public ItemServer CreateItemServer(ItemServer obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<ItemServer.Fields, object> dicFieldDatas = new Dictionary<ItemServer.Fields, object>();
			dicFieldDatas[ItemServer.Fields.DataCenterID] = obj.DataCenterID;
			dicFieldDatas[ItemServer.Fields.BoxName] = obj.BoxName;
			dicFieldDatas[ItemServer.Fields.BoxID] = obj.BoxID;
			dicFieldDatas[ItemServer.Fields.Basic_ServerCategory] = obj.Basic_ServerCategory;
			dicFieldDatas[ItemServer.Fields.Basic_SystemName] = obj.Basic_SystemName;
			dicFieldDatas[ItemServer.Fields.Basic_ServerName] = obj.Basic_ServerName;
			dicFieldDatas[ItemServer.Fields.Basic_ProductGroup] = obj.Basic_ProductGroup;
			dicFieldDatas[ItemServer.Fields.Basic_WorkSystemName] = obj.Basic_WorkSystemName;
			dicFieldDatas[ItemServer.Fields.Basic_ServerType] = obj.Basic_ServerType;
			dicFieldDatas[ItemServer.Fields.Basic_OperationType] = obj.Basic_OperationType;
			dicFieldDatas[ItemServer.Fields.Basic_ServerLevel] = obj.Basic_ServerLevel;
			dicFieldDatas[ItemServer.Fields.Basic_ServerLevelYear_1] = obj.Basic_ServerLevelYear_1;
			dicFieldDatas[ItemServer.Fields.Basic_ServerLevelYear] = obj.Basic_ServerLevelYear;
			dicFieldDatas[ItemServer.Fields.Basic_ReceiveDate] = obj.Basic_ReceiveDate;
			dicFieldDatas[ItemServer.Fields.Basic_RegDate] = obj.Basic_RegDate;
			dicFieldDatas[ItemServer.Fields.Basic_Status] = obj.Basic_Status;
			dicFieldDatas[ItemServer.Fields.Basic_Usage] = obj.Basic_Usage;
			dicFieldDatas[ItemServer.Fields.Basic_VirtualType] = obj.Basic_VirtualType;
			dicFieldDatas[ItemServer.Fields.Basic_DRType] = obj.Basic_DRType;
			dicFieldDatas[ItemServer.Fields.Basic_PropertyType] = obj.Basic_PropertyType;
			dicFieldDatas[ItemServer.Fields.Basic_OwnDepartment] = obj.Basic_OwnDepartment;
			dicFieldDatas[ItemServer.Fields.Basic_OperationDepartment] = obj.Basic_OperationDepartment;
			dicFieldDatas[ItemServer.Fields.Basic_GIMS] = obj.Basic_GIMS;
			dicFieldDatas[ItemServer.Fields.Manage_SuperviseManager] = obj.Manage_SuperviseManager;
			dicFieldDatas[ItemServer.Fields.Manage_OperationManager] = obj.Manage_OperationManager;
			dicFieldDatas[ItemServer.Fields.Manage_ServiceManager] = obj.Manage_ServiceManager;
			dicFieldDatas[ItemServer.Fields.Position_InstallRegion] = obj.Position_InstallRegion;
			dicFieldDatas[ItemServer.Fields.Position_Region] = obj.Position_Region;
			dicFieldDatas[ItemServer.Fields.Position_RackDetailPosition] = obj.Position_RackDetailPosition;
			dicFieldDatas[ItemServer.Fields.HW_OSType] = obj.HW_OSType;
			dicFieldDatas[ItemServer.Fields.HW_OS] = obj.HW_OS;
			dicFieldDatas[ItemServer.Fields.HW_OSVersion] = obj.HW_OSVersion;
			dicFieldDatas[ItemServer.Fields.HW_OSPatchLevel] = obj.HW_OSPatchLevel;
			dicFieldDatas[ItemServer.Fields.HW_OSInstallDate] = obj.HW_OSInstallDate;
			dicFieldDatas[ItemServer.Fields.HW_OSAccountID] = obj.HW_OSAccountID;
			dicFieldDatas[ItemServer.Fields.HW_KernelBit] = obj.HW_KernelBit;
			dicFieldDatas[ItemServer.Fields.HW_EOS] = obj.HW_EOS;
			dicFieldDatas[ItemServer.Fields.HW_EOSDate] = obj.HW_EOSDate;
			dicFieldDatas[ItemServer.Fields.HW_AccountTPAM] = obj.HW_AccountTPAM;
			dicFieldDatas[ItemServer.Fields.HW_LogicalCoreCount] = obj.HW_LogicalCoreCount;
			dicFieldDatas[ItemServer.Fields.HW_UsableDiskVolumeGB] = obj.HW_UsableDiskVolumeGB;
			dicFieldDatas[ItemServer.Fields.HW_LogicalMemoryVolumeMB] = obj.HW_LogicalMemoryVolumeMB;
			dicFieldDatas[ItemServer.Fields.HW_NetworkSpeed] = obj.HW_NetworkSpeed;
			dicFieldDatas[ItemServer.Fields.HW_ServerDual] = obj.HW_ServerDual;
			dicFieldDatas[ItemServer.Fields.Dual_DualType] = obj.Dual_DualType;
			dicFieldDatas[ItemServer.Fields.Dual_DualSolutionVM] = obj.Dual_DualSolutionVM;
			dicFieldDatas[ItemServer.Fields.Dual_DualSolutionService] = obj.Dual_DualSolutionService;
			dicFieldDatas[ItemServer.Fields.Dual_DualServerVM] = obj.Dual_DualServerVM;
			dicFieldDatas[ItemServer.Fields.SW_AccountManage] = obj.SW_AccountManage;
			dicFieldDatas[ItemServer.Fields.SW_ServerAccessInstall] = obj.SW_ServerAccessInstall;
			dicFieldDatas[ItemServer.Fields.SW_DCA] = obj.SW_DCA;
			dicFieldDatas[ItemServer.Fields.SW_VaccineInstall] = obj.SW_VaccineInstall;
			dicFieldDatas[ItemServer.Fields.SW_InstallVaccineName] = obj.SW_InstallVaccineName;
			dicFieldDatas[ItemServer.Fields.SW_InstallSWName] = obj.SW_InstallSWName;
			dicFieldDatas[ItemServer.Fields.NW_Zone] = obj.NW_Zone;
			dicFieldDatas[ItemServer.Fields.NW_ServiceIPAddr] = obj.NW_ServiceIPAddr;
			dicFieldDatas[ItemServer.Fields.NW_ServiceIPDual] = obj.NW_ServiceIPDual;
			dicFieldDatas[ItemServer.Fields.NW_HeartBeatIPAddr] = obj.NW_HeartBeatIPAddr;
			dicFieldDatas[ItemServer.Fields.NW_HeartBeatIPDual] = obj.NW_HeartBeatIPDual;
			dicFieldDatas[ItemServer.Fields.NW_BackupIPAddr] = obj.NW_BackupIPAddr;
			dicFieldDatas[ItemServer.Fields.NW_BackIPDual] = obj.NW_BackIPDual;
			dicFieldDatas[ItemServer.Fields.NW_ManageIPAddr] = obj.NW_ManageIPAddr;
			dicFieldDatas[ItemServer.Fields.NW_ManageIPDual] = obj.NW_ManageIPDual;
			dicFieldDatas[ItemServer.Fields.NW_Etc1IPAddr] = obj.NW_Etc1IPAddr;
			dicFieldDatas[ItemServer.Fields.NW_Etc1IPAddrDual] = obj.NW_Etc1IPAddrDual;
			dicFieldDatas[ItemServer.Fields.NW_Etc2IPAddr] = obj.NW_Etc2IPAddr;
			dicFieldDatas[ItemServer.Fields.NW_Etc2IPDual] = obj.NW_Etc2IPDual;
			dicFieldDatas[ItemServer.Fields.Backup_InternalOSBackup] = obj.Backup_InternalOSBackup;
			dicFieldDatas[ItemServer.Fields.Backup_InternalOSBackupSW] = obj.Backup_InternalOSBackupSW;
			dicFieldDatas[ItemServer.Fields.Backup_ExternalBackupRun] = obj.Backup_ExternalBackupRun;
			dicFieldDatas[ItemServer.Fields.Backup_ExternalBackupSWType] = obj.Backup_ExternalBackupSWType;
			dicFieldDatas[ItemServer.Fields.Backup_ExternalRemote] = obj.Backup_ExternalRemote;
			dicFieldDatas[ItemServer.Fields.Backup_ExternalRemotePosition] = obj.Backup_ExternalRemotePosition;

			string strSQL = string.Format("Insert into {0} ({1}) values ({2})",
				ItemServer.TableName,
				GetFieldNames<ItemServer.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				ItemServer data = new ItemServer();
				data.DataCenterID = obj.DataCenterID;
				data.BoxName = obj.BoxName;
				data.BoxID = obj.BoxID;
				data.Basic_ServerCategory = obj.Basic_ServerCategory;
				data.Basic_SystemName = obj.Basic_SystemName;
				data.Basic_ServerName = obj.Basic_ServerName;
				data.Basic_ProductGroup = obj.Basic_ProductGroup;
				data.Basic_WorkSystemName = obj.Basic_WorkSystemName;
				data.Basic_ServerType = obj.Basic_ServerType;
				data.Basic_OperationType = obj.Basic_OperationType;
				data.Basic_ServerLevel = obj.Basic_ServerLevel;
				data.Basic_ServerLevelYear_1 = obj.Basic_ServerLevelYear_1;
				data.Basic_ServerLevelYear = obj.Basic_ServerLevelYear;
				data.Basic_ReceiveDate = obj.Basic_ReceiveDate;
				data.Basic_RegDate = obj.Basic_RegDate;
				data.Basic_Status = obj.Basic_Status;
				data.Basic_Usage = obj.Basic_Usage;
				data.Basic_VirtualType = obj.Basic_VirtualType;
				data.Basic_DRType = obj.Basic_DRType;
				data.Basic_PropertyType = obj.Basic_PropertyType;
				data.Basic_OwnDepartment = obj.Basic_OwnDepartment;
				data.Basic_OperationDepartment = obj.Basic_OperationDepartment;
				data.Basic_GIMS = obj.Basic_GIMS;
				data.Manage_SuperviseManager = obj.Manage_SuperviseManager;
				data.Manage_OperationManager = obj.Manage_OperationManager;
				data.Manage_ServiceManager = obj.Manage_ServiceManager;
				data.Position_InstallRegion = obj.Position_InstallRegion;
				data.Position_Region = obj.Position_Region;
				data.Position_RackDetailPosition = obj.Position_RackDetailPosition;
				data.HW_OSType = obj.HW_OSType;
				data.HW_OS = obj.HW_OS;
				data.HW_OSVersion = obj.HW_OSVersion;
				data.HW_OSPatchLevel = obj.HW_OSPatchLevel;
				data.HW_OSInstallDate = obj.HW_OSInstallDate;
				data.HW_OSAccountID = obj.HW_OSAccountID;
				data.HW_KernelBit = obj.HW_KernelBit;
				data.HW_EOS = obj.HW_EOS;
				data.HW_EOSDate = obj.HW_EOSDate;
				data.HW_AccountTPAM = obj.HW_AccountTPAM;
				data.HW_LogicalCoreCount = obj.HW_LogicalCoreCount;
				data.HW_UsableDiskVolumeGB = obj.HW_UsableDiskVolumeGB;
				data.HW_LogicalMemoryVolumeMB = obj.HW_LogicalMemoryVolumeMB;
				data.HW_NetworkSpeed = obj.HW_NetworkSpeed;
				data.HW_ServerDual = obj.HW_ServerDual;
				data.Dual_DualType = obj.Dual_DualType;
				data.Dual_DualSolutionVM = obj.Dual_DualSolutionVM;
				data.Dual_DualSolutionService = obj.Dual_DualSolutionService;
				data.Dual_DualServerVM = obj.Dual_DualServerVM;
				data.SW_AccountManage = obj.SW_AccountManage;
				data.SW_ServerAccessInstall = obj.SW_ServerAccessInstall;
				data.SW_DCA = obj.SW_DCA;
				data.SW_VaccineInstall = obj.SW_VaccineInstall;
				data.SW_InstallVaccineName = obj.SW_InstallVaccineName;
				data.SW_InstallSWName = obj.SW_InstallSWName;
				data.NW_Zone = obj.NW_Zone;
				data.NW_ServiceIPAddr = obj.NW_ServiceIPAddr;
				data.NW_ServiceIPDual = obj.NW_ServiceIPDual;
				data.NW_HeartBeatIPAddr = obj.NW_HeartBeatIPAddr;
				data.NW_HeartBeatIPDual = obj.NW_HeartBeatIPDual;
				data.NW_BackupIPAddr = obj.NW_BackupIPAddr;
				data.NW_BackIPDual = obj.NW_BackIPDual;
				data.NW_ManageIPAddr = obj.NW_ManageIPAddr;
				data.NW_ManageIPDual = obj.NW_ManageIPDual;
				data.NW_Etc1IPAddr = obj.NW_Etc1IPAddr;
				data.NW_Etc1IPAddrDual = obj.NW_Etc1IPAddrDual;
				data.NW_Etc2IPAddr = obj.NW_Etc2IPAddr;
				data.NW_Etc2IPDual = obj.NW_Etc2IPDual;
				data.Backup_InternalOSBackup = obj.Backup_InternalOSBackup;
				data.Backup_InternalOSBackupSW = obj.Backup_InternalOSBackupSW;
				data.Backup_ExternalBackupRun = obj.Backup_ExternalBackupRun;
				data.Backup_ExternalBackupSWType = obj.Backup_ExternalBackupSWType;
				data.Backup_ExternalRemote = obj.Backup_ExternalRemote;
				data.Backup_ExternalRemotePosition = obj.Backup_ExternalRemotePosition;
				return data;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public Nation CreateNation(Nation obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<Nation.Fields, object> dicFieldDatas = new Dictionary<Nation.Fields, object>();
			dicFieldDatas[Nation.Fields.Name] = obj.Name;
			dicFieldDatas[Nation.Fields.EngName] = obj.EngName;
			dicFieldDatas[Nation.Fields.Tag1] = obj.Tag1;
			dicFieldDatas[Nation.Fields.Tag2] = obj.Tag2;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ID) FROM {0} C), 0) + 1, {2})",
				Nation.TableName,
				GetFieldNames<Nation.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", Nation.GetFieldName(Nation.Fields.ID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<Nation> datas = m_dataManager.GetSelectManager().SelectNations(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameNation(obj, datas[0]))
					return datas[0];

				return GetNation(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameNation(Nation oldObject, Nation newObject)
		{
			if (oldObject.Name == newObject.Name &&
				oldObject.EngName == newObject.EngName &&
				oldObject.Tag1 == newObject.Tag1 &&
				oldObject.Tag2 == newObject.Tag2)
				return true;

			return false;
		}

		private Nation GetNation(Nation obj, int id, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", Nation.GetFieldName(Nation.Fields.ID, out isNullable), id);

			List<Nation> datas = m_dataManager.GetSelectManager().SelectNations(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (Nation data in datas)
			{
				if (IsSameNation(data, obj))
					return data;

				if (data.ID < id)
					id = data.ID;
			}

			if (nCount < nLimit)
				return GetNation(obj, id, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(Nation.TableName);
			return null;
		}

		public Rack CreateRack(Rack obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<Rack.Fields, object> dicFieldDatas = new Dictionary<Rack.Fields, object>();
			dicFieldDatas[Rack.Fields.Name] = obj.Name;
			dicFieldDatas[Rack.Fields.CenterID] = obj.CenterID;
			dicFieldDatas[Rack.Fields.RackGroupID] = obj.RackGroupID;
			dicFieldDatas[Rack.Fields.RackTypeID] = obj.RackTypeID;
			dicFieldDatas[Rack.Fields.Rotation] = obj.Rotation;
			dicFieldDatas[Rack.Fields.X] = obj.X;
			dicFieldDatas[Rack.Fields.Y] = obj.Y;
			dicFieldDatas[Rack.Fields.Z] = obj.Z;
			dicFieldDatas[Rack.Fields.RegDate] = obj.RegDate;
			dicFieldDatas[Rack.Fields.ChangeDate] = obj.ChangeDate;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ID) FROM {0} C), 0) + 1, {2})",
				Rack.TableName,
				GetFieldNames<Rack.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", Rack.GetFieldName(Rack.Fields.ID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<Rack> datas = m_dataManager.GetSelectManager().SelectRacks(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameRack(obj, datas[0]))
					return datas[0];

				return GetRack(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameRack(Rack oldObject, Rack newObject)
		{
			if (oldObject.Name == newObject.Name &&
				oldObject.CenterID == newObject.CenterID &&
				oldObject.RackGroupID == newObject.RackGroupID &&
				oldObject.RackTypeID == newObject.RackTypeID &&
				oldObject.Rotation == newObject.Rotation &&
				oldObject.X == newObject.X &&
				oldObject.Y == newObject.Y &&
				oldObject.Z == newObject.Z &&
				IsSameTime2(oldObject.RegDate, newObject.RegDate) &&
				IsSameTime(oldObject.ChangeDate, newObject.ChangeDate))
				return true;

			return false;
		}

		private Rack GetRack(Rack obj, int id, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", Rack.GetFieldName(Rack.Fields.ID, out isNullable), id);

			List<Rack> datas = m_dataManager.GetSelectManager().SelectRacks(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (Rack data in datas)
			{
				if (IsSameRack(data, obj))
					return data;

				if (data.ID < id)
					id = data.ID;
			}

			if (nCount < nLimit)
				return GetRack(obj, id, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(Rack.TableName);
			return null;
		}

		public RackType CreateRackType(RackType obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<RackType.Fields, object> dicFieldDatas = new Dictionary<RackType.Fields, object>();
			dicFieldDatas[RackType.Fields.CompanyID] = obj.CompanyID;
			dicFieldDatas[RackType.Fields.ModelName] = obj.ModelName;
			dicFieldDatas[RackType.Fields.Height] = obj.Height;
			dicFieldDatas[RackType.Fields.Width] = obj.Width;
			dicFieldDatas[RackType.Fields.Depth] = obj.Depth;
			dicFieldDatas[RackType.Fields.Unit] = obj.Unit;
			dicFieldDatas[RackType.Fields.Type] = obj.Type;
			dicFieldDatas[RackType.Fields.ColorName] = obj.ColorName;
			dicFieldDatas[RackType.Fields.ColorEngName] = obj.ColorEngName;
			dicFieldDatas[RackType.Fields.ImageUrl] = obj.ImageUrl;
			dicFieldDatas[RackType.Fields.GlbUrl] = obj.GlbUrl;
			dicFieldDatas[RackType.Fields.FbxUrl] = obj.FbxUrl;
			dicFieldDatas[RackType.Fields.Memo] = obj.Memo;
			dicFieldDatas[RackType.Fields.RegDate] = obj.RegDate;
			dicFieldDatas[RackType.Fields.ChangeDate] = obj.ChangeDate;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ID) FROM {0} C), 0) + 1, {2})",
				RackType.TableName,
				GetFieldNames<RackType.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", RackType.GetFieldName(RackType.Fields.ID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<RackType> datas = m_dataManager.GetSelectManager().SelectRackTypes(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameRackType(obj, datas[0]))
					return datas[0];

				return GetRackType(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameRackType(RackType oldObject, RackType newObject)
		{
			if (oldObject.CompanyID == newObject.CompanyID &&
				oldObject.ModelName == newObject.ModelName &&
				oldObject.Height == newObject.Height &&
				oldObject.Width == newObject.Width &&
				oldObject.Depth == newObject.Depth &&
				oldObject.Unit == newObject.Unit &&
				oldObject.Type == newObject.Type &&
				oldObject.ColorName == newObject.ColorName &&
				oldObject.ColorEngName == newObject.ColorEngName &&
				oldObject.ImageUrl == newObject.ImageUrl &&
				oldObject.GlbUrl == newObject.GlbUrl &&
				oldObject.FbxUrl == newObject.FbxUrl &&
				oldObject.Memo == newObject.Memo &&
				IsSameTime2(oldObject.RegDate, newObject.RegDate) &&
				IsSameTime(oldObject.ChangeDate, newObject.ChangeDate))
				return true;

			return false;
		}

		private RackType GetRackType(RackType obj, int id, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", RackType.GetFieldName(RackType.Fields.ID, out isNullable), id);

			List<RackType> datas = m_dataManager.GetSelectManager().SelectRackTypes(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (RackType data in datas)
			{
				if (IsSameRackType(data, obj))
					return data;

				if (data.ID < id)
					id = data.ID;
			}

			if (nCount < nLimit)
				return GetRackType(obj, id, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(RackType.TableName);
			return null;
		}

		public RackGroup CreateRackGroup(RackGroup obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<RackGroup.Fields, object> dicFieldDatas = new Dictionary<RackGroup.Fields, object>();
			dicFieldDatas[RackGroup.Fields.CenterID] = obj.CenterID;
			dicFieldDatas[RackGroup.Fields.GroupName] = obj.GroupName;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ID) FROM {0} C), 0) + 1, {2})",
				RackGroup.TableName,
				GetFieldNames<RackGroup.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", RackGroup.GetFieldName(RackGroup.Fields.ID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<RackGroup> datas = m_dataManager.GetSelectManager().SelectRackGroups(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameRackGroup(obj, datas[0]))
					return datas[0];

				return GetRackGroup(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameRackGroup(RackGroup oldObject, RackGroup newObject)
		{
			if (oldObject.CenterID == newObject.CenterID &&
				oldObject.GroupName == newObject.GroupName)
				return true;

			return false;
		}

		private RackGroup GetRackGroup(RackGroup obj, int id, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", RackGroup.GetFieldName(RackGroup.Fields.ID, out isNullable), id);

			List<RackGroup> datas = m_dataManager.GetSelectManager().SelectRackGroups(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (RackGroup data in datas)
			{
				if (IsSameRackGroup(data, obj))
					return data;

				if (data.ID < id)
					id = data.ID;
			}

			if (nCount < nLimit)
				return GetRackGroup(obj, id, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(RackGroup.TableName);
			return null;
		}

		public Model.Site.Site CreateSite(Model.Site.Site obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<Model.Site.Site.Fields, object> dicFieldDatas = new Dictionary<Model.Site.Site.Fields, object>();
			dicFieldDatas[Model.Site.Site.Fields.Name] = obj.Name;
			dicFieldDatas[Model.Site.Site.Fields.EngName] = obj.EngName;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ID) FROM {0} C), 0) + 1, {2})",
				Model.Site.Site.TableName,
				GetFieldNames<Model.Site.Site.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", Model.Site.Site.GetFieldName(Model.Site.Site.Fields.ID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<Model.Site.Site> datas = m_dataManager.GetSelectManager().SelectSites(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameSite(obj, datas[0]))
					return datas[0];

				return GetSite(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public Model.Site.Data CreateSiteData(Model.Site.Data obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<Model.Site.Data.Fields, object> dicFieldDatas = new Dictionary<Model.Site.Data.Fields, object>();
			dicFieldDatas[Model.Site.Data.Fields.SiteID] = obj.SiteID;
			dicFieldDatas[Model.Site.Data.Fields.Address] = obj.Address;
			dicFieldDatas[Model.Site.Data.Fields.ManagerTeam] = obj.ManagerTeam;
			dicFieldDatas[Model.Site.Data.Fields.Manager] = obj.Manager;
			dicFieldDatas[Model.Site.Data.Fields.ServiceBeginDate] = obj.ServiceBeginDate;
			dicFieldDatas[Model.Site.Data.Fields.ServiceEndDate] = obj.ServiceEndDate;
			dicFieldDatas[Model.Site.Data.Fields.LicenseValidation] = obj.LicenseValidation;

			string strSQL = string.Format("Insert into {0} ({1}) values ({2})",
				Model.Site.Data.TableName,
				GetFieldNames<Model.Site.Data.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				Model.Site.Data siteData = new Model.Site.Data();
				siteData.SiteID = obj.SiteID;
				siteData.Address = obj.Address;
				siteData.ManagerTeam = obj.ManagerTeam;
                siteData.Manager = obj.Manager;
				siteData.ServiceBeginDate = obj.ServiceBeginDate;
				siteData.ServiceEndDate = obj.ServiceEndDate;
				siteData.LicenseValidation = obj.LicenseValidation;
				return siteData;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameSite(Model.Site.Site oldObject, Model.Site.Site newObject)
		{
			if (oldObject.Name == newObject.Name &&
				oldObject.EngName == newObject.EngName)
				return true;

			return false;
		}

		private Model.Site.Site GetSite(Model.Site.Site obj, int id, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", Model.Site.Site.GetFieldName(Model.Site.Site.Fields.ID, out isNullable), id);

			List<Model.Site.Site> datas = m_dataManager.GetSelectManager().SelectSites(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (Model.Site.Site data in datas)
			{
				if (IsSameSite(data, obj))
					return data;

				if (data.ID < id)
					id = data.ID;
			}

			if (nCount < nLimit)
				return GetSite(obj, id, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(Model.Site.Site.TableName);
			return null;
		}

		public Model.Site.Option CreateSiteOption(Model.Site.Option obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<Model.Site.Option.Fields, object> dicFieldDatas = new Dictionary<Model.Site.Option.Fields, object>();
			dicFieldDatas[Model.Site.Option.Fields.PropertyName] = obj.PropertyName;
			dicFieldDatas[Model.Site.Option.Fields.PropertyValue] = obj.PropertyValue;
			dicFieldDatas[Model.Site.Option.Fields.Description] = obj.Description;

			string strSQL = string.Format("Insert into {0} ({1}) values ({2})",
				Model.Site.Option.TableName,
				GetFieldNames<Model.Site.Option.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				Model.Site.Option option = new Model.Site.Option();
				option.PropertyName = obj.PropertyName;
				option.PropertyValue = obj.PropertyValue;
				option.Description = obj.Description;
				return option;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public Facility CreateFacility(Facility obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<Facility.Fields, object> dicFieldDatas = new Dictionary<Facility.Fields, object>();
			dicFieldDatas[Facility.Fields.FacilityTypeID] = obj.FacilityTypeID;
			dicFieldDatas[Facility.Fields.DataCenterID] = obj.DataCenterID;
			dicFieldDatas[Facility.Fields.RegDate] = obj.RegDate;
			dicFieldDatas[Facility.Fields.ChangeDate] = obj.ChangeDate;
			dicFieldDatas[Facility.Fields.X] = obj.X;
			dicFieldDatas[Facility.Fields.Y] = obj.Y;
			dicFieldDatas[Facility.Fields.Z] = obj.Z;
			dicFieldDatas[Facility.Fields.Rotation] = obj.Rotation;

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
				List<Facility> datas = m_dataManager.GetSelectManager().SelectFacilities(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameFacility(obj, datas[0]))
					return datas[0];

				return GetFacility(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameFacility(Facility oldObject, Facility newObject)
		{
			if (oldObject.FacilityTypeID == newObject.FacilityTypeID &&
				oldObject.DataCenterID == newObject.DataCenterID &&
				IsSameTime(oldObject.RegDate, newObject.RegDate) &&
				IsSameTime(oldObject.ChangeDate, newObject.ChangeDate) &&
				oldObject.X == newObject.X &&
				oldObject.Y == newObject.Y &&
				oldObject.Z == newObject.Z &&
				oldObject.Rotation == newObject.Rotation)
				return true;

			return false;
		}

		private Facility GetFacility(Facility obj, int id, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", Facility.GetFieldName(Facility.Fields.ID, out isNullable), id);

			List<Facility> datas = m_dataManager.GetSelectManager().SelectFacilities(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (Facility data in datas)
			{
				if (IsSameFacility(data, obj))
					return data;

				if (data.ID < id)
					id = data.ID;
			}

			if (nCount < nLimit)
				return GetFacility(obj, id, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(Facility.TableName);
			return null;
		}

		public FacilityType CreateFacilityType(FacilityType obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<FacilityType.Fields, object> dicFieldDatas = new Dictionary<FacilityType.Fields, object>();
			dicFieldDatas[FacilityType.Fields.EquipmentTypeID] = obj.EquipmentTypeID;
			dicFieldDatas[FacilityType.Fields.ModelName] = obj.ModelName;
			dicFieldDatas[FacilityType.Fields.CompanyID] = obj.CompanyID;
			dicFieldDatas[FacilityType.Fields.Width] = obj.Width;
			dicFieldDatas[FacilityType.Fields.Depth] = obj.Depth;
			dicFieldDatas[FacilityType.Fields.Height] = obj.Height;
			dicFieldDatas[FacilityType.Fields.UnitOfLength] = obj.UnitOfLength;
			dicFieldDatas[FacilityType.Fields.Color] = obj.Color;
			dicFieldDatas[FacilityType.Fields.ImageUrl] = obj.ImageUrl;
			dicFieldDatas[FacilityType.Fields.GlbUrl] = obj.GlbUrl;
			dicFieldDatas[FacilityType.Fields.FbxUrl] = obj.FbxUrl;
			dicFieldDatas[FacilityType.Fields.ClassName] = obj.ClassName;
			dicFieldDatas[FacilityType.Fields.Memo] = obj.Memo;
			dicFieldDatas[FacilityType.Fields.RegDate] = obj.RegDate;
			dicFieldDatas[FacilityType.Fields.ChangeDate] = obj.ChangeDate;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ID) FROM {0} C), 0) + 1, {2})",
				FacilityType.TableName,
				GetFieldNames<FacilityType.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", FacilityType.GetFieldName(FacilityType.Fields.ID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<FacilityType> datas = m_dataManager.GetSelectManager().SelectFacilityTypes(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameFacilityType(obj, datas[0]))
					return datas[0];

				return GetFacilityType(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameFacilityType(FacilityType oldObject, FacilityType newObject)
		{
			if (oldObject.EquipmentTypeID == newObject.EquipmentTypeID &&
				oldObject.ModelName == newObject.ModelName &&
				oldObject.CompanyID == newObject.CompanyID &&
				oldObject.Width == newObject.Width &&
				oldObject.Depth == newObject.Depth &&
				oldObject.Height == newObject.Height &&
				oldObject.UnitOfLength == newObject.UnitOfLength &&
				oldObject.Color == newObject.Color &&
				oldObject.ImageUrl == newObject.ImageUrl &&
				oldObject.GlbUrl == newObject.GlbUrl &&
				oldObject.FbxUrl == newObject.FbxUrl &&
				oldObject.ClassName == newObject.ClassName &&
				oldObject.Memo == newObject.Memo &&
				IsSameTime2(oldObject.RegDate, newObject.RegDate) &&
				IsSameTime(oldObject.ChangeDate, newObject.ChangeDate))
				return true;

			return false;
		}

		private FacilityType GetFacilityType(FacilityType obj, int id, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", FacilityType.GetFieldName(FacilityType.Fields.ID, out isNullable), id);

			List<FacilityType> datas = m_dataManager.GetSelectManager().SelectFacilityTypes(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (FacilityType data in datas)
			{
				if (IsSameFacilityType(data, obj))
					return data;

				if (data.ID < id)
					id = data.ID;
			}

			if (nCount < nLimit)
				return GetFacilityType(obj, id, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(FacilityType.TableName);
			return null;
		}

		public Sensor CreateSensor(Sensor obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<Sensor.Fields, object> dicFieldDatas = new Dictionary<Sensor.Fields, object>();
			dicFieldDatas[Sensor.Fields.Name] = obj.Name;
			dicFieldDatas[Sensor.Fields.SensorTypeID] = obj.SensorTypeID;
			dicFieldDatas[Sensor.Fields.CenterID] = obj.CenterID;
			dicFieldDatas[Sensor.Fields.RegDate] = obj.RegDate;
			dicFieldDatas[Sensor.Fields.ChangeDate] = obj.ChangeDate;
			dicFieldDatas[Sensor.Fields.X] = obj.X;
			dicFieldDatas[Sensor.Fields.Y] = obj.Y;
			dicFieldDatas[Sensor.Fields.Z] = obj.Z;
			dicFieldDatas[Sensor.Fields.Description] = obj.Description;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ID) FROM {0} C), 0) + 1, {2})",
				Sensor.TableName,
				GetFieldNames<Sensor.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", Sensor.GetFieldName(Sensor.Fields.ID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<Sensor> datas = m_dataManager.GetSelectManager().SelectSensors(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameSensor(obj, datas[0]))
					return datas[0];

				return GetSensor(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameSensor(Sensor oldObject, Sensor newObject)
		{
			if (oldObject.Name == newObject.Name &&
				oldObject.SensorTypeID == newObject.SensorTypeID &&
				oldObject.CenterID == newObject.CenterID &&
				IsSameTime2(oldObject.RegDate, newObject.RegDate) &&
				IsSameTime(oldObject.ChangeDate, newObject.ChangeDate) &&
				oldObject.X == newObject.X &&
				oldObject.Y == newObject.Y &&
				oldObject.Z == newObject.Z &&
				oldObject.Description == newObject.Description)
				return true;

			return false;
		}

		private Sensor GetSensor(Sensor obj, int id, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", Sensor.GetFieldName(Sensor.Fields.ID, out isNullable), id);

			List<Sensor> datas = m_dataManager.GetSelectManager().SelectSensors(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (Sensor data in datas)
			{
				if (IsSameSensor(data, obj))
					return data;

				if (data.ID < id)
					id = data.ID;
			}

			if (nCount < nLimit)
				return GetSensor(obj, id, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(Sensor.TableName);
			return null;
		}

		public History CreateSensorHistory(History obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<History.Fields, object> dicFieldDatas = new Dictionary<History.Fields, object>();
			dicFieldDatas[History.Fields.SiteID] = obj.SiteID;
			dicFieldDatas[History.Fields.SiteName] = obj.SiteName;
			dicFieldDatas[History.Fields.CenterName] = obj.CenterName;
			dicFieldDatas[History.Fields.SensorType] = obj.SensorType;
			dicFieldDatas[History.Fields.Status] = obj.Status;
			dicFieldDatas[History.Fields.Data] = obj.Data;
			dicFieldDatas[History.Fields.Unit] = obj.Unit;
			dicFieldDatas[History.Fields.Description] = obj.Description;
			dicFieldDatas[History.Fields.TimeStamp] = obj.TimeStamp;
			dicFieldDatas[History.Fields.CenterID] = obj.CenterID;
			dicFieldDatas[History.Fields.DateStamp] = obj.DateStamp;
			dicFieldDatas[History.Fields.SensorName] = obj.SensorName;

			string strSQL = string.Format("Insert into {0} ({1}) values ({2})",
				History.TableName,
				GetFieldNames<History.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				History history = new Model.Sensor.History();

				history.TimeStamp = obj.TimeStamp;
				history.Data = obj.Data;
				history.SiteID = obj.SiteID;
				history.CenterID = obj.CenterID;
				history.SiteName = obj.SiteName;
				history.CenterName = obj.CenterName;
				history.SensorType = obj.SensorType;
				history.Status = obj.Status;
				history.Unit = obj.Unit;
				history.Description = obj.Description;
				history.DateStamp = obj.DateStamp;
				history.SensorName = obj.SensorName;

				return history;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public SensorType CreateSensorType(SensorType obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<SensorType.Fields, object> dicFieldDatas = new Dictionary<SensorType.Fields, object>();
			dicFieldDatas[SensorType.Fields.Name] = obj.Name;
			dicFieldDatas[SensorType.Fields.EngName] = obj.EngName;
			dicFieldDatas[SensorType.Fields.Code] = obj.Code;
			dicFieldDatas[SensorType.Fields.RangeMax] = obj.RangeMax;
			dicFieldDatas[SensorType.Fields.RangeMin] = obj.RangeMin;
			dicFieldDatas[SensorType.Fields.Unit] = obj.Unit;
			dicFieldDatas[SensorType.Fields.ImageUrl] = obj.ImageUrl;
			dicFieldDatas[SensorType.Fields.AbnormalImageUrl] = obj.AbnormalImageUrl;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ID) FROM {0} C), 0) + 1, {2})",
				SensorType.TableName,
				GetFieldNames<SensorType.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", SensorType.GetFieldName(SensorType.Fields.ID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<SensorType> datas = m_dataManager.GetSelectManager().SelectSensorTypes(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameSensorType(obj, datas[0]))
					return datas[0];

				return GetSensorType(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameSensorType(SensorType oldObject, SensorType newObject)
		{
			if (oldObject.Name == newObject.Name &&
				oldObject.EngName == newObject.EngName &&
				oldObject.Code == newObject.Code &&
				oldObject.RangeMax == newObject.RangeMax &&
				oldObject.RangeMin == newObject.RangeMin &&
				oldObject.Unit == newObject.Unit &&
				oldObject.ImageUrl == newObject.ImageUrl &&
				oldObject.AbnormalImageUrl == newObject.AbnormalImageUrl)
				return true;

			return false;
		}

		private SensorType GetSensorType(SensorType obj, int id, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", SensorType.GetFieldName(SensorType.Fields.ID, out isNullable), id);

			List<SensorType> datas = m_dataManager.GetSelectManager().SelectSensorTypes(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (SensorType data in datas)
			{
				if (IsSameSensorType(data, obj))
					return data;

				if (data.ID < id)
					id = data.ID;
			}

			if (nCount < nLimit)
				return GetSensorType(obj, id, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(SensorType.TableName);
			return null;
		}

		public ChangeBasic CreateWorkChangeBasic(ChangeBasic obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<ChangeBasic.Fields, object> dicFieldDatas = new Dictionary<ChangeBasic.Fields, object>();
			dicFieldDatas[ChangeBasic.Fields.Status] = obj.Status;
			dicFieldDatas[ChangeBasic.Fields.Title] = obj.Title;
			dicFieldDatas[ChangeBasic.Fields.ChangeType] = obj.ChangeType;
			dicFieldDatas[ChangeBasic.Fields.ChangeClass] = obj.ChangeClass;
			dicFieldDatas[ChangeBasic.Fields.MainWorker] = obj.MainWorker;
			dicFieldDatas[ChangeBasic.Fields.ChangeWorkResult] = obj.ChangeWorkResult;
			dicFieldDatas[ChangeBasic.Fields.PlanBeginTime] = obj.PlanBeginTime;
			dicFieldDatas[ChangeBasic.Fields.PlanEndTime] = obj.PlanEndTime;
			dicFieldDatas[ChangeBasic.Fields.WorkBeginTime] = obj.WorkBeginTime;
			dicFieldDatas[ChangeBasic.Fields.WorkEndTime] = obj.WorkEndTime;
			dicFieldDatas[ChangeBasic.Fields.LinkedChangedWork] = obj.LinkedChangedWork;
			dicFieldDatas[ChangeBasic.Fields.Priority] = obj.Priority;
			dicFieldDatas[ChangeBasic.Fields.Register] = obj.Register;
			dicFieldDatas[ChangeBasic.Fields.RegTime] = obj.RegTime;
			dicFieldDatas[ChangeBasic.Fields.WorkData] = obj.WorkData;
			dicFieldDatas[ChangeBasic.Fields.DataCenterID] = obj.DataCenterID;
			dicFieldDatas[ChangeBasic.Fields.WorkID] = obj.WorkID;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ID) FROM {0} C), 0) + 1, {2})",
				ChangeBasic.TableName,
				GetFieldNames<ChangeBasic.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", ChangeBasic.GetFieldName(ChangeBasic.Fields.ID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<ChangeBasic> datas = m_dataManager.GetSelectManager().SelectWorkChangeBasics(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameWorkChangeBasic(obj, datas[0]))
					return datas[0];

				return GetWorkChangeBasic(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameWorkChangeBasic(ChangeBasic oldObject, ChangeBasic newObject)
		{
			if (oldObject.WorkID == newObject.WorkID)
				return true;

			return false;
		}

		private ChangeBasic GetWorkChangeBasic(ChangeBasic obj, int id, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", ChangeBasic.GetFieldName(ChangeBasic.Fields.ID, out isNullable), id);

			List<ChangeBasic> datas = m_dataManager.GetSelectManager().SelectWorkChangeBasics(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (ChangeBasic data in datas)
			{
				if (IsSameWorkChangeBasic(data, obj))
					return data;

				if (data.ID < id)
					id = data.ID;
			}

			if (nCount < nLimit)
				return GetWorkChangeBasic(obj, id, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(ChangeBasic.TableName);
			return null;
		}

		public ChangeTarget CreateWorkChangeTarget(ChangeTarget obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<ChangeTarget.Fields, object> dicFieldDatas = new Dictionary<ChangeTarget.Fields, object>();
			dicFieldDatas[ChangeTarget.Fields.WorkID] = obj.WorkID;
			dicFieldDatas[ChangeTarget.Fields.DataCenterID] = obj.DataCenterID;
			dicFieldDatas[ChangeTarget.Fields.PropertyName] = obj.PropertyName;
			dicFieldDatas[ChangeTarget.Fields.EquipmentTypeID] = obj.EquipmentTypeID;
			dicFieldDatas[ChangeTarget.Fields.ServicePause] = obj.ServicePause;
			dicFieldDatas[ChangeTarget.Fields.ServicePausePlanHour] = obj.ServicePausePlanHour;
			dicFieldDatas[ChangeTarget.Fields.Change] = obj.Change;
			dicFieldDatas[ChangeTarget.Fields.ChangeData] = obj.ChangeData;
			dicFieldDatas[ChangeTarget.Fields.ReviewResult] = obj.ReviewResult;
			dicFieldDatas[ChangeTarget.Fields.Reviewer] = obj.Reviewer;
			dicFieldDatas[ChangeTarget.Fields.ReviewDate] = obj.ReviewDate;
			dicFieldDatas[ChangeTarget.Fields.ChangeResult] = obj.ChangeResult;
			dicFieldDatas[ChangeTarget.Fields.ChangeDetail] = obj.ChangeDetail;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ID) FROM {0} C), 0) + 1, {2})",
				ChangeTarget.TableName,
				GetFieldNames<ChangeTarget.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", ChangeTarget.GetFieldName(ChangeTarget.Fields.ID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<ChangeTarget> datas = m_dataManager.GetSelectManager().SelectWorkChangeTargets(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameWorkChangeTarget(obj, datas[0]))
					return datas[0];

				return GetWorkChangeTarget(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameWorkChangeTarget(ChangeTarget oldObject, ChangeTarget newObject)
		{
			if (oldObject.WorkID == newObject.WorkID &&
				oldObject.DataCenterID == newObject.DataCenterID &&
				oldObject.PropertyName == newObject.PropertyName &&
				oldObject.EquipmentTypeID == newObject.EquipmentTypeID &&
				oldObject.ServicePause == newObject.ServicePause &&
				oldObject.ServicePausePlanHour == newObject.ServicePausePlanHour &&
				oldObject.Change == newObject.Change &&
				oldObject.ChangeData == newObject.ChangeData &&
				oldObject.ReviewResult == newObject.ReviewResult &&
				oldObject.Reviewer == newObject.Reviewer &&
				IsSameTime2(oldObject.ReviewDate, newObject.ReviewDate) &&
				oldObject.ChangeResult == newObject.ChangeResult &&
				oldObject.ChangeDetail == newObject.ChangeDetail)
				return true;

			return false;
		}

		private ChangeTarget GetWorkChangeTarget(ChangeTarget obj, int id, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", ChangeTarget.GetFieldName(ChangeTarget.Fields.ID, out isNullable), id);

			List<ChangeTarget> datas = m_dataManager.GetSelectManager().SelectWorkChangeTargets(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (ChangeTarget data in datas)
			{
				if (IsSameWorkChangeTarget(data, obj))
					return data;

				if (data.ID < id)
					id = data.ID;
			}

			if (nCount < nLimit)
				return GetWorkChangeTarget(obj, id, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(ChangeTarget.TableName);
			return null;
		}

		public FaultBasic CreateWorkFaultBasic(FaultBasic obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<FaultBasic.Fields, object> dicFieldDatas = new Dictionary<FaultBasic.Fields, object>();
			dicFieldDatas[FaultBasic.Fields.Title] = obj.Title;
			dicFieldDatas[FaultBasic.Fields.Status] = obj.Status;
			dicFieldDatas[FaultBasic.Fields.Reason] = obj.Reason;
			dicFieldDatas[FaultBasic.Fields.Range] = obj.Range;
			dicFieldDatas[FaultBasic.Fields.ReasonType] = obj.ReasonType;
			dicFieldDatas[FaultBasic.Fields.FaultLevel] = obj.FaultLevel;
			dicFieldDatas[FaultBasic.Fields.Region] = obj.Region;
			dicFieldDatas[FaultBasic.Fields.Manager] = obj.Manager;
			dicFieldDatas[FaultBasic.Fields.EventTime] = obj.EventTime;
			dicFieldDatas[FaultBasic.Fields.FinishTime] = obj.FinishTime;
			dicFieldDatas[FaultBasic.Fields.DataCenterID] = obj.DataCenterID;
			dicFieldDatas[FaultBasic.Fields.FaultID] = obj.FaultID;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ID) FROM {0} C), 0) + 1, {2})",
				FaultBasic.TableName,
				GetFieldNames<FaultBasic.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", FaultBasic.GetFieldName(FaultBasic.Fields.ID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<FaultBasic> datas = m_dataManager.GetSelectManager().SelectWorkFaultBasics(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameWorkFaultBasic(obj, datas[0]))
					return datas[0];

				return GetWorkFaultBasic(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameWorkFaultBasic(FaultBasic oldObject, FaultBasic newObject)
		{
			if (oldObject.FaultID == newObject.FaultID)
				return true;

			return false;
		}

		private FaultBasic GetWorkFaultBasic(FaultBasic obj, int id, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", FaultBasic.GetFieldName(FaultBasic.Fields.ID, out isNullable), id);

			List<FaultBasic> datas = m_dataManager.GetSelectManager().SelectWorkFaultBasics(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (FaultBasic data in datas)
			{
				if (IsSameWorkFaultBasic(data, obj))
					return data;

				if (data.ID < id)
					id = data.ID;
			}

			if (nCount < nLimit)
				return GetWorkFaultBasic(obj, id, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(FaultBasic.TableName);
			return null;
		}

		public FaultTarget CreateWorkFaultTarget(FaultTarget obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<FaultTarget.Fields, object> dicFieldDatas = new Dictionary<FaultTarget.Fields, object>();
			dicFieldDatas[FaultTarget.Fields.FaultID] = obj.FaultID;
			dicFieldDatas[FaultTarget.Fields.SystemName] = obj.SystemName;
			dicFieldDatas[FaultTarget.Fields.Department] = obj.Department;
			dicFieldDatas[FaultTarget.Fields.EquipmentTypeID] = obj.EquipmentTypeID;
			dicFieldDatas[FaultTarget.Fields.DataCenterID] = obj.DataCenterID;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ID) FROM {0} C), 0) + 1, {2})",
				FaultTarget.TableName,
				GetFieldNames<FaultTarget.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", FaultTarget.GetFieldName(FaultTarget.Fields.ID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<FaultTarget> datas = m_dataManager.GetSelectManager().SelectWorkFaultTargets(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameWorkFaultTarget(obj, datas[0]))
					return datas[0];

				return GetWorkFaultTarget(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameWorkFaultTarget(FaultTarget oldObject, FaultTarget newObject)
		{
			if (oldObject.FaultID == newObject.FaultID &&
				oldObject.SystemName == newObject.SystemName &&
				oldObject.Department == newObject.Department &&
				oldObject.EquipmentTypeID == newObject.EquipmentTypeID &&
				oldObject.DataCenterID == newObject.DataCenterID)
				return true;

			return false;
		}

		private FaultTarget GetWorkFaultTarget(FaultTarget obj, int id, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", FaultTarget.GetFieldName(FaultTarget.Fields.ID, out isNullable), id);

			List<FaultTarget> datas = m_dataManager.GetSelectManager().SelectWorkFaultTargets(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (FaultTarget data in datas)
			{
				if (IsSameWorkFaultTarget(data, obj))
					return data;

				if (data.ID < id)
					id = data.ID;
			}

			if (nCount < nLimit)
				return GetWorkFaultTarget(obj, id, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(FaultTarget.TableName);
			return null;
		}

		public Regular CreateTeamRegular(Regular obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<Regular.Fields, object> dicFieldDatas = new Dictionary<Regular.Fields, object>();
			dicFieldDatas[Regular.Fields.TeamName] = obj.TeamName;
			dicFieldDatas[Regular.Fields.ParentTeamID] = obj.ParentTeamID;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ID) FROM {0} C), 0) + 1, {2})",
				Regular.TableName,
				GetFieldNames<Regular.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", Regular.GetFieldName(Regular.Fields.ID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<Regular> datas = m_dataManager.GetSelectManager().SelectTeamRegulars(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameTeamRegular(obj, datas[0]))
					return datas[0];

				return GetTeamRegular(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameTeamRegular(Regular oldObject, Regular newObject)
		{
			if (oldObject.TeamName == newObject.TeamName &&
				oldObject.ParentTeamID == newObject.ParentTeamID)
				return true;

			return false;
		}

		private Regular GetTeamRegular(Regular obj, int id, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", Regular.GetFieldName(Regular.Fields.ID, out isNullable), id);

			List<Regular> datas = m_dataManager.GetSelectManager().SelectTeamRegulars(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (Regular data in datas)
			{
				if (IsSameTeamRegular(data, obj))
					return data;

				if (data.ID < id)
					id = data.ID;
			}

			if (nCount < nLimit)
				return GetTeamRegular(obj, id, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(Regular.TableName);
			return null;
		}

		public RegularMember CreateTeamRegularMember(RegularMember obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<RegularMember.Fields, object> dicFieldDatas = new Dictionary<RegularMember.Fields, object>();
			dicFieldDatas[RegularMember.Fields.RegularID] = obj.RegularID;
			dicFieldDatas[RegularMember.Fields.MemberName] = obj.MemberName;
			dicFieldDatas[RegularMember.Fields.MemberID] = obj.MemberID;
			dicFieldDatas[RegularMember.Fields.OfficePhoneNumber] = obj.OfficePhoneNumber;
			dicFieldDatas[RegularMember.Fields.PhoneNumber] = obj.PhoneNumber;
			dicFieldDatas[RegularMember.Fields.JobLevel] = obj.JobLevel;
			dicFieldDatas[RegularMember.Fields.JobPosition] = obj.JobPosition;
			dicFieldDatas[RegularMember.Fields.Email] = obj.Email;
			dicFieldDatas[RegularMember.Fields.Status] = obj.Status;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ID) FROM {0} C), 0) + 1, {2})",
				RegularMember.TableName,
				GetFieldNames<RegularMember.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", RegularMember.GetFieldName(RegularMember.Fields.ID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<RegularMember> datas = m_dataManager.GetSelectManager().SelectTeamRegularMembers(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameTeamRegularMember(obj, datas[0]))
					return datas[0];

				return GetTeamRegularMember(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameTeamRegularMember(RegularMember oldObject, RegularMember newObject)
		{
			if (oldObject.RegularID == newObject.RegularID &&
				oldObject.MemberName == newObject.MemberName &&
				oldObject.MemberID == newObject.MemberID &&
				oldObject.OfficePhoneNumber == newObject.OfficePhoneNumber &&
				oldObject.PhoneNumber == newObject.PhoneNumber &&
				oldObject.JobLevel == newObject.JobLevel &&
				oldObject.JobPosition == newObject.JobPosition &&
				oldObject.Email == newObject.Email &&
				oldObject.Status == newObject.Status)
				return true;

			return false;
		}

		private RegularMember GetTeamRegularMember(RegularMember obj, int id, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", RegularMember.GetFieldName(RegularMember.Fields.ID, out isNullable), id);

			List<RegularMember> datas = m_dataManager.GetSelectManager().SelectTeamRegularMembers(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (RegularMember data in datas)
			{
				if (IsSameTeamRegularMember(data, obj))
					return data;

				if (data.ID < id)
					id = data.ID;
			}

			if (nCount < nLimit)
				return GetTeamRegularMember(obj, id, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(RegularMember.TableName);
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

		private bool IsSameString(string str1, string str2)
        {
			if (str1 == null && str2 == null)
				return true;
			else if (str1 == null || str2 == null)
				return false;

			return str1.Trim() == str2.Trim();
        }
	}
}
