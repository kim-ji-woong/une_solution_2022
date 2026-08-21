using VDS.Model;
using VDS.Model.Account;
using VDS.Model.Team;
using VDS.Model.ItemData;
using VDS.Model.Sensor;
using VDS.Model.Work;

namespace VDS.IDAL
{
	public interface ICreate
	{
		Level CreateAccountLevel(Level obj, out string strErrorMessage);
		Option CreateAccountOption(Option obj, out string strErrorMessage);
		Session CreateAccountSession(Session obj, out string strErrorMessage);
		User CreateAccountUser(User obj, out string strErrorMessage);
		UserData CreateAccountUserData(UserData obj, out string strErrorMessage);
		UserDataCenterLink CreateAccountUserDataCenterLink(UserDataCenterLink obj, out string strErrorMessage);
		Company CreateCompany(Company obj, out string strErrorMessage);
		Model.DataCenter.DataCenter CreateDataCenter(Model.DataCenter.DataCenter obj, out string strErrorMessage);
		Model.DataCenter.Viewport CreateDataCenterViewport(Model.DataCenter.Viewport obj, out string strErrorMessage);
		Model.DataCenter.Data CreateDataCenterData(Model.DataCenter.Data obj, out string strErrorMessage);
		Model.DataCenter.Option CreateDataCenterOption(Model.DataCenter.Option obj, out string strErrorMessage);
		EquipmentCategory CreateEquipmentCategory(EquipmentCategory obj, out string strErrorMessage);
		EquipmentType CreateEquipmentType(EquipmentType obj, out string strErrorMessage);
		Item CreateItem(Item obj, out string strErrorMessage);
		Item_RU CreateItem_RU(Item_RU obj, out string strErrorMessage);
		ItemType CreateItemType(ItemType obj, out string strErrorMessage);
		Backup CreateBackup(Backup obj, out string strErrorMessage);
		Box CreateBox(Box obj, out string strErrorMessage);
		Etc CreateEtc(Etc obj, out string strErrorMessage);
		Network CreateNetwork(Network obj, out string strErrorMessage);
		SanSwitch CreateSanSwitch(SanSwitch obj, out string strErrorMessage);
		Security CreateSecurity(Security obj, out string strErrorMessage);
		Storage CreateStorage(Storage obj, out string strErrorMessage);
		ItemServer CreateItemServer(ItemServer obj, out string strErrorMessage);
		LinkedItem CreateLinkedItem(LinkedItem obj, out string strErrorMessage);
		Nation CreateNation(Nation obj, out string strErrorMessage);
		Rack CreateRack(Rack obj, out string strErrorMessage);
		RackType CreateRackType(RackType obj, out string strErrorMessage);
		RackGroup CreateRackGroup(RackGroup obj, out string strErrorMessage);
		Model.Site.Site CreateSite(Model.Site.Site obj, out string strErrorMessage);
		Model.Site.Data CreateSiteData(Model.Site.Data obj, out string strErrorMessage);
		Model.Site.Option CreateSiteOption(Model.Site.Option obj, out string strErrorMessage);
		Facility CreateFacility(Facility obj, out string strErrorMessage);
		FacilityType CreateFacilityType(FacilityType obj, out string strErrorMessage);
		Sensor CreateSensor(Sensor obj, out string strErrorMessage);
		History CreateSensorHistory(History obj, out string strErrorMessage);
		SensorType CreateSensorType(SensorType obj, out string strErrorMessage);
		ChangeBasic CreateWorkChangeBasic(ChangeBasic obj, out string strErrorMessage);
		ChangeTarget CreateWorkChangeTarget(ChangeTarget obj, out string strErrorMessage);
		FaultBasic CreateWorkFaultBasic(FaultBasic obj, out string strErrorMessage);
		FaultTarget CreateWorkFaultTarget(FaultTarget obj, out string strErrorMessage);
		Regular CreateTeamRegular(Regular obj, out string strErrorMessage);
		RegularMember CreateTeamRegularMember(RegularMember obj, out string strErrorMessage);
	}
}
