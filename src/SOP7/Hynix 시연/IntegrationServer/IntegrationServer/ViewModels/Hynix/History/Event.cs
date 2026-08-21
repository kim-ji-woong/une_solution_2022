using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System;
using System.Collections.Generic;
using System.Text;

namespace IntegrationServer.ViewModels.Hynix.History
{
	public class Event : Table
	{
		public const int DoorOpen = 1;
		public const int Abnormal = 2;

		public enum Fields { EventHistroyID, CardReaderID, WorkerID, Time, Type };
		public enum WriteFields { EventHistroyID, CardReaderID, WorkerID, Time, Type };

		public int EventHistroyID { get; set; }
		public int? CardReaderID { get; set; }
		public int? WorkerID { get; set; }
		public DateTime Time { get; set; }
		public int Type { get; set; }

		public static string TableName { get { return "HynixEventHistroy"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.EventHistroyID, EventHistroyID);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(Event obj)
		{
			this.EventHistroyID = obj.EventHistroyID;
			this.CardReaderID = obj.CardReaderID;
			this.WorkerID = obj.WorkerID;
			this.Time = obj.Time;
			this.Type = obj.Type;
		}
	}
}
