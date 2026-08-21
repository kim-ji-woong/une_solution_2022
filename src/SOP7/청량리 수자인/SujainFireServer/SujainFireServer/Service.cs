using SujainFireServer.Data;
using SujainFireServer.Network;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;

namespace SujainFireServer
{
    partial class Service : ServiceBase
    {
        private WebDataManager m_dataManager = null;
        private ExternalManager m_externalManager = null;
        private NetworkManager m_NetworkManager = null;

        public Service()
        {
            InitializeComponent();
        }

        protected override void OnStart(string[] args)
        {
            // TODO: 여기에 서비스를 시작하는 코드를 추가합니다.
            m_dataManager = new WebDataManager();
            m_externalManager = new ExternalManager();

            m_NetworkManager = new NetworkManager(m_dataManager, m_externalManager);
        }

        protected override void OnStop()
        {
            // TODO: 서비스를 중지하는 데 필요한 작업을 수행하는 코드를 여기에 추가합니다.
        }
    }
}
