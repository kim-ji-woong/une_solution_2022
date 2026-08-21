namespace Hynix.Model
{
    public class Door
    {
		public enum Fields { DoorID, Name, CardReaderID, X, Y, Z, ZoneID };

		public int DoorID { get; set; }
		public string Name { get; set; }
		public int CardReaderID { get; set; }
		public double? X { get; set; }
		public double? Y { get; set; }
		public double? Z { get; set; }
		public int ZoneID { get; set; }

		public static string TableName { get { return "HynixDoor"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.X ||
				field == Fields.Y ||
				field == Fields.Z)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
