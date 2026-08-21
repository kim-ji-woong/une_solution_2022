using System;

namespace VDS.Model.Work
{
	public class FaultBasic
	{
		public enum Fields { ID, Title, Status, Reason, Range, ReasonType, FaultLevel, Region, Manager, EventTime, FinishTime, DataCenterID, FaultID };

		public int ID { get; set; }
		public string Title { get; set; }
		public string Status { get; set; }
		public string Reason { get; set; }
		public string Range { get; set; }
		public string ReasonType { get; set; }
		public string FaultLevel { get; set; }
		public string Region { get; set; }
		public string Manager { get; set; }
		public DateTime EventTime { get; set; }
		public DateTime FinishTime { get; set; }
		public int DataCenterID { get; set; }
		public string FaultID { get; set; }

		public static string TableName { get { return "WorkFaultBasic"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			isNullable = false;
			return field.ToString();
		}
	}
}
