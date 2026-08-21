namespace EDMS.BLL
{
    using IDAL;

    public class ProcessManager
    {
        private LoadManager m_loadManager = null;

        public LoadManager LoadManager
        {
            get { return m_loadManager; }
        }

        public ProcessManager(IDataManager dataManager)
        {
            m_loadManager = new LoadManager(dataManager);
        }
    }
}
