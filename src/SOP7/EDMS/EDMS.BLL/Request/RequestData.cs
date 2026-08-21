using System;
using System.Collections.Generic;
using System.Text;

namespace EDMS.BLL.Request
{
    public class RequestData
    {
        private bool? m_requestFacilities = null;

        public bool? RequestFacilities
        {
            get { return m_requestFacilities; }
            set { m_requestFacilities = value; }
        }
    }
}
