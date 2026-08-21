using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Nipa.Model.Sdms
{
    public class OptionSDMS : Table
    {
		public enum Fields { ID, PropertyName, PropertyValue, SiteID, Description };
		public enum WriteFields { PropertyName, PropertyValue, SiteID, Description };

		public int ID { get; set; }
		public string PropertyName { get; set; }
		public string PropertyValue { get; set; }
		public int SiteID { get; set; }
		public string Description { get; set; }

		public static string TableName { get { return "OptionSDMS"; } }

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
