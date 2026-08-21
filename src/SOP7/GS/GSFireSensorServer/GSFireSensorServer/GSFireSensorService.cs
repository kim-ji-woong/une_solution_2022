using dnsCommunicateSopServer;
using dnsData.Sensor;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using SDMS.DAL;
using System;
using System.Collections;
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

namespace GSFireSensorServer
{
    partial class GSFireSensorService : ServiceBase
    {
        //private const string ALARM_METHOD = "POST";

        private Thread m_thread = null;
        private Thread m_ipCameraThread = null;

        private bool m_shutdownThread = false;
        private bool m_bIsCurrentAlarm = false;

        //private string m_strAlarmFireURL = null;
        private SignManager m_SignManager = null;

        //private SopQueryManager m_SopQueryMgr = null;
        private CrawlingManager m_crawlingManager = null;

        private DataManager m_dataManager = null;

        private DateTime m_dtLast = new DateTime();

        public GSFireSensorService()
        {
            InitializeComponent();
            Init();

            string strErrorMessage = "";

            m_SignManager = new SignManager(m_dataManager);
            m_crawlingManager = new CrawlingManager(m_SignManager);

            if (m_crawlingManager.InitCrawling(out strErrorMessage) == false)
            {
                Trace.WriteLine(strErrorMessage);
                Logger.Instance.Write("InitCrawling 오류 " + strErrorMessage);

                return;
            }
        }

        private void Init()
        {
            //string strAlarmFireURL = ConfigurationManager.AppSettings.Get("ALARM_FIRE_URL");
            //if (strAlarmFireURL == null || strAlarmFireURL.Length == 0)
            //    strAlarmFireURL = "http://127.0.0.1:44379/api/FireSensor";

            //m_strAlarmFireURL = strAlarmFireURL;

            //m_SopQueryMgr = new SopQueryManager();

            string strSiteID = ConfigurationManager.AppSettings.Get("SITE_ID");
            if (strSiteID == null || strSiteID.Length == 0)
                strSiteID = "10";

            string strDBName = ConfigurationManager.AppSettings.Get("DB_NAME");
            if (strDBName == null || strDBName.Length == 0)
                strDBName = "WSOP_10";

            string strDBType = ConfigurationManager.AppSettings.Get("DB_TYPE");
            if (strDBType == null || strDBType.Length == 0)
                strDBType = "0";

            string strWebServerURL = ConfigurationManager.AppSettings.Get("WebServerURL");
            if (strWebServerURL == null || strWebServerURL.Length == 0)
                strWebServerURL = "http://127.0.0.1:808";

            int nSiteID, nDBType;
            int.TryParse(strSiteID.Trim(), out nSiteID);
            int.TryParse(strDBType.Trim(), out nDBType);

            m_dataManager = new DataManager(strDBName, nDBType, nSiteID, strWebServerURL);

            return;
        }

        public void Shutdown()
        {
            m_shutdownThread = true;
            m_thread.Abort();
        }

        protected override void OnStart(string[] args)
        {
            // TODO: 여기에 서비스를 시작하는 코드를 추가합니다.

            m_thread = new Thread(new ThreadStart(FireSensorReadThread));
            m_thread.Name = "FireSensor Tester";
            m_thread.Start();

            m_ipCameraThread = new Thread(new ThreadStart(IPCameraReadThread));
            m_ipCameraThread.Name = "IPCamera Tester";
            m_ipCameraThread.Start();
        }

        private void FireSensorReadThread()
        {
            while (!m_shutdownThread)
            {
                string strErrorMessage = "";

                //if (m_crawlingManager.ConnectVitconSite(out strErrorMessage) == false)
                //{
                //    // 에러 로그 기록
                //    Logger.Instance.Write("ConnectVitconSite 오류 " + strErrorMessage);
                //    Thread.Sleep(5000);
                //    continue;
                //}

                //while (!m_shutdownThread)
                //{
                //    CrawlingManager.StateType stateType = m_crawlingManager.ReadFireSensorData(out strErrorMessage);

                //    if (stateType == CrawlingManager.StateType.Error)
                //    {
                //        // 에러 로그 기록
                //        Logger.Instance.Write("ReadFireSensorData 오류 " + strErrorMessage);
                //        Thread.Sleep(5000);
                //        break;
                //    }
                //    else if (stateType == CrawlingManager.StateType.Alarm)
                //    {   // 화재 발생
                //        m_bIsCurrentAlarm = true;
                //        Console.WriteLine("화재 발생!!");

                //        // 알람 신호 
                //        m_SignManager.SendFireAlarmOnOff(true);
                //    }
                //    else if (stateType == CrawlingManager.StateType.Normal && m_bIsCurrentAlarm == true)
                //    {   // 화재 종료 첫 신호
                //        m_bIsCurrentAlarm = false;
                //        Console.WriteLine("화재 종료");

                //        // 알람 종료 신호
                //        m_SignManager.SendFireAlarmOnOff(false);
                //    }

                //    // 센서 on 신호
                //    if (m_SignManager.UpdateFireSensorOnOFF(true, out strErrorMessage) == false)
                //    {
                //        // 에러 로그 기록
                //        Logger.Instance.Write("ReadFireSensorData 오류 " + strErrorMessage);
                //        Thread.Sleep(5000);
                //        break;
                //    }

                //    Thread.Sleep(300);
                //}

                // 지난 로그 삭제
                DateTime dtNow = DateTime.Now;
                if ((dtNow - m_dtLast).TotalDays >= 1)
                {
                    Logger.Instance.RemoveOldLogs();
                    m_dtLast = DateTime.Now;
                }

                CrawlingManager.StateType stateType = m_crawlingManager.ReadFireSensor(out strErrorMessage);

                if (stateType == CrawlingManager.StateType.Error)
                {
                    // 에러 로그 기록
                    Logger.Instance.Write("ConnectVitconSite 오류 " + strErrorMessage);
                    Thread.Sleep(5000);
                    continue;
                }
                else if (stateType == CrawlingManager.StateType.Alarm)
                {   // 화재 발생
                    m_bIsCurrentAlarm = true;
                    Console.WriteLine("화재 발생!!");

                    // 알람 신호 
                    m_SignManager.SendFireAlarmOnOff(true);
                }
                else if (stateType == CrawlingManager.StateType.Normal && m_bIsCurrentAlarm == true)
                {   // 화재 종료 첫 신호
                    m_bIsCurrentAlarm = false;
                    Console.WriteLine("화재 종료");

                    // 알람 종료 신호
                    m_SignManager.SendFireAlarmOnOff(false);
                }
            }
        }

        private void IPCameraReadThread()
        {
            string strErrorMessage = null;
            bool bOnOff = false;

            while (!m_shutdownThread)
            {
                m_SignManager.CheckIPCamera(out bOnOff, out strErrorMessage);

                if (bOnOff == true)
                {
                    if (m_SignManager.UpdateIPCameraOnOFF(bOnOff, out strErrorMessage) == false)
                    {
                        Logger.Instance.Write("IPCameraReadThread 오류 " + strErrorMessage);
                        Thread.Sleep(5000);
                        break;
                    }
                }
                else
                {
                    if (m_SignManager.UpdateIPCameraOnOFF(bOnOff, out strErrorMessage) == false)
                    {
                        Logger.Instance.Write("IPCameraReadThread 오류 " + strErrorMessage);
                        Thread.Sleep(5000);
                        break;
                    }
                }

                Thread.Sleep(3000);
            }
        }

        protected override void OnStop()
        {
            // TODO: 서비스를 중지하는 데 필요한 작업을 수행하는 코드를 여기에 추가합니다.
            Shutdown();
            m_crawlingManager.Quit();
        }
    }
}
