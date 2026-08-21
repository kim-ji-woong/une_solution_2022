using System;
using System.Collections;
using System.Collections.Generic;
using GGH.Model.CCTV;
using GGH.Model;
using GGH.Model.Equipment;

namespace GGH.IDAL
{
	public interface ISelect
	{
		Nvr SelectNvr(int id, out string strErrorMessage);
		List<Nvr> SelectNvrs(Dictionary<Nvr.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<Nvr> SelectNvrs(Dictionary<Nvr.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		NvrLink SelectNvrLink(int cctvID, int nvrID, out string strErrorMessage);
		List<NvrLink> SelectNvrLinks(Dictionary<NvrLink.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<NvrLink> SelectNvrLinks(Dictionary<NvrLink.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		Evacuation SelectEvacuation(int siteID, out string strErrorMessage);
		List<Evacuation> SelectEvacuations(Dictionary<Evacuation.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<Evacuation> SelectEvacuations(Dictionary<Evacuation.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		ParkingGate SelectParkingGate(int id, out string strErrorMessage);
		List<ParkingGate> SelectParkingGates(Dictionary<ParkingGate.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<ParkingGate> SelectParkingGates(Dictionary<ParkingGate.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		UpdateData SelectUpdateData(int id, out string strErrorMessage);
		List<UpdateData> SelectUpdateDatas(Dictionary<UpdateData.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<UpdateData> SelectUpdateDatas(Dictionary<UpdateData.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		Model.History.Earthquake SelectHistoryEarthquake(DateTime timeStamp, out string strErrorMessage);
		List<Model.History.Earthquake> SelectHistoryEarthquakes(Dictionary<Model.History.Earthquake.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<Model.History.Earthquake> SelectHistoryEarthquakes(Dictionary<Model.History.Earthquake.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		FirstAidEquipment SelectFirstAidEquipment(int id, out string strErrorMessage);
		List<FirstAidEquipment> SelectFirstAidEquipments(Dictionary<FirstAidEquipment.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<FirstAidEquipment> SelectFirstAidEquipments(Dictionary<FirstAidEquipment.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		FirstAidEquipmentType SelectFirstAidEquipmentType(int id, out string strErrorMessage);
		List<FirstAidEquipmentType> SelectFirstAidEquipmentTypes(Dictionary<FirstAidEquipmentType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<FirstAidEquipmentType> SelectFirstAidEquipmentTypes(Dictionary<FirstAidEquipmentType.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		ArrayList JoinCctvCctvNvrLink(List<Nvr> nvrList, string strAdditionalConditions, out string strErrorMessage);
		ArrayList JoinFirstAidEquipmentEquipmentType(string strConditions, out string strErrorMessage);
	}
}
