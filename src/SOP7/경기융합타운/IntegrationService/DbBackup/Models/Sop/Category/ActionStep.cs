using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DbBackup.Models.Sop.Category
{
	public class ActionStep : Table
	{
		public enum Fields { ID, StepName, DisasterID, UserDefinedConfigID };
		public enum WriteFields { ID, StepName, DisasterID, UserDefinedConfigID };

		public int ID { get; set; }
		public string StepName { get; set; }
		public int DisasterID { get; set; }
		public int? UserDefinedConfigID { get; set; }

		public static string TableName { get { return "SopCategoryActionStep"; } }

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
