using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace IntegrationServer.ViewModels.ParkingGate.RS
{
	class ParkingGate : Table
	{
		public enum Fields { ID, Name, GateCode, InOut, Status, SiteID };
		public enum WriteFields { ID, Name, GateCode, InOut, Status, SiteID };
		public enum GateStatus { None = 0, Closed, Opened, NetworkError };

		public int ID { get; set; }
		public string Name { get; set; }
		public string GateCode { get; set; }
		public bool InOut { get; set; }
		public int Status { get; set; }
		public int SiteID { get; set; }

		public static string TableName { get { return "SdmsParkingGate"; } }

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
