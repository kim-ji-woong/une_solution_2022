using System;
using System.Collections.Generic;
using System.Collections;
using System.Text;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Vacation.DAL
{
    using Vacation.Model;

    public class JoinManager : SelectManager
    {
        public JoinManager(IDataManager dataManager)
            : base(dataManager)
        {
        }

        public ArrayList JoinCompanyMemberRequest(string strAdditionalConditions, out string strErrorMessage)
        {
            strErrorMessage = null;

            CompanyMember member = new CompanyMember();
            Request request = new Request();

            string strSQL = string.Format("Select a.*, b.* from {0} a, {1} b where a.{2} = b.{3}",
                member.GetTableName(), request.GetTableName(),
                CompanyMember.Fields.ID, Request.Fields.MemberID);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
                strSQL += " and " + strAdditionalConditions;

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nMemberFieldCount = member.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                member = new CompanyMember();
                request = new Request();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nMemberFieldCount)
                    {
                        ReadCompanyMember(pair.Key, pair.Value, member);
                    }
                    else
                    {
                        ReadRequest(pair.Key, pair.Value, request);
                    }

                    nIndex++;
                }

                arrDatas.Add(member);
                arrDatas.Add(request);
            }

            return arrDatas;
        }

        public ArrayList JoinCompanyMemberHistory(Dictionary<CompanyMember.Fields, object> dicConditions1, Dictionary<History.Fields, object> dicConditions2, string strAdditionalConditions, out string strErrorMessage)
        {
            strErrorMessage = null;
            string strCondition = "";

            if (SetCondition<CompanyMember.Fields>(ref strCondition, dicConditions1, CompanyMember.GetFieldName, CompanyMember.TableName, ref strErrorMessage) == false)
                return null;

            if (SetCondition<History.Fields>(ref strCondition, dicConditions2, History.GetFieldName, History.TableName, ref strErrorMessage) == false)
                return null;

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strCondition.Length > 0)
                    strCondition += " and " + strAdditionalConditions;
                else
                    strCondition = strAdditionalConditions;
            }

            CompanyMember member = new CompanyMember();
            History history = new History();

            string strSQL = string.Format("Select a.*, b.* from {0} a, {1} b where a.{2} = b.{3}",
                member.GetTableName(), history.GetTableName(),
                CompanyMember.Fields.ID, History.Fields.MemberID);

            if (strCondition != null && strCondition.Length > 0)
                strSQL += " and " + strCondition;

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nMemberFieldCount = member.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                member = new CompanyMember();
                history = new History();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nMemberFieldCount)
                    {
                        ReadCompanyMember(pair.Key, pair.Value, member);
                    }
                    else
                    {
                        ReadHistory(pair.Key, pair.Value, history);
                    }

                    nIndex++;
                }

                arrDatas.Add(member);
                arrDatas.Add(history);
            }

            return arrDatas;
        }

        public ArrayList JoinCompanyMemberJobLevelRegularTeam(Dictionary<CompanyMember.Fields, object> dicConditions1, Dictionary<JobLevel.Fields, object> dicConditions2, Dictionary<RegularTeam.Fields, object> dicConditions3, string strAdditionalConditions, out string strErrorMessage)
        {
            strErrorMessage = null;

            CompanyMember member = new CompanyMember();
            JobLevel jobLevel = new JobLevel();
            RegularTeam team = new RegularTeam();

            string strCondition = "";

            if (SetCondition<CompanyMember.Fields>(ref strCondition, dicConditions1, CompanyMember.GetFieldName, member.GetTableName(), ref strErrorMessage) == false)
                return null;

            if (SetCondition<JobLevel.Fields>(ref strCondition, dicConditions2, JobLevel.GetFieldName, jobLevel.GetTableName(), ref strErrorMessage) == false)
                return null;

            if (SetCondition<RegularTeam.Fields>(ref strCondition, dicConditions3, RegularTeam.GetFieldName, team.GetTableName(), ref strErrorMessage) == false)
                return null;

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strCondition.Length > 0)
                    strCondition += " and " + strAdditionalConditions;
                else
                    strCondition = strAdditionalConditions;
            }

            string strSQL = string.Format("Select a.*, b.*, c.* from {0} a, {1} b, {2} c where a.{3} = b.{4} and a.{5} = c.{6}",
                member.GetTableName(), jobLevel.GetTableName(), team.GetTableName(),
                CompanyMember.Fields.JobLevelID, JobLevel.Fields.ID,
                CompanyMember.Fields.TeamID, RegularTeam.Fields.ID);

            if (strCondition != null && strCondition.Length > 0)
                strSQL += " and " + strCondition;

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nMemberFieldCount = member.GetFieldCount();
            int nJobLevelFieldCount = jobLevel.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                member = new CompanyMember();
                jobLevel = new JobLevel();
                team = new RegularTeam();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nMemberFieldCount)
                    {
                        ReadCompanyMember(pair.Key, pair.Value, member);
                    }
                    else if (nIndex < nMemberFieldCount + nJobLevelFieldCount)
                    {
                        ReadJobLevel(pair.Key, pair.Value, jobLevel);
                    }
                    else
                    {
                        ReadRegularTeam(pair.Key, pair.Value, team);
                    }

                    nIndex++;
                }

                arrDatas.Add(member);
                arrDatas.Add(jobLevel);
                arrDatas.Add(team);
            }

            return arrDatas;
        }

        private void ReadCompanyMember(string strFieldName, object value, CompanyMember member)
        {
            if (strFieldName == CompanyMember.Fields.ID.ToString())
                member.ID = (int)value;
            else if (strFieldName == CompanyMember.Fields.Name.ToString())
                member.Name = (string)value;
            else if (strFieldName == CompanyMember.Fields.JobLevelID.ToString())
                member.JobLevelID = (int)value;
            else if (strFieldName == CompanyMember.Fields.StartDate.ToString())
                member.StartDate = (DateTime)value;
            else if (strFieldName == CompanyMember.Fields.TeamID.ToString())
                member.TeamID = (int)value;
            else if (strFieldName == CompanyMember.Fields.IsTeamLeader.ToString())
                member.IsTeamLeader = (bool)value;
            else if (strFieldName == CompanyMember.Fields.IsAdmin.ToString())
                member.IsAdmin = (bool)value;
            else if (strFieldName == CompanyMember.Fields.UserID.ToString())
                member.UserID = (string)value;
            else if (strFieldName == CompanyMember.Fields.UserPW.ToString())
                member.UserPW = (string)value;
            else if (strFieldName == CompanyMember.Fields.PhoneNumber.ToString())
                member.PhoneNumber = (string)value;
            else if (strFieldName == CompanyMember.Fields.PasswordCode.ToString())
                member.PasswordCode = (string)value;
        }

        private void ReadRequest(string strFieldName, object value, Request request)
        {
            if (strFieldName == Request.Fields.ID.ToString())
                request.ID = (int)value;
            else if (strFieldName == Request.Fields.RequestTime.ToString())
                request.RequestTime = (DateTime)value;
            else if (strFieldName == Request.Fields.MemberID.ToString())
                request.MemberID = (int)value;
            else if (strFieldName == Request.Fields.Days.ToString())
                request.Days = (string)value;
            else if (strFieldName == Request.Fields.ManagerIDs.ToString())
                request.ManagerIDs = (string)value;
            else if (strFieldName == Request.Fields.Response.ToString())
            {
                if (value == null)
                    request.Response = null;
                else
                    request.Response = (int)value;
            }
            else if (strFieldName == Request.Fields.RequestDescription.ToString())
                request.RequestDescription = (string)value;
            else if (strFieldName == Request.Fields.Year.ToString())
                request.Year = (int)value;
            else if (strFieldName == Request.Fields.Year2.ToString())
            {
                if (value == null)
                    request.Year2 = null;
                else
                    request.Year2 = (int)value;
            }
            else if (strFieldName == Request.Fields.MailSendTime.ToString())
            {
                if (value == null)
                    request.MailSendTime = null;
                else
                    request.MailSendTime = (DateTime)value;
            }
        }

        private void ReadHistory(string strFieldName, object value, History history)
        {
            if (strFieldName == History.Fields.MemberID.ToString())
                history.MemberID = (int)value;
            else if (strFieldName == History.Fields.Year.ToString())
                history.Year = (int)value;
            else if (strFieldName == History.Fields.TotalDays.ToString())
                history.TotalDays = (float)value;
            else if (strFieldName == History.Fields.UsedDays.ToString())
                history.UsedDays = (float)value;
            else if (strFieldName == History.Fields.WaitingDays.ToString())
                history.WaitingDays = (float)value;
            else if (strFieldName == History.Fields.RequestIDs.ToString())
                history.RequestIDs = (string)value;
            else if (strFieldName == History.Fields.NextVacationDay.ToString())
                history.NextVacationDay = (DateTime)value;
        }

        private void ReadJobLevel(string strFieldName, object value, JobLevel jobLevel)
        {
            if (strFieldName == JobLevel.Fields.ID.ToString())
                jobLevel.ID = (int)value;
            else if (strFieldName == JobLevel.Fields.LevelName.ToString())
                jobLevel.LevelName = (string)value;
        }

        private void ReadRegularTeam(string strFieldName, object value, RegularTeam team)
        {
            if (strFieldName == RegularTeam.Fields.ID.ToString())
                team.ID = (int)value;
            else if (strFieldName == RegularTeam.Fields.Name.ToString())
                team.Name = (string)value;
            else if (strFieldName == RegularTeam.Fields.ParentID.ToString())
            {
                if (value == null)
                    team.ParentTeamID = null;
                else
                    team.ParentTeamID = (int)value;
            }
        }

        protected delegate string GetFieldNameMethod<DataType>(DataType field, out bool isNullable);

        protected bool SetCondition<DataType>(ref string strCondition, Dictionary<DataType, object> dicConditions, GetFieldNameMethod<DataType> method, string strTableName, ref string strErrorMessage)
        {
            bool isNullable;

            if (dicConditions != null)
            {
                foreach (KeyValuePair<DataType, object> pair in dicConditions)
                {
                    string strFieldName = method(pair.Key, out isNullable);

                    if (SetCondition(ref strCondition, strTableName, strFieldName, pair.Value, isNullable, true) == false)
                    {
                        strErrorMessage = "잘못된 데이터 형식입니다.\r\n" + strTableName + "." + pair.Key.ToString();
                        return false;
                    }
                }
            }

            return true;
        }

        private bool SetCondition(ref string strCondition, string strTableName, string strFieldName, object data, bool isNullable, bool isCondition)
        {
            string strAnd = isCondition ? " and " : ", ";
            strFieldName = strTableName + "." + strFieldName;

            if (isNullable)
            {
                if (data == null)
                {
                    string strNull = isCondition ? " is NULL" : " = NULL";

                    if (strCondition.Length == 0)
                        strCondition = strFieldName + strNull;
                    else
                        strCondition += strAnd + strFieldName + strNull;

                    return true;
                }
            }
            else if (data == null)
                return false;

            if ((data is int) || (data is long) || (data is float) || (data is double))
            {
                if (strCondition.Length == 0)
                    strCondition = strFieldName + " = " + data.ToString();
                else
                    strCondition += strAnd + strFieldName + " = " + data.ToString();
            }
            else if (data is bool)
            {
                bool bData = (bool)data;
                string strData = bData ? "1" : "0";

                if (strCondition.Length == 0)
                    strCondition = strFieldName + " = " + strData;
                else
                    strCondition += strAnd + strFieldName + " = " + strData;
            }
            else if (data is DateTime)
            {
                string strData = TimeString((DateTime)data);

                if (strCondition.Length == 0)
                    strCondition = strFieldName + " = '" + strData + "'";
                else
                    strCondition += strAnd + strFieldName + " = '" + strData + "'";
            }
            else if (data is string)
            {
                string strData = ((string)data).Replace("'", "''");

                if (strCondition.Length == 0)
                    strCondition = strFieldName + " = '" + strData + "'";
                else
                    strCondition += strAnd + strFieldName + " = '" + strData + "'";
            }
            else
                return false;

            return true;
        }

        private string TimeString(DateTime time)
        {
            return string.Format("{0}-{1:00}-{2:00} {3:00}:{4:00}:{5:00}",
                time.Year, time.Month, time.Day,
                time.Hour, time.Minute, time.Second);
        }
    }
}
