using Company.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace Company.IDAL
{
    public interface IUpdate
    {
        bool UpdateCompanyBoard(CompanyBoard currentWorkPermit, out string strErrorMessage);
        bool UpdateCompanyBoard(Dictionary<CompanyBoard.Fields, object> dicSets, Dictionary<CompanyBoard.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
    }
}
