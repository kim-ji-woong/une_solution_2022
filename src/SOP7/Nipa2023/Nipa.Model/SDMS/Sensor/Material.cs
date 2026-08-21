using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Nipa.Model.Sdms.Sensor
{
	public class Material : Table
	{
		public enum Fields { ID, MaterialName, UOM, SiteID, Description };
		public enum WriteFields { ID, MaterialName, UOM, SiteID, Description };

		public int ID { get; set; }
		public string MaterialName { get; set; }
		public string UOM { get; set; }
		public int SiteID { get; set; }
		public string Description { get; set; }

		public static string TableName { get { return "SdmsSensorMaterial"; } }

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
