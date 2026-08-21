using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace IntegrationServer.ViewModels.MES.Hansol.Oracle
{
    public class LineStatus : Table
    {
		public enum Fields { LINE_NM, LINE_CD, 설비상태 };
		public enum WriteFields { LINE_NM, LINE_CD, 설비상태 };

		public string LINE_NM { get; set; }
		public string LINE_CD { get; set; }
		public string 설비상태 { get; set; }

		public static string TableName { get { return "LINE_STATUS"; } }

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
