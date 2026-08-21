using Nipa.Model.Mes.Equipment;

namespace Nipa.BLL.Models
{
    public class MesEquipmentData
    {
        private Equipment m_equipment = null;
        private Data m_data = null;

        public Equipment Equipment
        {
            get { return m_equipment; }
            set { m_equipment = value; }
        }

        public Data Data
        {
            get { return m_data; }
            set { m_data = value; }
        }
    }

    public class MesEquipmentDataEx : MesEquipmentData
    {
        private string m_strAlarmType = "";
        private string m_strImagePath = null;

        public string AlarmType
        {
            get { return m_strAlarmType; }
            set { m_strAlarmType = value; }
        }

        public string ImagePath
        {
            get { return m_strImagePath; }
            set { m_strImagePath = value; }
        }
    }
}
