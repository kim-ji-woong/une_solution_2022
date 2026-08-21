using System;
using System.Collections.Generic;
using System.Text;

namespace SDMS.BLL.Models.Data
{
    public class AssessmentClassData
    {
        public AssessmentClassData(string strClassName, int nStartScore, int nEndScore)
        {
            this.ClassName = strClassName;
            this.StartScore = nStartScore;
            this.EndScore = nEndScore;
        }

        public string ClassName { get; set; }
        public int StartScore { get; set; }
        public int EndScore { get; set; }
    }

    public class AutoAssessmentData
    {
        public enum AutoType { None = 0, Month, Week }

        public AutoAssessmentData()
        {

        }
        public AutoAssessmentData(int nType, int nDate)
        {
            this.Type = nType;
            this.Date = nDate;
        }

        public int Type { get; set; }
        public int Date { get; set; }
    }

    public class AssessmentQListData
    {
        public AssessmentQListData()
        {

        }
        public AssessmentQListData(Model.Assessment.AssessmentQ qData)
        {
            this.Q = qData;
        }
        public Model.Assessment.AssessmentQ Q { get; set; }
        public List<string> Contents { get; set; }
    }


    public class AListData
    {
        public int ID { get; set; }
        /// <summary>
        /// Assessment ID
        /// </summary>
        public int AssessmentID { get; set; }
        public string Contents { get; set; }
        public float? Score { get; set; }
        public string Memo { get; set; }
    }
}
