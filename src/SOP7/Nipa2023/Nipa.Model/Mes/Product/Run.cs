using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Nipa.Model.Mes.Product
{
	public class Run : Table
	{
		public enum Fields { SiteID, TotalCount, NotRun, RunCount, Ready, NoPlan, RunPercentage };
		public enum WriteFields { SiteID, TotalCount, NotRun, RunCount, Ready, NoPlan, RunPercentage };

		public int SiteID { get; set; }
		// 대수
		public int TotalCount { get; set; }
		// 비가동
		public int NotRun { get; set; }
		// 가동
		public int RunCount { get; set; }
		// 준비
		public int Ready { get; set; }
		// 계획없음
		public int NoPlan { get; set; }
		// 설비 가동률 현황
		public double RunPercentage { get; set; }

		public static string TableName { get { return "MesProductRun"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("SiteID = {0}", SiteID);
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
