using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Nipa.Model.Sdms.Sensor
{
	public class FacilityType : Table
	{
		public enum Fields { ID, TypeName, LinkedTableName, SiteID, Description, DisasterCategoryID, SubDisasterCategoryID, UOM };
		public enum WriteFields { ID, TypeName, LinkedTableName, SiteID, Description, DisasterCategoryID, SubDisasterCategoryID, UOM };

		public int ID { get; set; }
		public string TypeName { get; set; }
		public string LinkedTableName { get; set; }
		public int SiteID { get; set; }
		public string Description { get; set; }
		public int? DisasterCategoryID { get; set; }
		public int? SubDisasterCategoryID { get; set; }
		public string UOM { get; set; }

		public static string TableName { get { return "SdmsSensorFacilityType"; } }

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
