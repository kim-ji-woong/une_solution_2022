using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Nipa.Model.Sdms.Spatial
{
	public class BuildingGroup : Table
	{
		public enum Fields { ID, GroupName, ParentID, TextCenter, DisplayText, SiteID };
		public enum WriteFields { ID, GroupName, ParentID, TextCenter, DisplayText, SiteID };

		public int ID { get; set; }
		public string GroupName { get; set; }
		public int? ParentID { get; set; }
		public string TextCenter { get; set; }
		public string DisplayText { get; set; }
		public int SiteID { get; set; }

		public static string TableName { get { return "SdmsSpatialBuildingGroup"; } }

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
