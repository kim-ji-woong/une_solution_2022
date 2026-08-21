using System;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Nipa.Model.Sop.Team;

namespace Nipa.BLL
{
    using Models;
    using Models.Response;

    public class TeamManager
    {
        private IDataManager m_dataManager = null;

        public TeamManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseTeamList GetTeamList(int siteID)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1}", Regular.Fields.SiteID, siteID);
            IEnumerable<Regular> teams = m_dataManager.GetSelect().Select<Regular>(strCondition, out strErrorMessage);

            if (teams == null)
                return new ResponseTeamList(false, strErrorMessage);

            ResponseTeamList result = new ResponseTeamList(true, "");
            result.Teams.AddRange(teams);
            return result;
        }

        public ResponseTeamMemberList GetTeamMemberList(int teamID)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1}", RegularMember.Fields.RegularID, teamID);
            IEnumerable<RegularMember> members = m_dataManager.GetSelect().Select<RegularMember>(strCondition, out strErrorMessage);

            if (members == null)
                return new ResponseTeamMemberList(false, strErrorMessage);

            IEnumerable<Options> options = m_dataManager.GetSelect().Select<Options>(null, out strErrorMessage);

            if (options == null)
                return new ResponseTeamMemberList(false, strErrorMessage);

            Dictionary<int, string> dicJobLevels = new Dictionary<int, string>();
            Dictionary<int, string> dicJobPositions = new Dictionary<int, string>();

            string strJobLevel = "joblevel";
            string strJobPosition = "jobposition";

            foreach (Options option in options)
            {
                if (option.PropertyName.ToLower() == strJobLevel)
                    dicJobLevels[option.PropertyID] = option.PropertyValue;
                else if (option.PropertyName.ToLower() == strJobPosition)
                    dicJobPositions[option.PropertyID] = option.PropertyValue;
            }

            string strJobLevelName, strJobLevelPositionName;
            ResponseTeamMemberList result = new ResponseTeamMemberList(true, "");

            foreach (RegularMember member in members)
            {
                /*if (member.PhoneNumber != null)
                    member.PhoneNumber = dnsDapperDBUtil.AES256Cipher.AES_decrypt(member.PhoneNumber);*/

                RegularMemberEx _member = new RegularMemberEx(member, null);

                if (member.JobLevelID != null && dicJobLevels.TryGetValue((int)member.JobLevelID, out strJobLevelName))
                    _member.JobLevel = strJobLevelName;

                if (member.JobPositionID != null && dicJobPositions.TryGetValue((int)member.JobPositionID, out strJobLevelPositionName))
                    _member.JobPosition = strJobLevelPositionName;

                result.Members.Add(_member);
            }

            return result;
        }
    }
}
