using System.Collections.Generic;
using Hynix.Model;
using Hynix.Model.History;

namespace Hynix.IDAL
{
	public interface IUpdate
	{
		bool UpdateHynixCard(Card obj, out string strErrorMessage);
		bool UpdateHynixCard(Dictionary<Card.Fields, object> dicSets, Dictionary<Card.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateHynixCardReader(CardReader obj, out string strErrorMessage);
		bool UpdateHynixCardReader(Dictionary<CardReader.Fields, object> dicSets, Dictionary<CardReader.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateHynixCardTagHistory(CardTag obj, out string strErrorMessage);
		bool UpdateHynixCardTagHistory(Dictionary<CardTag.Fields, object> dicSets, Dictionary<CardTag.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateHynixEventHistroy(Event obj, out string strErrorMessage);
		bool UpdateHynixEventHistroy(Dictionary<Event.Fields, object> dicSets, Dictionary<Event.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateHynixItem(Item obj, out string strErrorMessage);
		bool UpdateHynixItem(Dictionary<Item.Fields, object> dicSets, Dictionary<Item.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateHynixItemLinkZone(ItemLinkZone obj, out string strErrorMessage);
		bool UpdateHynixItemLinkZone(Dictionary<ItemLinkZone.Fields, object> dicSets, Dictionary<ItemLinkZone.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateHynixSmartTag(Hynix.Model.SmartTag obj, out string strErrorMessage);
		bool UpdateHynixSmartTag(Dictionary<Hynix.Model.SmartTag.Fields, object> dicSets, Dictionary<Hynix.Model.SmartTag.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateHynixSmartTagHistory(Hynix.Model.History.SmartTag obj, out string strErrorMessage);
		bool UpdateHynixSmartTagHistory(Dictionary<Hynix.Model.History.SmartTag.Fields, object> dicSets, Dictionary<Hynix.Model.History.SmartTag.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateHynixSmartTagReader(SmartTagReader obj, out string strErrorMessage);
		bool UpdateHynixSmartTagReader(Dictionary<SmartTagReader.Fields, object> dicSets, Dictionary<SmartTagReader.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateHynixWokerLinkZone(WokerLinkZone obj, out string strErrorMessage);
		bool UpdateHynixWokerLinkZone(Dictionary<WokerLinkZone.Fields, object> dicSets, Dictionary<WokerLinkZone.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateHynixWorker(Worker obj, out string strErrorMessage);
		bool UpdateHynixWorker(Dictionary<Worker.Fields, object> dicSets, Dictionary<Worker.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateHynixAbnormalHistory(Abnormal obj, out string strErrorMessage);
		bool UpdateHynixAbnormalHistory(Dictionary<Abnormal.Fields, object> dicSets, Dictionary<Abnormal.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateHynixSensorZoneHistoryInfo(SensorZoneInfo obj, out string strErrorMessage);
		bool UpdateHynixSensorZoneHistoryInfo(Dictionary<SensorZoneInfo.Fields, object> dicSets, Dictionary<SensorZoneInfo.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateHynixDoor(Door obj, out string strErrorMessage);
		bool UpdateHynixDoor(Dictionary<Door.Fields, object> dicSets, Dictionary<Door.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateHynixAlarmScript(AlarmScript obj, out string strErrorMessage);
		bool UpdateHynixAlarmScript(Dictionary<AlarmScript.Fields, object> dicSets, Dictionary<AlarmScript.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
	}
}
