using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Nipa.Model.Sdms.History
{
	public class SensorReactionDescription : Table
	{
		public enum Fields { ID, SensorReactionHistoryID, DescriptionID, SensorZoneHistoryID };
		public enum WriteFields { ID, SensorReactionHistoryID, DescriptionID, SensorZoneHistoryID };

		public int ID { get; set; }
		public int SensorReactionHistoryID { get; set; }
		public int DescriptionID { get; set; }
		public int? SensorZoneHistoryID { get; set; }

		public static string TableName { get { return "SdmsHistorySensorReactionDescription"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("ID = {0}", ID);
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
