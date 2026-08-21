using dnsDapperDBUtil.DataAccessLayer.DAL;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading;
using System.Timers;
using System.Windows.Forms;
using UneToBAMServer.Config;
using UneToBAMServer.Process;

namespace UneToBAMServer
{
    public class ProcessManager
    {
        //private DataManager m_dataManager = null;
        private DataManager m_bamDataManager = null;

        private string m_strAwsURL = "http://18.156.85.186:8082";
        private int m_nThreadSleep = 600;  // 60초
        private int m_nDataSaveTime = 7;    // 7일
        //private int m_nDataSendDelay = 10;  // 10초

        private bool m_shutdownThread = true;
        private bool m_bIsLoading = false;

        private DateTime m_dtLastCheck = new DateTime();

        private int m_nErrorSleep = 1000 * 60;

        private System.Timers.Timer m_watchTimer = null;

        private Thread m_watchSenkoThread = null;
        private Thread m_watchSend = null;

        //private DateTime m_dtLastDeleteData = DateTime.Today.AddDays(-1);
        private DateTime m_dtLastDeleteData = new DateTime();

        private int m_nMaxLimit = 2;

        // 테이블 삭제 전 백업(.sql) 파일을 저장할 폴더
        private string m_strBackupFolder = null;

        public ProcessManager()
        {
            Init();

            // 독일 시간대 가져오기
            TimeZoneInfo germanyTimeZone = TimeZoneInfo.FindSystemTimeZoneById("W. Europe Standard Time");

            // 현재 독일 시간
            DateTime dtToday = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, germanyTimeZone);

            m_dtLastDeleteData = dtToday.AddDays(-1);
        }

        private void Init()
        {
            var builder = new ConfigurationBuilder()
               .SetBasePath(Application.StartupPath)
               .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);

            IConfigurationRoot configuration = builder.Build();
            var bamDataConfig = new Site();
            configuration.GetSection("BAM_DATA").Bind(bamDataConfig);

            var info = new Info();
            configuration.GetSection("Info").Bind(info);



            //if (siteConfig.ID == null || siteConfig.DBName == null || siteConfig.DBType == null || siteConfig.DbHost == null || siteConfig.DbID == null || siteConfig.DbPw == null)
            if (bamDataConfig.ID == null || bamDataConfig.DBName == null || bamDataConfig.DBType == null || bamDataConfig.DbHost == null || bamDataConfig.DbID == null || bamDataConfig.DbPw == null)
            {
                return;
            }
            else
            {
                string strBamDBHost = dnsDapperDBUtil.AES256Cipher.AES_decrypt(bamDataConfig.DbHost);
                string strBamDbID = dnsDapperDBUtil.AES256Cipher.AES_decrypt(bamDataConfig.DbID);
                string strBamDbPw = dnsDapperDBUtil.AES256Cipher.AES_decrypt(bamDataConfig.DbPw);

                m_bamDataManager = new DataManager(bamDataConfig.DBType.Value, strBamDBHost, bamDataConfig.DBName, strBamDbID, strBamDbPw);

                if (info.AWS_URL != null)
                    m_strAwsURL = info.AWS_URL;

                // 백업 폴더 설정: 미지정 시 실행파일 옆 Backup 폴더로 폴백
                m_strBackupFolder = !string.IsNullOrEmpty(info.BackupFolder)
                    ? info.BackupFolder
                    : Path.Combine(Application.StartupPath, "Backup");
            }
        }

        public void Start()
        {
            Logger.Instance.Write("Start 실행");

            if (m_shutdownThread == true)
            {
                m_shutdownThread = false;

                m_watchTimer = new System.Timers.Timer();
                m_watchTimer.Interval = 1000 * 60; // 60초
                m_watchTimer.Elapsed += new ElapsedEventHandler(timerLoadData_Elapsed);
                m_watchTimer.Start();

                this.timerLoadData_Elapsed(null, null);
            }
        }

        public void Stop()
        {
            Logger.Instance.Write("Stop 실행");

            m_shutdownThread = true;
        }

        private void timerLoadData_Elapsed(object sender, ElapsedEventArgs e)
        {
            string strErrorMessage = "";
            
            try
            {
                Logger.Instance.Write("timerLoadData_Elapsed 실행");

                if (m_bIsLoading == true)
                {
                    DateTime dtNow = DateTime.Now;
                    TimeSpan time = dtNow - m_dtLastCheck;
                    if (time.TotalMinutes > 10)
                    {
                        Logger.Instance.Write("마지막 불러오는 시간 이후로 10분 경과로 초기화");
                    }
                    else
                    {
                        Logger.Instance.Write("이미 데이터 불러오는 중으로 종료");
                        return;
                    }                    
                }
                else if (m_bamDataManager == null)
                {
                    Logger.Instance.Write("DBManager 초기화 실패");
                    return;
                }

                m_bIsLoading = true;
                m_dtLastCheck = DateTime.Now;

                // 독일 시간대 가져오기
                TimeZoneInfo germanyTimeZone = TimeZoneInfo.FindSystemTimeZoneById("W. Europe Standard Time");

                // 현재 독일 시간
                //DateTime dtToday = DateTime.Today;
                DateTime dtToday = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, germanyTimeZone);

                dtToday = new DateTime(dtToday.Year, dtToday.Month, dtToday.Day);

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
                    // 1. 삭제 대상(7일 전) 테이블을 DROP+CREATE+INSERT 스크립트(.sql)로 백업
                    if (BAMDataManager.BackupDataTable(m_bamDataManager, dtToday, m_nDataSaveTime, m_strBackupFolder, out strErrorMessage) == false)
                    {
                        // 백업 실패(대상 테이블 없음 포함) 시 삭제를 건너뜀 - 데이터 유실 방지
                        Logger.Instance.Write("BackupDataTable 실패로 DropDataTable 건너뜀: " + strErrorMessage);
                    }
                    // 2. 백업 성공 시에만 테이블 삭제
                    else if (BAMDataManager.DropDataTable(m_bamDataManager, dtToday, m_nDataSaveTime, out strErrorMessage) == false)
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

                    string strURL = m_strAwsURL + "/UNE/RequestAPIData";

                    // UNE >> AWS >> BAM_UNE >> BAM API 
                    result = WebServiceManager.RequestAPIData(strURL, out strErrorMessage);
                    if (result == null)
                    {
                        Logger.Instance.Write("RequestAPIData Error: " + strErrorMessage);
                        SleepThread(20);
                        continue;
                    }
                }

                // 필수 데이터 항목 체크
                result = BAMDataManager.CheckTimeSeriesData(result, out strErrorMessage);
                if (result == null)
                {
                    Logger.Instance.Write("CheckTimeSeriesData Error: " + strErrorMessage);
                }

                // 조회된 데이터 DB 저장
                if (BAMDataManager.SaveBAMData(m_bamDataManager, result, dtToday, out strErrorMessage) == false)
                {
                    Logger.Instance.Write("SaveBAMData 실패: " + strErrorMessage);
                }

                
                m_bIsLoading = false;
            }
            catch (Exception ex)
            {
                Logger.Instance.Write($"timerLoadData_Elapsed 예외: {ex.Message}");

                // 실행 종료
                m_bIsLoading = false;
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
