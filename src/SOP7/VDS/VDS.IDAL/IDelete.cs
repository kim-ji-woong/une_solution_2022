using System;
using System.Collections.Generic;
using VDS.Model;
using VDS.Model.Account;
using VDS.Model.Team;
using VDS.Model.ItemData;
using VDS.Model.Sensor;
using VDS.Model.Work;

namespace VDS.IDAL
{
	public interface IDelete
	{
		bool DeleteAccountLevel(int id, out string strErrorMessage);
		bool DeleteAccountLevel(Dictionary<Level.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteAccountOption(int id, out string strErrorMessage);
		bool DeleteAccountOption(Dictionary<Option.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteAccountSession(int id, out string strErrorMessage);
		bool DeleteAccountSession(Dictionary<Session.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteAccountUser(int id, out string strErrorMessage);
		bool DeleteAccountUser(Dictionary<User.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteAccountUserData(int userID, out string strErrorMessage);
		bool DeleteAccountUserData(Dictionary<UserData.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteAccountUserDataCenterLink(int userID, int dataCenterID, out string strErrorMessage);
		bool DeleteAccountUserDataCenterLink(Dictionary<UserDataCenterLink.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteCompany(int id, out string strErrorMessage);
		bool DeleteCompany(Dictionary<Company.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteDataCenter(int id, out string strErrorMessage);
		bool DeleteDataCenter(Dictionary<Model.DataCenter.DataCenter.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		bool DeleteDataCenterViewport(int dataCenterID, out string strErrorMessage);
		bool DeleteDataCenterViewport(Dictionary<Model.DataCenter.Viewport.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		bool DeleteDataCenterData(int centerID, out string strErrorMessage);
		bool DeleteDataCenterData(Dictionary<Model.DataCenter.Data.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		bool DeleteDataCenterOption(string propertyName, out string strErrorMessage);
		bool DeleteDataCenterOption(Dictionary<Model.DataCenter.Option.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteEquipmentCategory(int id, out string strErrorMessage);
		bool DeleteEquipmentCategory(Dictionary<EquipmentCategory.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteEquipmentType(int id, out string strErrorMessage);
		bool DeleteEquipmentType(Dictionary<EquipmentType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteItem(int id, out string strErrorMessage);
		bool DeleteItem(Dictionary<Item.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteItem_RU(int itemID, out string strErrorMessage);
		bool DeleteItem_RU(Dictionary<Item_RU.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteLinkedItem(int itemID, int linkedItemID, int centerID, out string strErrorMessage);
		bool DeleteLinkedItem(Dictionary<LinkedItem.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteItemType(int id, out string strErrorMessage);
		bool DeleteItemType(Dictionary<ItemType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteBackup(string basic_Name, int dataCenterID, out string strErrorMessage);
		bool DeleteBackup(Dictionary<Backup.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteBox(string basic_Name, int dataCenterID, out string strErrorMessage);
		bool DeleteBox(Dictionary<Box.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteEtc(string basic_Name, int dataCenterID, out string strErrorMessage);
		bool DeleteEtc(Dictionary<Etc.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteNetwork(string basic_Name, int dataCenterID, out string strErrorMessage);
		bool DeleteNetwork(Dictionary<Network.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteSanSwitch(string basic_Name, int dataCenterID, out string strErrorMessage);
		bool DeleteSanSwitch(Dictionary<SanSwitch.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteSecurity(string basic_Name, int dataCenterID, out string strErrorMessage);
		bool DeleteSecurity(Dictionary<Security.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteStorage(string basic_Name, int dataCenterID, out string strErrorMessage);
		bool DeleteStorage(Dictionary<Storage.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteItemServer(string basic_ServerName, int dataCenterID, out string strErrorMessage);
		bool DeleteItemServer(Dictionary<ItemServer.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteNation(int id, out string strErrorMessage);
		bool DeleteNation(Dictionary<Nation.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteRack(int id, out string strErrorMessage);
		bool DeleteRack(Dictionary<Rack.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteRackType(int id, out string strErrorMessage);
		bool DeleteRackType(Dictionary<RackType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteRackGroup(int id, out string strErrorMessage);
		bool DeleteRackGroup(Dictionary<RackGroup.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteSite(int id, out string strErrorMessage);
		bool DeleteSite(Dictionary<Model.Site.Site.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		bool DeleteSiteData(int siteID, out string strErrorMessage);
		bool DeleteSiteData(Dictionary<Model.Site.Data.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		bool DeleteSiteOption(string propertyName, out string strErrorMessage);
		bool DeleteSiteOption(Dictionary<Model.Site.Option.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteFacility(int id, out string strErrorMessage);
		bool DeleteFacility(Dictionary<Facility.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteFacilityType(int id, out string strErrorMessage);
		bool DeleteFacilityType(Dictionary<FacilityType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteSensor(int id, out string strErrorMessage);
		bool DeleteSensor(Dictionary<Sensor.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteSensorHistory(int centerID, string sensorName, DateTime dateStamp, DateTime timeStamp, out string strErrorMessage);
		bool DeleteSensorHistory(Dictionary<History.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteSensorType(int id, out string strErrorMessage);
		bool DeleteSensorType(Dictionary<SensorType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteWorkChangeBasic(int id, out string strErrorMessage);
		bool DeleteWorkChangeBasic(Dictionary<ChangeBasic.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteWorkChangeTarget(int id, out string strErrorMessage);
		bool DeleteWorkChangeTarget(Dictionary<ChangeTarget.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteWorkFaultBasic(int id, out string strErrorMessage);
		bool DeleteWorkFaultBasic(Dictionary<FaultBasic.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteWorkFaultTarget(int id, out string strErrorMessage);
		bool DeleteWorkFaultTarget(Dictionary<FaultTarget.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteTeamRegular(int id, out string strErrorMessage);
		bool DeleteTeamRegular(Dictionary<Regular.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteTeamRegularMember(int id, out string strErrorMessage);
		bool DeleteTeamRegularMember(Dictionary<RegularMember.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

	}
}
