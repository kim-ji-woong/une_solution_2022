using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Nipa.Model.Sdms.CCTV
{
	public class EquipZone : Table
	{
		public enum Fields { id, EquipZoneID, CCTV1, CCTV2, CCTV3, CCTV4, CCTV5, CCTV6, PRESET1, PRESET2, PRESET3, PRESET4, PRESET5, PRESET6, Description };
		public enum WriteFields { id, EquipZoneID, CCTV1, CCTV2, CCTV3, CCTV4, CCTV5, CCTV6, PRESET1, PRESET2, PRESET3, PRESET4, PRESET5, PRESET6, Description };

		public int id { get; set; }
		public int EquipZoneID { get; set; }
		public int? CCTV1 { get; set; }
		public int? CCTV2 { get; set; }
		public int? CCTV3 { get; set; }
		public int? CCTV4 { get; set; }
		public int? CCTV5 { get; set; }
		public int? CCTV6 { get; set; }
		public string PRESET1 { get; set; }
		public string PRESET2 { get; set; }
		public string PRESET3 { get; set; }
		public string PRESET4 { get; set; }
		public string PRESET5 { get; set; }
		public string PRESET6 { get; set; }
		public string Description { get; set; }

		public static string TableName { get { return "SdmsCCTVEquipZone"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("id = {0}", id);
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
