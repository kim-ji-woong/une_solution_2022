using System;
//using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace UnEcctv.Data
{
    class CCTVStatus// : Table
	{
		public enum Fields { Guid, UserID, Title, SensorZoneHistoryID, CCTV1, CCTV2, CCTV3, CCTV4, HeartBeat, Visible };
		public enum WriteFields { Guid, UserID, Title, SensorZoneHistoryID, CCTV1, CCTV2, CCTV3, CCTV4, HeartBeat, Visible };

		public string Guid { get; set; }
		public int UserID { get; set; }
		public string Title { get; set; }
		public int? SensorZoneHistoryID { get; set; }
		public int? CCTV1 { get; set; }
		public int? CCTV2 { get; set; }
		public int? CCTV3 { get; set; }
		public int? CCTV4 { get; set; }
		public DateTime HeartBeat { get; set; }
		public bool Visible { get; set; }
		public int? MarkNo { get; set; }
		
		public static string TableName { get { return "SdmsPopupCCTVStatus"; } }

		/*public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = '{1}'", CCTVStatus.Fields.Guid, Guid);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}*/
	}
}
