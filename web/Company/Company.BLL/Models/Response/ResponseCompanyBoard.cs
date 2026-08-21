using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Company.Model;


namespace Company.BLL.Models.Response
{
    public class ResponseCompanyBoard : MessageResult
    {
        private List<CompanyBoard> m_companyBoards = null;

        public List<CompanyBoard> CompanyBoards
        {
            get { return m_companyBoards; }
            set { m_companyBoards = value; }
        }
    }
}