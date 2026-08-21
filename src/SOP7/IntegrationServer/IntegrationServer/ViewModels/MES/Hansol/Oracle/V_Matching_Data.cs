using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace IntegrationServer.ViewModels.MES.Hansol.Oracle
{
    public class V_Matching_Data : Table
    {
		public enum Fields { LINE_CD, COLLECTION_DATE, RESOURCE_CODE, COLLECTION_VALUE, TEST_DT, PART_NO, TYPE, NG_NM, IMAGEPATH };
		public enum WriteFields { LINE_CD, COLLECTION_DATE, RESOURCE_CODE, COLLECTION_VALUE, TEST_DT, PART_NO, TYPE, NG_NM, IMAGEPATH };

		public string LINE_CD { get; set; }
		public string COLLECTION_DATE { get; set; }
		public string RESOURCE_CODE { get; set; }
		public string COLLECTION_VALUE { get; set; }
		public string TEST_DT { get; set; }
		public string PART_NO { get; set; }
		public string TYPE { get; set; }
		public string NG_NM { get; set; }
		public string IMAGEPATH { get; set; }

		public static string TableName { get { return "V_Matching_Data"; } }

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
