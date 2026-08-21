using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace SyswillAlarmMonitor.Models.Sdms.Spatial
{
	class Zone : Table
	{
		public enum Fields { ID, ZoneName, BuildingID, FloorIndex, AddFloor, Boundary, TextCenter, BroadcastText, DisplayText, SiteID };
		public enum WriteFields { ID, ZoneName, BuildingID, FloorIndex, AddFloor, Boundary, TextCenter, BroadcastText, DisplayText, SiteID };

		public int ID { get; set; }
		public string ZoneName { get; set; }
		public int? BuildingID { get; set; }
		public int? FloorIndex { get; set; }
		public double? AddFloor { get; set; }
		public string Boundary { get; set; }
		public string TextCenter { get; set; }
		public string BroadcastText { get; set; }
		public string DisplayText { get; set; }
		public int SiteID { get; set; }

		public static string TableName { get { return "SdmsSpatialZone"; } }

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
