using System;
using System.Net;
using System.IO;
using System.Windows.Forms;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Configuration;
using System.Threading.Tasks;

namespace WeatherService2
{
    public partial class FormMain : Form
    {
        // 없음, 비, 비 또는 눈, 눈, 빗방울, 빗방울 & 눈날림, 눈날림
        public enum RainType { None = 0, Rain, RainSnow, Snow, RainDrop = 5, RainDropSnowDrift, SnowDritf };
        // 맑음, 구름많음, 흐림
        public enum SkyType { Sunny = 1, Cloud = 3, Cloudy = 4 }

        private DataManager m_dataManager = new DataManager();
        private string m_strKey = "";

        public FormMain()
        {
            InitializeComponent();

            string strKey = ConfigurationManager.AppSettings["key"];
            string strExpired = ConfigurationManager.AppSettings["expired"];

            if (strKey != null && strExpired != null)
            {
                DateTime dtNow = DateTime.Now;
                string strNow = string.Format("{0}{1:00}{2:00}", dtNow.Year, dtNow.Month, dtNow.Day);

                if (string.Compare(strNow, strExpired) >= 0)
                    MessageBox.Show("API 호출키의 유효기간이 지났습니다.\r\n새로 발급받으세요.");
                else
                    m_strKey = strKey;
            }
        }

        private void InitLabels()
        {
            UpdateLabelText(labelTemperature, "기온 : ");
            UpdateLabelText(labelRainFall, "강수량 : ");
            UpdateLabelText(labelHumidity, "습도 : ");
            UpdateLabelText(labelWindSpeed, "풍속 : ");
            UpdateLabelText(labelWindDir, "풍향 : ");
            UpdateLabelText(labelSkyType, "상태 : ");
            UpdateLabelText(labelMinTemp, "일 최저기온 : ");
            UpdateLabelText(labelMaxTemp, "일 최고기온 : ");
        }

        // 초단기 예보 조회
        private void GetWeatherInfo(int x, int y)
        {
            InitLabels();

            if (m_strKey.Length == 0)
            {
                MessageBox.Show("API 호출키의 유효기간이 지났습니다.\r\n새로 발급받으세요.");
                return;
            }

            try
            {
                string key = m_strKey;
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
                if (null != items)
                {
                    // 비동기 처리
                    Task.Run(() => UpdateSky(items, x, y));
                    // 비동기 처리
                    Task.Run(() => GetWeatherInfo2(x, y));
                }
                reader.Close();
                dataStream.Close();
                response.Close();

                if (items == null)
                    MessageBox.Show("데이터를 읽어오지 못하였습니다.");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

        // 단기예보(하루 데이터)
        private void GetWeatherInfo2(int x, int y, int hour = -1)
        {
            if (m_strKey.Length == 0)
            {
                MessageBox.Show("API 호출키의 유효기간이 지났습니다.\r\n새로 발급받으세요.");
                return;
            }

            try
            {
                string key = m_strKey;
                string url = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";

                // 1시간 이전의 데이터를 호출한다.
                DateTime dtPrev = DateTime.Now.AddHours(-1);

                if (hour < 0)
                    hour = dtPrev.Hour;

                string date = string.Format("{0}{1:0,0}{2:0,0}", dtPrev.Year, dtPrev.Month, dtPrev.Day);
                string strHour = string.Format("{0:00}00", hour);
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
                if (null != items)
                {
                    UpdateWeather(items);
                }
                reader.Close();
                dataStream.Close();
                response.Close();

                if (items == null)
                {
                    if (hour > 0)
                        GetWeatherInfo2(x, y, hour - 1);
                    else
                        MessageBox.Show("데이터를 읽어오지 못하였습니다.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

        // 초단기예보(실시간값)
        private void GetWeatherInfo1(SkyType skyType, int x, int y)
        {
            try
            {
                string key = m_strKey;
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
                    UpdateWeather(items, skyType);
                }
                reader.Close();
                dataStream.Close();
                response.Close();

                if (items == null)
                    MessageBox.Show("데이터를 읽어오지 못하였습니다.");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

        public void UpdateSky(JToken weatherObj, int x, int y)
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
                        GetWeatherInfo1(skyType, x, y);
                        return;
                }
            }
        }

        public void UpdateWeather(JToken weatherObj, SkyType skyType)
        {
            foreach (JObject item in weatherObj)
            {
                JToken category = item["category"];
                if (null == category)
                    continue;
                string catName = category.Value<string>();
                switch (catName)
                {
                    case "T1H": //기온
                        string strTemperature = item["obsrValue"].Value<string>() + " ℃";
                        UpdateLabelText(labelTemperature, "기온 : " + strTemperature);
                        break;
                    case "RN1": //1시간 강수량 (mm)
                        string strRainfall = item["obsrValue"].Value<string>() + " ㎜";
                        UpdateLabelText(labelRainFall, "강수량 : " + strRainfall);
                        break;
                    case "REH": //습도
                        string strHumidity = item["obsrValue"].Value<string>() + " %";
                        UpdateLabelText(labelHumidity, "습도 : " + strHumidity);
                        break;
                    case "WSD": //풍속
                        string strWindSpeed = item["obsrValue"].Value<float>().ToString();
                        UpdateLabelText(labelWindSpeed, "풍속 : " + strWindSpeed + " m/s");
                        break;
                    case "VEC": //풍향 degree
                        string strWindDirection = DegreeToCompass(item["obsrValue"].Value<float>());
                        UpdateLabelText(labelWindDir, "풍향 : " + strWindDirection);
                        break;
                    case "PTY": // 강수형태
                        string strRainType = GetRainTypeString(item["obsrValue"].Value<string>(), skyType);
                        UpdateLabelText(labelSkyType, "상태 : " + strRainType);
                        break;
                }
            }
        }

        private void UpdateWeather(JToken weatherObj)
        {
            foreach (JObject item in weatherObj)
            {
                JToken category = item["category"];
                if (null == category)
                    continue;
                string catName = category.Value<string>();
                switch (catName)
                {
                    case "TMN": // 일 최저기온
                        string strMinTemp = item["fcstValue"].Value<string>() + " ℃";
                        UpdateLabelText(labelMinTemp, "일 최저기온 : " + strMinTemp);
                        break;
                    case "TMX": // 일 최고기온
                        string strMaxTemp = item["fcstValue"].Value<string>() + " ℃";
                        UpdateLabelText(labelMaxTemp, "일 최고기온 : " + strMaxTemp);
                        break;
                }
            }
        }

        private void UpdateLabelText(Label label, string strText)
        {
            if (label.InvokeRequired)
                label.Invoke(new MethodInvoker(delegate { label.Text = strText; }));
            else
                label.Text = strText;
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

        private void FormMain_Load(object sender, EventArgs e)
        {
            List<string> firstList = m_dataManager.GetFirstList();

            foreach (string strFirst in firstList)
            {
                cboFirst.Items.Add(strFirst);
            }

            if (cboFirst.Items.Count > 0)
                cboFirst.SelectedIndex = 0;
        }

        private void cboFirst_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (cboFirst.SelectedIndex < 0)
                return;

            string strFirst = cboFirst.Text;

            List<string> secondList = m_dataManager.GetSecondList(strFirst);
            cboSecond.Items.Clear();

            foreach (string strSecond in secondList)
            {
                cboSecond.Items.Add(strSecond);
            }

            if (cboSecond.Items.Count > 0)
                cboSecond.SelectedIndex = 0;
        }

        private void cboSecond_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (cboSecond.SelectedIndex < 0)
                return;

            string strFirst = cboFirst.Text;
            string strSecond = cboSecond.Text;

            List<string> thirdList = m_dataManager.GetThirdList(strFirst, strSecond);
            cboThird.Items.Clear();

            foreach (string strThird in thirdList)
            {
                cboThird.Items.Add(strThird);
            }

            if (cboThird.Items.Count > 0)
                cboThird.SelectedIndex = 0;
        }

        private void btnSearch_Click(object sender, EventArgs e)
        {
            string strFirst = cboFirst.Text;
            string strSecond = cboSecond.Text;
            string strThird = cboThird.Text;

            int x, y;

            if (m_dataManager.GetCoord(strFirst, strSecond, strThird, out x, out y))
            {
                // 비동기 처리
                Task.Run(() => GetWeatherInfo(x, y));
                //GetWeatherInfo(x, y);
            }
        }
    }
}
