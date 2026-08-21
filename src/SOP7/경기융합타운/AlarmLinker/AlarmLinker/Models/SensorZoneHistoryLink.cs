using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace AlarmLinker.Models
{
	class SensorZoneHistoryLink : Table
	{
		public enum Fields { OwnSensorZoneHistoryID, ExternalSensorZoneHistoryID, ExternalSiteID, ExternalDBName, CompleteEvent };
		public enum WriteFields { OwnSensorZoneHistoryID, ExternalSensorZoneHistoryID, ExternalSiteID, ExternalDBName, CompleteEvent };

		public int OwnSensorZoneHistoryID { get; set; }
		public int ExternalSensorZoneHistoryID { get; set; }
		public int ExternalSiteID { get; set; }
		public string ExternalDBName { get; set; }
		public bool CompleteEvent { get; set; }

		public static string TableName { get { return "SensorZoneHistoryLink"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.OwnSensorZoneHistoryID, OwnSensorZoneHistoryID);
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
