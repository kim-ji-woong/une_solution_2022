
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace BusanSensorServer.Model.Sensor
{
    public class DataHistory : Table
    {
        public enum Fields {ID, SensorID, Value, OriginTimeStamp, TimeStamp};
        
        public enum WriteFields {ID, SensorID, Value, OriginTimeStamp, TimeStamp};
        
        public int ID { get; set; }
        public int SensorID { get; set; }
        public double Value { get; set; }
        public string OriginTimeStamp { get; set; }
        public string TimeStamp { get; set; }
        
        //public static string GetTableName { get { return "BusanSensorDataHistory"; } }
        
        public static string TableName { get { return "BusanSensorDataHistory"; } }

        public override string GetTableName()
        {
            return TableName;
        }
        
        public static string GetFieldName(Fields field, out bool isNullable)
        {
            if (field == Fields.Value ||
                field == Fields.OriginTimeStamp ||
                field == Fields.TimeStamp)
                isNullable = true;
            else
                isNullable = false;
            
            return field.ToString();
        }
    }
}