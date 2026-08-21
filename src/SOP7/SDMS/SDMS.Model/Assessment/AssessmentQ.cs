using System;
using System.Collections.Generic;
using System.Text;

namespace SDMS.Model.Assessment
{
    public class AssessmentQ : IIDObject
    {
        public enum Fields { ID, Title, CreateDate, UpdateDate, RegisterUserID, EquipZoneID, MemberIDs, Type };

        public int ID { get; set; }
        public string Title { get; set; }
        /// <summary>
        /// 생성일자
        /// </summary>
        public DateTime CreateDate { get; set; }
        /// <summary>
        /// 수정일자
        /// </summary>
        public DateTime UpdateDate { get; set; }
        public int? RegisterUserID { get; set; }
        /// <summary>
        /// EquipZone(구역) ID
        /// </summary>
        public int? EquipZoneID { get; set; }
        /// <summary>
        /// 수신자 IDs
        /// </summary>
        public string MemberIDs { get; set; }
        /// <summary>
        /// 평가 타입 (1:구역, 2:설비)
        /// </summary>
        public int? Type { get; set; }
        public static string TableName = "SdmsAssessmentQ";

        public static string GetFieldName(Fields field, out bool isNullable)
        {
            if (field == Fields.Title ||
                field == Fields.RegisterUserID ||
                field == Fields.MemberIDs ||
                field == Fields.Type ||
                field == Fields.EquipZoneID)
                isNullable = true;
            else
                isNullable = false;

            return field.ToString();
        }
    }
}
