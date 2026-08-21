using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System;
using System.Collections.Generic;
using System.Text;

namespace HynixAlarmSimulator.Data.ViewModels.Hynix.History
{
	public class Abnormal : Table
	{
		public enum Fields { WorkerID, Time, EventHistroyID, Memo };
		public enum WriteFields { WorkerID, Time, EventHistroyID, Memo };

		public int WorkerID { get; set; }
		public DateTime Time { get; set; }
		public int EventHistroyID { get; set; }
		public string/* nullable */ Memo { get; set; }

		public static string TableName { get { return "HynixAbnormalHistory"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1} and {2} = '{3}' and {4} = {5}", Fields.WorkerID, WorkerID, Fields.Time, Time, Fields.EventHistroyID, EventHistroyID);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(Abnormal obj)
		{
			this.WorkerID = obj.WorkerID;
			this.Time = obj.Time;
			this.EventHistroyID = obj.EventHistroyID;
			this.Memo = obj.Memo;
		}
	}
}
