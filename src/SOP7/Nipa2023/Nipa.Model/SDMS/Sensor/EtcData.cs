using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Nipa.Model.Sdms.Sensor
{
	public class EtcData : Table
	{
		public enum Fields { SensorID, PropertyName, PropertyValue, SiteID, Description };
		public enum WriteFields { SensorID, PropertyName, PropertyValue, SiteID, Description };

		public int SensorID { get; set; }
		public string PropertyName { get; set; }
		public string PropertyValue { get; set; }
		public int SiteID { get; set; }
		public string Description { get; set; }

		public static string TableName { get { return "SdmsSensorEtcData"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("SensorID = {0} and PropertyName = '{1}'", SensorID, PropertyName);
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
