using System;

namespace Hynix.Model
{
	public class SmartTag
	{
		public enum Fields { SmartTagID, UniqueKey, WorkerID, ItemID };

		public int SmartTagID { get; set; }
		public string/* nullable */ UniqueKey { get; set; }
		public int? WorkerID { get; set; }
		public int? ItemID { get; set; }

		public static string TableName { get { return "HynixSmartTag"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.UniqueKey ||
				field == Fields.WorkerID ||
				field == Fields.ItemID)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
