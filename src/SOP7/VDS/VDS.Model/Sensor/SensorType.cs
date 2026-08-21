namespace VDS.Model.Sensor
{
	public class SensorType
	{
		public enum Fields { ID, Name, EngName, Code, RangeMax, RangeMin, Unit, ImageUrl, AbnormalImageUrl };

		public int ID { get; set; }
		public string Name { get; set; }
		public string EngName { get; set; }
		public string Code { get; set; }
		public int? RangeMax { get; set; }
		public int? RangeMin { get; set; }
		public string Unit { get; set; }
		public string ImageUrl { get; set; }
		public string AbnormalImageUrl { get; set; }

		public static string TableName { get { return "SensorType"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.RangeMax ||
				field == Fields.RangeMin ||
				field == Fields.Unit)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
