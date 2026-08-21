using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Nipa.BLL
{
    public class ProcessManager
    {
        private IDataManager m_dataManager = null;
        private string m_strSopWebServerUrl = "";

        public string SOPWebServerURL
        {
            get { return m_strSopWebServerUrl; }
            set { m_strSopWebServerUrl = value; }
        }

        public AccountManager AccountManager
        {
            get
            {
                AccountManager accountManager = new AccountManager(m_dataManager, this);
                return accountManager;
            }
        }

        public WeatherManager WeatherManager
        {
            get
            {
                WeatherManager weatherManager = new WeatherManager(m_dataManager);
                return weatherManager;
            }
        }

        public SensorManager SensorManager
        {
            get
            {
                SensorManager sensorManager = new SensorManager(m_dataManager);
                return sensorManager;
            }
        }

        public SpatialManager SpatialManager
        {
            get
            {
                SpatialManager spatialManager = new SpatialManager(m_dataManager);
                return spatialManager;
            }
        }

        public AlarmManager AlarmManager
        {
            get
            {
                AlarmManager alarmManager = new AlarmManager(m_dataManager, m_strSopWebServerUrl);
                return alarmManager;
            }
        }

        public TeamManager TeamManager
        {
            get
            {
                TeamManager teamManager = new TeamManager(m_dataManager);
                return teamManager;
            }
        }

        public EquipmentManager EquipmentManager
        {
            get
            {
                EquipmentManager equipmentManager = new EquipmentManager(m_dataManager);
                return equipmentManager;
            }
        }

        public HistoryManager HistoryManager
        {
            get
            {
                HistoryManager historyManager = new HistoryManager(m_dataManager);
                return historyManager;
            }
        }

        public SettingsManager SettingsManager
        {
            get
            {
                SettingsManager settingsManager = new SettingsManager(m_dataManager);
                return settingsManager;
            }
        }

        public ProcessManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
            //m_accountManager = new AccountManager(dataManager, this);
        }

        public static bool IsEmpty<T>(IEnumerable<T> datas)
        {
            foreach (T data in datas)
            {
                return false;
            }

            return true;
        }

        public static bool FirstElement<T>(IEnumerable<T> datas, ref T target)
        {
            foreach (T data in datas)
            {
                target = data;
                return true;
            }

            return false;
        }
    }
}
