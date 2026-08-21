namespace Hynix.Model
{
	public class AlarmScript
	{
		public enum Fields { SensorTypeID, Script };

		public int SensorTypeID { get; set; }
		public string Script { get; set; }

		public static string TableName { get { return "HynixAlarmScript"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			isNullable = false;
			return field.ToString();
		}
	}
}
