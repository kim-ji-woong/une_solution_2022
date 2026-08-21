using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using dnsData.Sensor;
using dnsDBUtil;
using Hynix.IDAL;
using Hynix.Model;
using Hynix.Model.History;
using SDMS.Model.CCTV;
using SDMS.Model.Sensor;

namespace Hynix.DAL
{
	public class SelectManager : QueryManager, ISelect
	{


		private DataManager m_dataManager = null;

		public SelectManager(DataManager dataManager)
		{
			m_dataManager = dataManager;
			m_dbManager = m_dataManager.GetDBManager() as DirectDBManager;
		}

		private string GetDateTimeString(DateTime time)
		{
			return string.Format("{0}-{1:00}-{2:00} {3:00}:{4:00}:{5:00}", time.Year, time.Month, time.Day, time.Hour, time.Minute, time.Second);
		}

		public Card SelectHynixCard(int cardID, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where CardID = {2} ", 
				GetFieldNames<Card.Fields>(out nFieldCount), Card.TableName
				, cardID);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				Card model = ReadHynixCard(arrResult, 0, out strErrorMessage);

				if (model == null)
					return null;

				return model;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public List<Card> SelectHynixCards(Dictionary<Card.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectHynixCards(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<Card> SelectHynixCards(Dictionary<Card.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<Card.Fields>(out nFieldCount), Card.TableName);

			string strCondition = "";

			if (SetCondition<Card.Fields>(ref strCondition, dicConditions, Card.GetFieldName, Card.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<Card> datas = new List<Card>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				Card model = ReadHynixCard(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private Card ReadHynixCard(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			Card model = new Card();
			bool isNullable;

			foreach (Card.Fields field in Card.Fields.GetValues(typeof(Card.Fields)))
			{
				string strFieldName = Card.GetFieldName(field, out isNullable);

				if (field == Card.Fields.CardID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.CardID = data.Data;
					}
				}
				else if (field == Card.Fields.WorkerID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.WorkerID = data.Data;
					}
				}
				else if (field == Card.Fields.UniqueKey)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.UniqueKey = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.UniqueKey = data;
					}
				}

				index++;
			}

			return model;
		}


		public CardReader SelectHynixCardReader(int cardReaderID, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where CardReaderID = {2} ", 
				GetFieldNames<CardReader.Fields>(out nFieldCount), CardReader.TableName
				, cardReaderID);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				CardReader model = ReadHynixCardReader(arrResult, 0, out strErrorMessage);

				if (model == null)
					return null;

				return model;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public List<CardReader> SelectHynixCardReaders(Dictionary<CardReader.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectHynixCardReaders(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<CardReader> SelectHynixCardReaders(Dictionary<CardReader.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<CardReader.Fields>(out nFieldCount), CardReader.TableName);

			string strCondition = "";

			if (SetCondition<CardReader.Fields>(ref strCondition, dicConditions, CardReader.GetFieldName, CardReader.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<CardReader> datas = new List<CardReader>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				CardReader model = ReadHynixCardReader(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private CardReader ReadHynixCardReader(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			CardReader model = new CardReader();
			bool isNullable;

			foreach (CardReader.Fields field in CardReader.Fields.GetValues(typeof(CardReader.Fields)))
			{
				string strFieldName = CardReader.GetFieldName(field, out isNullable);

				if (field == CardReader.Fields.CardReaderID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.CardReaderID = data.Data;
					}
				}
				else if (field == CardReader.Fields.ZoneID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.ZoneID = data.Data;
					}
				}
				else if (field == CardReader.Fields.UniqueKey)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.UniqueKey = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.UniqueKey = data;
					}
				}
				else if (field == CardReader.Fields.X)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.X = null;
					else
					{
						model.X = data.Data;
					}
				}
				else if (field == CardReader.Fields.Y)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Y = null;
					else
					{
						model.Y = data.Data;
					}
				}
				else if (field == CardReader.Fields.Z)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Z = null;
					else
					{
						model.Z = data.Data;
					}
				}

				index++;
			}

			return model;
		}


		public CardTag SelectHynixCardTagHistory(int cardTagHistoryID, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where CardTagHistoryID = {2} ", 
				GetFieldNames<CardTag.Fields>(out nFieldCount), CardTag.TableName
				, cardTagHistoryID);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				CardTag model = ReadHynixCardTagHistory(arrResult, 0, out strErrorMessage);

				if (model == null)
					return null;

				return model;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public List<CardTag> SelectHynixCardTagHistorys(Dictionary<CardTag.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectHynixCardTagHistorys(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<CardTag> SelectHynixCardTagHistorys(Dictionary<CardTag.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<CardTag.Fields>(out nFieldCount), CardTag.TableName);

			string strCondition = "";

			if (SetCondition<CardTag.Fields>(ref strCondition, dicConditions, CardTag.GetFieldName, CardTag.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<CardTag> datas = new List<CardTag>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				CardTag model = ReadHynixCardTagHistory(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private CardTag ReadHynixCardTagHistory(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			CardTag model = new CardTag();
			bool isNullable;

			foreach (CardTag.Fields field in CardTag.Fields.GetValues(typeof(CardTag.Fields)))
			{
				string strFieldName = CardTag.GetFieldName(field, out isNullable);

				if (field == CardTag.Fields.CardTagHistoryID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.CardTagHistoryID = data.Data;
					}
				}
				else if (field == CardTag.Fields.Time)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.Time = data.Data;
					}
				}
				else if (field == CardTag.Fields.CardID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.CardID = data.Data;
					}
				}
				else if (field == CardTag.Fields.CardReaderID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.CardReaderID = data.Data;
					}
				}
				else if (field == CardTag.Fields.Type)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.Type = data.Data;
					}
				}
				else if (field == CardTag.Fields.IsApprove)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.IsApprove = data.Data == 1;
					}
				}

				index++;
			}

			return model;
		}


		public Event SelectHynixEventHistroy(int eventHistroyID, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where EventHistroyID = {2} ",
				GetFieldNames<Event.Fields>(out nFieldCount), Event.TableName
				, eventHistroyID);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				Event model = ReadHynixEventHistroy(arrResult, 0, out strErrorMessage);

				if (model == null)
					return null;

				return model;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public List<Event> SelectHynixEventHistroys(Dictionary<Event.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectHynixEventHistroys(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<Event> SelectHynixEventHistroys(Dictionary<Event.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<Event.Fields>(out nFieldCount), Event.TableName);

			string strCondition = "";

			if (SetCondition<Event.Fields>(ref strCondition, dicConditions, Event.GetFieldName, Event.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<Event> datas = new List<Event>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				Event model = ReadHynixEventHistroy(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private Event ReadHynixEventHistroy(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			Event model = new Event();
			bool isNullable;

			foreach (Event.Fields field in Event.Fields.GetValues(typeof(Event.Fields)))
			{
				string strFieldName = Event.GetFieldName(field, out isNullable);

				if (field == Event.Fields.EventHistroyID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.EventHistroyID = data.Data;
					}
				}
				else if (field == Event.Fields.CardReaderID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.CardReaderID = null;
					else
					{
						model.CardReaderID = data.Data;
					}
				}
				else if (field == Event.Fields.WorkerID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.WorkerID = null;
					else
					{
						model.WorkerID = data.Data;
					}
				}
				else if (field == Event.Fields.Time)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.Time = data.Data;
					}
				}
				else if (field == Event.Fields.Type)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.Type = data.Data;
					}
				}

				index++;
			}

			return model;
		}


		public Item SelectHynixItem(int itemID, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where ItemID = {2} ", 
				GetFieldNames<Item.Fields>(out nFieldCount), Item.TableName
				, itemID);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				Item model = ReadHynixItem(arrResult, 0, out strErrorMessage);

				if (model == null)
					return null;

				return model;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public List<Item> SelectHynixItems(Dictionary<Item.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectHynixItems(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<Item> SelectHynixItems(Dictionary<Item.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<Item.Fields>(out nFieldCount), Item.TableName);

			string strCondition = "";

			if (SetCondition<Item.Fields>(ref strCondition, dicConditions, Item.GetFieldName, Item.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<Item> datas = new List<Item>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				Item model = ReadHynixItem(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private Item ReadHynixItem(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			Item model = new Item();
			bool isNullable;

			foreach (Item.Fields field in Item.Fields.GetValues(typeof(Item.Fields)))
			{
				string strFieldName = Item.GetFieldName(field, out isNullable);

				if (field == Item.Fields.ItemID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.ItemID = data.Data;
					}
				}
				else if (field == Item.Fields.Name)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Name = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Name = data;
					}
				}

				index++;
			}

			return model;
		}


		public ItemLinkZone SelectHynixItemLinkZone(int itemID, int zoneID, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where ItemID = {2} and ZoneID = {3} ", 
				GetFieldNames<ItemLinkZone.Fields>(out nFieldCount), ItemLinkZone.TableName
				, itemID
				, zoneID);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				ItemLinkZone model = ReadHynixItemLinkZone(arrResult, 0, out strErrorMessage);

				if (model == null)
					return null;

				return model;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public List<ItemLinkZone> SelectHynixItemLinkZones(Dictionary<ItemLinkZone.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectHynixItemLinkZones(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<ItemLinkZone> SelectHynixItemLinkZones(Dictionary<ItemLinkZone.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<ItemLinkZone.Fields>(out nFieldCount), ItemLinkZone.TableName);

			string strCondition = "";

			if (SetCondition<ItemLinkZone.Fields>(ref strCondition, dicConditions, ItemLinkZone.GetFieldName, ItemLinkZone.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<ItemLinkZone> datas = new List<ItemLinkZone>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				ItemLinkZone model = ReadHynixItemLinkZone(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private ItemLinkZone ReadHynixItemLinkZone(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			ItemLinkZone model = new ItemLinkZone();
			bool isNullable;

			foreach (ItemLinkZone.Fields field in ItemLinkZone.Fields.GetValues(typeof(ItemLinkZone.Fields)))
			{
				string strFieldName = ItemLinkZone.GetFieldName(field, out isNullable);

				if (field == ItemLinkZone.Fields.ItemID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.ItemID = data.Data;
					}
				}
				else if (field == ItemLinkZone.Fields.ZoneID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.ZoneID = data.Data;
					}
				}

				index++;
			}

			return model;
		}


		public Hynix.Model.SmartTag SelectHynixSmartTag(int smartTagID, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where SmartTagID = {2} ", 
				GetFieldNames<Hynix.Model.SmartTag.Fields>(out nFieldCount), Hynix.Model.SmartTag.TableName
				, smartTagID);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				Hynix.Model.SmartTag model = ReadHynixSmartTag(arrResult, 0, out strErrorMessage);

				if (model == null)
					return null;

				return model;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public List<Hynix.Model.SmartTag> SelectHynixSmartTags(Dictionary<Hynix.Model.SmartTag.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectHynixSmartTags(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<Hynix.Model.SmartTag> SelectHynixSmartTags(Dictionary<Hynix.Model.SmartTag.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<Hynix.Model.SmartTag.Fields>(out nFieldCount), Hynix.Model.SmartTag.TableName);

			string strCondition = "";

			if (SetCondition<Hynix.Model.SmartTag.Fields>(ref strCondition, dicConditions, Hynix.Model.SmartTag.GetFieldName, Hynix.Model.SmartTag.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<Hynix.Model.SmartTag> datas = new List<Hynix.Model.SmartTag>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				Hynix.Model.SmartTag model = ReadHynixSmartTag(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private Hynix.Model.SmartTag ReadHynixSmartTag(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			Hynix.Model.SmartTag model = new Hynix.Model.SmartTag();
			bool isNullable;

			foreach (Hynix.Model.SmartTag.Fields field in Hynix.Model.SmartTag.Fields.GetValues(typeof(Hynix.Model.SmartTag.Fields)))
			{
				string strFieldName = Hynix.Model.SmartTag.GetFieldName(field, out isNullable);

				if (field == Hynix.Model.SmartTag.Fields.SmartTagID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.SmartTagID = data.Data;
					}
				}
				else if (field == Hynix.Model.SmartTag.Fields.UniqueKey)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.UniqueKey = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.UniqueKey = data;
					}
				}
				else if (field == Hynix.Model.SmartTag.Fields.WorkerID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						model.WorkerID = null;
					}
					else
					{
						model.WorkerID = data.Data;
					}
				}
				else if (field == Hynix.Model.SmartTag.Fields.ItemID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						model.ItemID = null;
					}
					else
					{
						model.ItemID = data.Data;
					}
				}

				index++;
			}

			return model;
		}


		public Hynix.Model.History.SmartTag SelectHynixSmartTagHistory(int smartTagHistoryID, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where SmartTagHistoryID = {2} ", 
				GetFieldNames<Hynix.Model.History.SmartTag.Fields>(out nFieldCount), Hynix.Model.History.SmartTag.TableName
				, smartTagHistoryID);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				Hynix.Model.History.SmartTag model = ReadHynixSmartTagHistory(arrResult, 0, out strErrorMessage);

				if (model == null)
					return null;

				return model;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public List<Hynix.Model.History.SmartTag> SelectHynixSmartTagHistorys(Dictionary<Hynix.Model.History.SmartTag.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectHynixSmartTagHistorys(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<Hynix.Model.History.SmartTag> SelectHynixSmartTagHistorys(Dictionary<Hynix.Model.History.SmartTag.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<Hynix.Model.History.SmartTag.Fields>(out nFieldCount), Hynix.Model.History.SmartTag.TableName);

			string strCondition = "";

			if (SetCondition<Hynix.Model.History.SmartTag.Fields>(ref strCondition, dicConditions, Hynix.Model.History.SmartTag.GetFieldName, Hynix.Model.History.SmartTag.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<Hynix.Model.History.SmartTag> datas = new List<Hynix.Model.History.SmartTag>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				Hynix.Model.History.SmartTag model = ReadHynixSmartTagHistory(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private Hynix.Model.History.SmartTag ReadHynixSmartTagHistory(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			Hynix.Model.History.SmartTag model = new Hynix.Model.History.SmartTag();
			bool isNullable;

			foreach (Hynix.Model.History.SmartTag.Fields field in Hynix.Model.History.SmartTag.Fields.GetValues(typeof(Hynix.Model.History.SmartTag.Fields)))
			{
				string strFieldName = Hynix.Model.History.SmartTag.GetFieldName(field, out isNullable);

				if (field == Hynix.Model.History.SmartTag.Fields.SmartTagHistoryID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.SmartTagHistoryID = data.Data;
					}
				}
				else if (field == Hynix.Model.History.SmartTag.Fields.Time)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.Time = data.Data;
					}
				}
				else if (field == Hynix.Model.History.SmartTag.Fields.SmartTagID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.SmartTagID = data.Data;
					}
				}
				else if (field == Hynix.Model.History.SmartTag.Fields.SmartTagReaderID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.SmartTagReaderID = data.Data;
					}
				}

				index++;
			}

			return model;
		}


		public SmartTagReader SelectHynixSmartTagReader(int smartTagReaderID, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where SmartTagReaderID = {2} ", 
				GetFieldNames<SmartTagReader.Fields>(out nFieldCount), SmartTagReader.TableName
				, smartTagReaderID);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				SmartTagReader model = ReadHynixSmartTagReader(arrResult, 0, out strErrorMessage);

				if (model == null)
					return null;

				return model;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public List<SmartTagReader> SelectHynixSmartTagReaders(Dictionary<SmartTagReader.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectHynixSmartTagReaders(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<SmartTagReader> SelectHynixSmartTagReaders(Dictionary<SmartTagReader.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<SmartTagReader.Fields>(out nFieldCount), SmartTagReader.TableName);

			string strCondition = "";

			if (SetCondition<SmartTagReader.Fields>(ref strCondition, dicConditions, SmartTagReader.GetFieldName, SmartTagReader.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<SmartTagReader> datas = new List<SmartTagReader>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				SmartTagReader model = ReadHynixSmartTagReader(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private SmartTagReader ReadHynixSmartTagReader(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			SmartTagReader model = new SmartTagReader();
			bool isNullable;

			foreach (SmartTagReader.Fields field in SmartTagReader.Fields.GetValues(typeof(SmartTagReader.Fields)))
			{
				string strFieldName = SmartTagReader.GetFieldName(field, out isNullable);

				if (field == SmartTagReader.Fields.SmartTagReaderID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.SmartTagReaderID = data.Data;
					}
				}
				else if (field == SmartTagReader.Fields.UniqueKey)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.UniqueKey = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.UniqueKey = data;
					}
				}
				else if (field == SmartTagReader.Fields.ZoneID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.ZoneID = data.Data;
					}
				}
				else if (field == SmartTagReader.Fields.X)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.X = null;
					else
					{
						model.X = data.Data;
					}
				}
				else if (field == SmartTagReader.Fields.Y)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Y = null;
					else
					{
						model.Y = data.Data;
					}
				}
				else if (field == SmartTagReader.Fields.Z)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Z = null;
					else
					{
						model.Z = data.Data;
					}
				}

				index++;
			}

			return model;
		}


		public WokerLinkZone SelectHynixWokerLinkZone(int workerID, int zoneID, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where WorkerID = {2} and ZoneID = {3} ", 
				GetFieldNames<WokerLinkZone.Fields>(out nFieldCount), WokerLinkZone.TableName
				, workerID
				, zoneID);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				WokerLinkZone model = ReadHynixWokerLinkZone(arrResult, 0, out strErrorMessage);

				if (model == null)
					return null;

				return model;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public List<WokerLinkZone> SelectHynixWokerLinkZones(Dictionary<WokerLinkZone.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectHynixWokerLinkZones(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<WokerLinkZone> SelectHynixWokerLinkZones(Dictionary<WokerLinkZone.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<WokerLinkZone.Fields>(out nFieldCount), WokerLinkZone.TableName);

			string strCondition = "";

			if (SetCondition<WokerLinkZone.Fields>(ref strCondition, dicConditions, WokerLinkZone.GetFieldName, WokerLinkZone.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<WokerLinkZone> datas = new List<WokerLinkZone>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				WokerLinkZone model = ReadHynixWokerLinkZone(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private WokerLinkZone ReadHynixWokerLinkZone(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			WokerLinkZone model = new WokerLinkZone();
			bool isNullable;

			foreach (WokerLinkZone.Fields field in WokerLinkZone.Fields.GetValues(typeof(WokerLinkZone.Fields)))
			{
				string strFieldName = WokerLinkZone.GetFieldName(field, out isNullable);

				if (field == WokerLinkZone.Fields.WorkerID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.WorkerID = data.Data;
					}
				}
				else if (field == WokerLinkZone.Fields.ZoneID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.ZoneID = data.Data;
					}
				}

				index++;
			}

			return model;
		}


		public Worker SelectHynixWorker(int workerID, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where WorkerID = {2} ", 
				GetFieldNames<Worker.Fields>(out nFieldCount), Worker.TableName
				, workerID);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				Worker model = ReadHynixWorker(arrResult, 0, out strErrorMessage);

				if (model == null)
					return null;

				return model;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public List<Worker> SelectHynixWorkers(Dictionary<Worker.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectHynixWorkers(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<Worker> SelectHynixWorkers(Dictionary<Worker.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<Worker.Fields>(out nFieldCount), Worker.TableName);

			string strCondition = "";

			if (SetCondition<Worker.Fields>(ref strCondition, dicConditions, Worker.GetFieldName, Worker.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<Worker> datas = new List<Worker>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				Worker model = ReadHynixWorker(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private Worker ReadHynixWorker(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			Worker model = new Worker();
			bool isNullable;

			foreach (Worker.Fields field in Worker.Fields.GetValues(typeof(Worker.Fields)))
			{
				string strFieldName = Worker.GetFieldName(field, out isNullable);

				if (field == Worker.Fields.WorkerID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.WorkerID = data.Data;
					}
				}
				else if (field == Worker.Fields.Name)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Name = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Name = data;
					}
				}
				else if (field == Worker.Fields.OfficeName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.OfficeName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.OfficeName = data;
					}
				}
				else if (field == Worker.Fields.TeamName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.TeamName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.TeamName = data;
					}
				}
				else if (field == Worker.Fields.PhoneNumber)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.TeamName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.PhoneNumber = data;
					}
				}

				index++;
			}

			return model;
		}

		public Abnormal SelectHynixAbnormalHistory(int workerID, DateTime time, int eventHistroyID, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where WorkerID = {2} and Time = '{3}' and EventHistroyID = {4} ",
				GetFieldNames<Abnormal.Fields>(out nFieldCount), Abnormal.TableName
				, workerID
				, GetDateTimeString(time)
				, eventHistroyID);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				Abnormal model = ReadHynixAbnormalHistory(arrResult, 0, out strErrorMessage);

				if (model == null)
					return null;

				return model;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public List<Abnormal> SelectHynixAbnormalHistorys(Dictionary<Abnormal.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectHynixAbnormalHistorys(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<Abnormal> SelectHynixAbnormalHistorys(Dictionary<Abnormal.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<Abnormal.Fields>(out nFieldCount), Abnormal.TableName);

			string strCondition = "";

			if (SetCondition<Abnormal.Fields>(ref strCondition, dicConditions, Abnormal.GetFieldName, Abnormal.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<Abnormal> datas = new List<Abnormal>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				Abnormal model = ReadHynixAbnormalHistory(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private Abnormal ReadHynixAbnormalHistory(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			Abnormal model = new Abnormal();
			bool isNullable;

			foreach (Abnormal.Fields field in Abnormal.Fields.GetValues(typeof(Abnormal.Fields)))
			{
				string strFieldName = Abnormal.GetFieldName(field, out isNullable);

				if (field == Abnormal.Fields.WorkerID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.WorkerID = data.Data;
					}
				}
				else if (field == Abnormal.Fields.Time)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.Time = data.Data;
					}
				}
				else if (field == Abnormal.Fields.EventHistroyID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.EventHistroyID = data.Data;
					}
				}
				else if (field == Abnormal.Fields.Memo)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Memo = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Memo = data;
					}
				}

				index++;
			}

			return model;
		}

		public SensorZoneInfo SelectHynixSensorZoneHistoryInfo(int sensorZoneHistoryID, int orderIndex, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where SensorZoneHistoryID = {2} and OrderIndex = {3} ",
				GetFieldNames<SensorZoneInfo.Fields>(out nFieldCount), SensorZoneInfo.TableName
				, sensorZoneHistoryID
				, orderIndex);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				SensorZoneInfo model = ReadHynixSensorZoneHistoryInfo(arrResult, 0, out strErrorMessage);

				if (model == null)
					return null;

				return model;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public List<SensorZoneInfo> SelectHynixSensorZoneHistoryInfos(Dictionary<SensorZoneInfo.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectHynixSensorZoneHistoryInfos(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<SensorZoneInfo> SelectHynixSensorZoneHistoryInfos(Dictionary<SensorZoneInfo.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<SensorZoneInfo.Fields>(out nFieldCount), SensorZoneInfo.TableName);

			string strCondition = "";

			if (SetCondition<SensorZoneInfo.Fields>(ref strCondition, dicConditions, SensorZoneInfo.GetFieldName, SensorZoneInfo.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<SensorZoneInfo> datas = new List<SensorZoneInfo>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				SensorZoneInfo model = ReadHynixSensorZoneHistoryInfo(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private SensorZoneInfo ReadHynixSensorZoneHistoryInfo(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			SensorZoneInfo model = new SensorZoneInfo();
			bool isNullable;

			foreach (SensorZoneInfo.Fields field in SensorZoneInfo.Fields.GetValues(typeof(SensorZoneInfo.Fields)))
			{
				string strFieldName = SensorZoneInfo.GetFieldName(field, out isNullable);

				if (field == SensorZoneInfo.Fields.SensorZoneHistoryID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.SensorZoneHistoryID = data.Data;
					}
				}
				else if (field == SensorZoneInfo.Fields.OrderIndex)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.OrderIndex = data.Data;
					}
				}
				else if (field == SensorZoneInfo.Fields.ItemID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.ItemID = null;
					else
					{
						model.ItemID = data.Data;
					}
				}
				else if (field == SensorZoneInfo.Fields.WorkerID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.WorkerID = null;
					else
					{
						model.WorkerID = data.Data;
					}
				}
				else if (field == SensorZoneInfo.Fields.Param)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Param = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Param = data;
					}
				}

				index++;
			}

			return model;
		}

		public Door SelectHynixDoor(int doorID, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where DoorID = {2} ",
				GetFieldNames<Door.Fields>(out nFieldCount), Door.TableName
				, doorID);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				Door model = ReadHynixDoor(arrResult, 0, out strErrorMessage);

				if (model == null)
					return null;

				return model;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public List<Door> SelectHynixDoors(Dictionary<Door.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectHynixDoors(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<Door> SelectHynixDoors(Dictionary<Door.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<Door.Fields>(out nFieldCount), Door.TableName);

			string strCondition = "";

			if (SetCondition<Door.Fields>(ref strCondition, dicConditions, Door.GetFieldName, Door.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<Door> datas = new List<Door>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				Door model = ReadHynixDoor(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private Door ReadHynixDoor(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			Door model = new Door();
			bool isNullable;

			foreach (Door.Fields field in Door.Fields.GetValues(typeof(Door.Fields)))
			{
				string strFieldName = Door.GetFieldName(field, out isNullable);

				if (field == Door.Fields.DoorID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.DoorID = data.Data;
					}
				}
				else if (field == Door.Fields.Name)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Name = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Name = data;
					}
				}
				else if (field == Door.Fields.CardReaderID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.CardReaderID = data.Data;
					}
				}
				else if (field == Door.Fields.X)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
						model.X = null;
					else
					{
						model.X = data.Data;
					}
				}
				else if (field == Door.Fields.Y)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
						model.Y = null;
					else
					{
						model.Y = data.Data;
					}
				}
				else if (field == Door.Fields.Z)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
						model.Z = null;
					else
					{
						model.Z = data.Data;
					}
				}
				else if (field == Door.Fields.ZoneID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.ZoneID = data.Data;
					}
				}

				index++;
			}

			return model;
		}

		public AlarmScript SelectHynixAlarmScript(int sensorTypeID, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where SensorTypeID = {2} ",
				GetFieldNames<AlarmScript.Fields>(out nFieldCount), AlarmScript.TableName
				, sensorTypeID);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				AlarmScript model = ReadHynixAlarmScript(arrResult, 0, out strErrorMessage);

				if (model == null)
					return null;

				return model;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public List<AlarmScript> SelectHynixAlarmScripts(Dictionary<AlarmScript.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectHynixAlarmScripts(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<AlarmScript> SelectHynixAlarmScripts(Dictionary<AlarmScript.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<AlarmScript.Fields>(out nFieldCount), AlarmScript.TableName);

			string strCondition = "";

			if (SetCondition<AlarmScript.Fields>(ref strCondition, dicConditions, AlarmScript.GetFieldName, AlarmScript.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<AlarmScript> datas = new List<AlarmScript>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				AlarmScript model = ReadHynixAlarmScript(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private AlarmScript ReadHynixAlarmScript(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			AlarmScript model = new AlarmScript();
			bool isNullable;

			foreach (AlarmScript.Fields field in AlarmScript.Fields.GetValues(typeof(AlarmScript.Fields)))
			{
				string strFieldName = AlarmScript.GetFieldName(field, out isNullable);

				if (field == AlarmScript.Fields.SensorTypeID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.SensorTypeID = data.Data;
					}
				}
				else if (field == AlarmScript.Fields.Script)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.Script = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.Script = data;
					}
				}

				index++;
			}

			return model;
		}

		public ArrayList JoinSensorZoneSensors(Dictionary<SDMS.Model.Sensor.SensorZone.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return JoinSensorZoneSensors(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public ArrayList JoinSensorZoneSensors(Dictionary<SDMS.Model.Sensor.SensorZone.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;

			StringBuilder sb = new StringBuilder();
			sb.AppendFormat("Select {0}, {1}, ", SDMS.Model.Sensor.SensorZone.Fields.ID, SDMS.Model.Sensor.SensorZone.Fields.SensorType);
			sb.Append("             case ");
			sb.AppendFormat("            when {0} in ({1}) then(select name from {2} as f Where f.ID = sz.OrgSensorID)"
				, SDMS.Model.Sensor.SensorZone.Fields.SensorType, string.Join(",", Facility.GetFireTypeAllNumberToList()), Fire.TableName);
			sb.AppendFormat("            when {0} in ({1}) then(select name from {2} as p Where p.ID = sz.OrgSensorID)"
				, SDMS.Model.Sensor.SensorZone.Fields.SensorType, string.Join(",", Facility.GetPSMTypeAllNumberToList()), PSM.TableName);
			sb.AppendFormat("            when {0} in ({1}) then(select name from {2} as p Where p.ID = sz.OrgSensorID)"
				, SDMS.Model.Sensor.SensorZone.Fields.SensorType, string.Join(",", Facility.GetETCTypeAllNumberToList()), ETC.TableName);
			sb.AppendFormat("            when {0} in ({1}) then(select name from {2} as p Where p.ID = sz.OrgSensorID)"
				, SDMS.Model.Sensor.SensorZone.Fields.SensorType, string.Join(",", Facility.GetLaserTypeAllNumberToList()), ETC.TableName);
			sb.AppendFormat("            when {0} in ({1}) then(select cameraName from {2} as p Where p.ID = sz.OrgSensorID)"
				, SDMS.Model.Sensor.SensorZone.Fields.SensorType, string.Join(",", Facility.GetSVMSTypeAllNumberToList()), CCTV.TableName);
			sb.AppendFormat("            when {0} in ({1}) then(select w.Name from {2} as p, {3} as w Where p.CardID = sz.OrgSensorID and w.WorkerID = p.WorkerID)"
				, SDMS.Model.Sensor.SensorZone.Fields.SensorType, (int)Facility_Hynix.FacilityType.Event_CheatedTagging, Card.TableName, Worker.TableName);
			sb.AppendFormat("            when {0} in ({1}) then(select w.Name from {2} as p, {3} as w Where p.SmartTagID = sz.OrgSensorID and w.WorkerID = p.WorkerID)"
				, SDMS.Model.Sensor.SensorZone.Fields.SensorType, (int)Facility_Hynix.FacilityType.Event_Untagging, Hynix.Model.SmartTag.TableName, Worker.TableName);
			sb.AppendFormat("            when {0} in ({1}) then(select w.Name from {2} as p, {3} as w Where p.CardID = sz.OrgSensorID and w.WorkerID = p.WorkerID)"
				, SDMS.Model.Sensor.SensorZone.Fields.SensorType, (int)Facility_Hynix.FacilityType.Event_StealCard, Card.TableName, Worker.TableName);
			sb.AppendFormat("            when {0} in ({1}) then(select w.Name from {2} as p, {3} as w Where p.SmartTagID = sz.OrgSensorID and w.WorkerID = p.WorkerID)"
				, SDMS.Model.Sensor.SensorZone.Fields.SensorType, (int)Facility_Hynix.FacilityType.Event_NotPermittedPerson, Hynix.Model.SmartTag.TableName, Worker.TableName);
			sb.AppendFormat("            when {0} in ({1}) then(select w.Name from {2} as p, {3} as w Where p.SmartTagID = sz.OrgSensorID and w.ItemID = p.ItemID)"
				, SDMS.Model.Sensor.SensorZone.Fields.SensorType, (int)Facility_Hynix.FacilityType.Event_NotPermittedItem, Hynix.Model.SmartTag.TableName, Item.TableName);
			sb.AppendFormat("            when {0} in ({1}) then(select w.Name from {2} as p, {3} as w Where p.CardID = sz.OrgSensorID and w.WorkerID = p.WorkerID)"
				, SDMS.Model.Sensor.SensorZone.Fields.SensorType, (int)Facility_Hynix.FacilityType.Event_CardTag, Card.TableName, Worker.TableName);
            sb.AppendFormat("            when {0} in ({1}) then(select case when p.WorkerID is not null then (select w.Name from {3} as w where w.WorkerID = p.WorkerID) when p.ItemID is not null then (select i.Name from {4} as i where i.ItemID = p.ItemID) else '해당 없음' end as Name from {2} as p Where p.SmartTagID = sz.OrgSensorID)"
				, SDMS.Model.Sensor.SensorZone.Fields.SensorType, (int)Facility_Hynix.FacilityType.Event_SmartTag, Hynix.Model.SmartTag.TableName, Worker.TableName, Item.TableName);
            sb.AppendFormat("            when {0} in ({1}, {3}) then(select UniqueKey from {2} as p Where p.CardReaderID = sz.OrgSensorID)"
				, SDMS.Model.Sensor.SensorZone.Fields.SensorType, (int)Facility_Hynix.FacilityType.Event_CardReader, CardReader.TableName, (int)Facility_Hynix.FacilityType.Event_ForcedDoorOpen);

            sb.Append("              end as name ");
			sb.AppendFormat("  From {0} as sz ", SDMS.Model.Sensor.SensorZone.TableName);

			if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
			{
				sb.AppendFormat(" Where {0}", strAdditionalConditions);
			}

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(sb.ToString()) : m_dbManager.GetResultData(sb.ToString(), (int)topNCount);
			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			ArrayList arrResult2 = new ArrayList();
			int resultCount = arrResult.Count;
			for (int i = 0; i < resultCount; i += 3)
			{
				int nSensorZoneID = dnsDBUtil.WebDBManager.GetIntField(arrResult[i].ToString(), -1);
				int nSensorType = dnsDBUtil.WebDBManager.GetIntField(arrResult[i + 1].ToString(), -1);
				string strSensorName = dnsDBUtil.WebDBManager.GetStringField(arrResult[i + 2].ToString());

				arrResult2.Add(nSensorZoneID);
				arrResult2.Add(nSensorType);
				arrResult2.Add(strSensorName);
			}

			return arrResult2;
		}
	}

	public class Facility_Hynix
    {
		public enum FacilityType
        {
			Event_ForcedDoorOpen = 951,             // 강제 문열림
			Event_CheatedTagging = 952,             // 대리태깅
			Event_Untagging = 953,                  // 꼬리물기
			Event_StealCard = 954,                  // 사원증 도용
			Event_Stranger = 955,                   // 이상행위자
			Event_EvasionItem = 956,                // 무인 보안검색 회피
			Event_NotPermittedPerson = 957,         // 비인가 구역 출입
			Event_NotPermittedItem = 958,           // 비인가 구역 반입
			Event_CardTag = 959,                    // 사원증 태깅
			Event_SmartTag = 960,                   // 스마트태그 태깅
			Event_CardReader = 961,                 // 카드리더
		}

	}
}
