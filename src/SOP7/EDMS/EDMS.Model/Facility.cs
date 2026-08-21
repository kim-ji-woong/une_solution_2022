namespace EDMS.Model
{
	public class Facility
	{
		public enum Fields { ID, ModelName, IsPoi, LinkedPipe, RunPipeBall, ShowPopup, SensorName, ShowTreeView, ZoneID, MaterialTypeID };

		public int ID { get; set; }
		public string ModelName { get; set; }
		public bool IsPoi { get; set; }
		public bool? LinkedPipe { get; set; }
		public bool? RunPipeBall { get; set; }
		public bool ShowPopup { get; set; }
		public string SensorName { get; set; }
		public bool ShowTreeView { get; set; }
		public int ZoneID { get; set; }
		public int MaterialTypeID { get; set; }

		public static string TableName { get { return "EdmsFacility"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.LinkedPipe ||
				field == Fields.RunPipeBall ||
				field == Fields.SensorName)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
