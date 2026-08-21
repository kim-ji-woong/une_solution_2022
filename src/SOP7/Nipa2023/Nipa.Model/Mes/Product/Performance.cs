using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Nipa.Model.Mes.Product
{
	public class Performance : Table
	{
		public enum Fields { ID, LineName, Product, PerformanceRate, SiteID };
		public enum WriteFields { LineName, Product, PerformanceRate, SiteID };

		public int ID { get; set; }
		public string LineName { get; set; }
		// 생산성
		public double Product { get; set; }
		// 달성률
		public double PerformanceRate { get; set; }
		public int SiteID { get; set; }

		public static string TableName { get { return "MesProductPerformance"; } }

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
