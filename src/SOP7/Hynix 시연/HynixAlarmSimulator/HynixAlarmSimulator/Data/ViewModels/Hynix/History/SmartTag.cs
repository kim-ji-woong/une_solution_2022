using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System;
using System.Collections.Generic;
using System.Text;

namespace HynixAlarmSimulator.Data.ViewModels.Hynix.History
{
	public class SmartTag : Table
	{
		public enum Fields { SmartTagHistoryID, Time, SmartTagID, SmartTagReaderID };
		public enum WriteFields { SmartTagHistoryID, Time, SmartTagID, SmartTagReaderID };

		public int SmartTagHistoryID { get; set; }
		public DateTime Time { get; set; }
		public int SmartTagID { get; set; }
		public int SmartTagReaderID { get; set; }

		public static string TableName { get { return "HynixSmartTagHistory"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.SmartTagHistoryID, SmartTagHistoryID);
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
			this.SmartTagHistoryID = obj.SmartTagHistoryID;
			this.Time = obj.Time;
			this.SmartTagID = obj.SmartTagID;
			this.SmartTagReaderID = obj.SmartTagReaderID;
		}
	}
}
