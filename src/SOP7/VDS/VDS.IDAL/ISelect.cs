using System;
using System.Collections;
using System.Collections.Generic;
using VDS.Model;
using VDS.Model.Account;
using VDS.Model.Team;
using VDS.Model.ItemData;
using VDS.Model.Sensor;
using VDS.Model.Work;

namespace VDS.IDAL
{
	public interface ISelect
	{
		Level SelectAccountLevel(int id, out string strErrorMessage);
		List<Level> SelectAccountLevels(Dictionary<Level.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<Level> SelectAccountLevels(Dictionary<Level.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		Option SelectAccountOption(int id, out string strErrorMessage);
		List<Option> SelectAccountOptions(Dictionary<Option.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<Option> SelectAccountOptions(Dictionary<Option.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		Session SelectAccountSession(int id, out string strErrorMessage);
		List<Session> SelectAccountSessions(Dictionary<Session.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<Session> SelectAccountSessions(Dictionary<Session.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		User SelectAccountUser(int id, out string strErrorMessage);
		List<User> SelectAccountUsers(Dictionary<User.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<User> SelectAccountUsers(Dictionary<User.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		UserData SelectAccountUserData(int userID, out string strErrorMessage);
		List<UserData> SelectAccountUserDatas(Dictionary<UserData.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<UserData> SelectAccountUserDatas(Dictionary<UserData.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		UserDataCenterLink SelectAccountUserDataCenterLink(int userID, int dataCenterID, out string strErrorMessage);
		List<UserDataCenterLink> SelectAccountUserDataCenterLinks(Dictionary<UserDataCenterLink.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<UserDataCenterLink> SelectAccountUserDataCenterLinks(Dictionary<UserDataCenterLink.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		Company SelectCompany(int id, out string strErrorMessage);
		List<Company> SelectCompanies(Dictionary<Company.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<Company> SelectCompanies(Dictionary<Company.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		Model.DataCenter.DataCenter SelectDataCenter(int id, out string strErrorMessage);
		List<Model.DataCenter.DataCenter> SelectDataCenters(Dictionary<Model.DataCenter.DataCenter.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<Model.DataCenter.DataCenter> SelectDataCenters(Dictionary<Model.DataCenter.DataCenter.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		Model.DataCenter.Viewport SelectDataCenterViewport(int dataCenterID, out string strErrorMessage);
		List<Model.DataCenter.Viewport> SelectDataCenterViewports(Dictionary<Model.DataCenter.Viewport.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<Model.DataCenter.Viewport> SelectDataCenterViewports(Dictionary<Model.DataCenter.Viewport.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		Model.DataCenter.Data SelectDataCenterData(int centerID, out string strErrorMessage);
		List<Model.DataCenter.Data> SelectDataCenterDatas(Dictionary<Model.DataCenter.Data.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<Model.DataCenter.Data> SelectDataCenterDatas(Dictionary<Model.DataCenter.Data.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		Model.DataCenter.Option SelectDataCenterOption(string propertyName, out string strErrorMessage);
		List<Model.DataCenter.Option> SelectDataCenterOptions(Dictionary<Model.DataCenter.Option.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<Model.DataCenter.Option> SelectDataCenterOptions(Dictionary<Model.DataCenter.Option.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		EquipmentCategory SelectEquipmentCategory(int id, out string strErrorMessage);
		List<EquipmentCategory> SelectEquipmentCategories(Dictionary<EquipmentCategory.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<EquipmentCategory> SelectEquipmentCategories(Dictionary<EquipmentCategory.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		EquipmentType SelectEquipmentType(int id, out string strErrorMessage);
		List<EquipmentType> SelectEquipmentTypes(Dictionary<EquipmentType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<EquipmentType> SelectEquipmentTypes(Dictionary<EquipmentType.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		Item SelectItem(int id, out string strErrorMessage);
		List<Item> SelectItems(Dictionary<Item.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<Item> SelectItems(Dictionary<Item.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		Item_RU SelectItem_RU(int itemID, out string strErrorMessage);
		List<Item_RU> SelectItem_RUs(Dictionary<Item_RU.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<Item_RU> SelectItem_RUs(Dictionary<Item_RU.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		LinkedItem SelectLinkedItem(int itemID, int linkedItemID, int centerID, out string strErrorMessage);
		List<LinkedItem> SelectLinkedItems(Dictionary<LinkedItem.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<LinkedItem> SelectLinkedItems(Dictionary<LinkedItem.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		ItemType SelectItemType(int id, out string strErrorMessage);
		List<ItemType> SelectItemTypes(Dictionary<ItemType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<ItemType> SelectItemTypes(Dictionary<ItemType.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		Backup SelectBackup(string basic_Name, int dataCenterID, out string strErrorMessage);
		List<Backup> SelectBackups(Dictionary<Backup.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<Backup> SelectBackups(Dictionary<Backup.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		Box SelectBox(string basic_Name, int dataCenterID, out string strErrorMessage);
		List<Box> SelectBoxes(Dictionary<Box.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<Box> SelectBoxes(Dictionary<Box.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		Etc SelectEtc(string basic_Name, int dataCenterID, out string strErrorMessage);
		List<Etc> SelectEtcs(Dictionary<Etc.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<Etc> SelectEtcs(Dictionary<Etc.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		Network SelectNetwork(string basic_Name, int dataCenterID, out string strErrorMessage);
		List<Network> SelectNetworks(Dictionary<Network.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<Network> SelectNetworks(Dictionary<Network.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		SanSwitch SelectSanSwitch(string basic_Name, int dataCenterID, out string strErrorMessage);
		List<SanSwitch> SelectSanSwitches(Dictionary<SanSwitch.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<SanSwitch> SelectSanSwitches(Dictionary<SanSwitch.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		Security SelectSecurity(string basic_Name, int dataCenterID, out string strErrorMessage);
		List<Security> SelectSecurities(Dictionary<Security.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<Security> SelectSecurities(Dictionary<Security.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		Storage SelectStorage(string basic_Name, int dataCenterID, out string strErrorMessage);
		List<Storage> SelectStorages(Dictionary<Storage.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<Storage> SelectStorages(Dictionary<Storage.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		ItemServer SelectItemServer(string basic_ServerName, int dataCenterID, out string strErrorMessage);
		List<ItemServer> SelectItemServers(Dictionary<ItemServer.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<ItemServer> SelectItemServers(Dictionary<ItemServer.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		Nation SelectNation(int id, out string strErrorMessage);
		List<Nation> SelectNations(Dictionary<Nation.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<Nation> SelectNations(Dictionary<Nation.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		Rack SelectRack(int id, out string strErrorMessage);
		List<Rack> SelectRacks(Dictionary<Rack.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<Rack> SelectRacks(Dictionary<Rack.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		RackType SelectRackType(int id, out string strErrorMessage);
		List<RackType> SelectRackTypes(Dictionary<RackType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<RackType> SelectRackTypes(Dictionary<RackType.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		RackGroup SelectRackGroup(int id, out string strErrorMessage);
		List<RackGroup> SelectRackGroups(Dictionary<RackGroup.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<RackGroup> SelectRackGroups(Dictionary<RackGroup.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		Model.Site.Site SelectSite(int id, out string strErrorMessage);
		List<Model.Site.Site> SelectSites(Dictionary<Model.Site.Site.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<Model.Site.Site> SelectSites(Dictionary<Model.Site.Site.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		Model.Site.Data SelectSiteData(int siteID, out string strErrorMessage);
		List<Model.Site.Data> SelectSiteDatas(Dictionary<Model.Site.Data.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<Model.Site.Data> SelectSiteDatas(Dictionary<Model.Site.Data.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		Model.Site.Option SelectSiteOption(string propertyName, out string strErrorMessage);
		List<Model.Site.Option> SelectSiteOptions(Dictionary<Model.Site.Option.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<Model.Site.Option> SelectSiteOptions(Dictionary<Model.Site.Option.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		Facility SelectFacility(int id, out string strErrorMessage);
		List<Facility> SelectFacilities(Dictionary<Facility.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<Facility> SelectFacilities(Dictionary<Facility.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		FacilityType SelectFacilityType(int id, out string strErrorMessage);
		List<FacilityType> SelectFacilityTypes(Dictionary<FacilityType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<FacilityType> SelectFacilityTypes(Dictionary<FacilityType.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		Sensor SelectSensor(int id, out string strErrorMessage);
		List<Sensor> SelectSensors(Dictionary<Sensor.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<Sensor> SelectSensors(Dictionary<Sensor.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		History SelectSensorHistory(int centerID, string sensorName, string dateStamp, string timeStamp, out string strErrorMessage);
		List<History> SelectSensorHistories(Dictionary<History.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<History> SelectSensorHistories(Dictionary<History.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);
		List<History> SelectLastSensorHistories(int centerID, out string strErrorMessage);

		SensorType SelectSensorType(int id, out string strErrorMessage);
		List<SensorType> SelectSensorTypes(Dictionary<SensorType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<SensorType> SelectSensorTypes(Dictionary<SensorType.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		ChangeBasic SelectWorkChangeBasic(int id, out string strErrorMessage);
		List<ChangeBasic> SelectWorkChangeBasics(Dictionary<ChangeBasic.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<ChangeBasic> SelectWorkChangeBasics(Dictionary<ChangeBasic.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		ChangeTarget SelectWorkChangeTarget(int id, out string strErrorMessage);
		List<ChangeTarget> SelectWorkChangeTargets(Dictionary<ChangeTarget.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<ChangeTarget> SelectWorkChangeTargets(Dictionary<ChangeTarget.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		FaultBasic SelectWorkFaultBasic(int id, out string strErrorMessage);
		List<FaultBasic> SelectWorkFaultBasics(Dictionary<FaultBasic.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<FaultBasic> SelectWorkFaultBasics(Dictionary<FaultBasic.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		FaultTarget SelectWorkFaultTarget(int id, out string strErrorMessage);
		List<FaultTarget> SelectWorkFaultTargets(Dictionary<FaultTarget.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<FaultTarget> SelectWorkFaultTargets(Dictionary<FaultTarget.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		Regular SelectTeamRegular(int id, out string strErrorMessage);
		List<Regular> SelectTeamRegulars(Dictionary<Regular.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<Regular> SelectTeamRegulars(Dictionary<Regular.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		RegularMember SelectTeamRegularMember(int id, out string strErrorMessage);
		List<RegularMember> SelectTeamRegularMembers(Dictionary<RegularMember.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<RegularMember> SelectTeamRegularMembers(Dictionary<RegularMember.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		List<string> GetSiteCompanyList(int siteID, out string strErrorMessage);

		ArrayList JoinSessionUserLevel(string strAdditionalConditions, out string strErrorMessage);
		ArrayList JoinSessionUserLevel(string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		ArrayList JoinItemServerBox(string strAdditionalConditions, out string strErrorMessage);
		ArrayList JoinItemServerBox(string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		ArrayList JoinRackEquipmentTypeItemItemRUItemTypeCompany(string strConditions, out string strErrorMessage);
		ArrayList JoinRackEquipmentTypeItemItemRUItemTypeCompany(int dataCenterID, string strAdditionalConditions, out string strErrorMessage);

		ArrayList JoinRackRackType(int dataCenterID, string strAdditionalConditions, out string strErrorMessage);
		ArrayList JoinRackRackGroupRackType(int dataCenterID, string strAdditionalConditions, out string strErrorMessage);
		ArrayList JoinItemItemRU(string strCondition, out string strErrorMessage);
		ArrayList JoinItemItemRUItemType(int dataCenterID, string strAdditionalConditions, out string strErrorMessage);
		ArrayList JoinItemItemTypeEquipmentTypeCompany(int dataCenterID, string strAdditionalConditions, out string strErrorMessage);
		ArrayList JoinUserUserDatas(Dictionary<User.Fields, object> dicCondition1, Dictionary<UserData.Fields, object> dicCondition2, string strAdditionalConditions, out string strErrorMessage);
		ArrayList JoinDataCenterUserDataCenterLink(Dictionary<Model.DataCenter.DataCenter.Fields, object> dicCondition1, Dictionary<UserDataCenterLink.Fields, object> dicCondition2, string strAdditionalConditions, out string strErrorMessage);
		ArrayList JoinUserDataCenterDataCenterData(Dictionary<User.Fields, object> dicCondition1, Dictionary<Model.DataCenter.DataCenter.Fields, object> dicCondition2, Dictionary<Model.DataCenter.Data.Fields, object> dicCondition3, string strAdditionalConditions, out string strErrorMessage);
		ArrayList JoinDataCenterDataCenterData(Dictionary<Model.DataCenter.DataCenter.Fields, object> dicCondition1, Dictionary<Model.DataCenter.Data.Fields, object> dicCondition2, string strAdditionalConditions, out string strErrorMessage);

		ArrayList JoinSiteSiteData(Dictionary<Model.Site.Site.Fields, object> dicCondition1, Dictionary<Model.Site.Data.Fields, object> dicCondition2, string strAdditionalConditions, out string strErrorMessage);
	}
}
