using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace IntegrationServer.ViewModels.MES.Hansol.Oracle
{
    public class Category_ng : Table
    {
		public enum Fields { NG_DTL_NM, D01, D02, D03, D04, D05, D06, D07, D08, D09, D10, D11, D12, D13, D14, D15, D16, D17, D18, D19, D20, D21, D22, D23, D24, D25, D26, D27, D28, D29, D30, D31, Total };
		public enum WriteFields { NG_DTL_NM, D01, D02, D03, D04, D05, D06, D07, D08, D09, D10, D11, D12, D13, D14, D15, D16, D17, D18, D19, D20, D21, D22, D23, D24, D25, D26, D27, D28, D29, D30, D31, Total };

		public string NG_DTL_NM { get; set; }
		public double? D01 { get; set; }
		public double? D02 { get; set; }
		public double? D03 { get; set; }
		public double? D04 { get; set; }
		public double? D05 { get; set; }
		public double? D06 { get; set; }
		public double? D07 { get; set; }
		public double? D08 { get; set; }
		public double? D09 { get; set; }
		public double? D10 { get; set; }
		public double? D11 { get; set; }
		public double? D12 { get; set; }
		public double? D13 { get; set; }
		public double? D14 { get; set; }
		public double? D15 { get; set; }
		public double? D16 { get; set; }
		public double? D17 { get; set; }
		public double? D18 { get; set; }
		public double? D19 { get; set; }
		public double? D20 { get; set; }
		public double? D21 { get; set; }
		public double? D22 { get; set; }
		public double? D23 { get; set; }
		public double? D24 { get; set; }
		public double? D25 { get; set; }
		public double? D26 { get; set; }
		public double? D27 { get; set; }
		public double? D28 { get; set; }
		public double? D29 { get; set; }
		public double? D30 { get; set; }
		public double? D31 { get; set; }
		public double? Total { get; set; }

		public static string TableName { get { return "CATEGORY_NG_001"; } }

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
