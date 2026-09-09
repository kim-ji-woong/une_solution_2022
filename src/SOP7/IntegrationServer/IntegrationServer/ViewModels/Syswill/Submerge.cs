using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace IntegrationServer.ViewModels.Syswill.Model
{
	public class Submerge : Table
	{
		public enum Fields { val, uptime, alarm_depth };
		public enum WriteFields { val, uptime, alarm_depth };

		public int val { get; set; }
		public DateTime uptime { get; set; }
		public int alarm_depth { get; set; }

		public static string TableName { get { return "tb_machine_info"; } }

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

		public void FromCopy(Submerge obj)
		{
			this.val = obj.val;
			this.uptime = obj.uptime;
			this.alarm_depth = obj.alarm_depth;
		}
	}
}
