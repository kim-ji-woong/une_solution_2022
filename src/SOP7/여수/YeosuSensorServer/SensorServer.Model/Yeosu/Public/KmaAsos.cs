using System;
using System.Collections.Generic;
using System.Text;

namespace SensorServer.Model.Yeosu.Public
{
    public class KmaAsos
    {
        public enum Fields { ID, LogDate, WD, WS, Pressure, SeaLevelPressure, Temperature, DewPointTemp, Humidity, Evaporation, Rainfall, Snowfall3hr, SnowfallDay, SnowfallCover,
                                CurrentWeather, CloudAmount, CloudAmountMid, CloudHeightMin, Visibility, HourSunshine, HoursolarRadiation, GrounStatusCode, Grounttemp, Temperature005m, Temperature01m,
                                Temperature02m, Temperature03m, RainfallDay, StnID} // StnID = 지점코드

        public int ID { get; set; }
        public string LogDate { get; set; }
        public int? WD { get; set; }
        public float? WS { get; set; }
        public float? Pressure { get; set; }
        public float? SeaLevelPressure { get; set; }
        public float? Temperature { get; set; }
        public float? DewPointTemp { get; set; }
        public int? Humidity { get; set; }
        public float? Evaporation { get; set; }
        public float? Rainfall { get; set; }
        public float? Snowfall3hr { get; set; }
        public float? SnowfallDay { get; set; }
        public float? SnowfallCover { get; set; }
        public int? CurrentWeather { get; set; }
        public string CloudAmount { get; set; }
        public string CloudAmountMid { get; set; }
        public string CloudHeightMin { get; set; }
        public int? Visibility { get; set; }
        public float? HourSunshine { get; set; }
        public float? HoursolarRadiation { get; set; }
        public int? GrounStatusCode { get; set; }
        public float? Grounttemp { get; set; }
        public float? Temperature005m { get; set; }
        public float? Temperature01m { get; set; }
        public float? Temperature02m { get; set; }
        public float? Temperature03m { get; set; }
        public float? RainfallDay { get; set; }
        public int? StnID { get; set; }

        public static string TableName { get { return "YeosuPublicKma_Asos"; } }

        public static string GetFieldName(Fields fields, out bool isNullable)
        {
            if (fields == Fields.WD ||
                fields == Fields.WS ||
                fields == Fields.Pressure ||
                fields == Fields.SeaLevelPressure ||
                fields == Fields.Temperature ||
                fields == Fields.DewPointTemp ||
                fields == Fields.Humidity ||
                fields == Fields.Evaporation ||
                fields == Fields.Rainfall ||
                fields == Fields.Snowfall3hr ||
                fields == Fields.SnowfallDay ||
                fields == Fields.SnowfallCover ||
                fields == Fields.CurrentWeather ||
                fields == Fields.CloudAmount ||
                fields == Fields.CloudAmountMid ||
                fields == Fields.CloudHeightMin ||
                fields == Fields.Visibility ||
                fields == Fields.HourSunshine ||
                fields == Fields.HoursolarRadiation ||
                fields == Fields.GrounStatusCode ||
                fields == Fields.Grounttemp ||
                fields == Fields.Temperature005m ||
                fields == Fields.Temperature01m ||
                fields == Fields.Temperature02m ||
                fields == Fields.Temperature03m ||
                fields == Fields.RainfallDay
                )
                isNullable = true;
            else 
                isNullable = false;
            return fields.ToString();
        }
    }
}
