using System;
using System.Collections.Generic;
using System.Net;
using System.IO;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using Nipa.Model.Weather;
using System.Text;
using System.Linq;
using System.Xml.Linq;

namespace IntegrationServer.Servers.Weather.Korea
{
    public class WeeklyReader
    {
        private class CityData
        {
            private string m_strTargetCity = "";
            private string m_strProvinceCode = "";
            private string m_strCityCode = "";
            private List<VilageWeatherData> m_vilageWeatherDatas = null;
            private MidWeatherData m_midWeatherData = null;
            private MidStateData m_midStateData = null;


            public string Target
            {
                get { return m_strTargetCity; }
                set { m_strTargetCity = value; }
            }

            public string ProvinceCode
            {
                get { return m_strProvinceCode; }
                set { m_strProvinceCode = value; }
            }

            public string CityCode
            {
                get { return m_strCityCode; }
                set { m_strCityCode = value; }
            }

            public List<VilageWeatherData> VilageWeatherDatas
            {
                get { return m_vilageWeatherDatas; }
                set { m_vilageWeatherDatas = value; }
            }

            public MidWeatherData MidWeatherData
            {
                get { return m_midWeatherData; }
                set { m_midWeatherData = value; }
            }

            public MidStateData MidStateData
            {
                get { return m_midStateData; }
                set { m_midStateData = value; }
            }
        }

        public class VilageWeatherData
        {
            private string m_strAnnounceTime = "";
            private string m_strNumEf = "";
            private string m_strTa = "";
            private string m_strWfCd = "";
            private string m_strRnYn = "";

            public string AnnounceTime
            {
                get { return m_strAnnounceTime; }
                set { m_strAnnounceTime = value; }
            }

            public string NumEf
            {
                get { return m_strNumEf; }
                set { m_strNumEf = value; }
            }

            public string Ta
            {
                get { return m_strTa; }
                set { m_strTa = value; }
            }

            public string WfCd
            {
                get { return m_strWfCd; }
                set { m_strWfCd = value; }
            }

            public string RnYn
            {
                get { return m_strRnYn; }
                set { m_strRnYn = value; }
            }
        }

        public class MidWeatherData
        {
            private string m_strAnnounceTime = "";
            private string m_strtaMax3 = "";
            private string m_strtaMax4 = "";
            private string m_strtaMax5 = "";
            private string m_strtaMax6 = "";
            private string m_strtaMax7 = "";
            private string m_strtaMax8 = "";
            private string m_strtaMax9 = "";
            private string m_strtaMax10 = "";

            private string m_strtaMin3 = "";
            private string m_strtaMin4 = "";
            private string m_strtaMin5 = "";
            private string m_strtaMin6 = "";
            private string m_strtaMin7 = "";
            private string m_strtaMin8 = "";
            private string m_strtaMin9 = "";
            private string m_strtaMin10 = "";

            public string AnnounceTime
            {
                get { return m_strAnnounceTime; }
                set { m_strAnnounceTime = value; }
            }

            public string TaMax3
            {
                get { return m_strtaMax3; }
                set { m_strtaMax3 = value; }
            }

            public string TaMax4
            {
                get { return m_strtaMax4; }
                set { m_strtaMax4 = value; }
            }

            public string TaMax5
            {
                get { return m_strtaMax5; }
                set { m_strtaMax5 = value; }
            }

            public string TaMax6
            {
                get { return m_strtaMax6; }
                set { m_strtaMax6 = value; }
            }

            public string TaMax7
            {
                get { return m_strtaMax7; }
                set { m_strtaMax7 = value; }
            }

            public string TaMax8
            {
                get { return m_strtaMax8; }
                set { m_strtaMax8 = value; }
            }

            public string TaMax9
            {
                get { return m_strtaMax9; }
                set { m_strtaMax9 = value; }
            }

            public string TaMax10
            {
                get { return m_strtaMax10; }
                set { m_strtaMax10 = value; }
            }


            public string TaMin3
            {
                get { return m_strtaMin3; }
                set { m_strtaMin3 = value; }
            }

            public string TaMin4
            {
                get { return m_strtaMin4; }
                set { m_strtaMin4 = value; }
            }

            public string TaMin5
            {
                get { return m_strtaMin5; }
                set { m_strtaMin5 = value; }
            }

            public string TaMin6
            {
                get { return m_strtaMin6; }
                set { m_strtaMin6 = value; }
            }

            public string TaMin7
            {
                get { return m_strtaMin7; }
                set { m_strtaMin7 = value; }
            }

            public string TaMin8
            {
                get { return m_strtaMin8; }
                set { m_strtaMin8 = value; }
            }

            public string TaMin9
            {
                get { return m_strtaMin9; }
                set { m_strtaMin9 = value; }
            }

            public string TaMin10
            {
                get { return m_strtaMin10; }
                set { m_strtaMin10 = value; }
            }
        }

        public class MidStateData
        {
            private string m_strAnnounceTime = "";
            private string m_strWf3Am = "";
            private string m_strWf3Pm = "";
            private string m_strWf4Am = "";
            private string m_strWf4Pm = "";
            private string m_strWf5Am = "";
            private string m_strWf5Pm = "";
            private string m_strWf6Am = "";
            private string m_strWf6Pm = "";
            private string m_strWf7Am = "";
            private string m_strWf7Pm = "";
            private string m_strWf8 = "";
            private string m_strWf9 = "";
            private string m_strWf10 = "";

            public string AnnounceTime
            {
                get { return m_strAnnounceTime; }
                set { m_strAnnounceTime = value; }
            }

            public string Wf3Am
            {
                get { return m_strWf3Am; }
                set { m_strWf3Am = value; }
            }

            public string Wf3Pm
            {
                get { return m_strWf3Pm; }
                set { m_strWf3Pm = value; }
            }

            public string Wf4Am
            {
                get { return m_strWf4Am; }
                set { m_strWf4Am = value; }
            }

            public string Wf4Pm
            {
                get { return m_strWf4Pm; }
                set { m_strWf4Pm = value; }
            }

            public string Wf5Am
            {
                get { return m_strWf5Am; }
                set { m_strWf5Am = value; }
            }

            public string Wf5Pm
            {
                get { return m_strWf5Pm; }
                set { m_strWf5Pm = value; }
            }

            public string Wf6Am
            {
                get { return m_strWf6Am; }
                set { m_strWf6Am = value; }
            }

            public string Wf6Pm
            {
                get { return m_strWf6Pm; }
                set { m_strWf6Pm = value; }
            }

            public string Wf7Am
            {
                get { return m_strWf7Am; }
                set { m_strWf7Am = value; }
            }

            public string Wf7Pm
            {
                get { return m_strWf7Pm; }
                set { m_strWf7Pm = value; }
            }

            public string Wf8
            {
                get { return m_strWf8; }
                set { m_strWf8 = value; }
            }

            public string Wf9
            {
                get { return m_strWf9; }
                set { m_strWf9 = value; }
            }

            public string Wf10
            {
                get { return m_strWf10; }
                set { m_strWf10 = value; }
            }
        }

        private List<CityData> m_cities = new List<CityData>();
        private const string XML_HEADER = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>";
        private string m_strServiceKey = null;
        private string m_strServiceBaseURL = null;
        private string m_strGongjuCode = null;
        private string m_strSeongnamCode = null;
        private string m_strPajuCode = null;
        private string m_strGyeonggidoCode = null;
        private string m_strChungnamCode = null;
        private WeatherManager m_manager = null;
        private DataManager m_dataManager = null;

        public WeeklyReader(DataManager dataManager, string strServiceKey, WeatherManager manager)
        {
            m_manager = manager;
            m_dataManager = dataManager;

            initData(strServiceKey);
            ReadCities();
        }

        public bool initData(string strServiceKey)
        {
            m_strServiceKey = strServiceKey;
            if (m_strServiceKey == null || m_strServiceKey.Length == 0)
                m_strServiceKey = "N7btoJzSjDUofiEvhmwj5EmDGxE4UP92YYXMfHqqQY%2BU%2B%2F5izsxJgOLfMSzbG%2BahGT6Gj286mPIgSNSb1pzu8w%3D%3D";

            m_strServiceBaseURL = "http://apis.data.go.kr/1360000";

            return true;
        }

        private bool ReadCities()
        {
            int nDataCount = m_manager.GetWeatherDataCount();
            
            for (int i=0;i<nDataCount;i++)
            {
                var weatherData = m_manager.GetWeatherData(i);

                if (weatherData == null)
                    continue;

                int nIndex1 = weatherData.CityCode.IndexOf('(');
                int nIndex2 = weatherData.CityCode.IndexOf(')');

                if (nIndex1 < 0 || nIndex2 < nIndex1)
                    continue;

                string strTrgCity = weatherData.CityCode.Substring(0, nIndex1).Trim();
                string strSrcCity = weatherData.CityCode.Substring(nIndex1 + 1, nIndex2 - nIndex1 - 1).Trim();

                string[] strCode = strSrcCity.Split('-');
                string strProvinceCode = strCode[0].Trim();
                string strCityCode = strCode[1].Trim();

                CityData data = new CityData();
                data.Target = strTrgCity;
                data.ProvinceCode = strProvinceCode;
                data.CityCode = strCityCode;

                m_cities.Add(data);
            }

            return true;
        }

        public bool ReadData()
        {
            try
            {
                string strErrorMessage = null;

                DateTime dtNow = DateTime.Now;
                DateTime dtMorning = new DateTime(dtNow.Year, dtNow.Month, dtNow.Day, 6, 0, 0);
                DateTime dtAfternoon = new DateTime(dtNow.Year, dtNow.Month, dtNow.Day, 18, 0, 0);
                string strDate = null;

                if (DateTime.Compare(dtNow, dtMorning) < 0)
                {   // 오전6시 전이라면 전날 6시 데이터 받기
                    DateTime dtYesterday = dtNow.AddDays(-1);
                    strDate = dtYesterday.ToString("yyyyMMdd0600");
                }
                else
                {   // 오전6시 이후이라면 당일 오전6시 데이터 받기
                    strDate = dtMorning.ToString("yyyyMMdd0600");
                }

                foreach (CityData city in m_cities)
                {
                    // 동네날씨 예보
                    List<VilageWeatherData> vilageWeatherDatas = ReadVilageWeatherData(city.CityCode, out strErrorMessage);
                    if (vilageWeatherDatas == null)
                        return false;

                    // 중기기온 예보
                    MidWeatherData midWeatherData = ReadMidWeatherData(city.CityCode, strDate, out strErrorMessage);
                    if (midWeatherData == null)
                    {
                        //Logger.Instance.Write("[ERROR] midWeatherData is null : " + strErrorMessage);
                        return false;
                    }

                    // 중기육상 예보
                    MidStateData midStateData = ReadMidStateData(city.ProvinceCode, strDate, out strErrorMessage);
                    if (midStateData == null)
                    {
                        //Logger.Instance.Write("[ERROR] midStateData is null : " + strErrorMessage);
                        return false;
                    }

                    city.VilageWeatherDatas = vilageWeatherDatas;
                    city.MidWeatherData = midWeatherData;
                    city.MidStateData = midStateData;

                    int nTodayState = (int)Current.WeatherState.Unknown;

                    Weekly weekly = MakeWeeklyData(city, out nTodayState, out strErrorMessage);
                    if (weekly == null)
                    {
                        //Logger.Instance.Write("[ERROR] weekly is null : " + strErrorMessage);
                        return false;
                    }

                    if (WriteData(city, weekly, nTodayState, out strErrorMessage) == false)
                    {
                        //Logger.Instance.Write("[ERROR] WriteData is false : " + strErrorMessage);
                        return false;
                    }
                }

                return true;
            }
            catch (Exception ex)
            {
                //Logger.Instance.Write("[ERROR] Weekly ReadData : " + ex.Message);
                return false;
            }
        }

        private bool WriteData(CityData city, Weekly weekly, int nTodayState, out string strErrorMessage)
        {
            string strConditions = city.Target == null ? string.Format("{0} = NULL", Site.Fields.Name.ToString()) : string.Format("{0} = '{1}'", Site.Fields.Name.ToString(), city.Target);

            try
            {
                IEnumerable<Site> sites = m_dataManager.GetSelect().Select<Site>(strConditions, out strErrorMessage);

                if (sites == null)
                {
                    if (strErrorMessage != null)
                    {
                        strErrorMessage = "WriteData Error : " + strErrorMessage;
                        System.Diagnostics.Trace.WriteLine(strErrorMessage);
                        return false;
                    }
                }

                Site site = null;

                foreach (Site _site in sites)
                {
                    site = _site;
                    break;
                }

                if (site == null)
                {
                    strErrorMessage = string.Format("{0}에 해당하는 WeatherSite가 존재하지 않습니다.", city.Target);
                    System.Diagnostics.Trace.WriteLine(strErrorMessage);
                    return false;
                }

                strConditions = string.Format("{0} = {1}", Weekly.Fields.WeatherSiteID, site.ID);
                Weekly weeklyData = m_dataManager.GetSelect().SelectFirst<Weekly>(strConditions, out strErrorMessage);

                if (weeklyData == null)
                {
                    weeklyData = new Weekly();
                    weeklyData.WeatherSiteID = site.ID;
                    weeklyData.OneDayLaterTemp = weekly.OneDayLaterTemp;
                    weeklyData.OneDayLaterState = weekly.OneDayLaterState;
                    weeklyData.TwoDayLaterTemp = weekly.TwoDayLaterTemp;
                    weeklyData.TwoDayLaterState = weekly.TwoDayLaterState;
                    weeklyData.ThreeDayLaterTemp = weekly.ThreeDayLaterTemp;
                    weeklyData.ThreeDayLaterState = weekly.ThreeDayLaterState;
                    weeklyData.FourDayLaterTemp = weekly.FourDayLaterTemp;
                    weeklyData.FourDayLaterState = weekly.FourDayLaterState;
                    weeklyData.FiveDayLaterTemp = weekly.FiveDayLaterTemp;
                    weeklyData.FiveDayLaterState = weekly.FiveDayLaterState;
                    weeklyData.SixDayLaterTemp = weekly.SixDayLaterTemp;
                    weeklyData.SixDayLaterState = weekly.SixDayLaterState;
                    weeklyData.UpdateTime = DateTime.Now;
                    weeklyData.OneDayMiniTemp = weekly.OneDayMiniTemp;
                    weeklyData.TwoDayMiniTemp = weekly.TwoDayMiniTemp;
                    weeklyData.ThreeDayMiniTemp = weekly.ThreeDayMiniTemp;
                    weeklyData.FourDayMiniTemp = weekly.FourDayMiniTemp;
                    weeklyData.FiveDayMiniTemp = weekly.FiveDayMiniTemp;
                    weeklyData.SixDayMiniTemp = weekly.SixDayMiniTemp;

                    if (m_dataManager.GetCreate().Insert<Weekly>(weeklyData, out strErrorMessage) == false)
                    {
                        //System.Diagnostics.Trace.WriteLine(strErrorMessage);
                        return false;
                    }
                }
                else
                {
                    weeklyData.OneDayLaterTemp = weekly.OneDayLaterTemp;
                    weeklyData.OneDayLaterState = weekly.OneDayLaterState;
                    weeklyData.TwoDayLaterTemp = weekly.TwoDayLaterTemp;
                    weeklyData.TwoDayLaterState = weekly.TwoDayLaterState;
                    weeklyData.ThreeDayLaterTemp = weekly.ThreeDayLaterTemp;
                    weeklyData.ThreeDayLaterState = weekly.ThreeDayLaterState;
                    weeklyData.FourDayLaterTemp = weekly.FourDayLaterTemp;
                    weeklyData.FourDayLaterState = weekly.FourDayLaterState;
                    weeklyData.FiveDayLaterTemp = weekly.FiveDayLaterTemp;
                    weeklyData.FiveDayLaterState = weekly.FiveDayLaterState;
                    weeklyData.SixDayLaterTemp = weekly.SixDayLaterTemp;
                    weeklyData.SixDayLaterState = weekly.SixDayLaterState;
                    weeklyData.UpdateTime = DateTime.Now;

                    weeklyData.OneDayMiniTemp = weekly.OneDayMiniTemp;
                    weeklyData.TwoDayMiniTemp = weekly.TwoDayMiniTemp;
                    weeklyData.ThreeDayMiniTemp = weekly.ThreeDayMiniTemp;
                    weeklyData.FourDayMiniTemp = weekly.FourDayMiniTemp;
                    weeklyData.FiveDayMiniTemp = weekly.FiveDayMiniTemp;
                    weeklyData.SixDayMiniTemp = weekly.SixDayMiniTemp;

                    if (m_dataManager.GetUpdate().Update<Weekly>(weeklyData, null, out strErrorMessage) == false)
                    {
                        strErrorMessage = "WriteData Error : " + strErrorMessage;
                        System.Diagnostics.Trace.WriteLine(strErrorMessage);
                        return false;
                    }
                }

                strConditions = string.Format("{0} = {1}", Current.Fields.WeatherSiteID, site.ID);

                double? dMinute = null;
                Current current = m_dataManager.GetSelect().SelectFirst<Current>(strConditions, out strErrorMessage);
                DateTime dtNow = DateTime.Now;

                // 업데이트 시간 비교
                if (current != null)
                {
                    DateTime dtUpdateTime = current.UpdateTime;

                    TimeSpan date = dtNow - dtUpdateTime;
                    dMinute = date.TotalMinutes;
                }

                // 현재 날씨 데이터가 알 수 없음 또는 업데이트 시간 차이가 30분 이상일 경우
                if (nTodayState != (int)Current.WeatherState.Unknown && 
                    (current?.State == (int)Current.WeatherState.Unknown || dMinute > 30))
                {
                    current.State = nTodayState;
                    current.UpdateTime = dtNow;

                    if (m_dataManager.GetUpdate().Update<Current>(current, null, out strErrorMessage) == false)
                    {
                        //strErrorMessage = "WriteData Error (UpdateCurrent error : " + strErrorMessage + ")";
                        System.Diagnostics.Trace.WriteLine(strErrorMessage);
                    }
                }
            }
            catch (Exception e)
            {
                System.Diagnostics.Trace.WriteLine("WriteData Error : " + e.Message);
                strErrorMessage = "WriteData Error : " + e.Message;
                //Logger.Instance.Write("[ERROR] bool WriteData(CityData, Weekly, out string) : " + e.Message);
                return false;
            }

            return true;
        }

        private Weekly MakeWeeklyData(CityData city, out int nTodayState, out string strErrorMessage)
        {
            Weekly weekly = new Weekly();
            strErrorMessage = "";

            nTodayState = (int)Current.WeatherState.Unknown;

            try
            {
                DateTime dtToday = DateTime.Today;
                DateTime dtDawn = new DateTime(dtToday.Year, dtToday.Month, dtToday.Day, 5, 0, 0);
                DateTime dtMorning = new DateTime(dtToday.Year, dtToday.Month, dtToday.Day, 11, 0, 0);
                DateTime dtAfternoon = new DateTime(dtToday.Year, dtToday.Month, dtToday.Day, 17, 0, 0);

                string strAnnounceTime = city.VilageWeatherDatas[0].AnnounceTime;
                string strYear = strAnnounceTime.Substring(0, 4);
                string strMonth = strAnnounceTime.Substring(4, 2);
                string strDay = strAnnounceTime.Substring(6, 2);
                string strHour = strAnnounceTime.Substring(8, 2);
                string strMinute = strAnnounceTime.Substring(10, 2);

                DateTime dtAnnounceTime = new DateTime(Convert.ToInt32(strYear), Convert.ToInt32(strMonth), Convert.ToInt32(strDay), Convert.ToInt32(strHour), Convert.ToInt32(strMinute), 0);


                if (DateTime.Compare(dtAnnounceTime, dtAfternoon) >= 0)
                {
                    // 17시부터 ~ 자정까지
                    //0 : 오늘오후 
                    //1 : 내일오전
                    //2 : 내일오후
                    //3 : 모레오전
                    //4 : 모레오후
                    //5 : 글피오전
                    //6 : 글피오후
                    weekly.OneDayLaterTemp = float.Parse(city.VilageWeatherDatas[2].Ta);
                    weekly.OneDayMiniTemp = float.Parse(city.VilageWeatherDatas[1].Ta);
                    weekly.OneDayLaterState = (int)GetVilageWeatherState(city.VilageWeatherDatas[1].RnYn, city.VilageWeatherDatas[1].WfCd, city.VilageWeatherDatas[2].RnYn, city.VilageWeatherDatas[2].WfCd);
                    weekly.TwoDayLaterTemp = float.Parse(city.VilageWeatherDatas[4].Ta);
                    weekly.TwoDayMiniTemp = float.Parse(city.VilageWeatherDatas[3].Ta);
                    weekly.TwoDayLaterState = (int)GetVilageWeatherState(city.VilageWeatherDatas[3].RnYn, city.VilageWeatherDatas[3].WfCd, city.VilageWeatherDatas[4].RnYn, city.VilageWeatherDatas[4].WfCd);

                    nTodayState = (int)GetVilageWeatherState(city.VilageWeatherDatas[0].RnYn, city.VilageWeatherDatas[0].WfCd, city.VilageWeatherDatas[0].RnYn, city.VilageWeatherDatas[0].WfCd);
                }
                else if (DateTime.Compare(dtAnnounceTime, dtDawn) < 0)
                {
                    // 자정부터 5시까지
                    //0 : 어제오후 
                    //1 : 오늘오전
                    //2 : 오늘오후
                    //3 : 내일오전
                    //4 : 내일오후
                    //5 : 모레오전
                    //6 : 모레오후
                    weekly.OneDayLaterTemp = float.Parse(city.VilageWeatherDatas[4].Ta);
                    weekly.OneDayMiniTemp = float.Parse(city.VilageWeatherDatas[3].Ta);
                    weekly.OneDayLaterState = (int)GetVilageWeatherState(city.VilageWeatherDatas[3].RnYn, city.VilageWeatherDatas[3].WfCd, city.VilageWeatherDatas[4].RnYn, city.VilageWeatherDatas[4].WfCd);
                    weekly.TwoDayLaterTemp = float.Parse(city.VilageWeatherDatas[6].Ta);
                    weekly.TwoDayMiniTemp = float.Parse(city.VilageWeatherDatas[5].Ta);
                    weekly.TwoDayLaterState = (int)GetVilageWeatherState(city.VilageWeatherDatas[5].RnYn, city.VilageWeatherDatas[5].WfCd, city.VilageWeatherDatas[6].RnYn, city.VilageWeatherDatas[6].WfCd);

                    nTodayState = (int)GetVilageWeatherState(city.VilageWeatherDatas[1].RnYn, city.VilageWeatherDatas[1].WfCd, city.VilageWeatherDatas[2].RnYn, city.VilageWeatherDatas[2].WfCd);
                }
                else if (DateTime.Compare(dtAnnounceTime, dtDawn) >= 0 && DateTime.Compare(dtAnnounceTime, dtMorning) < 0)
                {
                    // 5시부터 ~11시 이전
                    //0 : 오늘오전
                    //1 : 오늘오후
                    //2 : 내일오전
                    //3 : 내일오후
                    //4 : 모래오전
                    //5 : 모레오후
                    weekly.OneDayLaterTemp = float.Parse(city.VilageWeatherDatas[3].Ta);
                    weekly.OneDayMiniTemp = float.Parse(city.VilageWeatherDatas[2].Ta);
                    weekly.OneDayLaterState = (int)GetVilageWeatherState(city.VilageWeatherDatas[2].RnYn, city.VilageWeatherDatas[2].WfCd, city.VilageWeatherDatas[3].RnYn, city.VilageWeatherDatas[3].WfCd);
                    weekly.TwoDayLaterTemp = float.Parse(city.VilageWeatherDatas[5].Ta);
                    weekly.TwoDayMiniTemp = float.Parse(city.VilageWeatherDatas[4].Ta);
                    weekly.TwoDayLaterState = (int)GetVilageWeatherState(city.VilageWeatherDatas[4].RnYn, city.VilageWeatherDatas[4].WfCd, city.VilageWeatherDatas[5].RnYn, city.VilageWeatherDatas[5].WfCd);

                    nTodayState = (int)GetVilageWeatherState(city.VilageWeatherDatas[0].RnYn, city.VilageWeatherDatas[0].WfCd, city.VilageWeatherDatas[1].RnYn, city.VilageWeatherDatas[1].WfCd);
                }
                else if (DateTime.Compare(dtAnnounceTime, dtMorning) >= 0 && DateTime.Compare(dtAnnounceTime, dtAfternoon) < 0)
                {
                    // 11시부터 ~ 17시 이전
                    //0 : 오늘오후
                    //1 : 내일오전
                    //2 : 내일오후
                    //3 : 모레오전
                    //4 : 모레오후
                    weekly.OneDayLaterTemp = float.Parse(city.VilageWeatherDatas[2].Ta);
                    weekly.OneDayMiniTemp = float.Parse(city.VilageWeatherDatas[1].Ta);
                    weekly.OneDayLaterState = (int)GetVilageWeatherState(city.VilageWeatherDatas[1].RnYn, city.VilageWeatherDatas[1].WfCd, city.VilageWeatherDatas[2].RnYn, city.VilageWeatherDatas[2].WfCd);
                    weekly.TwoDayLaterTemp = float.Parse(city.VilageWeatherDatas[4].Ta);
                    weekly.TwoDayMiniTemp = float.Parse(city.VilageWeatherDatas[3].Ta);
                    weekly.TwoDayLaterState = (int)GetVilageWeatherState(city.VilageWeatherDatas[3].RnYn, city.VilageWeatherDatas[3].WfCd, city.VilageWeatherDatas[4].RnYn, city.VilageWeatherDatas[4].WfCd);

                    nTodayState = (int)GetVilageWeatherState(city.VilageWeatherDatas[0].RnYn, city.VilageWeatherDatas[0].WfCd, city.VilageWeatherDatas[0].RnYn, city.VilageWeatherDatas[0].WfCd);
                }

                dtMorning = new DateTime(dtToday.Year, dtToday.Month, dtToday.Day, 6, 0, 0);

                strAnnounceTime = city.MidWeatherData.AnnounceTime;
                strYear = strAnnounceTime.Substring(0, 4);
                strMonth = strAnnounceTime.Substring(4, 2);
                strDay = strAnnounceTime.Substring(6, 2);
                strHour = strAnnounceTime.Substring(8, 2);
                strMinute = strAnnounceTime.Substring(10, 2);

                dtAnnounceTime = new DateTime(Convert.ToInt32(strYear), Convert.ToInt32(strMonth), Convert.ToInt32(strDay), Convert.ToInt32(strHour), Convert.ToInt32(strMinute), 0);

                if (DateTime.Compare(dtAnnounceTime, dtMorning) < 0)
                {
                    weekly.ThreeDayLaterTemp = float.Parse(city.MidWeatherData.TaMax4);
                    weekly.FourDayLaterTemp = float.Parse(city.MidWeatherData.TaMax5);
                    weekly.FiveDayLaterTemp = float.Parse(city.MidWeatherData.TaMax6);
                    weekly.SixDayLaterTemp = float.Parse(city.MidWeatherData.TaMax7);

                    weekly.ThreeDayMiniTemp = float.Parse(city.MidWeatherData.TaMin4);
                    weekly.FourDayMiniTemp = float.Parse(city.MidWeatherData.TaMin5);
                    weekly.FiveDayMiniTemp = float.Parse(city.MidWeatherData.TaMin6);
                    weekly.SixDayMiniTemp = float.Parse(city.MidWeatherData.TaMin7);

                    weekly.ThreeDayLaterState = (int)GetMidWeatherState(city.MidStateData.Wf4Am, city.MidStateData.Wf4Pm);
                    weekly.ThreeDayLaterState = (int)GetMidWeatherState(city.MidStateData.Wf5Am, city.MidStateData.Wf5Pm);
                    weekly.ThreeDayLaterState = (int)GetMidWeatherState(city.MidStateData.Wf6Am, city.MidStateData.Wf6Pm);
                    weekly.ThreeDayLaterState = (int)GetMidWeatherState(city.MidStateData.Wf7Am, city.MidStateData.Wf7Pm);
                }
                else
                {
                    weekly.ThreeDayLaterTemp = float.Parse(city.MidWeatherData.TaMax3);
                    weekly.FourDayLaterTemp = float.Parse(city.MidWeatherData.TaMax4);
                    weekly.FiveDayLaterTemp = float.Parse(city.MidWeatherData.TaMax5);
                    weekly.SixDayLaterTemp = float.Parse(city.MidWeatherData.TaMax6);

                    weekly.ThreeDayMiniTemp = float.Parse(city.MidWeatherData.TaMin3);
                    weekly.FourDayMiniTemp = float.Parse(city.MidWeatherData.TaMin4);
                    weekly.FiveDayMiniTemp = float.Parse(city.MidWeatherData.TaMin5);
                    weekly.SixDayMiniTemp = float.Parse(city.MidWeatherData.TaMin6);

                    weekly.ThreeDayLaterState = (int)GetMidWeatherState(city.MidStateData.Wf3Am, city.MidStateData.Wf3Pm);
                    weekly.FourDayLaterState = (int)GetMidWeatherState(city.MidStateData.Wf4Am, city.MidStateData.Wf4Pm);
                    weekly.FiveDayLaterState = (int)GetMidWeatherState(city.MidStateData.Wf5Am, city.MidStateData.Wf5Pm);
                    weekly.SixDayLaterState = (int)GetMidWeatherState(city.MidStateData.Wf6Am, city.MidStateData.Wf6Pm);
                }
            }
            catch (Exception e)
            {
                System.Diagnostics.Trace.WriteLine("MakeWeeklyData Error : " + e.Message);
                strErrorMessage = "MakeWeeklyData Error : " + e.Message;
                //Logger.Instance.Write("[ERROR] Weekly MakeWeeklyData(CityData, out string) : " + e.Message);
                return null;
            }

            return weekly;
        }

        private Current.WeatherState GetVilageWeatherState(string strDayAmRnYn, string strDayAmWfCd, string strDayPmRnYn, string strDayPmWfCd)
        {
            if (strDayAmRnYn == "4" || strDayPmRnYn == "4")
            {   // 소나기
                return Current.WeatherState.Rain;
            }
            else if (strDayAmRnYn == "3" || strDayPmRnYn == "3")
            {   // 눈
                return Current.WeatherState.Snow;
            }
            else if (strDayAmRnYn == "2" || strDayPmRnYn == "2")
            {   // 비/눈
                return Current.WeatherState.SnowRain;
            }
            else if (strDayAmRnYn == "1" || strDayPmRnYn == "1")
            {   // 비
                return Current.WeatherState.Rain;
            }
            else
            {   // 강 수 없음
                if (strDayAmWfCd == "DB04" || strDayPmWfCd == "DB04" ||
                    strDayAmWfCd == "DB03" || strDayPmWfCd == "DB03")
                    return Current.WeatherState.Cloudy;
                else
                    return Current.WeatherState.Sunshine;
            }
        }

        private Current.WeatherState GetMidWeatherState(string strWfAm, string strWfPm)
        {
            int am = 0, pm = 0;

            if (CityReader.ReadWeatherState(strWfAm, ref am) == false)
                return Current.WeatherState.Sunshine;
            if (CityReader.ReadWeatherState(strWfPm, ref pm) == false)
                return Current.WeatherState.Sunshine;

            Current.WeatherState wfAm = (Current.WeatherState)am;
            Current.WeatherState wfPm = (Current.WeatherState)pm;

            if (wfAm == Current.WeatherState.Thunder || wfPm == Current.WeatherState.Thunder)
                return Current.WeatherState.Thunder;
            else if (wfAm == Current.WeatherState.SnowRain || wfPm == Current.WeatherState.SnowRain)
                return Current.WeatherState.SnowRain;
            else if (wfAm == Current.WeatherState.HeavySnow || wfPm == Current.WeatherState.HeavySnow)
                return Current.WeatherState.HeavySnow;
            else if (wfAm == Current.WeatherState.Snow || wfPm == Current.WeatherState.Snow)
                return Current.WeatherState.Snow;
            else if (wfAm == Current.WeatherState.HeavyRain || wfPm == Current.WeatherState.HeavyRain)
                return Current.WeatherState.HeavyRain;
            else if (wfAm == Current.WeatherState.Rain || wfPm == Current.WeatherState.Rain)
                return Current.WeatherState.Rain;
            else if (wfAm == Current.WeatherState.Cloudy || wfPm == Current.WeatherState.Cloudy)
                return Current.WeatherState.Cloudy;
            else if (wfAm == Current.WeatherState.Cloud || wfPm == Current.WeatherState.Cloud)
                return Current.WeatherState.Cloud;
            else if (wfAm == Current.WeatherState.DustStorm || wfPm == Current.WeatherState.DustStorm)
                return Current.WeatherState.DustStorm;
            else if (wfAm == Current.WeatherState.FineDust || wfPm == Current.WeatherState.FineDust)
                return Current.WeatherState.FineDust;
            else
                return Current.WeatherState.Sunshine;
        }

        public List<VilageWeatherData> ReadVilageWeatherData(string strRegID, out string strErrorMessage)
        {
            List<VilageWeatherData> vilageWeatherDatas = new List<VilageWeatherData>();
            string strURL = string.Format("VilageFcstMsgService/getLandFcst?serviceKey=" + m_strServiceKey + "&numOfRows=10&pageNo=1&regId=" + strRegID);

            try
            {
                string strResult = SendQuery(null, strURL, true, out strErrorMessage);

                if (strResult.Length == 0)
                {
                    strErrorMessage = "ReadVilageWeatherData Error : " + strErrorMessage;
                    System.Diagnostics.Trace.WriteLine(strErrorMessage);
                    return null;
                }

                XElement xml = XElement.Parse(strResult);

                foreach (XElement element in xml.Elements())
                {
                    XElement xBody = element.Name == "body" ? element : null;

                    if (xBody != null)
                    {
                        foreach (XElement xBodyElement in xBody.Elements())
                        {
                            XElement xItems = xBodyElement.Name == "items" ? xBodyElement : null;

                            if (xItems != null)
                            {
                                foreach (XElement xItemsElement in xItems.Elements())
                                {
                                    XElement xItem = xItemsElement.Name == "item" ? xItemsElement : null;

                                    if (xItem != null)
                                    {
                                        string strAnnounceTime = null, strNumEf = null, strTa = null, strWfCd = null, strRnYn = null;
                                        VilageWeatherData vilageWeatherData = new VilageWeatherData();

                                        foreach (XElement child in xItem.Elements())
                                        {
                                            if (child.Name == "announceTime")
                                            {
                                                strAnnounceTime = child.Value.Trim();
                                            }
                                            else if (child.Name == "numEf")
                                            {
                                                strNumEf = child.Value.Trim();
                                            }
                                            else if (child.Name == "ta")
                                            {
                                                strTa = child.Value.Trim();
                                            }
                                            else if (child.Name == "wfCd")
                                            {
                                                strWfCd = child.Value.Trim();
                                            }
                                            else if (child.Name == "rnYn")
                                            {
                                                strRnYn = child.Value.Trim();
                                            }
                                        }

                                        if (strAnnounceTime != null && strNumEf != null && strTa != null)
                                        {
                                            vilageWeatherData.AnnounceTime = strAnnounceTime;
                                            vilageWeatherData.NumEf = strNumEf;
                                            vilageWeatherData.Ta = strTa;
                                            vilageWeatherData.WfCd = strWfCd;
                                            vilageWeatherData.RnYn = strRnYn;

                                            vilageWeatherDatas.Add(vilageWeatherData);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception e)
            {
                strErrorMessage = "ReadVilageWeatherData Error : " + e.Message;
                //Logger.Instance.Write("[ERROR] List<VilageWeatherData> ReadVilageWeatherData(string, out string) : " + e.Message);
                return null;
            }

            return vilageWeatherDatas;
        }

        public MidWeatherData ReadMidWeatherData(string strRegID, string strDate, out string strErrorMessage)
        {
            MidWeatherData midWeatherData = null;

            try
            {
                string strURL = string.Format("MidFcstInfoService/getMidTa?serviceKey=" + m_strServiceKey + "&numOfRows=10&pageNo=1&regId=" + strRegID + "&tmFc=" + strDate);

                string strResult = SendQuery(null, strURL, true, out strErrorMessage);

                if (strResult.Length == 0)
                {
                    strErrorMessage = "ReadMidWeatherData Error : " + strErrorMessage;
                    System.Diagnostics.Trace.WriteLine(strErrorMessage);
                    return null;
                }

                XElement xml = XElement.Parse(strResult);

                foreach (XElement element in xml.Elements())
                {
                    XElement xBody = element.Name == "body" ? element : null;

                    if (xBody != null)
                    {
                        foreach (XElement xBodyElement in xBody.Elements())
                        {
                            XElement xItems = xBodyElement.Name == "items" ? xBodyElement : null;

                            if (xItems != null)
                            {
                                foreach (XElement xItemsElement in xItems.Elements())
                                {
                                    XElement xItem = xItemsElement.Name == "item" ? xItemsElement : null;

                                    if (xItem != null)
                                    {
                                        string strtaMax3 = null, strtaMax4 = null, strtaMax5 = null, strtaMax6 = null, strtaMax7 = null, strtaMax8 = null, strtaMax9 = null, strtaMax10 = null;
                                        string strtaMin3 = null, strtaMin4 = null, strtaMin5 = null, strtaMin6 = null, strtaMin7 = null, strtaMin8 = null, strtaMin9 = null, strtaMin10 = null;

                                        midWeatherData = new MidWeatherData();

                                        foreach (XElement child in xItem.Elements())
                                        {
                                            if (child.Name == "taMax3")
                                            {
                                                strtaMax3 = child.Value.Trim();
                                            }
                                            else if (child.Name == "taMax4")
                                            {
                                                strtaMax4 = child.Value.Trim();
                                            }
                                            else if (child.Name == "taMax5")
                                            {
                                                strtaMax5 = child.Value.Trim();
                                            }
                                            else if (child.Name == "taMax6")
                                            {
                                                strtaMax6 = child.Value.Trim();
                                            }
                                            else if (child.Name == "taMax7")
                                            {
                                                strtaMax7 = child.Value.Trim();
                                            }
                                            else if (child.Name == "taMax8")
                                            {
                                                strtaMax8 = child.Value.Trim();
                                            }
                                            else if (child.Name == "taMax9")
                                            {
                                                strtaMax9 = child.Value.Trim();
                                            }
                                            else if (child.Name == "taMax10")
                                            {
                                                strtaMax10 = child.Value.Trim();
                                            }
                                            else if (child.Name == "taMin3")
                                            {
                                                strtaMin3 = child.Value.Trim();
                                            }
                                            else if (child.Name == "taMin4")
                                            {
                                                strtaMin4 = child.Value.Trim();
                                            }
                                            else if (child.Name == "taMin5")
                                            {
                                                strtaMin5 = child.Value.Trim();
                                            }
                                            else if (child.Name == "taMin6")
                                            {
                                                strtaMin6 = child.Value.Trim();
                                            }
                                            else if (child.Name == "taMin7")
                                            {
                                                strtaMin7 = child.Value.Trim();
                                            }
                                            else if (child.Name == "taMin8")
                                            {
                                                strtaMin8 = child.Value.Trim();
                                            }
                                            else if (child.Name == "taMin9")
                                            {
                                                strtaMin9 = child.Value.Trim();
                                            }
                                            else if (child.Name == "taMin10")
                                            {
                                                strtaMin10 = child.Value.Trim();
                                            }

                                        }

                                        if (strtaMax3 != null && strtaMax4 != null && strtaMax5 != null && strtaMax6 != null && strtaMax7 != null &&
                                            strtaMax8 != null && strtaMax9 != null && strtaMax10 != null &&
                                            strtaMin3 != null && strtaMin4 != null && strtaMin5 != null && strtaMin6 != null && strtaMin7 != null &&
                                            strtaMin8 != null && strtaMin9 != null && strtaMin10 != null)
                                        {
                                            midWeatherData.AnnounceTime = strDate;
                                            midWeatherData.TaMax3 = strtaMax3;
                                            midWeatherData.TaMax4 = strtaMax4;
                                            midWeatherData.TaMax5 = strtaMax5;
                                            midWeatherData.TaMax6 = strtaMax6;
                                            midWeatherData.TaMax7 = strtaMax7;
                                            midWeatherData.TaMax8 = strtaMax8;
                                            midWeatherData.TaMax9 = strtaMax9;
                                            midWeatherData.TaMax10 = strtaMax10;

                                            midWeatherData.TaMin3 = strtaMin3;
                                            midWeatherData.TaMin4 = strtaMin4;
                                            midWeatherData.TaMin5 = strtaMin5;
                                            midWeatherData.TaMin6 = strtaMin6;
                                            midWeatherData.TaMin7 = strtaMin7;
                                            midWeatherData.TaMin8 = strtaMin8;
                                            midWeatherData.TaMin9 = strtaMin9;
                                            midWeatherData.TaMin10 = strtaMin10;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception e)
            {
                strErrorMessage = "ReadMidWeatherData Error : " + e.Message;
                //Logger.Instance.Write("[ERROR] MidWeatherData ReadMidWeatherData(string, string, out string) : " + e.Message);
                return null;
            }

            return midWeatherData;
        }

        public MidStateData ReadMidStateData(string strRegID, string strDate, out string strErrorMessage)
        {
            MidStateData midStateData = null;
            try
            {
                string strURL = string.Format("MidFcstInfoService/getMidLandFcst?serviceKey=" + m_strServiceKey + "&numOfRows=10&pageNo=1&regId=" + strRegID + "&tmFc=" + strDate);

                string strResult = SendQuery(null, strURL, true, out strErrorMessage);

                if (strResult.Length == 0)
                {
                    strErrorMessage = "ReadMidStateData Error : " + strErrorMessage;
                    System.Diagnostics.Trace.WriteLine(strErrorMessage);
                    return null;
                }

                XElement xml = XElement.Parse(strResult);

                foreach (XElement element in xml.Elements())
                {
                    XElement xBody = element.Name == "body" ? element : null;

                    if (xBody != null)
                    {
                        foreach (XElement xBodyElement in xBody.Elements())
                        {
                            XElement xItems = xBodyElement.Name == "items" ? xBodyElement : null;

                            if (xItems != null)
                            {
                                foreach (XElement xItemsElement in xItems.Elements())
                                {
                                    XElement xItem = xItemsElement.Name == "item" ? xItemsElement : null;

                                    if (xItem != null)
                                    {
                                        string strWf3Am = null, strWf3Pm = null, strWf4Am = null, strWf4Pm = null, strWf5Am = null, strWf5Pm = null, strWf6Am = null, strWf6Pm = null, strWf7Am = null, strWf7Pm = null;
                                        string strWf8 = null, strWf9 = null, strWf10 = null;

                                        midStateData = new MidStateData();

                                        foreach (XElement child in xItem.Elements())
                                        {
                                            if (child.Name == "wf3Am")
                                            {
                                                strWf3Am = child.Value.Trim();
                                            }
                                            else if (child.Name == "wf3Pm")
                                            {
                                                strWf3Pm = child.Value.Trim();
                                            }
                                            else if (child.Name == "wf4Am")
                                            {
                                                strWf4Am = child.Value.Trim();
                                            }
                                            else if (child.Name == "wf4Pm")
                                            {
                                                strWf4Pm = child.Value.Trim();
                                            }
                                            else if (child.Name == "wf5Am")
                                            {
                                                strWf5Am = child.Value.Trim();
                                            }
                                            else if (child.Name == "wf5Pm")
                                            {
                                                strWf5Pm = child.Value.Trim();
                                            }
                                            else if (child.Name == "wf6Am")
                                            {
                                                strWf6Am = child.Value.Trim();
                                            }
                                            else if (child.Name == "wf6Pm")
                                            {
                                                strWf6Pm = child.Value.Trim();
                                            }
                                            else if (child.Name == "wf7Am")
                                            {
                                                strWf7Am = child.Value.Trim();
                                            }
                                            else if (child.Name == "wf7Pm")
                                            {
                                                strWf7Pm = child.Value.Trim();
                                            }
                                            else if (child.Name == "wf8")
                                            {
                                                strWf8 = child.Value.Trim();
                                            }
                                            else if (child.Name == "wf9")
                                            {
                                                strWf9 = child.Value.Trim();
                                            }
                                            else if (child.Name == "wf10")
                                            {
                                                strWf10 = child.Value.Trim();
                                            }

                                        }

                                        if (strWf3Am != null && strWf3Pm != null && strWf4Am != null && strWf4Pm != null && strWf5Am != null && strWf5Pm != null &&
                                            strWf6Am != null && strWf6Pm != null && strWf7Am != null && strWf7Pm != null && strWf8 != null && strWf9 != null && strWf10 != null)
                                        {
                                            midStateData.AnnounceTime = strDate;
                                            midStateData.Wf3Am = strWf3Am;
                                            midStateData.Wf3Pm = strWf3Pm;
                                            midStateData.Wf4Am = strWf4Am;
                                            midStateData.Wf4Pm = strWf4Pm;
                                            midStateData.Wf5Am = strWf5Am;
                                            midStateData.Wf5Pm = strWf5Pm;
                                            midStateData.Wf6Am = strWf6Am;
                                            midStateData.Wf6Pm = strWf6Pm;
                                            midStateData.Wf7Am = strWf7Am;
                                            midStateData.Wf7Pm = strWf7Pm;
                                            midStateData.Wf8 = strWf8;
                                            midStateData.Wf9 = strWf9;
                                            midStateData.Wf10 = strWf10;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception e)
            {
                strErrorMessage = "ReadMidStateData Error : " + e.Message;
                //Logger.Instance.Write("[ERROR] MidStateData ReadMidStateData(string, string, out string) : " + e.Message);
                return null;
            }

            return midStateData;
        }

        private string SendQuery(string strXML, string strURL, bool noCodeCheck, out string strErrorMessage, string strMethodType = "GET")
        {
            strErrorMessage = "";
            string url = m_strServiceBaseURL;

            if (strURL.StartsWith("/"))
                url += strURL;
            else
                url += "/" + strURL;

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(new Uri(url));
            request.Method = strMethodType;

            if (strXML != null)
            {
                strXML = XML_HEADER + strXML;

                byte[] bytes = Encoding.UTF8.GetBytes(strXML);
                int len = bytes.Count();

                request.ContentType = "application/xml; charset=utf-8";
                request.ContentLength = len + 3;
            }

            string strResult = "";

            try
            {
                if (strXML != null)
                {
                    StreamWriter writer = new StreamWriter(request.GetRequestStream(), Encoding.UTF8);
                    writer.Write(strXML);
                    writer.Close();
                }

                HttpWebResponse wRes = (HttpWebResponse)request.GetResponse();

                Stream respPostStream = wRes.GetResponseStream();
                StreamReader readerPost = new StreamReader(respPostStream, System.Text.Encoding.UTF8);

                strResult = readerPost.ReadToEnd().Trim();
                request.Abort();
                readerPost.Close();
                respPostStream.Close();

                if (strResult.StartsWith("<") == false)
                {
                    strErrorMessage = strResult;
                    return "";
                }

                if (noCodeCheck)
                    return strResult;

            }
            catch (System.Net.WebException ex)
            {
                strErrorMessage = ex.Message;
                //Logger.Instance.Write("[ERROR] string SendQuery(string, string, bool, out string, string) : " + ex.Message);
            }

            return "";
        }
    }
}
