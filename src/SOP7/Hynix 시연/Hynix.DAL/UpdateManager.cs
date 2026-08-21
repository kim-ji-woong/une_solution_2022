using System;
using System.Collections;
using System.Collections.Generic;
using dnsDBUtil;
using Hynix.IDAL;
using Hynix.Model;
using Hynix.Model.History;

namespace Hynix.DAL
{
	public class UpdateManager : QueryManager, IUpdate
	{
		private DataManager m_dataManager = null;

		public UpdateManager(DataManager dataManager)
		{
			m_dataManager = dataManager;
			m_dbManager = m_dataManager.GetDBManager() as DirectDBManager;
		}

		public bool UpdateFromCondition(string strTableName, string strSets, string strCondition, string strAdditionalConditions, out string strErrorMessage)
		{
			if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
			{
				if (strCondition.Length > 0)
					strCondition += " and " + strAdditionalConditions;
				else
					strCondition = strAdditionalConditions;
			}

			string strSQL = string.Format("Update {0} set {1} where {2}", strTableName, strSets, strCondition);

			if (m_dbManager.GetResultData(strSQL) == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return false;
			}

			strErrorMessage = null;
			return true;
		}

		public bool UpdateHynixCard(Card obj, out string strErrorMessage)
		{
			Dictionary<Card.Fields, object> dicSets = new Dictionary<Card.Fields, object>();
			dicSets[Card.Fields.WorkerID] = obj.WorkerID;
			dicSets[Card.Fields.UniqueKey] = obj.UniqueKey;

			Dictionary<Card.Fields, object> dicConditions = new Dictionary<Card.Fields, object>();
			dicConditions[Card.Fields.CardID] = obj.CardID;

			return UpdateHynixCard(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateHynixCard(Dictionary<Card.Fields, object> dicSets, Dictionary<Card.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<Card.Fields>(ref strSets, dicSets, Card.GetFieldName, Card.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<Card.Fields>(ref strCondition, dicConditions, Card.GetFieldName, Card.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(Card.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateHynixCardReader(CardReader obj, out string strErrorMessage)
		{
			Dictionary<CardReader.Fields, object> dicSets = new Dictionary<CardReader.Fields, object>();
			dicSets[CardReader.Fields.ZoneID] = obj.ZoneID;
			dicSets[CardReader.Fields.UniqueKey] = obj.UniqueKey;
			dicSets[CardReader.Fields.X] = obj.X;
			dicSets[CardReader.Fields.Y] = obj.Y;
			dicSets[CardReader.Fields.Z] = obj.Z;

			Dictionary<CardReader.Fields, object> dicConditions = new Dictionary<CardReader.Fields, object>();
			dicConditions[CardReader.Fields.CardReaderID] = obj.CardReaderID;

			return UpdateHynixCardReader(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateHynixCardReader(Dictionary<CardReader.Fields, object> dicSets, Dictionary<CardReader.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<CardReader.Fields>(ref strSets, dicSets, CardReader.GetFieldName, CardReader.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<CardReader.Fields>(ref strCondition, dicConditions, CardReader.GetFieldName, CardReader.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(CardReader.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateHynixCardTagHistory(CardTag obj, out string strErrorMessage)
		{
			Dictionary<CardTag.Fields, object> dicSets = new Dictionary<CardTag.Fields, object>();
			dicSets[CardTag.Fields.Time] = obj.Time;
			dicSets[CardTag.Fields.CardID] = obj.CardID;
			dicSets[CardTag.Fields.CardReaderID] = obj.CardReaderID;
			dicSets[CardTag.Fields.Type] = obj.Type;
			dicSets[CardTag.Fields.IsApprove] = obj.IsApprove;

			Dictionary<CardTag.Fields, object> dicConditions = new Dictionary<CardTag.Fields, object>();
			dicConditions[CardTag.Fields.CardTagHistoryID] = obj.CardTagHistoryID;

			return UpdateHynixCardTagHistory(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateHynixCardTagHistory(Dictionary<CardTag.Fields, object> dicSets, Dictionary<CardTag.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<CardTag.Fields>(ref strSets, dicSets, CardTag.GetFieldName, CardTag.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<CardTag.Fields>(ref strCondition, dicConditions, CardTag.GetFieldName, CardTag.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(CardTag.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateHynixEventHistroy(Event obj, out string strErrorMessage)
		{
			Dictionary<Event.Fields, object> dicSets = new Dictionary<Event.Fields, object>();
			dicSets[Event.Fields.CardReaderID] = obj.CardReaderID;
			dicSets[Event.Fields.WorkerID] = obj.WorkerID;
			dicSets[Event.Fields.Time] = obj.Time;
			dicSets[Event.Fields.Type] = obj.Type;

			Dictionary<Event.Fields, object> dicConditions = new Dictionary<Event.Fields, object>();
			dicConditions[Event.Fields.EventHistroyID] = obj.EventHistroyID;

			return UpdateHynixEventHistroy(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateHynixEventHistroy(Dictionary<Event.Fields, object> dicSets, Dictionary<Event.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<Event.Fields>(ref strSets, dicSets, Event.GetFieldName, Event.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<Event.Fields>(ref strCondition, dicConditions, Event.GetFieldName, Event.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(Event.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateHynixItem(Item obj, out string strErrorMessage)
		{
			Dictionary<Item.Fields, object> dicSets = new Dictionary<Item.Fields, object>();
			dicSets[Item.Fields.Name] = obj.Name;

			Dictionary<Item.Fields, object> dicConditions = new Dictionary<Item.Fields, object>();
			dicConditions[Item.Fields.ItemID] = obj.ItemID;

			return UpdateHynixItem(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateHynixItem(Dictionary<Item.Fields, object> dicSets, Dictionary<Item.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<Item.Fields>(ref strSets, dicSets, Item.GetFieldName, Item.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<Item.Fields>(ref strCondition, dicConditions, Item.GetFieldName, Item.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(Item.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateHynixItemLinkZone(ItemLinkZone obj, out string strErrorMessage)
		{
			Dictionary<ItemLinkZone.Fields, object> dicSets = new Dictionary<ItemLinkZone.Fields, object>();

			Dictionary<ItemLinkZone.Fields, object> dicConditions = new Dictionary<ItemLinkZone.Fields, object>();
			dicConditions[ItemLinkZone.Fields.ItemID] = obj.ItemID;
			dicConditions[ItemLinkZone.Fields.ZoneID] = obj.ZoneID;

			return UpdateHynixItemLinkZone(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateHynixItemLinkZone(Dictionary<ItemLinkZone.Fields, object> dicSets, Dictionary<ItemLinkZone.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<ItemLinkZone.Fields>(ref strSets, dicSets, ItemLinkZone.GetFieldName, ItemLinkZone.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<ItemLinkZone.Fields>(ref strCondition, dicConditions, ItemLinkZone.GetFieldName, ItemLinkZone.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(ItemLinkZone.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateHynixSmartTag(Hynix.Model.SmartTag obj, out string strErrorMessage)
		{
			Dictionary<Hynix.Model.SmartTag.Fields, object> dicSets = new Dictionary<Hynix.Model.SmartTag.Fields, object>();
			dicSets[Hynix.Model.SmartTag.Fields.UniqueKey] = obj.UniqueKey;
			dicSets[Hynix.Model.SmartTag.Fields.WorkerID] = obj.WorkerID;
			dicSets[Hynix.Model.SmartTag.Fields.ItemID] = obj.ItemID;

			Dictionary<Hynix.Model.SmartTag.Fields, object> dicConditions = new Dictionary<Hynix.Model.SmartTag.Fields, object>();
			dicConditions[Hynix.Model.SmartTag.Fields.SmartTagID] = obj.SmartTagID;

			return UpdateHynixSmartTag(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateHynixSmartTag(Dictionary<Hynix.Model.SmartTag.Fields, object> dicSets, Dictionary<Hynix.Model.SmartTag.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<Hynix.Model.SmartTag.Fields>(ref strSets, dicSets, Hynix.Model.SmartTag.GetFieldName, Hynix.Model.SmartTag.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<Hynix.Model.SmartTag.Fields>(ref strCondition, dicConditions, Hynix.Model.SmartTag.GetFieldName, Hynix.Model.SmartTag.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(Hynix.Model.SmartTag.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateHynixSmartTagHistory(Hynix.Model.History.SmartTag obj, out string strErrorMessage)
		{
			Dictionary<Hynix.Model.History.SmartTag.Fields, object> dicSets = new Dictionary<Hynix.Model.History.SmartTag.Fields, object>();
			dicSets[Hynix.Model.History.SmartTag.Fields.Time] = obj.Time;
			dicSets[Hynix.Model.History.SmartTag.Fields.SmartTagID] = obj.SmartTagID;
			dicSets[Hynix.Model.History.SmartTag.Fields.SmartTagReaderID] = obj.SmartTagReaderID;

			Dictionary<Hynix.Model.History.SmartTag.Fields, object> dicConditions = new Dictionary<Hynix.Model.History.SmartTag.Fields, object>();
			dicConditions[Hynix.Model.History.SmartTag.Fields.SmartTagHistoryID] = obj.SmartTagHistoryID;

			return UpdateHynixSmartTagHistory(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateHynixSmartTagHistory(Dictionary<Hynix.Model.History.SmartTag.Fields, object> dicSets, Dictionary<Hynix.Model.History.SmartTag.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<Hynix.Model.History.SmartTag.Fields>(ref strSets, dicSets, Hynix.Model.History.SmartTag.GetFieldName, Hynix.Model.History.SmartTag.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<Hynix.Model.History.SmartTag.Fields>(ref strCondition, dicConditions, Hynix.Model.History.SmartTag.GetFieldName, Hynix.Model.History.SmartTag.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(Hynix.Model.History.SmartTag.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateHynixSmartTagReader(SmartTagReader obj, out string strErrorMessage)
		{
			Dictionary<SmartTagReader.Fields, object> dicSets = new Dictionary<SmartTagReader.Fields, object>();
			dicSets[SmartTagReader.Fields.UniqueKey] = obj.UniqueKey;
			dicSets[SmartTagReader.Fields.ZoneID] = obj.ZoneID;
			dicSets[SmartTagReader.Fields.X] = obj.X;
			dicSets[SmartTagReader.Fields.Y] = obj.Y;
			dicSets[SmartTagReader.Fields.Z] = obj.Z;

			Dictionary<SmartTagReader.Fields, object> dicConditions = new Dictionary<SmartTagReader.Fields, object>();
			dicConditions[SmartTagReader.Fields.SmartTagReaderID] = obj.SmartTagReaderID;

			return UpdateHynixSmartTagReader(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateHynixSmartTagReader(Dictionary<SmartTagReader.Fields, object> dicSets, Dictionary<SmartTagReader.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<SmartTagReader.Fields>(ref strSets, dicSets, SmartTagReader.GetFieldName, SmartTagReader.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<SmartTagReader.Fields>(ref strCondition, dicConditions, SmartTagReader.GetFieldName, SmartTagReader.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(SmartTagReader.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateHynixWokerLinkZone(WokerLinkZone obj, out string strErrorMessage)
		{
			Dictionary<WokerLinkZone.Fields, object> dicSets = new Dictionary<WokerLinkZone.Fields, object>();

			Dictionary<WokerLinkZone.Fields, object> dicConditions = new Dictionary<WokerLinkZone.Fields, object>();
			dicConditions[WokerLinkZone.Fields.WorkerID] = obj.WorkerID;
			dicConditions[WokerLinkZone.Fields.ZoneID] = obj.ZoneID;

			return UpdateHynixWokerLinkZone(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateHynixWokerLinkZone(Dictionary<WokerLinkZone.Fields, object> dicSets, Dictionary<WokerLinkZone.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<WokerLinkZone.Fields>(ref strSets, dicSets, WokerLinkZone.GetFieldName, WokerLinkZone.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<WokerLinkZone.Fields>(ref strCondition, dicConditions, WokerLinkZone.GetFieldName, WokerLinkZone.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(WokerLinkZone.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateHynixWorker(Worker obj, out string strErrorMessage)
		{
			Dictionary<Worker.Fields, object> dicSets = new Dictionary<Worker.Fields, object>();
			dicSets[Worker.Fields.Name] = obj.Name;
			dicSets[Worker.Fields.OfficeName] = obj.OfficeName;
			dicSets[Worker.Fields.TeamName] = obj.TeamName;
			dicSets[Worker.Fields.PhoneNumber] = obj.PhoneNumber;

			Dictionary<Worker.Fields, object> dicConditions = new Dictionary<Worker.Fields, object>();
			dicConditions[Worker.Fields.WorkerID] = obj.WorkerID;

			return UpdateHynixWorker(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateHynixWorker(Dictionary<Worker.Fields, object> dicSets, Dictionary<Worker.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<Worker.Fields>(ref strSets, dicSets, Worker.GetFieldName, Worker.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<Worker.Fields>(ref strCondition, dicConditions, Worker.GetFieldName, Worker.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(Worker.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool UpdateHynixAbnormalHistory(Abnormal obj, out string strErrorMessage)
		{
			Dictionary<Abnormal.Fields, object> dicSets = new Dictionary<Abnormal.Fields, object>();
			dicSets[Abnormal.Fields.Memo] = obj.Memo;

			Dictionary<Abnormal.Fields, object> dicConditions = new Dictionary<Abnormal.Fields, object>();
			dicConditions[Abnormal.Fields.WorkerID] = obj.WorkerID;
			dicConditions[Abnormal.Fields.Time] = obj.Time;
			dicConditions[Abnormal.Fields.EventHistroyID] = obj.EventHistroyID;

			return UpdateHynixAbnormalHistory(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateHynixAbnormalHistory(Dictionary<Abnormal.Fields, object> dicSets, Dictionary<Abnormal.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<Abnormal.Fields>(ref strSets, dicSets, Abnormal.GetFieldName, Abnormal.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<Abnormal.Fields>(ref strCondition, dicConditions, Abnormal.GetFieldName, Abnormal.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(Abnormal.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool UpdateHynixSensorZoneHistoryInfo(SensorZoneInfo obj, out string strErrorMessage)
		{
			Dictionary<SensorZoneInfo.Fields, object> dicSets = new Dictionary<SensorZoneInfo.Fields, object>();
			dicSets[SensorZoneInfo.Fields.ItemID] = obj.ItemID;
			dicSets[SensorZoneInfo.Fields.WorkerID] = obj.WorkerID;
			dicSets[SensorZoneInfo.Fields.Param] = obj.Param;

			Dictionary<SensorZoneInfo.Fields, object> dicConditions = new Dictionary<SensorZoneInfo.Fields, object>();
			dicConditions[SensorZoneInfo.Fields.SensorZoneHistoryID] = obj.SensorZoneHistoryID;
			dicConditions[SensorZoneInfo.Fields.OrderIndex] = obj.OrderIndex;

			return UpdateHynixSensorZoneHistoryInfo(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateHynixSensorZoneHistoryInfo(Dictionary<SensorZoneInfo.Fields, object> dicSets, Dictionary<SensorZoneInfo.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<SensorZoneInfo.Fields>(ref strSets, dicSets, SensorZoneInfo.GetFieldName, SensorZoneInfo.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<SensorZoneInfo.Fields>(ref strCondition, dicConditions, SensorZoneInfo.GetFieldName, SensorZoneInfo.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(SensorZoneInfo.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool UpdateHynixDoor(Door obj, out string strErrorMessage)
		{
			Dictionary<Door.Fields, object> dicSets = new Dictionary<Door.Fields, object>();
			dicSets[Door.Fields.Name] = obj.Name;
			dicSets[Door.Fields.CardReaderID] = obj.CardReaderID;
			dicSets[Door.Fields.X] = obj.X;
			dicSets[Door.Fields.Y] = obj.Y;
			dicSets[Door.Fields.Z] = obj.Z;
			dicSets[Door.Fields.ZoneID] = obj.ZoneID;

			Dictionary<Door.Fields, object> dicConditions = new Dictionary<Door.Fields, object>();
			dicConditions[Door.Fields.DoorID] = obj.DoorID;

			return UpdateHynixDoor(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateHynixDoor(Dictionary<Door.Fields, object> dicSets, Dictionary<Door.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<Door.Fields>(ref strSets, dicSets, Door.GetFieldName, Door.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<Door.Fields>(ref strCondition, dicConditions, Door.GetFieldName, Door.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(Door.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool UpdateHynixAlarmScript(AlarmScript obj, out string strErrorMessage)
		{
			Dictionary<AlarmScript.Fields, object> dicSets = new Dictionary<AlarmScript.Fields, object>();
			dicSets[AlarmScript.Fields.Script] = obj.Script;

			Dictionary<AlarmScript.Fields, object> dicConditions = new Dictionary<AlarmScript.Fields, object>();
			dicConditions[AlarmScript.Fields.SensorTypeID] = obj.SensorTypeID;

			return UpdateHynixAlarmScript(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateHynixAlarmScript(Dictionary<AlarmScript.Fields, object> dicSets, Dictionary<AlarmScript.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<AlarmScript.Fields>(ref strSets, dicSets, AlarmScript.GetFieldName, AlarmScript.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<AlarmScript.Fields>(ref strCondition, dicConditions, AlarmScript.GetFieldName, AlarmScript.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(AlarmScript.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}
	}
}
