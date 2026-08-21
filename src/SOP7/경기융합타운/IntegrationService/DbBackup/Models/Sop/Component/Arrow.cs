using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DbBackup.Models.Sop.Component
{
	public class Arrow : Table
	{
		public enum Fields { ID, Text, BeginComponentID, BeginComponentPosition, EndComponentID, EndComponentPosition, StepMemberID };
		public enum WriteFields { ID, Text, BeginComponentID, BeginComponentPosition, EndComponentID, EndComponentPosition, StepMemberID };

		public int ID { get; set; }
		public string Text { get; set; }
		public int BeginComponentID { get; set; }
		public int BeginComponentPosition { get; set; }
		public int EndComponentID { get; set; }
		public int EndComponentPosition { get; set; }
		public int StepMemberID { get; set; }

		public static string TableName { get { return "SopComponentArrow"; } }

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
