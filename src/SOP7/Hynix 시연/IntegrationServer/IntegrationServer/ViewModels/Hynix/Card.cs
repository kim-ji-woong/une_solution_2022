using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System;
using System.Collections.Generic;
using System.Text;

namespace IntegrationServer.ViewModels.Hynix
{
	public class Card : Table
	{
		public enum Fields { CardID, WorkerID, UniqueKey };
		public enum WriteFields { CardID, WorkerID, UniqueKey };

		public int CardID { get; set; }
		public int WorkerID { get; set; }
		public string UniqueKey { get; set; }

		public static string TableName { get { return "HynixCard"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.CardID, CardID);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(Card obj)
		{
			this.CardID = obj.CardID;
			this.WorkerID = obj.WorkerID;
			this.UniqueKey = obj.UniqueKey;
		}
	}
}
