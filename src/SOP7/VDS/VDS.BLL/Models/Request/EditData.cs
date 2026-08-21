using System.Collections.Generic;
using VDS.Model;
using VDS.Model.Sensor;

namespace VDS.BLL.Models.Request
{
    public class UpdateEditData
    {
        private int m_nDataCenterID = -1;
        private List<LinkedIdData> m_removeLinkedItems = new List<LinkedIdData>();
        private List<LinkedIdData> m_addLinkedItems = new List<LinkedIdData>();
        private List<RackItems> m_addRackItems = new List<RackItems>();
        private List<RackItems> m_updateRackItems = new List<RackItems>();
        private List<RackItems> m_removeRackItems = new List<RackItems>();
        private List<Rack> m_addRacks = new List<Rack>();
        private List<Rack> m_removeRacks = new List<Rack>();
        private List<Rack> m_updateRacks = new List<Rack>();
        private List<RackGroup> m_addRackGroups = new List<RackGroup>();
        private List<Facility> m_addFacilities = new List<Facility>();
        private List<Facility> m_removeFacilities = new List<Facility>();
        private List<Facility> m_updateFacilities = new List<Facility>();
        private List<Sensor> m_addSensors = new List<Sensor>();
        private List<Sensor> m_removeSensors = new List<Sensor>();
        private List<Sensor> m_updateSensors = new List<Sensor>();

        public int DataCenterID
        {
            get { return m_nDataCenterID; }
            set { m_nDataCenterID = value; }
        }

        public List<LinkedIdData> RemoveLinkedItems
        {
            get { return m_removeLinkedItems; }
            set { m_removeLinkedItems = value; }
        }

        public List<LinkedIdData> AddLinkedItems
        {
            get { return m_addLinkedItems; }
            set { m_addLinkedItems = value; }
        }

        public List<RackItems> RemoveRackItems
        {
            get { return m_removeRackItems; }
            set { m_removeRackItems = value; }
        }

        public List<RackItems> AddRackItems
        {
            get { return m_addRackItems; }
            set { m_addRackItems = value; }
        }

        public List<RackItems> UpdateRackItems
        {
            get { return m_updateRackItems; }
            set { m_updateRackItems = value; }
        }

        public List<Rack> AddRacks
        {
            get { return m_addRacks; }
            set { m_addRacks = value; }
        }

        public List<Rack> RemoveRacks
        {
            get { return m_removeRacks; }
            set { m_removeRacks = value; }
        }

        public List<Rack> UpdateRacks
        {
            get { return m_updateRacks; }
            set { m_updateRacks = value; }
        }

        public List<RackGroup> AddRackGroups
        {
            get { return m_addRackGroups; }
            set { m_addRackGroups = value; }
        }

        public List<Facility> AddFacilities
        {
            get { return m_addFacilities; }
            set { m_addFacilities = value; }
        }

        public List<Facility> RemoveFacilities
        {
            get { return m_removeFacilities; }
            set { m_removeFacilities = value; }
        }

        public List<Facility> UpdateFacilities
        {
            get { return m_updateFacilities; }
            set { m_updateFacilities = value; }
        }

        public List<Sensor> AddSensors
        {
            get { return m_addSensors; }
            set { m_addSensors = value; }
        }

        public List<Sensor> RemoveSensors
        {
            get { return m_removeSensors; }
            set { m_removeSensors = value; }
        }

        public List<Sensor> UpdateSensors
        {
            get { return m_updateSensors; }
            set { m_updateSensors = value; }
        }
    }

    public class LinkedIdData
    {
        private int m_nID = -1;
        private List<int> m_linkedIDs = new List<int>();

        public int Id
        {
            get { return m_nID; }
            set { m_nID = value; }
        }

        public List<int> LinkedIDs
        {
            get { return m_linkedIDs; }
            set { m_linkedIDs = value; }
        }
    }

    public class RequestNewItem
    {
        private int m_nItemTypeID = -1;
        private int m_unitPosition = -1;
        private int m_nDataCenterID = -1;
        private int m_nRackID = -1;

        public int ItemTypeID
        {
            get { return m_nItemTypeID; }
            set { m_nItemTypeID = value; }
        }

        public int UnitPosition
        {
            get { return m_unitPosition; }
            set { m_unitPosition = value; }
        }

        public int DataCenterID
        {
            get { return m_nDataCenterID; }
            set { m_nDataCenterID = value; }
        }

        public int RackID
        {
            get { return m_nRackID; }
            set { m_nRackID = value; }
        }
    }

    public class RackItems
    {
        private int m_nRackID = -1;
        private List<RackItem> m_items = new List<RackItem>();

        public int RackID
        {
            get { return m_nRackID; }
            set { m_nRackID = value; }
        }

        public List<RackItem> Items
        {
            get { return m_items; }
            set { m_items = value; }
        }
    }

    public class RackItem : Item
    {
        private int m_nRackID = -1;
        private int m_nUPos = -1;

        public int RackID
        {
            get { return m_nRackID; }
            set { m_nRackID = value; }
        }

        public int UPos
        {
            get { return m_nUPos; }
            set { m_nUPos = value; }
        }

        public RackItem()
        {
        }

        public RackItem(Item item, Item_RU itemRU)
        {
            this.CenterID = item.CenterID;
            this.ChangeDate = item.ChangeDate;
            this.Cpu = item.Cpu;
            this.DiskInfo = item.DiskInfo;
            this.DiskVolume = item.DiskVolume;
            this.ID = item.ID;
            this.ItemTypeID = item.ItemTypeID;
            this.Name = item.Name;
            this.PositionInShelf = item.PositionInShelf;
            this.RackID = itemRU.RackID;
            this.Ram = item.Ram;
            this.RegDate = item.RegDate;
            this.Status = item.Status;
            this.UPos = itemRU.UPos;
            this.Usage = item.Usage;
        }
    }

    public class RequestNewRack
    {
        private int m_nDataCenterID = -1;
        private int m_nRackTypeID = -1;
        private int x = 0;
        private int y = 0;

        public int DataCenterID
        {
            get { return m_nDataCenterID; }
            set { m_nDataCenterID = value; }
        }

        public int RackTypeID
        {
            get { return m_nRackTypeID; }
            set { m_nRackTypeID = value; }
        }

        public int X
        {
            get { return x; }
            set { x = value; }
        }

        public int Y
        {
            get { return y; }
            set { y = value; }
        }
    }

    public class RequestNewRacks
    {
        private int m_nDataCenterID = -1;
        private int m_nRackTypeID = -1;
        private int m_nRackCount = 0;
        private float m_fRotation = 0;

        public int DataCenterID
        {
            get { return m_nDataCenterID; }
            set { m_nDataCenterID = value; }
        }

        public int RackTypeID
        {
            get { return m_nRackTypeID; }
            set { m_nRackTypeID = value; }
        }

        public int RackCount
        {
            get { return m_nRackCount; }
            set { m_nRackCount = value; }
        }

        public float Rotation
        {
            get { return m_fRotation; }
            set { m_fRotation = value; }
        }
    }

    public class RequestNewRackGroup
    {
        private int m_nDataCenterID = -1;

        public int DataCenterID
        {
            get { return m_nDataCenterID; }
            set { m_nDataCenterID = value; }
        }
    }

    public class RequestNewFacility
    {
        private int m_nDataCenterID = -1;
        private int m_nFacilityTypeID = -1;
        private int x = 0;
        private int y = 0;

        public int DataCenterID
        {
            get { return m_nDataCenterID; }
            set { m_nDataCenterID = value; }
        }

        public int FacilityTypeID
        {
            get { return m_nFacilityTypeID; }
            set { m_nFacilityTypeID = value; }
        }

        public int X
        {
            get { return x; }
            set { x = value; }
        }

        public int Y
        {
            get { return y; }
            set { y = value; }
        }
    }

    public class RequestNewSensor
    {
        private int m_nDataCenterID = -1;
        private int m_nSensorTypeID = -1;
        private int x = 0;
        private int y = 0;

        public int DataCenterID
        {
            get { return m_nDataCenterID; }
            set { m_nDataCenterID = value; }
        }

        public int SensorTypeID
        {
            get { return m_nSensorTypeID; }
            set { m_nSensorTypeID = value; }
        }

        public int X
        {
            get { return x; }
            set { x = value; }
        }

        public int Y
        {
            get { return y; }
            set { y = value; }
        }
    }

    public class CheckValidItemName
    {
        private int m_nDataCenterID = -1;
        private int m_nItemID = -1;
        private string m_strItemName = "";

        public int DataCenterID
        {
            get { return m_nDataCenterID; }
            set { m_nDataCenterID = value; }
        }

        public int ItemID
        {
            get { return m_nItemID; }
            set { m_nItemID = value; }
        }

        public string ItemName
        {
            get { return m_strItemName; }
            set { m_strItemName = value; }
        }
    }
}
