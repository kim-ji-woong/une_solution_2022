using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace IntegrationServer.ViewModels.MES.Hansol.Oracle
{
    public class Productivity_now : Table
    {
		public enum Fields { DRPT_CD, 라인, PROD_QTY, TRGT_QTY, 생산성, WORD_QTY, 달성율 };
		public enum WriteFields { DRPT_CD, 라인, PROD_QTY, TRGT_QTY, 생산성, WORD_QTY, 달성율 };

		public string DRPT_CD { get; set; }
		public string 라인 { get; set; }
		public double? PROD_QTY { get; set; }
		public double? TRGT_QTY { get; set; }
		public double? 생산성 { get; set; }
		public double? WORD_QTY { get; set; }
		public double? 달성율 { get; set; }

		public static string TableName { get { return "productivity_now001"; } }

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
