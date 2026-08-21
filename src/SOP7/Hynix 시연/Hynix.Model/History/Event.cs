using System;

namespace Hynix.Model.History
{
	public class Event
	{
		public const int DoorOpen = 1;
		public const int Abnormal = 2;

		public enum Fields { EventHistroyID, CardReaderID, WorkerID, Time, Type };

		public int EventHistroyID { get; set; }
		public int? CardReaderID { get; set; }
		public int? WorkerID { get; set; }
		public DateTime Time { get; set; }
		public int Type { get; set; }

		public static string TableName { get { return "HynixEventHistroy"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.CardReaderID ||
				field == Fields.WorkerID)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
