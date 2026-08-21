namespace BusanTP.Model
{
    public class POIInfo
    {
        public enum Fields { ID, POIType, POIName, Latitude, Longitude, X, Y, Z, SpaceID };
        
        public int ID { get; set; }
        public int? POIType { get; set; }
        public string POIName { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public double? X { get; set; }
        public double? Y { get; set; }
        public double? Z { get; set; }
        
        public int? SpaceID { get; set; }
        
        public static string TableName { get { return "BusanExternalPoiInfo"; } }

        public static string GetFieldName(Fields field, out bool isNullable)
        {
            if (Fields.POIName == field ||
                Fields.Latitude == field ||
                Fields.Longitude == field ||
                Fields.X == field ||
                Fields.Y == field ||
                Fields.Z == field ||
                Fields.SpaceID == field)
                isNullable = true;
            else
                isNullable = false;
            
            return field.ToString();
        }
    }
}