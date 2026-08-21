using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System;
using System.Collections.Generic;
using System.Text;

namespace IntegrationServer.ViewModels.Hynix.History
{
	public class CardTag : Table
	{
		public enum Fields { CardTagHistoryID, Time, CardID, CardReaderID, Type, IsApprove };
		public enum WriteFields { CardTagHistoryID, Time, CardID, CardReaderID, Type, IsApprove };

		public int CardTagHistoryID { get; set; }
		public DateTime Time { get; set; }
		public int CardID { get; set; }
		public int CardReaderID { get; set; }
		public int Type { get; set; }
		public bool IsApprove { get; set; }

		public static string TableName { get { return "HynixCardTagHistory"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.CardTagHistoryID, CardTagHistoryID);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(CardTag obj)
		{
			this.CardTagHistoryID = obj.CardTagHistoryID;
			this.Time = obj.Time;
			this.CardID = obj.CardID;
			this.CardReaderID = obj.CardReaderID;
			this.Type = obj.Type;
			this.IsApprove = obj.IsApprove;
		}
	}
}
