using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace MesReader.Data.Model
{
    public class V_dashboard : Table
    {
		public enum Fields { 고객명, 발주수량, 입고수량, 차이수량, 재고수량 };
		public enum WriteFields { 고객명, 발주수량, 입고수량, 차이수량, 재고수량 };

		public string 고객명 { get; set; }
		public double? 발주수량 { get; set; }
		public double? 입고수량 { get; set; }
		public double? 차이수량 { get; set; }
		public double? 재고수량 { get; set; }

		public static string TableName { get { return "V_DASHBOARD_001"; } }

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
