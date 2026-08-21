using System.Collections.Generic;
using VDS.Model.Account;

namespace VDS.BLL.Models.Response
{
    public class ResponseOption : MessageResult
    {
        private List<Option> m_options = null;

        public List<Option> Options
        {
            get { return m_options; }
            set { m_options = value; }
        }

        public ResponseOption()
            : base()
        {
        }

        public ResponseOption(bool success, string message)
            : base(success, message)
        {
        }
    }
}
