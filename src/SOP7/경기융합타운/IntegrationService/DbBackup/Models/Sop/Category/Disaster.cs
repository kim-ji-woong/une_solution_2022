using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DbBackup.Models.Sop.Category
{
	public class Disaster : Table
	{
		public enum Fields { ID, DisasterName, SubDisasterCategoryID, VersionID, UserLevelIDs, Description };
		public enum WriteFields { ID, DisasterName, SubDisasterCategoryID, VersionID, UserLevelIDs, Description };

		public int ID { get; set; }
		public string DisasterName { get; set; }
		public int SubDisasterCategoryID { get; set; }
		public int VersionID { get; set; }
		public string UserLevelIDs { get; set; }
		public string Description { get; set; }

		public static string TableName { get { return "SopCategoryDisaster"; } }

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
