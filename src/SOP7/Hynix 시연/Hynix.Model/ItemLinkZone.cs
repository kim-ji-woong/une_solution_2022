using System;

namespace Hynix.Model
{
	public class ItemLinkZone
	{
		public enum Fields { ItemID, ZoneID };

		public int ItemID { get; set; }
		public int ZoneID { get; set; }

		public static string TableName { get { return "HynixItemLinkZone"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			isNullable = false;
			return field.ToString();
		}
	}
}
