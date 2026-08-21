using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Nipa.Model.Sdms.Spatial
{
	public class Building : Table
	{
		public enum Fields { ID, BuildingCode, BuildingName, BuildingGroupID, MaxFloor, MinFloor, TextCenter, BroadcastText, DisplayText };
		public enum WriteFields { ID, BuildingCode, BuildingName, BuildingGroupID, MaxFloor, MinFloor, TextCenter, BroadcastText, DisplayText };

		public int ID { get; set; }
		public string BuildingCode { get; set; }
		public string BuildingName { get; set; }
		public int BuildingGroupID { get; set; }
		public int MaxFloor { get; set; }
		public int MinFloor { get; set; }
		public string TextCenter { get; set; }
		public string BroadcastText { get; set; }
		public string DisplayText { get; set; }

		public static string TableName { get { return "SdmsSpatialBuilding"; } }

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
