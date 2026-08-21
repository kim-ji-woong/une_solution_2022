using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System;
using System.Collections.Generic;
using System.Text;

namespace HynixAlarmSimulator.Data.ViewModels.Hynix
{
	public class Worker : Table
	{
		public enum Fields { WorkerID, Name, OfficeName, TeamName };
		public enum WriteFields { WorkerID, Name, OfficeName, TeamName };

		public int WorkerID { get; set; }
		public string Name { get; set; }
		public string OfficeName { get; set; }
		public string TeamName { get; set; }

		public static string TableName { get { return "HynixWorker"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.WorkerID, WorkerID);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(Worker obj)
		{
			this.WorkerID = obj.WorkerID;
			this.Name = obj.Name;
			this.OfficeName = obj.OfficeName;
			this.TeamName = obj.TeamName;
		}
	}
}
