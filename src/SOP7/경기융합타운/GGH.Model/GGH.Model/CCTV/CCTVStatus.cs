using System;

namespace GGH.Model.CCTV
{
    public class CCTVStatus
	{
		public enum Fields { Guid, UserID, Title, SensorZoneHistoryID, CCTV1, CCTV2, CCTV3, CCTV4, HeartBeat, Visible };

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

		public static string TableName { get { return "SdmsPopupCCTVStatus"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.SensorZoneHistoryID ||
				field == Fields.CCTV1 ||
				field == Fields.CCTV2 ||
				field == Fields.CCTV3 ||
				field == Fields.CCTV4)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
