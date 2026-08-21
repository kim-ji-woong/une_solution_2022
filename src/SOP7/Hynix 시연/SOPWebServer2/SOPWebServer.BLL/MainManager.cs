using AgentFactory.BLL;
using System.Collections.Generic;

namespace SOPWebServer.BLL
{
    using Models;
    using Response;

    public class MainManager
    {        
        private SDMS.IDAL.IDataManager m_sdmsDataManager = null;
        private Common.IDAL.IDataManager m_commonDataManager = null;
        private TeamEditor.IDAL.IDataManager m_teamDataManager = null;
        private Hynix.IDAL.IDataManager m_hynixDataManager = null;
        private WorkerManager m_workerManager = null;

        private SopManager m_sopManager = null;
        private Process.MemberManager m_memberManager = null;
        private SensorManager m_sensorManager = null;
        private IAlarmManager m_alarmManager = null;
        private BaseBroadcastManager m_broadcastManager = null;
        private BaseProcessManager m_processManager = null;
        private BaseSMSManager m_smsManager = null;
        private BaseEmailManager m_emailManager = null;

        private static MainManager m_mainManager = null;

        public SDMS.IDAL.IDataManager SDMSDataManager
        {
            get { return m_sdmsDataManager; }
            set { m_sdmsDataManager = value; }
        }

        public Common.IDAL.IDataManager CommonDataManager
        {
            get { return m_commonDataManager; }
            set { m_commonDataManager = value; }
        }

        public TeamEditor.IDAL.IDataManager TeamDataManager
        {
            get { return m_teamDataManager; }
            set { m_teamDataManager = value; }
        }

        public Hynix.IDAL.IDataManager HynixDataManager
        {
            get { return m_hynixDataManager; }
            set { m_hynixDataManager = value; }
        }

        public Process.MemberManager MemberManager
        {
            get { return m_memberManager; }
        }

        public IAlarmManager AlarmManager
        {
            get { return m_alarmManager; }
        }

        public BaseProcessManager ProcessManager
        {
            get { return m_processManager; }
        }

        public SensorManager SensorManager
        {
            get { return m_sensorManager; }
        }

        public SopManager SopManager
        {
            get { return m_sopManager; }
        }

        public WorkerManager WorkerManager
        {
            get { return m_workerManager; }
        }

        private MainManager(SDMS.IDAL.IDataManager sdmsDataManager, Common.IDAL.IDataManager commonDataManager, TeamEditor.IDAL.IDataManager teamDataManager, Hynix.IDAL.IDataManager hynixDataManager)
        {
            m_sdmsDataManager = sdmsDataManager;
            m_commonDataManager = commonDataManager;
            m_teamDataManager = teamDataManager;
            m_hynixDataManager = hynixDataManager;

            m_memberManager = new Process.MemberManager(this);
            m_memberManager.Initialize();

            Factory factory = BaseFactory.GetFactory();

            m_smsManager = new Process.SMSManager(factory, this);
            m_emailManager = new Process.EmailManager(factory, this);
            m_broadcastManager = new Process.BroadcastManager(factory, this);
            m_sensorManager = new SensorManager(this, factory);
            m_sensorManager.Initialize();

            m_alarmManager = new Process.AlarmManager(this, m_sensorManager);
            m_processManager = new Process.ProcessManager(factory, this);

            m_sensorManager.OnLoad();

            m_workerManager = new WorkerManager(this);

            m_sopManager = new SopManager(this, factory);
        }

        public static MainManager GetMainManager(SDMS.IDAL.IDataManager sdmsDataManager, Common.IDAL.IDataManager commonDataManager, TeamEditor.IDAL.IDataManager teamDataManager, Hynix.IDAL.IDataManager hynixDataManager)
        {
            if (m_mainManager == null)
            {
                m_mainManager = new MainManager(sdmsDataManager, commonDataManager, teamDataManager, hynixDataManager);
            }

            return m_mainManager;
        }

        // alarm과 같은 SensorZone을 공유하는 중복된 알람이 존재하는지 확인한다.
        public List<AlarmData> CheckDuplicateAlarms(AlarmData alarm)
        {
            List<AlarmData> alarms = new List<AlarmData>();
            alarms.Add(alarm);

            if (alarm != null)
            {
                foreach (AlarmData _alarm in m_alarmManager.CurrentAlarms)
                {
                    if (_alarm.SensorZoneID == alarm.SensorZoneID)
                        alarms.Add(_alarm);
                }
            }

            return alarms;
        }

        public Result ReloadAlarms()
        {
            ((SOPWebServer.BLL.Process.AlarmManager)m_alarmManager).ReloadAlarms(m_sdmsDataManager);
            return new Result(true);
        }
    }
}
