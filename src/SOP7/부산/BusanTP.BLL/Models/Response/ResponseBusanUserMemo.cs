using System.Collections.Generic;

namespace BusanTP.BLL.Models.Response
{
    public class ResponseBusanUserMemo : MessageResult
    {
        private List<BusanTP.Model.UserMemo> m_userMemos = new List<BusanTP.Model.UserMemo>();
        
        public List<BusanTP.Model.UserMemo> UserMemos
        {
            get { return m_userMemos; }
            set { m_userMemos = value; }
        }
        
        public ResponseBusanUserMemo() : base()
        {
        }
        
        public ResponseBusanUserMemo(bool success, string message) : base(success, message)
        {
        }
    }
}