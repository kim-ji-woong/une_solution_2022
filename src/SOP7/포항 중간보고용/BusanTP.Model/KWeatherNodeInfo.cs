namespace BusanTP.Model
{
    public class KWeatherNodeInfo
    {
        public enum Fields { ID, ZoneID, UniqueKey, Name, ManagementNo, PositionName, SerialNo, Latitude, Longitude }
        
        public int ID { get; set; }
        public int ZoneID { get; set; }
        public string UniqueKey { get; set; }
        public string Name { get; set; }
        public string ManagementNo { get; set; }
        public string PositionName { get; set; }
        public string SerialNo { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        
        public static string TableName { get { return "BusanKWeatherNodeInfo"; } }
        
        public static string GetFieldName(Fields field, out bool isNullable)
        {
            if (field == Fields.Latitude ||
                field == Fields.Longitude)
                isNullable = true;
            else
                isNullable = false;
            return field.ToString();
        }
    }
}