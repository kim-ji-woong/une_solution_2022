namespace VDS.Model.Site
{
	public class Option
	{
		public enum Fields { PropertyName, PropertyValue, Description };

		public const string LicenseAlertDays = "LicenseAlertDays";

		public string PropertyName { get; set; }
		public string PropertyValue { get; set; }
		public string Description { get; set; }

		public static string TableName { get { return "SiteOption"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.Description)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
