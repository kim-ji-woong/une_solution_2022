using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Nipa.Model.Sdms.History
{
	public class SensorZoneData : Table
	{
		public enum Fields { SensorZoneHistoryID, PropertyName, PropertyValue };
		public enum WriteFields { SensorZoneHistoryID, PropertyName, PropertyValue };

		public int SensorZoneHistoryID { get; set; }
		public string PropertyName { get; set; }
		public string PropertyValue { get; set; }

		public static string TableName { get { return "SdmsHistorySensorZoneData"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("SensorZoneHistoryID = {0} and PropertyName = '{1}'", SensorZoneHistoryID, PropertyName);
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
