using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BAM_API.Data
{
    public class ResponseAPIData : MessageResult
    {
        public string BamData { get; set; }
    }  

    public class MessageResult : Result
    {
        private string m_strMessage = "";

        public string Message
        {
            get { return m_strMessage; }
            set { m_strMessage = value; }
        }

        public MessageResult()
        {
        }

        public MessageResult(bool success, string strMessage)
        {
            Success = success;
            m_strMessage = strMessage;
        }
    }

    public class Result
    {
        private bool m_result = false;

        public bool Success
        {
            get { return m_result; }
            set { m_result = value; }
        }
    }
}
