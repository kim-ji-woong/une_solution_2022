using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace IntegrationServer.ViewModels.Door
{
	class GateExternalLink : Table
	{
		public enum Fields { GateID, EtcSensorID };
		public enum WriteFields { GateID, EtcSensorID };

		public int GateID { get; set; }
		public int EtcSensorID { get; set; }

		public static string TableName { get { return "GateExternalLink"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("GateID = {0}", GateID);
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