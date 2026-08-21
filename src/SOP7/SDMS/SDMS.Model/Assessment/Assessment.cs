using System;
using System.Collections.Generic;
using System.Text;

namespace SDMS.Model.Assessment
{
    public class Assessment : IIDObject
    {
        public enum Fields { ID, EquipmentZoneID, SendDate, SendUserID, Title, Score, ResultDate, UpdateDate, IsPass, Type }
        public int ID { get; set; }
        public int EquipmentZoneID { get; set; }
        public DateTime SendDate { get; set; }
        public int? SendUserID { get; set; }
        /// <summary>
        /// 저장된 평가항목으로 보낸경우 값이있음
        /// </summary>
        public string Title { get; set; }
        /// <summary>
        /// 평가 전체 평균 점수
        /// </summary>
        public float? Score { get; set; }
        /// <summary>
        /// 결과 발표일
        /// </summary>
        public DateTime? ResultDate { get; set; }
        /// <summary>
        /// 제출일 (평가자가 평가 할때마다 업데이트)
        /// </summary>
        public DateTime? UpdateDate { get; set; }
        /// <summary>
        /// 합격/불합격 여부
        /// </summary>
        public bool? IsPass { get; set; }
        /// <summary>
        /// 평가 타입 (1:구역, 2:설비)
        /// </summary>
        public int? Type { get; set; }
        public static string TableName = "SdmsAssessment";

        public static string GetFieldName(Fields field, out bool isNullable)
        {
            if (field == Fields.Score || 
                field == Fields.Title || 
                field == Fields.ResultDate || 
                field == Fields.SendUserID || 
                field == Fields.IsPass || 
                field == Fields.Type)
                isNullable = true;
            else
                isNullable = false;
            return field.ToString();
        }
    }
}
