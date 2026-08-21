using Airbase20.IDAL;
using Airbase20.Model;
using dnsDBUtil;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;

namespace Airbase20.DAL
{
	public class SelectManager : QueryManager, ISelect
	{
		private DataManager m_dataManager = null;

		public SelectManager(DataManager dataManager)
		{
			m_dataManager = dataManager;
			m_dbManager = m_dataManager.GetDBManager() as DirectDBManager;
		}

		public Relay SelectRelay(int id, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where ID = {2} ",
				GetFieldNames<Relay.Fields>(out nFieldCount), Relay.TableName
				, id);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				Relay model = ReadRelay(arrResult, 0, out strErrorMessage);

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

		public List<Relay> SelectRelays(Dictionary<Relay.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectRelays(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<Relay> SelectRelays(Dictionary<Relay.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<Relay.Fields>(out nFieldCount), Relay.TableName);

			string strCondition = "";

			if (SetCondition<Relay.Fields>(ref strCondition, dicConditions, Relay.GetFieldName, Relay.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<Relay> datas = new List<Relay>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				Relay model = ReadRelay(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private Relay ReadRelay(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			Relay model = new Relay();
			bool isNullable;

			foreach (Relay.Fields field in Relay.Fields.GetValues(typeof(Relay.Fields)))
			{
				string strFieldName = Relay.GetFieldName(field, out isNullable);

				if (field == Relay.Fields.ID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.ID = data.Data;
					}
				}
				else if (field == Relay.Fields.Name)
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
				else if (field == Relay.Fields.Type)
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
				else if (field == Relay.Fields.IP)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.IP = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.IP = data;
					}
				}
				else if (field == Relay.Fields.SubIP)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.SubIP = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.SubIP = data;
					}
				}
				else if (field == Relay.Fields.Port)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.Port = data.Data;
					}
				}
				else if (field == Relay.Fields.ElectCurrent_A)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
						model.ElectCurrent_A = null;
					else
					{
						model.ElectCurrent_A = data.Data;
					}
				}
				else if (field == Relay.Fields.ElectCurrent_B)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
						model.ElectCurrent_B = null;
					else
					{
						model.ElectCurrent_B = data.Data;
					}
				}
				else if (field == Relay.Fields.ElectCurrent_C)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
						model.ElectCurrent_C = null;
					else
					{
						model.ElectCurrent_C = data.Data;
					}
				}
				else if (field == Relay.Fields.Volt_A)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
						model.Volt_A = null;
					else
					{
						model.Volt_A = data.Data;
					}
				}
				else if (field == Relay.Fields.Volt_B)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
						model.Volt_B = null;
					else
					{
						model.Volt_B = data.Data;
					}
				}
				else if (field == Relay.Fields.Volt_C)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
						model.Volt_C = null;
					else
					{
						model.Volt_C = data.Data;
					}
				}
				else if (field == Relay.Fields.Factor)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
						model.Factor = null;
					else
					{
						model.Factor = data.Data;
					}
				}
				else if (field == Relay.Fields.ActivePower)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
						model.ActivePower = null;
					else
					{
						model.ActivePower = data.Data;
					}
				}
				else if (field == Relay.Fields.ReactivePower)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
						model.ReactivePower = null;
					else
					{
						model.ReactivePower = data.Data;
					}
				}
				else if (field == Relay.Fields.Frequency)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
						model.Frequency = null;
					else
					{
						model.Frequency = data.Data;
					}
				}
				else if (field == Relay.Fields.ActivePowerTotal)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
						model.ActivePowerTotal = null;
					else
					{
						model.ActivePowerTotal = data.Data;
					}
				}
				else if (field == Relay.Fields.ReactivePowerTotal)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
						model.ReactivePowerTotal = null;
					else
					{
						model.ReactivePowerTotal = data.Data;
					}
				}
				else if (field == Relay.Fields.Memo)
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
				else if (field == Relay.Fields.SlaveID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.SlaveID = data.Data;
					}
				}

				index++;
			}

			return model;
		}


		public RelayHistory SelectRelayHistory(int id, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where ID = {2} ",
				GetFieldNames<RelayHistory.Fields>(out nFieldCount), RelayHistory.TableName
				, id);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				RelayHistory model = ReadRelayHistory(arrResult, 0, out strErrorMessage);

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

		public List<RelayHistory> SelectRelayHistorys(Dictionary<RelayHistory.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectRelayHistorys(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<RelayHistory> SelectRelayHistorys(Dictionary<RelayHistory.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<RelayHistory.Fields>(out nFieldCount), RelayHistory.TableName);

			string strCondition = "";

			if (SetCondition<RelayHistory.Fields>(ref strCondition, dicConditions, RelayHistory.GetFieldName, RelayHistory.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<RelayHistory> datas = new List<RelayHistory>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				RelayHistory model = ReadRelayHistory(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private RelayHistory ReadRelayHistory(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			RelayHistory model = new RelayHistory();
			bool isNullable;

			foreach (RelayHistory.Fields field in RelayHistory.Fields.GetValues(typeof(RelayHistory.Fields)))
			{
				string strFieldName = RelayHistory.GetFieldName(field, out isNullable);

				if (field == RelayHistory.Fields.ID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.ID = data.Data;
					}
				}
				else if (field == RelayHistory.Fields.RelayID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.RelayID = data.Data;
					}
				}
				else if (field == RelayHistory.Fields.Date)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
						model.Date = null;
					else
					{
						model.Date = data.Data;
					}
				}
				else if (field == RelayHistory.Fields.ActivePowerTotal)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
						model.ActivePowerTotal = null;
					else
					{
						model.ActivePowerTotal = data.Data;
					}
				}
				else if (field == RelayHistory.Fields.ReactivePowerTotal)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
						model.ReactivePowerTotal = null;
					else
					{
						model.ReactivePowerTotal = data.Data;
					}
				}

				index++;
			}

			return model;
		}


		public Switch SelectSwitch(int id, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where ID = {2} ",
				GetFieldNames<Switch.Fields>(out nFieldCount), Switch.TableName
				, id);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				Switch model = ReadSwitch(arrResult, 0, out strErrorMessage);

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

		public List<Switch> SelectSwitchs(Dictionary<Switch.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectSwitchs(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<Switch> SelectSwitchs(Dictionary<Switch.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<Switch.Fields>(out nFieldCount), Switch.TableName);

			string strCondition = "";

			if (SetCondition<Switch.Fields>(ref strCondition, dicConditions, Switch.GetFieldName, Switch.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<Switch> datas = new List<Switch>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				Switch model = ReadSwitch(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private Switch ReadSwitch(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			Switch model = new Switch();
			bool isNullable;

			foreach (Switch.Fields field in Switch.Fields.GetValues(typeof(Switch.Fields)))
			{
				string strFieldName = Switch.GetFieldName(field, out isNullable);

				if (field == Switch.Fields.ID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.ID = data.Data;
					}
				}
				else if (field == Switch.Fields.Name)
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
				else if (field == Switch.Fields.Type)
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
				else if (field == Switch.Fields.IP)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.IP = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.IP = data;
					}
				}
				else if (field == Switch.Fields.SubIP)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.SubIP = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.SubIP = data;
					}
				}
				else if (field == Switch.Fields.Port)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.Port = data.Data;
					}
				}
				else if (field == Switch.Fields.SlaveID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.SlaveID = data.Data;
					}
				}
				else if (field == Switch.Fields.Memo)
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


		public SwitchDetail SelectSwitchDetail(int id, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where ID = {2} ",
				GetFieldNames<SwitchDetail.Fields>(out nFieldCount), SwitchDetail.TableName
				, id);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				SwitchDetail model = ReadSwitchDetail(arrResult, 0, out strErrorMessage);

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

		public List<SwitchDetail> SelectSwitchDetails(Dictionary<SwitchDetail.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectSwitchDetails(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<SwitchDetail> SelectSwitchDetails(Dictionary<SwitchDetail.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<SwitchDetail.Fields>(out nFieldCount), SwitchDetail.TableName);

			string strCondition = "";

			if (SetCondition<SwitchDetail.Fields>(ref strCondition, dicConditions, SwitchDetail.GetFieldName, SwitchDetail.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<SwitchDetail> datas = new List<SwitchDetail>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				SwitchDetail model = ReadSwitchDetail(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private SwitchDetail ReadSwitchDetail(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			SwitchDetail model = new SwitchDetail();
			bool isNullable;

			foreach (SwitchDetail.Fields field in SwitchDetail.Fields.GetValues(typeof(SwitchDetail.Fields)))
			{
				string strFieldName = SwitchDetail.GetFieldName(field, out isNullable);

				if (field == SwitchDetail.Fields.ID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.ID = data.Data;
					}
				}
				else if (field == SwitchDetail.Fields.SwitchID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.SwitchID = data.Data;
					}
				}
				else if (field == SwitchDetail.Fields.Circuit)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.Circuit = data.Data;
					}
				}
				else if (field == SwitchDetail.Fields.OpenClose)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.OpenClose = null;
					else
					{
						model.OpenClose = data.Data == 1;
					}
				}
				else if (field == SwitchDetail.Fields.FI_Auto_A)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.FI_Auto_A = null;
					else
					{
						model.FI_Auto_A = data.Data == 1;
					}
				}
				else if (field == SwitchDetail.Fields.FI_Auto_B)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.FI_Auto_B = null;
					else
					{
						model.FI_Auto_B = data.Data == 1;
					}
				}
				else if (field == SwitchDetail.Fields.FI_Auto_C)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.FI_Auto_C = null;
					else
					{
						model.FI_Auto_C = data.Data == 1;
					}
				}
				else if (field == SwitchDetail.Fields.FI_Auto_N)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.FI_Auto_N = null;
					else
					{
						model.FI_Auto_N = data.Data == 1;
					}
				}
				else if (field == SwitchDetail.Fields.FI_Manual_A)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.FI_Manual_A = null;
					else
					{
						model.FI_Manual_A = data.Data == 1;
					}
				}
				else if (field == SwitchDetail.Fields.FI_Manual_B)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.FI_Manual_B = null;
					else
					{
						model.FI_Manual_B = data.Data == 1;
					}
				}
				else if (field == SwitchDetail.Fields.FI_Manual_C)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.FI_Manual_C = null;
					else
					{
						model.FI_Manual_C = data.Data == 1;
					}
				}
				else if (field == SwitchDetail.Fields.FI_Manual_N)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.FI_Manual_N = null;
					else
					{
						model.FI_Manual_N = data.Data == 1;
					}
				}
				else if (field == SwitchDetail.Fields.Break_A)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Break_A = null;
					else
					{
						model.Break_A = data.Data == 1;
					}
				}
				else if (field == SwitchDetail.Fields.Break_B)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Break_B = null;
					else
					{
						model.Break_B = data.Data == 1;
					}
				}
				else if (field == SwitchDetail.Fields.Break_C)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Break_C = null;
					else
					{
						model.Break_C = data.Data == 1;
					}
				}
				else if (field == SwitchDetail.Fields.Phase_A)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Phase_A = null;
					else
					{
						model.Phase_A = data.Data;
					}
				}
				else if (field == SwitchDetail.Fields.Phase_B)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Phase_B = null;
					else
					{
						model.Phase_B = data.Data;
					}
				}
				else if (field == SwitchDetail.Fields.Phase_C)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Phase_C = null;
					else
					{
						model.Phase_C = data.Data;
					}
				}
				else if (field == SwitchDetail.Fields.Phase_N)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Phase_N = null;
					else
					{
						model.Phase_N = data.Data;
					}
				}
				else if (field == SwitchDetail.Fields.MaxLoad_A)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.MaxLoad_A = null;
					else
					{
						model.MaxLoad_A = data.Data;
					}
				}
				else if (field == SwitchDetail.Fields.MaxLoad_B)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.MaxLoad_B = null;
					else
					{
						model.MaxLoad_B = data.Data;
					}
				}
				else if (field == SwitchDetail.Fields.MaxLoad_C)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.MaxLoad_C = null;
					else
					{
						model.MaxLoad_C = data.Data;
					}
				}
				else if (field == SwitchDetail.Fields.MaxLoad_N)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.MaxLoad_N = null;
					else
					{
						model.MaxLoad_N = data.Data;
					}
				}
				else if (field == SwitchDetail.Fields.AverageLoad_A)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.AverageLoad_A = null;
					else
					{
						model.AverageLoad_A = data.Data;
					}
				}
				else if (field == SwitchDetail.Fields.AverageLoad_B)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.AverageLoad_B = null;
					else
					{
						model.AverageLoad_B = data.Data;
					}
				}
				else if (field == SwitchDetail.Fields.AverageLoad_C)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.AverageLoad_C = null;
					else
					{
						model.AverageLoad_C = data.Data;
					}
				}
				else if (field == SwitchDetail.Fields.AverageLoad_N)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.AverageLoad_N = null;
					else
					{
						model.AverageLoad_N = data.Data;
					}
				}
				else if (field == SwitchDetail.Fields.FailCurrent_A)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.FailCurrent_A = null;
					else
					{
						model.FailCurrent_A = data.Data;
					}
				}
				else if (field == SwitchDetail.Fields.FailCurrent_B)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.FailCurrent_B = null;
					else
					{
						model.FailCurrent_B = data.Data;
					}
				}
				else if (field == SwitchDetail.Fields.FailCurrent_C)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.FailCurrent_C = null;
					else
					{
						model.FailCurrent_C = data.Data;
					}
				}
				else if (field == SwitchDetail.Fields.FailCurrent_N)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.FailCurrent_N = null;
					else
					{
						model.FailCurrent_N = data.Data;
					}
				}
				else if (field == SwitchDetail.Fields.AppartPower_A)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.AppartPower_A = null;
					else
					{
						model.AppartPower_A = data.Data;
					}
				}
				else if (field == SwitchDetail.Fields.AppartPower_B)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.AppartPower_B = null;
					else
					{
						model.AppartPower_B = data.Data;
					}
				}
				else if (field == SwitchDetail.Fields.AppartPower_C)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.AppartPower_C = null;
					else
					{
						model.AppartPower_C = data.Data;
					}
				}
				else if (field == SwitchDetail.Fields.ElectCurrent_A)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.ElectCurrent_A = null;
					else
					{
						model.ElectCurrent_A = data.Data;
					}
				}
				else if (field == SwitchDetail.Fields.ElectCurrent_B)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.ElectCurrent_B = null;
					else
					{
						model.ElectCurrent_B = data.Data;
					}
				}
				else if (field == SwitchDetail.Fields.ElectCurrent_C)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.ElectCurrent_C = null;
					else
					{
						model.ElectCurrent_C = data.Data;
					}
				}

				else if (field == SwitchDetail.Fields.ElectCurrent_N)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.ElectCurrent_N = null;
					else
					{
						model.ElectCurrent_N = data.Data;
					}
				}
				else if (field == SwitchDetail.Fields.Volt_A)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Volt_A = null;
					else
					{
						model.Volt_A = data.Data;
					}
				}
				else if (field == SwitchDetail.Fields.Volt_B)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Volt_B = null;
					else
					{
						model.Volt_B = data.Data;
					}
				}
				else if (field == SwitchDetail.Fields.Volt_C)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.Volt_C = null;
					else
					{
						model.Volt_C = data.Data;
					}
				}
				else if (field == SwitchDetail.Fields.TideFlow_Fwd)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.TideFlow_Fwd = null;
					else
					{
						model.TideFlow_Fwd = data.Data == 1;
					}
				}
				else if (field == SwitchDetail.Fields.TideFlow_Rev)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.TideFlow_Rev = null;
					else
					{
						model.TideFlow_Rev = data.Data == 1;
					}
				}
				else if (field == SwitchDetail.Fields.FailFlow_Fwd)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.FailFlow_Fwd = null;
					else
					{
						model.FailFlow_Fwd = data.Data == 1;
					}
				}
				else if (field == SwitchDetail.Fields.FailFlow_Rev)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
						model.FailFlow_Rev = null;
					else
					{
						model.FailFlow_Rev = data.Data == 1;
					}
				}
				else if (field == SwitchDetail.Fields.Memo)
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

		public PeckPower SelectPeckPower(int id, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where ID = {2} ",
				GetFieldNames<PeckPower.Fields>(out nFieldCount), PeckPower.TableName
				, id);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				PeckPower model = ReadPeckPower(arrResult, 0, out strErrorMessage);

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

		public List<PeckPower> SelectPeckPowers(Dictionary<PeckPower.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectPeckPowers(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<PeckPower> SelectPeckPowers(Dictionary<PeckPower.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<PeckPower.Fields>(out nFieldCount), PeckPower.TableName);

			string strCondition = "";

			if (SetCondition<PeckPower.Fields>(ref strCondition, dicConditions, PeckPower.GetFieldName, PeckPower.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<PeckPower> datas = new List<PeckPower>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				PeckPower model = ReadPeckPower(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private PeckPower ReadPeckPower(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			PeckPower model = new PeckPower();
			bool isNullable;

			foreach (PeckPower.Fields field in PeckPower.Fields.GetValues(typeof(PeckPower.Fields)))
			{
				string strFieldName = PeckPower.GetFieldName(field, out isNullable);

				if (field == PeckPower.Fields.ID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.ID = data.Data;
					}
				}
				else if (field == PeckPower.Fields.Name)
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
				else if (field == PeckPower.Fields.PeckValue)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.PeckValue = data.Data;
					}
				}

				index++;
			}

			return model;
		}





		public ArrayList JoinSwitchSwitchDetail(string strAdditionalConditions, out string strErrorMessage)
		{
			return JoinSwitchSwitchDetail(strAdditionalConditions, null, out strErrorMessage);
		}

		public ArrayList JoinSwitchSwitchDetail(string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;

			string strSwitchTableName = Switch.TableName;
			string strSwitchDetailTableName = SwitchDetail.TableName;

			int nSwitchFieldCount, nSwitchDetailFieldCount;

			string strSwitchFields = GetFieldNames<Switch.Fields>(strSwitchTableName, out nSwitchFieldCount);
			string strSwitchDetailFields = GetFieldNames<SwitchDetail.Fields>(strSwitchDetailTableName, out nSwitchDetailFieldCount);

			int nFieldsCount = nSwitchFieldCount + nSwitchDetailFieldCount;

			StringBuilder sb = new StringBuilder();
			sb.AppendFormat("Select {0}, {1} ", strSwitchFields, strSwitchDetailFields);
			sb.AppendFormat("  From {0}, {1} ", strSwitchTableName, strSwitchDetailTableName);
			sb.AppendFormat(" Where {0}.{1} = {2}.{3} ", strSwitchTableName, Switch.Fields.ID, strSwitchDetailTableName, SwitchDetail.Fields.SwitchID);

			if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
			{
				sb.AppendFormat(" And {0}", strAdditionalConditions);
			}

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(sb.ToString()) : m_dbManager.GetResultData(sb.ToString(), (int)topNCount);
			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			ArrayList arrDatas = new ArrayList();
			int nResultCount = arrResult.Count;

			for (int i = 0; i < nResultCount - (nFieldsCount - 1); i += nFieldsCount)
			{
				Switch _switch = ReadSwitch(arrResult, i, out strErrorMessage);

				if (_switch == null)
					return null;
				else
					arrDatas.Add(_switch);

				SwitchDetail switchDetail = ReadSwitchDetail(arrResult, i + nSwitchFieldCount, out strErrorMessage);

				if (switchDetail == null)
					return null;
				else
					arrDatas.Add(switchDetail);
			}

			return arrDatas;
		}











	}
}
