using System;
using System.Collections.Generic;
using System.Text;

namespace SDMS.Model.Assessment
{
    public class AssessmentAItem
    {
        public enum Fields { AssessmentID, AID, MemberID, Score, Memo }
        /// <summary>
        /// Assessment ID
        /// </summary>
        public int AssessmentID { get; set; }
        /// <summary>
        /// AssessmentA ID
        /// </summary>
        public int AID { get; set; }
        public int MemberID { get; set; }
        public float Score { get; set; }
        /// <summary>
        /// 비고
        /// </summary>
        public string Memo { get; set; }
        public static string TableName = "SdmsAssessmentAItem";

        public static string GetFieldName(Fields field, out bool isNullable)
        {
            if (field == Fields.Memo)
                isNullable = true;
            else
                isNullable = false;
            return field.ToString();
        }
    }
}
