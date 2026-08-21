using Airbase20.IDAL;
using Airbase20.Model;
using dnsDBUtil;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;

namespace Airbase20.DAL
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

		public Relay CreateRelay(Relay obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<Relay.Fields, object> dicFieldDatas = new Dictionary<Relay.Fields, object>();
			dicFieldDatas[Relay.Fields.Name] = obj.Name;
			dicFieldDatas[Relay.Fields.Type] = obj.Type;
			dicFieldDatas[Relay.Fields.IP] = obj.IP;
			dicFieldDatas[Relay.Fields.SubIP] = obj.SubIP;
			dicFieldDatas[Relay.Fields.Port] = obj.Port;
			dicFieldDatas[Relay.Fields.ElectCurrent_A] = obj.ElectCurrent_A;
			dicFieldDatas[Relay.Fields.ElectCurrent_B] = obj.ElectCurrent_B;
			dicFieldDatas[Relay.Fields.ElectCurrent_C] = obj.ElectCurrent_C;
			dicFieldDatas[Relay.Fields.Volt_A] = obj.Volt_A;
			dicFieldDatas[Relay.Fields.Volt_B] = obj.Volt_B;
			dicFieldDatas[Relay.Fields.Volt_C] = obj.Volt_C;
			dicFieldDatas[Relay.Fields.Factor] = obj.Factor;
			dicFieldDatas[Relay.Fields.ActivePower] = obj.ActivePower;
			dicFieldDatas[Relay.Fields.ReactivePower] = obj.ReactivePower;
			dicFieldDatas[Relay.Fields.Frequency] = obj.Frequency;
			dicFieldDatas[Relay.Fields.ActivePowerTotal] = obj.ActivePowerTotal;
			dicFieldDatas[Relay.Fields.ReactivePowerTotal] = obj.ReactivePowerTotal;
			dicFieldDatas[Relay.Fields.Memo] = obj.Memo;
			dicFieldDatas[Relay.Fields.SlaveID] = obj.SlaveID;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ID) FROM {0} C), 0) + 1, {2})",
				Relay.TableName,
				GetFieldNames<Relay.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", Relay.GetFieldName(Relay.Fields.ID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<Relay> datas = m_dataManager.GetSelectManager().SelectRelays(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameRelay(obj, datas[0]))
					return datas[0];

				return GetRelay(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameRelay(Relay oldObject, Relay newObject)
		{
			if (oldObject.Name == newObject.Name &&
				oldObject.Type == newObject.Type &&
				oldObject.IP == newObject.IP &&
				oldObject.SubIP == newObject.SubIP &&
				oldObject.Port == newObject.Port &&
				oldObject.ElectCurrent_A == newObject.ElectCurrent_A &&
				oldObject.ElectCurrent_B == newObject.ElectCurrent_B &&
				oldObject.ElectCurrent_C == newObject.ElectCurrent_C &&
				oldObject.Volt_A == newObject.Volt_A &&
				oldObject.Volt_B == newObject.Volt_B &&
				oldObject.Volt_C == newObject.Volt_C &&
				oldObject.Factor == newObject.Factor &&
				oldObject.ActivePower == newObject.ActivePower &&
				oldObject.ReactivePower == newObject.ReactivePower &&
				oldObject.Frequency == newObject.Frequency &&
				oldObject.ActivePowerTotal == newObject.ActivePowerTotal &&
				oldObject.ReactivePowerTotal == newObject.ReactivePowerTotal &&
				oldObject.Memo == newObject.Memo &&
				oldObject.SlaveID == newObject.SlaveID)
				return true;

			return false;
		}

		private Relay GetRelay(Relay obj, int id, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", Relay.GetFieldName(Relay.Fields.ID, out isNullable), id);

			List<Relay> datas = m_dataManager.GetSelectManager().SelectRelays(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (Relay data in datas)
			{
				if (IsSameRelay(data, obj))
					return data;

				if (data.ID < id)
					id = data.ID;
			}

			if (nCount < nLimit)
				return GetRelay(obj, id, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(Relay.TableName);
			return null;
		}

		public RelayHistory CreateRelayHistory(RelayHistory obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<RelayHistory.Fields, object> dicFieldDatas = new Dictionary<RelayHistory.Fields, object>();
			dicFieldDatas[RelayHistory.Fields.RelayID] = obj.RelayID;
			dicFieldDatas[RelayHistory.Fields.Date] = obj.Date;
			dicFieldDatas[RelayHistory.Fields.ActivePowerTotal] = obj.ActivePowerTotal;
			dicFieldDatas[RelayHistory.Fields.ReactivePowerTotal] = obj.ReactivePowerTotal;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ID) FROM {0} C), 0) + 1, {2})",
				RelayHistory.TableName,
				GetFieldNames<RelayHistory.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", RelayHistory.GetFieldName(RelayHistory.Fields.ID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<RelayHistory> datas = m_dataManager.GetSelectManager().SelectRelayHistorys(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameRelayHistory(obj, datas[0]))
					return datas[0];

				return GetRelayHistory(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameRelayHistory(RelayHistory oldObject, RelayHistory newObject)
		{
			if (oldObject.RelayID == newObject.RelayID &&
				IsSameTime(oldObject.Date, newObject.Date) &&
				oldObject.ActivePowerTotal == newObject.ActivePowerTotal &&
				oldObject.ReactivePowerTotal == newObject.ReactivePowerTotal)
				return true;

			return false;
		}

		private RelayHistory GetRelayHistory(RelayHistory obj, int id, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", RelayHistory.GetFieldName(RelayHistory.Fields.ID, out isNullable), id);

			List<RelayHistory> datas = m_dataManager.GetSelectManager().SelectRelayHistorys(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (RelayHistory data in datas)
			{
				if (IsSameRelayHistory(data, obj))
					return data;

				if (data.ID < id)
					id = data.ID;
			}

			if (nCount < nLimit)
				return GetRelayHistory(obj, id, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(RelayHistory.TableName);
			return null;
		}

		public Switch CreateSwitch(Switch obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<Switch.Fields, object> dicFieldDatas = new Dictionary<Switch.Fields, object>();
			dicFieldDatas[Switch.Fields.Name] = obj.Name;
			dicFieldDatas[Switch.Fields.Type] = obj.Type;
			dicFieldDatas[Switch.Fields.IP] = obj.IP;
			dicFieldDatas[Switch.Fields.SubIP] = obj.SubIP;
			dicFieldDatas[Switch.Fields.Port] = obj.Port;
			dicFieldDatas[Switch.Fields.Memo] = obj.Memo;
			dicFieldDatas[Switch.Fields.SlaveID] = obj.SlaveID;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ID) FROM {0} C), 0) + 1, {2})",
				Switch.TableName,
				GetFieldNames<Switch.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", Switch.GetFieldName(Switch.Fields.ID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<Switch> datas = m_dataManager.GetSelectManager().SelectSwitchs(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameSwitch(obj, datas[0]))
					return datas[0];

				return GetSwitch(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameSwitch(Switch oldObject, Switch newObject)
		{
			if (oldObject.Name == newObject.Name &&
				oldObject.Type == newObject.Type &&
				oldObject.IP == newObject.IP &&
				oldObject.SubIP == newObject.SubIP &&
				oldObject.Port == newObject.Port &&
				oldObject.Memo == newObject.Memo &&
				oldObject.SlaveID == newObject.SlaveID)
				return true;

			return false;
		}

		private Switch GetSwitch(Switch obj, int id, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", Switch.GetFieldName(Switch.Fields.ID, out isNullable), id);

			List<Switch> datas = m_dataManager.GetSelectManager().SelectSwitchs(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (Switch data in datas)
			{
				if (IsSameSwitch(data, obj))
					return data;

				if (data.ID < id)
					id = data.ID;
			}

			if (nCount < nLimit)
				return GetSwitch(obj, id, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(Switch.TableName);
			return null;
		}

		public SwitchDetail CreateSwitchDetail(SwitchDetail obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<SwitchDetail.Fields, object> dicFieldDatas = new Dictionary<SwitchDetail.Fields, object>();
			dicFieldDatas[SwitchDetail.Fields.SwitchID] = obj.SwitchID;
			dicFieldDatas[SwitchDetail.Fields.Circuit] = obj.Circuit;
			dicFieldDatas[SwitchDetail.Fields.OpenClose] = obj.OpenClose;
			dicFieldDatas[SwitchDetail.Fields.FI_Auto_A] = obj.FI_Auto_A;
			dicFieldDatas[SwitchDetail.Fields.FI_Auto_B] = obj.FI_Auto_B;
			dicFieldDatas[SwitchDetail.Fields.FI_Auto_C] = obj.FI_Auto_C;
			dicFieldDatas[SwitchDetail.Fields.FI_Auto_N] = obj.FI_Auto_N;
			dicFieldDatas[SwitchDetail.Fields.FI_Manual_A] = obj.FI_Manual_A;
			dicFieldDatas[SwitchDetail.Fields.FI_Manual_B] = obj.FI_Manual_B;
			dicFieldDatas[SwitchDetail.Fields.FI_Manual_C] = obj.FI_Manual_C;
			dicFieldDatas[SwitchDetail.Fields.FI_Manual_N] = obj.FI_Manual_N;
			dicFieldDatas[SwitchDetail.Fields.Break_A] = obj.Break_A;
			dicFieldDatas[SwitchDetail.Fields.Break_B] = obj.Break_B;
			dicFieldDatas[SwitchDetail.Fields.Break_C] = obj.Break_C;
			dicFieldDatas[SwitchDetail.Fields.Phase_A] = obj.Phase_A;
			dicFieldDatas[SwitchDetail.Fields.Phase_B] = obj.Phase_B;
			dicFieldDatas[SwitchDetail.Fields.Phase_C] = obj.Phase_C;
			dicFieldDatas[SwitchDetail.Fields.Phase_N] = obj.Phase_N;
			dicFieldDatas[SwitchDetail.Fields.MaxLoad_A] = obj.MaxLoad_A;
			dicFieldDatas[SwitchDetail.Fields.MaxLoad_B] = obj.MaxLoad_B;
			dicFieldDatas[SwitchDetail.Fields.MaxLoad_C] = obj.MaxLoad_C;
			dicFieldDatas[SwitchDetail.Fields.MaxLoad_N] = obj.MaxLoad_N;
			dicFieldDatas[SwitchDetail.Fields.AverageLoad_A] = obj.AverageLoad_A;
			dicFieldDatas[SwitchDetail.Fields.AverageLoad_B] = obj.AverageLoad_B;
			dicFieldDatas[SwitchDetail.Fields.AverageLoad_C] = obj.AverageLoad_C;
			dicFieldDatas[SwitchDetail.Fields.AverageLoad_N] = obj.AverageLoad_N;
			dicFieldDatas[SwitchDetail.Fields.FailCurrent_A] = obj.FailCurrent_A;
			dicFieldDatas[SwitchDetail.Fields.FailCurrent_B] = obj.FailCurrent_B;
			dicFieldDatas[SwitchDetail.Fields.FailCurrent_C] = obj.FailCurrent_C;
			dicFieldDatas[SwitchDetail.Fields.FailCurrent_N] = obj.FailCurrent_N;
			dicFieldDatas[SwitchDetail.Fields.AppartPower_A] = obj.AppartPower_A;
			dicFieldDatas[SwitchDetail.Fields.AppartPower_B] = obj.AppartPower_B;
			dicFieldDatas[SwitchDetail.Fields.AppartPower_C] = obj.AppartPower_C;		
			dicFieldDatas[SwitchDetail.Fields.ElectCurrent_A] = obj.ElectCurrent_A;
			dicFieldDatas[SwitchDetail.Fields.ElectCurrent_B] = obj.ElectCurrent_B;
			dicFieldDatas[SwitchDetail.Fields.ElectCurrent_C] = obj.ElectCurrent_C;
			dicFieldDatas[SwitchDetail.Fields.ElectCurrent_N] = obj.ElectCurrent_N;
			dicFieldDatas[SwitchDetail.Fields.Volt_A] = obj.Volt_A;
			dicFieldDatas[SwitchDetail.Fields.Volt_B] = obj.Volt_B;
			dicFieldDatas[SwitchDetail.Fields.Volt_C] = obj.Volt_C;
			dicFieldDatas[SwitchDetail.Fields.TideFlow_Fwd] = obj.TideFlow_Fwd;
			dicFieldDatas[SwitchDetail.Fields.TideFlow_Rev] = obj.TideFlow_Rev;
			dicFieldDatas[SwitchDetail.Fields.FailFlow_Fwd] = obj.FailFlow_Fwd;
			dicFieldDatas[SwitchDetail.Fields.FailFlow_Rev] = obj.FailFlow_Rev;
			dicFieldDatas[SwitchDetail.Fields.Memo] = obj.Memo;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ID) FROM {0} C), 0) + 1, {2})",
				SwitchDetail.TableName,
				GetFieldNames<SwitchDetail.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", SwitchDetail.GetFieldName(SwitchDetail.Fields.ID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<SwitchDetail> datas = m_dataManager.GetSelectManager().SelectSwitchDetails(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameSwitchDetail(obj, datas[0]))
					return datas[0];

				return GetSwitchDetail(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameSwitchDetail(SwitchDetail oldObject, SwitchDetail newObject)
		{
			if (oldObject.SwitchID == newObject.SwitchID &&
				oldObject.Circuit == newObject.Circuit &&
				oldObject.OpenClose == newObject.OpenClose &&
				oldObject.FI_Auto_A == newObject.FI_Auto_A &&
				oldObject.FI_Auto_B == newObject.FI_Auto_B &&
				oldObject.FI_Auto_C == newObject.FI_Auto_C &&
				oldObject.FI_Auto_N == newObject.FI_Auto_N &&
				oldObject.FI_Manual_A == newObject.FI_Manual_A &&
				oldObject.FI_Manual_B == newObject.FI_Manual_B &&
				oldObject.FI_Manual_C == newObject.FI_Manual_C &&
				oldObject.FI_Manual_N == newObject.FI_Manual_N &&
				oldObject.Break_A == newObject.Break_A &&
				oldObject.Break_B == newObject.Break_B &&
				oldObject.Break_C == newObject.Break_C &&
				oldObject.Phase_A == newObject.Phase_A &&
				oldObject.Phase_B == newObject.Phase_B &&
				oldObject.Phase_C == newObject.Phase_C &&
				oldObject.Phase_N == newObject.Phase_N &&
				oldObject.MaxLoad_A == newObject.MaxLoad_A &&
				oldObject.MaxLoad_B == newObject.MaxLoad_B &&
				oldObject.MaxLoad_C == newObject.MaxLoad_C &&
				oldObject.MaxLoad_N == newObject.MaxLoad_N &&
				oldObject.AverageLoad_A == newObject.AverageLoad_A &&
				oldObject.AverageLoad_B == newObject.AverageLoad_B &&
				oldObject.AverageLoad_C == newObject.AverageLoad_C &&
				oldObject.AverageLoad_N == newObject.AverageLoad_N &&
				oldObject.FailCurrent_A == newObject.FailCurrent_A &&
				oldObject.FailCurrent_B == newObject.FailCurrent_B &&
				oldObject.FailCurrent_C == newObject.FailCurrent_C &&
				oldObject.FailCurrent_N == newObject.FailCurrent_N &&
				oldObject.AppartPower_A == newObject.AppartPower_A &&
				oldObject.AppartPower_B == newObject.AppartPower_B &&
				oldObject.AppartPower_C == newObject.AppartPower_C &&
				oldObject.Volt_A == newObject.Volt_A &&
				oldObject.Volt_B == newObject.Volt_B &&
				oldObject.Volt_C == newObject.Volt_C &&
				oldObject.TideFlow_Fwd == newObject.TideFlow_Fwd &&
				oldObject.TideFlow_Rev == newObject.TideFlow_Rev &&
				oldObject.FailFlow_Fwd == newObject.FailFlow_Fwd &&
				oldObject.FailFlow_Rev == newObject.FailFlow_Rev &&
				oldObject.Memo == newObject.Memo)
				return true;

			return false;
		}

		private SwitchDetail GetSwitchDetail(SwitchDetail obj, int id, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", SwitchDetail.GetFieldName(SwitchDetail.Fields.ID, out isNullable), id);

			List<SwitchDetail> datas = m_dataManager.GetSelectManager().SelectSwitchDetails(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (SwitchDetail data in datas)
			{
				if (IsSameSwitchDetail(data, obj))
					return data;

				if (data.ID < id)
					id = data.ID;
			}

			if (nCount < nLimit)
				return GetSwitchDetail(obj, id, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(SwitchDetail.TableName);
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


		public PeckPower CreatePeckPower(PeckPower obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<PeckPower.Fields, object> dicFieldDatas = new Dictionary<PeckPower.Fields, object>();
			dicFieldDatas[PeckPower.Fields.Name] = obj.Name;
			dicFieldDatas[PeckPower.Fields.PeckValue] = obj.PeckValue;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ID) FROM {0} C), 0) + 1, {2})",
				PeckPower.TableName,
				GetFieldNames<PeckPower.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc", PeckPower.GetFieldName(PeckPower.Fields.ID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<PeckPower> datas = m_dataManager.GetSelectManager().SelectPeckPowers(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSamePeckPower(obj, datas[0]))
					return datas[0];

				return GetPeckPower(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSamePeckPower(PeckPower oldObject, PeckPower newObject)
		{
			if (oldObject.Name == newObject.Name &&
				oldObject.PeckValue == newObject.PeckValue)
				return true;

			return false;
		}

		private PeckPower GetPeckPower(PeckPower obj, int id, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} < {1} order by {0} desc", PeckPower.GetFieldName(PeckPower.Fields.ID, out isNullable), id);

			List<PeckPower> datas = m_dataManager.GetSelectManager().SelectPeckPowers(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (PeckPower data in datas)
			{
				if (IsSamePeckPower(data, obj))
					return data;

				if (data.ID < id)
					id = data.ID;
			}

			if (nCount < nLimit)
				return GetPeckPower(obj, id, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(PeckPower.TableName);
			return null;
		}

	}
}
