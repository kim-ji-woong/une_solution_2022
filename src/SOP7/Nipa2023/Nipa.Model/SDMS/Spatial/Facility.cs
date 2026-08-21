using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Nipa.Model.Sdms.Spatial
{
	public class Facility : Table
	{
		public enum Fields { ID, Name, ZoneID, SiteID, Image, ObjectID };
		public enum WriteFields { ID, Name, ZoneID, SiteID, Image, ObjectID };

		public int ID { get; set; }
		public string Name { get; set; }
		public int ZoneID { get; set; }
		public int SiteID { get; set; }
		public string Image { get; set; }
		public string ObjectID { get; set; }

		public static string TableName { get { return "SdmsSpatialFacility"; } }

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
