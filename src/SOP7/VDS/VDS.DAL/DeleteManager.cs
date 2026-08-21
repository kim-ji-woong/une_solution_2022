using System;
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
	public class DeleteManager : QueryManager, IDelete
	{
		private DataManager m_dataManager = null;

		public DeleteManager(DataManager dataManager)
		{
			m_dataManager = dataManager;
			m_dbManager = m_dataManager.GetDBManager() as DirectDBManager;
		}

		private bool DeleteFromID(string strTableName, int nID, out string strErrorMessage)
		{
			string strSQL = string.Format("Delete from {0} where ID = {1}", strTableName, nID);

			if (m_dbManager.GetResultData(strSQL) == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return false;
			}

			strErrorMessage = null;
			return true;
		}

		private bool DeleteFromCondition(string strTableName, string strCondition, string strAdditionalConditions, out string strErrorMessage)
		{
			if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
			{
				if (strCondition.Length > 0)
					strCondition += " And " + strAdditionalConditions;
				else
					strCondition = strAdditionalConditions;
			}

			string strSQL = string.Format("Delete from {0}", strTableName);

			if (strCondition.Length > 0)
				strSQL += " Where " + strCondition;

			if (m_dbManager.GetResultData(strSQL) == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return false;
			}

			strErrorMessage = null;
			return true;
		}

		public bool DeleteAccountLevel(int id, out string strErrorMessage)
		{
			return DeleteFromID(Level.TableName, id, out strErrorMessage);
		}

		public bool DeleteAccountLevel(Dictionary<Level.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<Level.Fields>(ref strCondition, dicConditions, Level.GetFieldName, Level.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(Level.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteAccountOption(int id, out string strErrorMessage)
		{
			return DeleteFromID(Option.TableName, id, out strErrorMessage);
		}

		public bool DeleteAccountOption(Dictionary<Option.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<Option.Fields>(ref strCondition, dicConditions, Option.GetFieldName, Option.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(Option.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteAccountSession(int id, out string strErrorMessage)
		{
			return DeleteFromID(Session.TableName, id, out strErrorMessage);
		}

		public bool DeleteAccountSession(Dictionary<Session.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<Session.Fields>(ref strCondition, dicConditions, Session.GetFieldName, Session.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(Session.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteAccountUser(int id, out string strErrorMessage)
		{
			return DeleteFromID(User.TableName, id, out strErrorMessage);
		}

		public bool DeleteAccountUser(Dictionary<User.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<User.Fields>(ref strCondition, dicConditions, User.GetFieldName, User.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(User.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool DeleteAccountUserData(int userID, out string strErrorMessage)
		{
			Dictionary<UserData.Fields, object> dicConditions = new Dictionary<UserData.Fields, object>();
			dicConditions[UserData.Fields.UserID] = userID;

			return DeleteAccountUserData(dicConditions, null, out strErrorMessage);
		}

		public bool DeleteAccountUserData(Dictionary<UserData.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<UserData.Fields>(ref strCondition, dicConditions, UserData.GetFieldName, UserData.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(UserData.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteAccountUserDataCenterLink(int userID, int dataCenterID, out string strErrorMessage)
		{
			Dictionary<UserDataCenterLink.Fields, object> dicConditions = new Dictionary<UserDataCenterLink.Fields, object>();
			dicConditions[UserDataCenterLink.Fields.UserID] = userID;
			dicConditions[UserDataCenterLink.Fields.DataCenterID] = dataCenterID;

			return DeleteAccountUserDataCenterLink(dicConditions, null, out strErrorMessage);
		}

		public bool DeleteAccountUserDataCenterLink(Dictionary<UserDataCenterLink.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<UserDataCenterLink.Fields>(ref strCondition, dicConditions, UserDataCenterLink.GetFieldName, UserDataCenterLink.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(UserDataCenterLink.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool DeleteCompany(int id, out string strErrorMessage)
		{
			return DeleteFromID(Company.TableName, id, out strErrorMessage);
		}

		public bool DeleteCompany(Dictionary<Company.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<Company.Fields>(ref strCondition, dicConditions, Company.GetFieldName, Company.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(Company.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteDataCenter(int id, out string strErrorMessage)
		{
			return DeleteFromID(Model.DataCenter.DataCenter.TableName, id, out strErrorMessage);
		}

		public bool DeleteDataCenter(Dictionary<Model.DataCenter.DataCenter.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<Model.DataCenter.DataCenter.Fields>(ref strCondition, dicConditions, Model.DataCenter.DataCenter.GetFieldName, Model.DataCenter.DataCenter.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(Model.DataCenter.DataCenter.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool DeleteDataCenterViewport(int dataCenterID, out string strErrorMessage)
		{
			Dictionary<Model.DataCenter.Viewport.Fields, object> dicConditions = new Dictionary<Model.DataCenter.Viewport.Fields, object>();
			dicConditions[Model.DataCenter.Viewport.Fields.DataCenterID] = dataCenterID;

			return DeleteDataCenterViewport(dicConditions, null, out strErrorMessage);
		}

		public bool DeleteDataCenterViewport(Dictionary<Model.DataCenter.Viewport.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<Model.DataCenter.Viewport.Fields>(ref strCondition, dicConditions, Model.DataCenter.Viewport.GetFieldName, Model.DataCenter.Viewport.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(Model.DataCenter.Viewport.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool DeleteDataCenterData(int centerID, out string strErrorMessage)
		{
			Dictionary<Model.DataCenter.Data.Fields, object> dicConditions = new Dictionary<Model.DataCenter.Data.Fields, object>();
			dicConditions[Model.DataCenter.Data.Fields.CenterID] = centerID;

			return DeleteDataCenterData(dicConditions, null, out strErrorMessage);
		}

		public bool DeleteDataCenterData(Dictionary<Model.DataCenter.Data.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<Model.DataCenter.Data.Fields>(ref strCondition, dicConditions, Model.DataCenter.Data.GetFieldName, Model.DataCenter.Data.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(Model.DataCenter.Data.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool DeleteDataCenterOption(string propertyName, out string strErrorMessage)
		{
			Dictionary<Model.DataCenter.Option.Fields, object> dicConditions = new Dictionary<Model.DataCenter.Option.Fields, object>();
			dicConditions[Model.DataCenter.Option.Fields.PropertyName] = propertyName;

			return DeleteDataCenterOption(dicConditions, null, out strErrorMessage);
		}

		public bool DeleteDataCenterOption(Dictionary<Model.DataCenter.Option.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<Model.DataCenter.Option.Fields>(ref strCondition, dicConditions, Model.DataCenter.Option.GetFieldName, Model.DataCenter.Option.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(Model.DataCenter.Option.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool DeleteEquipmentCategory(int id, out string strErrorMessage)
		{
			return DeleteFromID(EquipmentCategory.TableName, id, out strErrorMessage);
		}

		public bool DeleteEquipmentCategory(Dictionary<EquipmentCategory.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<EquipmentCategory.Fields>(ref strCondition, dicConditions, EquipmentCategory.GetFieldName, EquipmentCategory.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(EquipmentCategory.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteEquipmentType(int id, out string strErrorMessage)
		{
			return DeleteFromID(EquipmentType.TableName, id, out strErrorMessage);
		}

		public bool DeleteEquipmentType(Dictionary<EquipmentType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<EquipmentType.Fields>(ref strCondition, dicConditions, EquipmentType.GetFieldName, EquipmentType.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(EquipmentType.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteItem(int id, out string strErrorMessage)
		{
			return DeleteFromID(Item.TableName, id, out strErrorMessage);
		}

		public bool DeleteItem(Dictionary<Item.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<Item.Fields>(ref strCondition, dicConditions, Item.GetFieldName, Item.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(Item.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteItem_RU(int itemID, out string strErrorMessage)
		{
			Dictionary<Item_RU.Fields, object> dicConditions = new Dictionary<Item_RU.Fields, object>();
			dicConditions[Item_RU.Fields.ItemID] = itemID;

			return DeleteItem_RU(dicConditions, null, out strErrorMessage);
		}

		public bool DeleteItem_RU(Dictionary<Item_RU.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<Item_RU.Fields>(ref strCondition, dicConditions, Item_RU.GetFieldName, Item_RU.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(Item_RU.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool DeleteLinkedItem(int itemID, int linkedItemID, int centerID, out string strErrorMessage)
		{
			Dictionary<LinkedItem.Fields, object> dicConditions = new Dictionary<LinkedItem.Fields, object>();
			dicConditions[LinkedItem.Fields.ItemID] = itemID;
			dicConditions[LinkedItem.Fields.LinkedItemID] = linkedItemID;
			dicConditions[LinkedItem.Fields.CenterID] = centerID;

			return DeleteLinkedItem(dicConditions, null, out strErrorMessage);
		}

		public bool DeleteLinkedItem(Dictionary<LinkedItem.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<LinkedItem.Fields>(ref strCondition, dicConditions, LinkedItem.GetFieldName, LinkedItem.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(LinkedItem.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool DeleteItemType(int id, out string strErrorMessage)
		{
			return DeleteFromID(ItemType.TableName, id, out strErrorMessage);
		}

		public bool DeleteItemType(Dictionary<ItemType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<ItemType.Fields>(ref strCondition, dicConditions, ItemType.GetFieldName, ItemType.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(ItemType.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool DeleteBackup(string basic_Name, int dataCenterID, out string strErrorMessage)
		{
			Dictionary<Backup.Fields, object> dicConditions = new Dictionary<Backup.Fields, object>();
			dicConditions[Backup.Fields.Basic_Name] = basic_Name;
			dicConditions[Backup.Fields.DataCenterID] = dataCenterID;

			return DeleteBackup(dicConditions, null, out strErrorMessage);
		}

		public bool DeleteBackup(Dictionary<Backup.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<Backup.Fields>(ref strCondition, dicConditions, Backup.GetFieldName, Backup.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(Backup.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteBox(string basic_Name, int dataCenterID, out string strErrorMessage)
		{
			Dictionary<Box.Fields, object> dicConditions = new Dictionary<Box.Fields, object>();
			dicConditions[Box.Fields.Basic_Name] = basic_Name;
			dicConditions[Box.Fields.DataCenterID] = dataCenterID;

			return DeleteBox(dicConditions, null, out strErrorMessage);
		}

		public bool DeleteBox(Dictionary<Box.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<Box.Fields>(ref strCondition, dicConditions, Box.GetFieldName, Box.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(Box.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteEtc(string basic_Name, int dataCenterID, out string strErrorMessage)
		{
			Dictionary<Etc.Fields, object> dicConditions = new Dictionary<Etc.Fields, object>();
			dicConditions[Etc.Fields.Basic_Name] = basic_Name;
			dicConditions[Etc.Fields.DataCenterID] = dataCenterID;

			return DeleteEtc(dicConditions, null, out strErrorMessage);
		}

		public bool DeleteEtc(Dictionary<Etc.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<Etc.Fields>(ref strCondition, dicConditions, Etc.GetFieldName, Etc.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(Etc.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteNetwork(string basic_Name, int dataCenterID, out string strErrorMessage)
		{
			Dictionary<Network.Fields, object> dicConditions = new Dictionary<Network.Fields, object>();
			dicConditions[Network.Fields.Basic_Name] = basic_Name;
			dicConditions[Network.Fields.DataCenterID] = dataCenterID;

			return DeleteNetwork(dicConditions, null, out strErrorMessage);
		}

		public bool DeleteNetwork(Dictionary<Network.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<Network.Fields>(ref strCondition, dicConditions, Network.GetFieldName, Network.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(Network.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteSanSwitch(string basic_Name, int dataCenterID, out string strErrorMessage)
		{
			Dictionary<SanSwitch.Fields, object> dicConditions = new Dictionary<SanSwitch.Fields, object>();
			dicConditions[SanSwitch.Fields.Basic_Name] = basic_Name;
			dicConditions[SanSwitch.Fields.DataCenterID] = dataCenterID;

			return DeleteSanSwitch(dicConditions, null, out strErrorMessage);
		}

		public bool DeleteSanSwitch(Dictionary<SanSwitch.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<SanSwitch.Fields>(ref strCondition, dicConditions, SanSwitch.GetFieldName, SanSwitch.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(SanSwitch.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteSecurity(string basic_Name, int dataCenterID, out string strErrorMessage)
		{
			Dictionary<Security.Fields, object> dicConditions = new Dictionary<Security.Fields, object>();
			dicConditions[Security.Fields.Basic_Name] = basic_Name;
			dicConditions[Security.Fields.DataCenterID] = dataCenterID;

			return DeleteSecurity(dicConditions, null, out strErrorMessage);
		}

		public bool DeleteSecurity(Dictionary<Security.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<Security.Fields>(ref strCondition, dicConditions, Security.GetFieldName, Security.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(Security.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteStorage(string basic_Name, int dataCenterID, out string strErrorMessage)
		{
			Dictionary<Storage.Fields, object> dicConditions = new Dictionary<Storage.Fields, object>();
			dicConditions[Storage.Fields.Basic_Name] = basic_Name;
			dicConditions[Storage.Fields.DataCenterID] = dataCenterID;

			return DeleteStorage(dicConditions, null, out strErrorMessage);
		}

		public bool DeleteStorage(Dictionary<Storage.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<Storage.Fields>(ref strCondition, dicConditions, Storage.GetFieldName, Storage.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(Storage.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteItemServer(string basic_ServerName, int dataCenterID, out string strErrorMessage)
		{
			Dictionary<ItemServer.Fields, object> dicConditions = new Dictionary<ItemServer.Fields, object>();
			dicConditions[ItemServer.Fields.Basic_ServerName] = basic_ServerName;
			dicConditions[ItemServer.Fields.DataCenterID] = dataCenterID;

			return DeleteItemServer(dicConditions, null, out strErrorMessage);
		}

		public bool DeleteItemServer(Dictionary<ItemServer.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<ItemServer.Fields>(ref strCondition, dicConditions, ItemServer.GetFieldName, ItemServer.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(ItemServer.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool DeleteNation(int id, out string strErrorMessage)
		{
			return DeleteFromID(Nation.TableName, id, out strErrorMessage);
		}

		public bool DeleteNation(Dictionary<Nation.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<Nation.Fields>(ref strCondition, dicConditions, Nation.GetFieldName, Nation.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(Nation.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteRack(int id, out string strErrorMessage)
		{
			return DeleteFromID(Rack.TableName, id, out strErrorMessage);
		}

		public bool DeleteRack(Dictionary<Rack.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<Rack.Fields>(ref strCondition, dicConditions, Rack.GetFieldName, Rack.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(Rack.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteRackType(int id, out string strErrorMessage)
		{
			return DeleteFromID(RackType.TableName, id, out strErrorMessage);
		}

		public bool DeleteRackType(Dictionary<RackType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<RackType.Fields>(ref strCondition, dicConditions, RackType.GetFieldName, RackType.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(RackType.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool DeleteRackGroup(int id, out string strErrorMessage)
		{
			return DeleteFromID(RackGroup.TableName, id, out strErrorMessage);
		}

		public bool DeleteRackGroup(Dictionary<RackGroup.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<RackGroup.Fields>(ref strCondition, dicConditions, RackGroup.GetFieldName, RackGroup.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(RackGroup.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool DeleteSite(int id, out string strErrorMessage)
		{
			return DeleteFromID(Model.Site.Site.TableName, id, out strErrorMessage);
		}

		public bool DeleteSite(Dictionary<Model.Site.Site.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<Model.Site.Site.Fields>(ref strCondition, dicConditions, Model.Site.Site.GetFieldName, Model.Site.Site.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(Model.Site.Site.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool DeleteSiteData(int siteID, out string strErrorMessage)
		{
			Dictionary<Model.Site.Data.Fields, object> dicConditions = new Dictionary<Model.Site.Data.Fields, object>();
			dicConditions[Model.Site.Data.Fields.SiteID] = siteID;

			return DeleteSiteData(dicConditions, null, out strErrorMessage);
		}

		public bool DeleteSiteData(Dictionary<Model.Site.Data.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<Model.Site.Data.Fields>(ref strCondition, dicConditions, Model.Site.Data.GetFieldName, Model.Site.Data.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(Model.Site.Data.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool DeleteSiteOption(string propertyName, out string strErrorMessage)
		{
			Dictionary<Model.Site.Option.Fields, object> dicConditions = new Dictionary<Model.Site.Option.Fields, object>();
			dicConditions[Model.Site.Option.Fields.PropertyName] = propertyName;

			return DeleteSiteOption(dicConditions, null, out strErrorMessage);
		}

		public bool DeleteSiteOption(Dictionary<Model.Site.Option.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<Model.Site.Option.Fields>(ref strCondition, dicConditions, Model.Site.Option.GetFieldName, Model.Site.Option.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(Model.Site.Option.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool DeleteFacility(int id, out string strErrorMessage)
		{
			return DeleteFromID(Facility.TableName, id, out strErrorMessage);
		}

		public bool DeleteFacility(Dictionary<Facility.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<Facility.Fields>(ref strCondition, dicConditions, Facility.GetFieldName, Facility.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(Facility.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteFacilityType(int id, out string strErrorMessage)
		{
			return DeleteFromID(FacilityType.TableName, id, out strErrorMessage);
		}

		public bool DeleteFacilityType(Dictionary<FacilityType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<FacilityType.Fields>(ref strCondition, dicConditions, FacilityType.GetFieldName, FacilityType.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(FacilityType.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool DeleteSensor(int id, out string strErrorMessage)
		{
			return DeleteFromID(Sensor.TableName, id, out strErrorMessage);
		}

		public bool DeleteSensor(Dictionary<Sensor.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<Sensor.Fields>(ref strCondition, dicConditions, Sensor.GetFieldName, Sensor.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(Sensor.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteSensorHistory(int centerID, string sensorName, DateTime dateStamp, DateTime timeStamp, out string strErrorMessage)
		{
			Dictionary<History.Fields, object> dicConditions = new Dictionary<History.Fields, object>();
			dicConditions[History.Fields.CenterID] = centerID;
			dicConditions[History.Fields.SensorName] = sensorName;
			dicConditions[History.Fields.DateStamp] = dateStamp;
			dicConditions[History.Fields.TimeStamp] = timeStamp;

			return DeleteSensorHistory(dicConditions, null, out strErrorMessage);
		}

		public bool DeleteSensorHistory(Dictionary<History.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<History.Fields>(ref strCondition, dicConditions, History.GetFieldName, History.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(History.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteSensorType(int id, out string strErrorMessage)
		{
			return DeleteFromID(SensorType.TableName, id, out strErrorMessage);
		}

		public bool DeleteSensorType(Dictionary<SensorType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<SensorType.Fields>(ref strCondition, dicConditions, SensorType.GetFieldName, SensorType.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(SensorType.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool DeleteWorkChangeBasic(int id, out string strErrorMessage)
		{
			return DeleteFromID(ChangeBasic.TableName, id, out strErrorMessage);
		}

		public bool DeleteWorkChangeBasic(Dictionary<ChangeBasic.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<ChangeBasic.Fields>(ref strCondition, dicConditions, ChangeBasic.GetFieldName, ChangeBasic.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(ChangeBasic.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool DeleteWorkChangeTarget(int id, out string strErrorMessage)
		{
			return DeleteFromID(ChangeTarget.TableName, id, out strErrorMessage);
		}

		public bool DeleteWorkChangeTarget(Dictionary<ChangeTarget.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<ChangeTarget.Fields>(ref strCondition, dicConditions, ChangeTarget.GetFieldName, ChangeTarget.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(ChangeTarget.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteWorkFaultBasic(int id, out string strErrorMessage)
		{
			return DeleteFromID(FaultBasic.TableName, id, out strErrorMessage);
		}

		public bool DeleteWorkFaultBasic(Dictionary<FaultBasic.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<FaultBasic.Fields>(ref strCondition, dicConditions, FaultBasic.GetFieldName, FaultBasic.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(FaultBasic.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool DeleteWorkFaultTarget(int id, out string strErrorMessage)
		{
			return DeleteFromID(FaultTarget.TableName, id, out strErrorMessage);
		}

		public bool DeleteWorkFaultTarget(Dictionary<FaultTarget.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<FaultTarget.Fields>(ref strCondition, dicConditions, FaultTarget.GetFieldName, FaultTarget.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(FaultTarget.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool DeleteTeamRegular(int id, out string strErrorMessage)
		{
			return DeleteFromID(Regular.TableName, id, out strErrorMessage);
		}

		public bool DeleteTeamRegular(Dictionary<Regular.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<Regular.Fields>(ref strCondition, dicConditions, Regular.GetFieldName, Regular.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(Regular.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteTeamRegularMember(int id, out string strErrorMessage)
		{
			return DeleteFromID(RegularMember.TableName, id, out strErrorMessage);
		}

		public bool DeleteTeamRegularMember(Dictionary<RegularMember.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<RegularMember.Fields>(ref strCondition, dicConditions, RegularMember.GetFieldName, RegularMember.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(RegularMember.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


	}
}
