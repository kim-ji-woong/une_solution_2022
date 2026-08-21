using System;
using System.Collections;
using System.Collections.Generic;
using Hynix.Model;
using Hynix.Model.History;

namespace Hynix.IDAL
{
	public interface ISelect
	{
		Card SelectHynixCard(int cardID, out string strErrorMessage);
		List<Card> SelectHynixCards(Dictionary<Card.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<Card> SelectHynixCards(Dictionary<Card.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		CardReader SelectHynixCardReader(int cardReaderID, out string strErrorMessage);
		List<CardReader> SelectHynixCardReaders(Dictionary<CardReader.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<CardReader> SelectHynixCardReaders(Dictionary<CardReader.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		CardTag SelectHynixCardTagHistory(int cardTagHistoryID, out string strErrorMessage);
		List<CardTag> SelectHynixCardTagHistorys(Dictionary<CardTag.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<CardTag> SelectHynixCardTagHistorys(Dictionary<CardTag.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		Event SelectHynixEventHistroy(int eventHistroyID, out string strErrorMessage);
		List<Event> SelectHynixEventHistroys(Dictionary<Event.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<Event> SelectHynixEventHistroys(Dictionary<Event.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		Item SelectHynixItem(int itemID, out string strErrorMessage);
		List<Item> SelectHynixItems(Dictionary<Item.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<Item> SelectHynixItems(Dictionary<Item.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		ItemLinkZone SelectHynixItemLinkZone(int itemID, int zoneID, out string strErrorMessage);
		List<ItemLinkZone> SelectHynixItemLinkZones(Dictionary<ItemLinkZone.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<ItemLinkZone> SelectHynixItemLinkZones(Dictionary<ItemLinkZone.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		Hynix.Model.SmartTag SelectHynixSmartTag(int smartTagID, out string strErrorMessage);
		List<Hynix.Model.SmartTag> SelectHynixSmartTags(Dictionary<Hynix.Model.SmartTag.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<Hynix.Model.SmartTag> SelectHynixSmartTags(Dictionary<Hynix.Model.SmartTag.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		Hynix.Model.History.SmartTag SelectHynixSmartTagHistory(int smartTagHistoryID, out string strErrorMessage);
		List<Hynix.Model.History.SmartTag> SelectHynixSmartTagHistorys(Dictionary<Hynix.Model.History.SmartTag.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<Hynix.Model.History.SmartTag> SelectHynixSmartTagHistorys(Dictionary<Hynix.Model.History.SmartTag.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		SmartTagReader SelectHynixSmartTagReader(int smartTagReaderID, out string strErrorMessage);
		List<SmartTagReader> SelectHynixSmartTagReaders(Dictionary<SmartTagReader.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<SmartTagReader> SelectHynixSmartTagReaders(Dictionary<SmartTagReader.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		WokerLinkZone SelectHynixWokerLinkZone(int workerID, int zoneID, out string strErrorMessage);
		List<WokerLinkZone> SelectHynixWokerLinkZones(Dictionary<WokerLinkZone.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<WokerLinkZone> SelectHynixWokerLinkZones(Dictionary<WokerLinkZone.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		Worker SelectHynixWorker(int workerID, out string strErrorMessage);
		List<Worker> SelectHynixWorkers(Dictionary<Worker.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<Worker> SelectHynixWorkers(Dictionary<Worker.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		Abnormal SelectHynixAbnormalHistory(int workerID, DateTime time, int eventHistroyID, out string strErrorMessage);
		List<Abnormal> SelectHynixAbnormalHistorys(Dictionary<Abnormal.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<Abnormal> SelectHynixAbnormalHistorys(Dictionary<Abnormal.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		SensorZoneInfo SelectHynixSensorZoneHistoryInfo(int sensorZoneHistoryID, int orderIndex, out string strErrorMessage);
		List<SensorZoneInfo> SelectHynixSensorZoneHistoryInfos(Dictionary<SensorZoneInfo.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<SensorZoneInfo> SelectHynixSensorZoneHistoryInfos(Dictionary<SensorZoneInfo.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		Door SelectHynixDoor(int doorID, out string strErrorMessage);
		List<Door> SelectHynixDoors(Dictionary<Door.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<Door> SelectHynixDoors(Dictionary<Door.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		AlarmScript SelectHynixAlarmScript(int sensorTypeID, out string strErrorMessage);
		List<AlarmScript> SelectHynixAlarmScripts(Dictionary<AlarmScript.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<AlarmScript> SelectHynixAlarmScripts(Dictionary<AlarmScript.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		ArrayList JoinSensorZoneSensors(Dictionary<SDMS.Model.Sensor.SensorZone.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		ArrayList JoinSensorZoneSensors(Dictionary<SDMS.Model.Sensor.SensorZone.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);
	}
}
