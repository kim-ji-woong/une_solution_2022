using History.BLL.Models.Data;
using SDMS.Model.Assessment;
using System;
using System.Collections.Generic;
using System.Text;

namespace History.BLL.Models.Response
{
    public class ResponseAssessmentHistories
    {
        private List<AssessmentHistoryData> m_assessmentHistoryDatas = new List<AssessmentHistoryData>();
        public List<AssessmentHistoryData> AssessmentHistories
        {
            get { return m_assessmentHistoryDatas; }
            set { m_assessmentHistoryDatas = value; }
        }
    }

    public class AssessmentHistoryData
    {
        public int AssessmentID { get; set; }
        public string Title { get; set; }
        public string Position { get; set; }
        public string ZoneName { get; set; }
        public string SendDate { get; set; }
        public string ResultDate { get; set; }
        public string UpdateDate { get; set; }
        /// <summary>
        /// 평가자
        /// </summary>
        public string Evaluator { get; set; }
        public string Score { get; set; }
        public int Type { get; set; }
    }

    public class ResponseAssessmentDetails
    {
        /// <summary>
        /// 문항
        /// </summary>
        public List<AssessmentA> AList { get; set; }
        /// <summary>
        /// 응답데이터
        /// </summary>
        public List<MemberScore> MemberScores { get; set; }

    }

    public class MemberScore
    {
        public int MemberID { get; set; }
        public string MemberName { get; set; }
        public float AvgScore { get; set; }
        public string ScoreClass { get; set; }
        public bool? IsPass { get; set; }
        //public string Memo { get; set; }
        public List<AItemData> AItems { get; set; }
        public int Type { get; set; }
    }

    public class AItemData
    {
        public int AID { get; set; }
        public string Contents { get; set; }
        public float Score { get; set; }
        public string Memo { get; set; }
    }

    public class ResAssessmentClass
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public List<AssessmentClassData> AssessmentClasses { get; set; }
    }
}
