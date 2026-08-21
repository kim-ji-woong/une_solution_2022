using NPOI.HPSF;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using System;
using System.Collections.Generic;
using TeamEditor.Model.Sop.Team;
//using dnsDBUtil;

namespace SDMS.BLL.Excel.Writer
{
    public class RegularMemberWriter : ExcelWriter
    {
        private TeamEditor.IDAL.IDataManager m_teamDataManager = null;

        public RegularMemberWriter(SDMS.IDAL.IDataManager dataManager, TeamEditor.IDAL.IDataManager teamDataManager)
            : base(dataManager, teamDataManager)
        {
            m_teamDataManager = teamDataManager;
            //WebDBManager dbMgr = (WebDBManager)((SDMS.DAL.DataManager)m_dataManager).GetDBManager();
            //m_teamDataManager = new TeamEditor.DAL.DataManager(dbMgr.DatabaseName, (int)dbMgr.DatabaseType, dbMgr.SiteID, dbMgr.WebServerURL);
        }

        protected override string GetSubject()
        {
            return "조직정보";
        }

        protected override ICollection<SheetData> ReadSheetDatas(List<int> siteIDs, out string strErrorMessage)
        {
            if (m_dataManager == null)
            {
                strErrorMessage = "DB에 연결할 수 없습니다.";
                return null;
            }

            Dictionary<int, string> dicJobPositions = new Dictionary<int, string>();
            Dictionary<int, string> dicJobLevels = new Dictionary<int, string>();
            Dictionary<string, List<RegularMember>> dicTeamMembers = GetTeamRegularMembers(dicJobPositions, dicJobLevels, siteIDs, out strErrorMessage);

            if (dicTeamMembers == null)
                return null;

            SheetData sheetData = new SheetData(GetSubject());

            sheetData.Titles[0] = "부서(필수)";     // 필수
            sheetData.Titles[1] = "이름(필수)";     // 필수
            sheetData.Titles[2] = "직위";
            sheetData.Titles[3] = "직급";
            sheetData.Titles[4] = "휴대폰";
            sheetData.Titles[5] = "사번";
            sheetData.Titles[6] = "근무처 번호";     // 선택
            sheetData.Titles[7] = "이메일(사번 / 휴대폰 / 이메일 가운데 하나는 반드시 필요)";   // 필수

            List<string> teams = new List<string>();
            List<string> names = new List<string>();
            List<string> jobPositions = new List<string>();
            List<string> jobLevels = new List<string>();
            List<string> phoneNumbers = new List<string>();
            List<string> memberIDs = new List<string>();
            List<string> officePhoneNumbers = new List<string>();
            List<string> emails = new List<string>();

            sheetData.ColumnDatas[0] = teams;
            sheetData.ColumnDatas[1] = names;
            sheetData.ColumnDatas[2] = jobPositions;
            sheetData.ColumnDatas[3] = jobLevels;
            sheetData.ColumnDatas[4] = phoneNumbers;
            sheetData.ColumnDatas[5] = memberIDs;
            sheetData.ColumnDatas[6] = officePhoneNumbers;
            sheetData.ColumnDatas[7] = emails;

            string strJobLevel, strJobPosition;

            foreach (KeyValuePair<string, List<RegularMember>> pair in dicTeamMembers)
            {
                if (pair.Value.Count > 0)
                {
                    // 팀원이 존재하는 경우
                    foreach (RegularMember member in pair.Value)
                    {
                        teams.Add(pair.Key);
                        names.Add(member.MemberName);
                        memberIDs.Add(member.MemberID != null ? member.MemberID : "");
                        phoneNumbers.Add(member.PhoneNumber != null ? member.PhoneNumber : "");
                        emails.Add(member.Email != null ? member.Email : "");
                        officePhoneNumbers.Add(member.OfficePhoneNumber != null ? member.OfficePhoneNumber : "");

                        if (member.JobLevelID != null && dicJobLevels.TryGetValue((int)member.JobLevelID, out strJobLevel))
                            jobLevels.Add(strJobLevel);
                        else
                            jobLevels.Add("");

                        if (member.JobPositionID != null && dicJobPositions.TryGetValue((int)member.JobPositionID, out strJobPosition))
                            jobPositions.Add(strJobPosition);
                        else
                            jobPositions.Add("");
                    }
                }
                else
                {
                    // 팀원이 하나도 없는 경우
                    teams.Add(pair.Key);
                    names.Add("");
                    memberIDs.Add("");
                    phoneNumbers.Add("");
                    emails.Add("");
                    jobLevels.Add("");
                    jobPositions.Add("");
                    officePhoneNumbers.Add("");
                }
            }

            List<SheetData> sheets = new List<SheetData>();
            sheets.Add(sheetData);
            return sheets;
        }

        // Key : Team Path
        private Dictionary<string, List<RegularMember>> GetTeamRegularMembers(Dictionary<int, string> dicJobPositions, Dictionary<int, string> dicJobLevels, List<int> siteIDs, out string strErrorMessage)
        {
            List<Regular> teams = m_teamDataManager.GetSelectManager().SelectRegulars(out strErrorMessage);

            if (teams == null)
                return null;

            List<RegularMember> members = m_teamDataManager.GetSelectManager().SelectRegularMembers(out strErrorMessage);

            if (members == null)
                return null;

            // Key : Team ID
            // Value : Team Path
            Dictionary<int, string> dicTeamPath = new Dictionary<int, string>();
            Dictionary<int, Regular> dicTeams = new Dictionary<int, Regular>();

            foreach (Regular team in teams)
            {
                dicTeams[team.ID] = team;
            }

            foreach (Regular team in teams)
            {
                string strPath = Reader.RegularMemberReader.GetTeamPath(team, dicTeams);
                dicTeamPath[team.ID] = strPath;
            }

            string strTeamPath;
            Dictionary<string, List<RegularMember>> dicTeamMembers = new Dictionary<string, List<RegularMember>>();

            bool checkSiteID = siteIDs != null && siteIDs.Count > 0;

            foreach (RegularMember member in members)
            {
                Regular team;

                if (dicTeams.TryGetValue(member.RegularID, out team) == false)
                    continue;
                else
                {
                    if (checkSiteID)
                    {
                        if (team.SiteID != null && siteIDs.Contains((int)team.SiteID) == false)
                            continue;
                    }
                }

                if (member.PhoneNumber != null)
                    member.PhoneNumber = Reader.RegularMemberReader.DecryptPhoneNumber(member.PhoneNumber);

                if (dicTeamPath.TryGetValue(member.RegularID, out strTeamPath))
                {
                    List<RegularMember> teamMembers;

                    if (dicTeamMembers.TryGetValue(strTeamPath, out teamMembers) == false)
                    {
                        teamMembers = new List<RegularMember>();
                        dicTeamMembers[strTeamPath] = teamMembers;
                    }

                    if (member.JobLevelID != null)
                        dicJobLevels[(int)member.JobLevelID] = "";

                    if (member.JobPositionID != null)
                        dicJobPositions[(int)member.JobPositionID] = "";

                    teamMembers.Add(member);
                }
                else
                {
                    System.Diagnostics.Trace.WriteLine("Unknown Team ID : " + member.RegularID.ToString());
                }
            }

            string strJobLevelIDs = "";
            string strJobPositionIDs = "";

            foreach (KeyValuePair<int, string> pair in dicJobLevels)
            {
                if (strJobLevelIDs.Length == 0)
                    strJobLevelIDs = pair.Key.ToString();
                else
                    strJobLevelIDs += "," + pair.Key.ToString();
            }

            foreach (KeyValuePair<int, string> pair in dicJobPositions)
            {
                if (strJobPositionIDs.Length == 0)
                    strJobPositionIDs = pair.Key.ToString();
                else
                    strJobPositionIDs += "," + pair.Key.ToString();
            }

            if (strJobLevelIDs.Length > 0 || strJobPositionIDs.Length > 0)
            {
                string strCondition = "";
                
                if (strJobLevelIDs.Length > 0)
                {
                    strCondition = string.Format("(PropertyName = '{0}' and PropertyID in ({1}))", Reader.RegularMemberReader.JobLevelProperty, strJobLevelIDs);
                }

                if (strJobPositionIDs.Length > 0)
                {
                    if (strCondition.Length == 0)
                        strCondition = string.Format("(PropertyName = '{0}' and PropertyID in ({1}))", Reader.RegularMemberReader.JobPositionProperty, strJobPositionIDs);
                    else
                        strCondition += string.Format(" or (PropertyName = '{0}' and PropertyID in ({1}))", Reader.RegularMemberReader.JobPositionProperty, strJobPositionIDs);
                }

                List<Options> options = m_teamDataManager.GetSelectManager().SelectOptions(strCondition, out strErrorMessage);

                if (options == null)
                    return null;

                foreach (Options option in options)
                {
                    if (option.PropertyName == Reader.RegularMemberReader.JobLevelProperty)
                        dicJobLevels[option.PropertyID] = option.PropertyValue;
                    else
                        dicJobPositions[option.PropertyID] = option.PropertyValue;
                }
            }

            List<string> noMemberTeamPathList = GetRegularTeamsNoMembers(dicTeamMembers, dicTeams, dicTeamPath, siteIDs);

            foreach (string teamPath in noMemberTeamPathList)
            {
                dicTeamMembers[teamPath] = new List<RegularMember>();
            }

            return dicTeamMembers;
        }

        // 직원이 하나도 없는 팀 목록 얻어오기
        // Return 값 : Team Path 목록
        private List<string> GetRegularTeamsNoMembers(Dictionary<string, List<RegularMember>> dicTeamMembers, Dictionary<int, Regular> dicTeams, Dictionary<int, string> dicTeamPath, List<int> siteIDs)
        {
            List<string> teamPathList = new List<string>();

            string strTeamPath;
            bool checkSiteID = siteIDs != null && siteIDs.Count > 0;

            foreach (KeyValuePair<int, Regular> pair in dicTeams)
            {
                Regular team = pair.Value;

                if (checkSiteID == false || (team.SiteID != null && siteIDs.Contains((int)team.SiteID)))
                {
                    if (dicTeamPath.TryGetValue(team.ID, out strTeamPath))
                    {
                        if (ContainsTeamPath(dicTeamMembers, strTeamPath) == false)
                            teamPathList.Add(strTeamPath);
                    }
                }
            }

            return teamPathList;
        }

        private bool ContainsTeamPath(Dictionary<string, List<RegularMember>> dicTeamMembers, string strTeamPath)
        {
            foreach (KeyValuePair<string, List<RegularMember>> pair in dicTeamMembers)
            {
                if (pair.Key.StartsWith(strTeamPath))
                    return true;
            }

            return false;
        }
    }
}
