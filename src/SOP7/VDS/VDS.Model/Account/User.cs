namespace VDS.Model.Account
{
	public class User
	{
		public enum Fields { ID, UserLevel, Password, UserID, NickName, PasswordCode, Salt };

		public int ID { get; set; }
		public int UserLevel { get; set; }
		public string Password { get; set; }
		public string UserID { get; set; }
		public string NickName { get; set; }
		public string PasswordCode { get; set; }
		public string Salt { get; set; }

		public static string TableName { get { return "AccountUser"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.PasswordCode)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
