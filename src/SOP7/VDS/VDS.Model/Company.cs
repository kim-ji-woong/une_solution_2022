using System;

namespace VDS.Model
{
	public class Company
	{
		public enum Fields { ID, Name, EngName };

		public int ID { get; set; }
		public string Name { get; set; }
		public string EngName { get; set; }

		public static string TableName { get { return "Company"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			isNullable = false;
			return field.ToString();
		}
	}
}
