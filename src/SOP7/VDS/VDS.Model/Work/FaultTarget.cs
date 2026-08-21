using System;

namespace VDS.Model.Work
{
	public class FaultTarget
	{
		public enum Fields { ID, FaultID, SystemName, Department, EquipmentTypeID, DataCenterID };

		public int ID { get; set; }
		public int FaultID { get; set; }
		public string SystemName { get; set; }
		public string Department { get; set; }
		public int EquipmentTypeID { get; set; }
		public int DataCenterID { get; set; }

		public static string TableName { get { return "WorkFaultTarget"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			isNullable = false;
			return field.ToString();
		}
	}
}
