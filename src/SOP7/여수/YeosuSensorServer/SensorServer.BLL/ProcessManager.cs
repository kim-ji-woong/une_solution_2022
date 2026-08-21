namespace SensorServer.BLL
{
    public class ProcessManager
    {
        private SensorManager m_sensorManager = null;
        
        public SensorManager SensorManager
        {
            get { return m_sensorManager; }
        }

        public ProcessManager(SDMS.IDAL.IDataManager sdmsDataManager, SensorServer.IDAL.IDataManager dataManager, string strExternalDbHost, string strExternalDbName, string strExternalDbId, string strExternalDbPw)
        {
            m_sensorManager = new SensorManager(sdmsDataManager, dataManager, strExternalDbHost, strExternalDbName, strExternalDbId, strExternalDbPw);
        }
    }
}
