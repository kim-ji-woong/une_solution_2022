using System;

namespace Company.DAL
{
    using Company.Model;
    using dnsDBUtil;
    using IDAL;
    using System.Collections.Generic;

    public class UpdateManager : QueryManager, IUpdate
    {
        private DataManager m_dataManager = null;

        public UpdateManager(DataManager dataManager)
        {
            m_dataManager = dataManager;
            m_dbManager = m_dataManager.GetDBManager() as WebDBManager;
        }

        public bool UpdateCompanyBoard(CompanyBoard companyBoard, out string strErrorMessage)
        {
            Dictionary<CompanyBoard.Fields, object> dicSets = new Dictionary<CompanyBoard.Fields, object>();
            dicSets[CompanyBoard.Fields.boardNum] = companyBoard.boardNum;
            dicSets[CompanyBoard.Fields.boardTitle] = companyBoard.boardTitle;
            dicSets[CompanyBoard.Fields.boardContent] = companyBoard.boardContent;
            dicSets[CompanyBoard.Fields.boardDate] = companyBoard.boardDate;
            dicSets[CompanyBoard.Fields.boardPeople] = companyBoard.boardPeople;

            Dictionary<CompanyBoard.Fields, object> dicConditions = new Dictionary<CompanyBoard.Fields, object>();
            dicConditions[CompanyBoard.Fields.boardNum] = companyBoard.boardNum;

            return UpdateCompanyBoard(dicSets, dicConditions, null, out strErrorMessage);
        }

        public bool UpdateCompanyBoard(Dictionary<CompanyBoard.Fields, object> dicSets, Dictionary<CompanyBoard.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
        {
            strErrorMessage = null;
            string strCondition = "";
            string strSets = "";

            if (SetData<CompanyBoard.Fields>(ref strSets, dicSets, CompanyBoard.GetFieldName, CompanyBoard.TableName, ref strErrorMessage) == false)
                return false;
            if (SetCondition<CompanyBoard.Fields>(ref strCondition, dicConditions, CompanyBoard.GetFieldName, CompanyBoard.TableName, ref strErrorMessage) == false)
                return false;

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strCondition.Length > 0)
                    strCondition += " and " + strAdditionalConditions;
                else
                    strCondition = strAdditionalConditions;
            }

            string strSQL = string.Format("Update {0} set {1} where {2}", CompanyBoard.TableName, strSets, strCondition);

            if (m_dbManager.GetResultData(strSQL) == null)
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
                return false;
            }

            return true;
        }
    }
}
