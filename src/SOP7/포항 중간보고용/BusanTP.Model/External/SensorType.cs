using System;

namespace BusanTP.Model
{
	public class SensorType
	{
		public enum Fields { ID, Name, EngName };

		public int ID { get; set; }
		public string Name { get; set; }
		public string EngName { get; set; }

		public static string TableName { get { return "BusanExternalSensorType"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.Name ||
				field == Fields.EngName)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
