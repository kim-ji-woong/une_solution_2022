using System;

namespace BusanTP.Model
{
	public class Sensor
	{
		public enum Fields { ID, Name, PositionName, NodeID, SensorType, Latitude, Longitude, X, Y, ZoneID };

		public int ID { get; set; }
		public string Name { get; set; }
		public string PositionName { get; set; }
		public int? NodeID { get; set; }
		public int? SensorType { get; set; }
		public double? Latitude { get; set; }
		public double? Longitude { get; set; }
		public int? X { get; set; }
		public int? Y { get; set; }
		
		public int? ZoneID { get; set; }

		public static string TableName { get { return "BusanExternalSensor"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.Name ||
				field == Fields.PositionName ||
				field == Fields.NodeID ||
				field == Fields.SensorType ||
				field == Fields.Latitude ||
				field == Fields.Longitude ||
				field == Fields.X ||
				field == Fields.Y ||
				field == Fields.ZoneID)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
