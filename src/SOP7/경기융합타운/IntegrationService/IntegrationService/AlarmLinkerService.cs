using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsDapperDBUtil;
using AlarmLinker;

namespace IntegrationService
{
    class AlarmLinkerService
    {
        private Service m_service = null;
        private bool m_useAlarm = true;
        private bool m_useElevator = true;
        private bool m_useEarthquake = true;
        private bool m_useSensorService = false;

        public bool UseSensorService
        {
            get { return m_useSensorService; }
        }

        private AlarmLinkerService(IDataManager ownDBManager, List<IDataManager> externalDBManagers)
        {
            if (externalDBManagers.Count > 0)
            {
                m_service = new Service(ownDBManager, externalDBManagers);
            }
        }

        public void Run()
        {
            if (m_service != null)
            {
                if (m_useAlarm)
                    m_service.Run();

                if (m_useElevator)
                    m_service.UpdateElevator();

                if (m_useEarthquake)
                    m_service.UpdateEarthquakeHistory();
            }
        }

        public static AlarmLinkerService ReadConfig(IConfiguration configuration, out bool useSensorService)
        {
            useSensorService = ReadBoolean(configuration, "AlarmLinker:SensorService", false);

            string strOwnDB = configuration["AlarmLinker:Database:OwnDB"];
            string strExternalDB = configuration["AlarmLinker:Database:ExternalDB"];

            if (strOwnDB == null || strOwnDB.Trim().Length == 0 ||
                strExternalDB == null || strExternalDB.Trim().Length == 0)
                return null;

            string strOwnDBInfo = configuration["AlarmLinker:Database:OwnDBInfo"];
            string strExternalDBInfo = configuration["AlarmLinker:Database:ExternalDBInfo"];

            if (strOwnDBInfo == null || strOwnDBInfo.Trim().Length == 0 ||
                strExternalDBInfo == null || strExternalDBInfo.Trim().Length == 0)
                return null;

            IDataManager ownDBManager = GetDataManager(strOwnDB, strOwnDBInfo);

            if (ownDBManager == null)
                return null;

            List<IDataManager> externalDBManagers = new List<IDataManager>();

            string[] externalDBNames = strExternalDB.Split(';');
            string[] externalDBInfos = strExternalDBInfo.Split(';');

            int countName = externalDBNames.Length;
            int countInfo = externalDBInfos.Length;
            int min = countName < countInfo ? countName : countInfo;

            for (int i = 0; i < min; i++)
            {
                IDataManager dataManager = GetDataManager(externalDBNames[i], externalDBInfos[i]);

                if (dataManager == null)
                    return null;

                externalDBManagers.Add(dataManager);
            }

            AlarmLinkerService alarmLinkerService = new AlarmLinkerService(ownDBManager, externalDBManagers);

            alarmLinkerService.m_useAlarm = ReadBoolean(configuration, "AlarmLinker:Alarm", true);
            alarmLinkerService.m_useElevator = ReadBoolean(configuration, "AlarmLinker:Elevator", true);
            alarmLinkerService.m_useEarthquake = ReadBoolean(configuration, "AlarmLinker:Earthquake", true);
            //alarmLinkerService.m_useSensorService = ReadBoolean(configuration, "AlarmLinker:SensorService", false);

            //return new AlarmLinkerService(ownDBManager, externalDBManagers);
            return alarmLinkerService;
        }

        private static bool ReadBoolean(IConfiguration configuration, string strTag, bool defaultValue)
        {
            string strData = configuration[strTag];

            if (strData != null)
            {
                strData = strData.Trim().ToLower();

                if (strData == "true")
                    return true;
                else if (strData == "false")
                    return false;
            }

            return defaultValue;
        }

        private static IDataManager GetDataManager(string strDBName, string strDBInfo)
        {
            string strDBHost, strID, strPW;

            if (GetDBInfo(strDBInfo, out strDBHost, out strID, out strPW))
            {
                DataManager dataManager = new DataManager(0, strDBHost, strDBName, strID, strPW);
                return dataManager;
            }

            return null;
        }

        private static bool GetDBInfo(string strSrc, out string strDBHost, out string strID, out string strPW)
        {
            string strOrigin = AES256Cipher.AES_decrypt(strSrc);
            string[] tokens = strOrigin.Split('-');

            int count = tokens.Length;

            if (count >= 3)
            {
                strDBHost = tokens[0].Trim();
                strID = tokens[1].Trim();
                strPW = tokens[2].Trim();

                return true;
            }

            strDBHost = null;
            strID = null;
            strPW = null;

            return false;
        }
    }
}
