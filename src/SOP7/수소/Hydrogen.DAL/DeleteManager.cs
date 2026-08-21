using dnsDBUtil;
using Hydrogen.IDAL;
using Hydrogen.Model.Anomaly;
using System;
using System.Collections.Generic;
using System.Text;

namespace Hydrogen.DAL
{
    public class DeleteManager : QueryManager, IDelete
    {
        private DataManager m_dataManager = null;

        public DeleteManager(DataManager dataManager)
        {
            m_dataManager = dataManager;
            m_dbManager = m_dataManager.GetDBManager() as DirectDBManager;
        }

        public bool DeleteAnomalyDetection(int id, out string strErrorMessage)
        {
            return DeleteFromID(AnomalyDetection.TableName, id, out strErrorMessage);
        }

        public bool DeleteAnomalyDetection(Dictionary<AnomalyDetection.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
        {
            strErrorMessage = null;
            string strCondition = "";

            if (SetCondition<AnomalyDetection.Fields>(ref strCondition, dicConditions, AnomalyDetection.GetFieldName, AnomalyDetection.TableName, ref strErrorMessage) == false)
                return false;

            return DeleteFromCondition(AnomalyDetection.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
        }

        public bool DeleteAnomalyDetectionDetail(int id, out string strErrorMessage)
        {
            return DeleteFromID(AnomalyDetectionDetail.TableName, id, out strErrorMessage);
        }

        public bool DeleteAnomalyDetectionDetail(Dictionary<AnomalyDetectionDetail.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
        {
            strErrorMessage = null;
            string strCondition = "";

            if (SetCondition<AnomalyDetectionDetail.Fields>(ref strCondition, dicConditions, AnomalyDetectionDetail.GetFieldName, AnomalyDetectionDetail.TableName, ref strErrorMessage) == false)
                return false;

            return DeleteFromCondition(AnomalyDetectionDetail.TableName, strCondition, strAdditionalConditions, out strErrorMessage);
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
