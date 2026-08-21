using System;

namespace Hynix.Model
{
	public class Item
	{
		public enum Fields { ItemID, Name };

		public int ItemID { get; set; }
		public string/* nullable */ Name { get; set; }

		public static string TableName { get { return "HynixItem"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.Name)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
