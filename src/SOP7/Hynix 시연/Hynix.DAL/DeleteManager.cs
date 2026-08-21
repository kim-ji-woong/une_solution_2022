using System;
using System.Collections;
using System.Collections.Generic;
using dnsDBUtil;
using Hynix.IDAL;
using Hynix.Model;
using Hynix.Model.History;

namespace Hynix.DAL
{
	public class DeleteManager : QueryManager, IDelete
	{
		private DataManager m_dataManager = null;

		public DeleteManager(DataManager dataManager)
		{
			m_dataManager = dataManager;
			m_dbManager = m_dataManager.GetDBManager() as DirectDBManager;
		}

		private bool DeleteFromID(string strTableName, int nID, out string strErrorMessage)
		{
			string strSQL = string.Format("Delete from {0} where ID = {1}", strTableName, nID);

			if (m_dbManager.GetResultData(strSQL) == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return false;
			}

			strErrorMessage = null;
			return true;
		}

		private bool DeleteFromCondition(string strTableName, string strCondition, string strAdditionalConditions, out string strErrorMessage)
		{
			if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
			{
				if (strCondition.Length > 0)
					strCondition += " And " + strAdditionalConditions;
				else
					strCondition = strAdditionalConditions;
			}

			string strSQL = string.Format("Delete from {0}", strTableName);

			if (strCondition.Length > 0)
				strSQL += " Where " + strCondition;

			if (m_dbManager.GetResultData(strSQL) == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return false;
			}

			strErrorMessage = null;
			return true;
		}

		public bool DeleteHynixCard(int cardID, out string strErrorMessage)
		{
			Dictionary<Card.Fields, object> dicConditions = new Dictionary<Card.Fields, object>();
			dicConditions[Card.Fields.CardID] = cardID;

			return DeleteHynixCard(dicConditions, null, out strErrorMessage);
		}

		public bool DeleteHynixCard(Dictionary<Card.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<Card.Fields>(ref strCondition, dicConditions, Card.GetFieldName, Card.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(Card.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteHynixCardReader(int cardReaderID, out string strErrorMessage)
		{
			Dictionary<CardReader.Fields, object> dicConditions = new Dictionary<CardReader.Fields, object>();
			dicConditions[CardReader.Fields.CardReaderID] = cardReaderID;

			return DeleteHynixCardReader(dicConditions, null, out strErrorMessage);
		}

		public bool DeleteHynixCardReader(Dictionary<CardReader.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<CardReader.Fields>(ref strCondition, dicConditions, CardReader.GetFieldName, CardReader.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(CardReader.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteHynixCardTagHistory(int cardTagHistoryID, out string strErrorMessage)
		{
			Dictionary<CardTag.Fields, object> dicConditions = new Dictionary<CardTag.Fields, object>();
			dicConditions[CardTag.Fields.CardTagHistoryID] = cardTagHistoryID;

			return DeleteHynixCardTagHistory(dicConditions, null, out strErrorMessage);
		}

		public bool DeleteHynixCardTagHistory(Dictionary<CardTag.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<CardTag.Fields>(ref strCondition, dicConditions, CardTag.GetFieldName, CardTag.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(CardTag.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteHynixEventHistroy(int eventHistroyID, out string strErrorMessage)
		{
			Dictionary<Event.Fields, object> dicConditions = new Dictionary<Event.Fields, object>();
			dicConditions[Event.Fields.EventHistroyID] = eventHistroyID;

			return DeleteHynixEventHistroy(dicConditions, null, out strErrorMessage);
		}

		public bool DeleteHynixEventHistroy(Dictionary<Event.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<Event.Fields>(ref strCondition, dicConditions, Event.GetFieldName, Event.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(Event.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteHynixItem(int itemID, out string strErrorMessage)
		{
			Dictionary<Item.Fields, object> dicConditions = new Dictionary<Item.Fields, object>();
			dicConditions[Item.Fields.ItemID] = itemID;

			return DeleteHynixItem(dicConditions, null, out strErrorMessage);
		}

		public bool DeleteHynixItem(Dictionary<Item.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<Item.Fields>(ref strCondition, dicConditions, Item.GetFieldName, Item.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(Item.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteHynixItemLinkZone(int itemID, int zoneID, out string strErrorMessage)
		{
			Dictionary<ItemLinkZone.Fields, object> dicConditions = new Dictionary<ItemLinkZone.Fields, object>();
			dicConditions[ItemLinkZone.Fields.ItemID] = itemID;
			dicConditions[ItemLinkZone.Fields.ZoneID] = zoneID;

			return DeleteHynixItemLinkZone(dicConditions, null, out strErrorMessage);
		}

		public bool DeleteHynixItemLinkZone(Dictionary<ItemLinkZone.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<ItemLinkZone.Fields>(ref strCondition, dicConditions, ItemLinkZone.GetFieldName, ItemLinkZone.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(ItemLinkZone.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteHynixSmartTag(int smartTagID, out string strErrorMessage)
		{
			Dictionary<Hynix.Model.SmartTag.Fields, object> dicConditions = new Dictionary<Hynix.Model.SmartTag.Fields, object>();
			dicConditions[Hynix.Model.SmartTag.Fields.SmartTagID] = smartTagID;

			return DeleteHynixSmartTag(dicConditions, null, out strErrorMessage);
		}

		public bool DeleteHynixSmartTag(Dictionary<Hynix.Model.SmartTag.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<Hynix.Model.SmartTag.Fields>(ref strCondition, dicConditions, Hynix.Model.SmartTag.GetFieldName, Hynix.Model.SmartTag.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(Hynix.Model.SmartTag.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteHynixSmartTagHistory(int smartTagHistoryID, out string strErrorMessage)
		{
			Dictionary<Hynix.Model.History.SmartTag.Fields, object> dicConditions = new Dictionary<Hynix.Model.History.SmartTag.Fields, object>();
			dicConditions[Hynix.Model.History.SmartTag.Fields.SmartTagHistoryID] = smartTagHistoryID;

			return DeleteHynixSmartTagHistory(dicConditions, null, out strErrorMessage);
		}

		public bool DeleteHynixSmartTagHistory(Dictionary<Hynix.Model.History.SmartTag.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<Hynix.Model.History.SmartTag.Fields>(ref strCondition, dicConditions, Hynix.Model.History.SmartTag.GetFieldName, Hynix.Model.History.SmartTag.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(Hynix.Model.History.SmartTag.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteHynixSmartTagReader(int smartTagReaderID, out string strErrorMessage)
		{
			Dictionary<SmartTagReader.Fields, object> dicConditions = new Dictionary<SmartTagReader.Fields, object>();
			dicConditions[SmartTagReader.Fields.SmartTagReaderID] = smartTagReaderID;

			return DeleteHynixSmartTagReader(dicConditions, null, out strErrorMessage);
		}

		public bool DeleteHynixSmartTagReader(Dictionary<SmartTagReader.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<SmartTagReader.Fields>(ref strCondition, dicConditions, SmartTagReader.GetFieldName, SmartTagReader.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(SmartTagReader.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteHynixWokerLinkZone(int workerID, int zoneID, out string strErrorMessage)
		{
			Dictionary<WokerLinkZone.Fields, object> dicConditions = new Dictionary<WokerLinkZone.Fields, object>();
			dicConditions[WokerLinkZone.Fields.WorkerID] = workerID;
			dicConditions[WokerLinkZone.Fields.ZoneID] = zoneID;

			return DeleteHynixWokerLinkZone(dicConditions, null, out strErrorMessage);
		}

		public bool DeleteHynixWokerLinkZone(Dictionary<WokerLinkZone.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<WokerLinkZone.Fields>(ref strCondition, dicConditions, WokerLinkZone.GetFieldName, WokerLinkZone.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(WokerLinkZone.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteHynixWorker(int workerID, out string strErrorMessage)
		{
			Dictionary<Worker.Fields, object> dicConditions = new Dictionary<Worker.Fields, object>();
			dicConditions[Worker.Fields.WorkerID] = workerID;

			return DeleteHynixWorker(dicConditions, null, out strErrorMessage);
		}

		public bool DeleteHynixWorker(Dictionary<Worker.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<Worker.Fields>(ref strCondition, dicConditions, Worker.GetFieldName, Worker.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(Worker.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool DeleteHynixAbnormalHistory(int workerID, DateTime time, int eventHistroyID, out string strErrorMessage)
		{
			Dictionary<Abnormal.Fields, object> dicConditions = new Dictionary<Abnormal.Fields, object>();
			dicConditions[Abnormal.Fields.WorkerID] = workerID;
			dicConditions[Abnormal.Fields.Time] = time;
			dicConditions[Abnormal.Fields.EventHistroyID] = eventHistroyID;

			return DeleteHynixAbnormalHistory(dicConditions, null, out strErrorMessage);
		}

		public bool DeleteHynixAbnormalHistory(Dictionary<Abnormal.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<Abnormal.Fields>(ref strCondition, dicConditions, Abnormal.GetFieldName, Abnormal.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(Abnormal.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool DeleteHynixSensorZoneHistoryInfo(int sensorZoneHistoryID, int orderIndex, out string strErrorMessage)
		{
			Dictionary<SensorZoneInfo.Fields, object> dicConditions = new Dictionary<SensorZoneInfo.Fields, object>();
			dicConditions[SensorZoneInfo.Fields.SensorZoneHistoryID] = sensorZoneHistoryID;
			dicConditions[SensorZoneInfo.Fields.OrderIndex] = orderIndex;

			return DeleteHynixSensorZoneHistoryInfo(dicConditions, null, out strErrorMessage);
		}

		public bool DeleteHynixSensorZoneHistoryInfo(Dictionary<SensorZoneInfo.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<SensorZoneInfo.Fields>(ref strCondition, dicConditions, SensorZoneInfo.GetFieldName, SensorZoneInfo.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(SensorZoneInfo.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool DeleteHynixDoor(int doorID, out string strErrorMessage)
		{
			Dictionary<Door.Fields, object> dicConditions = new Dictionary<Door.Fields, object>();
			dicConditions[Door.Fields.DoorID] = doorID;

			return DeleteHynixDoor(dicConditions, null, out strErrorMessage);
		}

		public bool DeleteHynixDoor(Dictionary<Door.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<Door.Fields>(ref strCondition, dicConditions, Door.GetFieldName, Door.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(Door.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool DeleteHynixAlarmScript(int sensorTypeID, out string strErrorMessage)
		{
			Dictionary<AlarmScript.Fields, object> dicConditions = new Dictionary<AlarmScript.Fields, object>();
			dicConditions[AlarmScript.Fields.SensorTypeID] = sensorTypeID;

			return DeleteHynixAlarmScript(dicConditions, null, out strErrorMessage);
		}

		public bool DeleteHynixAlarmScript(Dictionary<AlarmScript.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<AlarmScript.Fields>(ref strCondition, dicConditions, AlarmScript.GetFieldName, AlarmScript.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(AlarmScript.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}
	}
}
