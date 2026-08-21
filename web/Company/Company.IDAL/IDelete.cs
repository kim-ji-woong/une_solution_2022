using Company.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace Company.IDAL
{
    public interface IDelete
    {
        bool DeleteCompanyBoard(string strPlantPrcsID, out string strErrorMessage);
        bool DeleteCompanyBoard(Dictionary<CompanyBoard.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

    }
}
