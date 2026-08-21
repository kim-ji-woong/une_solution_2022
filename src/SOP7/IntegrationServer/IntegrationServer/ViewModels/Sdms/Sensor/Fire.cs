using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace IntegrationServer.ViewModels.Sdms.Sensor
{
	public class Fire : Table
	{
		public enum Fields { ID, Name, PositionName, X, Y, Z, ZoneID, Department, DepartmentPhoneNumber, Enabled, SensorSubType, SiteID };
		public enum WriteFields { ID, Name, PositionName, X, Y, Z, ZoneID, Department, DepartmentPhoneNumber, Enabled, SensorSubType, SiteID };

		public int ID { get; set; }
		public string Name { get; set; }
		public string PositionName { get; set; }
		public double? X { get; set; }
		public double? Y { get; set; }
		public double? Z { get; set; }
		public int ZoneID { get; set; }
		public string Department { get; set; }
		public string DepartmentPhoneNumber { get; set; }
		public bool? Enabled { get; set; }
		public int? SensorSubType { get; set; }
		public int? SiteID { get; set; }

		public static string TableName { get { return "SdmsSensorFire"; } }

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