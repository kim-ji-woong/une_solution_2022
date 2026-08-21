using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DbBackup.Models.Sop.History
{
    class ComponentHistory : Table
	{
		public enum Fields { ID, ActionStepHistoryID, ComponentID, ComponentType, Time, Status, Task, CompleteCount, ShowBoard, AccessedUserID, CheckedNotify1, CheckedNotify2, CheckedRun, CheckedComplete, Description };
		public enum WriteFields { ID, ActionStepHistoryID, ComponentID, ComponentType, Time, Status, Task, CompleteCount, ShowBoard, AccessedUserID, CheckedNotify1, CheckedNotify2, CheckedRun, CheckedComplete, Description };

		public int ID { get; set; }
		public int ActionStepHistoryID { get; set; }
		public int ComponentID { get; set; }
		public int ComponentType { get; set; }
		public DateTime Time { get; set; }
		public int Status { get; set; }
		public string Task { get; set; }
		public int? CompleteCount { get; set; }
		public bool? ShowBoard { get; set; }
		public int? AccessedUserID { get; set; }
		public int? CheckedNotify1 { get; set; }
		public int? CheckedNotify2 { get; set; }
		public int? CheckedRun { get; set; }
		public int? CheckedComplete { get; set; }
		public string Description { get; set; }

		public static string TableName { get { return "SopHistoryComponent"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.ID, ID);
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
