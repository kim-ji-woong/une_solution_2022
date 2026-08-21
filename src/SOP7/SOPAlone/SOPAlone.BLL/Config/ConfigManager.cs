using SOPAlone.IDAL;

namespace SOPAlone.BLL.Config
{
    public class ConfigManager
    {
        private IDataManager m_dataManager = null;
        private ProcessManager m_processManager = null;

        public ConfigManager(IDataManager manager, ProcessManager processManager)
        {
            m_dataManager = manager;
            m_processManager = processManager;
        }
    }
}
