using System;

namespace VDS.Model
{
	public class Item
	{
		public enum Fields { ID, Name, CenterID, ItemTypeID, Cpu, Ram, DiskInfo, DiskVolume, RegDate, ChangeDate, Usage, PositionInShelf, Status };
		public enum ShelfPosition { Left = 0, Center, Right };

		public int ID { get; set; }
		public string Name { get; set; }
		public int CenterID { get; set; }
		public int ItemTypeID { get; set; }
		public string Cpu { get; set; }
		public string Ram { get; set; }
		public string DiskInfo { get; set; }
		public string DiskVolume { get; set; }
		public DateTime? RegDate { get; set; }
		public DateTime? ChangeDate { get; set; }
		public string Usage { get; set; }
		public int? PositionInShelf { get; set; }
		public int? Status { get; set; }

		public static string TableName { get { return "Item"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.Cpu ||
				field == Fields.Ram ||
				field == Fields.DiskInfo ||
				field == Fields.DiskVolume ||
				field == Fields.RegDate ||
				field == Fields.ChangeDate ||
				field == Fields.PositionInShelf ||
				field == Fields.Status)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
