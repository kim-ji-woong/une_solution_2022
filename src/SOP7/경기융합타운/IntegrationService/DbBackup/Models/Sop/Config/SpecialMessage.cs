using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DbBackup.Models.Sop.Config
{
	public class SpecialMessage : Table
	{
		public enum Fields { ID, Category, Message, description };
		public enum WriteFields { ID, Category, Message, description };

		public int ID { get; set; }
		public string Category { get; set; }
		public string Message { get; set; }
		public string description { get; set; }

		public static string TableName { get { return "SopConfigSpecialMessage"; } }

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
