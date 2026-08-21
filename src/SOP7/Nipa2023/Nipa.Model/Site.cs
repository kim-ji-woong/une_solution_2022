using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Nipa.Model
{
	public class Site : Table
	{
		public enum Fields { ID, Name };
		public enum WriteFields { ID, Name };

		public int ID { get; set; }
		public string Name { get; set; }

		public static string TableName { get { return "Site"; } }

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
