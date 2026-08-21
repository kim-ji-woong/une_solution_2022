using System;
using System.Collections.Generic;
using System.Text;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Vacation.Model
{
    public class SpecialVacationRequest : Table
    {
        public enum Fields { ID, Days, RequestTime, RequestManagerID, MemberIDs, ResponseManagerIDs, Response, RequestDescription };
        public enum WriteFields { ID, Days, RequestTime, RequestManagerID, MemberIDs, ResponseManagerIDs, Response, RequestDescription };

        private int m_nID = -1;
        // 휴가일수
        private float m_fDays = 0;
        // 휴가 요청시간
        private DateTime m_requestTime = new DateTime();
        // 특별휴가를 신청한 담당자
        private int m_nRequestManagerID = -1;
        // 특별휴가를 부여받는 직원들
        private string m_strMemberIDs = "";
        //private List<int> m_memberIDs = new List<int>();
        // 휴가 승인권자 리스트
        private string m_strResponseManagerIDs = "";
        //private List<int> m_responseManagerIDs = new List<int>();
        private int? m_response = null;
        //private Model.Response.ResponseType m_response;
        private string m_strRequestDescription = null;

        public SpecialVacationRequest()
        {
        }

        public int ID
        {
            get { return m_nID; }
            set { m_nID = value; }
        }

        // 휴가일수
        public float Days
        {
            get { return m_fDays; }
            set { m_fDays = value; }
        }

        // 휴가 요청시간
        public DateTime RequestTime
        {
            get { return m_requestTime; }
            set { m_requestTime = value; }
        }

        // 특별휴가를 신청한 담당자
        public int RequestManagerID
        {
            get { return m_nRequestManagerID; }
            set { m_nRequestManagerID = value; }
        }

        // 특별휴가를 부여받는 직원들
        public string MemberIDs
        //public List<int> MemberIDs
        {
            get { return m_strMemberIDs; }
            set { m_strMemberIDs = value; }
        }

        // 휴가 승인권자 리스트
        public string ResponseManagerIDs
        //public List<int> ResponseManagerIDs
        {
            get { return m_strResponseManagerIDs; }
            set { m_strResponseManagerIDs = value; }
        }

        public int? Response
        {
            get { return m_response; }
            set { m_response = value; }
        }

        public string RequestDescription
        {
            get { return m_strRequestDescription; }
            set { m_strRequestDescription = value; }
        }

        public static string GetFieldName(Fields field, out bool isNullable)
        {
            if (field == Fields.Response ||
                field == Fields.RequestDescription)
                isNullable = true;
            else
                isNullable = false;

            return field.ToString();
        }

        public override string GetTableName()
        {
            return "SpecialVacationRequest";
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

        public SpecialVacationRequest Clone()
        {
            return (SpecialVacationRequest)this.MemberwiseClone();
        }
    }
}
