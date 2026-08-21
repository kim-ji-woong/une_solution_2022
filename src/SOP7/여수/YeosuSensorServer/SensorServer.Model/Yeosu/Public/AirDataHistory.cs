using System;
using System.Collections.Generic;
using System.Text;

namespace SensorServer.Model.Yeosu.Public
{
    public class AirDataHistory
    {
        public enum Fields { ID, SiteID, LogDate, SO2, NO2, O3, CO, PM10, PM25, PM10Daily, PM25Daily, Khai,
            SO2Grade, NO2Grade, O3Grade, COGrade, PM10Grade, PM25Grade, PM10Grade1h, PM25Grade1h, KhaiGrade, SO2Flag, NO2Flag, O3Flag, COFlag, PM10Flag, PM25Flag }

        public int ID { get; set; }
        public int SiteID { get; set; }
        public string LogDate { get; set; }
        public float? SO2 { get; set; }
        public float? NO2 { get; set; }
        public float? O3 { get; set; }
        public float? CO { get; set; }
        public float? PM10 { get; set; }
        public float? PM25 { get; set; }
        public float? PM10Daily { get; set; }
        public float? PM25Daily { get; set; }
        public float? Khai { get; set; }
        public int? SO2Grade { get; set; }
        public int? NO2Grade { get; set; }
        public int? O3Grade { get; set; }
        public int? COGrade { get; set; }
        public int? PM10Grade { get; set; }
        public int? PM25Grade { get; set; }
        public int? PM10Grade1h { get; set; }
        public int? PM25Grade1h { get; set; }
        public int? KhaiGrade { get; set; }
        public float? SO2Flag { get; set; }
        public float? NO2Flag { get; set; }
        public float? O3Flag { get; set; }
        public float? COFlag { get; set; }
        public float? PM10Flag { get; set; }
        public float? PM25Flag { get; set; }


        public static string TableName { get { return "YeosuPublicAirDataHistory"; } }

        public static string GetFieldName(Fields field, out bool isNullable)
        {
            if (field == Fields.SO2 ||
                field == Fields.NO2 ||
                field == Fields.O3 ||
                field == Fields.CO ||
                field == Fields.PM10 ||
                field == Fields.PM25 ||
                field == Fields.PM10Daily ||
                field == Fields.PM25Daily ||
                field == Fields.Khai ||
                field == Fields.SO2Grade ||
                field == Fields.NO2Grade ||
                field == Fields.O3Grade ||
                field == Fields.COGrade ||
                field == Fields.PM10Grade ||
                field == Fields.PM25Grade ||
                field == Fields.PM10Grade1h ||
                field == Fields.PM25Grade1h ||
                field == Fields.KhaiGrade ||
                field == Fields.SO2Flag ||
                field == Fields.NO2Flag ||
                field == Fields.O3Flag ||
                field == Fields.COFlag ||
                field == Fields.PM10Flag ||
                field == Fields.PM25Flag)
                isNullable = true;
            else 
                isNullable = false;
            return field.ToString();
        }

    }
}
