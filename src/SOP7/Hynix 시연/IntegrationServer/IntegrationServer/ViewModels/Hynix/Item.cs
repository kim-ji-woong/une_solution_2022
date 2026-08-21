using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System;
using System.Collections.Generic;
using System.Text;

namespace IntegrationServer.ViewModels.Hynix
{
	public class Item : Table
	{
		public enum Fields { ItemID, Name };
		public enum WriteFields { ItemID, Name };

		public int ItemID { get; set; }
		public string/* nullable */ Name { get; set; }

		public static string TableName { get { return "HynixItem"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.ItemID, ItemID);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(Item obj)
		{
			this.ItemID = obj.ItemID;
			this.Name = obj.Name;
		}
	}
}
