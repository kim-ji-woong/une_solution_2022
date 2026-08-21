//using DBUtility2;
using dnsDBUtil;
using SDMS.DAL;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Configuration;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Timers;

namespace SoulbrainWebSensorServer
{
    partial class SoulbrainWebSensorService : ServiceBase
    {
        private WebServiceManager m_webServiceMgr = null;
        //private WebDBManager m_dbManager = null;
        private DirectDBManager m_HrDBManager = null;
        private DataManager m_dataManager = null;
        private TeamEditor.DAL.DataManager m_memberDataManager = null;
        private Dashboard.DAL.DataManager m_dashboardDataManager = null;
        private Common.DAL.DataManager m_commonDataManager = null;
        private SOPManager.DAL.DataManager m_sopDataManager = null;

        private TeamEditor.BLL.ProcessManager m_processManager = null;

        private DirectDBManager m_wishDBManager = null;
        private WishDataManager m_wishDataManager = null;

        private SynchroManager m_synchroManager = null;

        private WSopDataManager m_wsopDataMgr = null;
        
        //private List<DataDevice> m_listDevice = null;
        private bool m_shutdownThread = false;
        private bool m_shutdownSensor = true;
        //private int m_nShutdownThread = 0;                                // 쓰레드 실행 유무 판단 변수

        //private const int m_nThreadDeviceNum = 140;                       // 쓰레드 당 감시할 디바이스 갯수
        private const int m_nThreadReloadSleep = 1000 * 30;                 // 쓰레드 다시 불러올 때 슬립타임
        private const int m_nThreadErrorSleep = 1000 * 60;                  // 쓰레드 오류 슬립타임

        private const int m_nThreadWishSleep = 1000 * 60;                   // WISH 쓰레드 슬립타임
        private const int m_nWishErrorSleep = 1000 * 60 * 10;               // WISH 쓰레드 에러 슬립타임

        private const int m_nThreadSleep = 200;                             // 쓰레드 슬립타임

        private const int m_nThreadClearSleep = 1000 * 60 * 50;             // 1분(1초 * 60) * 50 = 50분

        Thread m_watchWish = null;
        Thread m_watchAlarm = null;
        Thread m_watchReload = null;
        Thread m_watchSensor = null;    // 센서 데이터 쓰레드

        //private System.Timers.Timer m_timerReload = null;           // 로그인 및 디바이스 조회 타이머
        //private bool m_bTimerChk = false;                           // 이미 타이머 실행 유무 체크

        private DateTime m_dtLast = new DateTime();


        //private int m_nDeviceNumStart = 0;
        //private int m_nDeviceNumEnd = 0;
        private bool m_bFirstServer = false;
        private bool m_bAlarmServer = false;
        private bool m_bDataServer = false;

        public SoulbrainWebSensorService()
        {
            InitializeComponent();

            // Soulbrain Web Rest API 관련 매니저
            m_webServiceMgr = new WebServiceManager();

            // WSOP DB 매니저
            InitConfig();
            m_wsopDataMgr = new WSopDataManager(m_dataManager, m_memberDataManager);

            m_webServiceMgr.WSopDataMgr = m_wsopDataMgr;

            // 서버 소스
            //m_timerReload = new System.Timers.Timer();
            //m_timerReload.Interval = 1000 * 60 * 50;       // 1분(1초 * 60) * 50 = 50분
            //m_timerReload.Elapsed += new ElapsedEventHandler(timerReload_Elapsed);
   
        }

        private void InitConfig()
        {
            string strSiteID = ConfigurationManager.AppSettings.Get("SITE_ID");
            if (strSiteID == null || strSiteID.Length == 0)
                strSiteID = "10";

            string strDBName = ConfigurationManager.AppSettings.Get("DB_NAME");
            if (strDBName == null || strDBName.Length == 0)
                strDBName = "WSOP_10";

            string strDBType = ConfigurationManager.AppSettings.Get("DB_TYPE");
            if (strDBType == null || strDBType.Length == 0)
                strDBType = "0";

            string strDBHost = ConfigurationManager.AppSettings.Get("DB_HOST");
            if (strDBHost == null || strDBHost.Length == 0)
                strDBHost = "AwVB0IrUXAghp5PlaWuqWg==";

            string strDBId = ConfigurationManager.AppSettings.Get("DB_ID");
            if (strDBId == null || strDBId.Length == 0)
                strDBId = "GUk6cJACqVBoIFh7ny7mqQ==";

            string strDBPw = ConfigurationManager.AppSettings.Get("DB_PW");
            if (strDBPw == null || strDBPw.Length == 0)
                strDBPw = "SezOwMM9A2mIbUk5DCW/eQ==";

            string key = new string(new char[] { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6' });

            strDBHost = AES256Cipher.AES_decrypt(strDBHost.Trim(), key);
            strDBId = AES256Cipher.AES_decrypt(strDBId.Trim(), key);
            strDBPw = AES256Cipher.AES_decrypt(strDBPw.Trim(), key);


            




            string strWishDBName = ConfigurationManager.AppSettings.Get("WISH_NAME");
            if (strWishDBName == null || strWishDBName.Length == 0)
                strWishDBName = "ESH_DB";

            string strWishDBType = ConfigurationManager.AppSettings.Get("WISH_TYPE");
            if (strWishDBType == null || strWishDBType.Length == 0)
                strWishDBType = "0";

            string strWishDBId = ConfigurationManager.AppSettings.Get("WISH_ID");
            if (strWishDBId == null || strWishDBId.Length == 0)
                strWishDBId = "wesh";

            string strWishDBPW = ConfigurationManager.AppSettings.Get("WISH_PW");
            if (strWishDBPW == null || strWishDBPW.Length == 0)
                strWishDBPW = "techn0$b";

            string strWishDBUrl = ConfigurationManager.AppSettings.Get("WISH_URL");
            if (strWishDBUrl == null || strWishDBUrl.Length == 0)
                strWishDBUrl = "211.194.150.110";

            string strHrDBName = ConfigurationManager.AppSettings.Get("HR_NAME");
            if (strHrDBName == null || strHrDBName.Length == 0)
                strHrDBName = "Soulbrain_HR";





            string strDeviceNumStart = ConfigurationManager.AppSettings.Get("DEVICE_NUM_START");
            if (strDeviceNumStart == null || strDeviceNumStart.Length == 0)
                strDeviceNumStart = "0";

            string strDeviceNumEnd = ConfigurationManager.AppSettings.Get("DEVICE_NUM_END");
            if (strDeviceNumEnd == null || strDeviceNumEnd.Length == 0)
                strDeviceNumEnd = "9999";

            string strFirstServer = ConfigurationManager.AppSettings.Get("FIRST_SERVER");
            if (strFirstServer == null || strFirstServer.Length == 0)
                strFirstServer = "False";

            string strAlarmServer = ConfigurationManager.AppSettings.Get("ALARM_SERVER");
            if (strAlarmServer == null || strAlarmServer.Length == 0)
                strAlarmServer = "False";

            string strDataServer = ConfigurationManager.AppSettings.Get("DATA_SERVER");
            if (strDataServer == null || strDataServer.Length == 0)
                strDataServer = "False";


            int nSiteID, nDBType;
            int.TryParse(strSiteID.Trim(), out nSiteID);
            int.TryParse(strDBType.Trim(), out nDBType);

            int nWishDBType;
            int.TryParse(strWishDBType.Trim(), out nWishDBType);



            //int nDeviceNumStart, nDeviceNumEnd;
            bool bFirstServer = false;
            bool bAlarmServer = false;
            bool bDataServer = false;

            //if (int.TryParse(strDeviceNumStart.Trim(), out nDeviceNumStart))
            //    m_nDeviceNumStart = nDeviceNumStart;
            //if (int.TryParse(strDeviceNumEnd.Trim(), out nDeviceNumEnd))
            //    m_nDeviceNumEnd = nDeviceNumEnd;

            if (bool.TryParse(strFirstServer, out bFirstServer))
                m_bFirstServer = bFirstServer;
            if (bool.TryParse(strAlarmServer, out bAlarmServer))
                m_bAlarmServer = bAlarmServer;
            if (bool.TryParse(strDataServer, out bDataServer))
                m_bDataServer = bDataServer;



            m_dataManager = new DataManager(nDBType, strDBHost, strDBName, strDBId, strDBPw, nSiteID);
            m_memberDataManager = new TeamEditor.DAL.DataManager(nDBType, strDBHost, strDBName, strDBId, strDBPw, nSiteID);
            m_dashboardDataManager = new Dashboard.DAL.DataManager(nDBType, strDBHost, strDBName, strDBId, strDBPw, nSiteID);
            m_commonDataManager = new Common.DAL.DataManager(nDBType, strDBHost, strDBName, strDBId, strDBPw, nSiteID);
            m_sopDataManager = new SOPManager.DAL.DataManager(nDBType, strDBHost, strDBName, strDBId, strDBPw, nSiteID);


            m_wishDBManager = new DirectDBManager(nWishDBType, strWishDBUrl, strWishDBName, strWishDBId, strWishDBPW);
            m_wishDataManager = new WishDataManager(m_wishDBManager, m_dashboardDataManager);

            m_HrDBManager = new DirectDBManager(nDBType, strDBHost, strHrDBName, strDBId, strDBPw);
        }

        private void WatchReloadThread()
        {
            Logger.Instance.Write("WatchReloadThread 실행");

            while (!m_shutdownThread)
            {
                DateTime dtNow = DateTime.Now;

                //m_nShutdownThread++;                // 실행 중인 쓰레드 중지
                //if (m_nShutdownThread > 100)
                //    m_nShutdownThread = 1;
                if (m_shutdownSensor == false)
                {
                    m_shutdownSensor = true;
                    Thread.Sleep(m_nThreadReloadSleep);       // 실행 중인 쓰레드 종료 시간
                }


                // 로그인
                if (m_webServiceMgr.RequestLogin() == false)
                {
                    Logger.Instance.Write("Login Rest API 실패. 네트워크 확인바람.");
                    // 1분 후 재실행
                    Thread.Sleep(m_nThreadErrorSleep);
                    continue;
                }


                if (m_bFirstServer || m_bDataServer)
                {
                    // 디바이스 조회
                    if (m_webServiceMgr.RequestDeviceList() == false)
                    {
                        Logger.Instance.Write("Device List 조회 Rest API 실패. 네트워크 확인바람.");
                        // 1분 후 재실행
                        Thread.Sleep(m_nThreadErrorSleep);
                        continue;
                    }

                    // 데이터 조회 쓰레드 시작
                    if (m_bDataServer)
                        m_shutdownSensor = false;

                    // 하루에 한번
                    if (m_bFirstServer == true && (dtNow - m_dtLast).TotalDays >= 1)
                    {
                        // 디바이스 정보 및 임계치 조회
                        if (m_webServiceMgr.UpdateSensorInfos(m_webServiceMgr.DicDevices) == false)
                        {
                            Logger.Instance.Write("UpdateSensorInfos 실패. 네트워크 확인바람.");
                            // 1분 후 재실행
                            Thread.Sleep(m_nThreadErrorSleep);
                            continue;
                        }

                        // 임계치 값 업데이트
                        if (m_wsopDataMgr.UpdateSensorsThresholds(m_webServiceMgr.DicDevices) == false)
                        {
                            Logger.Instance.Write("UpdateSensorsThresholds 실패. 네트워크 확인바람.");
                            // 1분 후 재실행
                            Thread.Sleep(m_nThreadErrorSleep);
                            continue;
                        }
                    }

                    // 디바이스 센서 데이터 조회 쓰레드 생성
                    //if (ReloadSensorThread() == false)
                    //{
                    //    Logger.Instance.Write("조회된 Device가 없어 실패.");
                    //    // 1분 후 재실행
                    //    Thread.Sleep(m_nThreadErrorSleep);
                    //    continue;
                    //}
                    //if (m_watchSensor == null || m_watchSensor.ThreadState == System.Threading.ThreadState.Stopped)
                    //{
                    //    m_watchSensor = new Thread(() => ReloadSensorThread2());
                    //    m_watchSensor.Start();
                    //}
                }

                // 지난 로그 삭제
                if ((dtNow - m_dtLast).TotalDays >= 1)
                {
                    Logger.Instance.RemoveOldLogs();
                    m_dtLast = DateTime.Now;
                }

                Thread.Sleep(m_nThreadClearSleep);
            }
        }

        private bool ReloadSensorThread3()
        {
            while (!m_shutdownThread)
            {
                Dictionary<string, DataDevice> dicDevices = m_webServiceMgr.DicDevices;
                if (m_shutdownSensor || dicDevices == null || dicDevices.Count == 0)
                {
                    Thread.Sleep(m_nThreadReloadSleep);
                    continue;
                }

                foreach (KeyValuePair<string, DataDevice> pair in dicDevices)
                {
                    if (m_shutdownSensor)
                        break;

                    DataDevice data = pair.Value;

                    if (m_webServiceMgr.RequestSensorData(data, true) == false)
                        Thread.Sleep(m_nThreadErrorSleep);
                    if (m_wsopDataMgr.UpdateETCSensor(data) == false)
                        Thread.Sleep(m_nThreadErrorSleep);

                    Thread.Sleep(m_nThreadSleep);
                }

                Console.WriteLine("ReloadSensorThread3 End");
            }

            return true;
        }

        /*private bool ReloadSensorThread2()
        {
            Dictionary<string, DataDevice> dicDevices = m_webServiceMgr.DicDevices;
            if (dicDevices == null || dicDevices.Count == 0)
                return false;

            if (m_shutdownSensor == false)
            {   // 이미 실행 중으로...
                return false;
            }
            else
                m_shutdownSensor = false;

            while (!m_shutdownSensor)
            {
                foreach (KeyValuePair<string, DataDevice> pair in dicDevices)
                {
                    if (m_shutdownSensor)
                        break;

                    DataDevice data = pair.Value;

                    if (m_webServiceMgr.RequestSensorData(data, true) == false)
                        Thread.Sleep(m_nThreadErrorSleep);
                    if (m_wsopDataMgr.UpdateETCSensor(data) == false)
                        Thread.Sleep(m_nThreadErrorSleep);

                    Thread.Sleep(m_nThreadSleep);
                }
            }

            return true;
        }*/

        /*private bool ReloadSensorThread()
        {
            Dictionary<string, DataDevice> dicDevices = m_webServiceMgr.DicDevices;
            if (dicDevices == null || dicDevices.Count == 0)
                return false;

            if (m_listDevice?.Count > 0)
            {
                m_listDevice.Clear();
            }
                
            m_listDevice = new List<DataDevice>(dicDevices.Values);

            int nStartNum = m_nDeviceNumStart;
            int nEndNum = m_nDeviceNumEnd;

            if (nStartNum > m_listDevice.Count)
                nStartNum = m_listDevice.Count;
            if (nEndNum > m_listDevice.Count)
                nEndNum = m_listDevice.Count;

            for (int i = nStartNum; i < nEndNum; i += m_nThreadDeviceNum) 
            {
                int nNum = i;

                Thread WatchDevice = new Thread(() => WatchDeviceThread(nNum, m_nShutdownThread));
                WatchDevice.Start();
            }

            return true;
        }*/

        // ETC Sensor Data 업데이트 쓰레드
        /*private void WatchDeviceThread(int nNum, int nShutdownThread)
        {
            int nEndNum = m_nDeviceNumEnd;
            if (nEndNum > m_listDevice.Count)
                nEndNum = m_listDevice.Count;

            if (nNum + m_nThreadDeviceNum < nEndNum)
                nEndNum = nNum + m_nThreadDeviceNum;

            while (m_nShutdownThread == nShutdownThread)
            {
                for (int i = nNum; i < nEndNum; i++)
                {
                    if (i > m_listDevice.Count - 1)
                        break;

                    DataDevice data = m_listDevice[i];

                    if (m_webServiceMgr.RequestSensorData(data, true) == false)
                        Thread.Sleep(m_nThreadErrorSleep);
                    if (m_wsopDataMgr.UpdateETCSensor(data) == false)
                        Thread.Sleep(m_nThreadErrorSleep);

                    Thread.Sleep(m_nThreadSleep);
                }
            }           
        }*/

        protected override void OnStart(string[] args)
        {
            // TODO: 여기에 서비스를 시작하는 코드를 추가합니다.
            m_watchReload = new Thread(() => WatchReloadThread());
            m_watchReload.Start();

            if (m_bDataServer == true)
            {
                m_watchSensor = new Thread(() => ReloadSensorThread3());
                m_watchSensor.Start();
            }

            if (m_bFirstServer == true)
            {
                m_watchWish = new Thread(() => WatchWishThread());
                m_watchWish.Start();

                // HR 조직 정보 동기화
                m_processManager = new TeamEditor.BLL.ProcessManager(m_commonDataManager, m_memberDataManager, m_sopDataManager, m_dataManager);
                m_synchroManager = new SynchroManager(m_HrDBManager, m_memberDataManager, m_processManager);
                m_synchroManager.StartThread();
            }

            if (m_bAlarmServer == true)
            {
                // 알람 추가 감시 Thread
                m_watchAlarm = new Thread(() => WatchAlarmThread());
                m_watchAlarm.Start();
            }
        }

        private void WatchWishThread()
        {
            while (!m_shutdownThread)
            {
                string strErrorMessage = "";

                if (m_wishDataManager.ReloadCurrentWorkPermitData(out strErrorMessage) == false)
                {
                    Logger.Instance.Write("ReloadCurrentWorkPermitData 실패 (" + strErrorMessage + ")");
                    Thread.Sleep(m_nWishErrorSleep);
                    continue;
                }

                Thread.Sleep(m_nThreadWishSleep);
            }
        }

        private void WatchAlarmThread()
        {
            Logger.Instance.Write("WatchAlarmThread 실행");

            while (!m_shutdownThread)
            {
                // 이벤트 리스트 받아오기
                List<AlarmSensorData> alarmSensors = m_webServiceMgr.RequestEventList();
                if (alarmSensors == null)
                {
                    // 1분 후 재실행
                    Thread.Sleep(1000 * 60);
                    continue;
                }
                else if (alarmSensors.Count == 0)
                {
                    Thread.Sleep(1000);
                    continue;
                }

                // 알람 발송 
                m_webServiceMgr.SendAlarmSensorData(alarmSensors);

                // 알람 관련 데이터 업데이트
                m_webServiceMgr.RequestSensorData(alarmSensors);
                m_wsopDataMgr.UpdateETCSensor(alarmSensors);

                if (alarmSensors != null)
                    alarmSensors.Clear();
            }
        }

        protected override void OnStop()
        {
            // 서비스를 중지하는 데 필요한 작업을 수행하는 코드를 여기에 추가합니다.
            m_shutdownThread = true;                // 실행 중인 쓰레드 중지
            //m_nShutdownThread = -1;               // 실행 중인 쓰레드 중지
            m_shutdownSensor = true;

            //m_timerReload.Stop();
            if (m_watchReload != null)
                m_watchReload.Abort();

            if (m_watchSensor != null)
                m_watchSensor.Abort();

            if (m_synchroManager != null)
                m_synchroManager.StopThread();

            if (m_watchWish != null)
                m_watchWish.Abort();
            if (m_watchAlarm != null)
                m_watchAlarm.Abort();

        }
    }
}
