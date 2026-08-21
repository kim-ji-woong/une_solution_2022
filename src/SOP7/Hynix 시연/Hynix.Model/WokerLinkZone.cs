using System;

namespace Hynix.Model
{
	public class WokerLinkZone
	{
		public enum Fields { WorkerID, ZoneID };

		public int WorkerID { get; set; }
		public int ZoneID { get; set; }

		public static string TableName { get { return "HynixWokerLinkZone"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			isNullable = false;
			return field.ToString();
		}
	}
}
