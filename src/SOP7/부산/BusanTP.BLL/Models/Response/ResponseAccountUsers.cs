using System.Collections.Generic;
using SOPManager.BLL.Models;

namespace BusanTP.BLL.Models.Response
{
    public class ResponseAccountUsers : MessageResult
    {
        private List<AccountUser> m_accountUsers = null;
        
        public List<AccountUser> AccountUsers
        {
            get { return m_accountUsers; }
            set { m_accountUsers = value; }
        }
        
        public ResponseAccountUsers()
            : base()
        {
        }
        
        public ResponseAccountUsers(bool success, string message)
            : base(success, message)
        {
        }
    }
}