using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace IntegrationServer.ViewModels.Syswill.Model
{
	public class Fire : Table
	{
		public enum Fields { index, fire_id, val, uptime };
		public enum WriteFields { index, fire_id, val, uptime };

		public int index { get; set; }
		public string fire_id { get; set; }
		public string val { get; set; }
		public DateTime uptime { get; set; }

		public static string TableName { get { return "tb_fire_info"; } }

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

		public void FromCopy(Fire obj)
		{
			this.index = obj.index;
			this.fire_id = obj.fire_id;
			this.val = obj.val;
			this.uptime = obj.uptime;
		}
	}
}
