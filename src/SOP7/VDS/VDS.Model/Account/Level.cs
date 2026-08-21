namespace VDS.Model.Account
{
	public class Level
	{
		public enum Fields { ID, LevelName, LevelEngName };

		public int ID { get; set; }
		public string LevelName { get; set; }
		public string LevelEngName { get; set; }

		public static string TableName { get { return "AccountLevel"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			isNullable = false;
			return field.ToString();
		}
	}
}
