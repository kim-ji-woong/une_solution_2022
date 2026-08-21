using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Nipa.Model.Sdms.Spatial
{
	public class ZoneData : Table
	{
		public enum Fields { ZoneID, FakeWallElevation, PoiElevation, ObjectID, CameraPositionX, CameraPositionY, CameraPositionZ, CameraRotationX, CameraRotationY, CameraRotationZ };
		public enum WriteFields { ZoneID, FakeWallElevation, PoiElevation, ObjectID, CameraPositionX, CameraPositionY, CameraPositionZ, CameraRotationX, CameraRotationY, CameraRotationZ };

		public int ZoneID { get; set; }
		public double? FakeWallElevation { get; set; }
		public double? PoiElevation { get; set; }
		public string ObjectID { get; set; }
		public float? CameraPositionX { get; set; }
		public float? CameraPositionY { get; set; }
		public float? CameraPositionZ { get; set; }
		public float? CameraRotationX { get; set; }
		public float? CameraRotationY { get; set; }
		public float? CameraRotationZ { get; set; }

		public static string TableName { get { return "SdmsSpatialZoneData"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("ZoneID = {0}", ZoneID);
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
