using System;
using System.Collections.Generic;
using dnsDBUtil;
using GGH.IDAL;
using GGH.Model.CCTV;
using GGH.Model;
using SDMS.Model.CCTV;
using GGH.Model.Equipment;

namespace GGH.DAL
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

		public bool UpdateNvr(Nvr obj, out string strErrorMessage)
		{
			Dictionary<Nvr.Fields, object> dicSets = new Dictionary<Nvr.Fields, object>();
			dicSets[Nvr.Fields.Name] = obj.Name;
			dicSets[Nvr.Fields.Url] = obj.Url;
			dicSets[Nvr.Fields.Description] = obj.Description;

			Dictionary<Nvr.Fields, object> dicConditions = new Dictionary<Nvr.Fields, object>();
			dicConditions[Nvr.Fields.ID] = obj.ID;

			return UpdateNvr(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateNvr(Dictionary<Nvr.Fields, object> dicSets, Dictionary<Nvr.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<Nvr.Fields>(ref strSets, dicSets, Nvr.GetFieldName, Nvr.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<Nvr.Fields>(ref strCondition, dicConditions, Nvr.GetFieldName, Nvr.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(Nvr.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateNvrLink(NvrLink obj, out string strErrorMessage)
		{
			Dictionary<NvrLink.Fields, object> dicSets = new Dictionary<NvrLink.Fields, object>();

			Dictionary<NvrLink.Fields, object> dicConditions = new Dictionary<NvrLink.Fields, object>();
			dicConditions[NvrLink.Fields.CctvID] = obj.CctvID;
			dicConditions[NvrLink.Fields.NvrID] = obj.NvrID;

			return UpdateNvrLink(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateNvrLink(Dictionary<NvrLink.Fields, object> dicSets, Dictionary<NvrLink.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<NvrLink.Fields>(ref strSets, dicSets, NvrLink.GetFieldName, NvrLink.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<NvrLink.Fields>(ref strCondition, dicConditions, NvrLink.GetFieldName, NvrLink.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(NvrLink.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool UpdateEvacuation(Evacuation obj, out string strErrorMessage)
        {
			Dictionary<Evacuation.Fields, object> dicSets = new Dictionary<Evacuation.Fields, object>();
			dicSets[Evacuation.Fields.IsEvac] = obj.IsEvac;
			dicSets[Evacuation.Fields.TimeStamp] = obj.TimeStamp;
			dicSets[Evacuation.Fields.UniqueKey] = obj.UniqueKey;

			Dictionary<Evacuation.Fields, object> dicConditions = new Dictionary<Evacuation.Fields, object>();
			dicConditions[Evacuation.Fields.SiteID] = obj.SiteID;

			return UpdateEvacuation(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateEvacuation(Dictionary<Evacuation.Fields, object> dicSets, Dictionary<Evacuation.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
        {
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<Evacuation.Fields>(ref strSets, dicSets, Evacuation.GetFieldName, Evacuation.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<Evacuation.Fields>(ref strCondition, dicConditions, Evacuation.GetFieldName, Evacuation.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(Evacuation.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool UpdateCCTV(CCTV cctv, out string strErrorMessage)
		{
			Dictionary<CCTV.Fields, object> dicSets = new Dictionary<CCTV.Fields, object>();
			dicSets[CCTV.Fields.CameraName] = cctv.CameraName;
			dicSets[CCTV.Fields.PositionName] = cctv.PositionName;
			dicSets[CCTV.Fields.UniqueKey] = cctv.UniqueKey;
			dicSets[CCTV.Fields.X] = cctv.X;
			dicSets[CCTV.Fields.Y] = cctv.Y;
			dicSets[CCTV.Fields.Z] = cctv.Z;
			dicSets[CCTV.Fields.ZoneID] = cctv.ZoneID;
			dicSets[CCTV.Fields.IsIndoor] = cctv.IsIndoor;
			dicSets[CCTV.Fields.Type] = cctv.Type;
			dicSets[CCTV.Fields.Channel] = cctv.Channel;
			dicSets[CCTV.Fields.UserID] = cctv.UserID;
			dicSets[CCTV.Fields.Password] = cctv.Password;
			dicSets[CCTV.Fields.URL] = cctv.URL;
			dicSets[CCTV.Fields.BigURL] = cctv.BigURL;
			dicSets[CCTV.Fields.SmallURL] = cctv.SmallURL;
			dicSets[CCTV.Fields.Enabled] = cctv.Enabled;
			dicSets[CCTV.Fields.CameraIP] = cctv.CameraIP;
			dicSets[CCTV.Fields.CameraCompanyName] = cctv.CameraCompanyName;
			dicSets[CCTV.Fields.CameraModelName] = cctv.CameraModelName;
			dicSets[CCTV.Fields.Description] = cctv.Description;
			dicSets[CCTV.Fields.SiteID] = cctv.SiteID;

			Dictionary<CCTV.Fields, object> dicConditions = new Dictionary<CCTV.Fields, object>();
			dicConditions[CCTV.Fields.ID] = cctv.ID;

			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<CCTV.Fields>(ref strSets, dicSets, CCTV.GetFieldName, CCTV.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<CCTV.Fields>(ref strCondition, dicConditions, CCTV.GetFieldName, CCTV.TableName, ref strErrorMessage) == false)
				return false;

			string strSQL = string.Format("Update {0} set {1} where {2}", CCTV.TableName, strSets, strCondition);

			if (m_dbManager.GetResultData(strSQL) == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return false;
			}

			return true;
		}

		public bool UpdateParkingGate(ParkingGate obj, out string strErrorMessage)
		{
			Dictionary<ParkingGate.Fields, object> dicSets = new Dictionary<ParkingGate.Fields, object>();
			dicSets[ParkingGate.Fields.Name] = obj.Name;
			dicSets[ParkingGate.Fields.GateCode] = obj.GateCode;
			dicSets[ParkingGate.Fields.InOut] = obj.InOut;
			dicSets[ParkingGate.Fields.Status] = obj.Status;
			dicSets[ParkingGate.Fields.SiteID] = obj.SiteID;

			Dictionary<ParkingGate.Fields, object> dicConditions = new Dictionary<ParkingGate.Fields, object>();
			dicConditions[ParkingGate.Fields.ID] = obj.ID;

			return UpdateParkingGate(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateParkingGate(Dictionary<ParkingGate.Fields, object> dicSets, Dictionary<ParkingGate.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<ParkingGate.Fields>(ref strSets, dicSets, ParkingGate.GetFieldName, ParkingGate.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<ParkingGate.Fields>(ref strCondition, dicConditions, ParkingGate.GetFieldName, ParkingGate.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(ParkingGate.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool UpdateData(UpdateData obj, out string strErrorMessage)
        {
			Dictionary<UpdateData.Fields, object> dicSets = new Dictionary<UpdateData.Fields, object>();
			dicSets[GGH.Model.UpdateData.Fields.Timestamp] = obj.Timestamp;
			dicSets[GGH.Model.UpdateData.Fields.NameOfTable] = obj.NameOfTable;
			dicSets[GGH.Model.UpdateData.Fields.FieldList] = obj.FieldList;
			dicSets[GGH.Model.UpdateData.Fields.ValueList] = obj.ValueList;
			dicSets[GGH.Model.UpdateData.Fields.PrimaryCondition] = obj.PrimaryCondition;

			Dictionary<UpdateData.Fields, object> dicConditions = new Dictionary<UpdateData.Fields, object>();
			dicConditions[GGH.Model.UpdateData.Fields.ID] = obj.ID;

			return UpdateData(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateData(Dictionary<UpdateData.Fields, object> dicSets, Dictionary<UpdateData.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
        {
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<UpdateData.Fields>(ref strSets, dicSets, GGH.Model.UpdateData.GetFieldName, GGH.Model.UpdateData.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<UpdateData.Fields>(ref strCondition, dicConditions, GGH.Model.UpdateData.GetFieldName, GGH.Model.UpdateData.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(GGH.Model.UpdateData.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool UpdateHistoryEarthquake(Model.History.Earthquake obj, out string strErrorMessage)
        {
			Dictionary<Model.History.Earthquake.Fields, object> dicSets = new Dictionary<Model.History.Earthquake.Fields, object>();
			dicSets[Model.History.Earthquake.Fields.Hpga] = obj.Hpga;
			dicSets[Model.History.Earthquake.Fields.Tpga] = obj.Tpga;
			dicSets[Model.History.Earthquake.Fields.Gal] = obj.Gal;
			dicSets[Model.History.Earthquake.Fields.Intensity] = obj.Intensity;

			Dictionary<Model.History.Earthquake.Fields, object> dicConditions = new Dictionary<Model.History.Earthquake.Fields, object>();
			dicConditions[Model.History.Earthquake.Fields.TimeStamp] = obj.TimeStamp;

			return UpdateHistoryEarthquake(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateHistoryEarthquake(Dictionary<Model.History.Earthquake.Fields, object> dicSets, Dictionary<Model.History.Earthquake.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
        {
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<Model.History.Earthquake.Fields>(ref strSets, dicSets, Model.History.Earthquake.GetFieldName, Model.History.Earthquake.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<Model.History.Earthquake.Fields>(ref strCondition, dicConditions, Model.History.Earthquake.GetFieldName, Model.History.Earthquake.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(Model.History.Earthquake.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool UpdateFirstAidEquipment(FirstAidEquipment obj, out string strErrorMessage)
		{
			Dictionary<FirstAidEquipment.Fields, object> dicSets = new Dictionary<FirstAidEquipment.Fields, object>();
			dicSets[FirstAidEquipment.Fields.EquipmentType] = obj.EquipmentType;
			dicSets[FirstAidEquipment.Fields.EquipmentName] = obj.EquipmentName;
			dicSets[FirstAidEquipment.Fields.ZoneID] = obj.ZoneID;
			dicSets[FirstAidEquipment.Fields.X] = obj.X;
			dicSets[FirstAidEquipment.Fields.Y] = obj.Y;
			dicSets[FirstAidEquipment.Fields.Z] = obj.Z;
			dicSets[FirstAidEquipment.Fields.SiteID] = obj.SiteID;

			Dictionary<FirstAidEquipment.Fields, object> dicConditions = new Dictionary<FirstAidEquipment.Fields, object>();
			dicConditions[FirstAidEquipment.Fields.ID] = obj.ID;

			return UpdateFirstAidEquipment(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateFirstAidEquipment(Dictionary<FirstAidEquipment.Fields, object> dicSets, Dictionary<FirstAidEquipment.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<FirstAidEquipment.Fields>(ref strSets, dicSets, FirstAidEquipment.GetFieldName, FirstAidEquipment.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<FirstAidEquipment.Fields>(ref strCondition, dicConditions, FirstAidEquipment.GetFieldName, FirstAidEquipment.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(FirstAidEquipment.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateFirstAidEquipmentType(FirstAidEquipmentType obj, out string strErrorMessage)
		{
			Dictionary<FirstAidEquipmentType.Fields, object> dicSets = new Dictionary<FirstAidEquipmentType.Fields, object>();
			dicSets[FirstAidEquipmentType.Fields.EquipmentType] = obj.EquipmentType;
			dicSets[FirstAidEquipmentType.Fields.EquipmentTypeEng] = obj.EquipmentTypeEng;

			Dictionary<FirstAidEquipmentType.Fields, object> dicConditions = new Dictionary<FirstAidEquipmentType.Fields, object>();
			dicConditions[FirstAidEquipmentType.Fields.ID] = obj.ID;

			return UpdateFirstAidEquipmentType(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateFirstAidEquipmentType(Dictionary<FirstAidEquipmentType.Fields, object> dicSets, Dictionary<FirstAidEquipmentType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<FirstAidEquipmentType.Fields>(ref strSets, dicSets, FirstAidEquipmentType.GetFieldName, FirstAidEquipmentType.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<FirstAidEquipmentType.Fields>(ref strCondition, dicConditions, FirstAidEquipmentType.GetFieldName, FirstAidEquipmentType.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(FirstAidEquipmentType.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}
	}
}
