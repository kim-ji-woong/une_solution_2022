using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace SyswillAlarmMonitor.Models.Sdms.Sensor
{
	class PSM : Table
	{
		public enum Fields { ID, Name, PositionName, X, Y, Z, CurrentData, EquipZoneID, Department, DepartmentPhoneNumber, Enabled, Status, UniqueKey, ZoneID, MaterialType, LimitBase, LimitType, LimitValue, SiteID };
		public enum WriteFields { ID, Name, PositionName, X, Y, Z, CurrentData, EquipZoneID, Department, DepartmentPhoneNumber, Enabled, Status, UniqueKey, ZoneID, MaterialType, LimitBase, LimitType, LimitValue, SiteID };

		public int ID { get; set; }
		public string Name { get; set; }
		public string PositionName { get; set; }
		public double? X { get; set; }
		public double? Y { get; set; }
		public double? Z { get; set; }
		public double? CurrentData { get; set; }
		public int EquipZoneID { get; set; }
		public string Department { get; set; }
		public string DepartmentPhoneNumber { get; set; }
		public bool? Enabled { get; set; }
		public int? Status { get; set; }
		public string UniqueKey { get; set; }
		public int ZoneID { get; set; }
		public int? MaterialType { get; set; }
		public double? LimitBase { get; set; }
		public int? LimitType { get; set; }
		public string LimitValue { get; set; }
		public int? SiteID { get; set; }

		public static string TableName { get { return "SdmsSensorPSM"; } }

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
