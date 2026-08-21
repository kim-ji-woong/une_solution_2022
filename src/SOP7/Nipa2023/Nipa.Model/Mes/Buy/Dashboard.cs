using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Nipa.Model.Mes.Buy
{
	public class Dashboard : Table
	{
		public enum Fields { ID, Customer, RequestCount, IncomeCount, DiffCount, RemainCount, SiteID };
		public enum WriteFields { Customer, RequestCount, IncomeCount, DiffCount, RemainCount, SiteID };

		public int ID { get; set; }
		// 고객명
		public string Customer { get; set; }
		// 발주수량
		public double RequestCount { get; set; }
		// 입고수량
		public double IncomeCount { get; set; }
		// 차이수량
		public double DiffCount { get; set; }
		// 재고수량
		public double RemainCount { get; set; }
		public int SiteID { get; set; }

		public static string TableName { get { return "MesBuyDashboard"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("ID = {0}", ID);
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
