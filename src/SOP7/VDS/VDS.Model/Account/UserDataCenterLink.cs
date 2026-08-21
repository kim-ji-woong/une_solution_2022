namespace VDS.Model.Account
{
	public class UserDataCenterLink
	{
		public enum Fields { UserID, DataCenterID };

		public int UserID { get; set; }
		public int DataCenterID { get; set; }

		public static string TableName { get { return "AccountUserDataCenterLink"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			isNullable = false;
			return field.ToString();
		}
	}
}
