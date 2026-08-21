using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace AlarmWebService.Models
{
    public class SensorReactionHistory : Table
    {
		public enum Fields { ID, SensorZoneHistoryID, ReactionType, Time, Message, Param1, Param2, Param3, Param4, Param5 };
		public enum WriteFields { ID, SensorZoneHistoryID, ReactionType, Time, Message, Param1, Param2, Param3, Param4, Param5 };

		public int ID { get; set; }
		public int SensorZoneHistoryID { get; set; }
		public int ReactionType { get; set; }
		public DateTime Time { get; set; }
		public string Message { get; set; }
		public string Param1 { get; set; }
		public string Param2 { get; set; }
		public string Param3 { get; set; }
		public string Param4 { get; set; }
		public string Param5 { get; set; }

		public static string TableName { get { return "SdmsHistorySensorReaction"; } }

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
