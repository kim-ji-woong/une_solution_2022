using System;
using System.Windows.Forms;
using System.Net;
using System.IO;
using Newtonsoft.Json.Linq;
using Weather.Model;
using Weather.DAL;

namespace WeatherMaster
{
    public class WeatherManager
    {
        // 없음, 비, 비 또는 눈, 눈, 빗방울, 빗방울 & 눈날림, 눈날림
        public enum RainType { None = 0, Rain, RainSnow, Snow, RainDrop = 5, RainDropSnowDrift, SnowDritf };
        // 맑음, 구름많음, 흐림
        public enum SkyType { Sunny = 1, Cloud = 3, Cloudy = 4 }
        // 풍향 0(북), 1(북북동), 2(북동), 3(동북동), 4(동), 5(동남동), 6(남동), 7(남남동), 8(남), 9(남남서), 10(남서), 11(서남서), 12(서), 13(서북서), 14(북서), 15(북북서)
        public enum WindDirection { North = 0, NNE, NE, ENE, East, ESE, SE, SSE, South, SSW, SW, WSW, West, WNW, NW, NNW };

        public static bool ReadWeatherInfo(int x, int y, string strKey, DataManager dataManager)
        {
            if (strKey.Length == 0)
            {
                MessageBox.Show("API 호출키의 유효기간이 지났습니다.\r\n새로 발급받으세요.");
                return false;
            }

            try
            {
                string key = strKey;
                string url = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst";

                // 1시간 이전의 데이터를 호출한다.
                DateTime dtPrev = DateTime.Now.AddHours(-1);

                string date = string.Format("{0}{1:0,0}{2:0,0}", dtPrev.Year, dtPrev.Month, dtPrev.Day);
                string strHour = string.Format("{0:00}{1:00}", dtPrev.Hour, dtPrev.Minute);
                string requestString = string.Format("{0}?serviceKey={1}&pageNo={2}&numOfRows={3}&dataType={4}&base_date={5}&base_time={6}&nx={7}&ny={8}",
                    url, key, 1, 1000, "JSON", date, strHour, x, y);
                WebRequest request = WebRequest.Create(requestString); // 호출할 url
                request.Method = "GET";
                WebResponse response = request.GetResponse();
                Stream dataStream = response.GetResponseStream();
                StreamReader reader = new StreamReader(dataStream);
                string responseFromServer = reader.ReadToEnd();
                Console.WriteLine(responseFromServer); // response 출력
                JObject root = JObject.Parse(responseFromServer);
                JToken items = root["response"]?["body"]?["items"]?["item"];

                Current weather = null;

                if (null != items)
                {
                    weather = UpdateSky(items, x, y, key);
                }
                reader.Close();
                dataStream.Close();
                response.Close();

                if (weather == null)
                {
                    System.Diagnostics.Trace.WriteLine("데이터를 읽어오지 못하였습니다.");
                }
                else
                {
                    UpdateWeather(weather, dataManager);
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.WriteLine(ex.Message);
            }

            return true;
        }

        private static bool UpdateWeather(Current weather, DataManager dataManager)
        {
            string strErrorMessage;
            Current _weather = dataManager.GetSelectManager().SelectCurrent(weather.WeatherSiteID, out strErrorMessage);

            if (_weather != null)
            {
                weather.UpdateTime = DateTime.Now;

                if (dataManager.GetUpdateManager().UpdateCurrent(weather, out strErrorMessage) == false)
                {
                    System.Diagnostics.Trace.WriteLine("UpdateWeather Error1 : " + strErrorMessage);
                    return false;
                }
            }
            else if (strErrorMessage != null && strErrorMessage.Length > 0)
            {
                System.Diagnostics.Trace.WriteLine("UpdateWeather Error2 : " + strErrorMessage);
                return false;
            }
            else
            {
                if (dataManager.GetCreateManager().CreateCurrent(weather.WeatherSiteID, weather.State, weather.Temperature, weather.SensibleTemp, weather.Rain, weather.Humidity, weather.WindSpeed, weather.WindDirection, weather.Atm, DateTime.Now) == null)
                {
                    System.Diagnostics.Trace.WriteLine("UpdateWeather Error3 : " + dataManager.GetCreateManager().GetErrorMessage());
                    return false;
                }
            }

            return true;
        }

        private static Current UpdateSky(JToken weatherObj, int x, int y, string key)
        {
            foreach (JObject item in weatherObj)
            {
                JToken category = item["category"];
                if (null == category)
                    continue;
                string catName = category.Value<string>();
                switch (catName)
                {
                    case "SKY": //하늘상태
                        SkyType skyType = GetSkyType(item["fcstValue"].Value<string>());
                        return GetWeatherInfo1(skyType, x, y, key);
                }
            }

            return null;
        }

        private static SkyType GetSkyType(string strType)
        {
            int nType;

            if (int.TryParse(strType, out nType))
            {
                return (SkyType)nType;
            }

            return SkyType.Sunny;
        }

        // 초단기예보(실시간값)
        private static Current GetWeatherInfo1(SkyType skyType, int x, int y, string key)
        {
            Current weather = null;

            try
            {
                string url = "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst";

                // 1시간 이전의 데이터를 호출한다.
                DateTime dtPrev = DateTime.Now.AddHours(-1);

                string date = string.Format("{0}{1:0,0}{2:0,0}", dtPrev.Year, dtPrev.Month, dtPrev.Day);
                string strHour = string.Format("{0:00}{1:00}", dtPrev.Hour, dtPrev.Minute);
                string requestString = string.Format("{0}?serviceKey={1}&pageNo={2}&numOfRows={3}&dataType={4}&base_date={5}&base_time={6}&nx={7}&ny={8}",
                    url, key, 1, 1000, "JSON", date, strHour/*"0600"*/, x, y);
                WebRequest request = WebRequest.Create(requestString); // 호출할 url
                request.Method = "GET";
                WebResponse response = request.GetResponse();
                Stream dataStream = response.GetResponseStream();
                StreamReader reader = new StreamReader(dataStream);
                string responseFromServer = reader.ReadToEnd();
                Console.WriteLine(responseFromServer); // response 출력
                JObject root = JObject.Parse(responseFromServer);
                JToken items = root["response"]?["body"]?["items"]?["item"];
                if (null != items)
                {
                    weather = UpdateWeather(items, skyType);
                }
                reader.Close();
                dataStream.Close();
                response.Close();

                if (items == null)
                    System.Diagnostics.Trace.WriteLine("데이터를 읽어오지 못하였습니다.");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            return weather;
        }

        private static Current UpdateWeather(JToken weatherObj, SkyType skyType)
        {
            Current weather = new Current();
            weather.Atm = 1013;
            weather.WeatherSiteID = 1;

            foreach (JObject item in weatherObj)
            {
                JToken category = item["category"];
                if (null == category)
                    continue;
                string catName = category.Value<string>();
                switch (catName)
                {
                    case "T1H": //기온
                        weather.Temperature = item["obsrValue"].Value<float>();
                        weather.SensibleTemp = weather.Temperature;
                        break;
                    case "RN1": //1시간 강수량 (mm)
                        weather.Rain = item["obsrValue"].Value<float>();
                        break;
                    case "REH": //습도
                        weather.Humidity = item["obsrValue"].Value<float>();
                        break;
                    case "WSD": //풍속
                        weather.WindSpeed = item["obsrValue"].Value<float>();
                        break;
                    case "VEC": //풍향 degree
                        weather.WindDirection = DegreeToCompass(item["obsrValue"].Value<float>());
                        break;
                    case "PTY": // 강수형태
                        weather.State = (int)GetWeatherState(item["obsrValue"].Value<string>(), skyType);
                        break;
                }
            }

            return weather;
        }

        private static int DegreeToCompass(float deg)
        {
            int val = (int)Math.Round(deg / 22.5);
            return val % 16;
        }

        private static Current.WeatherState GetWeatherState(string strType, SkyType skyType)
        {
            int nType;

            if (int.TryParse(strType, out nType))
            {
                return GetWeatherState((RainType)nType, skyType);
            }

            return GetWeatherState(RainType.None, skyType);
        }

        private static Current.WeatherState GetWeatherState(RainType type, SkyType skyType)
        {
            if (type == RainType.None)
            {
                if (skyType == SkyType.Sunny)
                    return Current.WeatherState.Sunshine;
                else if (skyType == SkyType.Cloud)
                    return Current.WeatherState.Cloud;
                else// if (skyType == SkyType.Cloudy)
                    return Current.WeatherState.Cloudy;
            }
            else if (type == RainType.Rain)
                return Current.WeatherState.Rain;
            else if (type == RainType.RainSnow)
                return Current.WeatherState.SnowRain;
            else if (type == RainType.None)
                return Current.WeatherState.Snow;
            else if (type == RainType.RainDrop)
                return Current.WeatherState.Rain;
            else if (type == RainType.RainDropSnowDrift)
                return Current.WeatherState.SnowRain;
            else if (type == RainType.SnowDritf)
                return Current.WeatherState.Snow;

            return Current.WeatherState.Unknown;
        }
    }
}
