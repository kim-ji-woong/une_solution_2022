using System;

namespace VDS.Model
{
	public class RackType
	{
		public enum Fields { ID, CompanyID, ModelName, Height, Width, Depth, Unit, Type, ColorName, ColorEngName, ImageUrl, GlbUrl, FbxUrl, Memo, RegDate, ChangeDate };

		public int ID { get; set; }
		public int CompanyID { get; set; }
		public string ModelName { get; set; }
		public double Height { get; set; }
		public double Width { get; set; }
		public double Depth { get; set; }
		public int Unit { get; set; }
		public string Type { get; set; }
		public string ColorName { get; set; }
		public string ColorEngName { get; set; }
		public string ImageUrl { get; set; }
		public string GlbUrl { get; set; }
		public string FbxUrl { get; set; }
		public string Memo { get; set; }
		public DateTime RegDate { get; set; }
		public DateTime? ChangeDate { get; set; }

		public static string TableName { get { return "RackType"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.ImageUrl ||
				field == Fields.GlbUrl ||
				field == Fields.FbxUrl ||
				field == Fields.Memo ||
				field == Fields.ChangeDate)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
