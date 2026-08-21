using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DbBackup.Models.Sop.Account
{
    class AccountSession : Table
	{
		public enum Fields { ID, AccountUserID, SessionKey, CreateDate, UpdateDate, IsAutoLogin, BrowserID };
		public enum WriteFields { ID, AccountUserID, SessionKey, CreateDate, UpdateDate, IsAutoLogin, BrowserID };

		public int ID { get; set; }
		public int AccountUserID { get; set; }
		public string SessionKey { get; set; }
		public DateTime CreateDate { get; set; }
		public DateTime UpdateDate { get; set; }
		public bool IsAutoLogin { get; set; }
		public string BrowserID { get; set; }

		public static string TableName { get { return "SopAccountSession"; } }

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
