using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace EarthquakeSimulator.Data
{
	class Earthquake : Table
	{
		public enum Fields { TimeStamp, Hpga, Tpga, Gal, Intensity };
		public enum WriteFields { TimeStamp, Hpga, Tpga, Gal, Intensity };

		public DateTime TimeStamp { get; set; }
		public double Hpga { get; set; }
		public double Tpga { get; set; }
		public double Gal { get; set; }
		public int Intensity { get; set; }

		public static string TableName { get { return "SdmsHistoryEarthquake"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = '{1}'", Fields.TimeStamp, TimeStamp);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}
	}
}
