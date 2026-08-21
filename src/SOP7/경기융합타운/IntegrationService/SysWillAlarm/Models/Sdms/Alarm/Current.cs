using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace SysWillAlarm.Models.Sdms.Alarm
{
	class Current : Table
	{
		public enum Fields { SensorZoneHistoryID, SensorType, AlarmType, TimeStamp, SopStatus, AlarmDepth, AlarmSensorZoneIDs };
		public enum WriteFields { SensorZoneHistoryID, SensorType, AlarmType, TimeStamp, SopStatus, AlarmDepth, AlarmSensorZoneIDs };

		public int SensorZoneHistoryID { get; set; }
		public int SensorType { get; set; }
		public int AlarmType { get; set; }
		public DateTime TimeStamp { get; set; }
		public int SopStatus { get; set; }
		public int AlarmDepth { get; set; }
		public string AlarmSensorZoneIDs { get; set; }

		public static string TableName { get { return "SdmsAlarmCurrent"; } }

		public override string GetTableName()
		{
			return TableName;
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
