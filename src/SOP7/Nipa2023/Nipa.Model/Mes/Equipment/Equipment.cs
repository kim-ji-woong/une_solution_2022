using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Nipa.Model.Mes.Equipment
{
	public class Equipment : Table
	{
		public enum Fields { ID, Name, Usable, SiteID };
		public enum WriteFields { ID, Name, Usable, SiteID };

		public int ID { get; set; }
		public string Name { get; set; }
		public bool Usable { get; set; }
		public int SiteID { get; set; }

		public static string TableName { get { return "MesEquipment"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("ID = {0}", ID);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}
	}
}
