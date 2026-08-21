using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System;
using System.Collections.Generic;
using System.Text;

namespace IntegrationServer.ViewModels.Hynix
{
	public class WokerLinkZone : Table
	{
		public enum Fields { WorkerID, ZoneID };
		public enum WriteFields { WorkerID, ZoneID };

		public int WorkerID { get; set; }
		public int ZoneID { get; set; }

		public static string TableName { get { return "HynixWokerLinkZone"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1} and {2} = {3}", Fields.WorkerID, WorkerID, Fields.ZoneID, ZoneID);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(WokerLinkZone obj)
		{
			this.WorkerID = obj.WorkerID;
			this.ZoneID = obj.ZoneID;
		}
	}
}
