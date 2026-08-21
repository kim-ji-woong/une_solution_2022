using dnsDBUtil;
using System;
using System.Collections.Generic;
using System.Text;
using Wonik.IDAL;
using Wonik.Model;

namespace Wonik.DAL
{
    public class DeleteManager : QueryManager, IDelete
    {
        private DataManager m_dataManager = null;
        //private WebDBManager m_dbManager = null;

        public DeleteManager(DataManager dataManager)
        {
            m_dataManager = dataManager;
            m_dbManager = m_dataManager.GetDBManager() as DirectDBManager;
        }        

        public bool DeleteVehicleSpeedDetection(int id, out string strErrorMessage)
        {
            return DeleteFromID(VehicleSpeedDetection.TableName, id, out strErrorMessage);
        }

        public bool DeleteVehicleSpeedDetection(Dictionary<VehicleSpeedDetection.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
        {
            strErrorMessage = null;
            string strCondition = "";

            if (SetCondition<VehicleSpeedDetection.Fields>(ref strCondition, dicConditions, VehicleSpeedDetection.GetFieldName, VehicleSpeedDetection.TableName, ref strErrorMessage) == false)
                return false;

            return DeleteFromCondition(VehicleSpeedDetection.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
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
    }
}
