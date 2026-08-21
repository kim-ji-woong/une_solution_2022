using SOP.IBLL;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace SOP.BLL
{
    public class ProcessManager : IProcessManager
    {
        private SopManager m_sopManager = null;

        public ProcessManager(IDataManager dataManager)
        {
            m_sopManager = new SopManager(dataManager);
        }

        public ISopManager SopManager
        {
            get { return m_sopManager; }
        }
    }
}
