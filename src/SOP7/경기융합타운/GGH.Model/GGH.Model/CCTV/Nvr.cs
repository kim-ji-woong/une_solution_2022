namespace GGH.Model.CCTV
{
	public class Nvr
	{
		public enum Fields { ID, Name, Url, Description };

		public int ID { get; set; }
		public string Name { get; set; }
		public string Url { get; set; }
		public string Description { get; set; }

		public static string TableName { get { return "SdmsCCTVNvr"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.Description)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
