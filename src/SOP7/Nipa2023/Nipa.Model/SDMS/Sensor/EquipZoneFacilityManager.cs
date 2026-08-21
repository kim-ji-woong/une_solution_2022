using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Nipa.Model.Sdms.Sensor
{
	public class EquipZoneFacilityManager : Table
	{
		public enum Fields { ID, MemberID, MemberType, FacilityType, DetectType, EquipZoneID, Description, SiteID };
		public enum WriteFields { ID, MemberID, MemberType, FacilityType, DetectType, EquipZoneID, Description, SiteID };

		public int ID { get; set; }
		public int MemberID { get; set; }
		public int MemberType { get; set; }
		public int FacilityType { get; set; }
		public int DetectType { get; set; }
		public int EquipZoneID { get; set; }
		public string Description { get; set; }
		public int SiteID { get; set; }

		public static string TableName { get { return "SdmsSensorEquipZoneFacilityManager"; } }

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
