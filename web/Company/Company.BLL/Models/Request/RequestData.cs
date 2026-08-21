using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;


namespace Company.BLL.Models.Requset
{
    public class RequestData
    {
        private bool? m_requestCompanyBoard = null;

       public bool? RequestCompanyBoard
        {
            get { return m_requestCompanyBoard; }
            set { m_requestCompanyBoard = value; }
        }
    }
}