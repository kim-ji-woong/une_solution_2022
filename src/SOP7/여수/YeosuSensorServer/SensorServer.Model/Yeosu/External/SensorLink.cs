namespace SensorServer.Model.Yeosu.External
{
    public class SensorLink
    {
		public enum Fields { ServiceID, RegionID, GroupID, NodeID, SensorName };

		public int ServiceID { get; set; }
		public int RegionID { get; set; }
		public int GroupID { get; set; }
		public int NodeID { get; set; }
		public string SensorName { get; set; }

		public static string TableName { get { return "YeosuExternalSensorLink"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			isNullable = false;
			return field.ToString();
		}
	}
}
