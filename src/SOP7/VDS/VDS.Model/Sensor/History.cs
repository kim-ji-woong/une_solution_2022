using System;

namespace VDS.Model.Sensor
{
	public class History
	{
		public enum Fields { SiteID, SiteName, CenterID, CenterName, SensorType, SensorName, DateStamp, TimeStamp, Status, Data, Unit, Description };

		public int SiteID { get; set; }
		public string SiteName { get; set; }
		public int CenterID { get; set; }
		public string CenterName { get; set; }
		public string SensorType { get; set; }
		public string SensorName { get; set; }
		public string DateStamp { get; set; }
		public string TimeStamp { get; set; }
		public string Status { get; set; }
		public int? Data { get; set; }
		public string Unit { get; set; }
		public string Description { get; set; }

		public static string TableName { get { return "SensorHistory"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.Data ||
				field == Fields.Unit ||
				field == Fields.Description)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
