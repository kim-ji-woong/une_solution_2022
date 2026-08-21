using System;
using System.Collections.Generic;
using System.Text;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Vacation.Model
{
    public class SpecialVacationResponse : Table
    {
        public enum Fields { ID, RequestID, ManagerID, Response, ResponseTime, ResponseDescription, PrevResponseID };
        public enum WriteFields { ID, RequestID, ManagerID, Response, ResponseTime, ResponseDescription, PrevResponseID };

        private int m_nID = -1;
        private int m_nRequestID = -1;
        private int m_nManagerID = -1;
        private Response.ResponseType m_response = Response.ResponseType.None;
        private DateTime? m_responseTime = null;
        private string m_strDescription = null;
        private int? m_nPrevResponseID = null;

        public int ID
        {
            get { return m_nID; }
            set { m_nID = value; }
        }

        public int RequestID
        {
            get { return m_nRequestID; }
            set { m_nRequestID = value; }
        }

        public int ManagerID
        {
            get { return m_nManagerID; }
            set { m_nManagerID = value; }
        }

        public Response.ResponseType Result
        {
            get { return m_response; }
            set { m_response = value; }
        }

        public DateTime? ResponseTime
        {
            get { return m_responseTime; }
            set { m_responseTime = value; }
        }

        public string Description
        {
            get { return m_strDescription; }
            set { m_strDescription = value; }
        }

        public int? PrevResponseID
        {
            get { return m_nPrevResponseID; }
            set { m_nPrevResponseID = value; }
        }

        public static string GetFieldName(Fields field, out bool isNullable)
        {
            if (field == Fields.Response ||
                field == Fields.ResponseDescription ||
                field == Fields.ResponseTime ||
                field == Fields.PrevResponseID)
                isNullable = true;
            else
                isNullable = false;

            return field.ToString();
        }

        public override string GetTableName()
        {
            return "SpecialVacationResponse";
        }

        public override string GetPrimaryCondition()
        {
            return string.Format("ID = {0}", ID);
        }

        public override Type GetFieldType()
        {
            return typeof(Fields);
        }

        public override Type GetWriteFieldType()
        {
            return typeof(WriteFields);
        }

        public SpecialVacationResponse Clone()
        {
            return (SpecialVacationResponse)this.MemberwiseClone();
        }
    }
}
