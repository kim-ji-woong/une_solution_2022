using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DbBackup.Models.Sop.Component
{
	public class SectionGridRow : Table
	{
		public enum Fields { GridID, RowIndex, Height };
		public enum WriteFields { GridID, RowIndex, Height };

		public int GridID { get; set; }
		public int RowIndex { get; set; }
		public int Height { get; set; }

		public static string TableName { get { return "SopComponentSectionGridRow"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1} and {2} = {3}", Fields.GridID, GridID, Fields.RowIndex, RowIndex);
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
