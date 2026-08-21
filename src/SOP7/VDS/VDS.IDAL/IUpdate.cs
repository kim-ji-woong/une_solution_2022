using System.Collections.Generic;
using VDS.Model;
using VDS.Model.Account;
using VDS.Model.Team;
using VDS.Model.ItemData;
using VDS.Model.Sensor;
using VDS.Model.Work;

namespace VDS.IDAL
{
	public interface IUpdate
	{
		bool UpdateAccountLevel(Level obj, out string strErrorMessage);
		bool UpdateAccountLevel(Dictionary<Level.Fields, object> dicSets, Dictionary<Level.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateAccountOption(Option obj, out string strErrorMessage);
		bool UpdateAccountOption(Dictionary<Option.Fields, object> dicSets, Dictionary<Option.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateAccountSession(Session obj, out string strErrorMessage);
		bool UpdateAccountSession(Dictionary<Session.Fields, object> dicSets, Dictionary<Session.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateAccountUser(User obj, out string strErrorMessage);
		bool UpdateAccountUser(Dictionary<User.Fields, object> dicSets, Dictionary<User.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateAccountUserData(UserData obj, out string strErrorMessage);
		bool UpdateAccountUserData(Dictionary<UserData.Fields, object> dicSets, Dictionary<UserData.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateAccountUserDataCenterLink(Dictionary<UserDataCenterLink.Fields, object> dicSets, Dictionary<UserDataCenterLink.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateCompany(Company obj, out string strErrorMessage);
		bool UpdateCompany(Dictionary<Company.Fields, object> dicSets, Dictionary<Company.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateDataCenter(Model.DataCenter.DataCenter obj, out string strErrorMessage);
		bool UpdateDataCenter(Dictionary<Model.DataCenter.DataCenter.Fields, object> dicSets, Dictionary<Model.DataCenter.DataCenter.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		bool UpdateDataCenterViewport(Model.DataCenter.Viewport obj, out string strErrorMessage);
		bool UpdateDataCenterViewport(Dictionary<Model.DataCenter.Viewport.Fields, object> dicSets, Dictionary<Model.DataCenter.Viewport.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		bool UpdateDataCenterData(Model.DataCenter.Data obj, out string strErrorMessage);
		bool UpdateDataCenterData(Dictionary<Model.DataCenter.Data.Fields, object> dicSets, Dictionary<Model.DataCenter.Data.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		bool UpdateDataCenterOption(Model.DataCenter.Option obj, out string strErrorMessage);
		bool UpdateDataCenterOption(Dictionary<Model.DataCenter.Option.Fields, object> dicSets, Dictionary<Model.DataCenter.Option.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateEquipmentCategory(EquipmentCategory obj, out string strErrorMessage);
		bool UpdateEquipmentCategory(Dictionary<EquipmentCategory.Fields, object> dicSets, Dictionary<EquipmentCategory.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateEquipmentType(EquipmentType obj, out string strErrorMessage);
		bool UpdateEquipmentType(Dictionary<EquipmentType.Fields, object> dicSets, Dictionary<EquipmentType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateItem(Item obj, out string strErrorMessage);
		bool UpdateItem(Dictionary<Item.Fields, object> dicSets, Dictionary<Item.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateItem_RU(Item_RU obj, out string strErrorMessage);
		bool UpdateItem_RU(Dictionary<Item_RU.Fields, object> dicSets, Dictionary<Item_RU.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateLinkedItem(LinkedItem obj, out string strErrorMessage);
		bool UpdateLinkedItem(Dictionary<LinkedItem.Fields, object> dicSets, Dictionary<LinkedItem.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateItemType(ItemType obj, out string strErrorMessage);
		bool UpdateItemType(Dictionary<ItemType.Fields, object> dicSets, Dictionary<ItemType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateBackup(Backup obj, out string strErrorMessage);
		bool UpdateBackup(Dictionary<Backup.Fields, object> dicSets, Dictionary<Backup.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateBox(Box obj, out string strErrorMessage);
		bool UpdateBox(Dictionary<Box.Fields, object> dicSets, Dictionary<Box.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateEtc(Etc obj, out string strErrorMessage);
		bool UpdateEtc(Dictionary<Etc.Fields, object> dicSets, Dictionary<Etc.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateNetwork(Network obj, out string strErrorMessage);
		bool UpdateNetwork(Dictionary<Network.Fields, object> dicSets, Dictionary<Network.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateSanSwitch(SanSwitch obj, out string strErrorMessage);
		bool UpdateSanSwitch(Dictionary<SanSwitch.Fields, object> dicSets, Dictionary<SanSwitch.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateSecurity(Security obj, out string strErrorMessage);
		bool UpdateSecurity(Dictionary<Security.Fields, object> dicSets, Dictionary<Security.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateStorage(Storage obj, out string strErrorMessage);
		bool UpdateStorage(Dictionary<Storage.Fields, object> dicSets, Dictionary<Storage.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateItemServer(ItemServer obj, out string strErrorMessage);
		bool UpdateItemServer(Dictionary<ItemServer.Fields, object> dicSets, Dictionary<ItemServer.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateNation(Nation obj, out string strErrorMessage);
		bool UpdateNation(Dictionary<Nation.Fields, object> dicSets, Dictionary<Nation.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateRack(Rack obj, out string strErrorMessage);
		bool UpdateRack(Dictionary<Rack.Fields, object> dicSets, Dictionary<Rack.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateRackType(RackType obj, out string strErrorMessage);
		bool UpdateRackType(Dictionary<RackType.Fields, object> dicSets, Dictionary<RackType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateRackGroup(RackGroup obj, out string strErrorMessage);
		bool UpdateRackGroup(Dictionary<RackGroup.Fields, object> dicSets, Dictionary<RackGroup.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);


		bool UpdateSite(Model.Site.Site obj, out string strErrorMessage);
		bool UpdateSite(Dictionary<Model.Site.Site.Fields, object> dicSets, Dictionary<Model.Site.Site.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		bool UpdateSiteData(Model.Site.Data obj, out string strErrorMessage);
		bool UpdateSiteData(Dictionary<Model.Site.Data.Fields, object> dicSets, Dictionary<Model.Site.Data.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		bool UpdateSiteOption(Model.Site.Option obj, out string strErrorMessage);
		bool UpdateSiteOption(Dictionary<Model.Site.Option.Fields, object> dicSets, Dictionary<Model.Site.Option.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateFacility(Facility obj, out string strErrorMessage);
		bool UpdateFacility(Dictionary<Facility.Fields, object> dicSets, Dictionary<Facility.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateFacilityType(FacilityType obj, out string strErrorMessage);
		bool UpdateFacilityType(Dictionary<FacilityType.Fields, object> dicSets, Dictionary<FacilityType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateSensor(Sensor obj, out string strErrorMessage);
		bool UpdateSensor(Dictionary<Sensor.Fields, object> dicSets, Dictionary<Sensor.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateSensorHistory(History obj, out string strErrorMessage);
		bool UpdateSensorHistory(Dictionary<History.Fields, object> dicSets, Dictionary<History.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateSensorType(SensorType obj, out string strErrorMessage);
		bool UpdateSensorType(Dictionary<SensorType.Fields, object> dicSets, Dictionary<SensorType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateWorkChangeBasic(ChangeBasic obj, out string strErrorMessage);
		bool UpdateWorkChangeBasic(Dictionary<ChangeBasic.Fields, object> dicSets, Dictionary<ChangeBasic.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateWorkChangeTarget(ChangeTarget obj, out string strErrorMessage);
		bool UpdateWorkChangeTarget(Dictionary<ChangeTarget.Fields, object> dicSets, Dictionary<ChangeTarget.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateWorkFaultBasic(FaultBasic obj, out string strErrorMessage);
		bool UpdateWorkFaultBasic(Dictionary<FaultBasic.Fields, object> dicSets, Dictionary<FaultBasic.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateWorkFaultTarget(FaultTarget obj, out string strErrorMessage);
		bool UpdateWorkFaultTarget(Dictionary<FaultTarget.Fields, object> dicSets, Dictionary<FaultTarget.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateTeamRegular(Regular obj, out string strErrorMessage);
		bool UpdateTeamRegular(Dictionary<Regular.Fields, object> dicSets, Dictionary<Regular.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateTeamRegularMember(RegularMember obj, out string strErrorMessage);
		bool UpdateTeamRegularMember(Dictionary<RegularMember.Fields, object> dicSets, Dictionary<RegularMember.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

	}
}
