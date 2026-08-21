using Hynix.Model;
using Hynix.Model.History;

namespace Hynix.IDAL
{
	public interface ICreate
	{
		Card CreateHynixCard(Card obj, out string strErrorMessage);
		CardReader CreateHynixCardReader(CardReader obj, out string strErrorMessage);
		CardTag CreateHynixCardTagHistory(CardTag obj, out string strErrorMessage);
		Event CreateHynixEventHistroy(Event obj, out string strErrorMessage);
		Item CreateHynixItem(Item obj, out string strErrorMessage);
		ItemLinkZone CreateHynixItemLinkZone(ItemLinkZone obj, out string strErrorMessage);
		Hynix.Model.SmartTag CreateHynixSmartTag(Hynix.Model.SmartTag obj, out string strErrorMessage);
		Hynix.Model.History.SmartTag CreateHynixSmartTagHistory(Hynix.Model.History.SmartTag obj, out string strErrorMessage);
		SmartTagReader CreateHynixSmartTagReader(SmartTagReader obj, out string strErrorMessage);
		WokerLinkZone CreateHynixWokerLinkZone(WokerLinkZone obj, out string strErrorMessage);
		Worker CreateHynixWorker(Worker obj, out string strErrorMessage);
		Abnormal CreateHynixAbnormalHistory(Abnormal obj, out string strErrorMessage);
		SensorZoneInfo CreateHynixSensorZoneHistoryInfo(SensorZoneInfo obj, out string strErrorMessage);
		Door CreateHynixDoor(Door obj, out string strErrorMessage);
		AlarmScript CreateHynixAlarmScript(AlarmScript obj, out string strErrorMessage);
	}
}
