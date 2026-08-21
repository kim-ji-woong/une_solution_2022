using System;
using System.Collections.Generic;
using System.Text;

namespace Dashboard.Model
{
    public class WorkPermit
    {
		public enum Fields { ID, SpatialType, SpatialID, WorkerType, WorkerCount, Comment };
		public enum Spatial_Type { BuildingGroup = 1, Building, Zone };
		/// <summary>
		/// 1: 일반, 2: 화기, 3: 고소, 4: 정전, 5: 밀폐, 6: 중장비, 7: 굴착, 8: 방사선, 9: 공통, 10: 용접, 11: 전기
		/// </summary>
		public enum Worker_Type { Normal = 1, Fire, High, Blackout, Closeness, Heavy, Excavation, Radiation, Common, Welding, Electric }

		public int ID { get; set; }
		public int SpatialType { get; set; }
		public int SpatialID { get; set; }
		public int? WorkerType { get; set; }
		public int WorkerCount { get; set; }
		public string Comment { get; set; }

		public static string TableName { get { return "DashboardWorkPermit"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.WorkerType ||
				field == Fields.Comment)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
