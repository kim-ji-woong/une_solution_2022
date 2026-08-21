using System;
using System.Collections.Generic;
using System.Text;

namespace Airbase20.Model
{
	public class Relay
	{
		public enum Fields { ID, Name, Type, IP, SubIP, Port, ElectCurrent_A, ElectCurrent_B, ElectCurrent_C, Volt_A, Volt_B, Volt_C, Factor, ActivePower, ReactivePower, Frequency, ActivePowerTotal, ReactivePowerTotal, Memo, SlaveID };

		public int ID { get; set; }
		public string Name { get; set; }
		public int Type { get; set; }
		public string IP { get; set; }
		public string SubIP { get; set; }
		public int Port { get; set; }
		public double? ElectCurrent_A { get; set; }
		public double? ElectCurrent_B { get; set; }
		public double? ElectCurrent_C { get; set; }
		public double? Volt_A { get; set; }
		public double? Volt_B { get; set; }
		public double? Volt_C { get; set; }
		public double? Factor { get; set; }
		public double? ActivePower { get; set; }
		public double? ReactivePower { get; set; }
		public double? Frequency { get; set; }
		public double? ActivePowerTotal { get; set; }
		public double? ReactivePowerTotal { get; set; }
		public string Memo { get; set; }
		public int SlaveID { get; set; }

		public static string TableName { get { return "Relay"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.ElectCurrent_A ||
				field == Fields.ElectCurrent_B ||
				field == Fields.ElectCurrent_C ||
				field == Fields.Volt_A ||
				field == Fields.Volt_B ||
				field == Fields.Volt_C ||
				field == Fields.Factor ||
				field == Fields.ActivePower ||
				field == Fields.ReactivePower ||
				field == Fields.Frequency ||
				field == Fields.ActivePowerTotal ||
				field == Fields.ReactivePowerTotal ||
				field == Fields.Memo)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
