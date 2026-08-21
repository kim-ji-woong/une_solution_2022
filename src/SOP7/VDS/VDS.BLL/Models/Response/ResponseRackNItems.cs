using System;
using System.Collections.Generic;
using VDS.Model;
using VDS.Model.ItemData;
using VDS.Model.Sensor;

namespace VDS.BLL.Models.Response
{
    public class ResponseRackNItems : MessageResult
    {
        private List<RackGroup> m_rackGroups = new List<RackGroup>();
        private List<Rack> m_racks = new List<Rack>();
        private List<RackType> m_rackTypes = new List<RackType>();
        private List<ItemTypeEx> m_itemTypes = new List<ItemTypeEx>();
        private List<ItemEx> m_items = new List<ItemEx>();
        private List<FacilityEx> m_facilities = new List<FacilityEx>();
        private List<SensorEx> m_sensors = new List<SensorEx>();

        public List<RackGroup> RackGroups
        {
            get { return m_rackGroups; }
            set { m_rackGroups = value; }
        }

        public List<Rack> Racks
        {
            get { return m_racks; }
            set { m_racks = value; }
        }

        public List<RackType> RackTypes
        {
            get { return m_rackTypes; }
            set { m_rackTypes = value; }
        }

        public List<ItemTypeEx> ItemTypes
        {
            get { return m_itemTypes; }
            set { m_itemTypes = value; }
        }

        public List<ItemEx> Items
        {
            get { return m_items; }
            set { m_items = value; }
        }

        public List<FacilityEx> Facilities
        {
            get { return m_facilities; }
            set { m_facilities = value; }
        }

        public List<SensorEx> Sensors
        {
            get { return m_sensors; }
            set { m_sensors = value; }
        }

        public ResponseRackNItems()
            : base()
        {
        }

        public ResponseRackNItems(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ItemTypeEx : ItemType
    {
        private Company m_company = null;
        private EquipmentType m_equipmentType = null;

        public Company Company
        {
            get { return m_company; }
            set { m_company = value; }
        }

        public EquipmentType EquipmentTypeData
        {
            get { return m_equipmentType; }
            set { m_equipmentType = value; }
        }

        public ItemTypeEx()
        {
        }

        public ItemTypeEx(ItemType item)
        {
            this.ID = item.ID;
            this.EquipmentType = item.EquipmentType;
            this.CompanyID = item.CompanyID;
            this.ModelName = item.ModelName;
            this.Type = item.Type;
            this.Height = item.Height;
            this.Width = item.Width;
            this.Depth = item.Depth;
            this.Unit = item.Unit;
            this.Shelf = item.Shelf;
            this.ImageUrl = item.ImageUrl;
            this.BackImageUrl = item.BackImageUrl;
            this.GlbUrl = item.GlbUrl;
            this.FbxUrl = item.FbxUrl;
            this.ClassName = item.ClassName;
            this.Memo = item.Memo;
            this.RegDate = item.RegDate;
            this.ChangeDate = item.ChangeDate;
        }
    }

    public class ItemEx : Item
    {
        private int m_nRackID = -1;
        private int m_nUPos = -1;
        private List<int> m_linkedItemIDs = new List<int>();

        private Backup m_backup = null;
        private Box m_box = null;
        private Etc m_etc = null;
        private Network m_network = null;
        private SanSwitch m_sanSwitch = null;
        private Security m_security = null;
        private Storage m_storage = null;

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

        public List<int> LinkedItemIDs
        {
            get { return m_linkedItemIDs; }
            set { m_linkedItemIDs = value; }
        }

        public Backup Backup
        {
            get { return m_backup; }
            set { m_backup = value; }
        }

        public Box Box
        {
            get { return m_box; }
            set { m_box = value; }
        }

        public Etc Etc
        {
            get { return m_etc; }
            set { m_etc = value; }
        }

        public Network Network
        {
            get { return m_network; }
            set { m_network = value; }
        }

        public SanSwitch SanSwitch
        {
            get { return m_sanSwitch; }
            set { m_sanSwitch = value; }
        }

        public Security Security
        {
            get { return m_security; }
            set { m_security = value; }
        }

        public Storage Storage
        {
            get { return m_storage; }
            set { m_storage = value; }
        }

        public ItemEx()
        {
        }

        public ItemEx(Item item, Item_RU itemRU)
        {
            this.ID = item.ID;
            this.Name = item.Name;
            this.CenterID = item.CenterID;
            this.ItemTypeID = item.ItemTypeID;
            this.RackID = itemRU.RackID;
            this.UPos = itemRU.UPos;
            this.Cpu = item.Cpu;
            this.Ram = item.Ram;
            this.DiskInfo = item.DiskInfo;
            this.DiskVolume = item.DiskVolume;
            this.RegDate = item.RegDate;
            this.ChangeDate = item.ChangeDate;
            this.Usage = item.Usage;
            this.PositionInShelf = item.PositionInShelf;
            this.Status = item.Status;
        }
    }

    public class RackTypeEx : RackType
    {
        private Company m_company = null;

        public Company Company
        {
            get { return m_company; }
            set { m_company = value; }
        }

        public RackTypeEx()
        {
        }

        public RackTypeEx(RackType rackType)
        {
            this.ID = rackType.ID;
            this.CompanyID = rackType.CompanyID;
            this.ModelName = rackType.ModelName;
            this.Height = rackType.Height;
            this.Width = rackType.Width;
            this.Depth = rackType.Depth;
            this.Unit = rackType.Unit;
            this.Type = rackType.Type;
            this.ColorName = rackType.ColorName;
            this.ColorEngName = rackType.ColorEngName;
            this.ImageUrl = rackType.ImageUrl;
            this.GlbUrl = rackType.GlbUrl;
            this.FbxUrl = rackType.FbxUrl;
            this.Memo = rackType.Memo;
            this.RegDate = rackType.RegDate;
            this.ChangeDate = rackType.ChangeDate;
        }
    }

    public class FacilityEx : Facility
    {
        private FacilityTypeEx m_facilityType = null;

        public FacilityTypeEx FacilityType
        {
            get { return m_facilityType; }
            set { m_facilityType = value; }
        }

        public FacilityEx()
        {
        }

        public FacilityEx(Facility facility)
        {
            this.ChangeDate = facility.ChangeDate;
            this.DataCenterID = facility.DataCenterID;
            this.FacilityTypeID = facility.FacilityTypeID;
            this.ID = facility.ID;
            this.RegDate = facility.RegDate;
            this.Rotation = facility.Rotation;
            this.X = facility.X;
            this.Y = facility.Y;
            this.Z = facility.Z;
        }
    }

    public class SensorEx : Sensor
    {
        private SensorTypeEx m_sensorType = null;
        private int? m_currentData = null;
        private string m_strStatus = "";

        public SensorTypeEx SensorType
        {
            get { return m_sensorType; }
            set { m_sensorType = value; }
        }

        public int? CurrentData
        {
            get { return m_currentData; }
            set { m_currentData = value; }
        }

        public string Status
        {
            get { return m_strStatus; }
            set { m_strStatus = value; }
        }

        public SensorEx()
        {
        }

        public SensorEx(Sensor sensor, int? data, string strStatus)
        {
            this.ChangeDate = sensor.ChangeDate;
            this.CenterID = sensor.CenterID;
            this.SensorTypeID = sensor.SensorTypeID;
            this.ID = sensor.ID;
            this.RegDate = sensor.RegDate;
            this.X = sensor.X;
            this.Y = sensor.Y;
            this.Z = sensor.Z;
            this.CurrentData = data;
            this.Description = sensor.Description;
            this.Name = sensor.Name;
            this.Status = strStatus;
        }
    }

    public class ResponseRackTypeList : MessageResult
    {
        private List<RackTypeEx> m_rackTypes = new List<RackTypeEx>();
        
        public List<RackTypeEx> RackTypes
        {
            get { return m_rackTypes; }
            set { m_rackTypes = value; }
        }

        public ResponseRackTypeList()
            : base()
        {
        }

        public ResponseRackTypeList(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseItemTypeList : MessageResult
    {
        private List<ItemTypeEx> m_itemTypes = new List<ItemTypeEx>();

        public List<ItemTypeEx> ItemTypes
        {
            get { return m_itemTypes; }
            set { m_itemTypes = value; }
        }

        public ResponseItemTypeList()
            : base()
        {
        }

        public ResponseItemTypeList(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseFacilityTypeList: MessageResult
    {
        private List<FacilityTypeEx> m_facilityTypes = new List<FacilityTypeEx>();

        public List<FacilityTypeEx> FacilityTypes
        {
            get { return m_facilityTypes; }
            set { m_facilityTypes = value; }
        }

        public ResponseFacilityTypeList()
            : base()
        {
        }

        public ResponseFacilityTypeList(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseSensorTypeList : MessageResult
    {
        private List<SensorTypeEx> m_sensorTypes = new List<SensorTypeEx>();

        public List<SensorTypeEx> SensorTypes
        {
            get { return m_sensorTypes; }
            set { m_sensorTypes = value; }
        }

        public ResponseSensorTypeList()
            : base()
        {
        }

        public ResponseSensorTypeList(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseItem : MessageResult
    {
        private ItemTypeEx m_itemType = null;
        private ItemEx m_item = null;

        public ItemTypeEx ItemType
        {
            get { return m_itemType; }
            set { m_itemType = value; }
        }

        public ItemEx Item
        {
            get { return m_item; }
            set { m_item = value; }
        }

        public ResponseItem()
            : base()
        {
        }

        public ResponseItem(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseVdcStatistics : MessageResult
    {
        public class RemainUnit : IComparable
        {
            private int m_nUnitSize = 0;
            private int m_nCount = 0;

            public int UnitSize
            {
                get { return m_nUnitSize; }
                set { m_nUnitSize = value; }
            }

            public int Count
            {
                get { return m_nCount; }
                set { m_nCount = value; }
            }

            public int CompareTo(object b)
            {
                if (this.UnitSize < ((RemainUnit)b).UnitSize)
                    return -1;
                else if (this.UnitSize > ((RemainUnit)b).UnitSize)
                    return 1;

                return 0;
            }
        }

        private int m_nTotalUsedUnitCount = 0;
        private int m_nTotalRemainUnitCount = 0;
        private int m_nServerUnitCount = 0;
        private int m_nSanSwitchUnitCount = 0;
        private int m_nStorageUnitCount = 0;
        private int m_nApplianceUnitCount = 0;
        private int m_nSecurityUnitCount = 0;
        private int m_nBackupUnitCount = 0;
        private int m_nNetworkUnitCount = 0;
        private int m_nEtcUnitCount = 0;
        private List<RemainUnit> m_remainUnits = new List<RemainUnit>();

        public int TotalUsedUnitCount
        {
            get { return m_nTotalUsedUnitCount; }
            set { m_nTotalUsedUnitCount = value; }
        }

        public int TotalRemainUnitCount
        {
            get { return m_nTotalRemainUnitCount; }
            set { m_nTotalRemainUnitCount = value; }
        }

        public int ServerUnitCount
        {
            get { return m_nServerUnitCount; }
            set { m_nServerUnitCount = value; }
        }

        public int SanSwitchUnitCount
        {
            get { return m_nSanSwitchUnitCount; }
            set { m_nSanSwitchUnitCount = value; }
        }

        public int StorageUnitCount
        {
            get { return m_nStorageUnitCount; }
            set { m_nStorageUnitCount = value; }
        }

        public int ApplianceUnitCount
        {
            get { return m_nApplianceUnitCount; }
            set { m_nApplianceUnitCount = value; }
        }

        public int SecurityUnitCount
        {
            get { return m_nSecurityUnitCount; }
            set { m_nSecurityUnitCount = value; }
        }

        public int BackupUnitCount
        {
            get { return m_nBackupUnitCount; }
            set { m_nBackupUnitCount = value; }
        }

        public int NetworkUnitCount
        {
            get { return m_nNetworkUnitCount; }
            set { m_nNetworkUnitCount = value; }
        }

        public int EtcUnitCount
        {
            get { return m_nEtcUnitCount; }
            set { m_nEtcUnitCount = value; }
        }

        public List<RemainUnit> RemainUnits
        {
            get { return m_remainUnits; }
            set { m_remainUnits = value; }
        }

        public ResponseVdcStatistics()
            : base()
        {
        }

        public ResponseVdcStatistics(bool success, string message)
            : base(success, message)
        {
        }
    }
}
