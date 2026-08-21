using System;

namespace VDS.Model.Sensor
{
	public class Sensor
	{
		public enum Fields { ID, Name, SensorTypeID, CenterID, RegDate, ChangeDate, X, Y, Z, Description };

		public int ID { get; set; }
		public string Name { get; set; }
		public int SensorTypeID { get; set; }
		public int CenterID { get; set; }
		public DateTime RegDate { get; set; }
		public DateTime? ChangeDate { get; set; }
		public int X { get; set; }
		public int Y { get; set; }
		public int Z { get; set; }
		public string Description { get; set; }

		public static string TableName { get { return "Sensor"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.ChangeDate ||
				field == Fields.Description)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
