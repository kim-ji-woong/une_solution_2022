using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Nipa.Model.Sdms.History
{
	public class SMS : Table
	{
		public enum Fields { ID, SensorZoneHistoryID, SensorReactionHistoryID, RegularMemberIDList, SMSMessage, SendType };
		public enum WriteFields { ID, SensorZoneHistoryID, SensorReactionHistoryID, RegularMemberIDList, SMSMessage, SendType };

		public int ID { get; set; }
		public int SensorZoneHistoryID { get; set; }
		public int SensorReactionHistoryID { get; set; }
		public string RegularMemberIDList { get; set; }
		public string SMSMessage { get; set; }
		public bool SendType { get; set; }

		public static string TableName { get { return "SdmsHistorySMS"; } }

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
