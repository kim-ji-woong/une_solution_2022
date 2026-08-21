using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Nipa.Model.Sop.History
{
	public class ActionStep : Table
	{
		public enum Fields { ID, ActionStepID, RealMode, BeginTime, EndTime, LastAccessedTime, DetectEndTime, DetectTime, Position, LastAccessedUserID, StartOption, DisasterOption, SensorZoneHistoryID, Description };
		public enum WriteFields { ID, ActionStepID, RealMode, BeginTime, EndTime, LastAccessedTime, DetectEndTime, DetectTime, Position, LastAccessedUserID, StartOption, DisasterOption, SensorZoneHistoryID, Description };

		public int ID { get; set; }
		public int ActionStepID { get; set; }
		public bool? RealMode { get; set; }
		public DateTime BeginTime { get; set; }
		public DateTime? EndTime { get; set; }
		public DateTime? LastAccessedTime { get; set; }
		public DateTime? DetectEndTime { get; set; }
		public DateTime? DetectTime { get; set; }
		public string Position { get; set; }
		public int? LastAccessedUserID { get; set; }
		public int? StartOption { get; set; }
		public string DisasterOption { get; set; }
		public int? SensorZoneHistoryID { get; set; }
		public string Description { get; set; }

		public static string TableName { get { return "SopHistoryActionStep"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("ID = {0}", ID);
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
