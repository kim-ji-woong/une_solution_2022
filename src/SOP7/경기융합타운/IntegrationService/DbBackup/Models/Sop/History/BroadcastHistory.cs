using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DbBackup.Models.Sop.History
{
    class BroadcastHistory : Table
	{
		public enum Fields { ActionStepHistoryID, ComponentID, EventTime, Status };
		public enum WriteFields { ActionStepHistoryID, ComponentID, EventTime, Status };

		public int ActionStepHistoryID { get; set; }
		public int ComponentID { get; set; }
		public DateTime EventTime { get; set; }
		public int Status { get; set; }

		public static string TableName { get { return "SopHistoryBroadcast"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1} and {2} = {3}", Fields.ActionStepHistoryID, ActionStepHistoryID, Fields.ComponentID, ComponentID);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}
	}
}
