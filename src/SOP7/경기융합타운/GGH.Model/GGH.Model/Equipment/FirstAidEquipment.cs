namespace GGH.Model.Equipment
{
	public class FirstAidEquipment
	{
		public enum Fields { ID, EquipmentType, EquipmentName, ZoneID, X, Y, Z, SiteID };

		public int ID { get; set; }
		public int EquipmentType { get; set; }
		public string EquipmentName { get; set; }
		public int ZoneID { get; set; }
		public double? X { get; set; }
		public double? Y { get; set; }
		public double? Z { get; set; }
		public int SiteID { get; set; }

		public static string TableName { get { return "SdmsFirstAidEquipment"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.X ||
				field == Fields.Y ||
				field == Fields.Z)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
