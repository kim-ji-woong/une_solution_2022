using Nipa.Model.Account;
using Nipa.Model.Sop.Team;
using System.Collections.Generic;
using dnsDapperDBUtil;

namespace Nipa.BLL.Models
{
    public class ApplicationUser
    {
        private int m_nID = -1;
        private int m_nLevelID = -1;
        private string m_strUserID = "";
        private string m_strName = "";
        private string m_strSessionKey = "";
        private object m_options = new object();
        private Level m_userLevel = null;
        private int m_nSiteID = -1;

        public int ID
        {
            get { return m_nID; }
            set { m_nID = value; }
        }

        public int LevelID
        {
            get { return m_nLevelID; }
            set { m_nLevelID = value; }
        }

        public string UserID
        {
            get { return m_strUserID; }
            set { m_strUserID = value; }
        }

        public string Name
        {
            get { return m_strName; }
            set { m_strName = value; }
        }

        public string SessionKey
        {
            get { return m_strSessionKey; }
            set { m_strSessionKey = value; }
        }

        public object Options
        {
            get { return m_options; }
            set { m_options = value; }
        }

        public Level UserLevel
        {
            get { return m_userLevel; }
            set { m_userLevel = value; }
        }

        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }

        public static ApplicationUser MakeUser(User user, Level level, RegularMember member, string strSessionKey)
        {
            ApplicationUser appUser = new ApplicationUser();
            appUser.ID = user.ID;
            appUser.LevelID = user.UserLevel;
            appUser.UserID = user.UserID;
            appUser.Name = member != null ? member.MemberName : user.NickName;
            appUser.SessionKey = strSessionKey;
            appUser.UserLevel = level;
            appUser.SiteID = user.SiteID;

            return appUser;
        }
    }

    public class UserEx
    {
        private RegularMemberEx m_member = null;

        public int ID { get; set; }
        public int MemberID { get; set; }
        public int UserLevel { get; set; }
        public string UserID { get; set; }
        public string NickName { get; set; }
        public int SiteID { get; set; }

        public RegularMemberEx RegularMember
        {
            get { return m_member; }
            set { m_member = value; }
        }

        public static UserEx MakeUser(User user, Regular regular, RegularMember member)
        {
            UserEx userEx = new UserEx();

            userEx.ID = user.ID;
            userEx.MemberID = user.MemberID == null ? -1 : (int)user.MemberID;
            userEx.UserLevel = user.UserLevel;
            userEx.UserID = user.UserID;
            userEx.NickName = user.NickName;
            userEx.SiteID = user.SiteID;
            userEx.RegularMember = new RegularMemberEx(member, regular);

            return userEx;
        }
    }

    public class UpdateUserData
    {
        private int m_nID = -1;
        private string m_strUserID = "";
        private int m_nLevelID = -1;

        public int ID
        {
            get { return m_nID; }
            set { m_nID = value; }
        }

        public string UserID
        {
            get { return m_strUserID; }
            set { m_strUserID = value; }
        }

        public int LevelID
        {
            get { return m_nLevelID; }
            set { m_nLevelID = value; }
        }
    }

    public class RegularTeam : Regular
    {
        private List<RegularMemberEx> m_members = new List<RegularMemberEx>();

        public List<RegularMemberEx> Members
        {
            get { return m_members; }
            set { m_members = value; }
        }

        public RegularTeam()
        {
        }

        public RegularTeam(Regular team)
        {
            this.ID = team.ID;
            this.ParentTeamID = team.ParentTeamID;
            this.SiteID = team.SiteID;
            this.TeamName = team.TeamName;
        }
    }

    public class RegularMemberEx : RegularMember
    {
        private string m_jobLevel = "";
        private string m_jobPosition = "";
        private string m_strTeamName = "";

        public string JobLevel
        {
            get { return m_jobLevel; }
            set { m_jobLevel = value; }
        }

        public string JobPosition
        {
            get { return m_jobPosition; }
            set { m_jobPosition = value; }
        }

        public string RegularTeamName
        {
            get { return m_strTeamName; }
            set { m_strTeamName = value; }
        }

        public RegularMemberEx()
        {
        }

        public RegularMemberEx(RegularMember member, Regular team)
        {
            this.Email = member.Email;
            this.ID = member.ID;
            this.JobLevelID = member.JobLevelID;
            this.JobPositionID = member.JobPositionID;
            this.MemberID = member.MemberID;
            this.MemberName = member.MemberName;
            this.OfficePhoneNumber = member.OfficePhoneNumber;

            if (member.PhoneNumber != null && member.PhoneNumber.Length > 0)
                this.PhoneNumber = AES256Cipher.AES_decrypt(member.PhoneNumber);

            this.RegularID = member.RegularID;

            if (team != null)
                this.RegularTeamName = team.TeamName;

            this.StatusID = member.StatusID;
        }
    }
}
