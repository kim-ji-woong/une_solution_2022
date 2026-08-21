using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DbBackup.Models.Sop.Component
{
	public class SectionGridColumn : Table
	{
		public enum Fields { GridID, ColumnIndex, Width };
		public enum WriteFields { GridID, ColumnIndex, Width };

		public int GridID { get; set; }
		public int ColumnIndex { get; set; }
		public int Width { get; set; }

		public static string TableName { get { return "SopComponentSectionGridColumn"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1} and {2} = {3}", Fields.GridID, GridID, Fields.ColumnIndex, ColumnIndex);
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
