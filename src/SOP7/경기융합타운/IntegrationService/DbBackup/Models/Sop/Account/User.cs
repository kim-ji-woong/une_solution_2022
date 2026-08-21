using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DbBackup.Models.Sop.Account
{
    class User : Table
	{
		public enum Fields { ID, MemberID, UserLevel, Password, UserID, NickName, SiteID, PasswordCode, Salt };
		public enum WriteFields { ID, MemberID, UserLevel, Password, UserID, NickName, SiteID, PasswordCode, Salt };

		public int ID { get; set; }
		public int? MemberID { get; set; }
		public int UserLevel { get; set; }
		public string Password { get; set; }
		public string UserID { get; set; }
		public string NickName { get; set; }
		public int SiteID { get; set; }
		public string PasswordCode { get; set; }
		public string Salt { get; set; }

		public static string TableName { get { return "SopAccountUser"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.ID, ID);
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
