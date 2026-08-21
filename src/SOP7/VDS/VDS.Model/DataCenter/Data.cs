using System;

namespace VDS.Model.DataCenter
{
	public class Data
	{
		public enum Fields { CenterID, IsClone, ParentID, ManagerTeam, Manager, Company };

		public int CenterID { get; set; }
		public bool IsClone { get; set; }
		public int? ParentID { get; set; }
		public string ManagerTeam { get; set; }
		public string Manager { get; set; }
		public string Company { get; set; }

		public static string TableName { get { return "DataCenterData"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.ParentID ||
				field == Fields.ManagerTeam ||
				field == Fields.Manager)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
