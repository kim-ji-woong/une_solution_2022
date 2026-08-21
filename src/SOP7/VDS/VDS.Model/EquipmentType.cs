using System;

namespace VDS.Model
{
	public class EquipmentType
	{
		public enum Fields { ID, Name, EngName, CategoryID };

		public int ID { get; set; }
		public string Name { get; set; }
		public string EngName { get; set; }
		public int CategoryID { get; set; }

		public static string TableName { get { return "EquipmentType"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			isNullable = false;
			return field.ToString();
		}
	}
}
