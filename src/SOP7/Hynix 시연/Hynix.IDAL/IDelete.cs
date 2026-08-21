using System;
using System.Collections.Generic;
using Hynix.Model;
using Hynix.Model.History;

namespace Hynix.IDAL
{
	public interface IDelete
	{
		bool DeleteHynixCard(int cardID, out string strErrorMessage);
		bool DeleteHynixCard(Dictionary<Card.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteHynixCardReader(int cardReaderID, out string strErrorMessage);
		bool DeleteHynixCardReader(Dictionary<CardReader.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteHynixCardTagHistory(int cardTagHistoryID, out string strErrorMessage);
		bool DeleteHynixCardTagHistory(Dictionary<CardTag.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteHynixEventHistroy(int eventHistroyID, out string strErrorMessage);
		bool DeleteHynixEventHistroy(Dictionary<Event.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteHynixItem(int itemID, out string strErrorMessage);
		bool DeleteHynixItem(Dictionary<Item.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteHynixItemLinkZone(int itemID, int zoneID, out string strErrorMessage);
		bool DeleteHynixItemLinkZone(Dictionary<ItemLinkZone.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteHynixSmartTag(int smartTagID, out string strErrorMessage);
		bool DeleteHynixSmartTag(Dictionary<Hynix.Model.SmartTag.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteHynixSmartTagHistory(int smartTagHistoryID, out string strErrorMessage);
		bool DeleteHynixSmartTagHistory(Dictionary<Hynix.Model.History.SmartTag.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteHynixSmartTagReader(int smartTagReaderID, out string strErrorMessage);
		bool DeleteHynixSmartTagReader(Dictionary<SmartTagReader.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteHynixWokerLinkZone(int workerID, int zoneID, out string strErrorMessage);
		bool DeleteHynixWokerLinkZone(Dictionary<WokerLinkZone.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteHynixWorker(int workerID, out string strErrorMessage);
		bool DeleteHynixWorker(Dictionary<Worker.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteHynixAbnormalHistory(int workerID, DateTime time, int eventHistroyID, out string strErrorMessage);
		bool DeleteHynixAbnormalHistory(Dictionary<Abnormal.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteHynixSensorZoneHistoryInfo(int sensorZoneHistoryID, int orderIndex, out string strErrorMessage);
		bool DeleteHynixSensorZoneHistoryInfo(Dictionary<SensorZoneInfo.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteHynixDoor(int doorID, out string strErrorMessage);
		bool DeleteHynixDoor(Dictionary<Door.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteHynixAlarmScript(int sensorTypeID, out string strErrorMessage);
		bool DeleteHynixAlarmScript(Dictionary<AlarmScript.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
	}
}
