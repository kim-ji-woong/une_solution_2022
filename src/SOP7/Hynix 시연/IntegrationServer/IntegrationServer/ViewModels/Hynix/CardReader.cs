using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System;
using System.Collections.Generic;
using System.Text;

namespace IntegrationServer.ViewModels.Hynix
{
	public class CardReader : Table
	{
		public enum Fields { CardReaderID, ZoneID, UniqueKey, X, Y, Z };
		public enum WriteFields { CardReaderID, ZoneID, UniqueKey, X, Y, Z };

		public int CardReaderID { get; set; }
		public int ZoneID { get; set; }
		public string/* nullable */ UniqueKey { get; set; }
		public int? X { get; set; }
		public int? Y { get; set; }
		public int? Z { get; set; }

		public static string TableName { get { return "HynixCardReader"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.CardReaderID, CardReaderID);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(CardReader obj)
		{
			this.CardReaderID = obj.CardReaderID;
			this.ZoneID = obj.ZoneID;
			this.UniqueKey = obj.UniqueKey;
			this.X = obj.X;
			this.Y = obj.Y;
			this.Z = obj.Z;
		}
	}
}
