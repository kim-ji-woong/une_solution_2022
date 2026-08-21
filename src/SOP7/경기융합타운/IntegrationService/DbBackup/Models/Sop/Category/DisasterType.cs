using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DbBackup.Models.Sop.Category
{
	public class DisasterType : Table
	{
		public enum Fields { ID, Name, SubDisasterID };
		public enum WriteFields { ID, Name, SubDisasterID };

		public int ID { get; set; }
		public string Name { get; set; }
		public int SubDisasterID { get; set; }

		public static string TableName { get { return "SopCategoryDisasterType"; } }

		public override string GetTableName()
		{
			return TableName;
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
