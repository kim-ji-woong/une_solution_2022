using System.Collections.Generic;

namespace Nipa.BLL.Models.Response.SDMS
{
    public class ResponseAlarmData : MessageResult
    {
        private List<AlarmData> m_alarmDatasFire = new List<AlarmData>();
        private List<AlarmData> m_alarmDatasSmell = new List<AlarmData>();
        private List<AlarmData> m_alarmDatasGas = new List<AlarmData>();
        private List<AlarmData> m_alarmDatasEmergencyBell = new List<AlarmData>();
        private List<AlarmData> m_alarmDatasThermalCamera = new List<AlarmData>();
        private List<AlarmData> m_alarmDatasWorkerTag = new List<AlarmData>();
        private List<AlarmData> m_alarmDatasEquipment = new List<AlarmData>();
        private List<AlarmData> m_allAlarms = new List<AlarmData>();

        public List<AlarmData> FireAlarmDatas
        {
            get { return m_alarmDatasFire; }
            set { m_alarmDatasFire = value; }
        }

        public List<AlarmData> SmellAlarmDatas
        {
            get { return m_alarmDatasSmell; }
            set { m_alarmDatasSmell = value; }
        }

        public List<AlarmData> GasAlarmDatas
        {
            get { return m_alarmDatasGas; }
            set { m_alarmDatasGas = value; }
        }

        public List<AlarmData> EmergencyBellAlarmDatas
        {
            get { return m_alarmDatasEmergencyBell; }
            set { m_alarmDatasEmergencyBell = value; }
        }

        public List<AlarmData> ThermalCameraAlarmDatas
        {
            get { return m_alarmDatasThermalCamera; }
            set { m_alarmDatasThermalCamera = value; }
        }

        public List<AlarmData> WorkerTagAlarmDatas
        {
            get { return m_alarmDatasWorkerTag; }
            set { m_alarmDatasWorkerTag = value; }
        }

        public List<AlarmData> EquipmentAlarmDatas
        {
            get { return m_alarmDatasEquipment; }
            set { m_alarmDatasEquipment = value; }
        }
        
        public List<AlarmData> AllAlarmDatas
        {
            get { return m_allAlarms; }
            set { m_allAlarms = value; }
        }

        public ResponseAlarmData()
        {
        }

        public ResponseAlarmData(bool success, string message)
            : base(success, message)
        {
        }
    }
}
