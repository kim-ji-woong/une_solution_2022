using System.Collections.Generic;

namespace TeamEditor.BLL.Models.Request
{
    public class RequestMoveMembers
    {
        private List<int> m_regularMemberIDs = new List<int>();
        private List<int> m_temporaryMemberIDs = new List<int>();
        private int? m_targetRegularTeamID = null;
        private int? m_targetTemporaryTeamID = null;

        public List<int> RegularMemberIDs
        {
            get { return m_regularMemberIDs; }
            set { m_regularMemberIDs = value; }
        }

        public List<int> TemporaryMemberIDs
        {
            get { return m_temporaryMemberIDs; }
            set { m_temporaryMemberIDs = value; }
        }

        public int? TargetRegularTeamID
        {
            get { return m_targetRegularTeamID; }
            set { m_targetRegularTeamID = value; }
        }

        public int? TargetTemporaryTeamID
        {
            get { return m_targetTemporaryTeamID; }
            set { m_targetTemporaryTeamID = value; }
        }
    }
}
