using System;
using System.Collections.Generic;
using VDS.Model;

namespace VDS.BLL.Models.Response
{
    public class ResponseCountries : MessageResult
    {
        private List<Nation> m_nations = new List<Nation>();

        public ResponseCountries()
            : base()
        {
        }

        public ResponseCountries(bool success, string message)
            : base(success, message)
        {
        }

        public List<Nation> Nations
        {
            get { return m_nations; }
            set { m_nations = value; }
        }
    }
}
