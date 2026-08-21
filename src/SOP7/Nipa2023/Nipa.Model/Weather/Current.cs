using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Nipa.Model.Weather
{
	public class Current : Table
	{
		public enum Fields { WeatherSiteID, Temperature, SensibleTemp, Rain, Humidity, WindSpeed, WindDirection, Atm, UpdateTime, State };
		public enum WriteFields { WeatherSiteID, Temperature, SensibleTemp, Rain, Humidity, WindSpeed, WindDirection, Atm, UpdateTime, State };
		// 알수없음, 맑음, 천둥번개, 진눈깨비, 폭설, 눈, 폭우, 비, 흐림, 구름조금, 황사, 미세먼지
		public enum WeatherState { Unknown = 0, Sunshine, Thunder, SnowRain, HeavySnow, Snow, HeavyRain, Rain, Cloudy, Cloud, DustStorm, FineDust };

		private int m_nSiteID = -1;

		public int WeatherSiteID
		{
			get { return m_nSiteID; }
			set { m_nSiteID = value; }
		}

		public double Temperature { get; set; }
		public double? SensibleTemp { get; set; }
		public double Rain { get; set; }
		public double Humidity { get; set; }
		public double? WindSpeed { get; set; }
		public int? WindDirection { get; set; }
		public double? Atm { get; set; }
		public DateTime UpdateTime { get; set; }
		public int? State { get; set; }

		public static string TableName { get { return "WeatherCurrent"; } }

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

		public static string StateToString(int state)
		{
			switch (state)
			{
				case (int)WeatherState.Sunshine:
					return "맑음";

				case (int)WeatherState.Thunder:
					return "천둥번개";

				case (int)WeatherState.SnowRain:
					return "진눈깨비";

				case (int)WeatherState.HeavySnow:
					return "강한 눈";

				case (int)WeatherState.Snow:
					return "눈";

				case (int)WeatherState.HeavyRain:
					return "강한 비";

				case (int)WeatherState.Rain:
					return "비";

				case (int)WeatherState.Cloudy:
					return "흐림";

				case (int)WeatherState.Cloud:
					return "구름 조금";

				case (int)WeatherState.DustStorm:
					return "황사";

				case (int)WeatherState.FineDust:
					return "미세먼지";
			}

			return "알수없음";
		}
	}
}
