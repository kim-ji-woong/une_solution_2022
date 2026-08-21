using System.Collections.Generic;
using GGH.Model.CCTV;
using GGH.Model;
using SDMS.Model.CCTV;

namespace GGH.IDAL
{
	using Model.Equipment;

	public interface IUpdate
	{
		bool UpdateNvr(Nvr obj, out string strErrorMessage);
		bool UpdateNvr(Dictionary<Nvr.Fields, object> dicSets, Dictionary<Nvr.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateNvrLink(NvrLink obj, out string strErrorMessage);
		bool UpdateNvrLink(Dictionary<NvrLink.Fields, object> dicSets, Dictionary<NvrLink.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateEvacuation(Evacuation obj, out string strErrorMessage);
		bool UpdateEvacuation(Dictionary<Evacuation.Fields, object> dicSets, Dictionary<Evacuation.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateParkingGate(ParkingGate obj, out string strErrorMessage);
		bool UpdateParkingGate(Dictionary<ParkingGate.Fields, object> dicSets, Dictionary<ParkingGate.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateData(UpdateData obj, out string strErrorMessage);
		bool UpdateData(Dictionary<UpdateData.Fields, object> dicSets, Dictionary<UpdateData.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateCCTV(CCTV cctv, out string strErrorMessage);

		bool UpdateHistoryEarthquake(Model.History.Earthquake obj, out string strErrorMessage);
		bool UpdateHistoryEarthquake(Dictionary<Model.History.Earthquake.Fields, object> dicSets, Dictionary<Model.History.Earthquake.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateFirstAidEquipment(FirstAidEquipment obj, out string strErrorMessage);
		bool UpdateFirstAidEquipment(Dictionary<FirstAidEquipment.Fields, object> dicSets, Dictionary<FirstAidEquipment.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateFirstAidEquipmentType(FirstAidEquipmentType obj, out string strErrorMessage);
		bool UpdateFirstAidEquipmentType(Dictionary<FirstAidEquipmentType.Fields, object> dicSets, Dictionary<FirstAidEquipmentType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
	}
}
