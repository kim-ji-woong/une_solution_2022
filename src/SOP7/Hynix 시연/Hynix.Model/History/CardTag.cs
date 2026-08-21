using System;

namespace Hynix.Model.History
{
	public class CardTag
	{
		public enum TaggingTypes { OutGoing = 0, Incoming };

		public enum Fields { CardTagHistoryID, Time, CardID, CardReaderID, Type, IsApprove };

		public int CardTagHistoryID { get; set; }
		public DateTime Time { get; set; }
		public int CardID { get; set; }
		public int CardReaderID { get; set; }
		public int Type { get; set; }
		public bool IsApprove { get; set; }

		public static string TableName { get { return "HynixCardTagHistory"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			isNullable = false;
			return field.ToString();
		}
	}
}
