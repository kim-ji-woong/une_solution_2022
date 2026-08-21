using System;
using System.ServiceProcess;

namespace WonikLPR
{
    /// <summary>
    /// Windows Service 진입 (SERVICE 정의시 사용).
    /// </summary>
    partial class WonikLPRService : ServiceBase
    {
        private ProcessManager m_processManager = null;

        public WonikLPRService()
        {
            InitializeComponent();

            m_processManager = new ProcessManager();
        }

        protected override void OnStart(string[] args)
        {
            m_processManager.Start();
        }

        protected override void OnStop()
        {
            m_processManager.Stop();
        }
    }
}
