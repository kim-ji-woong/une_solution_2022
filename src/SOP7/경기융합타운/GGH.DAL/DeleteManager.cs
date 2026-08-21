using System;
using System.Collections.Generic;
using dnsDBUtil;
using GGH.IDAL;
using GGH.Model.CCTV;
using GGH.Model;
using GGH.Model.Equipment;

namespace GGH.DAL
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

		public bool DeleteNvr(int id, out string strErrorMessage)
		{
			return DeleteFromID(Nvr.TableName, id, out strErrorMessage);
		}

		public bool DeleteNvr(Dictionary<Nvr.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<Nvr.Fields>(ref strCondition, dicConditions, Nvr.GetFieldName, Nvr.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(Nvr.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteNvrLink(int cctvID, int nvrID, out string strErrorMessage)
		{
			Dictionary<NvrLink.Fields, object> dicConditions = new Dictionary<NvrLink.Fields, object>();
			dicConditions[NvrLink.Fields.CctvID] = cctvID;
			dicConditions[NvrLink.Fields.NvrID] = nvrID;

			return DeleteNvrLink(dicConditions, null, out strErrorMessage);
		}

		public bool DeleteNvrLink(Dictionary<NvrLink.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<NvrLink.Fields>(ref strCondition, dicConditions, NvrLink.GetFieldName, NvrLink.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(NvrLink.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool DeleteEvacuation(int siteID, out string strErrorMessage)
        {
			Dictionary<Evacuation.Fields, object> dicConditions = new Dictionary<Evacuation.Fields, object>();
			dicConditions[Evacuation.Fields.SiteID] = siteID;

			return DeleteEvacuation(dicConditions, null, out strErrorMessage);
		}

		public bool DeleteEvacuation(Dictionary<Evacuation.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
        {
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<Evacuation.Fields>(ref strCondition, dicConditions, Evacuation.GetFieldName, Evacuation.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(Evacuation.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool DeleteParkingGate(int id, out string strErrorMessage)
		{
			return DeleteFromID(ParkingGate.TableName, id, out strErrorMessage);
		}

		public bool DeleteParkingGate(Dictionary<ParkingGate.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<ParkingGate.Fields>(ref strCondition, dicConditions, ParkingGate.GetFieldName, ParkingGate.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(ParkingGate.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool DeleteUpdateData(int id, out string strErrorMessage)
        {
			return DeleteFromID(UpdateData.TableName, id, out strErrorMessage);
		}

		public bool DeleteUpdateData(Dictionary<UpdateData.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
        {
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<UpdateData.Fields>(ref strCondition, dicConditions, UpdateData.GetFieldName, UpdateData.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(UpdateData.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool DeleteHistoryEarthquake(DateTime timeStamp, out string strErrorMessage)
        {
			Dictionary<Model.History.Earthquake.Fields, object> dicConditions = new Dictionary<Model.History.Earthquake.Fields, object>();
			dicConditions[Model.History.Earthquake.Fields.TimeStamp] = timeStamp;

			return DeleteHistoryEarthquake(dicConditions, null, out strErrorMessage);
		}

		public bool DeleteHistoryEarthquake(Dictionary<Model.History.Earthquake.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
        {
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<Model.History.Earthquake.Fields>(ref strCondition, dicConditions, Model.History.Earthquake.GetFieldName, Model.History.Earthquake.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(Model.History.Earthquake.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool DeleteFirstAidEquipment(int id, out string strErrorMessage)
		{
			return DeleteFromID(FirstAidEquipment.TableName, id, out strErrorMessage);
		}

		public bool DeleteFirstAidEquipment(Dictionary<FirstAidEquipment.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<FirstAidEquipment.Fields>(ref strCondition, dicConditions, FirstAidEquipment.GetFieldName, FirstAidEquipment.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(FirstAidEquipment.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteFirstAidEquipmentType(int id, out string strErrorMessage)
		{
			return DeleteFromID(FirstAidEquipmentType.TableName, id, out strErrorMessage);
		}

		public bool DeleteFirstAidEquipmentType(Dictionary<FirstAidEquipmentType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<FirstAidEquipmentType.Fields>(ref strCondition, dicConditions, FirstAidEquipmentType.GetFieldName, FirstAidEquipmentType.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(FirstAidEquipmentType.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}
	}
}
