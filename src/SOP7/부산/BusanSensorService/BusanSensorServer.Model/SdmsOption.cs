using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace BusanSensorServer.Model
{
    public class SdmsOption : Table
    {
        public enum Fields { ID, PropertyName, PropertyValue, SiteID, Description };
        
        public int ID { get; set; }
        
        public string PropertyName { get; set; }
        
        public bool PropertyValue { get; set; }
        
        public int SiteID { get; set; }
        
        public string Description { get; set; }
        
        public static string TableName { get { return "BusanSdmsOption"; } }
        
        public override string GetTableName()
        {
            return TableName;
        }
        
        public static string GetFieldName(Fields field, out bool isNullable)
        {
            if (field == Fields.Description)
                isNullable = true;
            else
                isNullable = false;
            
            return field.ToString();
        }
    }
}