using System;
using System.Threading;
using System.Windows.Forms;
using BusanSensorServer.Managers;
using dnsCommunicateSopServer;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using Microsoft.Extensions.Configuration;

namespace BusanSensorServer
{
    public class ProcessManager
    {
        private DataManager m_dataManager = null;
        private DataManager m_externalDataManager = null;
        
        private SopQueryManager m_sopQueryManager = null;

        private bool m_isRunning = false;

        // 에러시 슬립 주기
        private int m_nErrorSleep = 1000 * 60;
        
        // 센서 업데이트 및 히스토리 쌓는 주기
        private int m_nThreadSleep = 1000 * 5;
        
        private SensorManager m_sensorManager = null;
        
        private AlarmManager m_alarmManager = null;
        
        private Logger m_logger = null;

        private string SOPWebServerURL;
        
        Thread m_thread = null;
        Thread m_testThread = null;
        
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
            var siteConfig = new Config.Site();
            configuration.GetSection("Site").Bind(siteConfig);
            
            m_dataManager = new DataManager(siteConfig.DBType, siteConfig.DBHost, siteConfig.DBName, siteConfig.DBID, siteConfig.DBPw);
            m_externalDataManager = new DataManager(siteConfig.ExternalDBType, siteConfig.ExternalDBHost, siteConfig.ExternalDBName, siteConfig.ExternalDBID, siteConfig.ExternalDBPW);
            
            SOPWebServerURL = siteConfig.SOPWebServerURL;
            
            m_alarmManager = new AlarmManager(m_dataManager, SOPWebServerURL);
            
            m_sopQueryManager = new SopQueryManager();
            
            m_logger = Logger.Instance;
            
            m_sensorManager = new SensorManager(m_dataManager, m_externalDataManager, m_sopQueryManager, m_alarmManager);
            
            m_logger.Write("Init Program");
        }

        public void Start()
        {
            string strErrorMessage;

            if (m_dataManager == null)
            {
                strErrorMessage = "DataManager is null";
                m_logger.Write(strErrorMessage);
            }
            
            if (m_externalDataManager == null)
            {
                strErrorMessage = "ExternalDataManager is null";
                m_logger.Write(strErrorMessage);
            }

            if (!m_isRunning)
            {
                m_isRunning = true;

                m_thread = new Thread(() => ThreadFunc());
                m_thread.Start();
                
            }
            
        }
        
        public void ThreadFunc()
        {
            string strErrorMessage;

            while (m_isRunning)
            {
                if (!m_sensorManager.EntireProcess(out strErrorMessage))
                {
                    m_logger.Write("EntireProcess is failed : " + strErrorMessage);
                    
                    Thread.Sleep(m_nErrorSleep);
                    Console.Write("Thread Sleep With Error : " + strErrorMessage);
                    
                }
                
                Thread.Sleep(m_nThreadSleep);
                Console.Write("Thread Sleep : " + m_nThreadSleep);
            }
        }

        public void Stop()
        {
            m_logger.Write("ProcessManager Stop , Thread Stop");
            
            m_isRunning = false;
        }
    }
}