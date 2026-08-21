using System;
using System.Collections.Generic;
using System.Text;

namespace SensorServer.Model.Yeosu
{
    public class EtcSensorData
    {
        public enum Fields { ID, SensorID, SensorType, X, Y, Latitude, Longitude, PositionName };

        public int ID { get; set; }
        public int SensorID { get; set; }
        public int? SensorType { get; set; }
        public float? X { get; set; }
        public float? Y { get; set; }
        public float? Latitude { get; set; }
        public float? Longitude { get; set; }
        public string PositionName { get; set; }


        public static string TableName { get { return "YeosuEtcSensorData"; } }

        public static string GetFieldName(Fields field, out bool isNullable)
        {
            if (field == Fields.SensorType ||
                field == Fields.X ||
                field == Fields.Y ||
                field == Fields.Latitude ||
                field == Fields.Longitude ||
                field == Fields.PositionName)
                isNullable = true;
            else 
                isNullable = false;
            return field.ToString();
        }
    }
}
