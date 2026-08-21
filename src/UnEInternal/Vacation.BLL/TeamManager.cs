using System;
using System.Collections.Generic;
using System.Text;
using Vacation.BLL.Models.Teams;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Vacation.Model;
using Vacation.DAL;

namespace Vacation.BLL
{
    public class TeamManager
    {
        private IDataManager m_dataManager = null;
        private ProcessManager m_processManager = null;

        private static List<RegularTeam> m_regularTeam = null;
        /// <summary>
        /// 팀 리스트
        /// </summary>
        public static List<RegularTeam> RegularTeam
        {
            get { return m_regularTeam; }
            set { m_regularTeam = value; }
        }

        private static List<JobLevel> m_jobLevel = null;
        /// <summary>
        /// 직급 리스트
        /// </summary>
        public static List<JobLevel> JobLevel
        {
            get { return m_jobLevel; }
            set { m_jobLevel = value; }
        }

        private CreateManager m_createManager = null;

        public TeamManager(IDataManager dataManager, ProcessManager processManager)
        {
            m_dataManager = dataManager;
            m_processManager = processManager;
            m_createManager = new CreateManager(dataManager);
        }

        public List<CompanyMemberData> LoadCompanyMember(int nTeamID = -1)
        {
            List<CompanyMemberData> datas = new List<CompanyMemberData>();
            IEnumerable<CompanyMember> regularMembers;

            string strErrorMessage;
            if (nTeamID == -1)
                regularMembers = m_dataManager.GetSelect().Select<CompanyMember>(null, out strErrorMessage);
            else
            {
                string strCondition = string.Format("{0} = {1}", CompanyMember.Fields.TeamID, nTeamID);
                /*Dictionary<CompanyMember.Fields, object> dicConditions = new Dictionary<CompanyMember.Fields, object>();
                dicConditions.Add(CompanyMember.Fields.TeamID, nTeamID);*/

                regularMembers = m_dataManager.GetSelect().Select<CompanyMember>(strCondition, out strErrorMessage);
            }

            foreach (CompanyMember member in regularMembers)
            {
                CompanyMemberData data = new CompanyMemberData();
                data.CompanyMember = member;
                data.StartDate = member.StartDate.ToString("yyyy-MM-dd");

                // 팀
                foreach (RegularTeam team in m_regularTeam)
                {
                    if (member.TeamID == team.ID)
                    {
                        data.RegularTeam = team;
                        break;
                    }
                }

                // 직급
                if (m_jobLevel == null)
                {
                    IEnumerable<JobLevel> jobLevels = m_dataManager.GetSelect().Select<JobLevel>(null, out strErrorMessage);

                    if (jobLevels != null)
                    {
                        m_jobLevel = new List<JobLevel>();
                        m_jobLevel.AddRange(jobLevels);
                    }
                    else
                        return null;
                }
                
                foreach (JobLevel jobLevel in m_jobLevel)
                {
                    if (member.JobLevelID == jobLevel.ID)
                    {
                        data.JobLevel = jobLevel;
                        break;
                    }
                }

                datas.Add(data);
            }

            return datas;
        }

        public bool SaveMember(List<CompanyMemberData> data)
        {
            Dictionary<CompanyMember.Fields, object> dicUpdateColumn = new Dictionary<CompanyMember.Fields, object>();
            Dictionary<CompanyMember.Fields, object> dicCondition = new Dictionary<CompanyMember.Fields, object>();

            foreach (CompanyMemberData item in data)
            {
                if (item.CompanyMember.ID > 0)
                {
                    dicUpdateColumn.Clear();
                    dicUpdateColumn.Add(CompanyMember.Fields.Name, item.CompanyMember.Name);
                    dicUpdateColumn.Add(CompanyMember.Fields.PhoneNumber, item.CompanyMember.PhoneNumber);
                    //dicUpdateColumn.Add(CompanyMember.Fields.StartDate, item.CompanyMember.StartDate);
                    dicUpdateColumn.Add(CompanyMember.Fields.JobLevelID, item.JobLevel.ID);
                    dicUpdateColumn.Add(CompanyMember.Fields.IsTeamLeader, item.CompanyMember.IsTeamLeader);
                    dicUpdateColumn.Add(CompanyMember.Fields.IsAdmin, item.CompanyMember.IsAdmin);
                    //dicUpdateColumn.Add(CompanyMember.Fields.UserID, item.CompanyMember.UserID);

                    string strCondition = string.Format("{0} = {1}", CompanyMember.Fields.ID, item.CompanyMember.ID);
                    /*dicCondition.Clear();
                    dicCondition.Add(CompanyMember.Fields.ID, item.CompanyMember.ID);*/

                    string strErrorMessage;
                    m_dataManager.GetUpdate().Update<CompanyMember, CompanyMember.Fields>(dicUpdateColumn, strCondition, out strErrorMessage);
                }
                else // 신규 직원 추가
                {
                    CompanyMember member = new CompanyMember();
                    member.Name = item.CompanyMember.Name;
                    member.JobLevelID = item.JobLevel.ID;
                    member.StartDate = Convert.ToDateTime(item.StartDate);
                    member.TeamID = item.RegularTeam.ID;
                    member.IsTeamLeader = item.CompanyMember.IsTeamLeader;
                    member.IsAdmin = item.CompanyMember.IsAdmin;
                    member.UserID = item.CompanyMember.UserID;
                    member.UserPW = "";
                    member.PasswordCode = "";
                    member.PhoneNumber = item.CompanyMember.PhoneNumber;

                    string strErrorMessage;
                    int addID;
                    m_createManager.CreateCompanyMember(member, out addID, out strErrorMessage);
                }
            }

            return true;
        }

        public bool DeleteMember(List<CompanyMemberData> data)
        {
            foreach (CompanyMemberData item in data)
            {
                int nCompanyMemberID = item.CompanyMember.ID;
                if (nCompanyMemberID <= 0)
                    continue;

                string strErrorMessage;

                // FK 삭제
                // History
                string strCondition = string.Format("{0} = {1}", Vacation.Model.History.Fields.MemberID, nCompanyMemberID);
                /*Dictionary<History.Fields, object> dicManagerID = new Dictionary<History.Fields, object>();
                dicManagerID.Add(Vacation.Model.History.Fields.MemberID, nCompanyMemberID);*/
                m_dataManager.GetDelete().Delete<History>(strCondition, out strErrorMessage);

                // Response, Request
                strCondition = string.Format("{0} = {1}", Vacation.Model.Request.Fields.MemberID, nCompanyMemberID);
                /*Dictionary<Request.Fields, object> dicManagerID4 = new Dictionary<Request.Fields, object>();
                dicManagerID4.Add(Vacation.Model.Request.Fields.MemberID, nCompanyMemberID);*/
                IEnumerable<Request> deleteRequests = m_dataManager.GetSelect().Select<Request>(strCondition, out strErrorMessage);

                foreach (Request req in deleteRequests)
                {
                    string strCondition2 = string.Format("{0} = {1}", Vacation.Model.Response.Fields.RequestID, req.ID);
                    /*Dictionary<Response.Fields, object> dicRequestID = new Dictionary<Response.Fields, object>();
                    dicRequestID.Add(Vacation.Model.Response.Fields.RequestID, req.ID);*/
                    m_dataManager.GetDelete().Delete<Response>(strCondition2, out strErrorMessage);
                }


                m_dataManager.GetDelete().Delete<Request>(strCondition, out strErrorMessage);

                strCondition = string.Format("{0} = {1}", Vacation.Model.Response.Fields.ManagerID, nCompanyMemberID);
                /*Dictionary<Response.Fields, object> dicManagerID1 = new Dictionary<Response.Fields, object>();
                dicManagerID1.Add(Vacation.Model.Response.Fields.ManagerID, nCompanyMemberID);*/
                m_dataManager.GetDelete().Delete<Response>(strCondition, out strErrorMessage);

                // SpecialVacation
                strCondition = string.Format("{0} = {1}", Vacation.Model.SpecialVacation.Fields.MemberID, nCompanyMemberID);
                /*Dictionary<SpecialVacation.Fields, object> dicManagerID2 = new Dictionary<SpecialVacation.Fields, object>();
                dicManagerID2.Add(Vacation.Model.SpecialVacation.Fields.MemberID, nCompanyMemberID);*/
                m_dataManager.GetDelete().Delete<SpecialVacation>(strCondition, out strErrorMessage);

                strCondition = string.Format("{0} = {1}", Vacation.Model.SpecialVacationResponse.Fields.ManagerID, nCompanyMemberID);
                /*Dictionary<SpecialVacationResponse.Fields, object> dicManagerID3 = new Dictionary<SpecialVacationResponse.Fields, object>();
                dicManagerID3.Add(Vacation.Model.SpecialVacationResponse.Fields.ManagerID, nCompanyMemberID);*/
                m_dataManager.GetDelete().Delete<SpecialVacationResponse>(strCondition, out strErrorMessage);

                strCondition = string.Format("{0} = {1}", CompanyMember.Fields.ID, nCompanyMemberID);
                m_dataManager.GetDelete().Delete<CompanyMember>(strCondition, out strErrorMessage);
            }

            return true;
        }

        public bool DeleteTeam(List<RegularTeam> data)
        {
            List<int> teamIDs = new List<int>();
            foreach (RegularTeam item in data)
                teamIDs.Add(item.ID);

            teamIDs.Reverse(); // 역순

            string strErrorMessage;
            // FK 삭제
            foreach (int teamID in teamIDs)
            {
                string strCondition = string.Format("{0} = {1}", CompanyMember.Fields.TeamID, teamID);
                /*Dictionary<CompanyMember.Fields, object> dicCompanyMemberConditions = new Dictionary<CompanyMember.Fields, object>();
                dicCompanyMemberConditions.Add(CompanyMember.Fields.TeamID, teamID);*/

                IEnumerable<CompanyMember> members = m_dataManager.GetSelect().Select<CompanyMember>(strCondition, out strErrorMessage);
                if (members != null)
                {
                    foreach (CompanyMember member in members)
                    {
                        string strCondition2 = string.Format("{0} = {1}", Vacation.Model.Response.Fields.ManagerID, member.ID);
                        /*Dictionary<Response.Fields, object> dicManagerID = new Dictionary<Response.Fields, object>();
                        dicManagerID.Add(Vacation.Model.Response.Fields.ManagerID, member.ID);*/
                        m_dataManager.GetDelete().Delete<Response>(strCondition2, out strErrorMessage);

                        strCondition2 = string.Format("{0} = {1}", CompanyMember.Fields.ID, member.ID);
                        m_dataManager.GetDelete().Delete<CompanyMember>(strCondition2, out strErrorMessage);
                    }
                }

                strCondition = string.Format("{0} = {1}", Model.RegularTeam.Fields.ID, teamID);
                m_dataManager.GetDelete().Delete<RegularTeam>(strCondition, out strErrorMessage);
            }

            return true;
        }


        public bool UpdateRegularTeam(RegularTeam data)
        {
            string strErrorMessage;
            m_dataManager.GetUpdate().Update<RegularTeam>(data, null, out strErrorMessage);

            foreach (RegularTeam item in m_regularTeam)
            {
                if (item.ID == data.ID)
                {
                    item.Name = data.Name;
                    break;
                }
            }

            return true;
        }
    }
}
