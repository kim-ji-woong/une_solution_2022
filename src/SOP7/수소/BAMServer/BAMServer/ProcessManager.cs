using BAMServer.Config;
using BAMServer.Senko;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Text;
using System.Threading;
using System.Timers;
using System.Windows.Forms;

namespace BAMServer
{
    public class ProcessManager
    {
        private DataManager m_dataManager = null;
        private DataManager m_bamDataManager = null;

        private SenkoManager m_senkoManager = null;

        private string m_strApiURL = "http://192.168.100.21/api_corea/sensor/read02.php";
        private int m_nThreadSleep = 600;  // 60초
        private int m_nDataSaveTime = 7;    // 7일

        private bool m_shutdownThread = true;
        private bool m_bIsLoading = false;

        private int m_nErrorSleep = 1000 * 60;

        private Thread m_watchThread = null;
        private System.Timers.Timer m_watchTimer = null;

        private Thread m_watchSenkoThread = null;
        private Thread m_watchSend = null;

        private DateTime m_dtLastDeleteData = DateTime.Today.AddDays(-1);

        private int m_nMaxLimit = 1;

        public ProcessManager()
        {
            Init();
        }

        private void Init()
        {
            var builder = new ConfigurationBuilder()
               .SetBasePath(Application.StartupPath)
               .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);

            IConfigurationRoot configuration = builder.Build();
            var siteConfig = new Site();
            configuration.GetSection("Site").Bind(siteConfig);

            var bamDataConfig = new Site();
            configuration.GetSection("BAM_DATA").Bind(bamDataConfig);

            var info = new Info();
            configuration.GetSection("Info").Bind(info);

            if (siteConfig.ID == null || siteConfig.DBName == null || siteConfig.DBType == null || siteConfig.DbHost == null || siteConfig.DbID == null || siteConfig.DbPw == null ||
                bamDataConfig.ID == null || bamDataConfig.DBName == null || bamDataConfig.DBType == null || bamDataConfig.DbHost == null || bamDataConfig.DbID == null || bamDataConfig.DbPw == null)
                return;
            else
            {
                string strDBHost = dnsDapperDBUtil.AES256Cipher.AES_decrypt(siteConfig.DbHost);
                string strDbID = dnsDapperDBUtil.AES256Cipher.AES_decrypt(siteConfig.DbID);
                string strDbPw = dnsDapperDBUtil.AES256Cipher.AES_decrypt(siteConfig.DbPw);

                string strBamDBHost = dnsDapperDBUtil.AES256Cipher.AES_decrypt(bamDataConfig.DbHost);
                string strBamDbID = dnsDapperDBUtil.AES256Cipher.AES_decrypt(bamDataConfig.DbID);
                string strBamDbPw = dnsDapperDBUtil.AES256Cipher.AES_decrypt(bamDataConfig.DbPw);

                m_dataManager = new DataManager(siteConfig.DBType.Value, strDBHost, siteConfig.DBName, strDbID, strDbPw);
                m_bamDataManager = new DataManager(bamDataConfig.DBType.Value, strBamDBHost, bamDataConfig.DBName, strBamDbID, strBamDbPw);

                if (info.ApiURL != null)
                    m_strApiURL = info.ApiURL;
                if (info.ThreadSleep.HasValue)
                    m_nThreadSleep = info.ThreadSleep.Value;
                if (info.DataSaveTime.HasValue)
                    m_nDataSaveTime = info.DataSaveTime.Value;
            }

            m_senkoManager = new SenkoManager(this);
        }

        public void Start()
        {
            Logger.Instance.Write("Start 실행");

            if (m_shutdownThread == true)
            {
                m_shutdownThread = false;


#if BAM_GET
                //m_watchThread = new Thread(() => WatchThread());
                //m_watchThread.Start();
                m_watchTimer = new System.Timers.Timer();
                m_watchTimer.Interval = 1000 * 60; // 60초
                m_watchTimer.Elapsed += new ElapsedEventHandler(timerLoadData_Elapsed);
                m_watchTimer.Start();
#endif

#if SENKO_SENSOR
                m_watchSenkoThread = new Thread(() => WatchSenkoThread());
                m_watchSenkoThread.Start();
#endif

#if BAM_SEND
                m_watchSend = new Thread(() => WatchSendThread());
                m_watchSend.Start();
#endif

            }
        }

        public void Stop()
        {
            Logger.Instance.Write("Stop 실행");

#if SENKO_SENSOR
            m_watchTimer.Stop();
#endif

            m_shutdownThread = true;
        }

        private void WatchThread()
        {
            string strErrorMessage = "";
            Logger.Instance.Write("WatchThread 실행");

            if (m_dataManager == null || m_bamDataManager == null)
            {
                Logger.Instance.Write("DBManager 초기화 실패");
                return;
            }

            while (!m_shutdownThread)
            {
                DateTime dtToday = DateTime.Today;




                // 테이블 관리
                if (m_dtLastDeleteData < dtToday)
                {
                    m_dtLastDeleteData = dtToday;                    

                    // 날짜별 테이블 생성 및 7일전까지 보유 후 삭제
                    // 테이블 생성
                    if (BAMDataManager.CreateDataTable(m_bamDataManager, dtToday, out strErrorMessage) == false)
                    {
                        Logger.Instance.Write("CreateDataTable 실패: " + strErrorMessage);
                    }

                    // 데이터 주기적 삭제
                    //BAMDataManager.DeleteBAMData(m_bamDataManager, m_nDataSaveTime, out strErrorMessage);
                    // 테이블 삭제 및 데이터 백업
                    // 테이블 삭제
                    if (BAMDataManager.DropDataTable(m_bamDataManager, dtToday, m_nDataSaveTime, out strErrorMessage) == false)
                    {
                        Logger.Instance.Write("DropDataTable 실패: " + strErrorMessage);
                    }
                }



                // API 데이터 요청 조회
                List<BAM_Data> result = null;

                // RequestAPIData 제대로 불러올 경우에만 다음으로 넘어감 
                // 실패 시에는 재요청
                while (result == null)
                {
                    result = WebServiceManager.RequestAPIData(m_strApiURL, out strErrorMessage);
                    if (result == null)
                    {
                        Logger.Instance.Write("RequestAPIData 실패: " + strErrorMessage);                        
                        SleepThread(30);
                        continue;
                    }
                }
             


                // 조회된 데이터 DB 저장
                BAMDataManager.SaveBAMData(m_bamDataManager, result, dtToday, out strErrorMessage);
                if (result == null)
                {
                    Logger.Instance.Write("SaveBAMData 실패: " + strErrorMessage);                    
                    SleepThread();
                    continue;
                }           


                SleepThread();
            }
        }

        private void timerLoadData_Elapsed(object sender, ElapsedEventArgs e)
        {
            string strErrorMessage = "";
            //Logger.Instance.Write("WatchThread 실행");

            if (m_bIsLoading == true)
            {
                Logger.Instance.Write("이미 데이터 불러오는 중으로 종료");
                return;
            }
            else if (m_dataManager == null || m_bamDataManager == null)
            {
                Logger.Instance.Write("DBManager 초기화 실패");
                return;
            }

            m_bIsLoading = true;

            DateTime dtToday = DateTime.Today;

            // 테이블 관리
            if (m_dtLastDeleteData < dtToday)
            {
                m_dtLastDeleteData = dtToday;

                // 날짜별 테이블 생성 및 7일전까지 보유 후 삭제
                // 테이블 생성
                if (BAMDataManager.CreateDataTable(m_bamDataManager, dtToday, out strErrorMessage) == false)
                {
                    Logger.Instance.Write("CreateDataTable 실패: " + strErrorMessage);
                }

                // 데이터 주기적 삭제
                // 테이블 삭제 및 데이터 백업
                // 테이블 삭제
                if (BAMDataManager.DropDataTable(m_bamDataManager, dtToday, m_nDataSaveTime, out strErrorMessage) == false)
                {
                    Logger.Instance.Write("DropDataTable 실패: " + strErrorMessage);
                }
            }



            // API 데이터 요청 조회
            List<BAM_Data> result = null;
            int nLimit = 0;

            // RequestAPIData 제대로 불러올 경우에만 다음으로 넘어감 
            // 실패 시에는 재요청
            while (result == null && m_nMaxLimit > nLimit)
            {
                nLimit++;

                result = WebServiceManager.RequestAPIData(m_strApiURL, out strErrorMessage);
                if (result == null)
                {
                    Logger.Instance.Write("RequestAPIData 실패: " + strErrorMessage);
                    SleepThread(20);
                    continue;
                }
            }



            // 조회된 데이터 DB 저장
            if (BAMDataManager.SaveBAMData(m_bamDataManager, result, dtToday, out strErrorMessage) == false)
            {
                Logger.Instance.Write("SaveBAMData 실패: " + strErrorMessage);
            }

            // 실행 종료
            m_bIsLoading = false;
        }

        private void WatchSenkoThread()
        {
            while (!m_shutdownThread)
            {
                try
                {
                    DateTime dtNow = DateTime.Now;

                    // 일정시간 갱신되지 못한 데이터는 초기화
                    m_senkoManager.RefreshSensor(dtNow);

                    // 센코 센서 데이터 요청
                    m_senkoManager.GetSensorData();


                    // .TODO: 데이터 DB 저장


                    SleepThread(15);
                }
                catch (Exception e)
                {
                    Logger.Instance.Write("WatchSenkoThread() Error: " + e.Message);
                    SleepThread(30);
                    continue;
                }                                
            }
        }

        private void WatchSendThread()
        {
            while (!m_shutdownThread)
            {
                try
                {
                    DateTime dtNow = DateTime.Now;

                    foreach (KeyValuePair<int, ClientProvider> pair in m_senkoManager.Providers)
                    {
                        int nID = pair.Key;
                        ClientProvider provider = pair.Value;

                        WebServiceManager.SendSensorData(nID, provider, dtNow);
                    }                    
                }
                catch (Exception e)
                {
                    Logger.Instance.Write("WatchSendThread() Error: " + e.Message);
                    SleepThread(30);
                    continue;
                }

                SleepThread(300);
            }
        }

        public void SleepThread(int nThreadSleep = -1)
        {
            if (nThreadSleep < 0)
                nThreadSleep = m_nThreadSleep;

            for (int i = 0; i < nThreadSleep * 10; i++)
            {
                if (m_shutdownThread)
                    break;

                Thread.Sleep(10);                
            }
        }
    }
}
