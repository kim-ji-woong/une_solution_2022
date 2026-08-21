using System;

namespace BusanTP.Model
{
	public class Material
	{
		public enum Fields { MaterialID, UniqueID, Min1, Max1, Min2, Max2, Direction, Info };

		public int MaterialID { get; set; }
		public int UniqueID { get; set; }
		public double? Min1 { get; set; }
		public double? Max1 { get; set; }
		public double? Min2 { get; set; }
		public double? Max2 { get; set; }
		public int? Direction { get; set; }
		public string Info { get; set; }

		public static string TableName { get { return "BusanExternalMaterial"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.Min1 ||
				field == Fields.Max1 ||
				field == Fields.Min2 ||
				field == Fields.Max2 ||
				field == Fields.Direction ||
				field == Fields.Info)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
