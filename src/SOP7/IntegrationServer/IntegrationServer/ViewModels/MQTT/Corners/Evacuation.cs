using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace IntegrationServer.ViewModels.MQTT.Corners
{
    class Evacuation : Table
	{
		public enum Fields { SiteID, TimeStamp, UniqueKey, IsEvac };
		public enum WriteFields { SiteID, TimeStamp, UniqueKey, IsEvac };

		public int SiteID { get; set; }
		public DateTime TimeStamp { get; set; }
		public string UniqueKey { get; set; }
		public bool IsEvac { get; set; }

		public static string TableName { get { return "SdmsEvacuation"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("SiteID = {0}", SiteID);
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
