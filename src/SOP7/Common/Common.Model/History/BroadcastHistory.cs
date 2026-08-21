using System;

namespace Common.Model.History
{
    public class BroadcastHistory
    {
		public enum BroadcastStatus { Run = 0, Complete, Stop, Pause, TimeOut };
		public enum Fields { ActionStepHistoryID, ComponentID, EventTime, Status };

		public int ActionStepHistoryID { get; set; }
		public int ComponentID { get; set; }
		public DateTime EventTime { get; set; }
		public int Status { get; set; }

		public static string TableName { get { return "SopHistoryBroadcast"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			isNullable = false;
			return field.ToString();
		}
	}
}
