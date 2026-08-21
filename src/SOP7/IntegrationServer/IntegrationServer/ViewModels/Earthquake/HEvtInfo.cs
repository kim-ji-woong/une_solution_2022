using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace IntegrationServer.ViewModels.Earthquake
{
    class HEvtInfo : Table
	{
		public enum Fields { EVENT_ID, NET, OBS_ID, EVENT_TIME, FILE_NM, SEND_DATE_NEMA, SHOW_YN, VOICE_YN, pga_val, regdate };
		public enum WriteFields { EVENT_ID, NET, OBS_ID, EVENT_TIME, FILE_NM, SEND_DATE_NEMA, SHOW_YN, VOICE_YN, pga_val, regdate };

		public string EVENT_ID { get; set; }
		public string NET { get; set; }
		public string OBS_ID { get; set; }
		public string EVENT_TIME { get; set; }
		public string FILE_NM { get; set; }
		public DateTime? SEND_DATE_NEMA { get; set; }
		public string SHOW_YN { get; set; }
		public string VOICE_YN { get; set; }
		public double? pga_val { get; set; }
		public DateTime? regdate { get; set; }

		public static string TableName { get { return "HEVTINFO"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = '{1}' and {2} = '{3}' and {4} = '{5}'", Fields.EVENT_ID, EVENT_ID, Fields.NET, NET, Fields.OBS_ID, OBS_ID);
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
