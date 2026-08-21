using System;
using System.Collections.Generic;
using System.Text;

namespace SensorServer.Model.Yeosu.Public
{
    public class CleanSYS
    {
        public enum Fields { AreaNM, FactManageNM, StackCode, MeasureDT, TspExhstpermstdValue, TspMeasureValue, SoxExhstpermstdValue, SoxMeasureValue, NoxExhstpermstdValue, NoxMeasureValue,
            HclExhstpermstdValue, HclMeasureValue, HfExhstpermstdValue, HfMeasureValue, Nh3ExhstpermstdValue, Nh3MeasureValue, CoExhstpermstdValue, CoMeasureValue }
        public string AreaNM { get; set; }
        public string FactManageNM { get; set; }
        public string StackCode { get; set; }   
        public string MeasureDT { get; set; }   
        public string TspExhstpermstdValue { get; set; }
        public string TspMeasureValue { get; set; }
        public string SoxExhstpermstdValue { get; set; }
        public string SoxMeasureValue { get; set; }
        public string NoxExhstpermstdValue { get; set; }
        public string NoxMeasureValue { get; set; }
        public string HclExhstpermstdValue { get; set; }
        public string HclMeasureValue { get; set; }
        public string HfExhstpermstdValue { get; set; }
        public string HfMeasureValue { get; set; }
        public string Nh3ExhstpermstdValue { get; set; }
        public string Nh3MeasureValue { get; set; }
        public string CoExhstpermstdValue { get; set; } 
        public string CoMeasureValue { get; set; }

        public static string TableName { get { return "YeosuPublicCleanSYS"; } }

        public static string GetFieldName(Fields fields, out bool isNullable)
        {
            if (fields == Fields.AreaNM ||
                fields == Fields.FactManageNM ||
                fields == Fields.StackCode)
                isNullable = false;
            else 
                isNullable = true;
            return fields.ToString();
        }

    }
}
