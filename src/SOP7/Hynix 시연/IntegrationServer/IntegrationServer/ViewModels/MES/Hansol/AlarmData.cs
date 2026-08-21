using Nipa.Model.Mes.Equipment;

namespace IntegrationServer.ViewModels.MES.Hansol
{
    public class AlarmData
    {
        private SensorZoneTagMaterial m_sensorZoneTag = null;
        private bool m_isAlarm = false;
        private string m_strAlarmType = "";
        private Data m_equipmentData = null;
        private string m_strImagePath = null;

        public SensorZoneTagMaterial SensorZoneTag
        {
            get { return m_sensorZoneTag; }
            set { m_sensorZoneTag = value; }
        }

        public bool IsAlarm
        {
            get { return m_isAlarm; }
            set { m_isAlarm = value; }
        }

        public string AlarmType
        {
            get { return m_strAlarmType; }
            set { m_strAlarmType = value; }
        }

        public Data EquipmentData
        {
            get { return m_equipmentData; }
            set { m_equipmentData = value; }
        }

        public string ImagePath
        {
            get { return m_strImagePath; }
            set { m_strImagePath = value; }
        }
    }
}
