using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DbBackup.Models.Sop.History
{
    class ActionStepHistoryAutoClose : Table
	{
		public enum Fields { ID, ActionStepHistoryID, ActionStepID, UseCloseNoInput, UseCloseSensorReset, UseCloseSensorResetWaitTime, InputWaitTime, SensorResetWaitTime, BeginTime, SensorZoneID, SensorZoneHistoryID, Description };
		public enum WriteFields { ID, ActionStepHistoryID, ActionStepID, UseCloseNoInput, UseCloseSensorReset, UseCloseSensorResetWaitTime, InputWaitTime, SensorResetWaitTime, BeginTime, SensorZoneID, SensorZoneHistoryID, Description };

		public int ID { get; set; }
		public int ActionStepHistoryID { get; set; }
		public int? ActionStepID { get; set; }
		public int? UseCloseNoInput { get; set; }
		public int? UseCloseSensorReset { get; set; }
		public int? UseCloseSensorResetWaitTime { get; set; }
		public int? InputWaitTime { get; set; }
		public int? SensorResetWaitTime { get; set; }
		public DateTime? BeginTime { get; set; }
		public int? SensorZoneID { get; set; }
		public int? SensorZoneHistoryID { get; set; }
		public string Description { get; set; }

		public static string TableName { get { return "SopHistoryActionStepAutoClose"; } }

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
