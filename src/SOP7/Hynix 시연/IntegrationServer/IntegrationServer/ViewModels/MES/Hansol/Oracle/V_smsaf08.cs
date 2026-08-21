using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace IntegrationServer.ViewModels.MES.Hansol.Oracle
{
    public class V_smsaf08 : Table
    {
		public enum Fields { CUST_NM, 전일수량, 전일금액, 당일수량, 당일금액, 월간수량, 월간금액 };
		public enum WriteFields { CUST_NM, 전일수량, 전일금액, 당일수량, 당일금액, 월간수량, 월간금액 };

		public string CUST_NM { get; set; }
		public double? 전일수량 { get; set; }
		public long? 전일금액 { get; set; }
		public double? 당일수량 { get; set; }
		public long? 당일금액 { get; set; }
		public double? 월간수량 { get; set; }
		public long? 월간금액 { get; set; }

		public static string TableName { get { return "V_SMSAF08_011"; } }

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
