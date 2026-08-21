using System;

namespace VDS.Model.Work
{
	public class ChangeTarget
	{
		public enum Fields { ID, WorkID, DataCenterID, PropertyName, EquipmentTypeID, ServicePause, ServicePausePlanHour, Change, ChangeData, ReviewResult, Reviewer, ReviewDate, ChangeResult, ChangeDetail };

		public int ID { get; set; }
		public int WorkID { get; set; }
		public int DataCenterID { get; set; }
		public string PropertyName { get; set; }
		public int EquipmentTypeID { get; set; }
		public bool? ServicePause { get; set; }
		public int? ServicePausePlanHour { get; set; }
		public string Change { get; set; }
		public string ChangeData { get; set; }
		public string ReviewResult { get; set; }
		public string Reviewer { get; set; }
		public DateTime ReviewDate { get; set; }
		public string ChangeResult { get; set; }
		public string ChangeDetail { get; set; }

		public static string TableName { get { return "WorkChangeTarget"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.ServicePause ||
				field == Fields.ServicePausePlanHour)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
