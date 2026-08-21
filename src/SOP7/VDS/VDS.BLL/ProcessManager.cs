using VDS.IDAL;

namespace VDS.BLL
{
    public class ProcessManager
    {
        private AccountManager m_accountManager = null;
        private LoadManager m_loadManager = null;
        private SaveManager m_saveManager = null;
        private ExcelManager m_excelManager = null;

        public AccountManager AccountManager
        {
            get { return m_accountManager; }
        }

        public LoadManager LoadManager
        {
            get { return m_loadManager; }
        }

        public SaveManager SaveManager
        {
            get { return m_saveManager; }
        }

        public ExcelManager ExcelManager
        {
            get { return m_excelManager; }
        }

        public ProcessManager(IDataManager dataManager)
        {
            m_accountManager = new AccountManager(dataManager, this);
            m_loadManager = new LoadManager(dataManager);
            m_saveManager = new SaveManager(this, dataManager);
            m_excelManager = new ExcelManager(dataManager);
        }
    }
}
