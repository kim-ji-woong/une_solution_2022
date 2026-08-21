using System;
using System.Collections.Generic;
using System.Text;

namespace SOPAlone.BLL
{
    public class ProcessManager
    {
        private SOPAlone.IDAL.IDataManager m_dataManager = null;
        private Common.IDAL.IDataManager m_commonDataManager = null;
        private SOPManager.IDAL.IDataManager m_sopDataManager = null;
        private TeamEditor.IDAL.IDataManager m_teamDataManager = null;
        private SOPSimulator.IDAL.IDataManager m_sopSimulatorDataManager = null;

        private Spatial.SpatailManager m_spatialManager = null;
        private Sensor.SensorManager m_sensorManager = null;
        private Config.ConfigManager m_configManager = null;

        public SOPAlone.IDAL.IDataManager DataManager
        {
            get { return m_dataManager; }
            set { m_dataManager = value; }
        }
        public Common.IDAL.IDataManager CommonDataManager
        {
            get { return m_commonDataManager; }
            set { m_commonDataManager = value; }
        }
        public SOPManager.IDAL.IDataManager SopDataManager
        {
            get { return m_sopDataManager; }
            set { m_sopDataManager = value; }
        }
        public TeamEditor.IDAL.IDataManager TeamDataManager
        {
            get { return m_teamDataManager; }
            set { m_teamDataManager = value; }
        }
        public SOPSimulator.IDAL.IDataManager SopSimulatorDataManager
        {
            get { return m_sopSimulatorDataManager; }
            set { m_sopSimulatorDataManager = value; }
        }

        public Spatial.SpatailManager SpatailManager
        {
            get { return m_spatialManager; }
            set { m_spatialManager = value; }
        }
        public Sensor.SensorManager SensorManager
        {
            get { return m_sensorManager; }
            set { m_sensorManager = value; }
        }
        public Config.ConfigManager ConfigManager
        {
            get { return m_configManager; }
            set { m_configManager = value; }
        }

        public ProcessManager(IDAL.IDataManager dataManager, Common.IDAL.IDataManager commonDataManager, SOPManager.IDAL.IDataManager sopDataManager, TeamEditor.IDAL.IDataManager teamDataManager, SOPSimulator.IDAL.IDataManager sopSimulatorDataManager)
        {
            m_dataManager = dataManager;
            m_commonDataManager = commonDataManager;
            m_sopDataManager = sopDataManager;
            m_teamDataManager = teamDataManager;
            m_sopSimulatorDataManager = sopSimulatorDataManager;

            m_spatialManager = new Spatial.SpatailManager(dataManager, this);
            m_sensorManager = new Sensor.SensorManager(dataManager, this);
            m_configManager = new Config.ConfigManager(dataManager, this);
        }
    }
}
