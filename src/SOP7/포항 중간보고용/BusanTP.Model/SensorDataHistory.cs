using System;

namespace BusanTP.Model
{
    public class SensorDataHistory
    {
        public enum Fields { SensorID, Value, OriginTimeStamp, TimeStamp }
        
        public int? SensorID { get; set; }
        public double? Value { get; set; }
        public DateTime? OriginTimeStamp { get; set; }
        public DateTime? TimeStamp { get; set; }
        
        public static string TableName { get { return "BusanSensorDataHistory"; } }
        
        public static string GetFieldName(Fields field, out bool isNullable)
        {
            isNullable = false;
            return field.ToString();
        }
    }
}