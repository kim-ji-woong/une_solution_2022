using System;
using System.Collections.Generic;
using System.Text;

namespace SDMS.Model.Assessment
{
    public class AssessmentA : IIDObject
    {
        public enum Fields { ID, AssessmentID, Contents }
        public int ID { get; set; }
        /// <summary>
        /// Assessment ID
        /// </summary>
        public int AssessmentID { get; set; }
        public string Contents { get; set; }
        public static string TableName = "SdmsAssessmentA";

        public static string GetFieldName(Fields field, out bool isNullable)
        {
            isNullable = false;
            return field.ToString();
        }
    }
}
