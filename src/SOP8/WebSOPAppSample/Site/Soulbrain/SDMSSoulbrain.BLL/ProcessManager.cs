using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace SDMSSoulbrain.BLL
{
    public class ProcessManager : SDMS.BLL.ProcessManager
    {
        private SensorManager2 m_sensorManager2 = null;

        public SensorManager2 SensorManager2
        {
            get { return m_sensorManager2; }
        }

        public ProcessManager(IDataManager dataManager, SOP.IBLL.ISopManager sopManager)
            : base(dataManager, sopManager)
        {
            m_sensorManager2 = new SensorManager2(dataManager, sopManager);
        }
    }
}
