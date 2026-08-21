using System;

namespace VDS.Model
{
	public class FacilityType
	{
		public enum Fields { ID, EquipmentTypeID, ModelName, CompanyID, Width, Depth, Height, UnitOfLength, Color, ImageUrl, GlbUrl, FbxUrl, ClassName, Memo, RegDate, ChangeDate };

		public int ID { get; set; }
		public int EquipmentTypeID { get; set; }
		public string ModelName { get; set; }
		public int CompanyID { get; set; }
		public int? Width { get; set; }
		public int? Depth { get; set; }
		public int? Height { get; set; }
		public int UnitOfLength { get; set; }
		public string Color { get; set; }
		public string ImageUrl { get; set; }
		public string GlbUrl { get; set; }
		public string FbxUrl { get; set; }
		public string ClassName { get; set; }
		public string Memo { get; set; }
		public DateTime RegDate { get; set; }
		public DateTime? ChangeDate { get; set; }

		public static string TableName { get { return "FacilityType"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.Width ||
				field == Fields.Depth ||
				field == Fields.Height ||
				field == Fields.Color ||
				field == Fields.ImageUrl ||
				field == Fields.GlbUrl ||
				field == Fields.FbxUrl ||
				field == Fields.ClassName ||
				field == Fields.Memo ||
				field == Fields.ChangeDate)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
