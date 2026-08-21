using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DbBackup.Models.Sdms.History
{
    class SensorReactionHistoryDescriptionText : Table
	{
		public enum Fields { ID, RefCount, Description };
		public enum WriteFields { ID, RefCount, Description };

		public int ID { get; set; }
		public int RefCount { get; set; }
		public string Description { get; set; }

		public static string TableName { get { return "SdmsHistorySensorReactionDescriptionText"; } }

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
