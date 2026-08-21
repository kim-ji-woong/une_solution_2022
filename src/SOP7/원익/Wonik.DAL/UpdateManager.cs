using dnsDBUtil;
using System;
using System.Collections.Generic;
using System.Text;
using Wonik.IDAL;
using Wonik.Model;

namespace Wonik.DAL
{
    public class UpdateManager : QueryManager, IUpdate
    {
        private DataManager m_dataManager = null;
        //private WebDBManager m_dbManager = null;

        public UpdateManager(DataManager dataManager)
        {
            m_dataManager = dataManager;
            m_dbManager = m_dataManager.GetDBManager() as DirectDBManager;
        }

        public bool UpdateVehicleSpeedDetection(VehicleSpeedDetection obj, out string strErrorMessage)
        {
            Dictionary<VehicleSpeedDetection.Fields, object> dicSets = new Dictionary<VehicleSpeedDetection.Fields, object>();
            dicSets[VehicleSpeedDetection.Fields.DetectionTime] = obj.DetectionTime;
            dicSets[VehicleSpeedDetection.Fields.SensorID] = obj.SensorID;
            dicSets[VehicleSpeedDetection.Fields.Speed] = obj.Speed;

            Dictionary<VehicleSpeedDetection.Fields, object> dicConditions = new Dictionary<VehicleSpeedDetection.Fields, object>();
            dicConditions[VehicleSpeedDetection.Fields.ID] = obj.ID;

            return UpdateVehicleSpeedDetection(dicSets, dicConditions, null, out strErrorMessage);
        }

        public bool UpdateVehicleSpeedDetection(Dictionary<VehicleSpeedDetection.Fields, object> dicSets, Dictionary<VehicleSpeedDetection.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
        {
            strErrorMessage = null;
            string strCondition = "";
            string strSets = "";

            if (SetData<VehicleSpeedDetection.Fields>(ref strSets, dicSets, VehicleSpeedDetection.GetFieldName, VehicleSpeedDetection.TableName, ref strErrorMessage) == false)
                return false;
            if (SetCondition<VehicleSpeedDetection.Fields>(ref strCondition, dicConditions, VehicleSpeedDetection.GetFieldName, VehicleSpeedDetection.TableName, ref strErrorMessage) == false)
                return false;

            return UpdateFromCondition(VehicleSpeedDetection.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
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
    }
}
