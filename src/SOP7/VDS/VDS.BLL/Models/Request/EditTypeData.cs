using System.Collections.Generic;
using VDS.Model;

namespace VDS.BLL.Models.Request
{
    public class EditTypeData
    {
        private List<RackType> m_updateRackTypes = new List<RackType>();
        private List<ItemType> m_updateItemTypes = new List<ItemType>();
        private List<FacilityType> m_updateFacilityTypes = new List<FacilityType>();

        public List<RackType> UpdateRackTypes
        {
            get { return m_updateRackTypes; }
            set { m_updateRackTypes = value; }
        }

        public List<ItemType> UpdateItemTypes
        {
            get { return m_updateItemTypes; }
            set { m_updateItemTypes = value; }
        }

        public List<FacilityType> UpdateFacilityTypes
        {
            get { return m_updateFacilityTypes; }
            set { m_updateFacilityTypes = value; }
        }
    }
}
