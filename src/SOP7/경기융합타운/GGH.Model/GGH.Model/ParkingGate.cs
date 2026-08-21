namespace GGH.Model
{
    public class ParkingGate
    {
		public enum Fields { ID, Name, GateCode, InOut, Status, SiteID };
		public enum GateStatus { None = 0, Closed, Opened, NetworkError };

		public int ID { get; set; }
		public string Name { get; set; }
		public string GateCode { get; set; }
		public bool InOut { get; set; }
		public int Status { get; set; }
		public int SiteID { get; set; }

		public static string TableName { get { return "SdmsParkingGate"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			isNullable = false;
			return field.ToString();
		}
	}
}
