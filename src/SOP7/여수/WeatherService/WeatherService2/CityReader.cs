using Newtonsoft.Json.Linq;
using System;
using System.Configuration;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using Weather.IDAL;
using Weather.DAL;
using Weather.Model;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using dnsDBUtil;

namespace WeatherService2
{
    public class CityReader
    {
        // 없음, 비 , 비 또는 눈 , 눈 , 빗방울 , 빗방울 & 눈날림 , 눈날림
        public enum RainType { None = 0, Rain, RainSnow, Snow, RainDrop = 5, RainDropSnowDrift, SnowDritf };

        // 없음 , 비 , 눈비 , 눈 , 소나기
        public enum RainType2 { None = 0, Rain, RainSnow, Snow, Shower };

        // 맑음, 구름많음, 흐림
        public enum SkyType { Sunny = 1, Cloud = 3, Cloudy = 4 }

        private Logger m_logger = null;

        private DataManager m_dataManager = new DataManager();
        private IDataManager dataManager = null;
        private string m_strKey = "";

        public string strErrorMessage = "";

        public CityReader()
        {
            SetDataManager();
        }

        private void SetDataManager()
        {
            string strSite = ConfigurationManager.AppSettings.Get("siteID");

            if (strSite == null || strSite.Length == 0)
                return;

            int nSiteID, nDBType;

            if (int.TryParse(strSite, out nSiteID) == false)
                return;

            string strKey = ConfigurationManager.AppSettings.Get("key");

            string strWebServerURL = ConfigurationManager.AppSettings.Get("webserverURL");
            string strDBHost = ConfigurationManager.AppSettings.Get("dbHost");
            string strDBName = ConfigurationManager.AppSettings.Get("dbName");
            string strDBType = ConfigurationManager.AppSettings.Get("dbType");

            string strDbID = AesHelper.Decrypt(ConfigurationManager.AppSettings.Get("dbID"), strKey);
            string strDbPw = AesHelper.Decrypt(ConfigurationManager.AppSettings.Get("dbPw"), strKey);

            string programInfo = string.Format("DbID: {0} , DbPW: {1}", strDbID, strDbPw);
            //m_logger.Write("DB User Info : " + programInfo);
            nDBType = int.Parse(strDBType);

            dataManager = new Weather.DAL.DataManager(nDBType, strDBHost, strDBName, strDbID, strDbPw, nSiteID);
        }

        public void CityWeatherReader(Logger logger)
        {
            m_logger = logger;

            string strKey = ConfigurationManager.AppSettings["apiKey"];
            string strExpired = ConfigurationManager.AppSettings["expired"];

            m_logger.Write("In CityWeatherReader()");


            if (strKey != null && strExpired != null)
            {
                DateTime dtNow = DateTime.Now;
                string strNow = string.Format("{0}{1:00}{2:00}", dtNow.Year, dtNow.Month, dtNow.Day);

                if (string.Compare(strNow, strExpired) >= 0)
                { 
                    strErrorMessage = "API 호출키의 유효기간이 지났습니다.\r\n새로 발급받으세요.";
                    m_logger.Write(strErrorMessage);
                    return;
                }

                else
                    m_strKey = strKey;
            }

            GetWeatherInfo3(null, 73, 66);

        }

        private void GetWeatherInfo3(Current2 m_current2, int x, int y, int hour = -1)
        {
            Current2 current2 = new Current2();

            if (m_strKey.Length == 0)
            {
                strErrorMessage = "API 호출키의 유효기간이 지났습니다.\r\n새로 발급받으세요.";
                m_logger.Write(strErrorMessage);
                return;
            }

            try
            {
                string key = m_strKey;
                string url = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";
                string url2 = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst";
                // 1시간 이전의 데이터를 호출한다.
                DateTime dtPrev = DateTime.Now.AddHours(-1);

                if (hour < 0)
                    hour = dtPrev.Hour;

                string date = string.Format("{0}{1:0,0}{2:0,0}", dtPrev.Year, dtPrev.Month, dtPrev.Day);
                string strHour = string.Format("{0:00}00", hour);

                string requestString2 = string.Format("{0}?serviceKey={1}&pageNo={2}&numOfRows={3}&dataType={4}&base_date={5}&base_time={6}&nx={7}&ny={8}",
                    url2, key, 1, 1000, "JSON", date, strHour, x, y);
                WebRequest request2 = WebRequest.Create(requestString2);
                request2.Method = "GET";
                WebResponse response2 = request2.GetResponse();
                Stream dataStrem2 = response2.GetResponseStream();
                StreamReader reader2 = new StreamReader(dataStrem2);
                string responseFromServer2 = reader2.ReadToEnd();
                Console.WriteLine("GetWeatherInfo3 : " + responseFromServer2); // response 출력
                JObject root2 = JObject.Parse(responseFromServer2);
                JToken items2 = root2["response"]?["body"]?["items"]?["item"];
                if (items2 != null)
                {
                    current2 = GetCurTemp(items2);
                }
                // 단기예보의 일일 최저 최고는 하루 1번 데이터가 들어오기 때문에 시간을 고정값으로 넣어줘야 한다
                string strHour2 = string.Format("0200");

                string requestString = string.Format("{0}?serviceKey={1}&pageNo={2}&numOfRows={3}&dataType={4}&base_date={5}&base_time={6}&nx={7}&ny={8}",
                    url, key, 1, 1000, "JSON", date, strHour2, x, y);
                WebRequest request = WebRequest.Create(requestString); // 호출할 url
                request.Method = "GET";
                WebResponse response = request.GetResponse();
                Stream dataStream = response.GetResponseStream();
                StreamReader reader = new StreamReader(dataStream);
                string responseFromServer = reader.ReadToEnd();
                Console.WriteLine("GetWeatherInfo3 : " + responseFromServer); // response 출력
                JObject root = JObject.Parse(responseFromServer);
                JToken items = root["response"]?["body"]?["items"]?["item"];
                if (null != items)
                {
                    m_logger.Write("IN UpdateWeather3");
                    UpdateWeather3(items, current2);
                }
                reader.Close();
                dataStream.Close();
                response.Close();

                if (items == null)
                {
                    if (hour > 0)
                        GetWeatherInfo3(current2, x, y, hour - 1);
                    else
                        strErrorMessage = "데이터를 읽어오지 못하였습니다.";
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                m_logger.Write("[Error] : " + ex.Message);
            }
        }

        public Current2 GetCurTemp (JToken weatherObj)
        {
            Current2 current2 = new Current2();

            foreach (JObject item in weatherObj)
            {
                JToken category = item["category"];
                if (category == null)
                    continue;
                string catName = category.Value<string>();
                switch (catName)
                {
                    case "T1H": //기온 obsrValue
                        string strTemperature = item["obsrValue"].Value<string>(); // + " ℃";
                        current2.Temperature = float.Parse(strTemperature);
                        break;
                }
            }
            return current2;
        }


        public void UpdateWeather3(JToken weatherObj, Current2 m_current2)
        {

            Current2 current2 = new Current2();
            SkyType skyType = 0;
            RainType2 rainType = 0;

            current2.Temperature = m_current2.Temperature;

            string currentTime = DateTime.Now.ToString("HH00");
            string currentDate = DateTime.Now.ToString("yyyyMMdd");

            foreach (JObject item in weatherObj)
            {
                JToken category = item["category"];
                JToken fcstTime = item["fcstTime"];
                JToken fcstDate = item["fcstDate"];
                if (category == null)
                    continue;
                string catName = category.Value<string>();
                string targetTime = fcstTime.Value<string>();
                string targetDate = fcstDate.Value<string>();

                switch (catName)
                {
                    case "TMN": // 일 최저 기온
                        if (currentDate != targetDate)
                            continue;
                        string strTempLow = item["fcstValue"].Value<string>();
                        if (current2.TemperatureLow == null)
                        {
                            current2.TemperatureLow = float.Parse(strTempLow);
                        }
                        break;
                    case "TMX": // 일 최고 기온
                        if (currentDate != targetDate)
                            continue;
                        string strTempHigh = item["fcstValue"].Value<string>();
                        if (current2.TemperatureHigh == null)
                        {
                            current2.TemperatureHigh = float.Parse(strTempHigh);
                        }
                        break;
                }

                if (currentDate != targetDate || currentTime != targetTime)
                {
                    continue;
                }

                //if (currentDate == targetDate)
                //{
                //    switch (catName)
                //    {
                //        case "TMN": // 일 최저 기온
                //            string strTempLow = item["fcstValue"].Value<string>();
                //            if (current2.TemperatureLow == null)
                //            {
                //                current2.TemperatureLow = float.Parse(strTempLow);
                //            }
                //            break;
                //        case "TMX": // 일 최고 기온
                //            string strTempHigh = item["fcstValue"].Value<string>();
                //            if (current2.TemperatureHigh == null)
                //            {
                //                current2.TemperatureHigh = float.Parse(strTempHigh);
                //            }
                //            break;
                //    }
                //}

                //if (currentTime != targetTime)
                //{
                //    continue;
                //}

                switch (catName)
                {
                    //case "TMP": //기온 obsrValue // 기온은 초단기예보에서 받아와야 한다
                    //    string strTemperature = item["fcstValue"].Value<string>(); // + " ℃";
                    //    current2.Temperature = float.Parse(strTemperature);
                    //    break;
                    case "PCP": //1시간 강수량 (mm)
                        string strRainfall = item["fcstValue"].Value<string>(); // + " ㎜";

                        //string targetTime = item[""];

                        if (strRainfall == "강수없음")
                        {
                            current2.Rain = 0;
                        }
                        else 
                        {
                            string delimiter = "mm";
                            int idx = strRainfall.IndexOf(delimiter);
                            strRainfall = strRainfall.Substring(0, idx);
                            current2.Rain = float.Parse(strRainfall);
                            break;
                        }
                        break;
                    case "REH": //습도
                        string strHumidity = item["fcstValue"].Value<string>(); // + " %";
                        current2.Humidity = float.Parse(strHumidity);
                        break;
                    case "WSD": //풍속
                        string strWindSpeed = item["fcstValue"].Value<float>().ToString();
                        current2.WindSpeed = float.Parse(strWindSpeed);
                        break;
                    case "VEC": //풍향 degree
                        //string strWindDirection = DegreeToCompass(item["obsrValue"].Value<float>());
                        string strWindDirection = DegreeToCompass(item["fcstValue"].Value<float>());
                        int val = item["fcstValue"].Value<int>();
                        int n_WindDirection = val;
                        current2.WindDirection = n_WindDirection;
                        break;
                    case "SKY": // 날씨상태
                        string strSkyType = item["fcstValue"].Value<string>();
                        int nSkyType = int.Parse(strSkyType);
                        skyType = (SkyType)nSkyType; 
                        break;
                    case "PTY": // 강수형태 ( Null일 경우 State값으로 SKY 사용)
                        string strRainType = item["fcstValue"].Value<string>();
                        int nRainType = int.Parse(strRainType);
                        rainType = (RainType2)nRainType;
                        break;
                    //case "TMN": // 일 최저 기온
                    //    string strTempLow = item["fcstValue"].Value<string>();
                    //    if(current2.TemperatureLow == null) 
                    //    {
                    //        current2.TemperatureLow = float.Parse(strTempLow);
                    //    }
                    //    break;
                    //case "TMX": // 일 최고 기온
                    //    string strTempHigh = item["fcstValue"].Value<string>();
                    //    if(current2.TemperatureHigh == null)
                    //    {
                    //        current2.TemperatureHigh = float.Parse(strTempHigh);
                    //    }
                    //    break;
                }
            }

            if (rainType == RainType2.None)
            {
                switch (skyType)
                {
                    case SkyType.Sunny:
                        current2.State = 1;
                        break;
                    case SkyType.Cloud:
                        current2.State = 2;
                        break;
                    case SkyType.Cloudy:
                        current2.State = 5;
                        break;
                }
            }
            else
            {
                switch (rainType)
                {
                    // 초단기 예보일때
                    //case RainType.Rain:
                    //    current2.State = 4;
                    //    break;
                    //case RainType.RainSnow:
                    //    current2.State = 5;
                    //    break;
                    //case RainType.Snow:
                    //    current2.State = 6;
                    //    break;
                    //case RainType.RainDrop:
                    //    current2.State = 7;
                    //    break;
                    //case RainType.RainDropSnowDrift:
                    //    current2.State = 8;
                    //    break;
                    //case RainType.SnowDritf:
                    //    current2.State = 9;
                    //    break;

                    // 단기 예보일때
                    case RainType2.Rain:
                        current2.State = 3;
                        break;
                    case RainType2.RainSnow:
                        current2.State = 4;
                        break;
                    case RainType2.Snow:
                        current2.State = 4;
                        break;
                    case RainType2.Shower:
                        current2.State = 3;
                        break;
                }
            }

            string strCityName = "여수";

            WriteCurrent2Data(dataManager, 
                strCityName, current2.State, current2.Temperature, current2.Rain, current2.Humidity, current2.WindDirection, current2.WindSpeed, current2.Atm, current2.TemperatureHigh, current2.TemperatureLow);

        }

        private SkyType GetSkyType(string strType)
        {
            int nType;

            if (int.TryParse(strType, out nType))
            {
                return (SkyType)nType;
            }

            return SkyType.Sunny;
        }

        private string GetRainTypeString(string strType, SkyType skyType)
        {
            int nType;

            if (int.TryParse(strType, out nType))
            {
                return RainTypeToString((RainType)nType, skyType);
            }

            return RainTypeToString(RainType.None, skyType);
        }

        private static string RainTypeToString(RainType type, SkyType skyType)
        {
            if (type == RainType.None)
            {
                if (skyType == SkyType.Sunny)
                    return "맑음";
                else if (skyType == SkyType.Cloud)
                    return "구름 많음";
                else// if (skyType == SkyType.Cloudy)
                    return "흐림";
            }
            else if (type == RainType.Rain)
                return "비";
            else if (type == RainType.RainSnow)
                return "진눈깨비";
            else if (type == RainType.None)
                return "눈";
            else if (type == RainType.RainDrop)
                return "약한비";
            else if (type == RainType.RainDropSnowDrift)
                return "약한 진눈깨비";
            else if (type == RainType.SnowDritf)
                return "약한눈";

            return "";
        }

        string DegreeToCompass(float deg)
        {
            int val = (int)Math.Round(deg / 22.5);
            string[] arr = { "북", "북북동", "북동", "북동동", "동", "남동동", "남동", "남남동", "남", "남남서", "남서", "남서서", "서", "북서서", "북서", "북북서" };
            //string[] arr = { "N", "NNE", "NE", "NEE", "E", "SEE", "SE", "SSE", "S", "SSW", "SW", "SWW", "W", "NWW", "NW", "NNW" };
            return arr[val % 16];
        }

        public static void WriteCurrent2Data(IDataManager dataManager, string strCityName, int? state, float currentTemperature, float rain, float humidity, int? windDirection, float? windSpeed, float? atm, float? temperatureHigh, float? temperatureLow)
        {
            Dictionary<Site.Fields, object> dicConditions = new Dictionary<Site.Fields, object>();
            dicConditions[Site.Fields.Name] = strCityName;

            string strErrorMessage;
            List<Site> sites = dataManager.GetSelectManager().SelectSites(dicConditions, null, out strErrorMessage);

            if (sites == null)
            {
                if (strErrorMessage != null)
                {
                    System.Diagnostics.Trace.WriteLine("[ERROR] WriteCurrentData : " + strErrorMessage);
                    return;
                }
            }
            if (sites.Count == 0)
            {
                System.Diagnostics.Trace.WriteLine(string.Format("{0}에 해당하는 WeatherSite가 존재하지 않습니다.", strCityName));
                return;
            }

            Site site = sites[0];
            //// 데이터 1개로 사용
            Current2 current2 = dataManager.GetSelectManager().SelectCurrent2(site.ID, out strErrorMessage);

            if (current2 == null)
            {
                if (dataManager.GetCreateManager().CreateCurrent2(site.ID, currentTemperature, state, rain, humidity, windSpeed, windDirection, atm, DateTime.Now, temperatureHigh, temperatureLow) == null)
                {
                    strErrorMessage = dataManager.GetCreateManager().GetErrorMessage();

                    if (strErrorMessage != null)
                    {
                        System.Diagnostics.Trace.WriteLine("[ERROR] WriteCurrentData : " + strErrorMessage);
                    }
                }
            }
            else
            {
                current2.State = state;
                current2.Temperature = currentTemperature;
                current2.Rain = rain;
                current2.Humidity = humidity;
                current2.WindDirection = windDirection;
                current2.WindSpeed = windSpeed;
                current2.Atm = atm;
                current2.UpdateTime = DateTime.Now;
                if (temperatureHigh != null)
                {
                    current2.TemperatureHigh = temperatureHigh;
                } 
                else
                {
                    current2.TemperatureHigh = current2.TemperatureHigh;
                }
                if (temperatureLow != null)
                {
                    current2.TemperatureLow = temperatureLow;
                } 
                else
                {
                    current2.TemperatureLow = current2.TemperatureLow;
                }

                if (dataManager.GetUpdateManager().UpdateCurrent2(current2, out strErrorMessage) == false)
                {
                    if (strErrorMessage != null)
                    {
                        System.Diagnostics.Trace.WriteLine("[ERROR] WriteCurrentData : " + strErrorMessage);
                    }
                }
            }
        }
    }
}


