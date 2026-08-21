using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using SysWillAlarm;
using dnsDapperDBUtil;

namespace IntegrationService
{
    class SyswillAlarmService
    {
        private Service m_service = null;

        public void Run()
        {
            m_service.Run();
        }

        public static SyswillAlarmService ReadConfig(IConfiguration configuration)
        {
            string strBaseLogFolder = configuration["BaseLogFolder"];
            List<_ConfigData> datas = configuration.GetSection("SyswillAlarm").Get<List<_ConfigData>>();

            if (datas != null && strBaseLogFolder != null && strBaseLogFolder.Length > 0)
            {
                SyswillAlarmService service = new SyswillAlarmService();
                service.m_service = null;

                List<ConfigData> configDatas = new List<ConfigData>();

                foreach (var data in datas)
                {
                    int nDBType;
                    string strDbName, strID, strPW;

                    if (GetDbInfo(data.DBInfo, out nDBType, out strDbName, out strID, out strPW))
                    {
                        ConfigData configData = new ConfigData();

                        configData.BaseUrl = data.BaseUrl;
                        configData.SiteID = data.SiteID;
                        configData.DbHost = data.DbHost;
                        configData.SOPWebServerUrl = data.SOPWebServerUrl;
                        configData.DbType = nDBType;
                        configData.DbName = strDbName;
                        configData.DbId = strID;
                        configData.DbPw = strPW;

                        configDatas.Add(configData);
                    }
                }

                if (configDatas.Count > 0)
                {
                    service.m_service = new Service(configDatas, strBaseLogFolder);
                    return service;
                }    
            }

            return null;
        }

        private static bool GetDbInfo(string strDbInfo, out int nDbType, out string strDbName, out string strID, out string strPW)
        {
            if (strDbInfo != null && strDbInfo.Length > 0)
            {
                string strInfo = AES256Cipher.AES_decrypt(strDbInfo);
                string[] tokens = strInfo.Split('-');

                if (tokens.Length >= 4)
                {
                    if (int.TryParse(tokens[0].Trim(), out nDbType))
                    {
                        strDbName = tokens[1].Trim();
                        strID = tokens[2].Trim();
                        strPW = tokens[3].Trim();
                        return true;
                    }
                }
            }

            nDbType = 0;
            strDbName = strID = strPW = null;
            return false;
        }
    }

    class _ConfigData
    {
        private string m_strBaseUrl = "";
        private int m_nSiteID = -1;
        private string m_strDBHost = "";
        private string m_strSOPWebServerUrl = "";

        public string BaseUrl
        {
            get { return m_strBaseUrl; }
            set { m_strBaseUrl = value; }
        }

        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }

        public string DbHost
        {
            get { return m_strDBHost; }
            set { m_strDBHost = value; }
        }

        public string SOPWebServerUrl
        {
            get { return m_strSOPWebServerUrl; }
            set { m_strSOPWebServerUrl = value; }
        }

        public string DBInfo
        {
            get; set;
        }
    }
}
