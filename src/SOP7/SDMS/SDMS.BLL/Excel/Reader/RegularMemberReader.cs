using System.Collections.Generic;
using TeamEditor.Model.Sop.Team;
using TeamEditor.IDAL;
using SDMS.Model.Sensor;
using dnsDBUtil;
using System.ComponentModel.DataAnnotations;
using System.Collections;

namespace SDMS.BLL.Excel.Reader
{
    using Rollback;

    public class RegularMemberReader : ExcelReader
    {
        private class RegularTeam : Regular
        {
            private List<RegularTeam> m_children = new List<RegularTeam>();
            private RegularTeam m_parentTeam = null;

            public RegularTeam ParentTeam
            {
                get { return m_parentTeam; }
                set
                {
                    if (m_parentTeam != value)
                    {
                        if (m_parentTeam != null)
                            m_parentTeam.m_children.Remove(this);

                        if (value != null)
                            value.m_children.Add(this);

                        m_parentTeam = value;
                    }
                }
            }

            // 하위 팀을 포함하여 팀원이 한명이라도 존재하는가?
            public bool HasChildMembers(Dictionary<RegularTeam, List<RegularMember>> dicTeamMembers)
            {
                if (HasChildMembers(this, dicTeamMembers))
                    return true;

                return false;
            }

            private bool HasChildMembers(RegularTeam team, Dictionary<RegularTeam, List<RegularMember>> dicTeamMembers)
            {
                List<RegularMember> members;

                if (dicTeamMembers.TryGetValue(team, out members) && members.Count > 0)
                    return true;

                foreach (RegularTeam childTeam in m_children)
                {
                    if (HasChildMembers(childTeam, dicTeamMembers))
                        return true;
                }

                return false;
            }
        }

        public const string JobLevelProperty = "JobLevel";
        public const string JobPositionProperty = "JobPosition";
        private static readonly string AES_key = new string(new char[] { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6' });

        private const string TeamNameTag = "부서";
        private const string MemberNameTag = "이름";
        private const string JobPositionTag = "직위";
        private const string JobLevelTag = "직급";
        private const string PhoneNumberTag = "휴대폰";
        private const string MemberIDTag = "사번";
        private const string OfficePhoneNumberTag = "근무처 번호";
        private const string EmailTag = "이메일";

        private const int m_nTempTeamID = 0;

        private IDataManager m_teamDataManager = null;
        private SOPManager.IDAL.IDataManager m_sopDataManager = null;

        public RegularMemberReader(string strFilePath, SDMS.IDAL.IDataManager dataManager, TeamEditor.IDAL.IDataManager teamDataManager, SOPManager.IDAL.IDataManager sopDataManager, int? siteID)
            : base(strFilePath, dataManager)
        {
            m_teamDataManager = teamDataManager;
            m_sopDataManager = sopDataManager;
            //DirectDBManager dbMgr = (DirectDBManager)((SDMS.DAL.DataManager)m_dataManager).GetDBManager();
            //m_teamDataManager = new DataManager(dbMgr.DatabaseName, (int)dbMgr.DatabaseType, dbMgr.SiteID, dbMgr.WebServerURL);
            //m_sopDataManager = new SOPManager.DAL.DataManager(dbMgr.DatabaseName, (int)dbMgr.DatabaseType, dbMgr.SiteID, dbMgr.WebServerURL);
        }

        protected override bool UpdateData(List<SheetData> sheetDatas, int? siteID, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (m_dataManager == null)
                return false;

            Dictionary<string, RegularMember> dicIDMembers;
            Dictionary<string, RegularMember> dicPhoneNumberMembers;
            Dictionary<string, RegularMember> dicEmailMembers;
            Dictionary<string, int> dicJobLevels;
            Dictionary<string, int> dicJobPositions;

            Dictionary<Regular, List<RegularMember>> dicTeamMembers = ReadDB(m_teamDataManager, out dicIDMembers, out dicPhoneNumberMembers, out dicEmailMembers, out dicJobLevels, out dicJobPositions, out strErrorMessage, siteID);

            if (dicTeamMembers == null)
            {
                if (strErrorMessage != null)
                {
                    System.Diagnostics.Trace.WriteLine("RegularMemberReader.UpdateData Fail : " + strErrorMessage);
                }

                strErrorMessage = "인사DB에 데이터 오류가 존재합니다.\r\n시스템 관리자에게 문의해 주세요.";
                return false;
            }

            bool result = CheckData(dicTeamMembers, dicIDMembers, dicPhoneNumberMembers, dicEmailMembers, dicJobLevels, dicJobPositions, sheetDatas, siteID, out strErrorMessage);

            if (result == false)
            {
                if (strErrorMessage != null)
                {
                    System.Diagnostics.Trace.WriteLine("RegularMemberReader.UpdateData Fail2 : " + strErrorMessage);
                }

                strErrorMessage = "잘못된 형식의 엑셀파일이거나 파일을 열수 없습니다.";
            }

            return result;
        }

        private bool CheckData(Dictionary<Regular, List<RegularMember>> dicTeamMembers, Dictionary<string, RegularMember> dicIDMembers, Dictionary<string, RegularMember> dicPhoneNumberMembers, Dictionary<string, RegularMember> dicEmailMembers, Dictionary<string, int> dicJobLevels, Dictionary<string, int> dicJobPositions, List<SheetData> sheetDatas, int? siteID, out string strErrorMessage)
        {
            strErrorMessage = null;

            Dictionary<string, int> dicColumnIndex = new Dictionary<string, int>();
            Dictionary<RegularTeam, List<RegularMember>> dicSheetRegularTeamMembers = new Dictionary<RegularTeam, List<RegularMember>>();
            Dictionary<string, RegularTeam> dicTeamPath = MakeTeamPath(dicTeamMembers);

            foreach (SheetData sheet in sheetDatas)
            {
                MakeSheetRegularTeamMembers(sheet, dicSheetRegularTeamMembers, dicTeamPath, dicIDMembers, dicPhoneNumberMembers, dicEmailMembers, dicJobLevels, dicJobPositions, dicColumnIndex);
                // 첫번째 Sheet만 사용한다.
                break;
            }

            string strTeamIDs, strMemberIDs;
            GetNotDeletingList(dicSheetRegularTeamMembers, dicIDMembers, dicPhoneNumberMembers, out strTeamIDs, out strMemberIDs);

            RollbackManager rollback = new RollbackManager();

            if (DeleteRegularMembers(strMemberIDs, siteID, rollback) == false)
            {
                rollback.Rollback(m_dataManager, m_teamDataManager, m_sopDataManager);
                return false;
            }

            // 삭제되지 않는 직원들은 임시팀을 만든다음 임시팀 소속으로 둔다.
            if (SetTempRegularTeam(strMemberIDs, rollback, siteID) == false)
            {
                rollback.Rollback(m_dataManager, m_teamDataManager, m_sopDataManager);
                return false;
            }

            if (DeleteRegularTeams(strTeamIDs, siteID, rollback) == false)
            {
                rollback.Rollback(m_dataManager, m_teamDataManager, m_sopDataManager);
                return false;
            }

            if (AddRegularTeams(dicSheetRegularTeamMembers.Keys, rollback, siteID, out strErrorMessage) == false)
            {
                rollback.Rollback(m_dataManager, m_teamDataManager, m_sopDataManager);
                return false;
            }

            if (UpdateRegularMembers(strMemberIDs, dicSheetRegularTeamMembers, rollback) == false)
            {
                rollback.Rollback(m_dataManager, m_teamDataManager, m_sopDataManager);
                return false;
            }

            // 임시팀 삭제
            if (DeleteTempRegularTeam() == false)
            {
                rollback.Rollback(m_dataManager, m_teamDataManager, m_sopDataManager);
                return false;
            }

            if (AddRegularMembers(dicSheetRegularTeamMembers, rollback, out strErrorMessage) == false)
            {
                rollback.Rollback(m_dataManager, m_teamDataManager, m_sopDataManager);
                return false;
            }

            return true;
        }

        private bool DeleteTempRegularTeam()
        {
            string strErrorMessage;
            return m_teamDataManager.GetDeleteManager().DeleteRegular(m_nTempTeamID, out strErrorMessage);
        }

        // 삭제되지 않는 직원들은 임시팀을 만든다음 임시팀 소속으로 둔다.
        private bool SetTempRegularTeam(string strMemberIDs, RollbackManager rollback, int? siteID)
        {
            if (strMemberIDs.Length == 0)
                return true;

            string strErrorMessage;

            Regular tempTeam = m_teamDataManager.GetSelectManager().SelectRegular(m_nTempTeamID, out strErrorMessage);

            if (strErrorMessage != null && strErrorMessage.Length > 0)
                return false;

            TeamRollbackData rollbackData = new TeamRollbackData();
            rollback.AddData(rollbackData);

            if (tempTeam == null)
            {
                tempTeam = new Regular();
                tempTeam.ID = m_nTempTeamID;
                tempTeam.ParentTeamID = null;
                tempTeam.TeamName = "Temp";
                tempTeam.SiteID = siteID;

                if (m_teamDataManager.GetCreateManager().AddRegular(tempTeam) == false)
                    return false;
                else
                {
                    List<Regular> deleteTeams = new List<Regular>();
                    deleteTeams.Add(tempTeam);

                    rollbackData.SetDeleteRegulars(deleteTeams);
                }
            }

            bool isNullable;
            string strCondition = string.Format("{0} in ({1})", RegularMember.GetFieldName(RegularMember.Fields.ID, out isNullable), strMemberIDs);
            List<RegularMember> members = m_teamDataManager.GetSelectManager().SelectRegularMembers(strCondition, out strErrorMessage);

            if (members == null)
                return false;

            List<RegularMember> updateMembers = new List<RegularMember>();
            rollbackData.SetUpdateRegularMembers(updateMembers);

            foreach (RegularMember member in members)
            {
                RegularMember updateMember = new RegularMember();
                updateMember.ID = member.ID;
                updateMember.Email = member.Email;
                updateMember.JobLevelID = member.JobLevelID;
                updateMember.JobPositionID = member.JobPositionID;
                updateMember.MemberID = member.MemberID;
                updateMember.MemberName = member.MemberName;
                updateMember.OfficePhoneNumber = member.OfficePhoneNumber;
                updateMember.PhoneNumber = member.PhoneNumber;
                updateMember.RegularID = m_nTempTeamID;

                if (m_teamDataManager.GetUpdateManager().UpdateRegularMember(updateMember, out strErrorMessage) == false)
                    return false;
                else
                    updateMembers.Add(member);
            }

            return true;
        }

        private bool UpdateRegularMembers(string strMemberIDs, Dictionary<RegularTeam, List<RegularMember>> dicTeamMembers, RollbackManager rollback)
        {
            if (strMemberIDs.Length == 0)
                return true;

            string strErrorMessage;
            bool isNullable;
            string strCondition = string.Format("{0} in ({1})", RegularMember.GetFieldName(RegularMember.Fields.ID, out isNullable), strMemberIDs);

            List<RegularMember> members = m_teamDataManager.GetSelectManager().SelectRegularMembers(strCondition, out strErrorMessage);

            if (members == null)
                return false;

            // BackUp을 위한 데이터
            Dictionary<int, RegularMember> dicOriginMembers = new Dictionary<int, RegularMember>();

            foreach (RegularMember member in members)
            {
                dicOriginMembers[member.ID] = member;
            }

            TeamRollbackData rollbackData = new TeamRollbackData();
            rollback.AddData(rollbackData);

            List<RegularMember> updateMembers = new List<RegularMember>();
            rollbackData.SetUpdateRegularMembers(updateMembers);

            foreach (KeyValuePair<RegularTeam, List<RegularMember>> pair in dicTeamMembers)
            {
                foreach (RegularMember member in pair.Value)
                {
                    if (member.ID > 0)
                    {
                        member.RegularID = pair.Key.ID;
                        member.PhoneNumber = member.PhoneNumber == null || member.PhoneNumber.Length > 0 ? null : EncryptPhoneNumber(member.PhoneNumber);

                        if (m_teamDataManager.GetUpdateManager().UpdateRegularMember(member, out strErrorMessage) == false)
                            return false;
                        else
                        {
                            RegularMember _member;

                            if (dicOriginMembers.TryGetValue(member.ID, out _member))
                                updateMembers.Add(_member);
                        }
                    }
                }
            }

            return true;
        }

        private bool AddRegularMembers(Dictionary<RegularTeam, List<RegularMember>> dicTeamMembers, RollbackManager rollback, out string strErrorMessage)
        {
            TeamRollbackData rollbackData = new TeamRollbackData();
            rollback.AddData(rollbackData);

            List<RegularMember> rollbackMembers = new List<RegularMember>();
            rollbackData.SetDeleteRegularMembers(rollbackMembers);

            int nID = m_teamDataManager.GetSelectManager().GetMaxID(RegularMember.GetTableName(), out strErrorMessage);

            foreach (KeyValuePair<RegularTeam, List<RegularMember>> pair in dicTeamMembers)
            {
                foreach (RegularMember member in pair.Value)
                {
                    if (member.ID <= 0)
                    {
                        member.ID = nID++;
                        member.RegularID = pair.Key.ID;

                        if (member.PhoneNumber != null && member.PhoneNumber.Length > 0)
                            member.PhoneNumber = EncryptPhoneNumber(member.PhoneNumber);

                        if (m_teamDataManager.GetCreateManager().AddRegularMember(member) == false)
                            return false;
                        else
                            rollbackMembers.Add(member);
                    }
                }
            }

            return true;
        }

        private bool AddRegularTeams(ICollection<RegularTeam> teams, RollbackManager rollback, int? siteID, out string strErrorMessage)
        {
            TeamRollbackData rollbackData = new TeamRollbackData();
            rollback.AddData(rollbackData);

            List<Regular> rollbackTeams = new List<Regular>();
            rollbackData.SetDeleteRegulars(rollbackTeams);

            int nID = m_teamDataManager.GetSelectManager().GetMaxID(Regular.GetTableName(), out strErrorMessage);
            bool complete = false;

            while (complete == false)
            {
                complete = true;

                foreach (RegularTeam team in teams)
                {
                    team.SiteID = siteID;

                    if (team.ID <= 0)
                    {
                        if (team.ParentTeam == null || (team.ParentTeam != null && team.ParentTeam.ID > 0))
                        {
                            team.ID = nID++;

                            if (team.ParentTeam != null)
                            {
                                team.ParentTeamID = team.ParentTeam.ID;
                            }
                            
                            if (m_teamDataManager.GetCreateManager().AddRegular(team) == false)
                                return false;
                            else
                                rollbackTeams.Add(team);
                        }
                        else
                            complete = false;
                    }
                }
            }

            return true;
        }

        private bool DeleteRegularTeams(string strNotDeletingTeamIDs, int? siteID, RollbackManager rollback)
        {
            string strErrorMessage;
            List<Regular> teams = null;

            if (strNotDeletingTeamIDs.Length == 0)
                strNotDeletingTeamIDs = m_nTempTeamID.ToString();
            else
                strNotDeletingTeamIDs += "," + m_nTempTeamID.ToString();

            if (strNotDeletingTeamIDs.Length > 0)
            {
                bool isNullable;
                string strCondition = string.Format("{0} not in ({1})", Regular.GetFieldName(Regular.Fields.ID, out isNullable), strNotDeletingTeamIDs);

                if (siteID != null)
                    strCondition += string.Format(" and {0} = {1}", Regular.GetFieldName(Regular.Fields.SiteID, out isNullable), siteID);

                teams = m_teamDataManager.GetSelectManager().SelectRegulars(null, strCondition, out strErrorMessage);
            }
            else
            {
                bool isNullable;
                string strCondition = null;

                if (siteID != null)
                    strCondition = string.Format("{0} = {1}", Regular.GetFieldName(Regular.Fields.SiteID, out isNullable), siteID);

                teams = m_teamDataManager.GetSelectManager().SelectRegulars(null, strCondition, out strErrorMessage);
            }

            if (teams == null)
                return false;

            string strTeamIDs = "";

            foreach (Regular team in teams)
            {
                if (strTeamIDs.Length == 0)
                    strTeamIDs = team.ID.ToString();
                else
                    strTeamIDs += "," + team.ID.ToString();
            }

            if (DeleteFacilityManagers((int)FacilityManager.MemberTypes.RegularTeam, strTeamIDs, rollback) == false)
                return false;

            if (DeleteTemporaryMembers(strTeamIDs, null, rollback) == false)
                return false;

            TeamRollbackData rollbackData = new TeamRollbackData();
            rollback.AddData(rollbackData);

            List<Regular> rollbackTeams = new List<Regular>();
            rollbackData.SetInsertRegulars(rollbackTeams);

            foreach (Regular team in teams)
            {
                if (m_teamDataManager.GetDeleteManager().DeleteRegular(team.ID, out strErrorMessage) == false)
                    return false;
                else
                    rollbackTeams.Add(team);
            }

            return true;
        }

        private bool DeleteRegularMembers(string strNotDeletingMemberIDs, int? siteID, RollbackManager rollback)
        {
            string strErrorMessage;
            List<RegularMember> members = null;

            if (strNotDeletingMemberIDs.Length > 0)
            {
                bool isNullable;
                string strCondition = string.Format("{0} not in ({1})", RegularMember.GetFieldName(RegularMember.Fields.ID, out isNullable), strNotDeletingMemberIDs);

                if (siteID != null)
                    strCondition += string.Format(" and {0} in (Select {1} from {2} where {3} = {4})",
                        RegularMember.GetFieldName(RegularMember.Fields.RegularID, out isNullable),
                        Regular.GetFieldName(Regular.Fields.ID, out isNullable),
                        Regular.GetTableName(),
                        Regular.GetFieldName(Regular.Fields.SiteID, out isNullable),
                        siteID);

                members = m_teamDataManager.GetSelectManager().SelectRegularMembers(strCondition, out strErrorMessage);
            }
            else
            {
                bool isNullable;
                string strCondition = null;

                if (siteID != null)
                    strCondition = string.Format("{0} in (Select {1} from {2} where {3} = {4})",
                        RegularMember.GetFieldName(RegularMember.Fields.RegularID, out isNullable),
                        Regular.GetFieldName(Regular.Fields.ID, out isNullable),
                        Regular.GetTableName(),
                        Regular.GetFieldName(Regular.Fields.SiteID, out isNullable),
                        siteID);

                members = m_teamDataManager.GetSelectManager().SelectRegularMembers(strCondition, out strErrorMessage);
            }

            if (members == null)
                return false;

            string strMemberIDs = "";

            foreach (RegularMember member in members)
            {
                if (strMemberIDs.Length == 0)
                    strMemberIDs = member.ID.ToString();
                else
                    strMemberIDs += "," + member.ID.ToString();
            }

            if (DeleteFacilityManagers((int)FacilityManager.MemberTypes.RegularMember, strMemberIDs, rollback) == false)
                return false;

            if (DeleteTemporaryMembers(null, strMemberIDs, rollback) == false)
                return false;

            if (RemoveAccountUser(strMemberIDs, rollback) == false)
                return false;

            TeamRollbackData rollbackData = new TeamRollbackData();
            rollback.AddData(rollbackData);

            List<RegularMember> rollbackMembers = new List<RegularMember>();
            rollbackData.SetInsertRegularMembers(rollbackMembers);

            foreach (RegularMember member in members)
            {
                if (m_teamDataManager.GetDeleteManager().DeleteRegularMember(member.ID, out strErrorMessage) == false)
                    return false;
                else
                    rollbackMembers.Add(member);
            }

            return true;
        }

        private bool RemoveAccountUser(string strMemberIDs, RollbackManager rollback)
        {
            if (strMemberIDs == null || strMemberIDs == "")
                return true;

            string strErrorMessage;
            bool isNullable;

            TeamRollbackData rollbackData = new TeamRollbackData();
            rollback.AddData(rollbackData);

            string strCondition = string.Format("{0} in ({1})", SOPManager.Model.Sop.Account.User.GetFieldName(SOPManager.Model.Sop.Account.User.Fields.MemberID, out isNullable), strMemberIDs);

            List<SOPManager.Model.Sop.Account.User> users = m_sopDataManager.GetSelectManager().SelectUsers(strCondition, out strErrorMessage);
            if (users == null)
                return false;

            rollbackData = new TeamRollbackData();
            rollback.AddData(rollbackData);

            List<SOPManager.Model.Sop.Account.User> rollbackUsers = new List<SOPManager.Model.Sop.Account.User>();
            rollbackData.SetInsertUsers(rollbackUsers);

            foreach (SOPManager.Model.Sop.Account.User user in users)
            {
                // 연동 계정 옵션 제거
                strCondition = string.Format("{0} in ({1})", SOPManager.Model.Sop.Account.Option.GetFieldName(SOPManager.Model.Sop.Account.Option.Fields.UserID, out isNullable), user.ID);
                List<SOPManager.Model.Sop.Account.Option> options = m_sopDataManager.GetSelectManager().SelectOptions(null, strCondition, null, out strErrorMessage);
                if (options == null)
                    return false;

                List<SOPManager.Model.Sop.Account.Option> rollbackOptions = new List<SOPManager.Model.Sop.Account.Option>();
                rollbackData.SetInsertOptions(rollbackOptions);

                foreach (SOPManager.Model.Sop.Account.Option option in options)
                {
                    if (m_sopDataManager.GetDeleteManager().DeleteOption(option.ID) == false)
                        return false;
                    else
                        rollbackOptions.Add(option);
                }



                // 연동 계정 세션 제거
                strCondition = string.Format("{0} in ({1})", SOPManager.Model.Sop.Account.Session.GetFieldName(SOPManager.Model.Sop.Account.Session.Fields.AccountUserID, out isNullable), user.ID);

                List<SOPManager.Model.Sop.Account.Session> sessions = m_sopDataManager.GetSelectManager().SelectSessions(null, strCondition, null, out strErrorMessage);
                if (sessions == null)
                    return false;

                rollbackData = new TeamRollbackData();
                rollback.AddData(rollbackData);

                List<SOPManager.Model.Sop.Account.Session> rollbackSessions = new List<SOPManager.Model.Sop.Account.Session>();
                rollbackData.SetInsertSessions(rollbackSessions);

                foreach (SOPManager.Model.Sop.Account.Session session in sessions)
                {
                    if (m_sopDataManager.GetDeleteManager().DeleteSession(session.ID) == false)
                        return false;
                    else
                        rollbackSessions.Add(session);
                }

                if (SetNullUserToSopVersion(user.ID, out strErrorMessage) == false)
                    return false;

                // 연동 계정 제거
                if (m_sopDataManager.GetDeleteManager().DeleteUser(user.ID) == false)
                    return false;
                else
                    rollbackUsers.Add(user);
            }

            return true;
        }

        private bool SetNullUserToSopVersion(int userID, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = {1}", SOPManager.Model.Sop.Category.Version.Fields.OwnerID, userID);

            Dictionary<SOPManager.Model.Sop.Category.Version.Fields, object> dicSets = new Dictionary<SOPManager.Model.Sop.Category.Version.Fields, object>();
            dicSets[SOPManager.Model.Sop.Category.Version.Fields.OwnerID] = null;

            return m_sopDataManager.GetUpdateManager().UpdateVersion(dicSets, strCondition, out strErrorMessage);
        }

        private bool DeleteTemporaryMembers(string strRegularTeamIDs, string strRegularMemberIDs, RollbackManager rollback)
        {
            string strCondition = "";
            bool isNullable;

            if (strRegularTeamIDs != null && strRegularTeamIDs.Length > 0)
            {
                strCondition = string.Format("{0} in ({1})", TemporaryMember.GetFieldName(TemporaryMember.Fields.RegularID, out isNullable), strRegularTeamIDs);
            }

            if (strRegularMemberIDs != null && strRegularMemberIDs.Length > 0)
            {
                if (strCondition.Length == 0)
                    strCondition = string.Format("{0} in ({1})", TemporaryMember.GetFieldName(TemporaryMember.Fields.RegularMemberID, out isNullable), strRegularMemberIDs);
                else
                    strCondition += string.Format(" and {0} in ({1})", TemporaryMember.GetFieldName(TemporaryMember.Fields.RegularMemberID, out isNullable), strRegularMemberIDs);
            }

            if (strCondition.Length == 0)
                return true;

            string strErrorMessage;
            List<TemporaryMember> members = m_teamDataManager.GetSelectManager().SelectTemporaryMembers(null, strCondition, out strErrorMessage);

            if (members == null)
                return false;

            string strMemberIDs = "";

            foreach (TemporaryMember member in members)
            {
                if (strMemberIDs.Length == 0)
                    strMemberIDs = member.ID.ToString();
                else
                    strMemberIDs += "," + member.ID.ToString();
            }

            if (DeleteFacilityManagers((int)FacilityManager.MemberTypes.TemporaryMember, strMemberIDs, rollback) == false)
                return false;

            TeamRollbackData rollbackData = new TeamRollbackData();
            rollback.AddData(rollbackData);

            List<TemporaryMember> rollbackMembers = new List<TemporaryMember>();
            rollbackData.SetInsertTemporaryMembers(rollbackMembers);

            foreach (TemporaryMember member in members)
            {
                if (m_teamDataManager.GetDeleteManager().DeleteTemporaryMember(member.ID, out strErrorMessage) == false)
                    return false;
                else
                    rollbackMembers.Add(member);
            }

            return true;
        }

        private bool DeleteFacilityManagers(int memberType, string memberIDs, RollbackManager rollback)
        {
            if (memberIDs.Length == 0)
                return true;

            bool isNullable;
            string strErrorMessage;

            string strCondition = string.Format("{0} = {1} and {2} in ({3})",
                FacilityManager.GetFieldName(FacilityManager.Fields.MemberType, out isNullable),
                memberType,
                FacilityManager.GetFieldName(FacilityManager.Fields.MemberID, out isNullable),
                memberIDs);

            List<FacilityManager> managers = m_dataManager.GetSelectManager().SelectFacilityManagers(null, strCondition, out strErrorMessage);

            if (managers == null)
                return false;

            TeamRollbackData rollbackData = new TeamRollbackData();
            rollback.AddData(rollbackData);

            List<FacilityManager> rollbackManagers = new List<FacilityManager>();
            rollbackData.SetInsertFacilityManagers(rollbackManagers);

            foreach (FacilityManager manager in managers)
            {
                if (m_dataManager.GetDeleteManager().DeleteFacilityManager(null, strCondition, out strErrorMessage) == false)
                    return false;
                else
                    rollbackManagers.Add(manager);
            }

            strCondition = string.Format("{0} = {1} and {2} in ({3})",
                BuildingFacilityManager.GetFieldName(BuildingFacilityManager.Fields.MemberType, out isNullable),
                memberType,
                BuildingFacilityManager.GetFieldName(BuildingFacilityManager.Fields.MemberID, out isNullable),
                memberIDs);

            List<BuildingFacilityManager> buildingManagers = m_dataManager.GetSelectManager().SelectBuildingFacilityManagers(null, strCondition, out strErrorMessage);

            if (buildingManagers == null)
                return false;

            rollbackData = new TeamRollbackData();
            rollback.AddData(rollbackData);

            List<BuildingFacilityManager> rollbackBuildingManagers = new List<BuildingFacilityManager>();
            rollbackData.SetInsertBuildingFacilityManagers(rollbackBuildingManagers);

            foreach (BuildingFacilityManager manager in buildingManagers)
            {
                if (m_dataManager.GetDeleteManager().DeleteBuildingFacilityManager(null, strCondition, out strErrorMessage) == false)
                    return false;
                else
                    rollbackBuildingManagers.Add(manager);
            }

            strCondition = string.Format("{0} = {1} and {2} in ({3})",
                EquipZoneFacilityManager.GetFieldName(EquipZoneFacilityManager.Fields.MemberType, out isNullable),
                memberType,
                EquipZoneFacilityManager.GetFieldName(EquipZoneFacilityManager.Fields.MemberID, out isNullable),
                memberIDs);

            List<EquipZoneFacilityManager> equipZoneManagers = m_dataManager.GetSelectManager().SelectEquipZoneFacilityManagers(null, strCondition, out strErrorMessage);

            if (equipZoneManagers == null)
                return false;

            rollbackData = new TeamRollbackData();
            rollback.AddData(rollbackData);

            List<EquipZoneFacilityManager> rollbackEquipZoneManagers = new List<EquipZoneFacilityManager>();
            rollbackData.SetInsertEquipZoneFacilityManagers(rollbackEquipZoneManagers);

            foreach (EquipZoneFacilityManager manager in equipZoneManagers)
            {
                if (m_dataManager.GetDeleteManager().DeleteEquipZoneFacilityManager(null, strCondition, out strErrorMessage) == false)
                    return false;
                else
                    rollbackEquipZoneManagers.Add(manager);
            }

            return true;
        }

        private void GetNotDeletingList(Dictionary<RegularTeam, List<RegularMember>> dicSheetRegularTeamMembers, Dictionary<string, RegularMember> dicIDMembers, Dictionary<string, RegularMember> dicPhoneNumberMembers, out string strTeamIDs, out string strMemberIDs)
        {
            strTeamIDs = strMemberIDs = "";
            RegularMember _member;

            Dictionary<int, int> dicNotDeletingTeamIDs = new Dictionary<int, int>();

            foreach (KeyValuePair<RegularTeam, List<RegularMember>> pair in dicSheetRegularTeamMembers)
            {
                CheckNotDeletingTeam(pair.Key, dicNotDeletingTeamIDs);

                foreach (RegularMember member in pair.Value)
                {
                    if (member.MemberID != null && member.MemberID.Length > 0)
                    {
                        if (dicIDMembers.TryGetValue(member.MemberID, out _member))
                            member.ID = _member.ID;
                    }

                    if (member.PhoneNumber != null && dicPhoneNumberMembers.TryGetValue(member.PhoneNumber, out _member))
                        member.ID = _member.ID;

                    if (member.ID > 0)
                    {
                        if (strMemberIDs.Length == 0)
                            strMemberIDs = member.ID.ToString();
                        else
                            strMemberIDs += "," + member.ID.ToString();
                    }
                }
            }

            foreach (KeyValuePair<int, int> pair in dicNotDeletingTeamIDs)
            {
                if (strTeamIDs.Length == 0)
                    strTeamIDs = pair.Key.ToString();
                else
                    strTeamIDs += "," + pair.Key.ToString();
            }
        }

        private void CheckNotDeletingTeam(RegularTeam team, Dictionary<int, int> dicNotDeletingTeamIDs)
        {
            if (team.ID > 0)
            {
                dicNotDeletingTeamIDs[team.ID] = team.ID;
            }

            if (team.ParentTeam != null)
                CheckNotDeletingTeam(team.ParentTeam, dicNotDeletingTeamIDs);
        }

        private Dictionary<string, RegularTeam> MakeTeamPath(Dictionary<Regular, List<RegularMember>> dicTeamMembers)
        {
            // Key : Team ID
            Dictionary<int, Regular> dicTeams = new Dictionary<int, Regular>();

            foreach (KeyValuePair<Regular, List<RegularMember>> pair in dicTeamMembers)
            {
                dicTeams[pair.Key.ID] = pair.Key;
            }

            Dictionary<int, RegularTeam> dicRegularTeams = new Dictionary<int, RegularTeam>();
            Dictionary<string, RegularTeam> dicRegularTeamPaths = new Dictionary<string, RegularTeam>();

            foreach (KeyValuePair<int, Regular> pair in dicTeams)
            {
                string strTeamPath = GetTeamPath(pair.Value, dicTeams);

                RegularTeam team = new RegularTeam();
                team.ID = pair.Value.ID;
                team.ParentTeamID = pair.Value.ParentTeamID;
                team.TeamName = pair.Value.TeamName;

                dicRegularTeamPaths[strTeamPath] = team;
                dicRegularTeams[team.ID] = team;
            }

            foreach (KeyValuePair<int, RegularTeam> pair in dicRegularTeams)
            {
                RegularTeam team = pair.Value;

                while (team.ParentTeamID != null && team.ParentTeamID > 0 && team.ParentTeam == null)
                {
                    RegularTeam parent;

                    if (dicRegularTeams.TryGetValue((int)team.ParentTeamID, out parent) == false)
                        break;

                    team.ParentTeam = parent;
                    team = parent;
                }
            }

            return dicRegularTeamPaths;
        }

        public static string GetTeamPath(Regular team, Dictionary<int, Regular> dicTeams)
        {
            string strTeamPath = team.TeamName;

            while (team.ParentTeamID != null && team.ParentTeamID > 0)
            {
                Regular parent;

                if (dicTeams.TryGetValue((int)team.ParentTeamID, out parent) == false)
                    break;

                strTeamPath = parent.TeamName + "/" + strTeamPath;
                team = parent;
            }

            return strTeamPath;
        }

        private void MakeSheetRegularTeamMembers(SheetData sheet, Dictionary<RegularTeam, List<RegularMember>> dicSheetRegularTeamMembers, Dictionary<string, RegularTeam> dicTeamPath, Dictionary<string, RegularMember> dicIDMembers, Dictionary<string, RegularMember> dicPhoneNumberMembers, Dictionary<string, RegularMember> dicEmailMembers, Dictionary<string, int> dicJobLevels, Dictionary<string, int> dicJobPositions, Dictionary<string, int> dicColumnIndex)
        {
            if (dicColumnIndex.Count == 0)
            {
                foreach (KeyValuePair<int, string> pair in sheet.Titles)
                {
                    if (pair.Value == null)
                        continue;

                    if (pair.Value.StartsWith(TeamNameTag))
                        dicColumnIndex[TeamNameTag] = pair.Key;
                    else if (pair.Value.StartsWith(MemberNameTag))
                        dicColumnIndex[MemberNameTag] = pair.Key;
                    else if (pair.Value.StartsWith(JobPositionTag))
                        dicColumnIndex[JobPositionTag] = pair.Key;
                    else if (pair.Value.StartsWith(JobLevelTag))
                        dicColumnIndex[JobLevelTag] = pair.Key;
                    else if (pair.Value.StartsWith(PhoneNumberTag))
                        dicColumnIndex[PhoneNumberTag] = pair.Key;
                    else if (pair.Value.StartsWith(MemberIDTag))
                        dicColumnIndex[MemberIDTag] = pair.Key;
                    else if (pair.Value.StartsWith(OfficePhoneNumberTag))
                        dicColumnIndex[OfficePhoneNumberTag] = pair.Key;
                    else if (pair.Value.StartsWith(EmailTag))
                        dicColumnIndex[EmailTag] = pair.Key;
                }
            }

            List<string> teamNames = GetColumnValues(TeamNameTag, sheet, dicColumnIndex);
            List<string> memberNames = GetColumnValues(MemberNameTag, sheet, dicColumnIndex);
            List<string> jobPositions = GetColumnValues(JobPositionTag, sheet, dicColumnIndex);
            List<string> jobLevels = GetColumnValues(JobLevelTag, sheet, dicColumnIndex);
            List<string> phoneNumbers = GetColumnValues(PhoneNumberTag, sheet, dicColumnIndex);
            List<string> memberIDs = GetColumnValues(MemberIDTag, sheet, dicColumnIndex);
            List<string> officePhoneNumbers = GetColumnValues(OfficePhoneNumberTag, sheet, dicColumnIndex);
            List<string> emails = GetColumnValues(EmailTag, sheet, dicColumnIndex);

            // 엑셀파일에 같은 사람이 두번이상 기입되지 않았는지 검사
            Dictionary<string, RegularMember> dicIDMembers2 = new Dictionary<string, RegularMember>();
            Dictionary<string, RegularMember> dicPhoneNumberMembers2 = new Dictionary<string, RegularMember>();
            Dictionary<string, RegularMember> dicEmailMembers2 = new Dictionary<string, RegularMember>();

            int nValueCount = teamNames.Count;

            for (int i = 0; i < nValueCount; i++)
            {
                string strTeamPath = teamNames[i];
                string strMemberName = memberNames[i];
                string strJobPosition = jobPositions[i];
                string strJobLevel = jobLevels[i];
                string strPhoneNumber = phoneNumbers[i];
                string strMemberID = memberIDs[i];
                string strOfficePhoneNumber = officePhoneNumbers[i];
                string strEmail = emails[i];

                if (strPhoneNumber == null)
                    strPhoneNumber = "";
                if (strEmail == null)
                    strEmail = "";

                if (strTeamPath == null || strMemberName == null || strPhoneNumber == null || strEmail == null)
                    continue;

                strTeamPath = strTeamPath.Trim();
                strMemberName = strMemberName.Trim();

                RegularTeam team = GetRegularTeam(strTeamPath, dicTeamPath, dicSheetRegularTeamMembers);

                bool validPhoneNumber = true;
                strPhoneNumber = TrimPhoneNumber(strPhoneNumber, ref validPhoneNumber);

                if (validPhoneNumber)
                {
                    if (CheckValidPhoneNumber(strPhoneNumber) == false)
                        validPhoneNumber = false;
                }

                strEmail = strEmail.Trim();

                bool validEmail = CheckValidEmail(strEmail);
                bool validMemberID = false;

                if (strMemberID != null)
                {
                    strMemberID = strMemberID.Trim();
                    validMemberID = CheckValidMemberID(strMemberID);
                }

                if (strJobPosition != null)
                    strJobPosition = strJobPosition.Trim();

                if (strJobLevel != null)
                    strJobLevel = strJobLevel.Trim();

                // 셋중에 적어도 하나는 있어야 한다.
                if (validPhoneNumber == false && validEmail == false && validMemberID == false)
                    continue;

                // 한글이나 영문자 이외의 글자가 사용되면 오류로 인식한다.
                //if (CheckHangul(strMemberName) == false)
                //    continue;

                //RegularTeam team = GetRegularTeam(strTeamPath, dicTeamPath, dicSheetRegularTeamMembers);
                List<RegularMember> members = dicSheetRegularTeamMembers[team];

                RegularMember member;

                /*if (strMemberID != null && dicIDMembers.TryGetValue(strMemberID, out member))
                {
                    // 같은 사람이 중복으로 기입되었는지 검사
                    if ((validMemberID && dicIDMembers2.ContainsKey(strMemberID)) || (validPhoneNumber && dicPhoneNumberMembers2.ContainsKey(strPhoneNumber)) || (validEmail && dicEmailMembers2.ContainsKey(strEmail.ToLower())))
                        continue;

                    member.RegularID = team.ID;
                    SetRegularMemberInfo(member, validPhoneNumber, validEmail, validMemberID, strPhoneNumber, strEmail, strMemberID);
                    SetJobLevelID(member, strJobLevel, dicJobLevels);
                    SetJobPositionID(member, strJobPosition, dicJobPositions);

                    members.Add(member);
                }
                else if (dicPhoneNumberMembers.TryGetValue(strPhoneNumber, out member))
                {
                    // 같은 사람이 중복으로 기입되었는지 검사
                    if ((strMemberID != null && validMemberID && dicIDMembers2.ContainsKey(strMemberID)) || (validPhoneNumber && dicPhoneNumberMembers2.ContainsKey(strPhoneNumber)) || (validEmail && dicEmailMembers2.ContainsKey(strEmail.ToLower())))
                        continue;

                    member.RegularID = team.ID;
                    SetRegularMemberInfo(member, validPhoneNumber, validEmail, validMemberID, strPhoneNumber, strEmail, strMemberID);

                    SetJobLevelID(member, strJobLevel, dicJobLevels);

                    members.Add(member);
                }
                else if (dicEmailMembers.TryGetValue(strEmail, out member))
                {
                    // 같은 사람이 중복으로 기입되었는지 검사
                    if ((strMemberID != null && validMemberID && dicIDMembers2.ContainsKey(strMemberID)) || (validPhoneNumber && dicPhoneNumberMembers2.ContainsKey(strPhoneNumber)) || (validEmail && dicEmailMembers2.ContainsKey(strEmail.ToLower())))
                        continue;

                    member.RegularID = team.ID;
                    SetRegularMemberInfo(member, validPhoneNumber, validEmail, validMemberID, strPhoneNumber, strEmail, strMemberID);

                    SetJobLevelID(member, strJobLevel, dicJobLevels);

                    members.Add(member);
                }
                else*/
                {
                    // 같은 사람이 중복으로 기입되었는지 검사
                    if ((strMemberID != null && validMemberID && dicIDMembers2.ContainsKey(strMemberID)) || (validPhoneNumber && dicPhoneNumberMembers2.ContainsKey(strPhoneNumber)) || (validEmail && dicEmailMembers2.ContainsKey(strEmail.ToLower())))
                        continue;

                    member = new RegularMember();

                    SetRegularMemberInfo(member, validPhoneNumber, validEmail, validMemberID, strPhoneNumber, strEmail, strMemberID);
                    SetJobLevelID(member, strJobLevel, dicJobLevels);
                    SetJobPositionID(member, strJobPosition, dicJobPositions);

                    member.MemberName = strMemberName;
                    member.RegularID = team.ID;

                    members.Add(member);
                }

                member.OfficePhoneNumber = strOfficePhoneNumber;

                if (strMemberID != null && strMemberID.Length > 0)
                    dicIDMembers2[strMemberID] = member;

                if (strPhoneNumber.Length > 0)
                    dicPhoneNumberMembers2[strPhoneNumber] = member;

                if (strEmail.Length > 0)
                {
                    // 이메일은 대소문자 구별없이 처리
                    dicEmailMembers2[strEmail.ToLower()] = member;
                }
            }
        }

        private void SetRegularMemberInfo(RegularMember member, bool validPhoneNumber, bool validEmail, bool validMemberID, string strPhoneNumber, string strEmail, string strMemberID)
        {
            if (validPhoneNumber)
                member.PhoneNumber = strPhoneNumber;

            if (validEmail)
                member.Email = strEmail;

            if (validMemberID)
                member.MemberID = strMemberID;
        }

        // 한글과 영문자가 아닐경우 false를 리턴한다.
        private static bool CheckHangul(string str)
        {
            char[] arr = str.ToCharArray();

            foreach (char ch in arr)
            {
                int num = (int)ch;

                if (ch < 0xac00 || ch > 0xd7af)
                {
                    if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || ch == ' ')
                        continue;
                    else
                        return false;
                }
            }

            return true;
        }

        private void SetJobLevelID(RegularMember member, string strJobLevel, Dictionary<string, int> dicJobLevels)
        {
            if (strJobLevel != null && strJobLevel.Length > 0)
            {
                int nJobLevelID;

                if (dicJobLevels.TryGetValue(strJobLevel, out nJobLevelID))
                    member.JobLevelID = nJobLevelID;
                else
                {
                    string strErrorMessage;
                    int nID = m_teamDataManager.GetSelectManager().GetMaxID(Options.TableName, out strErrorMessage) - 1;

                    if (strErrorMessage != null && strErrorMessage.Length > 0)
                        return;

                    int nID2 = m_teamDataManager.GetSelectManager().GetMaxID(Options.TableName, out strErrorMessage, "PropertyName = '" + JobLevelProperty + "'") - 1;

                    if (strErrorMessage != null && strErrorMessage.Length > 0)
                        return;

                    int nPropertyID = 0;

                    if (nID2 > 0)
                    {
                        List<Options> options = m_teamDataManager.GetSelectManager().SelectOptions("ID = " + nID2.ToString(), out strErrorMessage);

                        if (options == null)
                            return;

                        if (options.Count > 0)
                            nPropertyID = options[options.Count - 1].PropertyID + 1;
                    }

                    Options option = new Options();

                    option.ID = nID + 1;
                    option.PropertyID = nPropertyID;
                    option.PropertyName = JobLevelProperty;
                    option.PropertyValue = strJobLevel;

                    if (m_teamDataManager.GetCreateManager().AddOptions(option) == false)
                        return;

                    dicJobLevels[strJobLevel] = nPropertyID;
                    member.JobLevelID = nPropertyID;
                }
            }
        }

        private void SetJobPositionID(RegularMember member, string strJobPosition, Dictionary<string, int> dicJobPositions)
        {
            if (strJobPosition != null && strJobPosition.Length > 0)
            {
                int nJobPositionID;

                if (dicJobPositions.TryGetValue(strJobPosition, out nJobPositionID))
                    member.JobPositionID = nJobPositionID;
                else
                {
                    string strErrorMessage;
                    int nID = m_teamDataManager.GetSelectManager().GetMaxID(Options.TableName, out strErrorMessage) - 1;

                    if (strErrorMessage != null && strErrorMessage.Length > 0)
                        return;

                    int nID2 = m_teamDataManager.GetSelectManager().GetMaxID(Options.TableName, out strErrorMessage, "PropertyName = '" + JobPositionProperty + "'") - 1;

                    if (strErrorMessage != null && strErrorMessage.Length > 0)
                        return;

                    int nPropertyID = 0;

                    if (nID2 > 0)
                    {
                        List<Options> options = m_teamDataManager.GetSelectManager().SelectOptions("ID = " + nID2.ToString(), out strErrorMessage);

                        if (options == null)
                            return;

                        if (options.Count > 0)
                            nPropertyID = options[options.Count - 1].PropertyID + 1;
                    }

                    Options option = new Options();

                    option.ID = nID + 1;
                    option.PropertyID = nPropertyID;
                    option.PropertyName = JobPositionProperty;
                    option.PropertyValue = strJobPosition;

                    if (m_teamDataManager.GetCreateManager().AddOptions(option) == false)
                        return;

                    dicJobPositions[strJobPosition] = nPropertyID;
                    member.JobPositionID = nPropertyID;
                }
            }
        }

        // 숫자 이외의 나머지 문자들을 모두 제거한다.
        private string TrimPhoneNumber(string strPhoneNumber, ref bool success)
        {
            string phoneNumber = "";
            int len = strPhoneNumber.Length;

            for (int i = 0; i < len; i++)
            {
                char ch = strPhoneNumber[i];

                if (ch >= '0' && ch <= '9')
                {
                    phoneNumber += ch;
                }
                else if (ch != ' ' && ch != '\r' && ch != '\n' && ch != '\t' && ch != '-')
                {
                    success = false;
                    return "";
                }
            }

            return phoneNumber;
        }

        // 전화번호를 000-0000-0000 또는 000-000-0000 형태로 만든다.
        private bool CheckValidPhoneNumber(string strPhoneNumber)
        {
            if (strPhoneNumber.StartsWith("010") ||
                strPhoneNumber.StartsWith("011") ||
                strPhoneNumber.StartsWith("016") ||
                strPhoneNumber.StartsWith("017") ||
                strPhoneNumber.StartsWith("018") ||
                strPhoneNumber.StartsWith("019"))
            {
                int len = strPhoneNumber.Length;

                if (len == 11 || len == 10)
                    return true;
                /*if (len == 11)
                    strPhoneNumber = strPhoneNumber.Substring(0, 3) + "-" + strPhoneNumber.Substring(3, 4) + "-" + strPhoneNumber.Substring(7);
                else if (len == 10)
                    strPhoneNumber = strPhoneNumber.Substring(0, 3) + "-" + strPhoneNumber.Substring(3, 3) + "-" + strPhoneNumber.Substring(6);
                else
                    return false;

                return true;*/
            }

            return false;
        }

        // 사번은 <> ' "는 사용할 수 없다.
        private bool CheckValidMemberID(string strMemberID)
        {
            char[] arr = strMemberID.ToCharArray();

            foreach (char ch in arr)
            {
                if (ch == '<' || ch == '>' || ch == '\'' || ch == '"' || ch == '&' || ch == '/')
                    return false;
            }

            return true;
        }

        private bool CheckValidEmail(string strEmail)
        {
            int index1 = strEmail.IndexOf('@');
            int index2 = strEmail.LastIndexOf('.');

            if (index1 <= 0 || index2 < index1)
                return false;

            string strHeader = strEmail.Substring(0, index1);
            string strBody = strEmail.Substring(index1 + 1, index2 - index1 - 1);
            string strTail = strEmail.Substring(index2 + 1);

            if (CheckHeader(strHeader) == false)
                return false;

            if (CheckBodyNTail(strBody) == false ||
                CheckBodyNTail(strTail) == false)
                return false;

            return true;
            /*var email = new EmailAddressAttribute();
            return email.IsValid(strEmail);*/
        }

        private bool CheckBodyNTail(string strBody)
        {
            int len = strBody.Length;

            if (len == 0)
                return false;

            for (int i = 0; i < len; i++)
            {
                char ch = strBody[i];

                if (ch >= 'A' && ch <= 'Z')
                    continue;
                else if (ch >= 'a' && ch <= 'z')
                    continue;
                else if (ch >= '0' && ch <= '9')
                    continue;
                else
                    return false;
            }

            return true;
        }

        private bool CheckHeader(string strHeader)
        {
            int len = strHeader.Length;

            if (len == 0)
                return false;

            for (int i=0;i<len;i++)
            {
                char ch = strHeader[i];

                if (ch >= 'A' && ch <= 'Z')
                    continue;
                else if (ch >= 'a' && ch <= 'z')
                    continue;
                else if (ch >= '0' && ch <= '9')
                    continue;
                else if (ch == '.' || ch == '_')
                    continue;
                else
                    return false;
            }

            return true;
        }

        private RegularTeam GetRegularTeam(string strTeamPath, Dictionary<string, RegularTeam> dicTeamPath, Dictionary<RegularTeam, List<RegularMember>> dicSheetRegularTeamMembers)
        {
            RegularTeam team;

            if (dicTeamPath.TryGetValue(strTeamPath, out team))
            {
                if (dicSheetRegularTeamMembers.ContainsKey(team) == false)
                    dicSheetRegularTeamMembers[team] = new List<RegularMember>();

                int nIndex = strTeamPath.LastIndexOf('/');

                if (nIndex >= 0)
                    GetRegularTeam(strTeamPath.Substring(0, nIndex), dicTeamPath, dicSheetRegularTeamMembers);

                return team;
            }

            string[] teamNames = strTeamPath.Split('/');
            int nTeamNameCount = teamNames.Length;

            string strPrevTeamName = "";
            RegularTeam teamPrevParent = null;

            for (int i = 0; i < nTeamNameCount; i++)
            {
                string teamName = teamNames[i].Trim();
                string strTeamName = strPrevTeamName + teamName;

                if (dicTeamPath.TryGetValue(strTeamName, out team) == false)
                {
                    RegularTeam _team = new RegularTeam();
                    _team.ParentTeam = teamPrevParent;
                    _team.TeamName = teamName;

                    teamPrevParent = _team;
                    dicTeamPath[strTeamName] = _team;
                    dicSheetRegularTeamMembers[_team] = new List<RegularMember>();
                }
                else
                {
                    if (dicSheetRegularTeamMembers.ContainsKey(team) == false)
                        dicSheetRegularTeamMembers[team] = new List<RegularMember>();

                    teamPrevParent = team;
                }

                strPrevTeamName = strTeamName + "/";
            }

            return teamPrevParent;
        }

        private List<string> GetColumnValues(string strTag, SheetData sheet, Dictionary<string, int> dicColumnIndex)
        {
            int nIndex;

            if (dicColumnIndex.TryGetValue(strTag, out nIndex) == false)
                return null;

            List<string> columnValues;

            if (sheet.ColumnDatas.TryGetValue(nIndex, out columnValues) == false)
                return null;

            return columnValues;
        }

        private Dictionary<Regular, List<RegularMember>> ReadDB(IDataManager dataManager, out Dictionary<string, RegularMember> dicIDMembers, out Dictionary<string, RegularMember> dicPhoneNumberMembers, out Dictionary<string, RegularMember> dicEmailMembers, out Dictionary<string, int> dicJobLevels, out Dictionary<string, int> dicJobPositions, out string strErrorMessage, int? siteID)
        {
            strErrorMessage = null;
            dicIDMembers = dicPhoneNumberMembers = dicEmailMembers = null;
            dicJobLevels = null;
            dicJobPositions = null;

            Dictionary<Regular.Fields, object> dicConditions = new Dictionary<Regular.Fields, object>();

            if (siteID != null)
                dicConditions[Regular.Fields.SiteID] = (int)siteID;

            List<Regular> teams = dataManager.GetSelectManager().SelectRegulars(dicConditions, out strErrorMessage);
            if (teams == null)
                return null;

            string strTeamIDs = null;

            foreach (Regular team in teams)
            {
                if (strTeamIDs == null)
                    strTeamIDs = team.ID.ToString();
                else
                    strTeamIDs += "," + team.ID.ToString();
            }

            string strAdditionalConditions = strTeamIDs == null ? null : string.Format("{0} in ({1})", RegularMember.Fields.RegularID, strTeamIDs);

            List<RegularMember> members = dataManager.GetSelectManager().SelectRegularMembers(null, strAdditionalConditions, out strErrorMessage);

            if (members == null)
                return null;

            Dictionary<int, Regular> dicTeams = new Dictionary<int, Regular>();
            Dictionary<Regular, List<RegularMember>> dicTeamMembers = new Dictionary<Regular, List<RegularMember>>();

            foreach (Regular team in teams)
            {
                if (dicTeamMembers.ContainsKey(team) == false)
                {
                    dicTeamMembers[team] = new List<RegularMember>();
                    dicTeams[team.ID] = team;
                }
            }

            dicPhoneNumberMembers = new Dictionary<string, RegularMember>();
            dicIDMembers = new Dictionary<string, RegularMember>();
            dicEmailMembers = new Dictionary<string, RegularMember>();

            // 이메일 중복검사용
            //Dictionary<string, RegularMember> dicEmails = new Dictionary<string, RegularMember>();

            foreach (RegularMember member in members)
            {
                // 전화번호와 이메일은 필수사항이다.
                if (member.PhoneNumber == null || member.PhoneNumber.Length == 0 ||
                    member.Email == null || member.Email.Length == 0)
                    continue;

                bool validPhoneNumber = true;
                member.PhoneNumber = TrimPhoneNumber(DecryptPhoneNumber(member.PhoneNumber), ref validPhoneNumber);

                if (validPhoneNumber == false)
                    continue;

                if (dicPhoneNumberMembers.ContainsKey(member.PhoneNumber))
                    continue;
                if (dicEmailMembers.ContainsKey(member.Email))
                    continue;
                /*if (dicEmails.ContainsKey(member.Email))
                    continue;*/

                Regular team;

                if (dicTeams.TryGetValue(member.RegularID, out team) == false)
                    continue;

                List<RegularMember> _members;

                if (dicTeamMembers.TryGetValue(team, out _members) == false)
                    continue;

                _members.Add(member);

                if (member.MemberID != null && member.MemberID.Length > 0)
                    dicIDMembers[member.MemberID] = member;

                dicPhoneNumberMembers[member.PhoneNumber] = member;
                dicEmailMembers[member.Email] = member;
                //dicEmails[member.Email] = member;
            }

            dicJobLevels = GetJobLevels(dataManager);
            dicJobPositions = GetJobPositions(dataManager);

            return dicTeamMembers;
        }

        public static string DecryptPhoneNumber(string strPhoneNumber)
        {
            return AES256Cipher.AES_decrypt(strPhoneNumber, AES_key);
        }

        public static string EncryptPhoneNumber(string strPhoneNumber)
        {
            return AES256Cipher.AES_encrypt(strPhoneNumber, AES_key);
        }

        public static string DecryptMemberID(string strMemberID)
        {
            return AES256Cipher.AES_decrypt(strMemberID, AES_key);
        }

        // Key : 직급명
        // Value : 직급 ID
        private Dictionary<string, int> GetJobLevels(IDataManager dataManager)
        {
            string strErrorMessage;
            string strCondition = "PropertyName = '" + JobLevelProperty + "'";

            List<Options> options = dataManager.GetSelectManager().SelectOptions(strCondition, out strErrorMessage);

            if (options == null)
                return null;

            Dictionary<string, int> dicJobLevels = new Dictionary<string, int>();

            foreach (Options option in options)
            {
                if (option.PropertyValue == null)
                    continue;

                string strJobLevelName = option.PropertyValue.Trim();

                if (strJobLevelName.Length > 0)
                    dicJobLevels[strJobLevelName] = option.PropertyID;
            }

            return dicJobLevels;
        }

        // Key : 직급명
        // Value : 직급 ID
        private Dictionary<string, int> GetJobPositions(IDataManager dataManager)
        {
            string strErrorMessage;
            string strCondition = "PropertyName = '" + JobPositionProperty + "'";

            List<Options> options = dataManager.GetSelectManager().SelectOptions(strCondition, out strErrorMessage);

            if (options == null)
                return null;

            Dictionary<string, int> dicJobPositions = new Dictionary<string, int>();

            foreach (Options option in options)
            {
                if (option.PropertyValue == null)
                    continue;

                string strJobPositionName = option.PropertyValue.Trim();

                if (strJobPositionName.Length > 0)
                    dicJobPositions[strJobPositionName] = option.PropertyID;
            }

            return dicJobPositions;
        }
    }
}
