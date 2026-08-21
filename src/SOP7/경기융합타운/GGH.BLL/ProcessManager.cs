using GGH.IDAL;

namespace GGH.BLL
{
    public class ProcessManager
    {
        private CCTVManager m_cctvManager = null;
        private IDataManager m_dataManager = null;
        private SDMS.IDAL.IDataManager m_sdmsDataManager = null;
        private Common.IDAL.IDataManager m_commonDataManager = null;
        private SOPManager.IDAL.IDataManager m_sopDataManager = null;
        private TeamEditor.IDAL.IDataManager m_teamDataManager = null;

        public CCTVManager CCTVManager
        {
            get { return m_cctvManager; }
            set { m_cctvManager = value; }
        }

        public EvacuationManager EvacuationManager
        {
            get { return new EvacuationManager(m_dataManager); }
        }

        public ParkingManager ParkingManager
        {
            get { return new ParkingManager(m_dataManager, m_commonDataManager); }
        }

        public DoorManager DoorManager
        {
            get { return new DoorManager(m_sdmsDataManager); }
        }

        public ElectricPowerManager ElectricPowerManager
        {
            get { return new ElectricPowerManager(m_sdmsDataManager); }
        }

        public SensorManager SensorManager
        {
            get { return new SensorManager(m_sdmsDataManager, m_dataManager); }
        }

        public EarthquakeManager EarthquakeManager
        {
            get { return new EarthquakeManager(m_dataManager); }
        }

        public EquipmentManager EquipmentManager
        {
            get { return new EquipmentManager(m_dataManager); }
        }

        public ReportManager ReportManager
        {
            get { return new ReportManager(m_sdmsDataManager, m_commonDataManager); }
        }

        public OptionManager OptionManager
        {
            get { return new OptionManager(m_sdmsDataManager, m_commonDataManager, m_sopDataManager, m_teamDataManager); }
        }

        public ProcessManager(IDataManager dataManager, SDMS.IDAL.IDataManager sdmsDataManager, Common.IDAL.IDataManager commonDataManager, SOPManager.IDAL.IDataManager sopDataManager, TeamEditor.IDAL.IDataManager teamDataManager)
        {
            m_dataManager = dataManager;
            m_sdmsDataManager = sdmsDataManager;
            m_commonDataManager = commonDataManager;
            m_sopDataManager = sopDataManager;
            m_teamDataManager = teamDataManager;
            m_cctvManager = new CCTVManager(dataManager, sdmsDataManager, commonDataManager);
        }
    }
}
