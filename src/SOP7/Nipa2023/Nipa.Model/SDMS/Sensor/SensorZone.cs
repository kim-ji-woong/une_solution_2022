using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Nipa.Model.Sdms.Sensor
{
	public class SensorZone : Table
	{
		public enum Fields { ID, SensorType, OrgSensorID, EquipZoneID, IsAlarmStatus, Data };
		public enum WriteFields { ID, SensorType, OrgSensorID, EquipZoneID, IsAlarmStatus, Data };

		public int ID { get; set; }
		public int SensorType { get; set; }
		public int? OrgSensorID { get; set; }
		public int EquipZoneID { get; set; }
		public bool IsAlarmStatus { get; set; }
		public int? Data { get; set; }

		public static string TableName { get { return "SdmsSensorZone"; } }

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
