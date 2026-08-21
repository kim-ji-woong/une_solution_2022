using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Company.BLL.Models.Response;
using Company.IDAL;
using Company.Model;

namespace Company.BLL
{
    public class LoadManager 
    {
        private IDataManager m_dataManager = null;
        private ProcessManager m_processManager = null;

        public LoadManager(IDataManager dataManager, ProcessManager processManager)
        {
            this.m_dataManager = dataManager;
            this.m_processManager = processManager;
        }

        public ResponseCompanyBoard GetCompanyBoards()
        {
            ResponseCompanyBoard result = new ResponseCompanyBoard();

            Dictionary<CompanyBoard.Fields, object> dicConditions = new Dictionary<CompanyBoard.Fields, object>();
            string strAdditionalConditions = null;
            string strErrorMessage = null;

            List<CompanyBoard> companyBoards = m_dataManager.GetSelectManager().SelectCompanyBoards(dicConditions, strAdditionalConditions, out strErrorMessage);

            if (companyBoards == null)
            {
                result.Success = false;
                result.Message = strErrorMessage;
                return result;
            }

            result.Success = true;
            result.CompanyBoards = companyBoards;
            return result;
        }
    }
}