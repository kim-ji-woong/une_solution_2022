using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DbBackup.Models.Sop.Config
{
	public class LinkedSop : Table
	{
		public enum Fields { ID, FacilityTypeID, DisasterCategoryID, SubDisasterCategoryID, DisasterName, LinkedBuildingGroupID, LinkedBuildingID, LinkedZoneID, Description, SiteID };
		public enum WriteFields { ID, FacilityTypeID, DisasterCategoryID, SubDisasterCategoryID, DisasterName, LinkedBuildingGroupID, LinkedBuildingID, LinkedZoneID, Description, SiteID };

		public int ID { get; set; }
		public int FacilityTypeID { get; set; }
		public int DisasterCategoryID { get; set; }
		public int SubDisasterCategoryID { get; set; }
		public string DisasterName { get; set; }
		public int? LinkedBuildingGroupID { get; set; }
		public int? LinkedBuildingID { get; set; }
		public int? LinkedZoneID { get; set; }
		public string Description { get; set; }
		public int? SiteID { get; set; }

		public static string TableName { get { return "SopConfigLinkedSop"; } }

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
