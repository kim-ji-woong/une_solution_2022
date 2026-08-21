using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Nipa.Model.Weather
{
	public class Weekly : Table
	{
		public enum Fields { WeatherSiteID, OneDayLaterTemp, OneDayLaterState, TwoDayLaterTemp, TwoDayLaterState, ThreeDayLaterTemp, ThreeDayLaterState, FourDayLaterTemp, FourDayLaterState, FiveDayLaterTemp, FiveDayLaterState, SixDayLaterTemp, SixDayLaterState, UpdateTime, OneDayMiniTemp, TwoDayMiniTemp, ThreeDayMiniTemp, FourDayMiniTemp, FiveDayMiniTemp, SixDayMiniTemp };
		public enum WriteFields { WeatherSiteID, OneDayLaterTemp, OneDayLaterState, TwoDayLaterTemp, TwoDayLaterState, ThreeDayLaterTemp, ThreeDayLaterState, FourDayLaterTemp, FourDayLaterState, FiveDayLaterTemp, FiveDayLaterState, SixDayLaterTemp, SixDayLaterState, UpdateTime, OneDayMiniTemp, TwoDayMiniTemp, ThreeDayMiniTemp, FourDayMiniTemp, FiveDayMiniTemp, SixDayMiniTemp };
		
		public int WeatherSiteID { get; set; }
		public double OneDayLaterTemp { get; set; }
		// Current.WeatherState
		public int OneDayLaterState { get; set; }
		public double TwoDayLaterTemp { get; set; }
		// Current.WeatherState
		public int TwoDayLaterState { get; set; }
		public double ThreeDayLaterTemp { get; set; }
		// Current.WeatherState
		public int ThreeDayLaterState { get; set; }
		public double FourDayLaterTemp { get; set; }
		// Current.WeatherState
		public int FourDayLaterState { get; set; }
		public double FiveDayLaterTemp { get; set; }
		// Current.WeatherState
		public int FiveDayLaterState { get; set; }
		public double SixDayLaterTemp { get; set; }
		// Current.WeatherState
		public int SixDayLaterState { get; set; }
		public DateTime UpdateTime { get; set; }
		public double OneDayMiniTemp { get; set; }
		public double TwoDayMiniTemp { get; set; }
		public double ThreeDayMiniTemp { get; set; }
		public double FourDayMiniTemp { get; set; }
		public double FiveDayMiniTemp { get; set; }
		public double SixDayMiniTemp { get; set; }

		public static string TableName { get { return "WeatherWeekly"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("WeatherSiteID = {0}", WeatherSiteID);
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
