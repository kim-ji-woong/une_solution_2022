using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace BusanSensorServer.Model
{
    public class TestEvents : Table
    {
        public enum Fields { ID, NodeID, UniqueID, Value, RegDate };
        
        public int ID { get; set; }
        
        public int NodeID { get; set; }
        
        public int UniqueID { get; set; }
        
        public double Value { get; set; }
        
        public DateTime RegDate { get; set; }
        
        public static string TableName { get { return "BusanTestEvent"; } }
        
        public override string GetTableName()
        {
            return TableName;
        }
        
        public static string GetFieldName(Fields field, out bool isNullable)
        {
            isNullable = false;
            return field.ToString();
        }
    }
}