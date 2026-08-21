using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System;
using System.Collections.Generic;
using System.Text;

namespace HynixAlarmSimulator.Data.ViewModels.Hynix
{
	public class SmartTagReader : Table
	{
		public enum Fields { SmartTagReaderID, UniqueKey, ZoneID, X, Y, Z };
		public enum WriteFields { SmartTagReaderID, UniqueKey, ZoneID, X, Y, Z };

		public int SmartTagReaderID { get; set; }
		public string/* nullable */ UniqueKey { get; set; }
		public int ZoneID { get; set; }
		public int? X { get; set; }
		public int? Y { get; set; }
		public int? Z { get; set; }

		public static string TableName { get { return "HynixSmartTagReader"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.SmartTagReaderID, SmartTagReaderID);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(SmartTagReader obj)
		{
			this.SmartTagReaderID = obj.SmartTagReaderID;
			this.UniqueKey = obj.UniqueKey;
			this.ZoneID = obj.ZoneID;
			this.X = obj.X;
			this.Y = obj.Y;
			this.Z = obj.Z;
		}
	}
}
