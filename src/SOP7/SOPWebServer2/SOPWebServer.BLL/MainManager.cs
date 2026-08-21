using AgentFactory.BLL;
using System.Collections.Generic;
using dnsData.Alarm;

namespace SOPWebServer.BLL
{
    using Response;

    public class MainManager
    {        
        private SDMS.IDAL.IDataManager m_sdmsDataManager = null;
        private Common.IDAL.IDataManager m_commonDataManager = null;
        private TeamEditor.IDAL.IDataManager m_teamDataManager = null;

        private SopManager m_sopManager = null;
        private Process.MemberManager m_memberManager = null;
        private SensorManager m_sensorManager = null;
        private IAlarmManager m_alarmManager = null;
        private BaseBroadcastManager m_broadcastManager = null;
        private BaseProcessManager m_processManager = null;
        private BaseSMSManager m_smsManager = null;
        private BaseEmailManager m_emailManager = null;

        // 기동 직후 요청이 동시에 들어와도 MainManager가 두 번 생성되지 않도록 잠금을 건다.
        // (초기화가 무겁기 때문에 중복 생성되면 기동이 느려지고 인스턴스별로 캐시가 갈린다)
        private static volatile MainManager m_mainManager = null;
        private static readonly object m_lockCreateMainManager = new object();

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

        private MainManager(SDMS.IDAL.IDataManager sdmsDataManager, Common.IDAL.IDataManager commonDataManager, TeamEditor.IDAL.IDataManager teamDataManager)
        {
            m_sdmsDataManager = sdmsDataManager;
            m_commonDataManager = commonDataManager;
            m_teamDataManager = teamDataManager;

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

            m_sopManager = new SopManager(this, factory);
        }

        public static MainManager GetMainManager(SDMS.IDAL.IDataManager sdmsDataManager, Common.IDAL.IDataManager commonDataManager, TeamEditor.IDAL.IDataManager teamDataManager)
        {
            // 이미 만들어져 있으면 잠금 없이 바로 돌려준다. (대부분의 요청이 이 경로)
            if (m_mainManager != null)
                return m_mainManager;

            lock (m_lockCreateMainManager)
            {
                // 잠금을 기다리는 동안 다른 요청이 이미 만들었을 수 있으므로 다시 확인한다.
                if (m_mainManager == null)
                {
                    // 생성자에서 예외가 나면 대입되지 않아 다음 요청이 다시 시도한다. (기존 동작 유지)
                    m_mainManager = new MainManager(sdmsDataManager, commonDataManager, teamDataManager);
                }
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
