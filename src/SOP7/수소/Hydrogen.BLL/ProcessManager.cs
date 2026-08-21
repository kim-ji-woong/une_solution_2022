using SDMS.IDAL;
using System;

namespace Hydrogen.BLL
{
    public class ProcessManager
    {
        private IDataManager m_dataManager = null;
        private SOPManager.IDAL.IDataManager m_sopDataManager = null;
        private Common.IDAL.IDataManager m_commonDataManager = null;
        private Hydrogen.IDAL.IDataManager m_hyDataManager = null;

        public ProcessManager(IDataManager dataManager, SOPManager.IDAL.IDataManager sopDataManager, Common.IDAL.IDataManager commonDataManager, Hydrogen.IDAL.IDataManager hyDataManager)
        {
            m_dataManager = dataManager;
            m_sopDataManager = sopDataManager;
            m_commonDataManager = commonDataManager;
            m_hyDataManager = hyDataManager;
        }

        public SensorManager SensorManager
        {
            get { return new SensorManager(m_dataManager); }
        }

        public AccountManager AccountManager
        {
            get { return new AccountManager(m_sopDataManager); }
        }

        public LoadManager LoadManager
        {
            get { return new LoadManager(m_dataManager, m_sopDataManager, m_commonDataManager, m_hyDataManager); }
        }

        public LinkManager LinkManager
        {
            get { return new LinkManager(m_dataManager, m_hyDataManager); }
        }
    }
}
