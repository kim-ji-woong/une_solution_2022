using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace BusanSensorServer.Model.External
{
    public class Sensor : Table
    {
        public enum Fields { ID, Name, PositonName, NodeID, SensorType, Latitude, Longitude, X, Y };
        
        public int ID { get; set; }
        public string Name { get; set; }
        public string PositionName { get; set; }
        public int NodeID { get; set; }
        public int SensorType { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public double X { get; set; }
        public double Y { get; set; }
        
        public static string GetTableName { get { return "BusanSensorDataHistory"; } }
        
        public static string GetFieldName(Fields field, out bool isNullable)
        {
            if (field == Fields.Name ||
                field == Fields.PositonName ||
                field == Fields.NodeID ||
                field == Fields.X ||
                field == Fields.Y ||
                field == Fields.Latitude ||
                field == Fields.Longitude)
                isNullable = true;
            else
                isNullable = false;
            
            return field.ToString();
        }
    }
}