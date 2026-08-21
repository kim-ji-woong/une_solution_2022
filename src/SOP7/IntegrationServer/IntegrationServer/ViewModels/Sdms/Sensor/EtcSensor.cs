using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace IntegrationServer.ViewModels.Sdms.Sensor
{
    class EtcSensor : Table
    {
		public enum Fields { ID, Name, PositionName, X, Y, Z, CurrentData, ZoneID, Department, DepartmentPhoneNumber, Enabled, Status, UniqueKey, MaterialType, LimitBase, LimitType, LimitValue, SiteID };
		public enum WriteFields { ID, Name, PositionName, X, Y, Z, CurrentData, ZoneID, Department, DepartmentPhoneNumber, Enabled, Status, UniqueKey, MaterialType, LimitBase, LimitType, LimitValue, SiteID };

		public int ID { get; set; }
		public string Name { get; set; }
		public string PositionName { get; set; }
		public double? X { get; set; }
		public double? Y { get; set; }
		public double? Z { get; set; }
		public string CurrentData { get; set; }
		public int ZoneID { get; set; }
		public string Department { get; set; }
		public string DepartmentPhoneNumber { get; set; }
		public bool? Enabled { get; set; }
		public int? Status { get; set; }
		public string UniqueKey { get; set; }
		public int? MaterialType { get; set; }
		public string LimitBase { get; set; }
		public int? LimitType { get; set; }
		public string LimitValue { get; set; }
		public int? SiteID { get; set; }

		public static string TableName { get { return "SdmsSensorETC"; } }

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
