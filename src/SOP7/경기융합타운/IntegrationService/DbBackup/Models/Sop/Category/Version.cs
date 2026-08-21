using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DbBackup.Models.Sop.Category
{
	public class Version : Table
	{
		public enum Fields { ID, isNormal, CreateTime, LastAccessTime, VersionName, OwnerID, Description, SiteID };
		public enum WriteFields { ID, isNormal, CreateTime, LastAccessTime, VersionName, OwnerID, Description, SiteID };

		public int ID { get; set; }
		public bool isNormal { get; set; }
		public DateTime CreateTime { get; set; }
		public DateTime LastAccessTime { get; set; }
		public string VersionName { get; set; }
		public int? OwnerID { get; set; }
		public string Description { get; set; }
		public int SiteID { get; set; }

		public static string TableName { get { return "SopCategoryVersion"; } }

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
