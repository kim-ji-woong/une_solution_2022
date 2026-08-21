using System;
using System.Collections.Generic;
using Nipa.Model.Sop.Team;

namespace Nipa.BLL.Models.Response
{
    public class ResponseTeamList : MessageResult
    {
        private List<Regular> m_teams = new List<Regular>();

        public List<Regular> Teams
        {
            get { return m_teams; }
            set { m_teams = value; }
        }

        public ResponseTeamList()
            : base()
        {
        }

        public ResponseTeamList(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseTeamMemberList : MessageResult
    {
        private List<RegularMemberEx> m_members = new List<RegularMemberEx>();

        public List<RegularMemberEx> Members
        {
            get { return m_members; }
            set { m_members = value; }
        }

        public ResponseTeamMemberList()
            : base()
        {
        }

        public ResponseTeamMemberList(bool success, string message)
            : base(success, message)
        {
        }
    }
}
