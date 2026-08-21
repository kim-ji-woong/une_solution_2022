using System;

namespace VDS.Model
{
	public class Item_RU
	{
		public enum Fields { ItemID, RackID, UPos };

		public int ItemID { get; set; }
		public int RackID { get; set; }
		public int UPos { get; set; }

		public static string TableName { get { return "Item_RU"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			isNullable = false;
			return field.ToString();
		}
	}
}
