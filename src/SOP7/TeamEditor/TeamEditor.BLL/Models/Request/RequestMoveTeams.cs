using System.Collections.Generic;

namespace TeamEditor.BLL.Models.Request
{
    public class RequestMoveTeams
    {
        private List<int> m_regularTeamIDs = new List<int>();
        private List<int> m_temporaryTeamIDs = new List<int>();
        private int? m_targetRegularParentTeamID = null;
        private int? m_targetTemporaryParentTeamID = null;

        public List<int> RegularTeamIDs
        {
            get { return m_regularTeamIDs; }
            set { m_regularTeamIDs = value; }
        }

        public List<int> TemporaryTeamIDs
        {
            get { return m_temporaryTeamIDs; }
            set { m_temporaryTeamIDs = value; }
        }

        public int? TargetRegularParentTeamID
        {
            get { return m_targetRegularParentTeamID; }
            set { m_targetRegularParentTeamID = value; }
        }

        public int? TargetTemporaryParentTeamID
        {
            get { return m_targetTemporaryParentTeamID; }
            set { m_targetTemporaryParentTeamID = value; }
        }
    }
}
