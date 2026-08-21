using System;

namespace VDS.Model.Site
{
	public class Data
	{
		public enum Fields { SiteID, Address, ManagerTeam, Manager, ServiceBeginDate, ServiceEndDate, LicenseValidation };

		public int SiteID { get; set; }
		public string Address { get; set; }
		public string ManagerTeam { get; set; }
		public string Manager { get; set; }
		public DateTime ServiceBeginDate { get; set; }
		public DateTime ServiceEndDate { get; set; }
		public bool LicenseValidation { get; set; }

		public static string TableName { get { return "SiteData"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.ManagerTeam ||
				field == Fields.Manager)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
