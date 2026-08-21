using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Nipa.Model.Sdms.CCTV
{
	public class CCTV : Table
	{
		public enum Fields { ID, CameraName, PositionName, UniqueKey, X, Y, Z, ZoneID, IsIndoor, Type, Channel, UserID, Password, URL, BigURL, SmallURL, Enabled, Description, CameraIP, CameraCompanyName, CameraModelName };
		public enum WriteFields { ID, CameraName, PositionName, UniqueKey, X, Y, Z, ZoneID, IsIndoor, Type, Channel, UserID, Password, URL, BigURL, SmallURL, Enabled, Description, CameraIP, CameraCompanyName, CameraModelName };

		public int ID { get; set; }
		public string CameraName { get; set; }
		public string PositionName { get; set; }
		public string UniqueKey { get; set; }
		public double? X { get; set; }
		public double? Y { get; set; }
		public double? Z { get; set; }
		public int? ZoneID { get; set; }
		public bool IsIndoor { get; set; }
		public string Type { get; set; }
		public int? Channel { get; set; }
		public string UserID { get; set; }
		public string Password { get; set; }
		public string URL { get; set; }
		public string BigURL { get; set; }
		public string SmallURL { get; set; }
		public bool? Enabled { get; set; }
		public string Description { get; set; }
		public string CameraIP { get; set; }
		public string CameraCompanyName { get; set; }
		public string CameraModelName { get; set; }

		public static string TableName { get { return "SdmsCCTV"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("ID = {0}", ID);
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
