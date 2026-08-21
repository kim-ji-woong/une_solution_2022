namespace BusanTP.Model
{
    public class TestOptions
    {
        public enum Fields { ID, PropertyName, PropertyValue }
        
        public int ID { get; set; }
        
        public string PropertyName { get; set; }
        
        public string PropertyValue { get; set; }
        
        public static string TableName { get { return "BusanTestOptions"; } }
        
        public static string GetFieldName(Fields field, out bool isNullable)
        {
            isNullable = false;
            return field.ToString();
        }
    }
}