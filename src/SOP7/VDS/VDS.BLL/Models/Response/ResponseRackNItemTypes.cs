using System.Collections.Generic;
using VDS.Model;

namespace VDS.BLL.Models.Response
{
    public class ResponseRackNItemTypes : MessageResult
    {
        private List<RackTypeEx> m_rackTypes = new List<RackTypeEx>();
        private List<ItemTypeEx> m_itemTypes = new List<ItemTypeEx>();
        private List<FacilityTypeEx> m_facilityTypes = new List<FacilityTypeEx>();

        public List<RackTypeEx> RackTypes
        {
            get { return m_rackTypes; }
            set { m_rackTypes = value; }
        }

        public List<ItemTypeEx> ItemTypes
        {
            get { return m_itemTypes; }
            set { m_itemTypes = value; }
        }

        public List<FacilityTypeEx> FacilityTypes
        {
            get { return m_facilityTypes; }
            set { m_facilityTypes = value; }
        }

        public ResponseRackNItemTypes()
            : base()
        {
        }

        public ResponseRackNItemTypes(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class FacilityTypeEx : FacilityType
    {
        private EquipmentType m_equipmentType = null;
        private Company m_company = null;

        public EquipmentType EquipmentType
        {
            get { return m_equipmentType; }
            set { m_equipmentType = value; }
        }

        public Company Company
        {
            get { return m_company; }
            set { m_company = value; }
        }

        public FacilityTypeEx()
        {
        }

        public FacilityTypeEx(FacilityType facilityType)
        {
            this.ID = facilityType.ID;
            this.ClassName = facilityType.ClassName;
            this.Color = facilityType.Color;
            this.CompanyID = facilityType.CompanyID;
            this.Depth = facilityType.Depth;
            this.EquipmentTypeID = facilityType.EquipmentTypeID;
            this.FbxUrl = facilityType.FbxUrl;
            this.GlbUrl = facilityType.GlbUrl;
            this.Height = facilityType.Height;
            this.ImageUrl = facilityType.ImageUrl;
            this.Memo = facilityType.Memo;
            this.ModelName = facilityType.ModelName;
            this.UnitOfLength = facilityType.UnitOfLength;
            this.Width = facilityType.Width;
            this.RegDate = facilityType.RegDate;
            this.ChangeDate = facilityType.ChangeDate;
        }
    }
}
