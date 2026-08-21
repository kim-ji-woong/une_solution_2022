using System;
using System.Collections;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Nipa.DAL;

namespace Nipa.BLL
{
    using Models;
    using Models.Request;
    using Models.Response;
    using Model.Weather;

    public class WeatherManager
    {
        private IDataManager m_dataManager = null;
        private JoinManager m_joinManager = null;

        public WeatherManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
            m_joinManager = new JoinManager(dataManager);
        }

        public ResponseCurrentWeatherDatas GetCurrentDatas(RequestCurrentWeatherDatas data)
        {
            string strIDs = "";

            foreach (int siteID in data.SiteIDs)
            {
                if (strIDs.Length == 0)
                    strIDs = siteID.ToString();
                else
                    strIDs += "," + siteID.ToString();
            }

            if (strIDs.Length == 0)
                return new ResponseCurrentWeatherDatas(true, "");

            string strErrorMessage;
            string strConditions = string.Format("a.{0} in ({1})", Site.Fields.ID.ToString(), strIDs);

            List<WeatherData> resultDatas = GetWeatherDatas(strIDs, out strErrorMessage);
            //IEnumerable<WeatherData> resultDatas = m_dataManager.GetSelect().Join<Site, Current, WeatherData>(Site.Fields.SiteID.ToString(), Current.Fields.WeatherSiteID.ToString(), strConditions, out strErrorMessage);

            if (resultDatas == null)
                return new ResponseCurrentWeatherDatas(false, strErrorMessage);

            ResponseCurrentWeatherDatas response = new ResponseCurrentWeatherDatas(true, "");

            foreach (WeatherData weatherData in resultDatas)
            {
                response.WeatherDatas.Add(weatherData);
            }

            return response;
        }

        private List<WeatherData> GetWeatherDatas(string strSiteIDs, out string strErrorMessage)
        {
            Site site = new Site();
            Current current = new Current();

            string strConditions = string.Format("a.{0} in ({1})", Site.Fields.ID.ToString(), strSiteIDs);
            ArrayList arrDatas = m_joinManager.JoinSiteCurrent(strConditions, out strErrorMessage);

            if (arrDatas == null)
                return null;

            List<WeatherData> weatherDatas = new List<WeatherData>();
            int nDataCount = arrDatas.Count;

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (arrDatas[i] is Site && arrDatas[i + 1] is Current)
                {
                    WeatherData weatherData = new WeatherData();
                    weatherData.Site = (Site)arrDatas[i];
                    weatherData.Current = (Current)arrDatas[i + 1];
                    weatherDatas.Add(weatherData);
                }
            }

            return weatherDatas;
        }

        public ResponseWeeklyInfo GetWeeklyInfo()
        {
            string strErrorMessage;
            ResponseWeeklyInfo responseWeatherWeeklyInfo = new ResponseWeeklyInfo();

            IEnumerable<Site> sites = m_dataManager.GetSelect().Select<Site>(null, out strErrorMessage);

            if (sites == null)
            {
                responseWeatherWeeklyInfo.Success = false;
                responseWeatherWeeklyInfo.Message = strErrorMessage;
                return responseWeatherWeeklyInfo;
            }

            Site firstSite = null;

            foreach (Site site in sites)
            {
                firstSite = site;
                break;
            }

            if (firstSite == null)
            {
                responseWeatherWeeklyInfo.Success = false;
                responseWeatherWeeklyInfo.Message = "날씨정보를 조회할 대상이 존재하지 않습니다.";
                return responseWeatherWeeklyInfo;
            }

            List<WeatherWeeklyData> weatherWeeklyDatas = new List<WeatherWeeklyData>();

            foreach (Site site in sites)
            {
                string strConditions = string.Format("{0} = {1}", Weekly.Fields.WeatherSiteID, site.ID);

                IEnumerable<Weekly> weeklies = m_dataManager.GetSelect().Select<Weekly>(strConditions, out strErrorMessage);

                if (weeklies == null)
                {
                    responseWeatherWeeklyInfo.Success = false;
                    responseWeatherWeeklyInfo.Message = strErrorMessage;
                    return responseWeatherWeeklyInfo;
                }

                Weekly weekly = null;

                foreach (Weekly _weekly in weeklies)
                {
                    weekly = _weekly;
                    break;
                }

                if (weekly == null)
                {
                    responseWeatherWeeklyInfo.Success = false;
                    responseWeatherWeeklyInfo.Message = "SelectWeeklys 조회 실패. 해당 site ID 정보가 조회되지 않음";
                    return responseWeatherWeeklyInfo;
                }

                WeatherWeeklyData weeklyData = new WeatherWeeklyData();
                weeklyData.Site = site;
                weeklyData.Weekly = weekly;

                weatherWeeklyDatas.Add(weeklyData);
            }

            responseWeatherWeeklyInfo.Datas = weatherWeeklyDatas;
            responseWeatherWeeklyInfo.Success = true;
            return responseWeatherWeeklyInfo;
        }
    }
}
