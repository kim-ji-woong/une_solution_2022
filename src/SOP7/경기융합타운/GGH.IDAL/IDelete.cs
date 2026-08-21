using System;
using System.Collections.Generic;
using GGH.Model.CCTV;
using GGH.Model;
using GGH.Model.Equipment;

namespace GGH.IDAL
{
	public interface IDelete
	{
		bool DeleteNvr(int id, out string strErrorMessage);
		bool DeleteNvr(Dictionary<Nvr.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteNvrLink(int cctvID, int nvrID, out string strErrorMessage);
		bool DeleteNvrLink(Dictionary<NvrLink.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteEvacuation(int siteID, out string strErrorMessage);
		bool DeleteEvacuation(Dictionary<Evacuation.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteParkingGate(int id, out string strErrorMessage);
		bool DeleteParkingGate(Dictionary<ParkingGate.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteUpdateData(int id, out string strErrorMessage);
		bool DeleteUpdateData(Dictionary<UpdateData.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteHistoryEarthquake(DateTime timeStamp, out string strErrorMessage);
		bool DeleteHistoryEarthquake(Dictionary<Model.History.Earthquake.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteFirstAidEquipment(int id, out string strErrorMessage);
		bool DeleteFirstAidEquipment(Dictionary<FirstAidEquipment.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteFirstAidEquipmentType(int id, out string strErrorMessage);
		bool DeleteFirstAidEquipmentType(Dictionary<FirstAidEquipmentType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
	}
}
