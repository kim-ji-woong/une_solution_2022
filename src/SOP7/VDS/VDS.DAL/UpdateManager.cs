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

		public bool UpdateAccountLevel(Level obj, out string strErrorMessage)
		{
			Dictionary<Level.Fields, object> dicSets = new Dictionary<Level.Fields, object>();
			dicSets[Level.Fields.LevelName] = obj.LevelName;
			dicSets[Level.Fields.LevelEngName] = obj.LevelEngName;

			Dictionary<Level.Fields, object> dicConditions = new Dictionary<Level.Fields, object>();
			dicConditions[Level.Fields.ID] = obj.ID;

			return UpdateAccountLevel(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateAccountLevel(Dictionary<Level.Fields, object> dicSets, Dictionary<Level.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<Level.Fields>(ref strSets, dicSets, Level.GetFieldName, Level.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<Level.Fields>(ref strCondition, dicConditions, Level.GetFieldName, Level.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(Level.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateAccountOption(Option obj, out string strErrorMessage)
		{
			Dictionary<Option.Fields, object> dicSets = new Dictionary<Option.Fields, object>();
			dicSets[Option.Fields.UserID] = obj.UserID;
			dicSets[Option.Fields.Category] = obj.Category;
			dicSets[Option.Fields.SubCategory] = obj.SubCategory;
			dicSets[Option.Fields.PropertyValue1] = obj.PropertyValue1;
			dicSets[Option.Fields.PropertyValue2] = obj.PropertyValue2;
			dicSets[Option.Fields.PropertyValue3] = obj.PropertyValue3;
			dicSets[Option.Fields.PropertyValue4] = obj.PropertyValue4;

			Dictionary<Option.Fields, object> dicConditions = new Dictionary<Option.Fields, object>();
			dicConditions[Option.Fields.ID] = obj.ID;

			return UpdateAccountOption(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateAccountOption(Dictionary<Option.Fields, object> dicSets, Dictionary<Option.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<Option.Fields>(ref strSets, dicSets, Option.GetFieldName, Option.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<Option.Fields>(ref strCondition, dicConditions, Option.GetFieldName, Option.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(Option.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateAccountSession(Session obj, out string strErrorMessage)
		{
			Dictionary<Session.Fields, object> dicSets = new Dictionary<Session.Fields, object>();
			dicSets[Session.Fields.AccountUserID] = obj.AccountUserID;
			dicSets[Session.Fields.SessionKey] = obj.SessionKey;
			dicSets[Session.Fields.CreateDate] = obj.CreateDate;
			dicSets[Session.Fields.UpdateDate] = obj.UpdateDate;
			dicSets[Session.Fields.IsAutoLogin] = obj.IsAutoLogin;

			Dictionary<Session.Fields, object> dicConditions = new Dictionary<Session.Fields, object>();
			dicConditions[Session.Fields.ID] = obj.ID;

			return UpdateAccountSession(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateAccountSession(Dictionary<Session.Fields, object> dicSets, Dictionary<Session.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<Session.Fields>(ref strSets, dicSets, Session.GetFieldName, Session.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<Session.Fields>(ref strCondition, dicConditions, Session.GetFieldName, Session.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(Session.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateAccountUser(User obj, out string strErrorMessage)
		{
			Dictionary<User.Fields, object> dicSets = new Dictionary<User.Fields, object>();
			dicSets[User.Fields.UserLevel] = obj.UserLevel;
			dicSets[User.Fields.Password] = obj.Password;
			dicSets[User.Fields.UserID] = obj.UserID;
			dicSets[User.Fields.NickName] = obj.NickName;
			dicSets[User.Fields.PasswordCode] = obj.PasswordCode;
			dicSets[User.Fields.Salt] = obj.Salt;

			Dictionary<User.Fields, object> dicConditions = new Dictionary<User.Fields, object>();
			dicConditions[User.Fields.ID] = obj.ID;

			return UpdateAccountUser(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateAccountUser(Dictionary<User.Fields, object> dicSets, Dictionary<User.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<User.Fields>(ref strSets, dicSets, User.GetFieldName, User.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<User.Fields>(ref strCondition, dicConditions, User.GetFieldName, User.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(User.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool UpdateAccountUserData(UserData obj, out string strErrorMessage)
		{
			Dictionary<UserData.Fields, object> dicSets = new Dictionary<UserData.Fields, object>();
			dicSets[UserData.Fields.CompanyName] = obj.CompanyName;
			dicSets[UserData.Fields.RegDate] = obj.RegDate;
			dicSets[UserData.Fields.Activate] = obj.Activate;
			dicSets[UserData.Fields.Memo] = obj.Memo;
			dicSets[UserData.Fields.SiteID] = obj.SiteID;

			Dictionary<UserData.Fields, object> dicConditions = new Dictionary<UserData.Fields, object>();
			dicConditions[UserData.Fields.UserID] = obj.UserID;

			return UpdateAccountUserData(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateAccountUserData(Dictionary<UserData.Fields, object> dicSets, Dictionary<UserData.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<UserData.Fields>(ref strSets, dicSets, UserData.GetFieldName, UserData.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<UserData.Fields>(ref strCondition, dicConditions, UserData.GetFieldName, UserData.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(UserData.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool UpdateAccountUserDataCenterLink(Dictionary<UserDataCenterLink.Fields, object> dicSets, Dictionary<UserDataCenterLink.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<UserDataCenterLink.Fields>(ref strSets, dicSets, UserDataCenterLink.GetFieldName, UserDataCenterLink.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<UserDataCenterLink.Fields>(ref strCondition, dicConditions, UserDataCenterLink.GetFieldName, UserDataCenterLink.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(UserDataCenterLink.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool UpdateCompany(Company obj, out string strErrorMessage)
		{
			Dictionary<Company.Fields, object> dicSets = new Dictionary<Company.Fields, object>();
			dicSets[Company.Fields.Name] = obj.Name;
			dicSets[Company.Fields.EngName] = obj.EngName;

			Dictionary<Company.Fields, object> dicConditions = new Dictionary<Company.Fields, object>();
			dicConditions[Company.Fields.ID] = obj.ID;

			return UpdateCompany(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateCompany(Dictionary<Company.Fields, object> dicSets, Dictionary<Company.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<Company.Fields>(ref strSets, dicSets, Company.GetFieldName, Company.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<Company.Fields>(ref strCondition, dicConditions, Company.GetFieldName, Company.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(Company.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateDataCenter(Model.DataCenter.DataCenter obj, out string strErrorMessage)
		{
			Dictionary<Model.DataCenter.DataCenter.Fields, object> dicSets = new Dictionary<Model.DataCenter.DataCenter.Fields, object>();
			dicSets[Model.DataCenter.DataCenter.Fields.Name] = obj.Name;
			dicSets[Model.DataCenter.DataCenter.Fields.EngName] = obj.EngName;
			dicSets[Model.DataCenter.DataCenter.Fields.SiteID] = obj.SiteID;
			dicSets[Model.DataCenter.DataCenter.Fields.NationID] = obj.NationID;
			dicSets[Model.DataCenter.DataCenter.Fields.Address] = obj.Address;
			dicSets[Model.DataCenter.DataCenter.Fields.RegDate] = obj.RegDate;
			dicSets[Model.DataCenter.DataCenter.Fields.Width] = obj.Width;
			dicSets[Model.DataCenter.DataCenter.Fields.Length] = obj.Length;
			dicSets[Model.DataCenter.DataCenter.Fields.Height] = obj.Height;
			dicSets[Model.DataCenter.DataCenter.Fields.TileWidth] = obj.TileWidth;
			dicSets[Model.DataCenter.DataCenter.Fields.TileLength] = obj.TileLength;
			dicSets[Model.DataCenter.DataCenter.Fields.TileElevation] = obj.TileElevation;
			dicSets[Model.DataCenter.DataCenter.Fields.UnitOfLength] = obj.UnitOfLength;
			dicSets[Model.DataCenter.DataCenter.Fields.Type] = obj.Type;
			dicSets[Model.DataCenter.DataCenter.Fields.Latitude] = obj.Latitude;
			dicSets[Model.DataCenter.DataCenter.Fields.Longitude] = obj.Longitude;
			dicSets[Model.DataCenter.DataCenter.Fields.CreationType] = obj.CreationType;
			dicSets[Model.DataCenter.DataCenter.Fields.Memo] = obj.Memo;
			dicSets[Model.DataCenter.DataCenter.Fields.BeginGridX] = obj.BeginGridX;
			dicSets[Model.DataCenter.DataCenter.Fields.BeginGridY] = obj.BeginGridY;
			dicSets[Model.DataCenter.DataCenter.Fields.UTC] = obj.UTC;

			Dictionary<Model.DataCenter.DataCenter.Fields, object> dicConditions = new Dictionary<Model.DataCenter.DataCenter.Fields, object>();
			dicConditions[Model.DataCenter.DataCenter.Fields.ID] = obj.ID;

			return UpdateDataCenter(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateDataCenter(Dictionary<Model.DataCenter.DataCenter.Fields, object> dicSets, Dictionary<Model.DataCenter.DataCenter.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<Model.DataCenter.DataCenter.Fields>(ref strSets, dicSets, Model.DataCenter.DataCenter.GetFieldName, Model.DataCenter.DataCenter.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<Model.DataCenter.DataCenter.Fields>(ref strCondition, dicConditions, Model.DataCenter.DataCenter.GetFieldName, Model.DataCenter.DataCenter.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(Model.DataCenter.DataCenter.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool UpdateDataCenterViewport(Model.DataCenter.Viewport obj, out string strErrorMessage)
		{
			Dictionary<Model.DataCenter.Viewport.Fields, object> dicSets = new Dictionary<Model.DataCenter.Viewport.Fields, object>();
			dicSets[Model.DataCenter.Viewport.Fields.PositionX] = obj.PositionX;
			dicSets[Model.DataCenter.Viewport.Fields.PositionY] = obj.PositionY;
			dicSets[Model.DataCenter.Viewport.Fields.PositionZ] = obj.PositionZ;
			dicSets[Model.DataCenter.Viewport.Fields.RotationX] = obj.RotationX;
			dicSets[Model.DataCenter.Viewport.Fields.RotationY] = obj.RotationY;
			dicSets[Model.DataCenter.Viewport.Fields.RotationZ] = obj.RotationZ;

			Dictionary<Model.DataCenter.Viewport.Fields, object> dicConditions = new Dictionary<Model.DataCenter.Viewport.Fields, object>();
			dicConditions[Model.DataCenter.Viewport.Fields.DataCenterID] = obj.DataCenterID;

			return UpdateDataCenterViewport(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateDataCenterViewport(Dictionary<Model.DataCenter.Viewport.Fields, object> dicSets, Dictionary<Model.DataCenter.Viewport.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<Model.DataCenter.Viewport.Fields>(ref strSets, dicSets, Model.DataCenter.Viewport.GetFieldName, Model.DataCenter.Viewport.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<Model.DataCenter.Viewport.Fields>(ref strCondition, dicConditions, Model.DataCenter.Viewport.GetFieldName, Model.DataCenter.Viewport.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(Model.DataCenter.Viewport.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool UpdateDataCenterData(Model.DataCenter.Data obj, out string strErrorMessage)
		{
			Dictionary<Model.DataCenter.Data.Fields, object> dicSets = new Dictionary<Model.DataCenter.Data.Fields, object>();
			dicSets[Model.DataCenter.Data.Fields.IsClone] = obj.IsClone;
			dicSets[Model.DataCenter.Data.Fields.ParentID] = obj.ParentID;
			dicSets[Model.DataCenter.Data.Fields.ManagerTeam] = obj.ManagerTeam;
			dicSets[Model.DataCenter.Data.Fields.Manager] = obj.Manager;
			dicSets[Model.DataCenter.Data.Fields.Company] = obj.Company;

			Dictionary<Model.DataCenter.Data.Fields, object> dicConditions = new Dictionary<Model.DataCenter.Data.Fields, object>();
			dicConditions[Model.DataCenter.Data.Fields.CenterID] = obj.CenterID;

			return UpdateDataCenterData(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateDataCenterData(Dictionary<Model.DataCenter.Data.Fields, object> dicSets, Dictionary<Model.DataCenter.Data.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<Model.DataCenter.Data.Fields>(ref strSets, dicSets, Model.DataCenter.Data.GetFieldName, Model.DataCenter.Data.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<Model.DataCenter.Data.Fields>(ref strCondition, dicConditions, Model.DataCenter.Data.GetFieldName, Model.DataCenter.Data.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(Model.DataCenter.Data.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool UpdateDataCenterOption(Model.DataCenter.Option obj, out string strErrorMessage)
		{
			Dictionary<Model.DataCenter.Option.Fields, object> dicSets = new Dictionary<Model.DataCenter.Option.Fields, object>();
			dicSets[Model.DataCenter.Option.Fields.PropertyValue] = obj.PropertyValue;
			dicSets[Model.DataCenter.Option.Fields.Description] = obj.Description;

			Dictionary<Model.DataCenter.Option.Fields, object> dicConditions = new Dictionary<Model.DataCenter.Option.Fields, object>();
			dicConditions[Model.DataCenter.Option.Fields.PropertyName] = obj.PropertyName;

			return UpdateDataCenterOption(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateDataCenterOption(Dictionary<Model.DataCenter.Option.Fields, object> dicSets, Dictionary<Model.DataCenter.Option.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<Model.DataCenter.Option.Fields>(ref strSets, dicSets, Model.DataCenter.Option.GetFieldName, Model.DataCenter.Option.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<Model.DataCenter.Option.Fields>(ref strCondition, dicConditions, Model.DataCenter.Option.GetFieldName, Model.DataCenter.Option.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(Model.DataCenter.Option.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool UpdateEquipmentCategory(EquipmentCategory obj, out string strErrorMessage)
		{
			Dictionary<EquipmentCategory.Fields, object> dicSets = new Dictionary<EquipmentCategory.Fields, object>();
			dicSets[EquipmentCategory.Fields.Name] = obj.Name;
			dicSets[EquipmentCategory.Fields.EngName] = obj.EngName;

			Dictionary<EquipmentCategory.Fields, object> dicConditions = new Dictionary<EquipmentCategory.Fields, object>();
			dicConditions[EquipmentCategory.Fields.ID] = obj.ID;

			return UpdateEquipmentCategory(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateEquipmentCategory(Dictionary<EquipmentCategory.Fields, object> dicSets, Dictionary<EquipmentCategory.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<EquipmentCategory.Fields>(ref strSets, dicSets, EquipmentCategory.GetFieldName, EquipmentCategory.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<EquipmentCategory.Fields>(ref strCondition, dicConditions, EquipmentCategory.GetFieldName, EquipmentCategory.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(EquipmentCategory.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateEquipmentType(EquipmentType obj, out string strErrorMessage)
		{
			Dictionary<EquipmentType.Fields, object> dicSets = new Dictionary<EquipmentType.Fields, object>();
			dicSets[EquipmentType.Fields.Name] = obj.Name;
			dicSets[EquipmentType.Fields.EngName] = obj.EngName;
			dicSets[EquipmentType.Fields.CategoryID] = obj.CategoryID;

			Dictionary<EquipmentType.Fields, object> dicConditions = new Dictionary<EquipmentType.Fields, object>();
			dicConditions[EquipmentType.Fields.ID] = obj.ID;

			return UpdateEquipmentType(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateEquipmentType(Dictionary<EquipmentType.Fields, object> dicSets, Dictionary<EquipmentType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<EquipmentType.Fields>(ref strSets, dicSets, EquipmentType.GetFieldName, EquipmentType.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<EquipmentType.Fields>(ref strCondition, dicConditions, EquipmentType.GetFieldName, EquipmentType.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(EquipmentType.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateItem(Item obj, out string strErrorMessage)
		{
			Dictionary<Item.Fields, object> dicSets = new Dictionary<Item.Fields, object>();
			dicSets[Item.Fields.Name] = obj.Name;
			dicSets[Item.Fields.CenterID] = obj.CenterID;
			dicSets[Item.Fields.ItemTypeID] = obj.ItemTypeID;
			dicSets[Item.Fields.Cpu] = obj.Cpu;
			dicSets[Item.Fields.Ram] = obj.Ram;
			dicSets[Item.Fields.DiskInfo] = obj.DiskInfo;
			dicSets[Item.Fields.DiskVolume] = obj.DiskVolume;
			dicSets[Item.Fields.RegDate] = obj.RegDate;
			dicSets[Item.Fields.ChangeDate] = obj.ChangeDate;
			dicSets[Item.Fields.Usage] = obj.Usage;
			dicSets[Item.Fields.PositionInShelf] = obj.PositionInShelf;
			dicSets[Item.Fields.Status] = obj.Status;

			Dictionary<Item.Fields, object> dicConditions = new Dictionary<Item.Fields, object>();
			dicConditions[Item.Fields.ID] = obj.ID;

			return UpdateItem(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateItem(Dictionary<Item.Fields, object> dicSets, Dictionary<Item.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<Item.Fields>(ref strSets, dicSets, Item.GetFieldName, Item.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<Item.Fields>(ref strCondition, dicConditions, Item.GetFieldName, Item.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(Item.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateItem_RU(Item_RU obj, out string strErrorMessage)
		{
			Dictionary<Item_RU.Fields, object> dicSets = new Dictionary<Item_RU.Fields, object>();
			dicSets[Item_RU.Fields.RackID] = obj.RackID;
			dicSets[Item_RU.Fields.UPos] = obj.UPos;

			Dictionary<Item_RU.Fields, object> dicConditions = new Dictionary<Item_RU.Fields, object>();
			dicConditions[Item_RU.Fields.ItemID] = obj.ItemID;

			return UpdateItem_RU(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateItem_RU(Dictionary<Item_RU.Fields, object> dicSets, Dictionary<Item_RU.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<Item_RU.Fields>(ref strSets, dicSets, Item_RU.GetFieldName, Item_RU.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<Item_RU.Fields>(ref strCondition, dicConditions, Item_RU.GetFieldName, Item_RU.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(Item_RU.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool UpdateLinkedItem(LinkedItem obj, out string strErrorMessage)
		{
			Dictionary<LinkedItem.Fields, object> dicSets = new Dictionary<LinkedItem.Fields, object>();

			Dictionary<LinkedItem.Fields, object> dicConditions = new Dictionary<LinkedItem.Fields, object>();
			dicConditions[LinkedItem.Fields.ItemID] = obj.ItemID;
			dicConditions[LinkedItem.Fields.LinkedItemID] = obj.LinkedItemID;
			dicConditions[LinkedItem.Fields.CenterID] = obj.CenterID;

			return UpdateLinkedItem(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateLinkedItem(Dictionary<LinkedItem.Fields, object> dicSets, Dictionary<LinkedItem.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<LinkedItem.Fields>(ref strSets, dicSets, LinkedItem.GetFieldName, LinkedItem.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<LinkedItem.Fields>(ref strCondition, dicConditions, LinkedItem.GetFieldName, LinkedItem.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(LinkedItem.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool UpdateItemType(ItemType obj, out string strErrorMessage)
		{
			Dictionary<ItemType.Fields, object> dicSets = new Dictionary<ItemType.Fields, object>();
			dicSets[ItemType.Fields.EquipmentType] = obj.EquipmentType;
			dicSets[ItemType.Fields.CompanyID] = obj.CompanyID;
			dicSets[ItemType.Fields.ModelName] = obj.ModelName;
			dicSets[ItemType.Fields.Type] = obj.Type;
			dicSets[ItemType.Fields.Height] = obj.Height;
			dicSets[ItemType.Fields.Width] = obj.Width;
			dicSets[ItemType.Fields.Depth] = obj.Depth;
			dicSets[ItemType.Fields.Unit] = obj.Unit;
			dicSets[ItemType.Fields.Shelf] = obj.Shelf;
			dicSets[ItemType.Fields.ImageUrl] = obj.ImageUrl;
			dicSets[ItemType.Fields.BackImageUrl] = obj.BackImageUrl;
			dicSets[ItemType.Fields.GlbUrl] = obj.GlbUrl;
			dicSets[ItemType.Fields.FbxUrl] = obj.FbxUrl;
			dicSets[ItemType.Fields.ClassName] = obj.ClassName;
			dicSets[ItemType.Fields.Memo] = obj.Memo;
			dicSets[ItemType.Fields.RegDate] = obj.RegDate;
			dicSets[ItemType.Fields.ChangeDate] = obj.ChangeDate;

			Dictionary<ItemType.Fields, object> dicConditions = new Dictionary<ItemType.Fields, object>();
			dicConditions[ItemType.Fields.ID] = obj.ID;

			return UpdateItemType(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateItemType(Dictionary<ItemType.Fields, object> dicSets, Dictionary<ItemType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<ItemType.Fields>(ref strSets, dicSets, ItemType.GetFieldName, ItemType.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<ItemType.Fields>(ref strCondition, dicConditions, ItemType.GetFieldName, ItemType.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(ItemType.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool UpdateBackup(Backup obj, out string strErrorMessage)
		{
			Dictionary<Backup.Fields, object> dicSets = new Dictionary<Backup.Fields, object>();
			dicSets[Backup.Fields.BackupID] = obj.BackupID;
			dicSets[Backup.Fields.Basic_Status] = obj.Basic_Status;
			dicSets[Backup.Fields.Basic_RegDate] = obj.Basic_RegDate;
			dicSets[Backup.Fields.Basic_Usage] = obj.Basic_Usage;
			dicSets[Backup.Fields.Basic_ReceiveDate] = obj.Basic_ReceiveDate;
			dicSets[Backup.Fields.Basic_ItemLevel] = obj.Basic_ItemLevel;
			dicSets[Backup.Fields.Basic_OwnerCompanyName] = obj.Basic_OwnerCompanyName;
			dicSets[Backup.Fields.Basic_OwnDepartment] = obj.Basic_OwnDepartment;
			dicSets[Backup.Fields.Basic_OperationDepartment] = obj.Basic_OperationDepartment;
			dicSets[Backup.Fields.Basic_OverUsedYear] = obj.Basic_OverUsedYear;
			dicSets[Backup.Fields.Basic_Memo] = obj.Basic_Memo;
			dicSets[Backup.Fields.Manage_SuperviseManager] = obj.Manage_SuperviseManager;
			dicSets[Backup.Fields.Manage_OperationManager] = obj.Manage_OperationManager;
			dicSets[Backup.Fields.Position_InstallRegion] = obj.Position_InstallRegion;
			dicSets[Backup.Fields.Position_RackDetailPosition] = obj.Position_RackDetailPosition;
			dicSets[Backup.Fields.Maintenance_ProvideCompanyName] = obj.Maintenance_ProvideCompanyName;
			dicSets[Backup.Fields.Maintenance_WarrantyMonth] = obj.Maintenance_WarrantyMonth;
			dicSets[Backup.Fields.Maintenance_WarrantyExpiredDate] = obj.Maintenance_WarrantyExpiredDate;
			dicSets[Backup.Fields.Maintenance_MaintenanceCompanyName] = obj.Maintenance_MaintenanceCompanyName;
			dicSets[Backup.Fields.Maintenance_EOSDate] = obj.Maintenance_EOSDate;
			dicSets[Backup.Fields.Maintenance_MaintenanceContract] = obj.Maintenance_MaintenanceContract;
			dicSets[Backup.Fields.Maintenance_MaintenanceBeginDate] = obj.Maintenance_MaintenanceBeginDate;
			dicSets[Backup.Fields.Maintenance_MaintenanceEndDate] = obj.Maintenance_MaintenanceEndDate;
			dicSets[Backup.Fields.HW_ModelName] = obj.HW_ModelName;
			dicSets[Backup.Fields.HW_Company] = obj.HW_Company;
			dicSets[Backup.Fields.HW_SerialNumber] = obj.HW_SerialNumber;
			dicSets[Backup.Fields.HW_DiskType] = obj.HW_DiskType;
			dicSets[Backup.Fields.HW_FirmwareVersion] = obj.HW_FirmwareVersion;
			dicSets[Backup.Fields.HW_Topology] = obj.HW_Topology;
			dicSets[Backup.Fields.HW_IP] = obj.HW_IP;
			dicSets[Backup.Fields.HW_RegDate] = obj.HW_RegDate;
			dicSets[Backup.Fields.HW_DiskDriveType] = obj.HW_DiskDriveType;
			dicSets[Backup.Fields.HW_DiskTypeVolumeGB] = obj.HW_DiskTypeVolumeGB;
			dicSets[Backup.Fields.HW_DiskCount] = obj.HW_DiskCount;
			dicSets[Backup.Fields.HW_PhysicalVolumeGB] = obj.HW_PhysicalVolumeGB;
			dicSets[Backup.Fields.HW_UsableVolumeGB] = obj.HW_UsableVolumeGB;
			dicSets[Backup.Fields.HW_RaidType] = obj.HW_RaidType;
			dicSets[Backup.Fields.HW_BuyDate] = obj.HW_BuyDate;
			dicSets[Backup.Fields.HW_TotalSlotCount] = obj.HW_TotalSlotCount;
			dicSets[Backup.Fields.HW_TapeMediaType] = obj.HW_TapeMediaType;
			dicSets[Backup.Fields.HW_TapeMediaCount] = obj.HW_TapeMediaCount;
			dicSets[Backup.Fields.Connect_NWEquip_1] = obj.Connect_NWEquip_1;
			dicSets[Backup.Fields.Connect_NWEquip_2] = obj.Connect_NWEquip_2;
			dicSets[Backup.Fields.Connect_NWEquip_3] = obj.Connect_NWEquip_3;
			dicSets[Backup.Fields.Connect_NWEquip_4] = obj.Connect_NWEquip_4;
			dicSets[Backup.Fields.Connect_SanSwitch_1] = obj.Connect_SanSwitch_1;
			dicSets[Backup.Fields.Connect_SanSwitch_2] = obj.Connect_SanSwitch_2;
			dicSets[Backup.Fields.Connect_SanSwitch_3] = obj.Connect_SanSwitch_3;
			dicSets[Backup.Fields.Connect_SanSwitch_4] = obj.Connect_SanSwitch_4;

			Dictionary<Backup.Fields, object> dicConditions = new Dictionary<Backup.Fields, object>();
			dicConditions[Backup.Fields.Basic_Name] = obj.Basic_Name;
			dicConditions[Backup.Fields.DataCenterID] = obj.DataCenterID;

			return UpdateBackup(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateBackup(Dictionary<Backup.Fields, object> dicSets, Dictionary<Backup.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<Backup.Fields>(ref strSets, dicSets, Backup.GetFieldName, Backup.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<Backup.Fields>(ref strCondition, dicConditions, Backup.GetFieldName, Backup.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(Backup.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateBox(Box obj, out string strErrorMessage)
		{
			Dictionary<Box.Fields, object> dicSets = new Dictionary<Box.Fields, object>();
			dicSets[Box.Fields.BoxID] = obj.BoxID;
			dicSets[Box.Fields.Basic_Company] = obj.Basic_Company;
			dicSets[Box.Fields.Basic_ModelName] = obj.Basic_ModelName;
			dicSets[Box.Fields.Basic_Status] = obj.Basic_Status;
			dicSets[Box.Fields.Basic_Usage] = obj.Basic_Usage;
			dicSets[Box.Fields.Basic_RegDate] = obj.Basic_RegDate;
			dicSets[Box.Fields.Basic_ItemLevel] = obj.Basic_ItemLevel;
			dicSets[Box.Fields.Basic_EquipType] = obj.Basic_EquipType;
			dicSets[Box.Fields.Basic_SerialNumber] = obj.Basic_SerialNumber;
			dicSets[Box.Fields.Basic_PropertyType] = obj.Basic_PropertyType;
			dicSets[Box.Fields.Basic_ReceiveDate] = obj.Basic_ReceiveDate;
			dicSets[Box.Fields.Basic_OwnDepartment] = obj.Basic_OwnDepartment;
			dicSets[Box.Fields.Basic_PartitionAble] = obj.Basic_PartitionAble;
			dicSets[Box.Fields.Basic_PartitionName] = obj.Basic_PartitionName;
			dicSets[Box.Fields.Basic_ReceiveYears] = obj.Basic_ReceiveYears;
			dicSets[Box.Fields.Basic_OperationDepartment] = obj.Basic_OperationDepartment;
			dicSets[Box.Fields.Basic_DiscardDate] = obj.Basic_DiscardDate;
			dicSets[Box.Fields.Basic_OverUsedYear] = obj.Basic_OverUsedYear;
			dicSets[Box.Fields.Manage_SuperviseManager] = obj.Manage_SuperviseManager;
			dicSets[Box.Fields.Manage_OperationManager] = obj.Manage_OperationManager;
			dicSets[Box.Fields.Position_InstallRegion] = obj.Position_InstallRegion;
			dicSets[Box.Fields.Position_RackDetailPosition] = obj.Position_RackDetailPosition;
			dicSets[Box.Fields.Maintenance_WarrantyMonth] = obj.Maintenance_WarrantyMonth;
			dicSets[Box.Fields.Maintenance_WarrantyExpiredDate] = obj.Maintenance_WarrantyExpiredDate;
			dicSets[Box.Fields.Maintenance_EOLDate] = obj.Maintenance_EOLDate;
			dicSets[Box.Fields.Maintenance_EOSLDate] = obj.Maintenance_EOSLDate;
			dicSets[Box.Fields.Maintenance_EOSL] = obj.Maintenance_EOSL;
			dicSets[Box.Fields.Maintenance_MaintenanceContract] = obj.Maintenance_MaintenanceContract;
			dicSets[Box.Fields.Maintenance_MaintenanceCompanyName] = obj.Maintenance_MaintenanceCompanyName;
			dicSets[Box.Fields.Maintenance_MaintenanceBeginDate] = obj.Maintenance_MaintenanceBeginDate;
			dicSets[Box.Fields.Maintenance_MaintenanceEndDate] = obj.Maintenance_MaintenanceEndDate;
			dicSets[Box.Fields.Maintenance_ProvideCompanyName] = obj.Maintenance_ProvideCompanyName;
			dicSets[Box.Fields.HW_BoxPartitionType] = obj.HW_BoxPartitionType;
			dicSets[Box.Fields.HW_PowerDual] = obj.HW_PowerDual;
			dicSets[Box.Fields.HW_ConsoleUse] = obj.HW_ConsoleUse;
			dicSets[Box.Fields.CPU_ModelName] = obj.CPU_ModelName;
			dicSets[Box.Fields.CPU_ClockSpeed] = obj.CPU_ClockSpeed;
			dicSets[Box.Fields.CPU_SocketCount] = obj.CPU_SocketCount;
			dicSets[Box.Fields.CPU_CoreCountPerCPU] = obj.CPU_CoreCountPerCPU;
			dicSets[Box.Fields.CPU_TotalSlotCount] = obj.CPU_TotalSlotCount;
			dicSets[Box.Fields.CPU_UseSlotCount] = obj.CPU_UseSlotCount;
			dicSets[Box.Fields.CPU_HTUse] = obj.CPU_HTUse;
			dicSets[Box.Fields.CPU_TotalCoreCount] = obj.CPU_TotalCoreCount;
			dicSets[Box.Fields.Mem_TotalSlotCount] = obj.Mem_TotalSlotCount;
			dicSets[Box.Fields.Mem_EA_1GB] = obj.Mem_EA_1GB;
			dicSets[Box.Fields.Mem_EA_2GB] = obj.Mem_EA_2GB;
			dicSets[Box.Fields.Mem_EA_4GB] = obj.Mem_EA_4GB;
			dicSets[Box.Fields.Mem_EA_8GB] = obj.Mem_EA_8GB;
			dicSets[Box.Fields.Mem_EA_16GB] = obj.Mem_EA_16GB;
			dicSets[Box.Fields.Mem_EA_32GB] = obj.Mem_EA_32GB;
			dicSets[Box.Fields.Mem_EA_64GB] = obj.Mem_EA_64GB;
			dicSets[Box.Fields.Mem_EA_128GB] = obj.Mem_EA_128GB;
			dicSets[Box.Fields.Mem_EA_256GB] = obj.Mem_EA_256GB;
			dicSets[Box.Fields.Mem_UseSlotCount] = obj.Mem_UseSlotCount;
			dicSets[Box.Fields.Mem_MemoryCount] = obj.Mem_MemoryCount;
			dicSets[Box.Fields.Mem_TotalMemoryVolume] = obj.Mem_TotalMemoryVolume;
			dicSets[Box.Fields.Internal_InternalDiskVolumeGB] = obj.Internal_InternalDiskVolumeGB;
			dicSets[Box.Fields.Internal_InternalDiskCount] = obj.Internal_InternalDiskCount;
			dicSets[Box.Fields.Internal_InternalDiskUsableVolumeGB] = obj.Internal_InternalDiskUsableVolumeGB;
			dicSets[Box.Fields.Internal_InternalDiskTotalSlotCount] = obj.Internal_InternalDiskTotalSlotCount;
			dicSets[Box.Fields.Internal_InternalDiskUseSlot] = obj.Internal_InternalDiskUseSlot;
			dicSets[Box.Fields.Internal_InternalDiskRaidType] = obj.Internal_InternalDiskRaidType;
			dicSets[Box.Fields.Internal_InternalDiskSizeGB] = obj.Internal_InternalDiskSizeGB;
			dicSets[Box.Fields.External_ExternalDiskCompanyName] = obj.External_ExternalDiskCompanyName;
			dicSets[Box.Fields.External_ExternalDiskModel] = obj.External_ExternalDiskModel;
			dicSets[Box.Fields.External_ExternalDiskRaidType] = obj.External_ExternalDiskRaidType;
			dicSets[Box.Fields.External_ExternalDiskSizeGB] = obj.External_ExternalDiskSizeGB;
			dicSets[Box.Fields.External_ExternalDiskMultiPathSolution] = obj.External_ExternalDiskMultiPathSolution;
			dicSets[Box.Fields.PS_PowerSupplyCount] = obj.PS_PowerSupplyCount;
			dicSets[Box.Fields.PS_PowerSupplyVolumeW] = obj.PS_PowerSupplyVolumeW;
			dicSets[Box.Fields.PS_PowerSupplyPduDual] = obj.PS_PowerSupplyPduDual;
			dicSets[Box.Fields.PS_PowerSupplyRackPowerDual] = obj.PS_PowerSupplyRackPowerDual;
			dicSets[Box.Fields.Fan_FanCount] = obj.Fan_FanCount;
			dicSets[Box.Fields.Fan_FanDual] = obj.Fan_FanDual;
			dicSets[Box.Fields.Nic_NicSpeed] = obj.Nic_NicSpeed;
			dicSets[Box.Fields.Nic_NicType] = obj.Nic_NicType;
			dicSets[Box.Fields.Nic_NicPort] = obj.Nic_NicPort;
			dicSets[Box.Fields.Nic_NicCount] = obj.Nic_NicCount;
			dicSets[Box.Fields.Nic_NicUsePortCount] = obj.Nic_NicUsePortCount;
			dicSets[Box.Fields.Nic_OnboardNicPortCount] = obj.Nic_OnboardNicPortCount;
			dicSets[Box.Fields.Nic_OnboardNicUsePortCount] = obj.Nic_OnboardNicUsePortCount;
			dicSets[Box.Fields.Nic_HBASpeed] = obj.Nic_HBASpeed;
			dicSets[Box.Fields.Nic_HBAType] = obj.Nic_HBAType;
			dicSets[Box.Fields.Nic_HBAPort] = obj.Nic_HBAPort;
			dicSets[Box.Fields.Nic_HBACount] = obj.Nic_HBACount;
			dicSets[Box.Fields.Nic_UsingHBAPortCount] = obj.Nic_UsingHBAPortCount;
			dicSets[Box.Fields.NW_ManageIPAddr] = obj.NW_ManageIPAddr;
			dicSets[Box.Fields.NW_IPAddr2] = obj.NW_IPAddr2;
			dicSets[Box.Fields.NW_IPAddr3] = obj.NW_IPAddr3;
			dicSets[Box.Fields.NW_IPAddr4] = obj.NW_IPAddr4;
			dicSets[Box.Fields.Connect_SanSwitch1] = obj.Connect_SanSwitch1;
			dicSets[Box.Fields.Connect_SanSwitch2] = obj.Connect_SanSwitch2;
			dicSets[Box.Fields.Connect_SanSwitch3] = obj.Connect_SanSwitch3;
			dicSets[Box.Fields.Connect_NWEquip1] = obj.Connect_NWEquip1;
			dicSets[Box.Fields.Connect_NWEquip2] = obj.Connect_NWEquip2;
			dicSets[Box.Fields.Connect_NWEquip3] = obj.Connect_NWEquip3;
			dicSets[Box.Fields.Connect_NWEquip4] = obj.Connect_NWEquip4;
			dicSets[Box.Fields.Connect_NWEquip5] = obj.Connect_NWEquip5;
			dicSets[Box.Fields.Connect_NWEquip6] = obj.Connect_NWEquip6;
			dicSets[Box.Fields.Connect_NWEquip7] = obj.Connect_NWEquip7;
			dicSets[Box.Fields.Connect_NWEquip8] = obj.Connect_NWEquip8;
			dicSets[Box.Fields.Connect_Storage1] = obj.Connect_Storage1;
			dicSets[Box.Fields.Connect_Storage2] = obj.Connect_Storage2;
			dicSets[Box.Fields.Connect_Backup1] = obj.Connect_Backup1;
			dicSets[Box.Fields.Connect_Backup2] = obj.Connect_Backup2;
			dicSets[Box.Fields.Connect_Backup3] = obj.Connect_Backup3;
			dicSets[Box.Fields.Connect_Backup4] = obj.Connect_Backup4;

			Dictionary<Box.Fields, object> dicConditions = new Dictionary<Box.Fields, object>();
			dicConditions[Box.Fields.Basic_Name] = obj.Basic_Name;
			dicConditions[Box.Fields.DataCenterID] = obj.DataCenterID;

			return UpdateBox(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateBox(Dictionary<Box.Fields, object> dicSets, Dictionary<Box.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<Box.Fields>(ref strSets, dicSets, Box.GetFieldName, Box.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<Box.Fields>(ref strCondition, dicConditions, Box.GetFieldName, Box.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(Box.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateEtc(Etc obj, out string strErrorMessage)
		{
			Dictionary<Etc.Fields, object> dicSets = new Dictionary<Etc.Fields, object>();
			dicSets[Etc.Fields.EtcID] = obj.EtcID;
			dicSets[Etc.Fields.Basic_Status] = obj.Basic_Status;
			dicSets[Etc.Fields.Basic_RegDate] = obj.Basic_RegDate;
			dicSets[Etc.Fields.Basic_Usage] = obj.Basic_Usage;
			dicSets[Etc.Fields.Basic_EquipDetailClass] = obj.Basic_EquipDetailClass;
			dicSets[Etc.Fields.Basic_LifeYear] = obj.Basic_LifeYear;
			dicSets[Etc.Fields.Basic_OverUsedYear] = obj.Basic_OverUsedYear;
			dicSets[Etc.Fields.Basic_ReceiveDate] = obj.Basic_ReceiveDate;
			dicSets[Etc.Fields.Basic_ItemLevel] = obj.Basic_ItemLevel;
			dicSets[Etc.Fields.Basic_OwnerCompanyName] = obj.Basic_OwnerCompanyName;
			dicSets[Etc.Fields.Basic_OwnDepartment] = obj.Basic_OwnDepartment;
			dicSets[Etc.Fields.Basic_OperationDepartment] = obj.Basic_OperationDepartment;
			dicSets[Etc.Fields.Basic_SiteManager] = obj.Basic_SiteManager;
			dicSets[Etc.Fields.Basic_DiscardDate] = obj.Basic_DiscardDate;
			dicSets[Etc.Fields.Basic_Memo] = obj.Basic_Memo;
			dicSets[Etc.Fields.Manage_SuperviseManager] = obj.Manage_SuperviseManager;
			dicSets[Etc.Fields.Manage_OperationManager] = obj.Manage_OperationManager;
			dicSets[Etc.Fields.Position_InstallRegion] = obj.Position_InstallRegion;
			dicSets[Etc.Fields.Position_RackDetailPosition] = obj.Position_RackDetailPosition;
			dicSets[Etc.Fields.Maintenance_ProvideCompanyName] = obj.Maintenance_ProvideCompanyName;
			dicSets[Etc.Fields.Maintenance_WarrantyMonth] = obj.Maintenance_WarrantyMonth;
			dicSets[Etc.Fields.Maintenance_WarrantyExpiredDate] = obj.Maintenance_WarrantyExpiredDate;
			dicSets[Etc.Fields.Maintenance_FinancialDepartment] = obj.Maintenance_FinancialDepartment;
			dicSets[Etc.Fields.Maintenance_MaintenanceCompanyName] = obj.Maintenance_MaintenanceCompanyName;
			dicSets[Etc.Fields.Maintenance_EOSDate] = obj.Maintenance_EOSDate;
			dicSets[Etc.Fields.Maintenance_MaintenanceContract] = obj.Maintenance_MaintenanceContract;
			dicSets[Etc.Fields.Maintenance_MaintenanceBeginDate] = obj.Maintenance_MaintenanceBeginDate;
			dicSets[Etc.Fields.Maintenance_MaintenanceEndDate] = obj.Maintenance_MaintenanceEndDate;
			dicSets[Etc.Fields.HW_ModelName] = obj.HW_ModelName;
			dicSets[Etc.Fields.HW_Company] = obj.HW_Company;
			dicSets[Etc.Fields.HW_SerialNumber] = obj.HW_SerialNumber;
			dicSets[Etc.Fields.HW_FirmwareVersion] = obj.HW_FirmwareVersion;
			dicSets[Etc.Fields.HW_MultiLicense] = obj.HW_MultiLicense;
			dicSets[Etc.Fields.HW_MicCount] = obj.HW_MicCount;
			dicSets[Etc.Fields.HW_PAD] = obj.HW_PAD;
			dicSets[Etc.Fields.HW_Rack] = obj.HW_Rack;
			dicSets[Etc.Fields.HW_MonitorModelName] = obj.HW_MonitorModelName;
			dicSets[Etc.Fields.HW_MonitorType] = obj.HW_MonitorType;
			dicSets[Etc.Fields.HW_MonitorScreenSizeInch] = obj.HW_MonitorScreenSizeInch;
			dicSets[Etc.Fields.HW_ScreenIP] = obj.HW_ScreenIP;
			dicSets[Etc.Fields.HW_HostName] = obj.HW_HostName;
			dicSets[Etc.Fields.HW_QoS] = obj.HW_QoS;
			dicSets[Etc.Fields.HW_QosVolume] = obj.HW_QosVolume;
			dicSets[Etc.Fields.HW_PrivateLine] = obj.HW_PrivateLine;
			dicSets[Etc.Fields.HW_PrivateCompanyBW] = obj.HW_PrivateCompanyBW;
			dicSets[Etc.Fields.HW_Special] = obj.HW_Special;
			dicSets[Etc.Fields.Connect_NWEquip_1] = obj.Connect_NWEquip_1;
			dicSets[Etc.Fields.Connect_NWEquip_2] = obj.Connect_NWEquip_2;

			Dictionary<Etc.Fields, object> dicConditions = new Dictionary<Etc.Fields, object>();
			dicConditions[Etc.Fields.Basic_Name] = obj.Basic_Name;
			dicConditions[Etc.Fields.DataCenterID] = obj.DataCenterID;

			return UpdateEtc(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateEtc(Dictionary<Etc.Fields, object> dicSets, Dictionary<Etc.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<Etc.Fields>(ref strSets, dicSets, Etc.GetFieldName, Etc.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<Etc.Fields>(ref strCondition, dicConditions, Etc.GetFieldName, Etc.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(Etc.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateNetwork(Network obj, out string strErrorMessage)
		{
			Dictionary<Network.Fields, object> dicSets = new Dictionary<Network.Fields, object>();
			dicSets[Network.Fields.NetworkID] = obj.NetworkID;
			dicSets[Network.Fields.Basic_Status] = obj.Basic_Status;
			dicSets[Network.Fields.Basic_RegDate] = obj.Basic_RegDate;
			dicSets[Network.Fields.Basic_Usage] = obj.Basic_Usage;
			dicSets[Network.Fields.Basic_EquipDetailClass] = obj.Basic_EquipDetailClass;
			dicSets[Network.Fields.Basic_ItemLevel] = obj.Basic_ItemLevel;
			dicSets[Network.Fields.Basic_ReceiveDate] = obj.Basic_ReceiveDate;
			dicSets[Network.Fields.Basic_OwnerCompanyName] = obj.Basic_OwnerCompanyName;
			dicSets[Network.Fields.Basic_OwnDepartment] = obj.Basic_OwnDepartment;
			dicSets[Network.Fields.Basic_OperationDepartment] = obj.Basic_OperationDepartment;
			dicSets[Network.Fields.Basic_OverUsedYear] = obj.Basic_OverUsedYear;
			dicSets[Network.Fields.Basic_Stock] = obj.Basic_Stock;
			dicSets[Network.Fields.Basic_Type1] = obj.Basic_Type1;
			dicSets[Network.Fields.Basic_Type2] = obj.Basic_Type2;
			dicSets[Network.Fields.Basic_Memo] = obj.Basic_Memo;
			dicSets[Network.Fields.Manage_SuperviseManager] = obj.Manage_SuperviseManager;
			dicSets[Network.Fields.Manage_OperationManager] = obj.Manage_OperationManager;
			dicSets[Network.Fields.Position_InstallRegion] = obj.Position_InstallRegion;
			dicSets[Network.Fields.Position_RackDetailPosition] = obj.Position_RackDetailPosition;
			dicSets[Network.Fields.Maintenance_ProvideCompanyName] = obj.Maintenance_ProvideCompanyName;
			dicSets[Network.Fields.Maintenance_WarrantyMonth] = obj.Maintenance_WarrantyMonth;
			dicSets[Network.Fields.Maintenance_WarrantyExpiredDate] = obj.Maintenance_WarrantyExpiredDate;
			dicSets[Network.Fields.Maintenance_MaintenanceCompanyName] = obj.Maintenance_MaintenanceCompanyName;
			dicSets[Network.Fields.Maintenance_EOSDate] = obj.Maintenance_EOSDate;
			dicSets[Network.Fields.Maintenance_EOLDate] = obj.Maintenance_EOLDate;
			dicSets[Network.Fields.Maintenance_MaintenanceContract] = obj.Maintenance_MaintenanceContract;
			dicSets[Network.Fields.Maintenance_MaintenanceBeginDate] = obj.Maintenance_MaintenanceBeginDate;
			dicSets[Network.Fields.Maintenance_MaintenanceEndDate] = obj.Maintenance_MaintenanceEndDate;
			dicSets[Network.Fields.HW_ModelName] = obj.HW_ModelName;
			dicSets[Network.Fields.HW_Company] = obj.HW_Company;
			dicSets[Network.Fields.HW_SerialNumber] = obj.HW_SerialNumber;
			dicSets[Network.Fields.HW_OSVersion] = obj.HW_OSVersion;
			dicSets[Network.Fields.HW_IP_01] = obj.HW_IP_01;
			dicSets[Network.Fields.HW_IP_02] = obj.HW_IP_02;
			dicSets[Network.Fields.HW_IP_03] = obj.HW_IP_03;
			dicSets[Network.Fields.HW_IP_04] = obj.HW_IP_04;
			dicSets[Network.Fields.HW_IP_05] = obj.HW_IP_05;
			dicSets[Network.Fields.HW_IP_06] = obj.HW_IP_06;
			dicSets[Network.Fields.HW_IP_07] = obj.HW_IP_07;
			dicSets[Network.Fields.HW_IP_08] = obj.HW_IP_08;
			dicSets[Network.Fields.HW_Rack] = obj.HW_Rack;
			dicSets[Network.Fields.HW_PowerDual] = obj.HW_PowerDual;
			dicSets[Network.Fields.HW_Zone] = obj.HW_Zone;
			dicSets[Network.Fields.HW_DetailUsage] = obj.HW_DetailUsage;
			dicSets[Network.Fields.HW_NMS] = obj.HW_NMS;
			dicSets[Network.Fields.HW_NWLineName] = obj.HW_NWLineName;
			dicSets[Network.Fields.Connect_NWEquip_1] = obj.Connect_NWEquip_1;
			dicSets[Network.Fields.Connect_NWEquip_2] = obj.Connect_NWEquip_2;
			dicSets[Network.Fields.Connect_NWEquip_3] = obj.Connect_NWEquip_3;
			dicSets[Network.Fields.Connect_NWEquip_4] = obj.Connect_NWEquip_4;

			Dictionary<Network.Fields, object> dicConditions = new Dictionary<Network.Fields, object>();
			dicConditions[Network.Fields.Basic_Name] = obj.Basic_Name;
			dicConditions[Network.Fields.DataCenterID] = obj.DataCenterID;

			return UpdateNetwork(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateNetwork(Dictionary<Network.Fields, object> dicSets, Dictionary<Network.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<Network.Fields>(ref strSets, dicSets, Network.GetFieldName, Network.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<Network.Fields>(ref strCondition, dicConditions, Network.GetFieldName, Network.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(Network.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateSanSwitch(SanSwitch obj, out string strErrorMessage)
		{
			Dictionary<SanSwitch.Fields, object> dicSets = new Dictionary<SanSwitch.Fields, object>();
			dicSets[SanSwitch.Fields.SwitchID] = obj.SwitchID;
			dicSets[SanSwitch.Fields.Basic_Status] = obj.Basic_Status;
			dicSets[SanSwitch.Fields.Basic_RegDate] = obj.Basic_RegDate;
			dicSets[SanSwitch.Fields.Basic_Usage] = obj.Basic_Usage;
			dicSets[SanSwitch.Fields.Basic_ReceiveDate] = obj.Basic_ReceiveDate;
			dicSets[SanSwitch.Fields.Basic_ItemLevel] = obj.Basic_ItemLevel;
			dicSets[SanSwitch.Fields.Basic_OwnerCompanyName] = obj.Basic_OwnerCompanyName;
			dicSets[SanSwitch.Fields.Basic_OwnDepartment] = obj.Basic_OwnDepartment;
			dicSets[SanSwitch.Fields.Basic_OperationDepartment] = obj.Basic_OperationDepartment;
			dicSets[SanSwitch.Fields.Basic_Memo] = obj.Basic_Memo;
			dicSets[SanSwitch.Fields.Manage_SuperviseManager] = obj.Manage_SuperviseManager;
			dicSets[SanSwitch.Fields.Manage_OperationManager] = obj.Manage_OperationManager;
			dicSets[SanSwitch.Fields.Position_InstallRegion] = obj.Position_InstallRegion;
			dicSets[SanSwitch.Fields.Position_RackDetailPosition] = obj.Position_RackDetailPosition;
			dicSets[SanSwitch.Fields.Maintenance_ProvideCompanyName] = obj.Maintenance_ProvideCompanyName;
			dicSets[SanSwitch.Fields.Maintenance_WarrantyMonth] = obj.Maintenance_WarrantyMonth;
			dicSets[SanSwitch.Fields.Maintenance_WarrantyExpiredDate] = obj.Maintenance_WarrantyExpiredDate;
			dicSets[SanSwitch.Fields.Maintenance_MaintenanceCompanyName] = obj.Maintenance_MaintenanceCompanyName;
			dicSets[SanSwitch.Fields.Maintenance_EOSDate] = obj.Maintenance_EOSDate;
			dicSets[SanSwitch.Fields.Maintenance_MaintenanceContract] = obj.Maintenance_MaintenanceContract;
			dicSets[SanSwitch.Fields.Maintenance_MaintenanceBeginDate] = obj.Maintenance_MaintenanceBeginDate;
			dicSets[SanSwitch.Fields.Maintenance_MaintenanceEndDate] = obj.Maintenance_MaintenanceEndDate;
			dicSets[SanSwitch.Fields.HW_ModelName] = obj.HW_ModelName;
			dicSets[SanSwitch.Fields.HW_Company] = obj.HW_Company;
			dicSets[SanSwitch.Fields.HW_SerialNumber] = obj.HW_SerialNumber;
			dicSets[SanSwitch.Fields.HW_FirmwareVersion] = obj.HW_FirmwareVersion;
			dicSets[SanSwitch.Fields.HW_Dual] = obj.HW_Dual;
			dicSets[SanSwitch.Fields.HW_DualSanSwitchName] = obj.HW_DualSanSwitchName;
			dicSets[SanSwitch.Fields.HW_InterfaceType] = obj.HW_InterfaceType;
			dicSets[SanSwitch.Fields.HW_Interface] = obj.HW_Interface;
			dicSets[SanSwitch.Fields.HW_FCPortCount] = obj.HW_FCPortCount;
			dicSets[SanSwitch.Fields.HW_FCPortUseCount] = obj.HW_FCPortUseCount;
			dicSets[SanSwitch.Fields.HW_FCPortFree] = obj.HW_FCPortFree;
			dicSets[SanSwitch.Fields.HW_GBICPortCount] = obj.HW_GBICPortCount;
			dicSets[SanSwitch.Fields.HW_DualBoxSerial] = obj.HW_DualBoxSerial;
			dicSets[SanSwitch.Fields.HW_SecurityType] = obj.HW_SecurityType;
			dicSets[SanSwitch.Fields.HW_FanCount] = obj.HW_FanCount;
			dicSets[SanSwitch.Fields.HW_FanDual] = obj.HW_FanDual;
			dicSets[SanSwitch.Fields.HW_PowerSupplyDual] = obj.HW_PowerSupplyDual;
			dicSets[SanSwitch.Fields.HW_ConnectPDUDual] = obj.HW_ConnectPDUDual;
			dicSets[SanSwitch.Fields.Dual_RackPowerDualUse] = obj.Dual_RackPowerDualUse;

			Dictionary<SanSwitch.Fields, object> dicConditions = new Dictionary<SanSwitch.Fields, object>();
			dicConditions[SanSwitch.Fields.Basic_Name] = obj.Basic_Name;
			dicConditions[SanSwitch.Fields.DataCenterID] = obj.DataCenterID;

			return UpdateSanSwitch(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateSanSwitch(Dictionary<SanSwitch.Fields, object> dicSets, Dictionary<SanSwitch.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<SanSwitch.Fields>(ref strSets, dicSets, SanSwitch.GetFieldName, SanSwitch.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<SanSwitch.Fields>(ref strCondition, dicConditions, SanSwitch.GetFieldName, SanSwitch.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(SanSwitch.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateSecurity(Security obj, out string strErrorMessage)
		{
			Dictionary<Security.Fields, object> dicSets = new Dictionary<Security.Fields, object>();
			dicSets[Security.Fields.SecurityID] = obj.SecurityID;
			dicSets[Security.Fields.Basic_Status] = obj.Basic_Status;
			dicSets[Security.Fields.Basic_RegDate] = obj.Basic_RegDate;
			dicSets[Security.Fields.Basic_Usage] = obj.Basic_Usage;
			dicSets[Security.Fields.Basic_EquipType] = obj.Basic_EquipType;
			dicSets[Security.Fields.Basic_EquipDetailClass] = obj.Basic_EquipDetailClass;
			dicSets[Security.Fields.Basic_ReceiveDate] = obj.Basic_ReceiveDate;
			dicSets[Security.Fields.Basic_ItemLevel] = obj.Basic_ItemLevel;
			dicSets[Security.Fields.Basic_OwnerCompanyName] = obj.Basic_OwnerCompanyName;
			dicSets[Security.Fields.Basic_OwnDepartment] = obj.Basic_OwnDepartment;
			dicSets[Security.Fields.Basic_OperationDepartment] = obj.Basic_OperationDepartment;
			dicSets[Security.Fields.Basic_Memo] = obj.Basic_Memo;
			dicSets[Security.Fields.Manage_SuperviseManager] = obj.Manage_SuperviseManager;
			dicSets[Security.Fields.Manage_OperationManager] = obj.Manage_OperationManager;
			dicSets[Security.Fields.Position_InstallRegion] = obj.Position_InstallRegion;
			dicSets[Security.Fields.Position_RackDetailPosition] = obj.Position_RackDetailPosition;
			dicSets[Security.Fields.Maintenance_ProvideCompanyName] = obj.Maintenance_ProvideCompanyName;
			dicSets[Security.Fields.Maintenance_WarrantyMonth] = obj.Maintenance_WarrantyMonth;
			dicSets[Security.Fields.Maintenance_WarrantyExpiredDate] = obj.Maintenance_WarrantyExpiredDate;
			dicSets[Security.Fields.Maintenance_MaintenanceCompanyName] = obj.Maintenance_MaintenanceCompanyName;
			dicSets[Security.Fields.Maintenance_EOSDate] = obj.Maintenance_EOSDate;
			dicSets[Security.Fields.Maintenance_MaintenanceContract] = obj.Maintenance_MaintenanceContract;
			dicSets[Security.Fields.Maintenance_MaintenanceBeginDate] = obj.Maintenance_MaintenanceBeginDate;
			dicSets[Security.Fields.Maintenance_MaintenanceEndDate] = obj.Maintenance_MaintenanceEndDate;
			dicSets[Security.Fields.HW_ModelName] = obj.HW_ModelName;
			dicSets[Security.Fields.HW_Company] = obj.HW_Company;
			dicSets[Security.Fields.HW_SerialNumber] = obj.HW_SerialNumber;
			dicSets[Security.Fields.HW_FirmwareVersion] = obj.HW_FirmwareVersion;
			dicSets[Security.Fields.HW_IP] = obj.HW_IP;
			dicSets[Security.Fields.Connect_NWEquip_1] = obj.Connect_NWEquip_1;
			dicSets[Security.Fields.Connect_NWEquip_2] = obj.Connect_NWEquip_2;

			Dictionary<Security.Fields, object> dicConditions = new Dictionary<Security.Fields, object>();
			dicConditions[Security.Fields.Basic_Name] = obj.Basic_Name;
			dicConditions[Security.Fields.DataCenterID] = obj.DataCenterID;

			return UpdateSecurity(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateSecurity(Dictionary<Security.Fields, object> dicSets, Dictionary<Security.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<Security.Fields>(ref strSets, dicSets, Security.GetFieldName, Security.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<Security.Fields>(ref strCondition, dicConditions, Security.GetFieldName, Security.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(Security.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateStorage(Storage obj, out string strErrorMessage)
		{
			Dictionary<Storage.Fields, object> dicSets = new Dictionary<Storage.Fields, object>();
			dicSets[Storage.Fields.StorageID] = obj.StorageID;
			dicSets[Storage.Fields.Basic_Status] = obj.Basic_Status;
			dicSets[Storage.Fields.Basic_RegDate] = obj.Basic_RegDate;
			dicSets[Storage.Fields.Basic_Usage] = obj.Basic_Usage;
			dicSets[Storage.Fields.Basic_ItemLevel] = obj.Basic_ItemLevel;
			dicSets[Storage.Fields.Basic_ReceiveDate] = obj.Basic_ReceiveDate;
			dicSets[Storage.Fields.Basic_ReceiveYears] = obj.Basic_ReceiveYears;
			dicSets[Storage.Fields.Basic_OwnerCompanyName] = obj.Basic_OwnerCompanyName;
			dicSets[Storage.Fields.Basic_OwnDepartment] = obj.Basic_OwnDepartment;
			dicSets[Storage.Fields.Basic_OperationDepartment] = obj.Basic_OperationDepartment;
			dicSets[Storage.Fields.Basic_SiteManager] = obj.Basic_SiteManager;
			dicSets[Storage.Fields.Basic_DiscardDate] = obj.Basic_DiscardDate;
			dicSets[Storage.Fields.Basic_OverUsedYear] = obj.Basic_OverUsedYear;
			dicSets[Storage.Fields.Basic_Memo] = obj.Basic_Memo;
			dicSets[Storage.Fields.Manage_SuperviseManager] = obj.Manage_SuperviseManager;
			dicSets[Storage.Fields.Manage_OperationManager] = obj.Manage_OperationManager;
			dicSets[Storage.Fields.Position_InstallRegion] = obj.Position_InstallRegion;
			dicSets[Storage.Fields.Position_RackDetailPosition] = obj.Position_RackDetailPosition;
			dicSets[Storage.Fields.Maintenance_ProvideCompanyName] = obj.Maintenance_ProvideCompanyName;
			dicSets[Storage.Fields.Maintenance_WarrantyMonth] = obj.Maintenance_WarrantyMonth;
			dicSets[Storage.Fields.Maintenance_WarrantyExpiredDate] = obj.Maintenance_WarrantyExpiredDate;
			dicSets[Storage.Fields.Maintenance_MaintenanceCompanyName] = obj.Maintenance_MaintenanceCompanyName;
			dicSets[Storage.Fields.Maintenance_EOSDate] = obj.Maintenance_EOSDate;
			dicSets[Storage.Fields.Maintenance_EOLDate] = obj.Maintenance_EOLDate;
			dicSets[Storage.Fields.Maintenance_EOSL] = obj.Maintenance_EOSL;
			dicSets[Storage.Fields.Maintenance_EOSLDate] = obj.Maintenance_EOSLDate;
			dicSets[Storage.Fields.Maintenance_MaintenanceContract] = obj.Maintenance_MaintenanceContract;
			dicSets[Storage.Fields.Maintenance_MaintenanceBeginDate] = obj.Maintenance_MaintenanceBeginDate;
			dicSets[Storage.Fields.Maintenance_MaintenanceEndDate] = obj.Maintenance_MaintenanceEndDate;
			dicSets[Storage.Fields.HW_ModelName] = obj.HW_ModelName;
			dicSets[Storage.Fields.HW_Company] = obj.HW_Company;
			dicSets[Storage.Fields.HW_CacheMemory] = obj.HW_CacheMemory;
			dicSets[Storage.Fields.HW_SerialNumber] = obj.HW_SerialNumber;
			dicSets[Storage.Fields.HW_DiskType] = obj.HW_DiskType;
			dicSets[Storage.Fields.HW_ControllerFirmwareVersion] = obj.HW_ControllerFirmwareVersion;
			dicSets[Storage.Fields.HW_TotalPhysicalVolume] = obj.HW_TotalPhysicalVolume;
			dicSets[Storage.Fields.HW_TotalUsableVolume] = obj.HW_TotalUsableVolume;
			dicSets[Storage.Fields.HW_LogicalVolumeGB] = obj.HW_LogicalVolumeGB;
			dicSets[Storage.Fields.HW_FreeVolumeGB] = obj.HW_FreeVolumeGB;
			dicSets[Storage.Fields.HW_MultiPath] = obj.HW_MultiPath;
			dicSets[Storage.Fields.HW_MultiPathPropertyName] = obj.HW_MultiPathPropertyName;
			dicSets[Storage.Fields.HW_AvailableVolume] = obj.HW_AvailableVolume;
			dicSets[Storage.Fields.HW_GivenVolumeGB] = obj.HW_GivenVolumeGB;
			dicSets[Storage.Fields.HW_GivenRate] = obj.HW_GivenRate;
			dicSets[Storage.Fields.Dual_DualUse] = obj.Dual_DualUse;
			dicSets[Storage.Fields.Dual_DualType] = obj.Dual_DualType;
			dicSets[Storage.Fields.Dual_BoxDualUse] = obj.Dual_BoxDualUse;
			dicSets[Storage.Fields.Dual_BoxDualDiskEquipmentName] = obj.Dual_BoxDualDiskEquipmentName;
			dicSets[Storage.Fields.Dual_BoxDualSolutionName] = obj.Dual_BoxDualSolutionName;
			dicSets[Storage.Fields.Dual_ControllerDualUse] = obj.Dual_ControllerDualUse;
			dicSets[Storage.Fields.Dual_PowerDualUse] = obj.Dual_PowerDualUse;
			dicSets[Storage.Fields.Dual_PDUDualUse] = obj.Dual_PDUDualUse;
			dicSets[Storage.Fields.Dual_RackPowerDualUse] = obj.Dual_RackPowerDualUse;
			dicSets[Storage.Fields.Dual_InternalCopySWUse] = obj.Dual_InternalCopySWUse;
			dicSets[Storage.Fields.Dual_StorageCopyUse] = obj.Dual_StorageCopyUse;
			dicSets[Storage.Fields.Dual_StorageCopyType] = obj.Dual_StorageCopyType;
			dicSets[Storage.Fields.Volume_RegDate] = obj.Volume_RegDate;
			dicSets[Storage.Fields.Volume_DiskType] = obj.Volume_DiskType;
			dicSets[Storage.Fields.Volume_EachDiskVolume] = obj.Volume_EachDiskVolume;
			dicSets[Storage.Fields.Volume_DiskCount] = obj.Volume_DiskCount;
			dicSets[Storage.Fields.Volume_PhysicalVolume] = obj.Volume_PhysicalVolume;
			dicSets[Storage.Fields.Volume_UsableVolume] = obj.Volume_UsableVolume;
			dicSets[Storage.Fields.Volume_RaidSystem] = obj.Volume_RaidSystem;
			dicSets[Storage.Fields.Extra_DiskType] = obj.Extra_DiskType;
			dicSets[Storage.Fields.Extra_DiskVolume] = obj.Extra_DiskVolume;
			dicSets[Storage.Fields.Extra_DiskCount] = obj.Extra_DiskCount;
			dicSets[Storage.Fields.IP_IPType] = obj.IP_IPType;
			dicSets[Storage.Fields.IP_IPAddress] = obj.IP_IPAddress;
			dicSets[Storage.Fields.IP_NetworkSpeed] = obj.IP_NetworkSpeed;
			dicSets[Storage.Fields.Port_TotalPortCount] = obj.Port_TotalPortCount;
			dicSets[Storage.Fields.Port_UsePortCount] = obj.Port_UsePortCount;
			dicSets[Storage.Fields.Port_LinkedSanSwitch] = obj.Port_LinkedSanSwitch;
			dicSets[Storage.Fields.Port_ReceiveDate] = obj.Port_ReceiveDate;
			dicSets[Storage.Fields.Port_Count] = obj.Port_Count;
			dicSets[Storage.Fields.Connect_ServerName] = obj.Connect_ServerName;
			dicSets[Storage.Fields.Connect_Usage] = obj.Connect_Usage;
			dicSets[Storage.Fields.Connect_ServiceLevel] = obj.Connect_ServiceLevel;
			dicSets[Storage.Fields.Connect_ModelName] = obj.Connect_ModelName;
			dicSets[Storage.Fields.Connect_OS] = obj.Connect_OS;
			dicSets[Storage.Fields.Connect_Cable] = obj.Connect_Cable;
			dicSets[Storage.Fields.Connect_GivenVolume] = obj.Connect_GivenVolume;
			dicSets[Storage.Fields.Connect_RealUseVolume] = obj.Connect_RealUseVolume;
			dicSets[Storage.Fields.Connect_EtcVolume] = obj.Connect_EtcVolume;
			dicSets[Storage.Fields.Connect_FreeVolume] = obj.Connect_FreeVolume;
			dicSets[Storage.Fields.Connect_MonthlyIncrease] = obj.Connect_MonthlyIncrease;
			dicSets[Storage.Fields.Connect_ConnectType] = obj.Connect_ConnectType;
			dicSets[Storage.Fields.Connect_ChannelPathCount] = obj.Connect_ChannelPathCount;
			dicSets[Storage.Fields.Connect_PathDualSolution] = obj.Connect_PathDualSolution;
			dicSets[Storage.Fields.Connect_NWEquip_1] = obj.Connect_NWEquip_1;
			dicSets[Storage.Fields.Connect_NWEquip_2] = obj.Connect_NWEquip_2;
			dicSets[Storage.Fields.Connect_NWEquip_3] = obj.Connect_NWEquip_3;
			dicSets[Storage.Fields.Connect_NWEquip_4] = obj.Connect_NWEquip_4;
			dicSets[Storage.Fields.Connect_SanSwitch_1] = obj.Connect_SanSwitch_1;
			dicSets[Storage.Fields.Connect_SanSwitch_2] = obj.Connect_SanSwitch_2;
			dicSets[Storage.Fields.Connect_SanSwitch_3] = obj.Connect_SanSwitch_3;
			dicSets[Storage.Fields.Connect_SanSwitch_4] = obj.Connect_SanSwitch_4;
			dicSets[Storage.Fields.Connect_SanSwitch_5] = obj.Connect_SanSwitch_5;
			dicSets[Storage.Fields.Connect_SanSwitch_6] = obj.Connect_SanSwitch_6;
			dicSets[Storage.Fields.Connect_SanSwitch_7] = obj.Connect_SanSwitch_7;
			dicSets[Storage.Fields.Connect_SanSwitch_8] = obj.Connect_SanSwitch_8;

			Dictionary<Storage.Fields, object> dicConditions = new Dictionary<Storage.Fields, object>();
			dicConditions[Storage.Fields.Basic_Name] = obj.Basic_Name;
			dicConditions[Storage.Fields.DataCenterID] = obj.DataCenterID;

			return UpdateStorage(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateStorage(Dictionary<Storage.Fields, object> dicSets, Dictionary<Storage.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<Storage.Fields>(ref strSets, dicSets, Storage.GetFieldName, Storage.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<Storage.Fields>(ref strCondition, dicConditions, Storage.GetFieldName, Storage.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(Storage.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateItemServer(ItemServer obj, out string strErrorMessage)
		{
			Dictionary<ItemServer.Fields, object> dicSets = new Dictionary<ItemServer.Fields, object>();
			dicSets[ItemServer.Fields.BoxID] = obj.BoxID;
			dicSets[ItemServer.Fields.Basic_ServerCategory] = obj.Basic_ServerCategory;
			dicSets[ItemServer.Fields.Basic_SystemName] = obj.Basic_SystemName;
			dicSets[ItemServer.Fields.Basic_ProductGroup] = obj.Basic_ProductGroup;
			dicSets[ItemServer.Fields.Basic_WorkSystemName] = obj.Basic_WorkSystemName;
			dicSets[ItemServer.Fields.Basic_ServerType] = obj.Basic_ServerType;
			dicSets[ItemServer.Fields.Basic_OperationType] = obj.Basic_OperationType;
			dicSets[ItemServer.Fields.Basic_ServerLevel] = obj.Basic_ServerLevel;
			dicSets[ItemServer.Fields.Basic_ServerLevelYear_1] = obj.Basic_ServerLevelYear_1;
			dicSets[ItemServer.Fields.Basic_ServerLevelYear] = obj.Basic_ServerLevelYear;
			dicSets[ItemServer.Fields.Basic_ReceiveDate] = obj.Basic_ReceiveDate;
			dicSets[ItemServer.Fields.Basic_RegDate] = obj.Basic_RegDate;
			dicSets[ItemServer.Fields.Basic_Status] = obj.Basic_Status;
			dicSets[ItemServer.Fields.Basic_Usage] = obj.Basic_Usage;
			dicSets[ItemServer.Fields.Basic_VirtualType] = obj.Basic_VirtualType;
			dicSets[ItemServer.Fields.Basic_DRType] = obj.Basic_DRType;
			dicSets[ItemServer.Fields.Basic_PropertyType] = obj.Basic_PropertyType;
			dicSets[ItemServer.Fields.Basic_OwnDepartment] = obj.Basic_OwnDepartment;
			dicSets[ItemServer.Fields.Basic_OperationDepartment] = obj.Basic_OperationDepartment;
			dicSets[ItemServer.Fields.Basic_GIMS] = obj.Basic_GIMS;
			dicSets[ItemServer.Fields.Manage_SuperviseManager] = obj.Manage_SuperviseManager;
			dicSets[ItemServer.Fields.Manage_OperationManager] = obj.Manage_OperationManager;
			dicSets[ItemServer.Fields.Manage_ServiceManager] = obj.Manage_ServiceManager;
			dicSets[ItemServer.Fields.Position_InstallRegion] = obj.Position_InstallRegion;
			dicSets[ItemServer.Fields.Position_Region] = obj.Position_Region;
			dicSets[ItemServer.Fields.Position_RackDetailPosition] = obj.Position_RackDetailPosition;
			dicSets[ItemServer.Fields.HW_OSType] = obj.HW_OSType;
			dicSets[ItemServer.Fields.HW_OS] = obj.HW_OS;
			dicSets[ItemServer.Fields.HW_OSVersion] = obj.HW_OSVersion;
			dicSets[ItemServer.Fields.HW_OSPatchLevel] = obj.HW_OSPatchLevel;
			dicSets[ItemServer.Fields.HW_OSInstallDate] = obj.HW_OSInstallDate;
			dicSets[ItemServer.Fields.HW_OSAccountID] = obj.HW_OSAccountID;
			dicSets[ItemServer.Fields.HW_KernelBit] = obj.HW_KernelBit;
			dicSets[ItemServer.Fields.HW_EOS] = obj.HW_EOS;
			dicSets[ItemServer.Fields.HW_EOSDate] = obj.HW_EOSDate;
			dicSets[ItemServer.Fields.HW_AccountTPAM] = obj.HW_AccountTPAM;
			dicSets[ItemServer.Fields.HW_LogicalCoreCount] = obj.HW_LogicalCoreCount;
			dicSets[ItemServer.Fields.HW_UsableDiskVolumeGB] = obj.HW_UsableDiskVolumeGB;
			dicSets[ItemServer.Fields.HW_LogicalMemoryVolumeMB] = obj.HW_LogicalMemoryVolumeMB;
			dicSets[ItemServer.Fields.HW_NetworkSpeed] = obj.HW_NetworkSpeed;
			dicSets[ItemServer.Fields.HW_ServerDual] = obj.HW_ServerDual;
			dicSets[ItemServer.Fields.Dual_DualType] = obj.Dual_DualType;
			dicSets[ItemServer.Fields.Dual_DualSolutionVM] = obj.Dual_DualSolutionVM;
			dicSets[ItemServer.Fields.Dual_DualSolutionService] = obj.Dual_DualSolutionService;
			dicSets[ItemServer.Fields.Dual_DualServerVM] = obj.Dual_DualServerVM;
			dicSets[ItemServer.Fields.SW_AccountManage] = obj.SW_AccountManage;
			dicSets[ItemServer.Fields.SW_ServerAccessInstall] = obj.SW_ServerAccessInstall;
			dicSets[ItemServer.Fields.SW_DCA] = obj.SW_DCA;
			dicSets[ItemServer.Fields.SW_VaccineInstall] = obj.SW_VaccineInstall;
			dicSets[ItemServer.Fields.SW_InstallVaccineName] = obj.SW_InstallVaccineName;
			dicSets[ItemServer.Fields.SW_InstallSWName] = obj.SW_InstallSWName;
			dicSets[ItemServer.Fields.NW_Zone] = obj.NW_Zone;
			dicSets[ItemServer.Fields.NW_ServiceIPAddr] = obj.NW_ServiceIPAddr;
			dicSets[ItemServer.Fields.NW_ServiceIPDual] = obj.NW_ServiceIPDual;
			dicSets[ItemServer.Fields.NW_HeartBeatIPAddr] = obj.NW_HeartBeatIPAddr;
			dicSets[ItemServer.Fields.NW_HeartBeatIPDual] = obj.NW_HeartBeatIPDual;
			dicSets[ItemServer.Fields.NW_BackupIPAddr] = obj.NW_BackupIPAddr;
			dicSets[ItemServer.Fields.NW_BackIPDual] = obj.NW_BackIPDual;
			dicSets[ItemServer.Fields.NW_ManageIPAddr] = obj.NW_ManageIPAddr;
			dicSets[ItemServer.Fields.NW_ManageIPDual] = obj.NW_ManageIPDual;
			dicSets[ItemServer.Fields.NW_Etc1IPAddr] = obj.NW_Etc1IPAddr;
			dicSets[ItemServer.Fields.NW_Etc1IPAddrDual] = obj.NW_Etc1IPAddrDual;
			dicSets[ItemServer.Fields.NW_Etc2IPAddr] = obj.NW_Etc2IPAddr;
			dicSets[ItemServer.Fields.NW_Etc2IPDual] = obj.NW_Etc2IPDual;
			dicSets[ItemServer.Fields.Backup_InternalOSBackup] = obj.Backup_InternalOSBackup;
			dicSets[ItemServer.Fields.Backup_InternalOSBackupSW] = obj.Backup_InternalOSBackupSW;
			dicSets[ItemServer.Fields.Backup_ExternalBackupRun] = obj.Backup_ExternalBackupRun;
			dicSets[ItemServer.Fields.Backup_ExternalBackupSWType] = obj.Backup_ExternalBackupSWType;
			dicSets[ItemServer.Fields.Backup_ExternalRemote] = obj.Backup_ExternalRemote;
			dicSets[ItemServer.Fields.Backup_ExternalRemotePosition] = obj.Backup_ExternalRemotePosition;
			dicSets[ItemServer.Fields.BoxName] = obj.BoxName;

			Dictionary<ItemServer.Fields, object> dicConditions = new Dictionary<ItemServer.Fields, object>();
			dicConditions[ItemServer.Fields.Basic_ServerName] = obj.Basic_ServerName;
			dicConditions[ItemServer.Fields.DataCenterID] = obj.DataCenterID;

			return UpdateItemServer(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateItemServer(Dictionary<ItemServer.Fields, object> dicSets, Dictionary<ItemServer.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<ItemServer.Fields>(ref strSets, dicSets, ItemServer.GetFieldName, ItemServer.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<ItemServer.Fields>(ref strCondition, dicConditions, ItemServer.GetFieldName, ItemServer.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(ItemServer.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool UpdateNation(Nation obj, out string strErrorMessage)
		{
			Dictionary<Nation.Fields, object> dicSets = new Dictionary<Nation.Fields, object>();
			dicSets[Nation.Fields.Name] = obj.Name;
			dicSets[Nation.Fields.EngName] = obj.EngName;
			dicSets[Nation.Fields.Tag1] = obj.Tag1;
			dicSets[Nation.Fields.Tag2] = obj.Tag2;

			Dictionary<Nation.Fields, object> dicConditions = new Dictionary<Nation.Fields, object>();
			dicConditions[Nation.Fields.ID] = obj.ID;

			return UpdateNation(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateNation(Dictionary<Nation.Fields, object> dicSets, Dictionary<Nation.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<Nation.Fields>(ref strSets, dicSets, Nation.GetFieldName, Nation.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<Nation.Fields>(ref strCondition, dicConditions, Nation.GetFieldName, Nation.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(Nation.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateRack(Rack obj, out string strErrorMessage)
		{
			Dictionary<Rack.Fields, object> dicSets = new Dictionary<Rack.Fields, object>();
			dicSets[Rack.Fields.Name] = obj.Name;
			dicSets[Rack.Fields.CenterID] = obj.CenterID;
			dicSets[Rack.Fields.RackGroupID] = obj.RackGroupID;
			dicSets[Rack.Fields.RackTypeID] = obj.RackTypeID;
			dicSets[Rack.Fields.Rotation] = obj.Rotation;
			dicSets[Rack.Fields.X] = obj.X;
			dicSets[Rack.Fields.Y] = obj.Y;
			dicSets[Rack.Fields.Z] = obj.Z;
			dicSets[Rack.Fields.RegDate] = obj.RegDate;
			dicSets[Rack.Fields.ChangeDate] = obj.ChangeDate;

			Dictionary<Rack.Fields, object> dicConditions = new Dictionary<Rack.Fields, object>();
			dicConditions[Rack.Fields.ID] = obj.ID;

			return UpdateRack(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateRack(Dictionary<Rack.Fields, object> dicSets, Dictionary<Rack.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<Rack.Fields>(ref strSets, dicSets, Rack.GetFieldName, Rack.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<Rack.Fields>(ref strCondition, dicConditions, Rack.GetFieldName, Rack.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(Rack.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateRackType(RackType obj, out string strErrorMessage)
		{
			Dictionary<RackType.Fields, object> dicSets = new Dictionary<RackType.Fields, object>();
			dicSets[RackType.Fields.CompanyID] = obj.CompanyID;
			dicSets[RackType.Fields.ModelName] = obj.ModelName;
			dicSets[RackType.Fields.Height] = obj.Height;
			dicSets[RackType.Fields.Width] = obj.Width;
			dicSets[RackType.Fields.Depth] = obj.Depth;
			dicSets[RackType.Fields.Unit] = obj.Unit;
			dicSets[RackType.Fields.Type] = obj.Type;
			dicSets[RackType.Fields.ColorName] = obj.ColorName;
			dicSets[RackType.Fields.ColorEngName] = obj.ColorEngName;
			dicSets[RackType.Fields.ImageUrl] = obj.ImageUrl;
			dicSets[RackType.Fields.GlbUrl] = obj.GlbUrl;
			dicSets[RackType.Fields.FbxUrl] = obj.FbxUrl;
			dicSets[RackType.Fields.Memo] = obj.Memo;
			dicSets[RackType.Fields.RegDate] = obj.RegDate;
			dicSets[RackType.Fields.ChangeDate] = obj.ChangeDate;

			Dictionary<RackType.Fields, object> dicConditions = new Dictionary<RackType.Fields, object>();
			dicConditions[RackType.Fields.ID] = obj.ID;

			return UpdateRackType(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateRackType(Dictionary<RackType.Fields, object> dicSets, Dictionary<RackType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<RackType.Fields>(ref strSets, dicSets, RackType.GetFieldName, RackType.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<RackType.Fields>(ref strCondition, dicConditions, RackType.GetFieldName, RackType.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(RackType.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool UpdateRackGroup(RackGroup obj, out string strErrorMessage)
		{
			Dictionary<RackGroup.Fields, object> dicSets = new Dictionary<RackGroup.Fields, object>();
			dicSets[RackGroup.Fields.CenterID] = obj.CenterID;
			dicSets[RackGroup.Fields.GroupName] = obj.GroupName;

			Dictionary<RackGroup.Fields, object> dicConditions = new Dictionary<RackGroup.Fields, object>();
			dicConditions[RackGroup.Fields.ID] = obj.ID;

			return UpdateRackGroup(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateRackGroup(Dictionary<RackGroup.Fields, object> dicSets, Dictionary<RackGroup.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<RackGroup.Fields>(ref strSets, dicSets, RackGroup.GetFieldName, RackGroup.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<RackGroup.Fields>(ref strCondition, dicConditions, RackGroup.GetFieldName, RackGroup.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(RackGroup.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool UpdateSite(Model.Site.Site obj, out string strErrorMessage)
		{
			Dictionary<Model.Site.Site.Fields, object> dicSets = new Dictionary<Model.Site.Site.Fields, object>();
			dicSets[Model.Site.Site.Fields.Name] = obj.Name;
			dicSets[Model.Site.Site.Fields.EngName] = obj.EngName;

			Dictionary<Model.Site.Site.Fields, object> dicConditions = new Dictionary<Model.Site.Site.Fields, object>();
			dicConditions[Model.Site.Site.Fields.ID] = obj.ID;

			return UpdateSite(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateSite(Dictionary<Model.Site.Site.Fields, object> dicSets, Dictionary<Model.Site.Site.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<Model.Site.Site.Fields>(ref strSets, dicSets, Model.Site.Site.GetFieldName, Model.Site.Site.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<Model.Site.Site.Fields>(ref strCondition, dicConditions, Model.Site.Site.GetFieldName, Model.Site.Site.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(Model.Site.Site.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool UpdateSiteData(Model.Site.Data obj, out string strErrorMessage)
		{
			Dictionary<Model.Site.Data.Fields, object> dicSets = new Dictionary<Model.Site.Data.Fields, object>();
			dicSets[Model.Site.Data.Fields.Address] = obj.Address;
			dicSets[Model.Site.Data.Fields.ManagerTeam] = obj.ManagerTeam;
			dicSets[Model.Site.Data.Fields.Manager] = obj.Manager;
			dicSets[Model.Site.Data.Fields.ServiceBeginDate] = obj.ServiceBeginDate;
			dicSets[Model.Site.Data.Fields.ServiceEndDate] = obj.ServiceEndDate;
			dicSets[Model.Site.Data.Fields.LicenseValidation] = obj.LicenseValidation;

			Dictionary<Model.Site.Data.Fields, object> dicConditions = new Dictionary<Model.Site.Data.Fields, object>();
			dicConditions[Model.Site.Data.Fields.SiteID] = obj.SiteID;

			return UpdateSiteData(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateSiteData(Dictionary<Model.Site.Data.Fields, object> dicSets, Dictionary<Model.Site.Data.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<Model.Site.Data.Fields>(ref strSets, dicSets, Model.Site.Data.GetFieldName, Model.Site.Data.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<Model.Site.Data.Fields>(ref strCondition, dicConditions, Model.Site.Data.GetFieldName, Model.Site.Data.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(Model.Site.Data.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool UpdateSiteOption(Model.Site.Option obj, out string strErrorMessage)
		{
			Dictionary<Model.Site.Option.Fields, object> dicSets = new Dictionary<Model.Site.Option.Fields, object>();
			dicSets[Model.Site.Option.Fields.PropertyValue] = obj.PropertyValue;
			dicSets[Model.Site.Option.Fields.Description] = obj.Description;

			Dictionary<Model.Site.Option.Fields, object> dicConditions = new Dictionary<Model.Site.Option.Fields, object>();
			dicConditions[Model.Site.Option.Fields.PropertyName] = obj.PropertyName;

			return UpdateSiteOption(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateSiteOption(Dictionary<Model.Site.Option.Fields, object> dicSets, Dictionary<Model.Site.Option.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<Model.Site.Option.Fields>(ref strSets, dicSets, Model.Site.Option.GetFieldName, Model.Site.Option.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<Model.Site.Option.Fields>(ref strCondition, dicConditions, Model.Site.Option.GetFieldName, Model.Site.Option.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(Model.Site.Option.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool UpdateFacility(Facility obj, out string strErrorMessage)
		{
			Dictionary<Facility.Fields, object> dicSets = new Dictionary<Facility.Fields, object>();
			dicSets[Facility.Fields.FacilityTypeID] = obj.FacilityTypeID;
			dicSets[Facility.Fields.DataCenterID] = obj.DataCenterID;
			dicSets[Facility.Fields.RegDate] = obj.RegDate;
			dicSets[Facility.Fields.ChangeDate] = obj.ChangeDate;
			dicSets[Facility.Fields.X] = obj.X;
			dicSets[Facility.Fields.Y] = obj.Y;
			dicSets[Facility.Fields.Z] = obj.Z;
			dicSets[Facility.Fields.Rotation] = obj.Rotation;

			Dictionary<Facility.Fields, object> dicConditions = new Dictionary<Facility.Fields, object>();
			dicConditions[Facility.Fields.ID] = obj.ID;

			return UpdateFacility(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateFacility(Dictionary<Facility.Fields, object> dicSets, Dictionary<Facility.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<Facility.Fields>(ref strSets, dicSets, Facility.GetFieldName, Facility.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<Facility.Fields>(ref strCondition, dicConditions, Facility.GetFieldName, Facility.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(Facility.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateFacilityType(FacilityType obj, out string strErrorMessage)
		{
			Dictionary<FacilityType.Fields, object> dicSets = new Dictionary<FacilityType.Fields, object>();
			dicSets[FacilityType.Fields.EquipmentTypeID] = obj.EquipmentTypeID;
			dicSets[FacilityType.Fields.ModelName] = obj.ModelName;
			dicSets[FacilityType.Fields.CompanyID] = obj.CompanyID;
			dicSets[FacilityType.Fields.Width] = obj.Width;
			dicSets[FacilityType.Fields.Depth] = obj.Depth;
			dicSets[FacilityType.Fields.Height] = obj.Height;
			dicSets[FacilityType.Fields.UnitOfLength] = obj.UnitOfLength;
			dicSets[FacilityType.Fields.Color] = obj.Color;
			dicSets[FacilityType.Fields.ImageUrl] = obj.ImageUrl;
			dicSets[FacilityType.Fields.GlbUrl] = obj.GlbUrl;
			dicSets[FacilityType.Fields.FbxUrl] = obj.FbxUrl;
			dicSets[FacilityType.Fields.ClassName] = obj.ClassName;
			dicSets[FacilityType.Fields.Memo] = obj.Memo;
			dicSets[FacilityType.Fields.RegDate] = obj.RegDate;
			dicSets[FacilityType.Fields.ChangeDate] = obj.ChangeDate;

			Dictionary<FacilityType.Fields, object> dicConditions = new Dictionary<FacilityType.Fields, object>();
			dicConditions[FacilityType.Fields.ID] = obj.ID;

			return UpdateFacilityType(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateFacilityType(Dictionary<FacilityType.Fields, object> dicSets, Dictionary<FacilityType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<FacilityType.Fields>(ref strSets, dicSets, FacilityType.GetFieldName, FacilityType.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<FacilityType.Fields>(ref strCondition, dicConditions, FacilityType.GetFieldName, FacilityType.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(FacilityType.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool UpdateSensor(Sensor obj, out string strErrorMessage)
		{
			Dictionary<Sensor.Fields, object> dicSets = new Dictionary<Sensor.Fields, object>();
			dicSets[Sensor.Fields.Name] = obj.Name;
			dicSets[Sensor.Fields.SensorTypeID] = obj.SensorTypeID;
			dicSets[Sensor.Fields.CenterID] = obj.CenterID;
			dicSets[Sensor.Fields.RegDate] = obj.RegDate;
			dicSets[Sensor.Fields.ChangeDate] = obj.ChangeDate;
			dicSets[Sensor.Fields.X] = obj.X;
			dicSets[Sensor.Fields.Y] = obj.Y;
			dicSets[Sensor.Fields.Z] = obj.Z;
			dicSets[Sensor.Fields.Description] = obj.Description;

			Dictionary<Sensor.Fields, object> dicConditions = new Dictionary<Sensor.Fields, object>();
			dicConditions[Sensor.Fields.ID] = obj.ID;

			return UpdateSensor(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateSensor(Dictionary<Sensor.Fields, object> dicSets, Dictionary<Sensor.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
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


		public bool UpdateSensorHistory(History obj, out string strErrorMessage)
		{
			Dictionary<History.Fields, object> dicSets = new Dictionary<History.Fields, object>();
			dicSets[History.Fields.SiteID] = obj.SiteID;
			dicSets[History.Fields.SiteName] = obj.SiteName;
			dicSets[History.Fields.CenterName] = obj.CenterName;
			dicSets[History.Fields.SensorType] = obj.SensorType;
			dicSets[History.Fields.Status] = obj.Status;
			dicSets[History.Fields.Data] = obj.Data;
			dicSets[History.Fields.Unit] = obj.Unit;
			dicSets[History.Fields.Description] = obj.Description;

			Dictionary<History.Fields, object> dicConditions = new Dictionary<History.Fields, object>();
			dicConditions[History.Fields.CenterID] = obj.CenterID;
			dicConditions[History.Fields.SensorName] = obj.SensorName;
			dicConditions[History.Fields.DateStamp] = obj.DateStamp;
			dicConditions[History.Fields.TimeStamp] = obj.TimeStamp;

			return UpdateSensorHistory(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateSensorHistory(Dictionary<History.Fields, object> dicSets, Dictionary<History.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<History.Fields>(ref strSets, dicSets, History.GetFieldName, History.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<History.Fields>(ref strCondition, dicConditions, History.GetFieldName, History.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(History.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateSensorType(SensorType obj, out string strErrorMessage)
		{
			Dictionary<SensorType.Fields, object> dicSets = new Dictionary<SensorType.Fields, object>();
			dicSets[SensorType.Fields.Name] = obj.Name;
			dicSets[SensorType.Fields.EngName] = obj.EngName;
			dicSets[SensorType.Fields.Code] = obj.Code;
			dicSets[SensorType.Fields.RangeMax] = obj.RangeMax;
			dicSets[SensorType.Fields.RangeMin] = obj.RangeMin;
			dicSets[SensorType.Fields.Unit] = obj.Unit;
			dicSets[SensorType.Fields.ImageUrl] = obj.ImageUrl;
			dicSets[SensorType.Fields.AbnormalImageUrl] = obj.AbnormalImageUrl;

			Dictionary<SensorType.Fields, object> dicConditions = new Dictionary<SensorType.Fields, object>();
			dicConditions[SensorType.Fields.ID] = obj.ID;

			return UpdateSensorType(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateSensorType(Dictionary<SensorType.Fields, object> dicSets, Dictionary<SensorType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
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

		public bool UpdateWorkChangeBasic(ChangeBasic obj, out string strErrorMessage)
		{
			Dictionary<ChangeBasic.Fields, object> dicSets = new Dictionary<ChangeBasic.Fields, object>();
			dicSets[ChangeBasic.Fields.Status] = obj.Status;
			dicSets[ChangeBasic.Fields.Title] = obj.Title;
			dicSets[ChangeBasic.Fields.ChangeType] = obj.ChangeType;
			dicSets[ChangeBasic.Fields.ChangeClass] = obj.ChangeClass;
			dicSets[ChangeBasic.Fields.MainWorker] = obj.MainWorker;
			dicSets[ChangeBasic.Fields.ChangeWorkResult] = obj.ChangeWorkResult;
			dicSets[ChangeBasic.Fields.PlanBeginTime] = obj.PlanBeginTime;
			dicSets[ChangeBasic.Fields.PlanEndTime] = obj.PlanEndTime;
			dicSets[ChangeBasic.Fields.WorkBeginTime] = obj.WorkBeginTime;
			dicSets[ChangeBasic.Fields.WorkEndTime] = obj.WorkEndTime;
			dicSets[ChangeBasic.Fields.LinkedChangedWork] = obj.LinkedChangedWork;
			dicSets[ChangeBasic.Fields.Priority] = obj.Priority;
			dicSets[ChangeBasic.Fields.Register] = obj.Register;
			dicSets[ChangeBasic.Fields.RegTime] = obj.RegTime;
			dicSets[ChangeBasic.Fields.WorkData] = obj.WorkData;
			dicSets[ChangeBasic.Fields.DataCenterID] = obj.DataCenterID;
			dicSets[ChangeBasic.Fields.WorkID] = obj.WorkID;

			Dictionary<ChangeBasic.Fields, object> dicConditions = new Dictionary<ChangeBasic.Fields, object>();
			dicConditions[ChangeBasic.Fields.ID] = obj.ID;

			return UpdateWorkChangeBasic(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateWorkChangeBasic(Dictionary<ChangeBasic.Fields, object> dicSets, Dictionary<ChangeBasic.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<ChangeBasic.Fields>(ref strSets, dicSets, ChangeBasic.GetFieldName, ChangeBasic.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<ChangeBasic.Fields>(ref strCondition, dicConditions, ChangeBasic.GetFieldName, ChangeBasic.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(ChangeBasic.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateWorkChangeTarget(ChangeTarget obj, out string strErrorMessage)
		{
			Dictionary<ChangeTarget.Fields, object> dicSets = new Dictionary<ChangeTarget.Fields, object>();
			dicSets[ChangeTarget.Fields.WorkID] = obj.WorkID;
			dicSets[ChangeTarget.Fields.DataCenterID] = obj.DataCenterID;
			dicSets[ChangeTarget.Fields.PropertyName] = obj.PropertyName;
			dicSets[ChangeTarget.Fields.EquipmentTypeID] = obj.EquipmentTypeID;
			dicSets[ChangeTarget.Fields.ServicePause] = obj.ServicePause;
			dicSets[ChangeTarget.Fields.ServicePausePlanHour] = obj.ServicePausePlanHour;
			dicSets[ChangeTarget.Fields.Change] = obj.Change;
			dicSets[ChangeTarget.Fields.ChangeData] = obj.ChangeData;
			dicSets[ChangeTarget.Fields.ReviewResult] = obj.ReviewResult;
			dicSets[ChangeTarget.Fields.Reviewer] = obj.Reviewer;
			dicSets[ChangeTarget.Fields.ReviewDate] = obj.ReviewDate;
			dicSets[ChangeTarget.Fields.ChangeResult] = obj.ChangeResult;
			dicSets[ChangeTarget.Fields.ChangeDetail] = obj.ChangeDetail;

			Dictionary<ChangeTarget.Fields, object> dicConditions = new Dictionary<ChangeTarget.Fields, object>();
			dicConditions[ChangeTarget.Fields.ID] = obj.ID;

			return UpdateWorkChangeTarget(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateWorkChangeTarget(Dictionary<ChangeTarget.Fields, object> dicSets, Dictionary<ChangeTarget.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<ChangeTarget.Fields>(ref strSets, dicSets, ChangeTarget.GetFieldName, ChangeTarget.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<ChangeTarget.Fields>(ref strCondition, dicConditions, ChangeTarget.GetFieldName, ChangeTarget.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(ChangeTarget.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateWorkFaultBasic(FaultBasic obj, out string strErrorMessage)
		{
			Dictionary<FaultBasic.Fields, object> dicSets = new Dictionary<FaultBasic.Fields, object>();
			dicSets[FaultBasic.Fields.Title] = obj.Title;
			dicSets[FaultBasic.Fields.Status] = obj.Status;
			dicSets[FaultBasic.Fields.Reason] = obj.Reason;
			dicSets[FaultBasic.Fields.Range] = obj.Range;
			dicSets[FaultBasic.Fields.ReasonType] = obj.ReasonType;
			dicSets[FaultBasic.Fields.FaultLevel] = obj.FaultLevel;
			dicSets[FaultBasic.Fields.Region] = obj.Region;
			dicSets[FaultBasic.Fields.Manager] = obj.Manager;
			dicSets[FaultBasic.Fields.EventTime] = obj.EventTime;
			dicSets[FaultBasic.Fields.FinishTime] = obj.FinishTime;
			dicSets[FaultBasic.Fields.DataCenterID] = obj.DataCenterID;
			dicSets[FaultBasic.Fields.FaultID] = obj.FaultID;

			Dictionary<FaultBasic.Fields, object> dicConditions = new Dictionary<FaultBasic.Fields, object>();
			dicConditions[FaultBasic.Fields.ID] = obj.ID;

			return UpdateWorkFaultBasic(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateWorkFaultBasic(Dictionary<FaultBasic.Fields, object> dicSets, Dictionary<FaultBasic.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<FaultBasic.Fields>(ref strSets, dicSets, FaultBasic.GetFieldName, FaultBasic.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<FaultBasic.Fields>(ref strCondition, dicConditions, FaultBasic.GetFieldName, FaultBasic.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(FaultBasic.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateWorkFaultTarget(FaultTarget obj, out string strErrorMessage)
		{
			Dictionary<FaultTarget.Fields, object> dicSets = new Dictionary<FaultTarget.Fields, object>();
			dicSets[FaultTarget.Fields.FaultID] = obj.FaultID;
			dicSets[FaultTarget.Fields.SystemName] = obj.SystemName;
			dicSets[FaultTarget.Fields.Department] = obj.Department;
			dicSets[FaultTarget.Fields.EquipmentTypeID] = obj.EquipmentTypeID;
			dicSets[FaultTarget.Fields.DataCenterID] = obj.DataCenterID;

			Dictionary<FaultTarget.Fields, object> dicConditions = new Dictionary<FaultTarget.Fields, object>();
			dicConditions[FaultTarget.Fields.ID] = obj.ID;

			return UpdateWorkFaultTarget(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateWorkFaultTarget(Dictionary<FaultTarget.Fields, object> dicSets, Dictionary<FaultTarget.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<FaultTarget.Fields>(ref strSets, dicSets, FaultTarget.GetFieldName, FaultTarget.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<FaultTarget.Fields>(ref strCondition, dicConditions, FaultTarget.GetFieldName, FaultTarget.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(FaultTarget.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool UpdateTeamRegular(Regular obj, out string strErrorMessage)
		{
			Dictionary<Regular.Fields, object> dicSets = new Dictionary<Regular.Fields, object>();
			dicSets[Regular.Fields.TeamName] = obj.TeamName;
			dicSets[Regular.Fields.ParentTeamID] = obj.ParentTeamID;

			Dictionary<Regular.Fields, object> dicConditions = new Dictionary<Regular.Fields, object>();
			dicConditions[Regular.Fields.ID] = obj.ID;

			return UpdateTeamRegular(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateTeamRegular(Dictionary<Regular.Fields, object> dicSets, Dictionary<Regular.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<Regular.Fields>(ref strSets, dicSets, Regular.GetFieldName, Regular.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<Regular.Fields>(ref strCondition, dicConditions, Regular.GetFieldName, Regular.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(Regular.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateTeamRegularMember(RegularMember obj, out string strErrorMessage)
		{
			Dictionary<RegularMember.Fields, object> dicSets = new Dictionary<RegularMember.Fields, object>();
			dicSets[RegularMember.Fields.RegularID] = obj.RegularID;
			dicSets[RegularMember.Fields.MemberName] = obj.MemberName;
			dicSets[RegularMember.Fields.MemberID] = obj.MemberID;
			dicSets[RegularMember.Fields.OfficePhoneNumber] = obj.OfficePhoneNumber;
			dicSets[RegularMember.Fields.PhoneNumber] = obj.PhoneNumber;
			dicSets[RegularMember.Fields.JobLevel] = obj.JobLevel;
			dicSets[RegularMember.Fields.JobPosition] = obj.JobPosition;
			dicSets[RegularMember.Fields.Email] = obj.Email;
			dicSets[RegularMember.Fields.Status] = obj.Status;

			Dictionary<RegularMember.Fields, object> dicConditions = new Dictionary<RegularMember.Fields, object>();
			dicConditions[RegularMember.Fields.ID] = obj.ID;

			return UpdateTeamRegularMember(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateTeamRegularMember(Dictionary<RegularMember.Fields, object> dicSets, Dictionary<RegularMember.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<RegularMember.Fields>(ref strSets, dicSets, RegularMember.GetFieldName, RegularMember.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<RegularMember.Fields>(ref strCondition, dicConditions, RegularMember.GetFieldName, RegularMember.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(RegularMember.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}
	}
}
