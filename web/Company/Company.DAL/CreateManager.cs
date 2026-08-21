using System;

namespace Company.DAL
{
    using Company.Model;
    using dnsDBUtil;
    using IDAL;
    using System.Collections;
    using System.Collections.Generic;

    public class CreateManager : QueryManager, ICreate
    {
        private string m_strErrorMessage = null;
        private DataManager m_dataManager = null;

        public CreateManager(DataManager dataManager)
        {
            m_dataManager = dataManager;
            m_dbManager = m_dataManager.GetDBManager() as WebDBManager;
        }

        public string GetErrorMessage()
        {
            return m_strErrorMessage;
        }

        public CompanyBoard CreateCompanyBoard(int nBoardNum, string nBoardTitle, string nBoardContent, string nBoardDate, string nBoardPeople)
        {
            Dictionary<CompanyBoard.Fields, object> dicFieldDatas = new Dictionary<CompanyBoard.Fields, object>();
            dicFieldDatas[CompanyBoard.Fields.boardNum] = nBoardNum;
            dicFieldDatas[CompanyBoard.Fields.boardTitle] = nBoardTitle;
            dicFieldDatas[CompanyBoard.Fields.boardContent] = nBoardContent;
            dicFieldDatas[CompanyBoard.Fields.boardDate] = nBoardDate;
            dicFieldDatas[CompanyBoard.Fields.boardPeople] = nBoardPeople;

            string strSQL = string.Format("Insert into {0} ({1}) values ({2})",
                CompanyBoard.TableName,
                GetFieldNames<CompanyBoard.Fields>(),
                GetFieldValues(dicFieldDatas));

            ArrayList arrResult = m_dbManager.GetResultData(strSQL);

            if (arrResult != null)
            {
                CompanyBoard data = new CompanyBoard();
                data.boardNum = nBoardNum;
                data.boardTitle = nBoardTitle;
                data.boardContent = nBoardContent;
                data.boardDate = nBoardDate;
                data.boardPeople = nBoardPeople;

                return data;
                /*string strErrorMessage;
                List<CurrentWorkPermit> currents = m_dataManager.GetSelectManager().SelectCurrentWorkPermits(dicFieldDatas, null, out strErrorMessage);

                if (currents == null || currents.Count == 0)
                {
                    m_strErrorMessage = strErrorMessage;
                    return null;
                }

                return currents[0];*/
            }
            else
            {
                m_strErrorMessage = m_dbManager.LastErrorMessage;
            }

            return null;
        }
    }
}
