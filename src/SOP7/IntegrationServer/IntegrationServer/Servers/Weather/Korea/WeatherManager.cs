using System;
using static dnsSopID.ID;
using System.Threading;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using System.Collections.Generic;
using IntegrationServer.Datas;

namespace IntegrationServer.Servers.Weather.Korea
{
    public class WeatherManager : IServer
    {
        public class WeatherData
        {
            public string CityName { get; set; }
            public string RegionCode { get; set; }
            public string CityCode { get; set; }

            public WeatherData()
            {
            }

            public WeatherData(string strCityName, string strRegionCode, string strCityCode)
            {
                CityName = strCityName;
                RegionCode = strRegionCode;
                CityCode = strCityCode;
            }
        }

        private int m_nServerSeqNo = -1;
        private ServerManager m_serverManager = null;
        private bool m_runThread = false;
        private CityReader m_cityReader = null;
        private WeeklyReader m_weeklyReader = null;
        private List<WeatherData> m_weatherDatas = new List<WeatherData>();

        public int ServerSeqNo
        {
            get
            {
                return m_nServerSeqNo;
            }
        }

        public ServerTypes ServerType
        {
            get
            {
                return ServerTypes.Weather;
            }
        }

        public bool IsConnected
        {
            get { return m_runThread; }
        }

        public Logger Logger { get; set; }

        private string m_strServerAlias = "";
        public string ServerAlias { get { return m_strServerAlias; } }

        public WeatherManager(ServerManager serverManager, DataManager dataManager, int nServerSeqNo, string strServiceKey, List<string> weatherDatas, string strServerAlias)
        {
            m_serverManager = serverManager;
            m_nServerSeqNo = nServerSeqNo;
            m_strServerAlias = strServerAlias;

            ParseWeatherDatas(weatherDatas);
            m_cityReader = new CityReader((DataManager)dataManager.Clone(), this);
            m_weeklyReader = new WeeklyReader((DataManager)dataManager.Clone(), strServiceKey, this);
        }

        public ServerManager GetServerManager()
        {
            return m_serverManager;
        }

        public void Start()
        {
            RunMonitoring();
        }

        public void Stop()
        {
            m_runThread = false;
        }

        private void RunMonitoring()
        {
            Thread t = new Thread(new ThreadStart(MonitoringThread));
            t.Start();
        }

        private void MonitoringThread()
        {
            if (m_runThread)
                return;

            m_runThread = true;

            while (m_runThread)
            {
                m_cityReader.ReadData();
                m_weeklyReader.ReadData();

                // 1분에 한번씩 동작
                for (int i = 0; i < 60 && m_runThread; i++)
                {
                    Thread.Sleep(1000);
                }
            }
        }

        private void ParseWeatherDatas(List<string> weatherDatas)
        {
            foreach (string strData in weatherDatas)
            {
                string[] tokens = strData.Split(',');

                if (tokens.Length >= 3)
                {
                    string strCityName = tokens[0].Trim();
                    string strRegionCode = tokens[1].Trim();
                    string strCityCode = tokens[2].Trim();

                    m_weatherDatas.Add(new WeatherData(strCityName, strRegionCode, strCityCode));
                }
            }
        }

        public int GetWeatherDataCount()
        {
            return m_weatherDatas.Count;
        }

        public WeatherData GetWeatherData(int index)
        {
            if (index >= m_weatherDatas.Count || index < 0)
                return null;

            return m_weatherDatas[index];
        }

        public void WriteLog(string strLog, LogTypes type = LogTypes.Info)
        {
            if (this.Logger != null)
                this.Logger.Write(type, ServerType, m_nServerSeqNo, strLog);
            else
                Logger.Instance.Write(type, ServerType, m_nServerSeqNo, strLog);
        }
    }
}
