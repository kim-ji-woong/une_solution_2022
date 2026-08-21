using System;

namespace GGH.Model
{
    public class Evacuation
    {
		public enum Fields { SiteID, TimeStamp, UniqueKey, IsEvac };

		public int SiteID { get; set; }
		public DateTime TimeStamp { get; set; }
		public string UniqueKey { get; set; }
		public bool IsEvac { get; set; }

		public static string TableName { get { return "SdmsEvacuation"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.UniqueKey)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
