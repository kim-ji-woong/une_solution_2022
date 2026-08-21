using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DbBackup.Models.Sop.History
{
    class ComponentHistoryDetail : Table
	{
		public enum Fields { ID, ComponentHistoryID, DataIndex, Datai, Dataf, Datas, Time };
		public enum WriteFields { ID, ComponentHistoryID, DataIndex, Datai, Dataf, Datas, Time };

		public int ID { get; set; }
		public int ComponentHistoryID { get; set; }
		public int DataIndex { get; set; }
		public int? Datai { get; set; }
		public double? Dataf { get; set; }
		public string Datas { get; set; }
		public DateTime? Time { get; set; }

		public static string TableName { get { return "SopHistoryComponentDetail"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.ID, ID);
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
