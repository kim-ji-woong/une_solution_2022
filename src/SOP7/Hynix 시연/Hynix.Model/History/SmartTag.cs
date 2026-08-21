using System;

namespace Hynix.Model.History
{
	public class SmartTag
	{
		public enum Fields { SmartTagHistoryID, Time, SmartTagID, SmartTagReaderID };

		public int SmartTagHistoryID { get; set; }
		public DateTime Time { get; set; }
		public int SmartTagID { get; set; }
		public int SmartTagReaderID { get; set; }

		public static string TableName { get { return "HynixSmartTagHistory"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			isNullable = false;
			return field.ToString();
		}
	}
}
