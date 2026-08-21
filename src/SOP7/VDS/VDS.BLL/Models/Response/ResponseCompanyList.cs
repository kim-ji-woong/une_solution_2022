using System;
using System.Collections.Generic;
using VDS.Model;

namespace VDS.BLL.Models.Response
{
    public class ResponseCompanyList : MessageResult
    {
        private List<Company> m_companies = new List<Company>();

        public List<Company> Companies
        {
            get { return m_companies; }
            set { m_companies = value; }
        }

        public ResponseCompanyList()
            : base()
        {
        }

        public ResponseCompanyList(bool success, string message)
            : base(success, message)
        {
        }
    }
}
