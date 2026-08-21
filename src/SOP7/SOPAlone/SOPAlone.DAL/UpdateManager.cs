using dnsDBUtil;
using SOPAlone.IDAL;
using System;
using System.Collections.Generic;
using System.Text;

namespace SOPAlone.DAL
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
    }
}
