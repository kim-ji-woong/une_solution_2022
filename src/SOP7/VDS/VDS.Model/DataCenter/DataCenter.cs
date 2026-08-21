using System;

namespace VDS.Model.DataCenter
{
	public class DataCenter
	{
		public enum Fields { ID, Name, EngName, SiteID, NationID, Address, RegDate, Width, Length, Height, TileWidth, TileLength, TileElevation, UnitOfLength, Type, Latitude, Longitude, CreationType, Memo, BeginGridX, BeginGridY, UTC };
		public enum UnitType { MM = 0, CM, Meter, KM };

		public int ID { get; set; }
		public string Name { get; set; }
		public string EngName { get; set; }
		public int SiteID { get; set; }
		public int NationID { get; set; }
		public string Address { get; set; }
		public DateTime RegDate { get; set; }
		public int Width { get; set; }
		public int Length { get; set; }
		public int Height { get; set; }
		public int TileWidth { get; set; }
		public int TileLength { get; set; }
		public int TileElevation { get; set; }
		public int UnitOfLength { get; set; }
		public string Type { get; set; }
		public double Latitude { get; set; }
		public double Longitude { get; set; }
		public string CreationType { get; set; }
		public string Memo { get; set; }
		public int BeginGridX { get; set; }
		public int BeginGridY { get; set; }
		public double UTC { get; set; }

		public static string TableName { get { return "DataCenter"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.Memo)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
