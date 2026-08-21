using System;
using System.Collections.Generic;
using Vacation.Model;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsDapperDBUtil.Manager;

namespace Vacation.DAL
{
    public class CreateManager : InsertManager
    {
        public CreateManager(IDataManager dataManager)
            : base(dataManager)
        {
        }

        public bool CreateCompanyMember(CompanyMember member, out int addID, out string strErrorMessage)
        {
            member = member.Clone();

            member.Name = CheckQueryString(member.Name);
            member.UserID = CheckQueryString(member.UserID);
            member.PhoneNumber = CheckQueryString(member.PhoneNumber);

            string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX({2}) FROM {0} C), 0) + 1, {3})",
                member.GetTableName(),
                member.GetFieldNames(),
                CompanyMember.Fields.ID,
                GetParamValues(member, CompanyMember.WriteFields.ID.ToString()));

            return m_dbManager.Insert<CompanyMember>(strSQL, member, out addID, out strErrorMessage);
        }

        public bool CreateExternalLogin(ExternalLogin externalLogin, out string strErrorMessage)
        {
            string strSQL = string.Format("Insert into {0} ({1}) values ({2})",
                externalLogin.GetTableName(),
                externalLogin.GetFieldNames(),
                GetParamValues(externalLogin, null));

            return m_dbManager.Insert<ExternalLogin>(strSQL, externalLogin, out strErrorMessage);
        }

        public bool CreateHistory(History history, out string strErrorMessage)
        {
            string strSQL = string.Format("Insert into {0} ({1}) values ({2})",
                history.GetTableName(),
                history.GetFieldNames(),
                GetParamValues(history, null));

            return m_dbManager.Insert<History>(strSQL, history, out strErrorMessage);
        }

        public bool CreateJobLevel(JobLevel jobLevel, out int addID, out string strErrorMessage)
        {
            jobLevel = jobLevel.Clone();
            jobLevel.LevelName = CheckQueryString(jobLevel.LevelName);

            string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX({2}) FROM {0} C), 0) + 1, {3})",
                jobLevel.GetTableName(),
                jobLevel.GetFieldNames(),
                JobLevel.Fields.ID,
                GetParamValues(jobLevel, JobLevel.WriteFields.ID.ToString()));

            return m_dbManager.Insert<JobLevel>(strSQL, jobLevel, out addID, out strErrorMessage);
        }

        public bool CreateOption(VacationOption option, out int addID, out string strErrorMessage)
        {
            option = option.Clone();

            option.PropertyName = CheckQueryString(option.PropertyName);
            option.PropertyValue = CheckQueryString(option.PropertyValue);
            option.Description = CheckQueryString(option.Description);

            string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX({2}) FROM {0} C), 0) + 1, {3})",
                option.GetTableName(),
                option.GetFieldNames(),
                VacationOption.Fields.ID,
                GetParamValues(option, VacationOption.WriteFields.ID.ToString()));

            return m_dbManager.Insert<VacationOption>(strSQL, option, out addID, out strErrorMessage);
        }

        public bool CreateRegularTeam(RegularTeam team, out int addID, out string strErrorMessage)
        {
            team = team.Clone();
            team.Name = CheckQueryString(team.Name);

            string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX({2}) FROM {0} C), 0) + 1, {3})",
                team.GetTableName(),
                team.GetFieldNames(),
                RegularTeam.Fields.ID,
                GetParamValues(team, RegularTeam.WriteFields.ID.ToString()));

            return m_dbManager.Insert<RegularTeam>(strSQL, team, out addID, out strErrorMessage);
        }

        public bool CreateRequest(Request request, out int addID, out string strErrorMessage)
        {
            request = request.Clone();
            request.RequestDescription = CheckQueryString(request.RequestDescription);

            string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX({2}) FROM {0} C), 0) + 1, {3})",
                request.GetTableName(),
                request.GetFieldNames(),
                Request.Fields.ID,
                GetParamValues(request, Request.WriteFields.ID.ToString()));

            return m_dbManager.Insert<Request>(strSQL, request, out addID, out strErrorMessage);
        }

        public bool CreateResponse(Response response, out int addID, out string strErrorMessage)
        {
            response = response.Clone();
            response.Description = CheckQueryString(response.Description);

            string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX({2}) FROM {0} C), 0) + 1, {3})",
                response.GetTableName(),
                response.GetFieldNames(),
                Response.Fields.ID,
                GetParamValues(response, Response.WriteFields.ID.ToString()));

            return m_dbManager.Insert<Response>(strSQL, response, out addID, out strErrorMessage);
        }

        public bool CreateSpecialVacation(SpecialVacation vacation, out int addID, out string strErrorMessage)
        {
            vacation = vacation.Clone();
            vacation.Description = CheckQueryString(vacation.Description);

            string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX({2}) FROM {0} C), 0) + 1, {3})",
                vacation.GetTableName(),
                vacation.GetFieldNames(),
                SpecialVacation.Fields.ID,
                GetParamValues(vacation, SpecialVacation.WriteFields.ID.ToString()));

            return m_dbManager.Insert<SpecialVacation>(strSQL, vacation, out addID, out strErrorMessage);
        }

        public bool CreateSpecialVacationRequest(SpecialVacationRequest request, out int addID, out string strErrorMessage)
        {
            request = request.Clone();
            request.RequestDescription = CheckQueryString(request.RequestDescription);

            string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX({2}) FROM {0} C), 0) + 1, {3})",
                request.GetTableName(),
                request.GetFieldNames(),
                SpecialVacationRequest.Fields.ID,
                GetParamValues(request, SpecialVacationRequest.WriteFields.ID.ToString()));

            return m_dbManager.Insert<SpecialVacationRequest>(strSQL, request, out addID, out strErrorMessage);
        }

        public bool CreateSpecialVacationResponse(SpecialVacationResponse response, out int addID, out string strErrorMessage)
        {
            response = response.Clone();
            response.Description = CheckQueryString(response.Description);

            string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX({2}) FROM {0} C), 0) + 1, {3})",
                response.GetTableName(),
                response.GetFieldNames(),
                SpecialVacationResponse.Fields.ID,
                GetParamValues(response, SpecialVacationResponse.WriteFields.ID.ToString()));

            return m_dbManager.Insert<SpecialVacationResponse>(strSQL, response, out addID, out strErrorMessage);
        }

        public bool CreateVacationOption(VacationOption option, out int addID, out string strErrorMessage)
        {
            option = option.Clone();
            option.PropertyName = CheckQueryString(option.PropertyName);
            option.PropertyValue = CheckQueryString(option.PropertyValue);
            option.Description = CheckQueryString(option.Description);

            string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX({2}) FROM {0} C), 0) + 1, {3})",
                option.GetTableName(),
                option.GetFieldNames(),
                VacationOption.Fields.ID,
                GetParamValues(option, VacationOption.WriteFields.ID.ToString()));

            return m_dbManager.Insert<VacationOption>(strSQL, option, out addID, out strErrorMessage);
        }

        protected string CheckQueryString(string str)
        {
            if (str == null)
                return str;

            return str.Replace("'", "''");
        }

        private string GetParamValues(Table table, string exceptType)
        {
            WebDBManager.DBType dbType = m_dbManager.DatabaseType;

            string strParamChar = "@";
            if (dbType == WebDBManager.DBType.oracle)
                strParamChar = ":";

            string strFields = string.Empty;
            Type writeFields = table.GetWriteFieldType();

            if (writeFields != null)
            {
                foreach (var type in Enum.GetValues(writeFields))
                {
                    if (type.ToString() == exceptType)
                        continue;

                    if (strFields.Length == 0)
                        strFields = strParamChar + type.ToString();
                    else
                        strFields += ", " + strParamChar + type.ToString();
                }
            }

            return strFields;
        }
    }
}
