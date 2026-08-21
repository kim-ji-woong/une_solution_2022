using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace IntegrationServer.ViewModels.Elevator
{
	public class Elevator : Table
	{
		public enum Fields { ID, Door, Direction, Run, Floor, MaxFloor, MinFloor, IsNormal, Name, GroupNo, SiteID };
		public enum WriteFields { ID, Door, Direction, Run, Floor, MaxFloor, MinFloor, IsNormal, Name, GroupNo, SiteID };

		public enum DoorStatus { Fault = -1, Closed = 0, Opened = 2 };
		public enum DirectionStatus { Fault = -1, None = 0, Up, Down };
		public enum RunStatus { Fault = -1, CommunicationFail = 0, Normal, Manual, Moving, Monitor, ElevatorFault, Parking, Full, NoMonitor, NoPower };

		public int ID { get; set; }
		public int Door { get; set; }
		public int Direction { get; set; }
		public int Run { get; set; }
		public int Floor { get; set; }
		public int MaxFloor { get; set; }
		public int MinFloor { get; set; }
		public bool IsNormal { get; set; }
		public string Name { get; set; }
		public int? GroupNo { get; set; }
		public int SiteID { get; set; }

		public static string TableName { get { return "SdmsFacilityElevator"; } }

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
