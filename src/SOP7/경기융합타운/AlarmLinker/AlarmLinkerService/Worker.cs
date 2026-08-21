using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System.Threading;
using System.Threading.Tasks;
using AlarmLinker;

namespace AlarmLinkerService
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private static IConfiguration m_configuration = null;

        private Service m_service = null;
        private System.Timers.Timer m_timer = null;

        public static IConfiguration Configuration
        {
            set { m_configuration = value; }
        }

        public Worker(ILogger<Worker> logger)
        {
            _logger = logger;

            //ReadConfig();
        }

        public override Task StartAsync(CancellationToken cancellationToken)
        {
            if (m_timer == null)
            {
                m_timer = new System.Timers.Timer(1000);
                m_timer.Elapsed += OnTimer;
                m_timer.Start();
            }
            
            return base.StartAsync(cancellationToken);
        }

        private void OnTimer(object sender, System.Timers.ElapsedEventArgs e)
        {
            if (m_service != null)
            {
                /*m_service.Run();
                m_service.UpdateElevator();
                m_service.UpdateEarthquakeHistory();*/
            }
        }

        public override Task StopAsync(CancellationToken cancellationToken)
        {
            if (m_timer != null)
            {
                m_timer.Stop();
                m_timer = null;
            }

            return base.StopAsync(cancellationToken);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
                await Task.Delay(1000, stoppingToken);
            }
        }

        private void ReadConfig()
        {
            string strOwnDB = m_configuration["Database:OwnDB"];
            string strExternalDB = m_configuration["Database:ExternalDB"];

            if (strOwnDB == null || strOwnDB.Trim().Length == 0 ||
                strExternalDB == null || strExternalDB.Trim().Length == 0)
                return;

            string strOwnDBInfo = m_configuration["Database:OwnDBInfo"];
            string strExternalDBInfo = m_configuration["Database:ExternalDBInfo"];

            if (strOwnDBInfo == null || strOwnDBInfo.Trim().Length == 0 ||
                strExternalDBInfo == null || strExternalDBInfo.Trim().Length == 0)
                return;

            IDataManager ownDBManager = Service.GetDataManager(strOwnDB, strOwnDBInfo);

            if (ownDBManager == null)
                return;

            List<IDataManager> externalDBManagers = new List<IDataManager>();

            string[] externalDBNames = strExternalDB.Split(';');
            string[] externalDBInfos = strExternalDBInfo.Split(';');

            int countName = externalDBNames.Length;
            int countInfo = externalDBInfos.Length;
            int min = countName < countInfo ? countName : countInfo;

            for (int i = 0; i < min; i++)
            {
                IDataManager dataManager = Service.GetDataManager(externalDBNames[i], externalDBInfos[i]);

                if (dataManager == null)
                    return;

                externalDBManagers.Add(dataManager);
            }

            m_service = new Service(ownDBManager, externalDBManagers);
        }
    }
}
