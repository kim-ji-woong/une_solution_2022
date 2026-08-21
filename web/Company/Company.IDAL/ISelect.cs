using Company.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;


namespace Company.IDAL
{
    public interface ISelect 
    {
        CompanyBoard SelectCompanyBoard(string strPlantPrcsID, out string strErrorMessage);

        List<CompanyBoard> SelectCompanyBoards(Dictionary<CompanyBoard.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

        List<CompanyBoard> SelectCompanyBoards(Dictionary<CompanyBoard.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);
    }
}