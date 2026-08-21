using System.Collections.Generic;
using SOPManager.Model.Sop.Account;

namespace SOPManager.BLL.Models.Response
{
    public class ResponseNewUser : MessageResult
    {
        private User m_user = null;

        public User User
        {
            get { return m_user; }
            set { m_user = value; }
        }

        public ResponseNewUser()
            : base()
        {
        }

        public ResponseNewUser(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseNewUsers : MessageResult
    {
        private List<User> m_users = new List<User>();

        public List<User> Users
        {
            get { return m_users; }
            set { m_users = value; }
        }

        public ResponseNewUsers()
            : base()
        {
        }

        public ResponseNewUsers(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseSSOLogin : MessageResult
    {
        // 로그인 성공 시 필요한 정보 필요
        private ApplicationUser m_user = null;

        public ApplicationUser User
        {
            get { return m_user; }
            set { m_user = value; }
        }

        public ResponseSSOLogin()
            : base()
        {
        }

        public ResponseSSOLogin(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseSSOUrl : MessageResult
    {
        // SSO URL 리턴
        public string URL { get; set; }

        public ResponseSSOUrl()
            : base()
        {
        }

        public ResponseSSOUrl(bool success, string message)
            : base(success, message)
        {
        }
    }
}
