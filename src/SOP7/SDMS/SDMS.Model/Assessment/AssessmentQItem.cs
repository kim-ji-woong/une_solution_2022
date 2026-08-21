using System;
using System.Collections.Generic;
using System.Text;

namespace SDMS.Model.Assessment
{
    public class AssessmentQItem : IIDObject
    {
        public enum Fields { ID, QID, Contents }
        public int ID { get; set; }
        /// <summary>
        /// AssessmentQ ID
        /// </summary>
        public int QID { get; set; }
        public string Contents { get; set; }

        public static string TableName = "SdmsAssessmentQItem";

        public static string GetFieldName(Fields field, out bool isNullable)
        {
            isNullable = false;
            return field.ToString();
        }
    }
}
