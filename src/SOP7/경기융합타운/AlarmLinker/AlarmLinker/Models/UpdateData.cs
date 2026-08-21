using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace AlarmLinker.Models
{
    class UpdateData : Table
    {
		public enum Fields { ID, Timestamp, NameOfTable, FieldList, ValueList, PrimaryCondition };
		public enum WriteFields { ID, Timestamp, NameOfTable, FieldList, ValueList, PrimaryCondition };

		public int ID { get; set; }
		public DateTime Timestamp { get; set; }
		public string NameOfTable { get; set; }
		public string FieldList { get; set; }
		public string ValueList { get; set; }
		public string PrimaryCondition { get; set; }

		public static string TableName { get { return "UpdateData"; } }

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
