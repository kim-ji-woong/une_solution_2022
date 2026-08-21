namespace BusanTP.Model
{
    public class SensorGIS
    {
        public enum Fields { ID, PositionX, PositionY, PositionZ, RotationX, RotationY, RotationZ, Zoom, PositionName, ZoneIDs, Acronym };
        
        public int ID { get; set; }
        public string PositionX { get; set; }
        public string PositionY { get; set; }
        public string PositionZ { get; set; }
        public string RotationX { get; set; }
        public string RotationY { get; set; }
        public string RotationZ { get; set; }
        public string Zoom { get; set; }
        public string PositionName { get; set; }
        public string ZoneIDs { get; set; }
        
        public string Acronym { get; set; }
        
        public static string TableName { get { return "BusanExternalSensorGIS"; } }
        
        public static string GetFieldName(Fields field, out bool isNullable)
        {
            if (field == Fields.PositionX ||
                field == Fields.PositionY ||
                field == Fields.PositionZ ||
                field == Fields.RotationX ||
                field == Fields.RotationY ||
                field == Fields.RotationZ ||
                field == Fields.Zoom ||
                field == Fields.PositionName ||
                field == Fields.ZoneIDs ||
                field == Fields.Acronym)
                isNullable = true;
            else
                isNullable = false;
            
            return field.ToString();
        }
    }
}