using System;

namespace BusanTP.Model
{
    public class WeatherSensorDataHistory
    {
        public enum Fields {ID, SensorID, Value, OriginTimeStamp, TimeStamp }
       
        public int? ID { get; set; }
        public int? SensorID { get; set; }
        public double? Value { get; set; }
        public DateTime? OriginTimeStamp { get; set; }
        public DateTime? TimeStamp { get; set; }
        
        public static string TableName { get { return "BusanWeatherSensorDataHistory"; } }
        
        public static string GetFieldName(Fields field, out bool isNullable)
        {
            if (field == Fields.ID)
            {
                isNullable = false;
            }
            else 
                isNullable = true;
            
            return field.ToString();
        }
    }
}