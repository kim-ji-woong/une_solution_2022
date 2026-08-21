namespace GGH.Model.CCTV
{
	public class NvrLink
	{
		public enum Fields { CctvID, NvrID };

		public int CctvID { get; set; }
		public int NvrID { get; set; }

		public static string TableName { get { return "SdmsCCTVNvrLink"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			isNullable = false;
			return field.ToString();
		}
	}
}
