using System;
using System.Collections.Generic;
using System.Text;

namespace VDS.Model
{
	public class Facility
	{
		public enum Fields { ID, FacilityTypeID, DataCenterID, RegDate, ChangeDate, X, Y, Z, Rotation };

		public int ID { get; set; }
		public int FacilityTypeID { get; set; }
		public int DataCenterID { get; set; }
		public DateTime? RegDate { get; set; }
		public DateTime? ChangeDate { get; set; }
		public int X { get; set; }
		public int Y { get; set; }
		public int Z { get; set; }
		public double Rotation { get; set; }

		public static string TableName { get { return "Facility"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.RegDate ||
				field == Fields.ChangeDate)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
