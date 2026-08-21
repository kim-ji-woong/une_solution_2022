using System;

namespace VDS.Model.Account
{
	public class UserData
	{
		public enum Fields { UserID, CompanyName, RegDate, Activate, Memo, SiteID };

		public int UserID { get; set; }
		public string CompanyName { get; set; }
		public DateTime RegDate { get; set; }
		public bool Activate { get; set; }
		public string Memo { get; set; }
		public int SiteID { get; set; }

		public static string TableName { get { return "AccountUserData"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.Memo)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
