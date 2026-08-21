using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace IntegrationServer.ViewModels.Earthquake
{
    class KEvtInfo : Table
	{
		public enum Fields { EQ_NO, EQ_DITC, ORIGIN_TIME, LAT, LON, MAG, ORIGIN_AREA, START_TIME, END_TIME, FILE_NM, SEND_DATE_NEMA, SHOW_YN, REGDATE };
		public enum WriteFields { EQ_NO, EQ_DITC, ORIGIN_TIME, LAT, LON, MAG, ORIGIN_AREA, START_TIME, END_TIME, FILE_NM, SEND_DATE_NEMA, SHOW_YN, REGDATE };

		public string EQ_NO { get; set; }
		public string EQ_DITC { get; set; }
		public string ORIGIN_TIME { get; set; }
		public double? LAT { get; set; }
		public double? LON { get; set; }
		public double? MAG { get; set; }
		public string ORIGIN_AREA { get; set; }
		public string START_TIME { get; set; }
		public string END_TIME { get; set; }
		public string FILE_NM { get; set; }
		public DateTime? SEND_DATE_NEMA { get; set; }
		public string SHOW_YN { get; set; }
		public DateTime? REGDATE { get; set; }

		public static string TableName { get { return "KEVTINFO"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = '{1}'", Fields.EQ_NO, EQ_NO);
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
