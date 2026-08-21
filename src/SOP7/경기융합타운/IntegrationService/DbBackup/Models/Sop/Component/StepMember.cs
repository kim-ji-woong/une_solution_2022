using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DbBackup.Models.Sop.Component
{
	public class StepMember : Table
	{
		public enum Fields { ID, TeamID, TeamType, ActionStepID };
		public enum WriteFields { ID, TeamID, TeamType, ActionStepID };

		public int ID { get; set; }
		public int TeamID { get; set; }
		public int TeamType { get; set; }
		public int ActionStepID { get; set; }

		public static string TableName { get { return "SopComponentStepMember"; } }

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
