using System;

namespace VDS.Model.Account
{
	public class Option
	{
		public enum Fields { ID, UserID, Category, SubCategory, PropertyValue1, PropertyValue2, PropertyValue3, PropertyValue4 };

		public int ID { get; set; }
		public int UserID { get; set; }
		public string Category { get; set; }
		public string SubCategory { get; set; }
		public string PropertyValue1 { get; set; }
		public string PropertyValue2 { get; set; }
		public string PropertyValue3 { get; set; }
		public string PropertyValue4 { get; set; }

		public static string TableName { get { return "AccountOption"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.SubCategory ||
				field == Fields.PropertyValue1 ||
				field == Fields.PropertyValue2 ||
				field == Fields.PropertyValue3 ||
				field == Fields.PropertyValue4)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
