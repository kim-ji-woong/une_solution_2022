using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Nipa.Model.Sop.Category
{
	public class SubDisasterCategory : Table
	{
		public enum Fields { ID, DisasterCategoryID, SubCategoryName };
		public enum WriteFields { ID, DisasterCategoryID, SubCategoryName };

		public int ID { get; set; }
		public int DisasterCategoryID { get; set; }
		public string SubCategoryName { get; set; }

		public static string TableName { get { return "SopCategorySubDisasterCategory"; } }

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
