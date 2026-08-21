using CheongsimServer.Config;
using dnsCommunicateSopServer;
using dnsDapperDBUtil;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Text;
using System.Threading;
using System.Windows.Forms;

namespace CheongsimServer
{
    public class ProcessManager
    {
        private DataManager m_dataManager = null;
        private DataManager m_s1DBManager = null;

        private AlarmManager m_alarmManager = null;

        private SopQueryManager m_sopQueryMgr = null;
        private static string ALARM_METHOD = "POST";

        private string m_strDoorAlarmURL = "http://127.0.0.1:44379/api/DoorSensor";
        private string m_strLaserAlarmURL = "http://127.0.0.1:44379/api/LaserSensor";

        bool m_shutdownThread = true;

        int m_nErrorSleep = 1000 * 60;
        int m_nThreadSleep = 100 * 15;     // 1.5초

        Thread m_watchThread = null;


        List<string> m_alarms = new List<string>();

        private Dictionary<string, SensorTag> m_dicSensorTag = new Dictionary<string, SensorTag>();


        public ProcessManager()
        {
            Init();

            // 알람 초기화
            m_sopQueryMgr.SendAllClearQuery(ALARM_METHOD, null, m_strDoorAlarmURL);
            m_sopQueryMgr.SendAllClearQuery(ALARM_METHOD, null, m_strLaserAlarmURL);
        }       

        private void Init()
        {
            var builder = new ConfigurationBuilder()
               .SetBasePath(Application.StartupPath)
               .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);

            IConfigurationRoot configuration = builder.Build();
            var siteConfig = new Site();
            configuration.GetSection("Site").Bind(siteConfig);

            var s1Config = new Site();
            configuration.GetSection("S1_Server").Bind(s1Config);

            var info = new Info();
            configuration.GetSection("Info").Bind(info);

            if (siteConfig.ID == null || siteConfig.DBName == null || siteConfig.DBType == null || siteConfig.DbHost == null || siteConfig.DbID == null || siteConfig.DbPw == null ||
                s1Config.ID == null || s1Config.DBName == null || s1Config.DBType == null || s1Config.DbHost == null || s1Config.DbID == null || s1Config.DbPw == null)
                return;

            m_dataManager = new DataManager(siteConfig.DBType.Value, siteConfig.DbHost, siteConfig.DBName, siteConfig.DbID, siteConfig.DbPw);
            m_s1DBManager = new DataManager(s1Config.DBType.Value, s1Config.DbHost, s1Config.DBName, s1Config.DbID, s1Config.DbPw);

            if (info.DoorAlarmURL != null)
                m_strDoorAlarmURL = info.DoorAlarmURL;
            if (info.LaserAlarmURL != null)
                m_strLaserAlarmURL = info.LaserAlarmURL;

            m_sopQueryMgr = new SopQueryManager();

            string strSQL = $@"
                        select sz.ID SensorZoneID, sti.ID SensorTagInfoID, SensorType, OrgSensorID, SensorServerID, TagNo, sti.Description, etc.UniqueKey
                          from SdmsSensorZone sz
                         inner join SdmsSensorTagInfo sti on sz.ID=sti.SensorZoneID
                         inner join SdmsSensorETC etc on sz.OrgSensorID=etc.ID";

            string strError;
            IEnumerable<dynamic> dynamics = m_dataManager.GetSelect().Select(strSQL, out strError);
            if (dynamics == null)
            {
                Logger.Instance.Write("SensorTag 조회 실패 : " + strError);
                return;
            }

            foreach (var item in dynamics)
            {
                int nSensorZoneID = item.SensorZoneID;
                int nSensorTagInfoID = item.SensorTagInfoID;
                int nSensorType = item.SensorType;
                int nOrgSensorID = item.OrgSensorID;
                int nSensorServerID = item.SensorServerID;
                int nTagNo = item.TagNo;
                string strDescription = item.Description;
                string strUniqueKey = item.UniqueKey;

                SensorTag sensor = new SensorTag()
                {
                    ID = nSensorTagInfoID,
                    SensorZoneID = nSensorZoneID,
                    SensorType = nSensorType,
                    TagNo = nTagNo,
                    OrgSensorID = nOrgSensorID,
                    SensorServerID = nSensorServerID,
                    Description = strDescription,
                    UniqueKey = strUniqueKey
                };

                m_dicSensorTag[strUniqueKey] = sensor;
            }
        }

        public void Start()
        {
            Logger.Instance.Write("Start 실행");

            if (m_shutdownThread == true)
            {
                m_shutdownThread = false;

                m_watchThread = new Thread(() => WatchThread());
                m_watchThread.Start();
            }
        }

        public void Stop()
        {
            Logger.Instance.Write("Stop 실행");

            m_shutdownThread = true;
        }

        private void WatchThread()
        {
            string strErrorMessage = "";
            Logger.Instance.Write("WatchThread 실행");

            if (m_dataManager == null || m_s1DBManager == null)
            {
                Logger.Instance.Write("DBManager 초기화 실패");
                return;
            }

            while (!m_shutdownThread)
            {
                // 알람 조회
                //string strSQL = $"SELECT Master, Point, `Loop`, LState FROM secom_eqmaster WHERE `Loop` != 0 AND LState like '%1001'";
                string strSQL = $"SELECT Master, Point, `Loop`, LState FROM secom_eqmaster WHERE `Loop` != 0 AND LState like 'A%'";                
                IEnumerable<dynamic> dynamics = m_s1DBManager.GetSelect().Select(strSQL, out string strError);
                if (dynamics == null)
                {
                    Logger.Instance.Write("secom_eqmaster 조회 실패: " + strError);
                    Thread.Sleep(m_nErrorSleep);
                    continue;
                }

                List<string> addAlarms = new List<string>();
                List<string> removeAlarms = new List<string>();

                foreach (var item in dynamics)
                {
                    long nMaster = item.Master;
                    long nPoint = item.Point;
                    long nLoop = item.Loop;
                    string strLState = item.LState;

                    string strUniqueKey = nMaster.ToString() + "-" + nPoint.ToString() + "-" + nLoop.ToString();

                    addAlarms.Add(strUniqueKey);
                }

                // 알람 비교
                foreach (string key in m_alarms)
                {
                    if (addAlarms.Contains(key))
                        addAlarms.Remove(key);
                    else
                        removeAlarms.Add(key);
                }


                int nAlarmLevel = 2;

                // 알람 발생 및 해제
                foreach (string key in removeAlarms)
                {
                    if (m_dicSensorTag.ContainsKey(key))
                    {
                        SensorTag sensorTag = m_dicSensorTag[key];

                        bool bIsAlarm = false;

                        ArrayList arrData = new ArrayList();
                        arrData.Add(sensorTag.SensorType);
                        arrData.Add(sensorTag.ID);
                        arrData.Add(sensorTag.SensorZoneID);
                        arrData.Add(bIsAlarm);
                        arrData.Add(nAlarmLevel);
                        
                        string strSOPWebServerURL = null;

                        if (sensorTag.SensorType == (int)dnsData.Sensor.Facility.FacilityType.DOOR)
                            strSOPWebServerURL = m_strDoorAlarmURL;
                        else if (sensorTag.SensorType == (int)dnsData.Sensor.Facility.FacilityType.Laser)
                            strSOPWebServerURL = m_strLaserAlarmURL;
                        else
                        {
                            Logger.Instance.Write("SensorType 잘못 되었습니다: " + sensorTag.SensorType);
                            continue;
                        }                          

                        if (m_sopQueryMgr.SendAlarmQuery(arrData, ALARM_METHOD, strSOPWebServerURL) == false)
                        {
                            Logger.Instance.Write($"SendAlarmQuery 실패: Type: {sensorTag.SensorType}, IsAlarm: {bIsAlarm.ToString()}, OrgSensorID: {sensorTag.OrgSensorID}, TagInfoID: {sensorTag.ID}, SensorZoneID: {sensorTag.SensorZoneID}");
                            continue;
                        }
                        else
                        {
                            string type = "출입문 센서";
                            if (sensorTag.SensorType == (int)dnsData.Sensor.Facility.FacilityType.Laser)
                                type = "레이저 센서";

                            Logger.Instance.Write($"{type} 알람이 해제되었습니다. OrgSensorID: {sensorTag.OrgSensorID}, TagInfoID: {sensorTag.ID}, SensorZoneID: {sensorTag.SensorZoneID}");
                            m_alarms.Remove(key);
                        }
                            


                    }                    
                }
                 
                foreach (string key in addAlarms)
                {
                    if (m_dicSensorTag.ContainsKey(key))
                    {
                        SensorTag sensorTag = m_dicSensorTag[key];

                        bool bIsAlarm = true;

                        ArrayList arrData = new ArrayList();
                        arrData.Add(sensorTag.SensorType);
                        arrData.Add(sensorTag.ID);
                        arrData.Add(sensorTag.SensorZoneID);
                        arrData.Add(bIsAlarm);
                        arrData.Add(nAlarmLevel);

                        string strSOPWebServerURL = null;

                        if (sensorTag.SensorType == (int)dnsData.Sensor.Facility.FacilityType.DOOR)
                            strSOPWebServerURL = m_strDoorAlarmURL;
                        else if (sensorTag.SensorType == (int)dnsData.Sensor.Facility.FacilityType.Laser)
                            strSOPWebServerURL = m_strLaserAlarmURL;
                        else
                        {
                            Logger.Instance.Write("SensorType 잘못 되었습니다: " + sensorTag.SensorType);
                            continue;
                        }

                        if (m_sopQueryMgr.SendAlarmQuery(arrData, ALARM_METHOD, strSOPWebServerURL) == false)
                        {
                            Logger.Instance.Write($"SendAlarmQuery 실패: Type: {sensorTag.SensorType}, IsAlarm: {bIsAlarm.ToString()}, OrgSensorID: {sensorTag.OrgSensorID}, TagInfoID: {sensorTag.ID}, SensorZoneID: {sensorTag.SensorZoneID}");
                            continue;
                        }
                        else
                        {
                            string type = "출입문 센서";
                            if (sensorTag.SensorType == (int)dnsData.Sensor.Facility.FacilityType.Laser)
                                type = "레이저 센서";

                            Logger.Instance.Write($"{type} 알람이 발생하였습니다. OrgSensorID: {sensorTag.OrgSensorID}, TagInfoID: {sensorTag.ID}, SensorZoneID: {sensorTag.SensorZoneID}");
                            m_alarms.Add(key);
                        }
                            
                    }                       
                }

                Thread.Sleep(m_nThreadSleep);
            }
        }


    }


    public class SensorTag
    {
        private int m_nID = 0;
        private int m_nSensorType = 0;
        private int m_nTagNo = 0;
        private int m_nSensorZoneID = 0;
        private int m_nOrgSensorID = 0;
        private int m_nSensorServerID = 0;
        private string m_strDescription = string.Empty;
        private string m_strUniqueKey = string.Empty;

        /// <summary>
        /// SensorTagInfo 테이블 ID
        /// </summary>
        public int ID
        {
            get { return m_nID; }
            set { m_nID = value; }
        }

        public int SensorType
        {
            get { return m_nSensorType; }
            set { m_nSensorType = value; }
        }

        public int TagNo
        {
            get { return m_nTagNo; }
            set { m_nTagNo = value; }
        }

        public int SensorZoneID
        {
            get { return m_nSensorZoneID; }
            set { m_nSensorZoneID = value; }
        }

        public int OrgSensorID
        {
            get { return m_nOrgSensorID; }
            set { m_nOrgSensorID = value; }
        }

        public int SensorServerID
        {
            get { return m_nSensorServerID; }
            set { m_nSensorServerID = value; }
        }

        public string Description
        {
            get { return m_strDescription; }
            set { m_strDescription = value; }
        }

        public string UniqueKey
        {
            get { return m_strUniqueKey; }
            set { m_strUniqueKey = value; }
        }
    }
}
