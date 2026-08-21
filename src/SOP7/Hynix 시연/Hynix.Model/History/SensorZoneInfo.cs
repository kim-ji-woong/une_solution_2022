namespace Hynix.Model.History
{
	public class SensorZoneInfo
	{
		public enum Fields { SensorZoneHistoryID, OrderIndex, ItemID, WorkerID, Param };

		public int SensorZoneHistoryID { get; set; }
		public int OrderIndex { get; set; }
		public int? ItemID { get; set; }
		public int? WorkerID { get; set; }
		public string/* nullable */ Param { get; set; }

		public static string TableName { get { return "HynixSensorZoneHistoryInfo"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.ItemID ||
				field == Fields.WorkerID ||
				field == Fields.Param)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
