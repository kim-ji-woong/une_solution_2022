using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace IntegrationServer.ViewModels.MES.Hansol.Oracle
{
    public class ShotData : Table
    {
		public enum Fields { COLLECTION_ID, RESOURCE_CODE, COLLECTION_DATE, COLLECTION_VALUE, PART_NO, LINE_CD, TEST_DT, OK_YN, IMAGEPATH, USE_YN };
		public enum WriteFields { COLLECTION_ID, RESOURCE_CODE, COLLECTION_DATE, COLLECTION_VALUE, PART_NO, LINE_CD, TEST_DT, OK_YN, IMAGEPATH, USE_YN };

		public long COLLECTION_ID { get; set; }
		public string RESOURCE_CODE { get; set; }
		public string COLLECTION_DATE { get; set; }
		public string COLLECTION_VALUE { get; set; }
		public string PART_NO { get; set; }
		public string LINE_CD { get; set; }
		public string TEST_DT { get; set; }
		public string OK_YN { get; set; }
		public string IMAGEPATH { get; set; }
		public string USE_YN { get; set; }

		public static string TableName { get { return "TB_SHOTDATA"; } }

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
