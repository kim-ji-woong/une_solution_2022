using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DbBackup.Models.Sop.Component
{
	public class ProcessMission : Table
	{
		public enum Fields { id, missionText, processID };
		public enum WriteFields { id, missionText, processID };

		public int id { get; set; }
		public string missionText { get; set; }
		public int processID { get; set; }

		public static string TableName { get { return "SopComponentProcessMission"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.id, id);
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
