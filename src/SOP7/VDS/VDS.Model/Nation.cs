using System;

namespace VDS.Model
{
	public class Nation
	{
		public enum Fields { ID, Name, EngName, Tag1, Tag2 };

		public int ID { get; set; }
		public string Name { get; set; }
		public string EngName { get; set; }
		public string Tag1 { get; set; }
		public string Tag2 { get; set; }

		public static string TableName { get { return "Nation"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			isNullable = false;
			return field.ToString();
		}
	}
}
