using SDMS.IBLL;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace SDMS.BLL
{
    public class ProcessManager : IProcessManager
    {
        private ISensorManager m_sensorManager = null;
        
        public ISensorManager SensorManager
        {
            get { return m_sensorManager; }
        }

        public ProcessManager(IDataManager dataManager, SOP.IBLL.ISopManager sopManager)
        {
            m_sensorManager = new SensorManager(dataManager, sopManager);
        }
    }
}
