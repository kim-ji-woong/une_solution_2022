using System;

namespace GGH.Model.History
{
	public class Earthquake
	{
		public enum Fields { TimeStamp, Hpga, Tpga, Gal, Intensity };

		public DateTime TimeStamp { get; set; }
		public double Hpga { get; set; }
		public double Tpga { get; set; }
		public double Gal { get; set; }
		public int Intensity { get; set; }

		public static string TableName { get { return "SdmsHistoryEarthquake"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			isNullable = false;
			return field.ToString();
		}
	}
}
