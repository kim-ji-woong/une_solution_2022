using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace IntegrationServer.ViewModels.Syswill.Model
{
	public class Elevator : Table
	{
		public enum Fields { index, uniqueid, doorstatus, floor, status, direction, uptime };
		public enum WriteFields { index, uniqueid, doorstatus, floor, status, direction, uptime };

		public int index { get; set; }
		public string uniqueid { get; set; }
		public int doorstatus { get; set; }
		public int floor { get; set; }
		public int status { get; set; }
		public int direction { get; set; }
		public DateTime uptime { get; set; }

		public static string TableName { get { return "tb_ev_info"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.index, index);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}

		public void FromCopy(Elevator obj)
		{
			this.index = obj.index;
			this.uniqueid = obj.uniqueid;
			this.doorstatus = obj.doorstatus;
			this.floor = obj.floor;
			this.status = obj.status;
			this.direction = obj.direction;
			this.uptime = obj.uptime;
		}
	}
}
