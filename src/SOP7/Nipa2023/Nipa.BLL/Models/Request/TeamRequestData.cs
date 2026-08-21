using System;
using System.Collections.Generic;
using System.Text;

namespace Nipa.BLL.Models.Request
{
    public class RequestTeamList
    {
        private int m_nSiteID = -1;

        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }
    }

    public class RequestTeamMemberList
    {
        private int m_nTeamID = -1;

        public int TeamID
        {
            get { return m_nTeamID; }
            set { m_nTeamID = value; }
        }
    }
}
