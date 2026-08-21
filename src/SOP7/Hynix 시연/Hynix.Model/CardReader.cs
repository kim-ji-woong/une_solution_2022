namespace Hynix.Model
{
	public class CardReader
	{
		public enum Fields { CardReaderID, ZoneID, UniqueKey, X, Y, Z };

		public int CardReaderID { get; set; }
		public int ZoneID { get; set; }
		public string/* nullable */ UniqueKey { get; set; }
		public int? X { get; set; }
		public int? Y { get; set; }
		public int? Z { get; set; }

		public static string TableName { get { return "HynixCardReader"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.UniqueKey ||
				field == Fields.X ||
				field == Fields.Y ||
				field == Fields.Z)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
