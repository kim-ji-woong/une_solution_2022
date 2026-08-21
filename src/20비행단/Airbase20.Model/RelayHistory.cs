using System;
using System.Collections.Generic;
using System.Text;

namespace Airbase20.Model
{
	public class RelayHistory
	{
		public enum Fields { ID, RelayID, Date, ActivePowerTotal, ReactivePowerTotal };

		public int ID { get; set; }
		public int RelayID { get; set; }
		public DateTime? Date { get; set; }
		public double? ActivePowerTotal { get; set; }
		public double? ReactivePowerTotal { get; set; }

		public static string TableName { get { return "RelayHistory"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.Date ||
				field == Fields.ActivePowerTotal ||
				field == Fields.ReactivePowerTotal)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
