using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace ElevatorReader
{
	public class Elevator : Table
	{
		public enum Fields { EquipNo, Door, Direction, Run, Floor };
		public enum WriteFields { EquipNo, Door, Direction, Run, Floor };

		public int EquipNo { get; set; }
		public string Door { get; set; }
		public int Direction { get; set; }
		public int Run { get; set; }
		public int Floor { get; set; }

		public static string TableName { get { return "Elevator"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("EquipNo = {0}", EquipNo);
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
