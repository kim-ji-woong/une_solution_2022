using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace IntegrationServer.ViewModels.Earthquake
{
    class EarthquakeHistory : Table
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
			return string.Format("TimeStamp = '{0}-{1:00}-{2:00} {3:00}:{4:00}:{5:00}'", TimeStamp.Year, TimeStamp.Month, TimeStamp.Day, TimeStamp.Hour, TimeStamp.Minute, TimeStamp.Second);
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
