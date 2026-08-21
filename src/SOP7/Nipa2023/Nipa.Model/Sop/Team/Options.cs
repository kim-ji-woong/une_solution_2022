using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Nipa.Model.Sop.Team
{
	public class Options : Table
	{
		public enum Fields { ID, PropertyID, PropertyName, PropertyValue };
		public enum WriteFields { ID, PropertyID, PropertyName, PropertyValue };

		public int ID { get; set; }
		public int PropertyID { get; set; }
		public string PropertyName { get; set; }
		public string PropertyValue { get; set; }

		public static string TableName { get { return "SopTeamOptions"; } }

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
