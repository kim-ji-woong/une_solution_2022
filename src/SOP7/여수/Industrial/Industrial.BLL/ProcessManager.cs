using SOPSimulator.BLL;
using System.Collections.Generic;
using TeamEditor.Model.Sop.Team;

namespace Industrial.BLL
{

    public enum DataMode { None = 0 , SensorInfo = 1 };

    public class ProcessManager
    {
        private SensorManager m_sensorManager = null;
        private OptionManager m_optionManager = null;
        private SMSManager m_smsManager = null;

        public SensorManager SensorManager
        {
            get { return m_sensorManager; }
        }

        public OptionManager OptionManager
        {
            get { return m_optionManager; }
        }

        public SMSManager SMSManager
        {
            get { return m_smsManager; }
        }

        public ProcessManager(SDMS.IDAL.IDataManager dataManager, Common.IDAL.IDataManager commonDataManager, SensorServer.IDAL.IDataManager sensorServerDataManager, TeamEditor.IDAL.IDataManager teamDataManager)
        {
            m_sensorManager = new SensorManager(dataManager, sensorServerDataManager, commonDataManager, teamDataManager);
            m_optionManager = new OptionManager(commonDataManager);
        }

    }
}
