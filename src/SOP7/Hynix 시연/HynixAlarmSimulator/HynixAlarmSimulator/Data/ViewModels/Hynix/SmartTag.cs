using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System;
using System.Collections.Generic;
using System.Text;

namespace HynixAlarmSimulator.Data.ViewModels.Hynix
{
	public class SmartTag : Table
	{
		public enum Fields { SmartTagID, UniqueKey, WorkerID, ItemID };
		public enum WriteFields { SmartTagID, UniqueKey, WorkerID, ItemID };

		public int SmartTagID { get; set; }
		public string/* nullable */ UniqueKey { get; set; }
		public int? WorkerID { get; set; }
		public int? ItemID { get; set; }

		public static string TableName { get { return "HynixSmartTag"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.SmartTagID, SmartTagID);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(SmartTag obj)
		{
			this.SmartTagID = obj.SmartTagID;
			this.UniqueKey = obj.UniqueKey;
			this.WorkerID = obj.WorkerID;
			this.ItemID = obj.ItemID;
		}
	}
}
