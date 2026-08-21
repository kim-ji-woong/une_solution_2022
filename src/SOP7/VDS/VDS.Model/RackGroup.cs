namespace VDS.Model
{
	public class RackGroup
	{
		public enum Fields { ID, CenterID, GroupName };

		public int ID { get; set; }
		public int CenterID { get; set; }
		public string GroupName { get; set; }

		public static string TableName { get { return "RackGroup"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			isNullable = false;
			return field.ToString();
		}
	}
}
