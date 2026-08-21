using System;

namespace VDS.Model
{
	public class ItemType
	{
		public enum Fields { ID, EquipmentType, CompanyID, ModelName, Type, Height, Width, Depth, Unit, Shelf, ImageUrl, BackImageUrl, GlbUrl, FbxUrl, ClassName, Memo, RegDate, ChangeDate };

		public int ID { get; set; }
		public int EquipmentType { get; set; }
		public int CompanyID { get; set; }
		public string ModelName { get; set; }
		public string Type { get; set; }
		public double? Height { get; set; }
		public double? Width { get; set; }
		public double? Depth { get; set; }
		public int? Unit { get; set; }
		public bool? Shelf { get; set; }
		public string ImageUrl { get; set; }
		public string BackImageUrl { get; set; }
		public string GlbUrl { get; set; }
		public string FbxUrl { get; set; }
		public string ClassName { get; set; }
		public string Memo { get; set; }
		public DateTime RegDate { get; set; }
		public DateTime? ChangeDate { get; set; }

		public static string TableName { get { return "ItemType"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.Type ||
				field == Fields.Height ||
				field == Fields.Width ||
				field == Fields.Depth ||
				field == Fields.Unit ||
				field == Fields.Shelf ||
				field == Fields.ImageUrl ||
				field == Fields.BackImageUrl ||
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
