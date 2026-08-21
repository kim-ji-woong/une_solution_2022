namespace VDS.Model.DataCenter
{
	public class Viewport
	{
		public enum Fields { DataCenterID, PositionX, PositionY, PositionZ, RotationX, RotationY, RotationZ };

		public int DataCenterID { get; set; }
		public double PositionX { get; set; }
		public double PositionY { get; set; }
		public double PositionZ { get; set; }
		public double RotationX { get; set; }
		public double RotationY { get; set; }
		public double RotationZ { get; set; }

		public static string TableName { get { return "DataCenterViewport"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			isNullable = false;
			return field.ToString();
		}
	}
}
