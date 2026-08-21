using System;

namespace VDS.Model.Account
{
	public class Session
	{
		public enum Fields { ID, AccountUserID, SessionKey, CreateDate, UpdateDate, IsAutoLogin };

		public int ID { get; set; }
		public int AccountUserID { get; set; }
		public string SessionKey { get; set; }
		public DateTime CreateDate { get; set; }
		public DateTime UpdateDate { get; set; }
		public bool IsAutoLogin { get; set; }

		public static string TableName { get { return "AccountSession"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			isNullable = false;
			return field.ToString();
		}
	}
}
