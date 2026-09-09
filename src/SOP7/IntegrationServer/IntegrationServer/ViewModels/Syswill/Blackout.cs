using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace IntegrationServer.ViewModels.Syswill.Model
{
	public class Blackout : Table
	{
		public enum Fields { vol_a, vol_b, vol_c, uptime, isAlarm };
		public enum WriteFields { vol_a, vol_b, vol_c, uptime, isAlarm };

		public int vol_a { get; set; }
		public int vol_b { get; set; }
		public int vol_c { get; set; }
		public DateTime uptime { get; set; }
		public bool isAlarm { get; set; }

		public static string TableName { get { return "tb_blackout_info"; } }

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

		public void FromCopy(Blackout obj)
		{
			this.vol_a = obj.vol_a;
			this.vol_b = obj.vol_b;
			this.vol_c = obj.vol_c;
			this.uptime = obj.uptime;
			this.isAlarm = obj.isAlarm;
		}
	}

    public class BlackoutF : Table
    {
        public enum Fields { vol_a, vol_b, vol_c, uptime, isAlarm };
        public enum WriteFields { vol_a, vol_b, vol_c, uptime, isAlarm };

        public double vol_a { get; set; }
        public double vol_b { get; set; }
        public double vol_c { get; set; }
        public DateTime uptime { get; set; }
        public bool isAlarm { get; set; }

        public static string TableName { get { return "tb_blackout_info"; } }

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

        public void FromCopy(BlackoutF obj)
        {
            this.vol_a = obj.vol_a;
            this.vol_b = obj.vol_b;
            this.vol_c = obj.vol_c;
            this.uptime = obj.uptime;
            this.isAlarm = obj.isAlarm;
        }
    }
}
