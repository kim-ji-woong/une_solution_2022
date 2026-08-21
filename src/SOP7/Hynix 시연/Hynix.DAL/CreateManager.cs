using System;
using System.Collections;
using System.Collections.Generic;
using dnsDBUtil;
using Hynix.IDAL;
using Hynix.Model;
using Hynix.Model.History;

namespace Hynix.DAL
{
	public class CreateManager : QueryManager, ICreate
	{
		private DataManager m_dataManager = null;
		private const int FindCountLimit = 100;

		public CreateManager(DataManager dataManager)
		{
			m_dataManager = dataManager;
			m_dbManager = m_dataManager.GetDBManager() as DirectDBManager;
		}

		private string GetInsertErrorMessage(string tableName)
		{
			return string.Format("{0} 테이블의 데이터 삽입에 실패하였습니다.", tableName);
		}

		private bool EqualsValue(object oldObj, object newObj)
		{
			if (oldObj == null && newObj == null)
				return true;

			if (oldObj is DateTime)
			{
				DateTime dt1, dt2;
				if (DateTime.TryParse(oldObj.ToString(), out dt1) && DateTime.TryParse(newObj.ToString(), out dt2))
				{
					if (Convert.ToDateTime(oldObj).ToString("yyyyMMddHHmmss") == Convert.ToDateTime(newObj).ToString("yyyyMMddHHmmss"))
						return true;
				}
				else
				{
					if (oldObj.ToString().Trim() == newObj.ToString().Trim())
						return true;
				}
			}

			return false;
		}

		public Card CreateHynixCard(Card obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<Card.Fields, object> dicFieldDatas = new Dictionary<Card.Fields, object>();
			dicFieldDatas[Card.Fields.WorkerID] = obj.WorkerID;
			dicFieldDatas[Card.Fields.UniqueKey] = obj.UniqueKey;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(CardID) FROM {0} C), 0) + 1, {2})",
				Card.TableName,
				GetFieldNames<Card.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", Card.GetFieldName(Card.Fields.CardID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<Card> datas = m_dataManager.GetSelectManager().SelectHynixCards(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameHynixCard(obj, datas[0]))
					return datas[0];

				return GetHynixCard(obj, datas[0].CardID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameHynixCard(Card oldObject, Card newObject)
		{
			if (oldObject.WorkerID == newObject.WorkerID &&
				oldObject.UniqueKey == newObject.UniqueKey)
				return true;

			return false;
		}

		private Card GetHynixCard(Card obj, int cardID, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", Card.GetFieldName(Card.Fields.CardID, out isNullable), cardID);

			List<Card> datas = m_dataManager.GetSelectManager().SelectHynixCards(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (Card data in datas)
			{
				if (IsSameHynixCard(data, obj))
					return data;

				if (data.CardID < cardID)
					cardID = data.CardID;
			}

			if (nCount < nLimit)
				return GetHynixCard(obj, cardID, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(Card.TableName);
			return null;
		}

		public CardReader CreateHynixCardReader(CardReader obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<CardReader.Fields, object> dicFieldDatas = new Dictionary<CardReader.Fields, object>();
			dicFieldDatas[CardReader.Fields.ZoneID] = obj.ZoneID;
			dicFieldDatas[CardReader.Fields.UniqueKey] = obj.UniqueKey;
			dicFieldDatas[CardReader.Fields.X] = obj.X;
			dicFieldDatas[CardReader.Fields.Y] = obj.Y;
			dicFieldDatas[CardReader.Fields.Z] = obj.Z;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(CardReaderID) FROM {0} C), 0) + 1, {2})",
				CardReader.TableName,
				GetFieldNames<CardReader.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", CardReader.GetFieldName(CardReader.Fields.CardReaderID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<CardReader> datas = m_dataManager.GetSelectManager().SelectHynixCardReaders(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameHynixCardReader(obj, datas[0]))
					return datas[0];

				return GetHynixCardReader(obj, datas[0].CardReaderID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameHynixCardReader(CardReader oldObject, CardReader newObject)
		{
			if (oldObject.ZoneID == newObject.ZoneID &&
				oldObject.UniqueKey == newObject.UniqueKey &&
				oldObject.X == newObject.X &&
				oldObject.Y == newObject.Y &&
				oldObject.Z == newObject.Z)
				return true;

			return false;
		}

		private CardReader GetHynixCardReader(CardReader obj, int cardReaderID, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", CardReader.GetFieldName(CardReader.Fields.CardReaderID, out isNullable), cardReaderID);

			List<CardReader> datas = m_dataManager.GetSelectManager().SelectHynixCardReaders(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (CardReader data in datas)
			{
				if (IsSameHynixCardReader(data, obj))
					return data;

				if (data.CardReaderID < cardReaderID)
					cardReaderID = data.CardReaderID;
			}

			if (nCount < nLimit)
				return GetHynixCardReader(obj, cardReaderID, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(CardReader.TableName);
			return null;
		}

		public CardTag CreateHynixCardTagHistory(CardTag obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<CardTag.Fields, object> dicFieldDatas = new Dictionary<CardTag.Fields, object>();
			dicFieldDatas[CardTag.Fields.Time] = obj.Time;
			dicFieldDatas[CardTag.Fields.CardID] = obj.CardID;
			dicFieldDatas[CardTag.Fields.CardReaderID] = obj.CardReaderID;
			dicFieldDatas[CardTag.Fields.Type] = obj.Type;
			dicFieldDatas[CardTag.Fields.IsApprove] = obj.IsApprove;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(CardTagHistoryID) FROM {0} C), 0) + 1, {2})",
				CardTag.TableName,
				GetFieldNames<CardTag.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", CardTag.GetFieldName(CardTag.Fields.CardTagHistoryID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<CardTag> datas = m_dataManager.GetSelectManager().SelectHynixCardTagHistorys(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameHynixCardTagHistory(obj, datas[0]))
					return datas[0];

				return GetHynixCardTagHistory(obj, datas[0].CardTagHistoryID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameHynixCardTagHistory(CardTag oldObject, CardTag newObject)
		{
			if (IsSameTime2(oldObject.Time, newObject.Time) &&
				oldObject.CardID == newObject.CardID &&
				oldObject.CardReaderID == newObject.CardReaderID &&
				oldObject.Type == newObject.Type &&
				oldObject.IsApprove == newObject.IsApprove)
				return true;

			return false;
		}

		private CardTag GetHynixCardTagHistory(CardTag obj, int cardTagHistoryID, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", CardTag.GetFieldName(CardTag.Fields.CardTagHistoryID, out isNullable), cardTagHistoryID);

			List<CardTag> datas = m_dataManager.GetSelectManager().SelectHynixCardTagHistorys(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (CardTag data in datas)
			{
				if (IsSameHynixCardTagHistory(data, obj))
					return data;

				if (data.CardTagHistoryID < cardTagHistoryID)
					cardTagHistoryID = data.CardTagHistoryID;
			}

			if (nCount < nLimit)
				return GetHynixCardTagHistory(obj, cardTagHistoryID, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(CardTag.TableName);
			return null;
		}

		public Event CreateHynixEventHistroy(Event obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<Event.Fields, object> dicFieldDatas = new Dictionary<Event.Fields, object>();
			dicFieldDatas[Event.Fields.CardReaderID] = obj.CardReaderID;
			dicFieldDatas[Event.Fields.WorkerID] = obj.WorkerID;
			dicFieldDatas[Event.Fields.Time] = obj.Time;
			dicFieldDatas[Event.Fields.Type] = obj.Type;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(EventHistroyID) FROM {0} C), 0) + 1, {2})",
				Event.TableName,
				GetFieldNames<Event.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", Event.GetFieldName(Event.Fields.EventHistroyID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<Event> datas = m_dataManager.GetSelectManager().SelectHynixEventHistroys(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameHynixEventHistroy(obj, datas[0]))
					return datas[0];

				return GetHynixEventHistroy(obj, datas[0].EventHistroyID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameHynixEventHistroy(Event oldObject, Event newObject)
		{
			if (oldObject.CardReaderID == newObject.CardReaderID &&
				oldObject.WorkerID == newObject.WorkerID &&
				IsSameTime2(oldObject.Time, newObject.Time) &&
				oldObject.Type == newObject.Type)
				return true;

			return false;
		}

		private Event GetHynixEventHistroy(Event obj, int eventHistroyID, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", Event.GetFieldName(Event.Fields.EventHistroyID, out isNullable), eventHistroyID);

			List<Event> datas = m_dataManager.GetSelectManager().SelectHynixEventHistroys(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (Event data in datas)
			{
				if (IsSameHynixEventHistroy(data, obj))
					return data;

				if (data.EventHistroyID < eventHistroyID)
					eventHistroyID = data.EventHistroyID;
			}

			if (nCount < nLimit)
				return GetHynixEventHistroy(obj, eventHistroyID, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(Event.TableName);
			return null;
		}

		public Item CreateHynixItem(Item obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<Item.Fields, object> dicFieldDatas = new Dictionary<Item.Fields, object>();
			dicFieldDatas[Item.Fields.Name] = obj.Name;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ItemID) FROM {0} C), 0) + 1, {2})",
				Item.TableName,
				GetFieldNames<Item.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", Item.GetFieldName(Item.Fields.ItemID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<Item> datas = m_dataManager.GetSelectManager().SelectHynixItems(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameHynixItem(obj, datas[0]))
					return datas[0];

				return GetHynixItem(obj, datas[0].ItemID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameHynixItem(Item oldObject, Item newObject)
		{
			if (oldObject.Name == newObject.Name)
				return true;

			return false;
		}

		private Item GetHynixItem(Item obj, int itemID, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", Item.GetFieldName(Item.Fields.ItemID, out isNullable), itemID);

			List<Item> datas = m_dataManager.GetSelectManager().SelectHynixItems(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (Item data in datas)
			{
				if (IsSameHynixItem(data, obj))
					return data;

				if (data.ItemID < itemID)
					itemID = data.ItemID;
			}

			if (nCount < nLimit)
				return GetHynixItem(obj, itemID, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(Item.TableName);
			return null;
		}

		public ItemLinkZone CreateHynixItemLinkZone(ItemLinkZone obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<ItemLinkZone.Fields, object> dicFieldDatas = new Dictionary<ItemLinkZone.Fields, object>();

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ZoneID) FROM {0} C where ItemID = {2} ), 0) + 1, {3})",
				ItemLinkZone.TableName,
				GetFieldNames<ItemLinkZone.Fields>(),
				obj.ItemID,
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc, {1} desc",
					ItemLinkZone.GetFieldName(ItemLinkZone.Fields.ItemID, out isNullable),
					ItemLinkZone.GetFieldName(ItemLinkZone.Fields.ZoneID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
					List<ItemLinkZone> datas = m_dataManager.GetSelectManager().SelectHynixItemLinkZones(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameHynixItemLinkZone(obj, datas[0]))
					return datas[0];

				return GetHynixItemLinkZone(obj, datas[0].ItemID, datas[0].ZoneID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameHynixItemLinkZone(ItemLinkZone oldObject, ItemLinkZone newObject)
		{
			return true;
		}

		private ItemLinkZone GetHynixItemLinkZone(ItemLinkZone obj, int itemID, int zoneID, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} = {1} and {2} < {3} order by {0} desc, {2} desc",
				ItemLinkZone.GetFieldName(ItemLinkZone.Fields.ItemID, out isNullable), itemID,
				ItemLinkZone.GetFieldName(ItemLinkZone.Fields.ZoneID, out isNullable), zoneID);
			List<ItemLinkZone> datas = m_dataManager.GetSelectManager().SelectHynixItemLinkZones(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (ItemLinkZone data in datas)
			{
				if (IsSameHynixItemLinkZone(data, obj))
					return data;

				if (data.ZoneID < zoneID)
					zoneID = data.ZoneID;
			}

			if (nCount < nLimit)
				return GetHynixItemLinkZone(obj, itemID, zoneID, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(ItemLinkZone.TableName);
			return null;
		}

		public Hynix.Model.SmartTag CreateHynixSmartTag(Hynix.Model.SmartTag obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<Hynix.Model.SmartTag.Fields, object> dicFieldDatas = new Dictionary<Hynix.Model.SmartTag.Fields, object>();
			dicFieldDatas[Hynix.Model.SmartTag.Fields.UniqueKey] = obj.UniqueKey;
			dicFieldDatas[Hynix.Model.SmartTag.Fields.WorkerID] = obj.WorkerID;
			dicFieldDatas[Hynix.Model.SmartTag.Fields.ItemID] = obj.ItemID;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(SmartTagID) FROM {0} C), 0) + 1, {2})",
				Hynix.Model.SmartTag.TableName,
				GetFieldNames<Hynix.Model.SmartTag.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", Hynix.Model.SmartTag.GetFieldName(Hynix.Model.SmartTag.Fields.SmartTagID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<Hynix.Model.SmartTag> datas = m_dataManager.GetSelectManager().SelectHynixSmartTags(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameHynixSmartTag(obj, datas[0]))
					return datas[0];

				return GetHynixSmartTag(obj, datas[0].SmartTagID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameHynixSmartTag(Hynix.Model.SmartTag oldObject, Hynix.Model.SmartTag newObject)
		{
			if (oldObject.UniqueKey == newObject.UniqueKey &&
				oldObject.WorkerID == newObject.WorkerID &&
				oldObject.ItemID == newObject.ItemID)
				return true;

			return false;
		}

		private Hynix.Model.SmartTag GetHynixSmartTag(Hynix.Model.SmartTag obj, int smartTagID, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", Hynix.Model.SmartTag.GetFieldName(Hynix.Model.SmartTag.Fields.SmartTagID, out isNullable), smartTagID);

			List<Hynix.Model.SmartTag> datas = m_dataManager.GetSelectManager().SelectHynixSmartTags(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (Hynix.Model.SmartTag data in datas)
			{
				if (IsSameHynixSmartTag(data, obj))
					return data;

				if (data.SmartTagID < smartTagID)
					smartTagID = data.SmartTagID;
			}

			if (nCount < nLimit)
				return GetHynixSmartTag(obj, smartTagID, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(Hynix.Model.SmartTag.TableName);
			return null;
		}

		public Hynix.Model.History.SmartTag CreateHynixSmartTagHistory(Hynix.Model.History.SmartTag obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<Hynix.Model.History.SmartTag.Fields, object> dicFieldDatas = new Dictionary<Hynix.Model.History.SmartTag.Fields, object>();
			dicFieldDatas[Hynix.Model.History.SmartTag.Fields.Time] = obj.Time;
			dicFieldDatas[Hynix.Model.History.SmartTag.Fields.SmartTagID] = obj.SmartTagID;
			dicFieldDatas[Hynix.Model.History.SmartTag.Fields.SmartTagReaderID] = obj.SmartTagReaderID;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(SmartTagHistoryID) FROM {0} C), 0) + 1, {2})",
				Hynix.Model.History.SmartTag.TableName,
				GetFieldNames<Hynix.Model.History.SmartTag.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", Hynix.Model.History.SmartTag.GetFieldName(Hynix.Model.History.SmartTag.Fields.SmartTagHistoryID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<Hynix.Model.History.SmartTag> datas = m_dataManager.GetSelectManager().SelectHynixSmartTagHistorys(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameHynixSmartTagHistory(obj, datas[0]))
					return datas[0];

				return GetHynixSmartTagHistory(obj, datas[0].SmartTagHistoryID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameHynixSmartTagHistory(Hynix.Model.History.SmartTag oldObject, Hynix.Model.History.SmartTag newObject)
		{
			if (IsSameTime2(oldObject.Time, newObject.Time) &&
				oldObject.SmartTagID == newObject.SmartTagID &&
				oldObject.SmartTagReaderID == newObject.SmartTagReaderID)
				return true;

			return false;
		}

		private Hynix.Model.History.SmartTag GetHynixSmartTagHistory(Hynix.Model.History.SmartTag obj, int smartTagHistoryID, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", Hynix.Model.History.SmartTag.GetFieldName(Hynix.Model.History.SmartTag.Fields.SmartTagHistoryID, out isNullable), smartTagHistoryID);

			List<Hynix.Model.History.SmartTag> datas = m_dataManager.GetSelectManager().SelectHynixSmartTagHistorys(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (Hynix.Model.History.SmartTag data in datas)
			{
				if (IsSameHynixSmartTagHistory(data, obj))
					return data;

				if (data.SmartTagHistoryID < smartTagHistoryID)
					smartTagHistoryID = data.SmartTagHistoryID;
			}

			if (nCount < nLimit)
				return GetHynixSmartTagHistory(obj, smartTagHistoryID, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(Hynix.Model.History.SmartTag.TableName);
			return null;
		}

		public SmartTagReader CreateHynixSmartTagReader(SmartTagReader obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<SmartTagReader.Fields, object> dicFieldDatas = new Dictionary<SmartTagReader.Fields, object>();
			dicFieldDatas[SmartTagReader.Fields.UniqueKey] = obj.UniqueKey;
			dicFieldDatas[SmartTagReader.Fields.ZoneID] = obj.ZoneID;
			dicFieldDatas[SmartTagReader.Fields.X] = obj.X;
			dicFieldDatas[SmartTagReader.Fields.Y] = obj.Y;
			dicFieldDatas[SmartTagReader.Fields.Z] = obj.Z;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(SmartTagReaderID) FROM {0} C), 0) + 1, {2})",
				SmartTagReader.TableName,
				GetFieldNames<SmartTagReader.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", SmartTagReader.GetFieldName(SmartTagReader.Fields.SmartTagReaderID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<SmartTagReader> datas = m_dataManager.GetSelectManager().SelectHynixSmartTagReaders(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameHynixSmartTagReader(obj, datas[0]))
					return datas[0];

				return GetHynixSmartTagReader(obj, datas[0].SmartTagReaderID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameHynixSmartTagReader(SmartTagReader oldObject, SmartTagReader newObject)
		{
			if (oldObject.UniqueKey == newObject.UniqueKey &&
				oldObject.ZoneID == newObject.ZoneID &&
				oldObject.X == newObject.X &&
				oldObject.Y == newObject.Y &&
				oldObject.Z == newObject.Z)
				return true;

			return false;
		}

		private SmartTagReader GetHynixSmartTagReader(SmartTagReader obj, int smartTagReaderID, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", SmartTagReader.GetFieldName(SmartTagReader.Fields.SmartTagReaderID, out isNullable), smartTagReaderID);

			List<SmartTagReader> datas = m_dataManager.GetSelectManager().SelectHynixSmartTagReaders(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (SmartTagReader data in datas)
			{
				if (IsSameHynixSmartTagReader(data, obj))
					return data;

				if (data.SmartTagReaderID < smartTagReaderID)
					smartTagReaderID = data.SmartTagReaderID;
			}

			if (nCount < nLimit)
				return GetHynixSmartTagReader(obj, smartTagReaderID, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(SmartTagReader.TableName);
			return null;
		}

		public WokerLinkZone CreateHynixWokerLinkZone(WokerLinkZone obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<WokerLinkZone.Fields, object> dicFieldDatas = new Dictionary<WokerLinkZone.Fields, object>();

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ZoneID) FROM {0} C where WorkerID = {2} ), 0) + 1, {3})",
				WokerLinkZone.TableName,
				GetFieldNames<WokerLinkZone.Fields>(),
				obj.WorkerID,
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc, {1} desc",
					WokerLinkZone.GetFieldName(WokerLinkZone.Fields.WorkerID, out isNullable),
					WokerLinkZone.GetFieldName(WokerLinkZone.Fields.ZoneID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
					List<WokerLinkZone> datas = m_dataManager.GetSelectManager().SelectHynixWokerLinkZones(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameHynixWokerLinkZone(obj, datas[0]))
					return datas[0];

				return GetHynixWokerLinkZone(obj, datas[0].WorkerID, datas[0].ZoneID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameHynixWokerLinkZone(WokerLinkZone oldObject, WokerLinkZone newObject)
		{
			return true;
		}

		private WokerLinkZone GetHynixWokerLinkZone(WokerLinkZone obj, int workerID, int zoneID, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} = {1} and {2} < {3} order by {0} desc, {2} desc",
				WokerLinkZone.GetFieldName(WokerLinkZone.Fields.WorkerID, out isNullable), workerID,
				WokerLinkZone.GetFieldName(WokerLinkZone.Fields.ZoneID, out isNullable), zoneID);
			List<WokerLinkZone> datas = m_dataManager.GetSelectManager().SelectHynixWokerLinkZones(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (WokerLinkZone data in datas)
			{
				if (IsSameHynixWokerLinkZone(data, obj))
					return data;

				if (data.ZoneID < zoneID)
					zoneID = data.ZoneID;
			}

			if (nCount < nLimit)
				return GetHynixWokerLinkZone(obj, workerID, zoneID, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(WokerLinkZone.TableName);
			return null;
		}

		public Worker CreateHynixWorker(Worker obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<Worker.Fields, object> dicFieldDatas = new Dictionary<Worker.Fields, object>();
			dicFieldDatas[Worker.Fields.Name] = obj.Name;
			dicFieldDatas[Worker.Fields.OfficeName] = obj.OfficeName;
			dicFieldDatas[Worker.Fields.TeamName] = obj.TeamName;
			dicFieldDatas[Worker.Fields.PhoneNumber] = obj.PhoneNumber;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(WorkerID) FROM {0} C), 0) + 1, {2})",
				Worker.TableName,
				GetFieldNames<Worker.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", Worker.GetFieldName(Worker.Fields.WorkerID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<Worker> datas = m_dataManager.GetSelectManager().SelectHynixWorkers(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameHynixWorker(obj, datas[0]))
					return datas[0];

				return GetHynixWorker(obj, datas[0].WorkerID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameHynixWorker(Worker oldObject, Worker newObject)
		{
			if (oldObject.Name == newObject.Name &&
				oldObject.OfficeName == newObject.OfficeName &&
				oldObject.TeamName == newObject.TeamName &&
				oldObject.PhoneNumber == newObject.PhoneNumber)
				return true;

			return false;
		}

		private Worker GetHynixWorker(Worker obj, int workerID, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", Worker.GetFieldName(Worker.Fields.WorkerID, out isNullable), workerID);

			List<Worker> datas = m_dataManager.GetSelectManager().SelectHynixWorkers(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (Worker data in datas)
			{
				if (IsSameHynixWorker(data, obj))
					return data;

				if (data.WorkerID < workerID)
					workerID = data.WorkerID;
			}

			if (nCount < nLimit)
				return GetHynixWorker(obj, workerID, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(Worker.TableName);
			return null;
		}

		public Abnormal CreateHynixAbnormalHistory(Abnormal obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<Abnormal.Fields, object> dicFieldDatas = new Dictionary<Abnormal.Fields, object>();
			dicFieldDatas[Abnormal.Fields.Memo] = obj.Memo;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(EventHistroyID) FROM {0} C where WorkerID = {2} and Time = {3} ), 0) + 1, {4})",
				Abnormal.TableName,
				GetFieldNames<Abnormal.Fields>(),
				obj.WorkerID,
				obj.Time,
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc, {1} desc, {2} desc",
					Abnormal.GetFieldName(Abnormal.Fields.WorkerID, out isNullable),
					Abnormal.GetFieldName(Abnormal.Fields.Time, out isNullable),
					Abnormal.GetFieldName(Abnormal.Fields.EventHistroyID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<Abnormal> datas = m_dataManager.GetSelectManager().SelectHynixAbnormalHistorys(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameHynixAbnormalHistory(obj, datas[0]))
					return datas[0];

				return GetHynixAbnormalHistory(obj, datas[0].WorkerID, datas[0].Time, datas[0].EventHistroyID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameHynixAbnormalHistory(Abnormal oldObject, Abnormal newObject)
		{
			if (oldObject.WorkerID == newObject.WorkerID)
				return true;

			return false;
		}

		private Abnormal GetHynixAbnormalHistory(Abnormal obj, int workerID, DateTime time, int eventHistroyID, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} = {1} and {2} = {3} and {4} < {5} order by {0} desc, {2} desc, {4} desc",
				Abnormal.GetFieldName(Abnormal.Fields.WorkerID, out isNullable), workerID,
				Abnormal.GetFieldName(Abnormal.Fields.Time, out isNullable), time,
				Abnormal.GetFieldName(Abnormal.Fields.EventHistroyID, out isNullable), eventHistroyID);
			List<Abnormal> datas = m_dataManager.GetSelectManager().SelectHynixAbnormalHistorys(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (Abnormal data in datas)
			{
				if (IsSameHynixAbnormalHistory(data, obj))
					return data;

				if (data.EventHistroyID < eventHistroyID)
					eventHistroyID = data.EventHistroyID;
			}

			if (nCount < nLimit)
				return GetHynixAbnormalHistory(obj, workerID, time, eventHistroyID, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(Abnormal.TableName);
			return null;
		}

		public SensorZoneInfo CreateHynixSensorZoneHistoryInfo(SensorZoneInfo obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<SensorZoneInfo.Fields, object> dicFieldDatas = new Dictionary<SensorZoneInfo.Fields, object>();
			dicFieldDatas[SensorZoneInfo.Fields.SensorZoneHistoryID] = obj.SensorZoneHistoryID;
			dicFieldDatas[SensorZoneInfo.Fields.OrderIndex] = obj.OrderIndex;
			dicFieldDatas[SensorZoneInfo.Fields.ItemID] = obj.ItemID;
			dicFieldDatas[SensorZoneInfo.Fields.WorkerID] = obj.WorkerID;
			dicFieldDatas[SensorZoneInfo.Fields.Param] = obj.Param;

			string strSQL = string.Format("Insert into {0} ({1}) values ({2})",
				SensorZoneInfo.TableName,
				GetFieldNames<SensorZoneInfo.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				return obj;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public Door CreateHynixDoor(Door obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<Door.Fields, object> dicFieldDatas = new Dictionary<Door.Fields, object>();
			dicFieldDatas[Door.Fields.Name] = obj.Name;
			dicFieldDatas[Door.Fields.CardReaderID] = obj.CardReaderID;
			dicFieldDatas[Door.Fields.X] = obj.X;
			dicFieldDatas[Door.Fields.Y] = obj.Y;
			dicFieldDatas[Door.Fields.Z] = obj.Z;
			dicFieldDatas[Door.Fields.ZoneID] = obj.ZoneID;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(DoorID) FROM {0} C), 0) + 1, {2})",
				Door.TableName,
				GetFieldNames<Door.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", Door.GetFieldName(Door.Fields.DoorID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<Door> datas = m_dataManager.GetSelectManager().SelectHynixDoors(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameHynixDoor(obj, datas[0]))
					return datas[0];

				return GetHynixDoor(obj, datas[0].DoorID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameHynixDoor(Door oldObject, Door newObject)
		{
			if (oldObject.Name == newObject.Name &&
				oldObject.CardReaderID == newObject.CardReaderID &&
				oldObject.X == newObject.X &&
				oldObject.Y == newObject.Y &&
				oldObject.Z == newObject.Z &&
				oldObject.ZoneID == newObject.ZoneID)
				return true;

			return false;
		}

		private Door GetHynixDoor(Door obj, int doorID, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", Door.GetFieldName(Door.Fields.DoorID, out isNullable), doorID);

			List<Door> datas = m_dataManager.GetSelectManager().SelectHynixDoors(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (Door data in datas)
			{
				if (IsSameHynixDoor(data, obj))
					return data;

				if (data.DoorID < doorID)
					doorID = data.DoorID;
			}

			if (nCount < nLimit)
				return GetHynixDoor(obj, doorID, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(Door.TableName);
			return null;
		}

		private bool IsSameTime(DateTime? time1, DateTime? time2)
		{
			if (time1 == null && time2 == null)
				return true;
			else if (time1 == null || time2 == null)
				return false;

			return IsSameTime2((DateTime)time1, (DateTime)time2);
		}

		private bool IsSameTime2(DateTime time1, DateTime time2)
		{
			if (time1.Year == time2.Year &&
				time1.Month == time2.Month &&
				time1.Day == time2.Day &&
				time1.Hour == time2.Hour &&
				time1.Minute == time2.Minute &&
				time1.Second == time2.Second)
				return true;

			return false;
		}

		public AlarmScript CreateHynixAlarmScript(AlarmScript obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<AlarmScript.Fields, object> dicFieldDatas = new Dictionary<AlarmScript.Fields, object>();
			dicFieldDatas[AlarmScript.Fields.SensorTypeID] = obj.SensorTypeID;
			dicFieldDatas[AlarmScript.Fields.Script] = obj.Script;

			string strSQL = string.Format("Insert into {0} ({1}) values ({2})",
				AlarmScript.TableName,
				GetFieldNames<AlarmScript.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				AlarmScript script = new AlarmScript();
				script.SensorTypeID = obj.SensorTypeID;
				script.Script = obj.Script;
				return script;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}
	}
}
