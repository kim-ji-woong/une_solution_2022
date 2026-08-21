using System;
using System.Collections;
using System.Collections.Generic;
using dnsDBUtil;
using SensorServer.IDAL;
using SensorServer.Model.Yeosu;
using SensorServer.Model.Yeosu.External;
using SensorServer.Model.Yeosu.Option;
using SensorServer.Model.Yeosu.Public;

namespace SensorServer.DAL
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
                Logger.Instance.Write("[Error] DeleteFromCondition : " + strSQL + "----" + strErrorMessage);
                return false;
			}

			strErrorMessage = null;
			return true;
		}

		public bool DeleteMaterialLink(Dictionary<MaterialLink.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<MaterialLink.Fields>(ref strCondition, dicConditions, MaterialLink.GetFieldName, MaterialLink.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(MaterialLink.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool DeleteSensorLink(int serviceID, int regionID, int groupID, int nodeID, out string strErrorMessage)
		{
			Dictionary<SensorLink.Fields, object> dicConditions = new Dictionary<SensorLink.Fields, object>();
			dicConditions[SensorLink.Fields.ServiceID] = serviceID;
			dicConditions[SensorLink.Fields.RegionID] = regionID;
			dicConditions[SensorLink.Fields.GroupID] = groupID;
			dicConditions[SensorLink.Fields.NodeID] = nodeID;

			return DeleteSensorLink(dicConditions, null, out strErrorMessage);
		}

		public bool DeleteSensorLink(Dictionary<SensorLink.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<SensorLink.Fields>(ref strCondition, dicConditions, SensorLink.GetFieldName, SensorLink.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(SensorLink.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool DeleteEtcSensorDataHistory(int sensorID, DateTime timeStamp, out string strErrorMessage)
		{
			Dictionary<EtcSensorDataHistory.Fields, object> dicConditions = new Dictionary<EtcSensorDataHistory.Fields, object>();
			dicConditions[EtcSensorDataHistory.Fields.SensorID] = sensorID;
			dicConditions[EtcSensorDataHistory.Fields.TimeStamp] = timeStamp;

			return DeleteEtcSensorDataHistory(dicConditions, null, out strErrorMessage);
		}

		public bool DeleteEtcSensorDataHistory(Dictionary<EtcSensorDataHistory.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<EtcSensorDataHistory.Fields>(ref strCondition, dicConditions, EtcSensorDataHistory.GetFieldName, EtcSensorDataHistory.TableName, ref strErrorMessage) == false)
				return false;

			return DeleteFromCondition(EtcSensorDataHistory.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}

        public bool DeleteEtcSensorData(int sensorID, DateTime timeStamp, out string strErrorMessage)
        {
            Dictionary<EtcSensorData.Fields, object> dicConditions = new Dictionary<EtcSensorData.Fields, object>();
            dicConditions[EtcSensorData.Fields.SensorID] = sensorID;

            return DeleteEtcSensorData(dicConditions, null, out strErrorMessage);
        }

        public bool DeleteEtcSensorData(Dictionary<EtcSensorData.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
        {
            strErrorMessage = null;
            string strCondition = "";

            if (SetCondition<EtcSensorData.Fields>(ref strCondition, dicConditions, EtcSensorData.GetFieldName, EtcSensorData.TableName, ref strErrorMessage) == false)
                return false;

            return DeleteFromCondition(EtcSensorData.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
        }

		public bool DeleteAirNode(int nodeID, out string strErrorMessage) {

			Dictionary<AirNode.Fields, object> dicConditions = new Dictionary<AirNode.Fields, object>();
			dicConditions[AirNode.Fields.ID] = nodeID;

			return DeleteAirNode(dicConditions, null, out strErrorMessage);
		}

		public bool DeleteAirNode(Dictionary<AirNode.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if(SetCondition<AirNode.Fields>(ref strCondition, dicConditions, AirNode.GetFieldName, AirNode.TableName, ref strErrorMessage) == false) 
				return false;
			return DeleteFromCondition(AirNode.TableName, strCondition, strAdditionalConditions, out strErrorMessage) ;
		}

		public bool DeleteAirDataHistory(int siteID, out string strErrorMessage)
		{
			Dictionary<AirDataHistory.Fields, object> dicConditions = new Dictionary<AirDataHistory.Fields, object>();
			dicConditions[AirDataHistory.Fields.SiteID] = siteID;

			return DeleteAirDataHistory(dicConditions, null, out strErrorMessage);
		}

		public bool DeleteAirDataHistory(Dictionary<AirDataHistory.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";

			if (SetCondition<AirDataHistory.Fields>(ref strCondition, dicConditions, AirDataHistory.GetFieldName, AirDataHistory.TableName, ref strErrorMessage) == false)
				return false;
			return DeleteFromCondition(AirDataHistory.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool DeleteKmaAsos(int id, out string strErrorMessage)
		{
			Dictionary<KmaAsos.Fields, object> dicConditions = new Dictionary<KmaAsos.Fields, object>();
			dicConditions[KmaAsos.Fields.ID] = id;

			return DeleteKmaAsos(dicConditions, null, out strErrorMessage);
		}
		public bool DeleteKmaAsos(Dictionary<KmaAsos.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage= null;
			string strCondition = "";

			if (SetCondition<KmaAsos.Fields>(ref strCondition, dicConditions, KmaAsos.GetFieldName, KmaAsos.TableName, ref strErrorMessage) == false)
				return false;
			return DeleteFromCondition(KmaAsos.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
		}

        public bool DeleteCleanSYS(string measureDt, out string strErrorMessage)
        {
            Dictionary<CleanSYS.Fields, object> dicConditions = new Dictionary<CleanSYS.Fields, object>();
            dicConditions[CleanSYS.Fields.MeasureDT] = measureDt;

            return DeleteCleanSYSs(dicConditions, null, out strErrorMessage);
        }
        public bool DeleteCleanSYSs(Dictionary<CleanSYS.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
        {
            strErrorMessage = null;
            string strCondition = "";

            if (SetCondition<CleanSYS.Fields>(ref strCondition, dicConditions, CleanSYS.GetFieldName, CleanSYS.TableName, ref strErrorMessage) == false)
                return false;
            return DeleteFromCondition(CleanSYS.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
        }

        public bool DeleteYeosuOptionSDMS(int ID, out string strErrorMessage)
        {
            Dictionary<OptionSDMS.Fields, object> dicConditions = new Dictionary<OptionSDMS.Fields, object>();
            dicConditions[OptionSDMS.Fields.ID] = ID;

            return DeleteYeosuOptionSDMS(dicConditions, null, out strErrorMessage);
        }
        public bool DeleteYeosuOptionSDMS(Dictionary<OptionSDMS.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
        {
            strErrorMessage = null;
            string strCondition = "";

            if (SetCondition<OptionSDMS.Fields>(ref strCondition, dicConditions, OptionSDMS.GetFieldName, OptionSDMS.TableName, ref strErrorMessage) == false)
                return false;
            return DeleteFromCondition(OptionSDMS.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
        }
    }
}
