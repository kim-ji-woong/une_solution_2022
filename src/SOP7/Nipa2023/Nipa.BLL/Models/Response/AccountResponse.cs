using System.Collections.Generic;
using Nipa.Model.Account;

namespace Nipa.BLL.Models.Response
{
    public class LoginResult : MessageResult
    {
        public enum LoginState { Login = 0, Logout, False, Disconnected, LicenseWait, LicenseExpired, LicenseAlert, LicenseInvalid }

        private ApplicationUser m_user = null;
        private int m_nLoginState = (int)LoginState.False;

        public ApplicationUser User
        {
            get { return m_user; }
            set { m_user = value; }
        }

        public int State
        {
            get { return m_nLoginState; }
            set { m_nLoginState = value; }
        }

        public LoginResult()
            : base()
        {
        }

        public LoginResult(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseLoginKey : MessageResult
    {
        private string m_strLoginKey = "";
        private string m_strSalt = "";
        private bool m_externalLogin = false;

        public string LoginKey
        {
            get { return m_strLoginKey; }
            set { m_strLoginKey = value; }
        }

        public string Salt
        {
            get { return m_strSalt; }
            set { m_strSalt = value; }
        }

        public bool ExternalLogin
        {
            get { return m_externalLogin; }
            set { m_externalLogin = value; }
        }
    }

    public class ResponseAutoLogin : MessageResult
    {
        private bool m_autoLogin = false;
        private int m_nSiteID = -1;

        public bool AutoLogin
        {
            get { return m_autoLogin; }
            set { m_autoLogin = value; }
        }

        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }

        public ResponseAutoLogin()
            : base()
        {
        }

        public ResponseAutoLogin(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseAccountOption : MessageResult
    {
        private List<Option> m_options = null;

        public List<Option> Options
        {
            get { return m_options; }
            set { m_options = value; }
        }

        public ResponseAccountOption()
            : base()
        {
        }

        public ResponseAccountOption(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseUserList : MessageResult
    {
        private List<UserEx> m_users = new List<UserEx>();

        public List<UserEx> Users
        {
            get { return m_users; }
            set { m_users = value; }
        }

        public ResponseUserList()
            : base()
        {
        }

        public ResponseUserList(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseUserLevelList : MessageResult
    {
        private List<Level> m_levels = new List<Level>();

        public List<Level> Levels
        {
            get { return m_levels; }
            set { m_levels = value; }
        }

        public ResponseUserLevelList()
            : base()
        {
        }

        public ResponseUserLevelList(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseOption : MessageResult
    {
        private List<Option> m_options = new List<Option>();

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

    public class ResponseRegularMemberList : MessageResult
    {
        private List<RegularTeam> m_teams = new List<RegularTeam>();

        public List<RegularTeam> Teams
        {
            get { return m_teams; }
            set { m_teams = value; }
        }

        public ResponseRegularMemberList()
            : base()
        {
        }

        public ResponseRegularMemberList(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseCreateUser : MessageResult
    {
        private UserEx m_user = null;

        public UserEx User
        {
            get { return m_user; }
            set { m_user = value; }
        }

        public ResponseCreateUser()
            : base()
        {
        }

        public ResponseCreateUser(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseWebSocketPort : MessageResult
    {
        private int m_nPort = -1;

        public int Port
        {
            get { return m_nPort; }
            set { m_nPort = value; }
        }

        public ResponseWebSocketPort()
            : base()
        {
        }

        public ResponseWebSocketPort(bool success, string message)
            : base(success, message)
        {
        }
    }
}
