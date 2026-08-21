using System;
using System.Collections.Generic;
using System.Text;

namespace Airbase20.Model
{
	public class SwitchDetail
	{
		public enum Fields { ID, SwitchID, Circuit, OpenClose, FI_Auto_A, FI_Auto_B, FI_Auto_C, FI_Auto_N, FI_Manual_A, FI_Manual_B, FI_Manual_C, FI_Manual_N, Break_A, Break_B, Break_C, Phase_A, Phase_B, Phase_C, Phase_N, MaxLoad_A, MaxLoad_B, MaxLoad_C, MaxLoad_N, AverageLoad_A, AverageLoad_B, AverageLoad_C, AverageLoad_N, FailCurrent_A, FailCurrent_B, FailCurrent_C, FailCurrent_N, AppartPower_A, AppartPower_B, AppartPower_C, ElectCurrent_A, ElectCurrent_B, ElectCurrent_C, ElectCurrent_N, Volt_A, Volt_B, Volt_C, TideFlow_Fwd, TideFlow_Rev, FailFlow_Fwd, FailFlow_Rev, Memo };

		public int ID { get; set; }
		public int SwitchID { get; set; }
		public int Circuit { get; set; }
		public bool? OpenClose { get; set; }
		public bool? FI_Auto_A { get; set; }
		public bool? FI_Auto_B { get; set; }
		public bool? FI_Auto_C { get; set; }
		public bool? FI_Auto_N { get; set; }
		public bool? FI_Manual_A { get; set; }
		public bool? FI_Manual_B { get; set; }
		public bool? FI_Manual_C { get; set; }
		public bool? FI_Manual_N { get; set; }
		public bool? Break_A { get; set; }
		public bool? Break_B { get; set; }
		public bool? Break_C { get; set; }
		public int? Phase_A { get; set; }
		public int? Phase_B { get; set; }
		public int? Phase_C { get; set; }
		public int? Phase_N { get; set; }
		public int? MaxLoad_A { get; set; }
		public int? MaxLoad_B { get; set; }
		public int? MaxLoad_C { get; set; }
		public int? MaxLoad_N { get; set; }
		public int? AverageLoad_A { get; set; }
		public int? AverageLoad_B { get; set; }
		public int? AverageLoad_C { get; set; }
		public int? AverageLoad_N { get; set; }
		public int? FailCurrent_A { get; set; }
		public int? FailCurrent_B { get; set; }
		public int? FailCurrent_C { get; set; }
		public int? FailCurrent_N { get; set; }
		public int? AppartPower_A { get; set; }
		public int? AppartPower_B { get; set; }
		public int? AppartPower_C { get; set; }
		public int? ElectCurrent_A { get; set; }
		public int? ElectCurrent_B { get; set; }
		public int? ElectCurrent_C { get; set; }
		public int? ElectCurrent_N { get; set; }
		public int? Volt_A { get; set; }
		public int? Volt_B { get; set; }
		public int? Volt_C { get; set; }
		public bool? TideFlow_Fwd { get; set; }
		public bool? TideFlow_Rev { get; set; }
		public bool? FailFlow_Fwd { get; set; }
		public bool? FailFlow_Rev { get; set; }
		public string Memo { get; set; }

		public static string TableName { get { return "SwitchDetail"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.OpenClose ||
				field == Fields.FI_Auto_A ||
				field == Fields.FI_Auto_B ||
				field == Fields.FI_Auto_C ||
				field == Fields.FI_Auto_N ||
				field == Fields.FI_Manual_A ||
				field == Fields.FI_Manual_B ||
				field == Fields.FI_Manual_C ||
				field == Fields.FI_Manual_N ||
				field == Fields.Break_A ||
				field == Fields.Break_B ||
				field == Fields.Break_C ||
				field == Fields.Phase_A ||
				field == Fields.Phase_B ||
				field == Fields.Phase_C ||
				field == Fields.Phase_N ||
				field == Fields.MaxLoad_A ||
				field == Fields.MaxLoad_B ||
				field == Fields.MaxLoad_C ||
				field == Fields.MaxLoad_N ||
				field == Fields.AverageLoad_A ||
				field == Fields.AverageLoad_B ||
				field == Fields.AverageLoad_C ||
				field == Fields.AverageLoad_N ||
				field == Fields.FailCurrent_A ||
				field == Fields.FailCurrent_B ||
				field == Fields.FailCurrent_C ||
				field == Fields.FailCurrent_N ||
				field == Fields.AppartPower_A ||
				field == Fields.AppartPower_B ||
				field == Fields.AppartPower_C ||
				field == Fields.ElectCurrent_A ||
				field == Fields.ElectCurrent_B ||
				field == Fields.ElectCurrent_C ||
				field == Fields.ElectCurrent_N ||
				field == Fields.Volt_A ||
				field == Fields.Volt_B ||
				field == Fields.Volt_C ||
				field == Fields.TideFlow_Fwd ||
				field == Fields.TideFlow_Rev ||
				field == Fields.FailFlow_Fwd ||
				field == Fields.FailFlow_Rev ||
				field == Fields.Memo)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
