using System.Collections.Generic;
using GGH.Model.Equipment;

namespace GGH.BLL.Models.Response
{
    public class ResponseEquipmentList : MessageResult
    {
        private List<FirstAidEquipment> m_safetyEquipments = new List<FirstAidEquipment>();
        private List<FirstAidEquipment> m_descendingLifeLines = new List<FirstAidEquipment>();
        private List<FirstAidEquipment> m_cardiacs = new List<FirstAidEquipment>();
        private int m_nTotalCount = 0;

        public List<FirstAidEquipment> SafetyEquipments
        {
            get { return m_safetyEquipments; }
            set { m_safetyEquipments = value; }
        }

        public List<FirstAidEquipment> DescendingLifeLines
        {
            get { return m_descendingLifeLines; }
            set { m_descendingLifeLines = value; }
        }

        public List<FirstAidEquipment> Cardiacs
        {
            get { return m_cardiacs; }
            set { m_cardiacs = value; }
        }

        public int TotalCount
        {
            get { return m_nTotalCount; }
            set { m_nTotalCount = value; }
        }

        public ResponseEquipmentList()
            : base()
        {
        }

        public ResponseEquipmentList(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseFirstAidEquipment : MessageResult
    {
        private FirstAidEquipment m_equipment = null;

        public FirstAidEquipment Equipment
        {
            get { return m_equipment; }
            set { m_equipment = value; }
        }

        public ResponseFirstAidEquipment()
            : base()
        {
        }

        public ResponseFirstAidEquipment(bool success, string message)
            : base(success, message)
        {
        }
    }
}
