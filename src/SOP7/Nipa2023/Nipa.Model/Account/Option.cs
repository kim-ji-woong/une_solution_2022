using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Nipa.Model.Account
{
	public class Option : Table
	{
		public enum Fields { ID, UserID, Category, SubCategory, PropertyValue1, PropertyValue2, PropertyValue3, PropertyValue4 };
		public enum WriteFields { UserID, Category, SubCategory, PropertyValue1, PropertyValue2, PropertyValue3, PropertyValue4 };

		public int ID { get; set; }
		public int UserID { get; set; }
		public string Category { get; set; }
		public string SubCategory { get; set; }
		public string PropertyValue1 { get; set; }
		public string PropertyValue2 { get; set; }
		public string PropertyValue3 { get; set; }
		public string PropertyValue4 { get; set; }

		public static string TableName { get { return "SopAccountOption"; } }

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
