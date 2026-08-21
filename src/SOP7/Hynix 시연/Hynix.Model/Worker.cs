using System;

namespace Hynix.Model
{
	public class Worker
	{
		public enum Fields { WorkerID, Name, OfficeName, TeamName, PhoneNumber };

		public int WorkerID { get; set; }
		public string Name { get; set; }
		public string OfficeName { get; set; }
		public string TeamName { get; set; }
		public string PhoneNumber { get; set; }

		public static string TableName { get { return "HynixWorker"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			isNullable = false;
			return field.ToString();
		}
	}
}
