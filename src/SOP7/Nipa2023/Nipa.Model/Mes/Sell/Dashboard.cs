using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Nipa.Model.Mes.Sell
{
	public class Dashboard : Table
	{
		public enum Fields { ID, Customer, YesterdayCount, YesterdayMoney, TodayCount, TodayMoney, MonthlyCount, MonthlyMoney, SiteID };
		public enum WriteFields { Customer, YesterdayCount, YesterdayMoney, TodayCount, TodayMoney, MonthlyCount, MonthlyMoney, SiteID };

		public int ID { get; set; }
		// 거래처
		public string Customer { get; set; }
		// 전일수량
		public double YesterdayCount { get; set; }
		// 전일금액
		public long YesterdayMoney { get; set; }
		// 당일수량
		public double TodayCount { get; set; }
		// 당일금액
		public long TodayMoney { get; set; }
		// 월간수량
		public double MonthlyCount { get; set; }
		// 월간금액
		public long MonthlyMoney { get; set; }
		public int SiteID { get; set; }

		public static string TableName { get { return "MesSellDashboard"; } }

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
