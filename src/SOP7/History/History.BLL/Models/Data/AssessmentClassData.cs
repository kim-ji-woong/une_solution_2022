using System;
using System.Collections.Generic;
using System.Text;

namespace History.BLL.Models.Data
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
}
