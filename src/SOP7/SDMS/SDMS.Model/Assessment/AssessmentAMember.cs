using System;
using System.Collections.Generic;
using System.Text;

namespace SDMS.Model.Assessment
{
    public class AssessmentAMember
    {
        public enum Fields { AssessmentID, MemberID, Score, IsPass, Memo }
        /// <summary>
        /// Assessment ID
        /// </summary>
        public int AssessmentID { get; set; }
        public int MemberID { get; set; }
        public float? Score { get; set; }
        public bool? IsPass { get; set; }
        public string Memo { get; set; }
        public static string TableName = "SdmsAssessmentAMember";

        public static string GetFieldName(Fields field, out bool isNullable)
        {
            if (field == Fields.Score ||
                field == Fields.IsPass ||
                field == Fields.Memo)
                isNullable = true;
            else
                isNullable = false;

            return field.ToString();
        }
    }
}
