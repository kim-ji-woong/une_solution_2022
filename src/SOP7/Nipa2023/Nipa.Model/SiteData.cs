using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Nipa.Model
{
	public class SiteData : Table
	{
		public enum Fields { ID, SiteID, Name, Value };
		public enum WriteFields { ID, SiteID, Name, Value };

		public int ID { get; set; }
		public int SiteID { get; set; }
		public string Name { get; set; }
		public string Value { get; set; }

		public static string TableName { get { return "SiteData"; } }

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
