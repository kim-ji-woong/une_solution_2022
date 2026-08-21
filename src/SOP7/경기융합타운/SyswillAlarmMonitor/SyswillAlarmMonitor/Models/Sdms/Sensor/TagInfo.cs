using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace SyswillAlarmMonitor.Models.Sdms.Sensor
{
	class TagInfo : Table
	{
		public enum Fields { ID, SensorServerID, TagNo, SensorZoneID, Activate, Description };
		public enum WriteFields { ID, SensorServerID, TagNo, SensorZoneID, Activate, Description };

		public int ID { get; set; }
		public int SensorServerID { get; set; }
		public int TagNo { get; set; }
		public int? SensorZoneID { get; set; }
		public int Activate { get; set; }
		public string Description { get; set; }

		public static string TableName { get { return "SdmsSensorTagInfo"; } }

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
