using IntegrationServer.Datas;
using IntegrationServer.Managers;
using IntegrationServer.Servers;
using System;
using System.Collections.Generic;
using System.Text;
using static AgentFactory.BLL.ServerType;

namespace IntegrationServer
{
    public class Service
    {
        private ServerManager m_serverManager = null;
        private SettingManager m_settingManager = null;
        private ServerSetting m_serverSetting = null;
        public Service()
        {
                        
        }

        private void LoadSetting()
        {
            if (m_settingManager == null)
                m_settingManager = new SettingManager();

            m_serverSetting = m_settingManager.LoadSetting();
            if (m_serverSetting == null)
            {
                Logger.Instance.Write(LogTypes.Error, ServerTypes.None, -1, "LoadSetting");
                return;
            }

            int nCount = m_serverSetting == null || m_serverSetting.ServerDatas == null ? 0 : m_serverSetting.ServerDatas.Count;
            Logger.Instance.Write(LogTypes.Info, ServerTypes.None, -1, "LoadSetting : " + nCount);
        }

        public bool Start()
        {
            LoadSetting();
            if (m_serverSetting == null)
                return false;

            m_serverManager = new ServerManager(m_serverSetting);
            if (!m_serverManager.BeginServer())
                return false;

            Logger.Instance.Write(LogTypes.Info, ServerTypes.None, -1, "Start Server");

            return true;
        }

        public void Stop()
        {
            if (m_serverManager != null)
                m_serverManager.StopServer();

            Logger.Instance.Write(LogTypes.Info, ServerTypes.None, -1, "Stop Server");
        }
    }
}
