using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Nipa.Model.Account
{
	public class User : Table
	{
		public enum Fields { ID, MemberID, UserLevel, Password, UserID, NickName, PasswordCode, Salt, SiteID };
		public enum WriteFields { MemberID, UserLevel, Password, UserID, NickName, PasswordCode, Salt, SiteID };

		public int ID { get; set; }
		public int? MemberID { get; set; }
		public int UserLevel { get; set; }
		public string Password { get; set; }
		public string UserID { get; set; }
		public string NickName { get; set; }
		public string PasswordCode { get; set; }
		public string Salt { get; set; }
		public int SiteID { get; set; }

		public static string TableName { get { return "SopAccountUser"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("ID = {0}", ID);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}
	}
}
