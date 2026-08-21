using System;
using System.Collections;
using System.Collections.Generic;
using dnsDBUtil;
using EDMS.IDAL;
using EDMS.Model;

namespace EDMS.DAL
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

		public bool UpdateEdmsFacility(Facility obj, out string strErrorMessage)
		{
			Dictionary<Facility.Fields, object> dicSets = new Dictionary<Facility.Fields, object>();
			dicSets[Facility.Fields.ModelName] = obj.ModelName;
			dicSets[Facility.Fields.IsPoi] = obj.IsPoi;
			dicSets[Facility.Fields.LinkedPipe] = obj.LinkedPipe;
			dicSets[Facility.Fields.RunPipeBall] = obj.RunPipeBall;
			dicSets[Facility.Fields.ShowPopup] = obj.ShowPopup;
			dicSets[Facility.Fields.SensorName] = obj.SensorName;
			dicSets[Facility.Fields.ShowTreeView] = obj.ShowTreeView;
			dicSets[Facility.Fields.ZoneID] = obj.ZoneID;
			dicSets[Facility.Fields.MaterialTypeID] = obj.MaterialTypeID;

			Dictionary<Facility.Fields, object> dicConditions = new Dictionary<Facility.Fields, object>();
			dicConditions[Facility.Fields.ID] = obj.ID;

			return UpdateEdmsFacility(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateEdmsFacility(Dictionary<Facility.Fields, object> dicSets, Dictionary<Facility.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<Facility.Fields>(ref strSets, dicSets, Facility.GetFieldName, Facility.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<Facility.Fields>(ref strCondition, dicConditions, Facility.GetFieldName, Facility.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(Facility.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateEdmsFacilityCameraData(FacilityCameraData obj, out string strErrorMessage)
		{
			Dictionary<FacilityCameraData.Fields, object> dicSets = new Dictionary<FacilityCameraData.Fields, object>();
			dicSets[FacilityCameraData.Fields.FacilityID] = obj.FacilityID;
			dicSets[FacilityCameraData.Fields.CameraPositionX] = obj.CameraPositionX;
			dicSets[FacilityCameraData.Fields.CameraPositionY] = obj.CameraPositionY;
			dicSets[FacilityCameraData.Fields.CameraPositionZ] = obj.CameraPositionZ;
			dicSets[FacilityCameraData.Fields.CameraQuaternionX] = obj.CameraQuaternionX;
			dicSets[FacilityCameraData.Fields.CameraQuaternionY] = obj.CameraQuaternionY;
			dicSets[FacilityCameraData.Fields.CameraQuaternionZ] = obj.CameraQuaternionZ;
			dicSets[FacilityCameraData.Fields.CameraQuaternionW] = obj.CameraQuaternionW;
			dicSets[FacilityCameraData.Fields.CameraRotationX] = obj.CameraRotationX;
			dicSets[FacilityCameraData.Fields.CameraRotationY] = obj.CameraRotationY;
			dicSets[FacilityCameraData.Fields.CameraRotationZ] = obj.CameraRotationZ;
			dicSets[FacilityCameraData.Fields.CameraFov] = obj.CameraFov;
			dicSets[FacilityCameraData.Fields.CameraNear] = obj.CameraNear;
			dicSets[FacilityCameraData.Fields.CameraFar] = obj.CameraFar;
			dicSets[FacilityCameraData.Fields.OrbitTargetX] = obj.OrbitTargetX;
			dicSets[FacilityCameraData.Fields.OrbitTargetY] = obj.OrbitTargetY;
			dicSets[FacilityCameraData.Fields.OrbitTargetZ] = obj.OrbitTargetZ;

			Dictionary<FacilityCameraData.Fields, object> dicConditions = new Dictionary<FacilityCameraData.Fields, object>();
			dicConditions[FacilityCameraData.Fields.ID] = obj.ID;

			return UpdateEdmsFacilityCameraData(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateEdmsFacilityCameraData(Dictionary<FacilityCameraData.Fields, object> dicSets, Dictionary<FacilityCameraData.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<FacilityCameraData.Fields>(ref strSets, dicSets, FacilityCameraData.GetFieldName, FacilityCameraData.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<FacilityCameraData.Fields>(ref strCondition, dicConditions, FacilityCameraData.GetFieldName, FacilityCameraData.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(FacilityCameraData.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


	}
}
