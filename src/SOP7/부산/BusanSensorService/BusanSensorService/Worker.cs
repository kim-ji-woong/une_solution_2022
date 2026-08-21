using System;
using System.Threading;
using System.Threading.Tasks;
using BusanSensorServer;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace BusanSensorService
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        ProcessManager m_processManager = null;

        public Worker(ILogger<Worker> logger)
        {
            _logger = logger;
            m_processManager = new ProcessManager();
        }

        public override Task StartAsync(CancellationToken cancellationToken)
        {
            Logger.Instance.Write("StartAsync 실행");

            m_processManager.Start();
            return base.StartAsync(cancellationToken);
        }
        public override Task StopAsync(CancellationToken cancellationToken)
        {
            Logger.Instance.Write("StopAsync 실행");

            if (m_processManager != null)
                m_processManager.Stop();

            return base.StopAsync(cancellationToken);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            try
            {
                while (!stoppingToken.IsCancellationRequested)
                {
                    _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
                    await Task.Delay(1000, stoppingToken);
                }                
            }           
            catch (Exception ex)
            {
                Logger.Instance.Write("ExecuteAsync 에러: " + ex.Message);
            }
        }
    }
}