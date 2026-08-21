using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Nipa.Model.Account
{
	public class Level : Table
	{
		public enum Fields { ID, LevelName };
		public enum WriteFields { ID, LevelName };

		public int ID { get; set; }
		public string LevelName { get; set; }

		public static string TableName { get { return "SopAccountLevel"; } }

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
