using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace AlarmLinker.Models
{
    class SdmsHistorySensorZone : Table
	{
		public enum Fields { ID, SensorZoneID, Data, Time, ZoneID, SensorType, DetectionStatus, SiteID, AllSensorZoneIDs, Memo };
		public enum WriteFields { ID, SensorZoneID, Data, Time, ZoneID, SensorType, DetectionStatus, SiteID, AllSensorZoneIDs, Memo };

		public int ID { get; set; }
		public int SensorZoneID { get; set; }
		public string Data { get; set; }
		public DateTime Time { get; set; }
		public int ZoneID { get; set; }
		public int SensorType { get; set; }
		public int? DetectionStatus { get; set; }
		public int SiteID { get; set; }
		public string AllSensorZoneIDs { get; set; }
		public string Memo { get; set; }

		public static string TableName { get { return "SdmsHistorySensorZone"; } }

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
