using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DbBackup.Models.Sop.Category
{
	public class DisasterCategory : Table
	{
		public enum Fields { ID, CategoryName, SiteID };
		public enum WriteFields { ID, CategoryName, SiteID };

		public int ID { get; set; }
		public string CategoryName { get; set; }
		public int SiteID { get; set; }

		public static string TableName { get { return "SopCategoryDisasterCategory"; } }

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
