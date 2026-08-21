using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Nipa.Model.Weather
{
	public class Site : Table
	{
		public enum Fields { ID, Name, Description };
		public enum WriteFields { ID, Name, Description };

		public int ID { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }

		public static string TableName { get { return "WeatherSite"; } }

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
