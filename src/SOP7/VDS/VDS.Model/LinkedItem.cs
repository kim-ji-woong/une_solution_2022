namespace VDS.Model
{
	public class LinkedItem
	{
		public enum Fields { ItemID, LinkedItemID, CenterID };

		public int ItemID { get; set; }
		public int LinkedItemID { get; set; }
		public int CenterID { get; set; }

		public static string TableName { get { return "LinkedItem"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			isNullable = false;
			return field.ToString();
		}
	}
}
