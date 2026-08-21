using BusanTP.BLL.Models.Request;
using BusanTP.BLL.Models.Response;
using SDMS.BLL;
using SOPSimulator;

namespace BusanTP.BLL
{
    public enum DataMode { None = 0 , SensorInfo = 1 };
    
    public class ProcessManager
    {
        private SensorManager m_sensorManager = null;
        private OptionManager m_optionManager = null;
        private LoadManager m_loadManager = null;
        
        private SOPManager.IDAL.IDataManager m_sopDataManager = null;
        private Common.IDAL.IDataManager m_commonDataManager = null;
        private SDMS.IDAL.IDataManager m_sdmsDataManager = null;
        private TeamEditor.IDAL.IDataManager m_teamDataManager = null;
        
        public SensorManager SensorManager
        {
            get { return m_sensorManager; }
        }
        
        public OptionManager OptionManager
        {
            get { return m_optionManager; }
        }

        public LoadManager LoadManager
        {
            get { return m_loadManager; }
        }
        
        public SOPManager.IDAL.IDataManager SopDataManager
        {
            get { return m_sopDataManager; }
        }
        
        
        public ProcessManager(SDMS.IDAL.IDataManager dataManager, Common.IDAL.IDataManager commonDataManager, BusanTP.IDAL.IDataManager sensorServerDataManager, TeamEditor.IDAL.IDataManager teamDataManager, SOPManager.IDAL.IDataManager sopDataManager)
        {
            m_sensorManager = new SensorManager(dataManager, sensorServerDataManager, commonDataManager, teamDataManager);
            m_optionManager = new OptionManager(this, sensorServerDataManager, dataManager);
            m_loadManager = new LoadManager(sensorServerDataManager, dataManager);
            
            m_commonDataManager = commonDataManager;
            m_sdmsDataManager = dataManager;
            m_sopDataManager = sopDataManager;
            m_teamDataManager = teamDataManager;
        }
        
        public SensorManager GetSensorManager()
        {
            return m_sensorManager;
        }
        
        public OptionManager GetOptionManager()
        {
            return m_optionManager;
        }
        
        public LoadManager GetLoadManager()
        {
            return m_loadManager;
        }
        
    }
}