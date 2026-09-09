using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace IntegrationServer.ViewModels.Syswill.Model
{
	public class Door : Table
	{
		public enum Fields { index, deviceName, openStatus, floorname };
		public enum WriteFields { index, deviceName, openStatus, floorname };

		public int index { get; set; }
		public string deviceName { get; set; }
		public string/* nullable */ openStatus { get; set; }
		public int floorname { get; set; }

		public static string TableName { get { return "tb_access_data"; } }

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

		public void FromCopy(Door obj)
		{
			this.index = obj.index;
			this.deviceName = obj.deviceName;
			this.openStatus = obj.openStatus;
			this.floorname = obj.floorname;
		}
	}
}
