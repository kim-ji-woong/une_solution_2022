using System;

namespace GGH.Model
{
    public class UpdateData
    {
		public enum Fields { ID, Timestamp, NameOfTable, FieldList, ValueList, PrimaryCondition };

		public int ID { get; set; }
		public DateTime Timestamp { get; set; }
		public string NameOfTable { get; set; }
		public string FieldList { get; set; }
		public string ValueList { get; set; }
		public string PrimaryCondition { get; set; }

		public static string TableName { get { return "UpdateData"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.FieldList ||
				field == Fields.PrimaryCondition)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
