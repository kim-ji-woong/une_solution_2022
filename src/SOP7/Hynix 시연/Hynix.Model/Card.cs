namespace Hynix.Model
{
	public class Card
	{
		public enum Fields { CardID, WorkerID, UniqueKey };

		public int CardID { get; set; }
		public int WorkerID { get; set; }
		public string UniqueKey { get; set; }

		public static string TableName { get { return "HynixCard"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			isNullable = false;
			return field.ToString();
		}
	}
}
