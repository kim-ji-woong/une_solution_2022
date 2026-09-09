using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace IntegrationServer.ViewModels.Syswill.Model
{
	public class Ups : Table
	{
		public enum Fields { ups1, ups2, ups3, ups4, ups5, ups6, ups1_val, ups2_val, ups3_val, ups4_val, ups5_val, ups6_val, uptime, alarm_depth };
		public enum WriteFields { ups1, ups2, ups3, ups4, ups5, ups6, ups1_val, ups2_val, ups3_val, ups4_val, ups5_val, ups6_val, uptime, alarm_depth };

		public int ups1 { get; set; }
		public int ups2 { get; set; }
		public int ups3 { get; set; }
		public int ups4 { get; set; }
		public int ups5 { get; set; }
		public int ups6 { get; set; }
		public int ups1_val { get; set; }
		public int ups2_val { get; set; }
		public int ups3_val { get; set; }
		public int ups4_val { get; set; }
		public int ups5_val { get; set; }
		public int ups6_val { get; set; }
		public DateTime uptime { get; set; }
		public int alarm_depth { get; set; }

		public static string TableName { get { return "tb_power_info"; } }

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

		public void FromCopy(Ups obj)
		{
			this.ups1 = obj.ups1;
			this.ups2 = obj.ups2;
			this.ups3 = obj.ups3;
			this.ups4 = obj.ups4;
			this.ups5 = obj.ups5;
			this.ups6 = obj.ups6;
			this.ups1_val = obj.ups1_val;
			this.ups2_val = obj.ups2_val;
			this.ups3_val = obj.ups3_val;
			this.ups4_val = obj.ups4_val;
			this.ups5_val = obj.ups5_val;
			this.ups6_val = obj.ups6_val;
			this.uptime = obj.uptime;
			this.alarm_depth = obj.alarm_depth;
		}
	}
}
