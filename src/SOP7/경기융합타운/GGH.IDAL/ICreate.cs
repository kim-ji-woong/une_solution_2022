using GGH.Model.CCTV;
using GGH.Model;
using GGH.Model.Equipment;

namespace GGH.IDAL
{
	public interface ICreate
	{
		Nvr CreateNvr(Nvr obj, out string strErrorMessage);
		NvrLink CreateNvrLink(NvrLink obj, out string strErrorMessage);
		Evacuation CreateEvacuation(Evacuation obj, out string strErrorMessage);
		ParkingGate CreateParkingGate(ParkingGate obj, out string strErrorMessage);
		UpdateData CreateUpdateData(UpdateData obj, out string strErrorMessage);
		Model.History.Earthquake CreateHistoryEarthquake(Model.History.Earthquake obj, out string strErrorMessage);
		FirstAidEquipment CreateFirstAidEquipment(FirstAidEquipment obj, out string strErrorMessage);
		FirstAidEquipmentType CreateFirstAidEquipmentType(FirstAidEquipmentType obj, out string strErrorMessage);
	}
}
