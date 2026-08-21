using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Nipa.Model.Sdms.Sensor
{
	public class ServerInfo : Table
	{
		public enum Fields { ID, Place, IP, ServerType, Port, Status, SOPWebServerURL, bUse, SiteID };
		public enum WriteFields { ID, Place, IP, ServerType, Port, Status, SOPWebServerURL, bUse, SiteID };

		public int ID { get; set; }
		public string Place { get; set; }
		public string IP { get; set; }
		public int ServerType { get; set; }
		public int? Port { get; set; }
		public bool? Status { get; set; }
		public string SOPWebServerURL { get; set; }
		public bool? bUse { get; set; }
		public int? SiteID { get; set; }

		public static string TableName { get { return "SdmsSensorServerInfo"; } }

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
