using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace IntegrationService
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private static IConfiguration m_configuration = null;
        private System.Timers.Timer m_timer = null;

        private AlarmLinkerService m_alarmLinkerService = null;
        private SyswillAlarmService m_syswillAlarmService = null;
        private IntegrationServer.Service m_sensorService = null;
        private DbBackupService m_dbBackupService = null;

        public static IConfiguration Configuration
        {
            set { m_configuration = value; }
        }

        public Worker(ILogger<Worker> logger)
        {
            _logger = logger;

            bool useSensorService;
            m_alarmLinkerService = AlarmLinkerService.ReadConfig(m_configuration, out useSensorService);
            m_syswillAlarmService = SyswillAlarmService.ReadConfig(m_configuration);
            m_dbBackupService = DbBackupService.ReadConfig(m_configuration);

            if (useSensorService)
                m_sensorService = new IntegrationServer.Service();
        }

        public override Task StartAsync(CancellationToken cancellationToken)
        {
            if (m_sensorService != null)
                m_sensorService.Start();

            if (m_timer == null)
            {
                m_timer = new System.Timers.Timer(1000);
                m_timer.Elapsed += OnTimer;
                m_timer.Start();
            }

            return base.StartAsync(cancellationToken);
        }

        public override Task StopAsync(CancellationToken cancellationToken)
        {
            if (m_sensorService != null)
                m_sensorService.Stop();

            if (m_timer != null)
            {
                m_timer.Stop();
                m_timer = null;
            }

            return base.StopAsync(cancellationToken);
        }

        private void OnTimer(object sender, System.Timers.ElapsedEventArgs e)
        {
            if (m_alarmLinkerService != null)
            {
                m_alarmLinkerService.Run();
            }

            if (m_syswillAlarmService != null)
            {
                m_syswillAlarmService.Run();
            }

            if (m_dbBackupService != null)
            {
                m_dbBackupService.Run();
            }
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
                await Task.Delay(1000, stoppingToken);
            }
        }
    }
}
