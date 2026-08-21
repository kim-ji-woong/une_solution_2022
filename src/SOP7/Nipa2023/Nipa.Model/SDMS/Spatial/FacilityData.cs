using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Nipa.Model.Sdms.Spatial
{
	public class FacilityData : Table
	{
		public enum Fields { FacilityID, PropertyName, PropertyValue, PropertyUnit, SiteID, Description };
		public enum WriteFields { FacilityID, PropertyName, PropertyValue, PropertyUnit, SiteID, Description };

		public int FacilityID { get; set; }
		public string PropertyName { get; set; }
		public string PropertyValue { get; set; }
		public string PropertyUnit { get; set; }
		public int SiteID { get; set; }
		public string Description { get; set; }

		public static string TableName { get { return "SdmsSpatialFacilityData"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("FacilityID = {0} and PropertyName = '{1}'", FacilityID, PropertyName);
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
