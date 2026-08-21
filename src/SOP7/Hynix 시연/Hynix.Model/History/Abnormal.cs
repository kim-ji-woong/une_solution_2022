using System;
using System.Collections.Generic;
using System.Text;

namespace Hynix.Model.History
{
	public class Abnormal
    {
		public enum Fields { WorkerID, Time, EventHistroyID, Memo };

		public int WorkerID { get; set; }
		public DateTime Time { get; set; }
		public int EventHistroyID { get; set; }
		public string/* nullable */ Memo { get; set; }

		public static string TableName { get { return "HynixAbnormalHistory"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.Memo)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
