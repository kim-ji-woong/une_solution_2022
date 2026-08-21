using System.Collections.Generic;

namespace SysWillAlarm
{
    public class Service
    {
        private const int AlarmCount = 10;
        private List<AlarmManager> m_alarmManagers = new List<AlarmManager>();
        private bool m_processing = false;

        public Service(List<ConfigData> configDatas, string strBaseLogFolder)
        {
            foreach (ConfigData configData in configDatas)
            {
                AlarmManager alarmManager = new AlarmManager(configData, strBaseLogFolder);
                m_alarmManagers.Add(alarmManager);
            }
        }

        public void Run()
        {
            if (m_processing)
                return;

            m_processing = true;

            foreach (AlarmManager alarmManager in m_alarmManagers)
            {
                alarmManager.ReadAlarms(AlarmCount);
            }

            m_processing = false;
        }
    }
}
