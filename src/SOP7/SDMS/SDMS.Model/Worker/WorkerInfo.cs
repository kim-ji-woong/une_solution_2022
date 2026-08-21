using System;
using System.Collections.Generic;
using System.Text;

namespace SDMS.Model.Worker
{
	public class WorkerInfo
	{
		public enum Fields { ID, SpatialType, SpatialID, WorkerCount, WorkerType, Comment };
		public enum Spatial_Type { BuildingGroup = 1, Building, Zone, EquipmentZone };
		public enum Worker_Type { Visitor = 1, YesterWorker = 2, PlanVisitor = 3 };

		public int ID { get; set; }
		public int SpatialType { get; set; }
		public int SpatialID { get; set; }
		public int WorkerCount { get; set; }
		public int? WorkerType { get; set; }
		public string Comment { get; set; }

		public static string TableName { get { return "SdmsWorkerInfo"; } }

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
