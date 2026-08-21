using System;

namespace VDS.Model.Work
{
	public class ChangeBasic
	{
		public enum Fields { ID, Status, Title, ChangeType, ChangeClass, MainWorker, ChangeWorkResult, PlanBeginTime, PlanEndTime, WorkBeginTime, WorkEndTime, LinkedChangedWork, Priority, Register, RegTime, WorkData, DataCenterID, WorkID };

		public int ID { get; set; }
		public string Status { get; set; }
		public string Title { get; set; }
		public string ChangeType { get; set; }
		public string ChangeClass { get; set; }
		public string MainWorker { get; set; }
		public string ChangeWorkResult { get; set; }
		public DateTime PlanBeginTime { get; set; }
		public DateTime PlanEndTime { get; set; }
		public DateTime WorkBeginTime { get; set; }
		public DateTime WorkEndTime { get; set; }
		public string LinkedChangedWork { get; set; }
		public string Priority { get; set; }
		public string Register { get; set; }
		public DateTime RegTime { get; set; }
		public string WorkData { get; set; }
		public int DataCenterID { get; set; }
		public string WorkID { get; set; }

		public static string TableName { get { return "WorkChangeBasic"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			isNullable = false;
			return field.ToString();
		}
	}
}
