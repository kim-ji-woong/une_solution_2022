using System;

namespace Company.DAL
{
    using Company.Model;
    using dnsDBUtil;
    using IDAL;
    using System.Collections;
    using System.Collections.Generic;

    public class SelectManager : QueryManager, ISelect
    {
        private DataManager m_dataManager = null;

        public SelectManager(DataManager dataManager)
        {
            m_dataManager = dataManager;
            m_dbManager = m_dataManager.GetDBManager() as WebDBManager;
        }

        public CompanyBoard SelectCompanyBoard(string strPlantPrcsID, out string strErrorMessage)
        {
            strErrorMessage = null;
            int nFieldCount;
            bool isNullable;

            string strSQL = string.Format("select {0} from {1} where {2} = {3}", GetFieldNames<CompanyBoard.Fields>(out nFieldCount), CompanyBoard.TableName, CompanyBoard.GetFieldName(CompanyBoard.Fields.boardNum, out isNullable), strPlantPrcsID);
            ArrayList arrResult = m_dbManager.GetResultData(strSQL);

            if (arrResult != null && arrResult.Count >= nFieldCount)
            {
                CompanyBoard model = ReadCompanyBoard(arrResult, 0, out strErrorMessage);

                if (model == null)
                    return null;

                return model;
            }
            else
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
            }

            return null;
        }

        public List<CompanyBoard> SelectCompanyBoards(Dictionary<CompanyBoard.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
        {
            return SelectCompanyBoards(dicConditions, strAdditionalConditions, null, out strErrorMessage);
        }

        public List<CompanyBoard> SelectCompanyBoards(Dictionary<CompanyBoard.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
        {
            strErrorMessage = null;
            int nFieldCount;

            string strSQL = string.Format("select {0} from {1}", GetFieldNames<CompanyBoard.Fields>(out nFieldCount), CompanyBoard.TableName);

            string strCondition = "";

            if (SetCondition<CompanyBoard.Fields>(ref strCondition, dicConditions, CompanyBoard.GetFieldName, CompanyBoard.TableName, ref strErrorMessage) == false)
                return null;

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strCondition.Length > 0)
                    strCondition += " and " + strAdditionalConditions;
                else
                    strCondition = strAdditionalConditions;
            }

            if (strCondition.Length > 0)
            {
                if (strCondition.Trim().ToLower().StartsWith("order by"))
                    strSQL += " " + strCondition;
                else
                    strSQL += " where " + strCondition;
            }

            ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

            if (arrResult == null)
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
                return null;
            }

            int nResultCount = arrResult.Count;
            List<CompanyBoard> CompanyBoards = new List<CompanyBoard>();

            for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
            {
                CompanyBoard model = ReadCompanyBoard(arrResult, i, out strErrorMessage);

                if (model == null)
                    return null;
                else
                    CompanyBoards.Add(model);
            }
            return CompanyBoards;
        }


        private CompanyBoard ReadCompanyBoard(ArrayList arrResult, int index, out string strErrorMessage)
        {
            strErrorMessage = null;
            CompanyBoard model = new CompanyBoard();
            bool isNullable;

            foreach (CompanyBoard.Fields field in CompanyBoard.Fields.GetValues(typeof(CompanyBoard.Fields)))
            { 
                string strFieldName = CompanyBoard.GetFieldName(field, out isNullable);

                if (field == CompanyBoard.Fields.boardNum)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.boardNum = data.Data;
                    }
                }
                else if (field == CompanyBoard.Fields.boardTitle)
                {
                    string str = WebDBManager.GetStringField(arrResult[index]);

                    if (str == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.boardTitle = str;
                    }
                }
                else if (field == CompanyBoard.Fields.boardContent)
                {
                    //VariousData<string> data = WebDBManager.GetStringField(arrResult[index]);
                    string str = WebDBManager.GetStringField(arrResult[index]);

                    if (str == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.boardContent = str;
                    }
                }
                else if (field == CompanyBoard.Fields.boardDate)
                {
                    //VariousData<string> data = WebDBManager.GetStringField(arrResult[index]);
                    string str = WebDBManager.GetStringField(arrResult[index]);

                    if (str == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.boardDate = str;
                    }
                }
                else if (field == CompanyBoard.Fields.boardPeople)
                {
                    string str = WebDBManager.GetStringField(arrResult[index]);

                    if (str == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.boardPeople = str;
                    }
                }

                index++;
            }

            return model;
        }
    }

}