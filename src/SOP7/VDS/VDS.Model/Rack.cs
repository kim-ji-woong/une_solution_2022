using System;

namespace VDS.Model
{
	public class Rack
	{
		public enum Fields { ID, Name, CenterID, RackGroupID, RackTypeID, Rotation, X, Y, Z, RegDate, ChangeDate };

		public int ID { get; set; }
		public string Name { get; set; }
		public int CenterID { get; set; }
		public int? RackGroupID { get; set; }
		public int RackTypeID { get; set; }
		public double Rotation { get; set; }
		public int X { get; set; }
		public int Y { get; set; }
		public int Z { get; set; }
		public DateTime RegDate { get; set; }
		public DateTime? ChangeDate { get; set; }

		public static string TableName { get { return "Rack"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.RackGroupID ||
				field == Fields.ChangeDate)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
