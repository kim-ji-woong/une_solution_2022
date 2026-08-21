using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DbBackup.Models.Sop.Component
{
	public class SectionGrid : Table
	{
		public enum Fields { ID, StepMemberID };
		public enum WriteFields { ID, StepMemberID };

		public int ID { get; set; }
		public int StepMemberID { get; set; }

		public static string TableName { get { return "SopComponentSectionGrid"; } }

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
