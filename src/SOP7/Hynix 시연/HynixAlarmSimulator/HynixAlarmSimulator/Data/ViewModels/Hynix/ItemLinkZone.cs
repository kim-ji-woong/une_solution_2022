using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System;
using System.Collections.Generic;
using System.Text;

namespace HynixAlarmSimulator.Data.ViewModels.Hynix
{
	public class ItemLinkZone : Table
	{
		public enum Fields { ItemID, ZoneID };
		public enum WriteFields { ItemID, ZoneID };

		public int ItemID { get; set; }
		public int ZoneID { get; set; }

		public static string TableName { get { return "HynixItemLinkZone"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1} and {2} = {3}", Fields.ItemID, ItemID, Fields.ZoneID, ZoneID);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(ItemLinkZone obj)
		{
			this.ItemID = obj.ItemID;
			this.ZoneID = obj.ZoneID;
		}
	}
}
