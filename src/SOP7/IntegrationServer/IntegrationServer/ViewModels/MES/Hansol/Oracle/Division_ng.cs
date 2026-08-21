using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace IntegrationServer.ViewModels.MES.Hansol.Oracle
{
    public class Division_ng : Table
    {
		public enum Fields { Type, D01, D02, D03, D04, D05, D06, D07, D08, D09, D10, D11, D12, D13, D14, D15, D16, D17, D18, D19, D20, D21, D22, D23, D24, D25, D26, D27, D28, D29, D30, D31, Total };
		public enum WriteFields { Type, D01, D02, D03, D04, D05, D06, D07, D08, D09, D10, D11, D12, D13, D14, D15, D16, D17, D18, D19, D20, D21, D22, D23, D24, D25, D26, D27, D28, D29, D30, D31, Total };

		public string Type { get; set; }
		public int? D01 { get; set; }
		public int? D02 { get; set; }
		public int? D03 { get; set; }
		public int? D04 { get; set; }
		public int? D05 { get; set; }
		public int? D06 { get; set; }
		public int? D07 { get; set; }
		public int? D08 { get; set; }
		public int? D09 { get; set; }
		public int? D10 { get; set; }
		public int? D11 { get; set; }
		public int? D12 { get; set; }
		public int? D13 { get; set; }
		public int? D14 { get; set; }
		public int? D15 { get; set; }
		public int? D16 { get; set; }
		public int? D17 { get; set; }
		public int? D18 { get; set; }
		public int? D19 { get; set; }
		public int? D20 { get; set; }
		public int? D21 { get; set; }
		public int? D22 { get; set; }
		public int? D23 { get; set; }
		public int? D24 { get; set; }
		public int? D25 { get; set; }
		public int? D26 { get; set; }
		public int? D27 { get; set; }
		public int? D28 { get; set; }
		public int? D29 { get; set; }
		public int? D30 { get; set; }
		public int? D31 { get; set; }
		public int? Total { get; set; }

		public static string TableName { get { return "DIVISION_NG_001"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}
	}
}
